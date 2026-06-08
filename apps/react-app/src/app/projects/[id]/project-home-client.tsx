'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOpencodeClient } from '@opencode-ai/sdk/client';
import { Button, Textarea, ChatInputShell, EntityAvatar } from '@kortix/ui';
import { ArrowUp, Bot, Loader2, Building2, Globe, Search, Presentation } from 'lucide-react';
import { AppHeader } from '@/components/app-header';

const SERVER_URL = 'http://localhost:4096';
const MODEL = { providerID: 'anthropic', modelID: 'claude-3-5-sonnet-20241022' };

const STARTERS = [
  { icon: Building2, label: 'Research a competitor' },
  { icon: Globe, label: 'Build a landing page' },
  { icon: Search, label: 'Audit this codebase' },
  { icon: Presentation, label: 'Draft a project brief' },
];

export interface ProjectHomeClientProps {
  user: { id: number; email: string; name: string | null };
  projectId: string;
}

/** The `project-home.tsx` welcome screen — wallpaper + greeting + starter composer that spins up a session. */
export default function ProjectHomeClient({ user, projectId }: ProjectHomeClientProps) {
  const router = useRouter();
  const clientRef = useRef<ReturnType<typeof createOpencodeClient> | null>(null);
  const [input, setInput] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!clientRef.current) clientRef.current = createOpencodeClient({ baseUrl: SERVER_URL });

  async function startSession(prompt?: string) {
    const text = (prompt ?? input).trim();
    if (creating) return;
    setCreating(true);
    setError(null);
    try {
      const res = await clientRef.current!.session.create({ body: { title: text || 'New session' } });
      const created = ((res as any).data ?? res) as { id: string };
      if (text) {
        clientRef.current!.session
          .prompt({ path: { id: created.id }, body: { model: MODEL, parts: [{ type: 'text', text }] } })
          .catch(() => {});
      }
      router.push(`/projects/${projectId}/sessions/${created.id}`);
    } catch {
      setError(`Couldn't reach the OpenCode server at ${SERVER_URL} — make sure \`opencode serve\` is running.`);
      setCreating(false);
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppHeader user={user} breadcrumb="Project" />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(127,127,127,0.25) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 35%, black 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 35%, black 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <EntityAvatar icon={Bot} size="xl" className="shadow-sm" />
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">What are we building today?</h1>
            <p className="text-sm text-muted-foreground">Start a session and OpenCode will pick up right where you leave off.</p>
          </div>

          <div className="w-full">
            {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
            <ChatInputShell>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    startSession();
                  }
                }}
                placeholder="Describe what you want to do…"
                className="min-h-[64px] resize-none border-0 bg-transparent px-4 pt-3 text-left shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center justify-end px-3 pb-2.5">
                <Button size="icon" className="size-8 rounded-full" disabled={creating} onClick={() => startSession()}>
                  {creating ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
                </Button>
              </div>
            </ChatInputShell>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {STARTERS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => startSession(label)}
                disabled={creating}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
