'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { createOpencodeClient } from '@opencode-ai/sdk/client';
import {
  Button,
  Textarea,
  ScrollArea,
  EmptyState,
  EntityAvatar,
  UserAvatar,
  ChatBubble,
  ChatInputShell,
  Badge,
  cn,
} from '@kortix/ui';
import { Plus, Send, MessageSquare, Bot, AlertCircle, Loader2 } from 'lucide-react';
import { AppHeader } from '@/components/app-header';

const SERVER_URL = 'http://localhost:4096';
const MODEL = { providerID: 'anthropic', modelID: 'claude-3-5-sonnet-20241022' };

type SessionInfo = { id: string; title?: string };
type Part = { type: string; text?: string };
type ChatMessage = { info: { id: string; role: 'user' | 'assistant' }; parts: Part[] };

function partsText(parts: Part[]) {
  return parts
    .filter((p) => p.type === 'text' && p.text)
    .map((p) => p.text)
    .join('\n');
}

export interface OpenCodeClientProps {
  user: { id: number; email: string; name: string | null };
}

export default function OpenCodeClient({ user }: OpenCodeClientProps) {
  const clientRef = useRef<ReturnType<typeof createOpencodeClient> | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clientRef.current = createOpencodeClient({ baseUrl: SERVER_URL });
    refreshSessions();
  }, []);

  useEffect(() => {
    if (activeSessionId) loadMessages(activeSessionId);
    else setMessages([]);
  }, [activeSessionId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function refreshSessions() {
    setLoadingSessions(true);
    try {
      const list = await clientRef.current!.session.list();
      const items = (list as any).data ?? list;
      setSessions(items as SessionInfo[]);
      setConnectError(null);
      if (!activeSessionId && items?.length) setActiveSessionId(items[0].id);
    } catch (err) {
      setConnectError(`Couldn't reach the OpenCode server at ${SERVER_URL} — make sure \`opencode serve\` is running.`);
    } finally {
      setLoadingSessions(false);
    }
  }

  async function loadMessages(sessionId: string) {
    try {
      const res = await clientRef.current!.session.messages({ path: { id: sessionId } });
      const items = (res as any).data ?? res;
      setMessages(items as ChatMessage[]);
    } catch {
      setMessages([]);
    }
  }

  async function createSession() {
    try {
      const res = await clientRef.current!.session.create({ body: { title: 'New session' } });
      const session = ((res as any).data ?? res) as SessionInfo;
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(session.id);
    } catch {
      setConnectError(`Couldn't reach the OpenCode server at ${SERVER_URL} — make sure \`opencode serve\` is running.`);
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || !activeSessionId || sending) return;
    setInput('');
    setSending(true);
    setMessages((prev) => [...prev, { info: { id: `local-${Date.now()}`, role: 'user' }, parts: [{ type: 'text', text }] }]);
    try {
      await clientRef.current!.session.prompt({
        path: { id: activeSessionId },
        body: { model: MODEL, parts: [{ type: 'text', text }] },
      });
      await loadMessages(activeSessionId);
    } catch {
      setConnectError(`Couldn't reach the OpenCode server at ${SERVER_URL} — make sure \`opencode serve\` is running.`);
    } finally {
      setSending(false);
    }
  }

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppHeader user={user} breadcrumb="Chat" />
      <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* ── Session sidebar ── */}
      <div className="flex w-[260px] shrink-0 flex-col border-r border-border/60 bg-muted/[0.18]">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-3">
          <span className="text-sm font-medium text-foreground">Sessions</span>
          <Button size="icon" variant="ghost" className="size-7" onClick={createSession} title="New session">
            <Plus className="size-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-0.5 p-2">
            {loadingSessions && (
              <div className="flex items-center gap-2 px-2 py-3 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Loading sessions…
              </div>
            )}
            {!loadingSessions && sessions.length === 0 && !connectError && (
              <div className="px-2 py-3 text-xs text-muted-foreground">No sessions yet.</div>
            )}
            {sessions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSessionId(s.id)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                  s.id === activeSessionId
                    ? 'bg-primary/[0.05] border-l-2 border-l-primary text-foreground'
                    : 'border-l-2 border-l-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )}
              >
                <MessageSquare className="size-3.5 shrink-0 text-muted-foreground/60" />
                <span className="truncate">{s.title || s.id}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* ── Chat ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 items-center gap-2 border-b border-border/60 px-5">
          <span className="text-sm font-medium text-foreground">{activeSession?.title || activeSession?.id || 'Select a session'}</span>
          <Badge size="sm" variant="outline" className="font-mono">{MODEL.providerID}/{MODEL.modelID}</Badge>
        </div>

        {connectError && (
          <div className="flex items-center gap-2 border-b border-border/60 bg-destructive/[0.06] px-5 py-2.5 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {connectError}
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
          {!activeSessionId ? (
            <EmptyState
              icon={MessageSquare}
              title="No session selected"
              description="Create a new session to start chatting with your local OpenCode server."
              action={<Button onClick={createSession}>New session</Button>}
            />
          ) : messages.length === 0 ? (
            <EmptyState icon={Bot} title="Say hello" description="Send a message to kick off the conversation." />
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              {messages.map((m) => {
                const text = partsText(m.parts);
                if (!text) return null;
                return m.info.role === 'user' ? (
                  <ChatBubble key={m.info.id}>
                    <p className="whitespace-pre-wrap text-sm text-foreground">{text}</p>
                  </ChatBubble>
                ) : (
                  <div key={m.info.id} className="flex items-start gap-2.5">
                    <EntityAvatar size="sm" icon={Bot} className="mt-0.5 shrink-0" />
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{text}</p>
                  </div>
                );
              })}
              {sending && (
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <EntityAvatar size="sm" icon={Bot} className="shrink-0" />
                  <span className="inline-flex items-center gap-1.5"><Loader2 className="size-3.5 animate-spin" />Thinking…</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-border/60 px-5 py-4">
          <div className="mx-auto max-w-3xl">
            <ChatInputShell>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={activeSessionId ? 'Message OpenCode…' : 'Create a session to start chatting'}
                disabled={!activeSessionId}
                className="min-h-[52px] resize-none border-0 bg-transparent px-4 pt-3 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center justify-between px-3 pb-2.5">
                <UserAvatar size="sm" />
                <Button size="icon" className="size-8 rounded-full" disabled={!input.trim() || !activeSessionId || sending} onClick={send}>
                  <Send className="size-4" />
                </Button>
              </div>
            </ChatInputShell>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
