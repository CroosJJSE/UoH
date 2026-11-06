import { User } from 'firebase/auth';
import { AccountStatus } from '../types';
import { resendVerification, signOut } from '../services/auth';
import { useState } from 'react';
import { toUserMessage } from '../lib/errors';
import { Sparkles } from 'lucide-react';

interface AccessGateProps {
  title: string;
  body: string;
  firebaseUser?: User | null;
  status?: AccountStatus;
  onEnterDemo?: () => void;
}

export function AccessGate({ title, body, firebaseUser, status, onEnterDemo }: AccessGateProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
