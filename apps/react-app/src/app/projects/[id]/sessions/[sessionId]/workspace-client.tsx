'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createOpencodeClient } from '@opencode-ai/sdk/client';
import {
  Button,
  Textarea,
  ScrollArea,
  EmptyState,
  EntityAvatar,
  ChatBubble,
  ChatInputShell,
  ToolCallCard,
  cn,
} from '@kortix/ui';
import {
  Plus,
  Send,
  MessageSquare,
  Bot,
  AlertCircle,
  Loader2,
  ListTree,
  Globe,
  FolderOpen,
  Terminal,
  X,
  ChevronRight,
  Folder,
  FileCode,
  FileJson,
  FileText,
  Search,
  Edit3,
} from 'lucide-react';

const SERVER_URL = 'http://localhost:4096';
const MODEL = { providerID: 'anthropic', modelID: 'claude-3-5-sonnet-20241022' };

type SessionInfo = { id: string; title?: string };
type Part = { type: string; text?: string };
type ChatMessage = { info: { id: string; role: 'user' | 'assistant' }; parts: Part[] };
type PanelView = 'actions' | 'browser' | 'files' | 'terminal';

function partsText(parts: Part[]) {
  return parts.filter((p) => p.type === 'text' && p.text).map((p) => p.text).join('\n');
}

/* ───────────────────────── Project sidebar ───────────────────────── */

function ProjectSidebar({
  projectId,
  sessions,
  activeSessionId,
  loading,
  onSelect,
  onCreate,
}: {
  projectId: string;
  sessions: SessionInfo[];
  activeSessionId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex w-[260px] shrink-0 flex-col border-r border-border/60 bg-sidebar">
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <Link href="/projects" className="flex min-w-0 items-center gap-2 rounded-md transition-opacity hover:opacity-80">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">K</span>
          <EntityAvatar label={`Project ${projectId.slice(0, 6)}`} size="sm" />
          <span className="truncate text-sm font-medium text-foreground">{`Project ${projectId.slice(0, 6)}`}</span>
        </Link>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 pb-1.5 pt-1">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <ListTree className="size-3.5" />
          Sessions
        </span>
        <Button size="icon" variant="ghost" className="size-6" onClick={onCreate} title="New session">
          <Plus className="size-3.5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-0.5 p-2 pt-0">
          {loading && (
            <div className="flex items-center gap-2 px-2 py-3 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Loading…
            </div>
          )}
          {!loading && sessions.length === 0 && (
            <div className="px-2 py-3 text-xs text-muted-foreground">No sessions yet.</div>
          )}
          {sessions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
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
  );
}

/* ───────────────────────── Side panel ───────────────────────── */

const PANEL_TABS: { id: PanelView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'actions', label: 'Actions', icon: ListTree },
  { id: 'browser', label: 'Browser', icon: Globe },
  { id: 'files', label: 'Files', icon: FolderOpen },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
];

const MOCK_TOOL_CALLS = [
  { icon: Search, title: 'Grep', subtitle: 'pattern: useChatSendStore', status: 'completed' as const },
  { icon: FileText, title: 'Read', subtitle: 'src/lib/retry.ts', status: 'completed' as const },
  { icon: Edit3, title: 'Edit', subtitle: 'src/lib/retry.ts · +6 −2', status: 'running' as const },
];

function ActionsPanel() {
  return (
    <div className="flex flex-col gap-1 p-4">
      {MOCK_TOOL_CALLS.map((call, i) => (
        <ToolCallCard key={i} icon={<call.icon />} title={call.title} subtitle={call.subtitle} status={call.status}>
          {call.title === 'Grep' ? '3 matches across 2 files' : call.title === 'Read' ? '32 lines' : '+ retry attempts default to 3\n+ exponential backoff on 5xx'}
        </ToolCallCard>
      ))}
    </div>
  );
}

function BrowserPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-9 items-center gap-2 border-b border-border/50 px-3">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          <Globe className="size-3" />
          localhost:3000
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2"><Globe className="size-4" />Live preview mock</span>
      </div>
    </div>
  );
}

type TreeNode = { name: string; path?: string; children?: TreeNode[] };
const FILE_TREE: TreeNode[] = [
  { name: 'src', children: [
    { name: 'lib', children: [{ name: 'retry.ts', path: 'src/lib/retry.ts' }, { name: 'utils.ts', path: 'src/lib/utils.ts' }] },
    { name: 'index.ts', path: 'src/index.ts' },
  ]},
  { name: 'package.json', path: 'package.json' },
];

function fileIcon(name: string) {
  if (name.endsWith('.json')) return FileJson;
  return FileCode;
}

