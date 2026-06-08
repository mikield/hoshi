'use client';

import * as React from 'react';
import { SlidersHorizontal, X, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Dialog, DialogContent, DialogTitle } from './dialog';

export interface OverlayNavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** Render a text glyph instead of an icon (e.g. "/" for Commands). */
  glyph?: string;
}

export interface OverlayNavGroup {
  label?: string;
  items: readonly OverlayNavItem[];
}

export interface OverlayShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  groups: readonly OverlayNavGroup[];
  footerGroup?: readonly OverlayNavItem[];
  active: string;
  onActiveChange: (id: string) => void;
  children?: React.ReactNode;
  className?: string;
}

/** Full-screen "Customize"-style overlay — grouped sidebar rail + a content pane each section owns. */
function OverlayShell({
  open,
  onClose,
  title,
  subtitle,
  groups,
  footerGroup,
  active,
  onActiveChange,
  children,
  className,
}: OverlayShellProps) {
  const renderItem = (item: OverlayNavItem) => {
    const Icon = item.icon;
    const isActive = item.id === active;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onActiveChange(item.id)}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors text-left',
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
        )}
      >
        {Icon ? (
          <Icon className="size-4 flex-shrink-0" />
        ) : item.glyph ? (
          <span className="size-4 flex-shrink-0 flex items-center justify-center font-mono text-xs">{item.glyph}</span>
        ) : null}
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        hideCloseButton
        className={cn(
          'flex flex-col gap-0 overflow-hidden p-0 sm:max-w-[80vw] w-[80vw] h-[80vh]',
          className,
        )}
      >
        <DialogTitle className="sr-only">{title}{subtitle ? ` · ${subtitle}` : ''}</DialogTitle>
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{title}</span>
            {subtitle && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-muted-foreground">{subtitle}</span>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>
        <div className="flex min-h-0 flex-1">
          <nav className="w-56 flex-shrink-0 border-r border-border/60 bg-muted/10 p-3 overflow-y-auto flex flex-col">
            <div className="space-y-4 flex-1">
              {groups.map((group, i) => (
                <div key={group.label ?? i}>
                  {group.label && (
                    <div className="px-2.5 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                      {group.label}
                    </div>
                  )}
                  <div className="space-y-0.5">{group.items.map(renderItem)}</div>
                </div>
              ))}
            </div>
            {footerGroup && footerGroup.length > 0 && (
              <div className="space-y-0.5 border-t border-border/40 pt-2">{footerGroup.map(renderItem)}</div>
            )}
          </nav>
          <div className="flex-1 min-w-0 overflow-y-auto">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { OverlayShell };
