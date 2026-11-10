import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CommunityMember, UserRole } from '../types';
import { toUserMessage } from '../lib/errors';
import { isMaster, listAdminDirectory, listPendingAccounts, setMemberAccess } from '../services/users';

interface AdminPanelProps {
  currentUser: CommunityMember;
}

export function AdminPanel({ currentUser }: AdminPanelProps) {
  const [pending, setPending] = useState<Array<{ uid: string; email: string; name: string; avatar: string; role: UserRole; status: 'pending' }>>([]);
  const [directory, setDirectory] = useState<Array<{ uid: string; email: string; name: string; role: UserRole; status: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);

  const load = async () => {
    try {
      const nextPending = await listPendingAccounts();
      setPending(nextPending.map((item) => ({ ...item, status: 'pending' as const })));
      if (isMaster(currentUser)) {
        setDirectory(await listAdminDirectory());
      }
      setError(null);
    } catch (err) {
      setError(toUserMessage(err));
    }
  };

  useEffect(() => {
    void load();
  }, [currentUser.id]);

  const changeAccess = async (uid: string, status: 'approved' | 'rejected' | 'suspended' | 'pending', role: UserRole) => {
    setBusyId(uid);
    try {
      await setMemberAccess(uid, { status, role });
      await load();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 p-5 rounded-2xl bg-[#181714] border border-[#2E2A25]">
      <div>
        <h3 className="font-editorial text-2xl text-[#F5EFE3]">Steward desk</h3>
        <p className="text-xs text-[#A8A196] mt-1">
          Approve new fellows, suspend accounts, and — for the master steward — appoint or remove admins. Master admin
          status cannot be changed from this screen.
        </p>
      </div>

      {error && <p className="text-xs text-[#ffb4ab]">{error}</p>}

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E8B45A] mb-3">Pending requests</h4>
        {pending.length === 0 ? (
          <p className="text-xs text-[#6E675D]">No one is waiting.</p>
        ) : (
          <div className="space-y-2">
            {pending.map((person) => (
              <div key={person.uid} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#22201D] border border-[#2E2A25]">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={person.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm text-[#F5EFE3] truncate">{person.name}</p>
                    <p className="text-xs text-[#A8A196] truncate">{person.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={busyId === person.uid}
                    onClick={() => void changeAccess(person.uid, 'approved', 'MEMBER')}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold text-[#111210] bg-[#E8B45A] cursor-pointer disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busyId === person.uid}
                    onClick={() => void changeAccess(person.uid, 'rejected', 'MEMBER')}
                    className="px-3 py-1.5 rounded-md text-xs text-[#ffb4ab] border border-[#2E2A25] cursor-pointer disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isMaster(currentUser) && (
        <div>
          <button
            type="button"
            onClick={() => setAppointmentsOpen((open) => !open)}
            aria-expanded={appointmentsOpen}
            className="flex w-full items-center justify-between gap-2"
          >
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E8B45A]">Admin appointments</h4>
            <ChevronDown
              className={`h-4 w-4 text-[#E8B45A] transition-transform ${appointmentsOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {appointmentsOpen && (
          <div className="space-y-2 mt-3">
            {directory
              .filter((person) => person.uid !== currentUser.id)
              .map((person) => (
                <div key={person.uid} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#22201D] border border-[#2E2A25]">
                  <div className="min-w-0">
                    <p className="text-sm text-[#F5EFE3] truncate">{person.name}</p>
                    <p className="text-xs text-[#A8A196] truncate">
                      {person.email} · {person.role} · {person.status}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {person.role !== 'MASTER_ADMIN' && person.status === 'approved' && person.role === 'MEMBER' && (
                      <button
                        type="button"
                        disabled={busyId === person.uid}
                        onClick={() => void changeAccess(person.uid, 'approved', 'ADMIN')}
                        className="px-3 py-1.5 rounded-md text-xs text-[#E8B45A] border border-[#2E2A25] cursor-pointer"
                      >
                        Make admin
                      </button>
                    )}
                    {person.role === 'ADMIN' && (
                      <button
                        type="button"
                        disabled={busyId === person.uid}
                        onClick={() => void changeAccess(person.uid, 'approved', 'MEMBER')}
                        className="px-3 py-1.5 rounded-md text-xs text-[#A8A196] border border-[#2E2A25] cursor-pointer"
                      >
                        Remove admin
                      </button>
                    )}
                    {person.role !== 'MASTER_ADMIN' && person.status === 'approved' && (
                      <button
                        type="button"
                        disabled={busyId === person.uid}
                        onClick={() => void changeAccess(person.uid, 'suspended', person.role)}
                        className="px-3 py-1.5 rounded-md text-xs text-[#ffb4ab] cursor-pointer"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
          )}
        </div>
      )}
    </div>
  );
}
