'use client';

import * as React from 'react';
import { Loader2, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';

export type ToolCallStatus = 'running' | 'completed' | 'error';

export interface ToolCallCardProps {
  icon?: React.ReactNode;
  /** Tool name, e.g. "Read", "Bash", "Edit" */
  title: string;
  /** Mono-styled argument summary, e.g. a file path or command */
  subtitle?: string;
  status?: ToolCallStatus;
  defaultOpen?: boolean;
  className?: string;
  /** Output / result content shown when expanded */
  children?: React.ReactNode;
}

/** A flat inline row for a tool invocation — matches the borderless chat tool-call style. */
function ToolCallCard({
  icon,
  title,
  subtitle,
  status = 'completed',
  defaultOpen = false,
  className,
  children,
}: ToolCallCardProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const running = status === 'running';

  const row = (
    <div
      className={cn(
        'flex items-center gap-1.5 py-0.5',
        'text-xs text-muted-foreground/70 transition-colors select-none max-w-full group',
        '[&>span:first-child>svg]:size-3.5 [&>span:first-child>svg]:text-muted-foreground/50',
        children && 'cursor-pointer',
        className,
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-xs whitespace-nowrap flex-shrink-0">{title}</span>
      {subtitle && (
        <span className="text-muted-foreground text-xs truncate font-mono min-w-0 flex-1">
          {subtitle}
        </span>
      )}
      {running && (
        <Loader2 className="size-3 animate-spin text-muted-foreground/40 flex-shrink-0" />
      )}
      {children && (
        <ChevronRight
          className={cn(
            'size-3 transition-all flex-shrink-0 text-muted-foreground/30',
            'opacity-40 group-hover:opacity-80',
            open && 'rotate-90 !opacity-100',
          )}
        />
      )}
    </div>
  );

  if (!children) return row;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>{row}</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 mb-1 px-3 py-2 text-xs font-mono text-muted-foreground/60 border border-border/40 rounded-lg bg-muted/10 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { ToolCallCard };
