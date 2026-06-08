import * as React from 'react';
import { cn } from '../lib/utils';

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {}

/** The user message bubble — right-aligned, asymmetric "tail" shape on a card surface. */
function ChatBubble({ className, children, ...props }: ChatBubbleProps) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className={cn(
          'flex flex-col max-w-[90%] rounded-3xl rounded-br-lg bg-card border border-border overflow-hidden px-4 py-2.5',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

/** A right-aligned card for system-style turns — channel messages, trigger events, slash commands. */
function ChatActionCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className={cn(
          'inline-flex flex-col gap-1.5 px-4 py-2.5 rounded-2xl border border-border/60 bg-muted/40 max-w-[85%]',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export { ChatBubble, ChatActionCard };
