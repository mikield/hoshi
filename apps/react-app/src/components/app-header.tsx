'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Button,
  UserAvatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@kortix/ui';
import { LogOut, Settings, ChevronsUpDown, Plus, Check, ArrowUpRight, CreditCard } from 'lucide-react';

/** Skewed "/" separator between breadcrumb pills — port of `app-header.tsx`'s `BreadcrumbDivider`. */
function BreadcrumbDivider() {
  return (
    <span aria-hidden className="select-none px-0.5 text-sm font-light text-muted-foreground/40 transform -skew-x-12">
      /
    </span>
  );
}

export interface AppHeaderProps {
  user: { id: number; email: string; name: string | null };
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  logoHref?: string;
}

/** Logo → account pill → section breadcrumb → actions → user menu — port of `layout/app-header.tsx`. */
export function AppHeader({ user, breadcrumb, actions, logoHref = '/projects' }: AppHeaderProps) {
  const router = useRouter();
  const displayName = user.name || user.email.split('@')[0];
  const accountName = `${user.email}'s Account`;

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="kx-app-header flex shrink-0 items-center justify-between gap-3 border-b border-border/60 px-6 py-4">
      <div className="flex min-w-0 items-center gap-1">
        <Link
          href={logoHref}
          aria-label="OpenCode home"
          className="mr-1 inline-flex cursor-pointer items-center rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <span className="flex size-6 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">K</span>
        </Link>
        <BreadcrumbDivider />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex cursor-pointer select-none items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-foreground text-[10px] font-semibold text-background">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="max-w-[200px] truncate">{accountName}</span>
              <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground/60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Account</DropdownMenuLabel>
            <DropdownMenuItem className="gap-2">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-foreground text-[10px] font-semibold text-background">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="truncate">{accountName}</span>
              <Check className="ml-auto size-3.5 shrink-0 text-foreground" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-muted-foreground focus:text-foreground">
              <Settings className="size-3.5" />
              Account settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-muted-foreground focus:text-foreground">
              <ArrowUpRight className="size-3.5" />
              All accounts
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-muted-foreground focus:text-foreground">
              <Plus className="size-3.5" />
              New account
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-muted-foreground focus:text-foreground">
              <CreditCard className="size-3.5" />
              Billing
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {breadcrumb != null && (
          <>
            <BreadcrumbDivider />
            <span className="select-none px-2 text-sm font-medium text-foreground">{breadcrumb}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-sm transition-colors hover:bg-muted/60"
            >
              <UserAvatar size="sm" />
              <span className="hidden max-w-[140px] truncate text-foreground sm:inline">{displayName}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <div className="truncate text-sm font-medium text-foreground">{displayName}</div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <Settings className="size-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={logout} className="gap-2 text-muted-foreground focus:text-foreground">
              <LogOut className="size-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
