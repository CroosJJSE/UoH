import { User } from 'firebase/auth';
import { AccountStatus } from '../types';
import { resendVerification, signOut } from '../services/auth';
import { useEffect, useState } from 'react';
import { toUserMessage } from '../lib/errors';
import { Sparkles } from 'lucide-react';

const HOSTS = [
  { name: 'Subi', role: 'boy', phone: '0772415545', wa: '94772415545' },
  { name: 'Shamini', role: 'girl', phone: '0765642045', wa: '94765642045' },
] as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.48.71.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
      />
      <path
        fill="currentColor"
        d="M12.04 2C6.5 2 2.02 6.48 2.02 12.02c0 1.77.46 3.5 1.35 5.02L2 22l5.1-1.34A10 10 0 0 0 12.04 22C17.58 22 22.06 17.52 22.06 12S17.58 2 12.04 2Zm0 18.15c-1.64 0-3.25-.44-4.66-1.28l-.33-.2-3.03.8.81-2.95-.22-.34a8.13 8.13 0 0 1-1.25-4.34c0-4.5 3.66-8.16 8.16-8.16 4.5 0 8.16 3.66 8.16 8.16 0 4.5-3.66 8.16-8.16 8.16Z"
      />
    </svg>
  );
}

interface AccessGateProps {
  title: string;
  body: string;
  firebaseUser?: User | null;
  status?: AccountStatus;
  onEnterDemo?: () => void;
  onRefresh?: () => void;
}

export function AccessGate({ title, body, firebaseUser, status, onEnterDemo, onRefresh }: AccessGateProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showHosts, setShowHosts] = useState(false);

  useEffect(() => {
    if (status !== 'pending' || !onRefresh) return;
    const id = window.setInterval(() => onRefresh(), 5000);
    return () => window.clearInterval(id);
  }, [status, onRefresh]);

  const handleResend = async () => {
    if (!firebaseUser) return;
    setBusy(true);
    try {
      await resendVerification(firebaseUser);
      setMessage('Verification email sent. Check your inbox, then refresh this page.');
    } catch (error) {
      setMessage(toUserMessage(error));
    } finally {
      setBusy(false);
    }
  };

  if (status === 'pending') {
    return (
      <div className="phone-shell relative text-[#F5EFE3] overflow-hidden">
        <img
          src="/kellie.jpeg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />

        <div className="relative z-10 flex min-h-dvh flex-col justify-end px-6 pb-10 pt-8">
          <p className="font-editorial text-3xl leading-tight text-[#F5EFE3]">
            You are outside.
            <br />
            <span className="italic text-[#E8B45A]">Kellie is shouting.</span>
          </p>
          <p className="mt-3 max-w-[20rem] text-sm leading-relaxed text-[#F5EFE3]/85">
            Let Subi or Shamini know you have arrived. Dont let Kellie run outside.
          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowHosts((open) => !open)}
              aria-expanded={showHosts}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform active:scale-95"
              aria-label="Open WhatsApp contacts"
            >
              <WhatsAppIcon className="h-7 w-7" />
            </button>

            {showHosts && (
              <div className="mt-3 flex flex-col gap-2">
                {HOSTS.map((host) => (
                  <a
                    key={host.phone}
                    href={`https://wa.me/${host.wa}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-[#181714]/90 px-4 py-3 backdrop-blur-sm"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E2A25] text-xl" aria-hidden>
                      {host.role === 'boy' ? '👦' : '👧'}
                    </span>
                    <span className="min-w-0 text-left">
                      <span className="block text-sm font-semibold text-[#F5EFE3]">{host.name}</span>
                      <span className="block text-xs text-[#A8A196]">{host.phone}</span>
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-8 self-start text-xs text-[#A8A196] underline-offset-4 hover:text-[#F5EFE3] hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-shell text-[#F5EFE3] flex items-center justify-center px-5">
      <div className="w-full min-w-0 rounded-2xl bg-[#181714] p-8 text-center border border-[#2E2A25]">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#E8B45A] mb-2 block">
          University of Hathbodhiya
        </span>
        <h1 className="font-editorial text-3xl text-[#F5EFE3] mb-3">{title}</h1>
        <p className="text-sm text-[#A8A196] leading-relaxed mb-6">{body}</p>
        {status && (
          <p className="text-xs text-[#6E675D] mb-6">
            Current status: <span className="text-[#E8B45A]">{status}</span>
          </p>
        )}
        {message && <p className="text-xs text-[#E8B45A] mb-4">{message}</p>}

        <div className="flex flex-col items-center justify-center gap-3">
          {onEnterDemo && (
            <button
              type="button"
              onClick={onEnterDemo}
              className="w-full py-2.5 px-4 rounded-lg bg-[#E8B45A] hover:bg-[#D4A045] text-[#111210] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#111210]" />
              <span>Enter in Steward Dev Mode</span>
            </button>
          )}

          <div className="flex items-center gap-3 w-full justify-center">
            {firebaseUser && !firebaseUser.emailVerified && (
              <button
                type="button"
                disabled={busy}
                onClick={handleResend}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] cursor-pointer disabled:opacity-60"
              >
                Resend email
              </button>
            )}
            <button
              type="button"
              onClick={() => void signOut()}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#A8A196] hover:text-[#F5EFE3] border border-[#2E2A25] cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
