'use client';

import * as React from 'react';
import { Scissors, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Badge, type badgeVariants } from './badge';
import type { VariantProps } from 'class-variance-authority';

export interface ContextEventStat {
  label: string;
  variant?: VariantProps<typeof badgeVariants>['variant'];
}

export interface ContextEventCardProps {
  /** e.g. "Context Pruned", "Context Compressed" */
  label: string;
  stats?: ContextEventStat[];
  className?: string;
  /** Expandable details — pruned items, distilled summary, etc. */
  children?: React.ReactNode;
}

/** Card for context-management events — header with a stat-badge cluster, expandable details. */
function ContextEventCard({ label, stats = [], className, children }: ContextEventCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const hasDetails = !!children;

  return (
    <div className={cn('rounded-2xl border border-border/60 bg-card/50 overflow-hidden', className)}>
      <Button
        type="button"
        onClick={() => hasDetails && setExpanded((v) => !v)}
        variant="ghost"
        className={cn(
          'flex items-center gap-2 w-full px-3 py-2 h-auto border-b border-border/40 bg-muted/30 rounded-none justify-start',
          !hasDetails && 'pointer-events-none',
        )}
      >
        <Scissors className="size-3.5 text-muted-foreground/70 flex-shrink-0" />
        <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          {stats.map((s, i) => (
            <Badge key={i} variant={s.variant ?? 'secondary'} size="sm">
              {s.label}
            </Badge>
          ))}
          {hasDetails && (
            <ChevronDown
              className={cn('size-3 text-muted-foreground/50 transition-transform', expanded && 'rotate-180')}
            />
          )}
        </div>
      </Button>
      {expanded && hasDetails && (
        <div className="px-3 py-2 space-y-2 text-xs text-muted-foreground/80">{children}</div>
      )}
    </div>
  );
}

export { ContextEventCard };
