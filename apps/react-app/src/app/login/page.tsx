'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, cn } from '@kortix/ui';
import { AlertCircle, Loader2 } from 'lucide-react';
import { AuthShell } from '@/components/auth-shell';

const fieldClass = 'border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/30 focus:ring-white/20';

export default function LoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'magic' | 'password'>('magic');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (method === 'magic') {
      setInfo("Magic links aren't available in this gallery build — use a password to sign in instead.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
        return;
      }
      router.push('/projects');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell
      mode="signin"
      title="Sign in to Kortix"
      description={method === 'magic' ? 'We will email you a secure sign-in link' : 'Your AI Computer'}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        {error && (
          <div className="mb-1 flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {info && (
          <div className="mb-1 flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3 text-white/70">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-sm">{info}</span>
          </div>
        )}
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={cn('text-sm', fieldClass)}
        />
        {method === 'password' && (
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={cn('text-sm', fieldClass)}
          />
        )}
        <Button type="submit" size="lg" disabled={pending} className="w-full rounded-xl text-sm">
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : method === 'magic' ? (
            'Email me a sign-in link'
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setMethod((m) => (m === 'magic' ? 'password' : 'magic'));
            setError(null);
            setInfo(null);
          }}
          className="text-xs text-white/40 underline-offset-4 transition-colors hover:text-white/70 hover:underline"
        >
          {method === 'magic' ? 'Use password instead' : 'Use email link instead'}
        </button>
      </div>
    </AuthShell>
  );
}