function FilesPanel() {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['src', 'src/lib']));
  const [selected, setSelected] = useState('src/lib/retry.ts');

  const toggle = (path: string) => setExpanded((prev) => {
    const next = new Set(prev);
    if (next.has(path)) next.delete(path); else next.add(path);
    return next;
  });

  const Row = ({ node, depth, dirPath = '' }: { node: TreeNode; depth: number; dirPath?: string }): React.ReactElement => {
    const isDir = !!node.children;
    const selfPath = dirPath ? `${dirPath}/${node.name}` : node.name;
    const isOpen = isDir && expanded.has(selfPath);
    const isActive = !isDir && node.path === selected;
    const Icon = isDir ? (isOpen ? FolderOpen : Folder) : fileIcon(node.name);
    return (
      <>
        <button
          type="button"
          onClick={() => (isDir ? toggle(selfPath) : node.path && setSelected(node.path))}
          className={cn(
            'flex w-full cursor-pointer items-center gap-1.5 rounded-lg py-1 pr-2 text-left text-sm transition-colors',
            isActive ? 'bg-primary/[0.07] text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
          )}
          style={{ paddingLeft: depth * 14 + 8 }}
        >
          {isDir ? <ChevronRight className={cn('size-3.5 shrink-0 text-muted-foreground/60 transition-transform', isOpen && 'rotate-90')} /> : <span className="w-3.5 shrink-0" />}
          <Icon className="size-4 shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>
        {isDir && isOpen && node.children!.map((c) => <Row key={c.name} node={c} depth={depth + 1} dirPath={selfPath} />)}
      </>
    );
  };

  return (
    <div className="grid h-full grid-cols-[180px_minmax(0,1fr)]">
      <div className="overflow-y-auto border-r border-border/60 bg-muted/[0.18] p-2">
        {FILE_TREE.map((n) => <Row key={n.name} node={n} depth={0} />)}
      </div>
      <div className="overflow-auto p-4 font-mono text-xs leading-[1.7] text-foreground/75">
        <div className="mb-2 text-muted-foreground/60">{selected}</div>
        <div>{'export function retry(fn, attempts = 3) {'}</div>
        <div className="pl-4">{'for (let i = 0; i < attempts; i++) {'}</div>
        <div className="pl-8">{'try { return fn(); }'}</div>
        <div className="pl-8">{'catch (e) { if (i === attempts - 1) throw e; }'}</div>
        <div className="pl-4">{'}'}</div>
        <div>{'}'}</div>
      </div>
    </div>
  );
}

function TerminalPanel() {
  const lines = [
    { text: '$ pnpm dev', tone: 'text-zinc-100' },
    { text: '▲ Next.js 15.5.14', tone: 'text-zinc-400' },
    { text: '- Local: http://localhost:3000', tone: 'text-zinc-400' },
    { text: '✓ Ready in 842ms', tone: 'text-emerald-400' },
    { text: '$ ', tone: 'text-zinc-100' },
  ];
  return (
    <div className="h-full overflow-y-auto bg-[#0f0f14] px-4 py-3 font-mono text-xs leading-[1.7]">
      {lines.map((l, i) => <div key={i} className={cn('whitespace-pre', l.tone)}>{l.text || ' '}</div>)}
      <span className="inline-block h-[14px] w-[7px] animate-pulse bg-zinc-100/80" />
    </div>
  );
}

