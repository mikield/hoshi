import * as React from 'react';
import { cn } from '../lib/utils';

export interface ChatInputShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Highlight the border, e.g. while a file is dragged over the composer */
  active?: boolean;
}

/** The chat composer surface — large rounded card that frames the textarea + toolbar. */
function ChatInputShell({ active, className, children, ...props }: ChatInputShellProps) {
  return (
    <div
      className={cn(
        'w-full bg-card border border-border rounded-[24px] overflow-visible relative transition-colors',
        active && 'border-primary',
        className,
      )}
      {...props}
    >
      <div className="relative flex flex-col w-full gap-2 overflow-visible">{children}</div>
    </div>
  );
}

export { ChatInputShell };
