'use client';

import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Dialog, DialogContent } from './dialog';

export interface SettingsGroup {
  label: string;
  items: { id: string; label: string; icon: LucideIcon }[];
}

export interface SettingsShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: SettingsGroup[];
  active: string;
  onActiveChange: (id: string) => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

/** Generic settings dialog shell — grouped sidebar nav + scrollable content pane. Compose with mocked or real section content. */
function SettingsShell({
  open,
  onOpenChange,
  groups,
  active,
  onActiveChange,
  title = 'Settings',
  children,
  className,
}: SettingsShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('flex flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl h-[32rem]', className)}>
        <div className="flex min-h-0 flex-1">
          <nav className="w-56 flex-shrink-0 border-r border-border/60 bg-muted/20 p-3 overflow-y-auto">
            <div className="px-2 pb-2 text-sm font-semibold text-foreground">{title}</div>
            <div className="space-y-4">
              {groups.map((group) => (
                <div key={group.label}>
                  <div className="px-2 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    {group.label}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.id === active;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onActiveChange(item.id)}
                          className={cn(
                            'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors text-left',
                            isActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
                          )}
                        >
                          <Icon className="size-4 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { SettingsShell };
