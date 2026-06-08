'use client';

import * as React from 'react';
import { Brain, Loader2, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';

export interface ThinkingBlockProps {
  /** One-line preview shown collapsed, e.g. the first reasoning sentence */
  preview?: string;
  /** Shows the pulsing brain icon + spinner while actively reasoning */
  streaming?: boolean;
  defaultOpen?: boolean;
  className?: string;
  /** Full reasoning content, revealed when expanded */
  children?: React.ReactNode;
}

/** Borderless inline row for collapsed agent reasoning — matches the reasoning/"thinking" row in chat. */
function ThinkingBlock({
  preview,
  streaming = false,
  defaultOpen = false,
  className,
  children,
}: ThinkingBlockProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const row = (
    <div
      className={cn(
        'flex items-center gap-1.5 py-0.5',
        'text-xs select-none cursor-pointer text-muted-foreground/70',
        'transition-colors max-w-full group/reasoning',
        className,
      )}
    >
      <Brain
        className={cn(
          'size-3.5 flex-shrink-0 text-muted-foreground/50',
          streaming && 'animate-pulse',
        )}
      />
      <span className="min-w-0 flex-1 truncate">{preview || 'Thinking'}</span>
      {streaming && (
        <Loader2 className="size-3 animate-spin flex-shrink-0 text-muted-foreground/40" />
      )}
      <ChevronRight
        className={cn(
          'size-3 transition-transform flex-shrink-0 text-muted-foreground/30',
          'opacity-0 group-hover/reasoning:opacity-100',
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
        <div className="ml-[18px] mt-0.5 mb-1.5 pl-3 border-l border-border/30">
          <div className="space-y-2 text-xs leading-[1.5] text-muted-foreground/50 italic">
            {children}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { ThinkingBlock };
