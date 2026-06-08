'use client';

import * as React from 'react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';

export interface NotificationChipProps {
  icon: LucideIcon;
  label: React.ReactNode;
  /** Tone of the icon — neutral, warning (e.g. "stopped"), or error (e.g. "failed") */
  tone?: 'neutral' | 'warning' | 'error';
  className?: string;
  /** Field rows / body text revealed when expanded */
  children?: React.ReactNode;
}

const TONE_ICON_CLASS: Record<NonNullable<NotificationChipProps['tone']>, string> = {
  neutral: 'text-muted-foreground/50',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-destructive/50',
};

/** Small expandable pill for inline system notifications (PTY exits, agent completions, etc.). */
function NotificationChip({ icon: Icon, label, tone = 'neutral', className, children }: NotificationChipProps) {
  const [open, setOpen] = React.useState(false);
  const hasDetails = !!children;

  const trigger = (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl',
        'bg-muted/20 border border-border/40',
        'text-xs select-none max-w-full',
        hasDetails && 'cursor-pointer hover:bg-muted/40 transition-colors',
        className,
      )}
    >
      <Icon className={cn('size-3.5 flex-shrink-0', TONE_ICON_CLASS[tone])} />
      <span className="text-muted-foreground/70 truncate">{label}</span>
      {hasDetails && (
        <ChevronRight
          className={cn(
            'size-3 text-muted-foreground/30 transition-transform flex-shrink-0 ml-auto',
            open && 'rotate-90',
          )}
        />
      )}
    </div>
  );

  if (!hasDetails) return trigger;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>{trigger}</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 py-2 text-xs space-y-1 border border-t-0 border-border/40 rounded-b-lg bg-muted/10">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { NotificationChip };
