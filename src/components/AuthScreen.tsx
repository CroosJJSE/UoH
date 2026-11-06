import { FormEvent, useState } from 'react';
import { toUserMessage } from '../lib/errors';
import { registerWithEmail, signInWithEmail, signInWithGoogle } from '../services/auth';

type Mode = 'signin' | 'register';

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        if (!name.trim()) {
          throw new Error('Please enter your name.');
        }
        await registerWithEmail(email, password, name);
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
    <div className="phone-shell relative text-[#F5EFE3] overflow-x-hidden overflow-y-auto min-h-dvh">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/login.jpeg"
          alt=""
          className="h-full w-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111210]/70 via-[#111210]/80 to-[#111210]/95" />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 w-full min-w-0 px-5 pt-16 pb-10 flex flex-col justify-end min-h-dvh">
        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#E8B45A] mb-2 block">
            Open-Source Community Sanctuary
          </span>
          <h1 className="font-editorial italic text-[28px] leading-9 text-[#F5EFE3] font-normal tracking-tight">
            University of Hathbodhiya
          </h1>
          <p className="text-sm text-[#A8A196] mt-3 leading-relaxed">
            Sign in to request fellowship access. New members wait for a steward to welcome them before the archive opens.
          </p>
        </div>

        <div className="rounded-2xl bg-[#181714]/80 backdrop-blur-md border border-[#2E2A25] p-5 space-y-5">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#22201D]/90 border border-[#2E2A25] hover:border-[#E8B45A]/50 text-sm text-[#F5EFE3] transition-colors cursor-pointer disabled:opacity-60"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-[11px] text-[#6E675D]">
            <div className="flex-1 h-px bg-[#2E2A25]" />
            <span>or email</span>
            <div className="flex-1 h-px bg-[#2E2A25]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <input
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-sm text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-sm text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 rounded-lg bg-[#22201D] border border-[#2E2A25] text-sm text-[#F5EFE3] focus:border-[#E8B45A] focus:outline-none"
            />

            {error && <p className="text-xs text-[#ffb4ab]">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-[#111210] bg-[#E8B45A] hover:bg-[#D4A045] transition-colors cursor-pointer disabled:opacity-60"
            >
              {busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
            className="w-full text-xs text-[#A8A196] hover:text-[#E8B45A] cursor-pointer"
          >
            {mode === 'signin' ? 'Need an account? Register' : 'Already registered? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
