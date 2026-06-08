'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  EntityAvatar,
  EmptyState,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  cn,
} from '@kortix/ui';
import { Search, Plus, MoreHorizontal, Trash2, FolderPlus } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { ProjectCreateModal } from '@/components/project-create-modal';

interface Project {
  id: string;
  name: string;
  updatedAt: number;
}

const SEED_PROJECTS: Project[] = [
  { id: 'p1', name: 'Retry logic refactor', updatedAt: Date.now() - 1000 * 60 * 12 },
  { id: 'p2', name: 'Marketing site redesign', updatedAt: Date.now() - 1000 * 60 * 60 * 4 },
  { id: 'p3', name: 'Onboarding flow audit', updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2 },
  { id: 'p4', name: 'Q3 release notes', updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 9 },
];

function relativeTime(ts: number) {
  const minutes = Math.floor((Date.now() - ts) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function ProjectCard({ project, onOpen, onArchive }: { project: Project; onOpen: () => void; onArchive: () => void }) {
  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-lg border border-border/60 bg-card',
        'transition-all duration-150 hover:border-foreground/30 hover:bg-muted/30 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.18)]',
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-1 cursor-pointer flex-col items-start gap-4 rounded-lg p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="flex w-full items-center gap-3">
          <EntityAvatar label={project.name} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold leading-tight text-foreground">{project.name}</h3>
            <p className="mt-1 truncate text-xs text-muted-foreground">Updated {relativeTime(project.updatedAt)}</p>
          </div>
        </div>
      </button>
      <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-background/80 text-muted-foreground backdrop-blur hover:bg-background hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
              aria-label="Project actions"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onSelect={onOpen}>Open project</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onArchive} className="gap-2 text-muted-foreground focus:text-foreground">
              <Trash2 className="h-3.5 w-3.5" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export interface ProjectsClientProps {
  user: { id: number; email: string; name: string | null };
}

export default function ProjectsClient({ user }: ProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(
    () => projects.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())),
    [projects, query],
  );

  function openProject(id: string) {
    router.push(`/projects/${id}`);
  }

  function createProject(name: string) {
    const project: Project = { id: `p${Date.now()}`, name, updatedAt: Date.now() };
    setProjects((prev) => [project, ...prev]);
    router.push(`/projects/${project.id}`);
  }

  function archiveProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader user={user} breadcrumb="Projects" />
      <main className="flex-1 px-4 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
              <p className="text-sm text-muted-foreground">Pick up where you left off, or start something new.</p>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects"
                  className="h-9 pl-9 text-sm"
                />
              </div>
              <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
                <Plus className="size-4" />
                New project
              </Button>
            </div>
          </div>

          {projects.length === 0 ? (
            <EmptyState
              icon={FolderPlus}
              title="No projects yet"
              description="Create your first project to start chatting with your local OpenCode server."
              action={<Button onClick={() => setCreateOpen(true)}>New project</Button>}
            />
          ) : filtered.length === 0 ? (
            <EmptyState icon={Search} title={`No matches for "${query}"`} description="Try a different search term." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => openProject(project.id)}
                  onArchive={() => archiveProject(project.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <ProjectCreateModal open={createOpen} onOpenChange={setCreateOpen} onCreate={createProject} />
    </div>
  );
}
