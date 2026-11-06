import { FormEvent, useState } from 'react';
import { toUserMessage } from '../lib/errors';
import { registerWithEmail, signInWithEmail, signInWithGoogle } from '../services/auth';
import { Sparkles } from 'lucide-react';

type Mode = 'signin' | 'register';

interface AuthScreenProps {
  onEnterDemo?: () => void;
}

export function AuthScreen({ onEnterDemo }: AuthScreenProps) {
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

      <div className="relative z-10 w-full min-w-0 px-5 pt-12 pb-10 flex flex-col justify-end min-h-dvh">
        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#E8B45A] mb-2 block">
Who is suffering by whom ? Us or them ?          </span>
          <h1 className="font-editorial italic text-[28px] leading-9 text-[#F5EFE3] font-normal tracking-tight">
            University of Hathbodhiya
          </h1>
          <p className="text-sm text-[#A8A196] mt-2 leading-relaxed">
I am sure you will forget your email password, so lets go with Gmail Login          </p>
        </div>

        <div className="rounded-2xl bg-[#181714]/85 backdrop-blur-md border border-[#2E2A25] p-5 space-y-4 shadow-xl">


          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#22201D]/90 border border-[#2E2A25] hover:border-[#E8B45A]/50 text-sm text-[#F5EFE3] transition-colors cursor-pointer disabled:opacity-60"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
