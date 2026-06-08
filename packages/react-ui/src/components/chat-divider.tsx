import * as React from 'react';
import { cn } from '../lib/utils';

export interface ChatDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** Hairline divider with a centered muted label — used between turns for system status lines. */
function ChatDivider({ className, children, ...props }: ChatDividerProps) {
  return (
    <div className={cn('flex items-center gap-2 -my-1', className)} {...props}>
      <div className="flex-1 h-px bg-border/30" />
      {children && (
        <span className="text-xs text-muted-foreground/30 select-none whitespace-nowrap">
          {children}
        </span>
      )}
      <div className="flex-1 h-px bg-border/30" />
    </div>
  );
}

export { ChatDivider };
