'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export interface ChatMessageAction {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export interface ChatMessageActionsProps {
  actions: ChatMessageAction[];
  className?: string;
}

/** Row of icon-only ghost buttons that fades in on message hover (copy, edit & fork, fork, ...). */
function ChatMessageActions({ actions, className }: ChatMessageActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-0.5 opacity-0 group-hover/turn:opacity-100 transition-opacity duration-150',
        className,
      )}
    >
      {actions.map((action, i) => (
        <Tooltip key={i}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-xs" className="text-muted-foreground/50" onClick={action.onClick}>
              {action.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {action.label}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export { ChatMessageActions };
