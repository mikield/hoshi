'use client';

import * as React from 'react';
import { Loader2, ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';

export interface GroupedActivityRowProps {
  icon: LucideIcon;
  /** e.g. "Read · 5 files", "Gathered context · 3 reads, 2 searches" */
  label: string;
  /** e.g. "3s" */
  duration?: string;
  running?: boolean;
  defaultOpen?: boolean;
  className?: string;
  /** Per-entry one-liners, revealed when expanded */
  children?: React.ReactNode;
}

/** Borderless inline row for a collapsed run of same-kind activity (tool calls, context gathering). */
function GroupedActivityRow({
  icon: Icon,
  label,
  duration,
  running = false,
  defaultOpen = false,
  className,
  children,
}: GroupedActivityRowProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const row = (
    <div
      className={cn(
        'flex items-center gap-1.5 py-0.5',
        'text-xs select-none cursor-pointer text-muted-foreground/70',
        'transition-colors max-w-full group/grp',
        className,
      )}
    >
      <Icon className={cn('size-3.5 flex-shrink-0 text-muted-foreground/50', running && 'animate-pulse')} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {duration && (
        <span className="text-xs font-mono tabular-nums flex-shrink-0 text-muted-foreground/40">{duration}</span>
      )}
      {running && <Loader2 className="size-3 animate-spin flex-shrink-0 text-muted-foreground/40" />}
      <ChevronRight
        className={cn(
          'size-3 transition-transform flex-shrink-0 text-muted-foreground/30',
          'opacity-0 group-hover/grp:opacity-100',
          open && 'rotate-90 opacity-100',
        )}
      />
    </div>
  );

  if (!children) return row;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>{row}</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-[18px] mt-0.5 mb-1.5 pl-3 border-l border-border/30 space-y-0.5">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { GroupedActivityRow };