function SidePanel({ view, onChangeView, onClose }: { view: PanelView; onChangeView: (v: PanelView) => void; onClose: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/50 pl-4 pr-2">
        <div role="tablist" className="flex items-center gap-5">
          {PANEL_TABS.map((tab) => {
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onChangeView(tab.id)}
                className={cn(
                  'relative flex cursor-pointer items-center gap-1.5 pb-2.5 pt-3 text-sm transition-colors',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <tab.icon className="size-3.5" />
                {tab.label}
                {active && <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-foreground/80" />}
              </button>
            );
          })}
        </div>
        <Button size="icon" variant="ghost" className="size-6" onClick={onClose} title="Close panel (Cmd+I)">
          <X className="size-3.5" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {view === 'actions' && <ActionsPanel />}
        {view === 'browser' && <BrowserPanel />}
        {view === 'files' && <FilesPanel />}
        {view === 'terminal' && <TerminalPanel />}
      </div>
    </div>
  );
}

/* ───────────────────────── Workspace ───────────────────────── */

export interface WorkspaceClientProps {
  user: { id: number; email: string; name: string | null };
  projectId: string;
  sessionId: string;
}

export default function WorkspaceClient({ projectId, sessionId }: WorkspaceClientProps) {
  const router = useRouter();
  const clientRef = useRef<ReturnType<typeof createOpencodeClient> | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [panelOpen, setPanelOpen] = useState(true);
  const [panelView, setPanelView] = useState<PanelView>('actions');
  const [splitPct, setSplitPct] = useState(52);
  const dragRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  if (!clientRef.current) clientRef.current = createOpencodeClient({ baseUrl: SERVER_URL });

  useEffect(() => {
    refreshSessions();
  }, []);

  useEffect(() => {
    loadMessages(sessionId);
  }, [sessionId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function refreshSessions() {
    setLoadingSessions(true);
    try {
      const list = await clientRef.current!.session.list();
      setSessions(((list as any).data ?? list) as SessionInfo[]);
      setConnectError(null);
    } catch {
      setConnectError(`Couldn't reach the OpenCode server at ${SERVER_URL} — make sure \`opencode serve\` is running.`);
    } finally {
      setLoadingSessions(false);
    }
  }

  async function loadMessages(id: string) {
    try {
      const res = await clientRef.current!.session.messages({ path: { id } });
      setMessages(((res as any).data ?? res) as ChatMessage[]);
    } catch {
      setMessages([]);
    }
  }

  async function createSession() {
    try {
      const res = await clientRef.current!.session.create({ body: { title: 'New session' } });
      const created = ((res as any).data ?? res) as SessionInfo;
      setSessions((prev) => [created, ...prev]);
      router.push(`/projects/${projectId}/sessions/${created.id}`);
    } catch {
      setConnectError(`Couldn't reach the OpenCode server at ${SERVER_URL} — make sure \`opencode serve\` is running.`);
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setSending(true);
    setMessages((prev) => [...prev, { info: { id: `local-${Date.now()}`, role: 'user' }, parts: [{ type: 'text', text }] }]);
    try {
      await clientRef.current!.session.prompt({ path: { id: sessionId }, body: { model: MODEL, parts: [{ type: 'text', text }] } });
      await loadMessages(sessionId);
    } catch {
      setConnectError(`Couldn't reach the OpenCode server at ${SERVER_URL} — make sure \`opencode serve\` is running.`);
    } finally {
      setSending(false);
    }
  }

  // Drag-resize the split between chat and side panel.
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!draggingRef.current || !dragRef.current) return;
      const rect = dragRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPct(Math.min(70, Math.max(30, pct)));
    }
    function onUp() {
      draggingRef.current = false;
      document.body.style.cursor = '';
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const activeSession = sessions.find((s) => s.id === sessionId);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ProjectSidebar
        projectId={projectId}
        sessions={sessions}
        activeSessionId={sessionId}
        loading={loadingSessions}
        onSelect={(id) => router.push(`/projects/${projectId}/sessions/${id}`)}
        onCreate={createSession}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:my-3 md:mr-3 md:rounded-xl md:border md:border-border/60">
        {connectError && (
          <div className="flex items-center gap-2 border-b border-border/60 bg-destructive/[0.06] px-5 py-2.5 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {connectError}
          </div>
        )}

        <div ref={dragRef} className="flex min-h-0 flex-1 overflow-hidden">
          {/* ── Chat pane ── */}
          <div className="flex min-w-0 flex-col overflow-hidden" style={{ width: panelOpen ? `${splitPct}%` : '100%' }}>
            <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border/60 px-5">
              <span className="truncate text-sm font-medium text-foreground">{activeSession?.title || activeSession?.id || sessionId}</span>
              {!panelOpen && (
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setPanelOpen(true)}>
                  <ListTree className="size-3.5" />
                  Show panel
                </Button>
              )}
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
              {messages.length === 0 ? (
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
                    placeholder="Message OpenCode…"
                    className="min-h-[52px] resize-none border-0 bg-transparent px-4 pt-3 shadow-none focus-visible:ring-0"
                  />
                  <div className="flex items-center justify-end px-3 pb-2.5">
                    <Button size="icon" className="size-8 rounded-full" disabled={!input.trim() || sending} onClick={send}>
                      <Send className="size-4" />
                    </Button>
                  </div>
                </ChatInputShell>
              </div>
            </div>
          </div>

          {/* ── Drag handle ── */}
          {panelOpen && (
            <div
              role="separator"
              aria-orientation="vertical"
              onMouseDown={() => {
                draggingRef.current = true;
                document.body.style.cursor = 'col-resize';
              }}
              className="group flex w-px shrink-0 cursor-col-resize items-center justify-center bg-border/60 hover:bg-border"
            >
              <span className="h-8 w-[3px] rounded-full bg-border/0 transition-colors group-hover:bg-foreground/20" />
            </div>
          )}

          {/* ── Side panel ── */}
          {panelOpen && (
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-l border-border/60">
              <SidePanel view={panelView} onChangeView={setPanelView} onClose={() => setPanelOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
