'use client';

import * as React from 'react';
import { MessageSquare, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
import { Button } from './button';

export interface QuestionsCardItem {
  question: React.ReactNode;
  answer: string;
}

export interface QuestionsCardProps {
  items: QuestionsCardItem[];
  defaultExpanded?: boolean;
  className?: string;
}

/** Collapsible summary of answered questions — bordered card with an answered-count trigger. */
function QuestionsCard({ items, defaultExpanded = false, className }: QuestionsCardProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const answeredCount = items.filter((i) => i.answer).length;

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div className={cn('rounded-2xl border border-border/40 bg-muted/20 overflow-hidden', className)}>
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-1.5 w-full px-2.5 py-1.5 h-auto text-left rounded-none justify-start hover:bg-muted/40"
          >
            <MessageSquare className="size-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-foreground">Questions</span>
            <span className="text-xs text-muted-foreground/70">{answeredCount} answered</span>
            <ChevronDown
              className={cn('size-3 text-muted-foreground ml-auto transition-transform', expanded && 'rotate-180')}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border/30">
            {items.map((item, i) => (
              <div key={i} className="px-2.5 py-2 border-b border-border/30 last:border-b-0">
                <div className="text-xs text-muted-foreground/70 leading-relaxed">{item.question}</div>
                <div className="text-sm font-medium text-foreground mt-0.5">{item.answer || 'No answer'}</div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export { QuestionsCard };
