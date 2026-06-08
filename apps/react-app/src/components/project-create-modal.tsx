'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  InfoBanner,
  Label,
  Switch,
} from '@kortix/ui';
import { Github, Loader2, Plus, Sparkles } from 'lucide-react';

export interface ProjectCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => void;
}

/** "New project" dialog — port of `project-create-modal.tsx`'s managed-repo flow. */
export function ProjectCreateModal({ open, onOpenChange, onCreate }: ProjectCreateModalProps) {
  const [name, setName] = useState('');
  const [includeStarterSkills, setIncludeStarterSkills] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function resetAndClose() {
    setName('');
    setIncludeStarterSkills(true);
    setSubmitting(false);
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.replace(/[^a-zA-Z0-9._ -]+/g, '').trim();
    if (!trimmed) return;
    setSubmitting(true);
    onCreate(trimmed);
    resetAndClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? resetAndClose() : onOpenChange(o))}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border/60 px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold tracking-tight">New project</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            A dedicated space for one company, product, or idea — set up for you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-5">
            <InfoBanner tone="neutral" icon={Sparkles} title="Start fresh">
              We set up your project with starter skills, ready to use. Nothing to configure.
            </InfoBanner>

            <div className="space-y-1.5">
              <Label htmlFor="new-project-name">Project name</Label>
              <Input
                id="new-project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="my-agi-company"
                autoCapitalize="none"
                autoCorrect="off"
                className="font-mono"
                autoFocus
              />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 px-3 py-3">
              <div className="min-w-0 space-y-1">
                <Label htmlFor="starter-skills">Starter skills</Label>
                <p className="text-xs leading-5 text-muted-foreground">
                  Comes with ready-made skills for research, writing, documents, slides, data, and the web.
                </p>
              </div>
              <Switch
                id="starter-skills"
                checked={includeStarterSkills}
                onCheckedChange={setIncludeStarterSkills}
                disabled={submitting}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-fit gap-1.5 px-2 text-xs text-muted-foreground"
              disabled={submitting}
            >
              <Github className="h-3.5 w-3.5" />
              Already have code on GitHub? Import it
            </Button>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/60 bg-muted/30 px-6 py-3">
            <Button type="button" variant="ghost" onClick={resetAndClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" className="gap-1.5" disabled={submitting || !name.trim()}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
