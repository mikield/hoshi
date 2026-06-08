'use client';

import * as React from 'react';
import { WifiOff, RefreshCw, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export type ConnectionPillStatus = 'connecting' | 'reconnecting' | 'degraded' | 'unreachable';

export interface ConnectionPillProps {
  status: ConnectionPillStatus;
  label: string;
  detail?: string;
  className?: string;
}

const STATUS_CONFIG: Record<ConnectionPillStatus, { icon: LucideIcon; pulse: boolean; iconClass: string; dotClass: string }> = {
  connecting: { icon: RefreshCw, pulse: true, iconClass: 'text-amber-500 dark:text-amber-400', dotClass: 'bg-amber-500 dark:bg-amber-400' },
  reconnecting: { icon: RefreshCw, pulse: true, iconClass: 'text-amber-500 dark:text-amber-400', dotClass: 'bg-amber-500 dark:bg-amber-400' },
  degraded: { icon: RefreshCw, pulse: false, iconClass: 'text-amber-500 dark:text-amber-400', dotClass: 'bg-amber-500 dark:bg-amber-400' },
  unreachable: { icon: WifiOff, pulse: false, iconClass: 'text-destructive/70', dotClass: 'bg-destructive/70' },
};

/** Floating pill announcing a connection hiccup (reconnecting, degraded runtime, unreachable sandbox). */
function ConnectionPill({ status, label, detail, className }: ConnectionPillProps) {
  const { icon: Icon, pulse, iconClass, dotClass } = STATUS_CONFIG[status];
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/95 backdrop-blur-sm',
        'px-3 py-1.5 shadow-lg text-xs',
        className,
      )}
    >
      <span className="relative flex size-2 flex-shrink-0">
        {pulse && (
          <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', dotClass)} />
        )}
        <span className={cn('relative inline-flex size-2 rounded-full', dotClass)} />
      </span>
      <Icon className={cn('size-3.5 flex-shrink-0', iconClass, status !== 'unreachable' && 'animate-spin [animation-duration:2s]')} />
      <span className="font-medium text-foreground">{label}</span>
      {detail && <span className="text-muted-foreground/60">{detail}</span>}
    </div>
  );
}

export { ConnectionPill };
