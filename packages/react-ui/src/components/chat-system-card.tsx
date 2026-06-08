import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ChatSystemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  label: string;
}

function ChatSystemCard({ icon: Icon, label, className, children, ...props }: ChatSystemCardProps) {
  return (
    <div className={cn('rounded-2xl border border-border/60 bg-card/50 overflow-hidden', className)} {...props}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-muted/40">
        {Icon && <Icon className="size-3.5 text-muted-foreground/70" />}
        <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">{label}</span>
      </div>
      <div className="px-4 py-3 text-sm text-muted-foreground/90 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground/90">
        {children}
      </div>
    </div>
  );
}

export { ChatSystemCard };
