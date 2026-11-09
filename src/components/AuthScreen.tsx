import { FormEvent, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { toUserMessage } from '../lib/errors';
import { registerWithEmail, signInWithEmail, signInWithGoogle } from '../services/auth';

type Mode = 'signin' | 'register';

interface AuthScreenProps {
  onEnterDemo?: () => void;
}

export function AuthScreen({ onEnterDemo: _onEnterDemo }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);

  const handleGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'register') {
        const displayName = email.split('@')[0]?.trim() || 'Friend';
        await registerWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="phone-shell relative text-[#F5EFE3] min-h-dvh">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/login.jpeg"
          alt=""
          className="h-full w-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111210]/70 via-[#111210]/80 to-[#111210]/95" />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 w-full min-w-0 px-5 pt-12 pb-10 flex flex-col justify-end min-h-dvh">
        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#E8B45A] mb-2 block">
            Who is suffering by whom ? Us or them ?
          </span>
          <h1 className="font-editorial italic text-[28px] leading-9 text-[#F5EFE3] font-normal tracking-tight">
            University of Hathbodhiya
          </h1>
        </div>

        <div className="rounded-2xl bg-[#181714]/85 backdrop-blur-md border border-[#2E2A25] p-5 space-y-4 shadow-xl">
          <button
            type="button"
            onClick={() => void handleGoogle()}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#22201D]/90 border border-[#2E2A25] hover:border-[#E8B45A]/50 text-sm text-[#F5EFE3] transition-colors cursor-pointer disabled:opacity-60"
          >
            Continue with Google
          </button>

          {error && !emailOpen && <p className="text-xs text-[#E8B45A]">{error}</p>}

          <button
            type="button"
            disabled={busy}
            aria-expanded={emailOpen}
            onClick={() => setEmailOpen((open) => !open)}
            className="w-full flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider text-[#6E675D] hover:text-[#A8A196] cursor-pointer disabled:opacity-60"
          >
            <span className="h-px flex-1 bg-[#2E2A25]" />
            Sign in with email
            <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${emailOpen ? 'rotate-180' : ''}`} />
            <span className="h-px flex-1 bg-[#2E2A25]" />
          </button>

          {emailOpen && (
          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
            <div>
              <label className="block text-xs text-[#A8A196] mb-1" htmlFor="auth-email">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-sm text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A8A196] mb-1" htmlFor="auth-password">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-sm text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
              />
            </div>

            {error && <p className="text-xs text-[#E8B45A]">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 rounded-lg bg-[#E8B45A] hover:bg-[#D4A045] text-[#111210] font-semibold text-sm cursor-pointer disabled:opacity-60"
            >
              {busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setMode((current) => (current === 'signin' ? 'register' : 'signin'));
                setError(null);
              }}
              className="w-full text-xs text-[#A8A196] hover:text-[#F5EFE3] cursor-pointer disabled:opacity-60"
            >
              {mode === 'signin' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
