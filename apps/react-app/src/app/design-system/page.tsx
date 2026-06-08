'use client';


import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Download,
  Check,
  ImageIcon,
  Circle,
  CircleDot,
  CircleDotDashed,
  XCircle,
  Minus,
  Folder,
  File,
  SquarePen,
  ListTree,
  History,
  ClipboardCheck,
  BookOpen,
  Shield,
  FileCode,
  GitBranch,
  FileJson,
  Copy,
  X,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Info,
  TriangleAlert,
  Bold,
  Settings,
  MoreHorizontal,
  HelpCircle,
  ChevronsUpDown,
  Layers,
  MessageSquare,
  Brain,
  Scissors,
  Globe,
  ChevronLeft,
  Building2,
  Presentation,
  Scale,
  BarChart3,
  Package,
  Pencil,
  GitFork,
  StopCircle,
  Ban,
  Terminal,
  FileText,
  FileCode2,
  Paperclip,
  ArrowUp,
  Search,
  Plus,
  Trash2,
  ArrowRight,
  Mail,
  Star,
  FolderGit2,
  Users,
  Cable,
  Radio,
  Zap,
  Plug,
  Inbox,
  User,
  Palette,
  Bell,
  Keyboard,
  KeyRound,
  GitPullRequest,
  FolderOpen,
  Container,
  Volume2,
  SlidersHorizontal,
  Bot,
  Sparkles,
  Hash,
  Timer,
  Webhook,
  Archive,
  ChevronDown,
  ChevronRight,
  Eye,
  Lock,
  RotateCcw,
  Share2,
  Key,
  ExternalLink,
  ArrowLeft,
  AtSign,
  UserPlus,
  CheckCheck,
  Cpu,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@kortix/ui';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Switch,
  Toggle,
  RadioGroup,
  RadioGroupItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsListCompact,
  TabsTriggerCompact,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Separator,
  Skeleton,
  Progress,
  Slider,
  Label,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Kbd,
  KbdGroup,
  Calendar,
  ScrollArea,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  PageShell,
  Section as BrandSection,
  DefinitionList,
  DefinitionRow,
  InlineMeta,
  EmptyState,
  EntityAvatar,
  InfoBanner,
  StatusDot,
  DiffStat,
  StatusBadge,
  UserAvatar,
  List,
  ListRow,
  SectionCard,
  Tag,
  Pagination,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandDialog,
  CommandFooter,
  CommandKbd,
  CommandShortcut,
  CommandPopover,
  CommandPopoverTrigger,
  CommandPopoverContent,
  ConnectionPill,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  DataTable,
  AnimatedThinkingText,
  ThinkingBlock,
  QuestionsCard,
  ToolCallCard,
  ChatBubble,
  ChatActionCard,
  ChatSystemCard,
  ChatDivider,
  ChatInputShell,
  ChatAttachmentTile,
  ContextEventCard,
  GroupedActivityRow,
  NotificationChip,
  ChatMessageActions,
  SettingsShell,
  OverlayShell,
  type DataTableColumn,
  ConfirmDialog,
  SubmitButton,
} from '@kortix/ui';

/* ─────────────────────── Data ─────────────────────── */

const BRAND_COLORS = [
  { name: 'Black', hex: '#000000', oklch: 'oklch(0 0 0)', light: false },
  { name: 'Off-Black', hex: '#1A1A1A', oklch: 'oklch(0.145 0 0)', light: false },
  { name: 'White', hex: '#FFFFFF', oklch: 'oklch(1 0 0)', light: true },
  { name: 'Off-White', hex: '#F5F5F5', oklch: 'oklch(0.965 0 0)', light: true },
] as const;

/**
 * Core theme palette — mirrors exactly the CSS custom properties defined in
 * `:root` (light) and `.dark` in apps/web/src/app/globals.css.
 * This is the single source of truth displayed on the /brand page.
 * If you change a token in globals.css, change it here too.
 */
const CORE_PALETTE = [
  { name: 'Background',           var: '--background',           light: 'oklch(1 0 0)',             dark: 'oklch(0.145 0 0)' },
  { name: 'Foreground',           var: '--foreground',           light: 'oklch(0.145 0 0)',         dark: 'oklch(0.94 0 0)' },
  { name: 'Card',                 var: '--card',                 light: 'oklch(0.99 0 0)',          dark: 'oklch(0.21 0 0)' },
  { name: 'Card Foreground',      var: '--card-foreground',      light: 'oklch(0.145 0 0)',         dark: 'oklch(0.94 0 0)' },
  { name: 'Popover',              var: '--popover',              light: 'oklch(1 0 0)',             dark: 'oklch(0.24 0 0)' },
  { name: 'Popover Foreground',   var: '--popover-foreground',   light: 'oklch(0.145 0 0)',         dark: 'oklch(0.94 0 0)' },
  { name: 'Primary',              var: '--primary',              light: 'oklch(0.205 0 0)',         dark: 'oklch(0.94 0 0)' },
  { name: 'Primary Foreground',   var: '--primary-foreground',   light: 'oklch(0.985 0 0)',         dark: 'oklch(0.18 0 0)' },
  { name: 'Secondary',            var: '--secondary',            light: 'oklch(0.46 0 0)',          dark: 'oklch(0.55 0.01 260)' },
  { name: 'Secondary Foreground', var: '--secondary-foreground', light: 'oklch(1 0 0)',             dark: 'oklch(0.94 0 0)' },
  { name: 'Muted',                var: '--muted',                light: 'oklch(0.955 0 0)',         dark: 'oklch(0.27 0 0)' },
  { name: 'Muted Foreground',     var: '--muted-foreground',     light: 'oklch(0.45 0 0)',          dark: 'oklch(0.60 0 0)' },
  { name: 'Accent',               var: '--accent',               light: 'oklch(0.96 0 0)',          dark: 'oklch(0.25 0 0)' },
  { name: 'Accent Foreground',    var: '--accent-foreground',    light: 'oklch(0.145 0 0)',         dark: 'oklch(0.94 0 0)' },
  { name: 'Border',               var: '--border',               light: 'oklch(0.885 0 0)',         dark: 'oklch(0.30 0 0)' },
  { name: 'Input',                var: '--input',                light: 'oklch(0.905 0 0)',         dark: 'oklch(0.27 0 0)' },
  { name: 'Ring',                 var: '--ring',                 light: 'oklch(0.708 0 0)',         dark: 'oklch(0.50 0 0)' },
  { name: 'Destructive',          var: '--destructive',          light: 'oklch(0.577 0.245 27.325)', dark: 'oklch(0.396 0.141 25.723)' },
] as const;

type LogoFormat = 'svg' | 'png';

interface LogoAsset {
  id: string;
  label: string;
  variant: string;
  svgSrc: string;
  pngSrc: string;
  dark: boolean;
}

const LOGO_ASSETS: LogoAsset[] = [
  {
    id: 'brandmark-black',
    label: 'Symbol',
    variant: 'Black',
    svgSrc: '/brandkit/Logo/Brandmark/SVG/Brandmark Black.svg',
    pngSrc: '/brandkit/Logo/Brandmark/PNG/Brandmark Black.png',
    dark: false,
  },
  {
    id: 'brandmark-white',
    label: 'Symbol',
    variant: 'White',
    svgSrc: '/brandkit/Logo/Brandmark/SVG/Brandmark White.svg',
    pngSrc: '/brandkit/Logo/Brandmark/PNG/Brandmark White.png',
    dark: true,
  },
  {
    id: 'logo-black',
    label: 'Logo',
    variant: 'Black',
    svgSrc: '/brandkit/Logo/Logomark/SVG/Logomark Black.svg',
    pngSrc: '/brandkit/Logo/Logomark/PNG/Logomark Black.png',
    dark: false,
  },
  {
    id: 'logo-white',
    label: 'Logo',
    variant: 'White',
    svgSrc: '/brandkit/Logo/Logomark/SVG/Logomark White.svg',
    pngSrc: '/brandkit/Logo/Logomark/PNG/Logomark White.png',
    dark: true,
  },
];

interface SocialAsset {
  id: string;
  variant: string;
  /** Square 1:1 profile-picture style PNG — symbol centred on a solid field. */
  pngSrc: string;
  dark: boolean;
}

/** Ready-to-use social avatars: the symbol centred on a solid field, square 1:1. */
const SOCIAL_ASSETS: SocialAsset[] = [
  {
    id: 'social-black',
    variant: 'Black',
    pngSrc: '/brandkit/Profile Picture/Avatar Black.png',
    dark: true,
  },
  {
    id: 'social-white',
    variant: 'White',
    pngSrc: '/brandkit/Profile Picture/Avatar White.png',
    dark: false,
  },
];

const TYPE_SCALE = [
  { token: 'text-xs', size: '0.75rem', px: '~12px', twClass: 'text-xs', use: 'Secondary labels, tooltips, KBD' },
  { token: 'text-sm', size: '0.875rem', px: '~14px', twClass: 'text-sm', use: 'Body text, menu items' },
  { token: 'text-base', size: '1rem', px: '~16px', twClass: 'text-base', use: 'Default UI text, inputs' },
  { token: 'text-lg', size: '1.125rem', px: '~18px', twClass: 'text-lg', use: 'Section headers, dialog titles' },
  { token: 'text-xl', size: '1.25rem', px: '~20px', twClass: 'text-xl', use: 'Page section titles' },
  { token: 'text-2xl', size: '1.5rem', px: '~24px', twClass: 'text-2xl', use: 'Page titles' },
  { token: 'text-3xl', size: '1.875rem', px: '~30px', twClass: 'text-3xl', use: 'Hero subheadings' },
  { token: 'text-4xl', size: '2.25rem', px: '~36px', twClass: 'text-4xl', use: 'Display / hero headings' },
  { token: 'text-5xl', size: '3rem', px: '~48px', twClass: 'text-5xl', use: 'Marketing display' },
  { token: 'text-6xl', size: '3.75rem', px: '~60px', twClass: 'text-6xl', use: 'Large display' },
  { token: 'text-7xl', size: '4.5rem', px: '~72px', twClass: 'text-7xl', use: 'Oversized display' },
  { token: 'text-8xl', size: '6rem', px: '~96px', twClass: 'text-8xl', use: 'Hero numerals / clocks' },
] as const;

const MOTION_DURATIONS = [
  { name: 'Fast', token: '--duration-fast', ms: 100 },
  { name: 'Normal', token: '--duration-normal', ms: 150 },
  { name: 'Moderate', token: '--duration-moderate', ms: 200 },
  { name: 'Slow', token: '--duration-slow', ms: 300 },
  { name: 'Slower', token: '--duration-slower', ms: 500 },
] as const;

const EASING_CURVES = [
  { name: 'Default', token: '--ease-default', value: 'cubic-bezier(0.2, 0, 0, 1)' },
  { name: 'Ease In', token: '--ease-in', value: 'cubic-bezier(0.4, 0, 1, 1)' },
  { name: 'Ease Out', token: '--ease-out', value: 'cubic-bezier(0, 0, 0.2, 1)' },
  { name: 'Ease In-Out', token: '--ease-in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
] as const;

const SPACING_SCALE = [
  { token: '0.5', px: 2 },
  { token: '1', px: 4 },
  { token: '1.5', px: 6 },
  { token: '2', px: 8 },
  { token: '3', px: 12 },
  { token: '4', px: 16 },
  { token: '5', px: 20 },
  { token: '6', px: 24 },
  { token: '8', px: 32 },
  { token: '10', px: 40 },
  { token: '12', px: 48 },
  { token: '16', px: 64 },
] as const;

interface DemoTableRow {
  id: string;
  name: string;
  status: string;
  updated: string;
}

const DATA_TABLE_ROWS: DemoTableRow[] = [
  { id: '1', name: 'Onboarding flow', status: 'Active', updated: '2h ago' },
  { id: '2', name: 'Weekly digest', status: 'Paused', updated: '1d ago' },
  { id: '3', name: 'Lead enrichment', status: 'Active', updated: '3d ago' },
];

const DATA_TABLE_COLUMNS: DataTableColumn<DemoTableRow>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'status', header: 'Status', accessorKey: 'status' },
  { id: 'updated', header: 'Updated', accessorKey: 'updated' },
];

const TOC_SECTIONS = [
  { id: 'hero', label: 'Overview' },
  { id: 'logo', label: 'Logo' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'motion', label: 'Motion' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'components', label: 'Components', children: [
    { id: 'comp-button', label: 'Button' },
    { id: 'comp-badge', label: 'Badge' },
    { id: 'comp-card', label: 'Card' },
    { id: 'comp-input', label: 'Input' },
    { id: 'comp-textarea', label: 'Textarea' },
    { id: 'comp-select', label: 'Select' },
    { id: 'comp-checkbox', label: 'Checkbox' },
    { id: 'comp-switch', label: 'Switch' },
    { id: 'comp-toggle', label: 'Toggle' },
    { id: 'comp-radio', label: 'Radio Group' },
    { id: 'comp-tabs', label: 'Tabs' },
    { id: 'comp-dialog', label: 'Dialog' },
    { id: 'comp-sheet', label: 'Sheet' },
    { id: 'comp-dropdown', label: 'Dropdown' },
    { id: 'comp-tooltip', label: 'Tooltip' },
    { id: 'comp-popover', label: 'Popover' },
    { id: 'comp-alert', label: 'Alert' },
    { id: 'comp-alert-dialog', label: 'Alert Dialog' },
    { id: 'comp-accordion', label: 'Accordion' },
    { id: 'comp-collapsible', label: 'Collapsible' },
    { id: 'comp-separator', label: 'Separator' },
    { id: 'comp-skeleton', label: 'Skeleton' },
    { id: 'comp-progress', label: 'Progress' },
    { id: 'comp-slider', label: 'Slider' },
    { id: 'comp-label', label: 'Label' },
    { id: 'comp-breadcrumb', label: 'Breadcrumb' },
    { id: 'comp-table', label: 'Table' },
    { id: 'comp-kbd', label: 'Kbd' },
    { id: 'comp-calendar', label: 'Calendar' },
    { id: 'comp-scrollarea', label: 'Scroll Area' },
    { id: 'comp-tag', label: 'Tag' },
    { id: 'comp-pagination', label: 'Pagination' },
    { id: 'comp-command', label: 'Command' },
    { id: 'comp-drawer', label: 'Drawer' },
    { id: 'comp-context-menu', label: 'Context Menu' },
    { id: 'comp-data-table', label: 'Data Table' },
  ]},
  { id: 'chat', label: 'Chat', children: [
    { id: 'chat-thinking-text', label: 'AnimatedThinkingText' },
    { id: 'chat-thinking-block', label: 'ThinkingBlock' },
    { id: 'chat-questions-card', label: 'QuestionsCard' },
    { id: 'chat-tool-call', label: 'ToolCallCard' },
    { id: 'chat-bubble', label: 'ChatBubble' },
    { id: 'chat-system-card', label: 'ChatSystemCard' },
    { id: 'chat-divider', label: 'ChatDivider' },
    { id: 'chat-input-shell', label: 'ChatInputShell' },
    { id: 'chat-attachment-tile', label: 'ChatAttachmentTile' },
    { id: 'chat-context-event', label: 'ContextEventCard' },
    { id: 'chat-grouped-activity', label: 'GroupedActivityRow' },
    { id: 'chat-notification-chip', label: 'NotificationChip' },
    { id: 'chat-message-actions', label: 'ChatMessageActions' },
  ]},
  { id: 'page-patterns', label: 'Page Patterns', children: [
    { id: 'pat-page-header', label: 'PageHeader' },
    { id: 'pat-command-palette', label: 'CommandPalette' },
    { id: 'pat-connection-pill', label: 'ConnectionPill' },
    { id: 'pat-spotlight-card', label: 'SpotlightCard' },
    { id: 'pat-search-bar', label: 'PageSearchBar' },
    { id: 'pat-stagger', label: 'Stagger Mount' },
    { id: 'pat-settings-shell', label: 'SettingsShell' },
    { id: 'pat-overlay-shell', label: 'OverlayShell' },
    { id: 'pat-toast', label: 'Toast' },
    { id: 'pat-session-list-row', label: 'Session list row' },
    { id: 'pat-model-selector', label: 'ModelSelector' },
    { id: 'pat-shortcuts', label: 'Keyboard shortcuts' },
    { id: 'pat-provider-modal', label: 'Connect provider' },
    { id: 'pat-session-header', label: 'Session header' },
    { id: 'pat-share-dialog', label: 'Share session' },
    { id: 'pat-command-palette-nav', label: 'Command palette (submenu nav)' },
    { id: 'pat-notifications-bell', label: 'Notifications bell' },
    { id: 'pat-notifications-settings', label: 'Notification settings' },
    { id: 'pat-wallpaper-picker', label: 'Wallpaper picker' },
    { id: 'pat-agent-avatar', label: 'Agent & user avatars' },
    { id: 'pat-mention-textarea', label: 'Mention textarea' },
    { id: 'pat-status-pill', label: 'Status pill' },
    { id: 'pat-diff-view', label: 'Diff view' },
    { id: 'pat-session-sidebar', label: 'Session sidebar' },
    { id: 'pat-file-tree', label: 'File tree' },
    { id: 'pat-terminal-output', label: 'Terminal output' },
    { id: 'pat-tab-bar', label: 'Tab bar & split layout' },
    { id: 'pat-new-session', label: 'New session' },
  ]},
  { id: 'patterns', label: 'Primitives', children: [
    { id: 'pat-page-shell', label: 'PageShell' },
    { id: 'pat-section', label: 'Section' },
    { id: 'pat-section-card', label: 'SectionCard' },
    { id: 'pat-avatars', label: 'Avatars' },
    { id: 'pat-list', label: 'List & ListRow' },
    { id: 'pat-definition-list', label: 'DefinitionList' },
    { id: 'pat-inline-meta', label: 'InlineMeta' },
    { id: 'pat-empty-state', label: 'EmptyState' },
    { id: 'pat-info-banner', label: 'InfoBanner' },
    { id: 'pat-status', label: 'Status (Dot, Badge, Diff)' },
    { id: 'pat-confirm-dialog', label: 'ConfirmDialog' },
    { id: 'pat-submit-button', label: 'SubmitButton' },
  ]},
  { id: 'anti-patterns', label: 'Anti-Patterns' },
  { id: 'usage', label: 'Usage' },
] as const;

/* All section IDs flattened for intersection observer */
const ALL_SECTION_IDS = TOC_SECTIONS.flatMap((s) =>
  'children' in s && s.children
    ? [s.id, ...s.children.map((c) => c.id)]
    : [s.id]
);

/* ─────────────────── Helper Components ─────────────────── */

function Hex({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="inline-flex items-center gap-1.5 group cursor-pointer"
    >
      <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
        {value}
      </span>
      {copied ? (
        <Check className="size-2.5 text-emerald-500" />
      ) : (
        <Copy className="size-2.5 text-muted-foreground group-hover:text-muted-foreground transition-colors" />
      )}
    </button>
  );
}

function LogoCard({ asset, fmt }: { asset: LogoAsset; fmt: LogoFormat }) {
  const isWide = asset.label !== 'Symbol';
  const downloadHref = fmt === 'png' ? asset.pngSrc : asset.svgSrc;
  const downloadName = `kortix-${asset.label.toLowerCase()}-${asset.variant.toLowerCase()}.${fmt}`;

  return (
    <div className="group relative">
      <div
        className={cn(
          'aspect-[3/2] rounded-lg flex items-center justify-center transition-colors relative overflow-hidden',
          isWide ? 'px-6 py-8' : 'p-10',
          asset.dark
            ? 'bg-neutral-950 ring-1 ring-white/[0.06]'
            : 'bg-white ring-1 ring-black/[0.06]'
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.svgSrc}
          alt={`Kortix ${asset.label} ${asset.variant}`}
          className={cn(
            'object-contain',
            isWide
              ? 'max-h-8 md:max-h-10 w-full'
              : 'max-h-10 md:max-h-12 w-auto'
          )}
        />

        <a
          href={downloadHref}
          download={downloadName}
          className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/[0.04] dark:bg-white/[0.04] cursor-pointer"
        >
          <span className="flex items-center gap-1.5 text-xs font-medium bg-background ring-1 ring-border rounded-full px-3 py-1.5 shadow-sm">
            <Download className="size-3" /> {fmt.toUpperCase()}
          </span>
        </a>
      </div>

      <div className="mt-2 flex items-baseline gap-1.5 px-0.5">
        <span className="text-xs font-medium text-foreground">
          {asset.label}
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          {asset.variant}
        </span>
      </div>
    </div>
  );
}

function SocialCard({ asset }: { asset: SocialAsset }) {
  const downloadName = `kortix-avatar-${asset.variant.toLowerCase()}.png`;

  return (
    <div className="group relative">
      <div
        className={cn(
          'aspect-square rounded-lg overflow-hidden ring-1 relative',
          asset.dark ? 'ring-white/[0.06]' : 'ring-black/[0.06]'
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.pngSrc}
          alt={`Kortix avatar ${asset.variant}`}
          className="size-full object-cover"
        />

        <a
          href={asset.pngSrc}
          download={downloadName}
          className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/[0.04] dark:bg-white/[0.04] cursor-pointer"
        >
          <span className="flex items-center gap-1.5 text-xs font-medium bg-background ring-1 ring-border rounded-full px-3 py-1.5 shadow-sm">
            <Download className="size-3" /> PNG
          </span>
        </a>
      </div>

      <div className="mt-2 flex items-baseline gap-1.5 px-0.5">
        <span className="text-xs font-medium text-foreground">Avatar</span>
        <span className="text-xs font-mono text-muted-foreground">
          {asset.variant}
        </span>
      </div>
    </div>
  );
}

function FormatToggle({
  value,
  onChange,
}: {
  value: LogoFormat;
  onChange: (v: LogoFormat) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 bg-foreground/[0.05] rounded-full p-0.5">
      {(['svg', 'png'] as const).map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={cn(
            'text-xs font-mono px-3 py-1 rounded-full transition-colors cursor-pointer',
            value === f
              ? 'bg-background text-foreground shadow-sm ring-1 ring-foreground/[0.06]'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {f.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function DemoContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl ring-1 ring-border/50 bg-card/30 p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionDivider() {
  return <div className="mt-14 pt-8 border-t border-border/50" />;
}

function ComponentLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
      {children}
    </h3>
  );
}

function ComponentDesc({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
      {children}
    </p>
  );
}

/* ─── Local stand-ins for app-specific patterns not in @kortix/ui ─── */

function PageHeader({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden p-8 flex flex-col items-center text-center gap-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted border border-border/50">
        <Icon className="h-6 w-6 text-foreground" />
      </div>
      {children}
    </div>
  );
}

function SpotlightCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('relative rounded-xl transition-colors hover:bg-accent/40', className)}>
      {children}
    </div>
  );
}

function PageSearchBar({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative w-full', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 rounded-full"
      />
    </div>
  );
}

/* ─── Motion Demo ─── */

function MotionBar({
  label,
  durationMs,
  easing = 'cubic-bezier(0.2, 0, 0, 1)',
}: {
  label: string;
  durationMs: number;
  easing?: string;
}) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => setActive((p) => !p)}
        className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer w-24 shrink-0 text-left"
      >
        {label}
      </button>
      <div className="flex-1 h-7 bg-muted/30 rounded-md relative overflow-hidden">
        <div
          className="absolute top-1 bottom-1 left-1 rounded-sm bg-foreground/70"
          style={{
            width: active ? 'calc(100% - 8px)' : '24px',
            transitionProperty: 'width',
            transitionDuration: `${durationMs}ms`,
            transitionTimingFunction: easing,
          }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-14 shrink-0 text-right">
        {durationMs}ms
      </span>
    </div>
  );
}

/* ─── Anti-Pattern Code Block ─── */

function AntiPatternBlock({
  title,
  bad,
  good,
  description,
}: {
  title: string;
  bad: string;
  good: string;
  description: string;
}) {
  return (
    <div className="rounded-xl ring-1 ring-border/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-border/30">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/30">
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <X className="size-3 text-red-500" />
            <span className="text-xs uppercase tracking-widest text-red-500/70 font-medium">{"Don't"}</span>
          </div>
          <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 rounded-lg p-3 overflow-x-auto">
            {bad}
          </pre>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Check className="size-3 text-emerald-500" />
            <span className="text-xs uppercase tracking-widest text-emerald-500/70 font-medium">
              Do
            </span>
          </div>
          <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 rounded-lg p-3 overflow-x-auto">
            {good}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ─── TOC Sidebar ─── */

function TocSidebar() {
  const [activeId, setActiveId] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    for (const id of ALL_SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  /* Determine which parent section is active based on the current activeId */
  const activeParentId = TOC_SECTIONS.find((s) => {
    if (s.id === activeId) return true;
    if ('children' in s && s.children) {
      return s.children.some((c) => c.id === activeId);
    }
    return false;
  })?.id;

  return (
    <nav className="hidden lg:block sticky top-20 self-start w-48 shrink-0 pt-2">
      <ul className="space-y-0.5">
        {TOC_SECTIONS.map((s) => {
          const isParentActive = s.id === activeParentId;
          const hasChildren = 'children' in s && s.children;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={cn(
                  'text-xs block py-1 transition-colors',
                  activeId === s.id || isParentActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {s.label}
              </a>
              {hasChildren && isParentActive && (
                <ul className="ml-2.5 border-l border-border/30 pl-2.5 mt-0.5 mb-1 space-y-0">
                  {s.children.map((c) => (
                    <li key={c.id}>
                      <a
                        href={`#${c.id}`}
                        className={cn(
                          'text-xs block py-0.5 transition-colors',
                          activeId === c.id
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ───────────────────── Page ───────────────────── */

export default function BrandPage() {
  const [logoFmt, setLogoFmt] = useState<LogoFormat>('svg');
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);
  const [switchOff, setSwitchOff] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [sliderValue, setSliderValue] = useState([50]);
  const [togglePressed, setTogglePressed] = useState(true);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [paginationPage, setPaginationPage] = useState(1);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsActive, setSettingsActive] = useState('general');
  const [mockNotifyEmail, setMockNotifyEmail] = useState(true);
  const [mockNotifyPush, setMockNotifyPush] = useState(false);
  const [mockSoundOn, setMockSoundOn] = useState(true);
  const [mockTheme, setMockTheme] = useState('system');
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlaySection, setOverlaySection] = useState('agents');
  const [overlayAgent, setOverlayAgent] = useState('kortix');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState('claude-sonnet-4-6');
  const [showOlderModels, setShowOlderModels] = useState(false);
  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [providerSearch, setProviderSearch] = useState('');
  const [providerOtherOpen, setProviderOtherOpen] = useState(false);
  const [providerView, setProviderView] = useState<{ type: 'list' } | { type: 'connect'; id: string; name: string } | { type: 'custom' }>({ type: 'list' });
  const [providerAuthMethod, setProviderAuthMethod] = useState<'oauth' | 'api' | null>(null);
  const [providerApiKey, setProviderApiKey] = useState('');
  const [customProviderForm, setCustomProviderForm] = useState({ providerID: '', name: '', baseURL: '', apiKey: '', modelId: '', modelName: '' });
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareMode, setShareMode] = useState('private');
  const [headerTitle, setHeaderTitle] = useState('auth-rewrite: rotate refresh tokens');
  const [headerEditing, setHeaderEditing] = useState(false);
  const [headerDraft, setHeaderDraft] = useState(headerTitle);
  const [paletteOpen2, setPaletteOpen2] = useState(false);
  const [palettePage, setPalettePage] = useState<'root' | 'agents' | 'models'>('root');
  const [paletteQuery2, setPaletteQuery2] = useState('');
  const [notifBellOpen, setNotifBellOpen] = useState(false);
  const [notifLastSeen, setNotifLastSeen] = useState<string | null>('2026-06-06T12:00:00Z');
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifPrefs, setNotifPrefs] = useState({ onCompletion: true, onError: true, onQuestion: true, onPermission: false, onlyWhenHidden: false, playSound: true });
  const [wallpaperId, setWallpaperId] = useState('brandmark');
  const [mentionText, setMentionText] = useState('Hey @sar — can you take a look at the retry logic before we ship?');
  const [mentionMenuOpen, setMentionMenuOpen] = useState(false);
  const [taskStatus, setTaskStatus] = useState<'planned' | 'running' | 'completed'>('running');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarActiveSession, setSidebarActiveSession] = useState('s2');
  const [fileTreeSelected, setFileTreeSelected] = useState('src/lib/retry.ts');
  const [fileTreeExpanded, setFileTreeExpanded] = useState<Set<string>>(() => new Set(['src', 'src/lib', 'src/components']));
  const [demoActiveTab, setDemoActiveTab] = useState('session-layout');
  const [demoSidePanelTab, setDemoSidePanelTab] = useState<'actions' | 'browser' | 'files' | 'terminal'>('terminal');
  const [newSessionText, setNewSessionText] = useState('');
  const newSessionScrollRef = useRef<HTMLDivElement | null>(null);
  const [newSessionAtStart, setNewSessionAtStart] = useState(true);
  const [newSessionAtEnd, setNewSessionAtEnd] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 pt-24 sm:pt-32 pb-24 sm:pb-32">
        <div className="flex gap-16">
          {/* TOC sidebar — desktop only */}
          <TocSidebar />

          {/* Main content */}
          <div className="flex-1 max-w-3xl">
            {/* ═══════════════ Hero ═══════════════ */}
            <section id="hero">
              <div className="mb-3">
                  <Badge variant="outline" className="text-xs font-mono">
                    v1.0
                  </Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-5">{"Brand & Design System"}</h1>
                <p className="text-base text-muted-foreground leading-relaxed max-w-xl">{"Logo assets, color palette, typography, motion tokens, component library, and usage rules for building Kortix. The complete reference for designers and engineers."}</p>
                <div className="flex flex-wrap gap-2 mt-6">
                  <Badge variant="secondary">
                    <span className="font-mono">30+</span> Components
                  </Badge>
                  <Badge variant="secondary">
                    <span className="font-mono">7</span> Themes
                  </Badge>
                  <Badge variant="secondary">{"OKLCH Colors"}</Badge>
                  <Badge variant="secondary">{"Radix Primitives"}</Badge>
                </div>
            </section>

            {/* ═══════════════ Logo ═══════════════ */}
            <section id="logo" className="mt-14">
              <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
                    Logo
                  </h2>
                  <FormatToggle value={logoFmt} onChange={setLogoFmt} />
                </div>
                <p className="text-base text-muted-foreground leading-relaxed mb-6">{"Two forms \u2014 the symbol on its own, and the full logo. Each in black and white."}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LOGO_ASSETS.map((a) => (
                    <LogoCard key={a.id} asset={a} fmt={logoFmt} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-6">{"The symbol is derived from the letter K \u2014 connectivity and intelligence abstracted into a geometric mark. Use it as a favicon, app icon, or whenever the full wordmark isn"}{"'"}{"t practical. Never stretch, rotate, or recolor it."}</p>

                {/* Social avatars — symbol centred on a solid field, square 1:1 */}
                <div className="mt-10">
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
                    Social Avatar
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed mb-6">
                    The symbol centred on a solid field, square 1:1 — drop it straight into a profile picture or social handle. Hover to download the ready-made PNG (1000&times;1000, &lt;1&nbsp;MB).
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {SOCIAL_ASSETS.map((a) => (
                      <SocialCard key={a.id} asset={a} />
                    ))}
                  </div>
                </div>
            </section>

            {/* ═══════════════ Colors ═══════════════ */}
            <section id="colors">
              <SectionDivider />
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
                  Colors
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-6">{"Black and white is the foundation. Each UI theme pairs the neutral base with exactly one accent color. The OKLCH color space ensures perceptual uniformity across all themes."}</p>

                {/* Foundation */}
                <div className="mb-8">
                  <p className="text-xs text-muted-foreground mb-3">
                    Foundation
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {BRAND_COLORS.map((c) => (
                      <div key={c.hex}>
                        <div
                          className={cn(
                            'aspect-[4/3] rounded-lg',
                            c.light ? 'ring-1 ring-black/[0.08]' : ''
                          )}
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="mt-2 px-0.5 space-y-0.5">
                          <span className="text-xs font-medium text-foreground">
                            {c.name}
                          </span>
                          <div className="flex flex-col">
                            <Hex value={c.hex} />
                            <Hex value={c.oklch} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core palette — every token from globals.css (:root + .dark),
                    rendered with both light and dark swatches so the whole
                    theme is visible at a glance regardless of the current mode. */}
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <p className="text-xs text-muted-foreground">{"Core palette"}</p>
                    <p className="font-mono text-xs text-muted-foreground/70">{"globals.css \u00b7 :root / .dark"}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CORE_PALETTE.map((token) => (
                      <div
                        key={token.var}
                        className="rounded-lg border border-border/50 overflow-hidden"
                      >
                        <div className="grid grid-cols-2 h-14">
                          <div
                            className="relative ring-1 ring-inset ring-black/[0.06]"
                            style={{ backgroundColor: token.light }}
                          >
                            <span className="absolute bottom-1 left-2 text-xs font-mono text-black/55 uppercase tracking-widest">
                              light
                            </span>
                          </div>
                          <div
                            className="relative ring-1 ring-inset ring-white/[0.06]"
                            style={{ backgroundColor: token.dark }}
                          >
                            <span className="absolute bottom-1 left-2 text-xs font-mono text-white/55 uppercase tracking-widest">
                              dark
                            </span>
                          </div>
                        </div>
                        <div className="px-3 py-2.5 bg-background">
                          <div className="flex items-baseline justify-between gap-2 mb-1">
                            <span className="text-xs font-medium text-foreground truncate">
                              {token.name}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground shrink-0">
                              {token.var}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <Hex value={token.light} />
                            <Hex value={token.dark} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </section>

            {/* ═══════════════ Typography ═══════════════ */}
            <section id="typography">
              <SectionDivider />
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
                  Typography
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-8">{"Roobert \u2014 a geometric sans-serif. Font-medium (500) is the brand weight. Roobert Mono for code and data."}</p>

                {/* Weight showcase */}
                <div className="space-y-6">
                  {[
                    { label: 'Medium · 500', cls: 'font-medium' },
                    { label: 'Regular · 400', cls: 'font-normal' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="border-b border-border/30 pb-5"
                    >
                      <span className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">
                        {s.label}
                      </span>
                      <p
                        className={cn(
                          'text-3xl md:text-5xl tracking-tight text-foreground',
                          s.cls
                        )}
                      >{"Kortix Computer"}</p>
                    </div>
                  ))}
                </div>

                {/* Mono showcase */}
                <div className="bg-neutral-950 text-neutral-100 rounded-lg p-5 md:p-6 mt-6">
                  <span className="font-mono text-xs text-neutral-500 tracking-widest block mb-3">{"Roobert Mono"}</span>
                  <p className="font-mono text-lg md:text-2xl tracking-tight">{"const agent = new Kortix();"}</p>
                  <p className="font-mono text-xs text-neutral-600 mt-4">{"ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789"}</p>
                </div>

                {/* Type scale table */}
                <div className="mt-8">
                  <p className="text-xs text-muted-foreground mb-4">{"Type Scale"}</p>
                  <div className="space-y-0">
                    {TYPE_SCALE.map((t) => (
                      <div
                        key={t.token}
                        className="flex items-baseline gap-4 py-3 border-b border-border/20"
                      >
                        <div className="w-24 shrink-0">
                          <span className="font-mono text-xs text-muted-foreground">
                            {t.token}
                          </span>
                        </div>
                        <div className="w-16 shrink-0">
                          <span className="font-mono text-xs text-muted-foreground">
                            {t.px}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className="text-foreground font-medium truncate block"
                            style={{ fontSize: t.size }}
                          >{"The quick brown fox"}</span>
                        </div>
                        <div className="hidden sm:block shrink-0 max-w-48">
                          <span className="text-xs text-muted-foreground truncate block">
                            {t.use}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </section>

            {/* ═══════════════ Motion ═══════════════ */}
            <section id="motion">
              <SectionDivider />
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
                  Motion
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-6">{"Standardized duration and easing tokens ensure every transition feels consistent. Click the labels to trigger the animation."}</p>

                {/* Duration scale */}
                <div className="mb-8">
                  <p className="text-xs text-muted-foreground mb-4">{"Duration Scale"}</p>
                  <DemoContainer>
                    <div className="space-y-3">
                      {MOTION_DURATIONS.map((d) => (
                        <MotionBar
                          key={d.token}
                          label={d.name}
                          durationMs={d.ms}
                        />
                      ))}
                    </div>
                  </DemoContainer>
                </div>

                {/* Easing curves */}
                <div>
                  <p className="text-xs text-muted-foreground mb-4">{"Easing Curves"}</p>
                  <DemoContainer>
                    <div className="space-y-3">
                      {EASING_CURVES.map((e) => (
                        <MotionBar
                          key={e.token}
                          label={e.name}
                          durationMs={300}
                          easing={e.value}
                        />
                      ))}
                    </div>
                  </DemoContainer>
                </div>
            </section>

            {/* ═══════════════ Spacing ═══════════════ */}
            <section id="spacing">
              <SectionDivider />
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
                  Spacing
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-6">{"A consistent spacing scale based on 4px increments. Used for padding, margins, and gaps throughout the UI."}</p>

                <DemoContainer>
                  <div className="space-y-2.5">
                    {SPACING_SCALE.map((s) => (
                      <div key={s.token} className="flex items-center gap-4">
                        <span className="font-mono text-xs text-muted-foreground w-8 shrink-0 text-right">
                          {s.token}
                        </span>
                        <div
                          className="h-5 rounded-sm bg-foreground/60"
                          style={{ width: `${s.px * 3}px` }}
                        />
                        <span className="font-mono text-xs text-muted-foreground">
                          {s.px}px
                        </span>
                      </div>
                    ))}
                  </div>
                </DemoContainer>
            </section>

            {/* ═══════════════ Components ═══════════════ */}
            <section id="components">
              <SectionDivider />
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
                  Components
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-8">{"The complete component library. Each component uses a consistent API with variant and size props managed through class-variance-authority. Built on Radix UI primitives for accessibility and composability."}</p>

                {/* ─── Button ─── */}
                <div id="comp-button" className="mb-12">
                  <ComponentLabel>Button</ComponentLabel>
                  <ComponentDesc>{"10 variants \u00d7 8 sizes. The foundation of every interaction. There are only two radii: pills (buttons, badges) use"}<code className="font-mono text-xs bg-muted px-1 rounded">rounded-full</code>{"; every container (cards, dialogs, inputs, textareas, selects, info banners, alerts) uses"}<code className="font-mono text-xs bg-muted px-1 rounded">rounded-2xl</code>{". Never put"}<code className="font-mono text-xs bg-muted px-1 rounded">rounded-sm/md/lg/xl</code>{"on a box. The"}<code className="font-mono text-xs bg-muted px-1 rounded">destructive</code>{"variant is reserved for the"}<strong>{"one irreversible confirm"}</strong>{"(a ConfirmDialog's primary action, the Danger Zone) \u2014 never for routine actions like Log out or Cancel."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-6">
                      {/* Base Variants */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">{"Base Variants"}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="default">Default</Button>
                          <Button variant="secondary">Secondary</Button>
                          <Button variant="destructive">Destructive</Button>
                          <Button variant="outline">Outline</Button>
                          <Button variant="ghost">Ghost</Button>
                          <Button variant="link">Link</Button>
                        </div>
                      </div>
                      {/* Kortix Variants */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">{"Kortix Variants"}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="subtle">Subtle</Button>
                          <Button variant="muted">Muted</Button>
                          <Button variant="inverse">Inverse</Button>
                          <Button variant="success">Success</Button>
                        </div>
                      </div>
                      {/* Standard Sizes */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">{"Standard Sizes"}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button size="lg">Large</Button>
                          <Button size="default">Default</Button>
                          <Button size="sm">Small</Button>
                          <Button size="icon"><Settings className="size-4" /></Button>
                        </div>
                      </div>
                      {/* Compact Sizes */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">{"Compact Sizes"}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button size="toolbar" variant="muted">Toolbar</Button>
                          <Button size="xs" variant="muted">XSmall</Button>
                          <Button size="icon-sm" variant="ghost"><Settings className="size-3.5" /></Button>
                          <Button size="icon-xs" variant="ghost"><X className="size-3" /></Button>
                        </div>
                      </div>
                      {/* With Icons */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">{"With Icons"}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button><Mail className="size-4" />{"Send Email"}</Button>
                          <Button variant="outline"><Plus className="size-4" /> Create</Button>
                          <Button variant="subtle"><Search className="size-4" /> Search</Button>
                          <Button variant="destructive"><Trash2 className="size-4" /> Delete</Button>
                          <Button variant="inverse"><ArrowRight className="size-4" /> Launch</Button>
                          <Button variant="success" size="toolbar"><Check className="size-3.5" /> Confirm</Button>
                        </div>
                      </div>
                      {/* States */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">States</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button disabled>Disabled</Button>
                          <Button disabled variant="outline">{"Disabled Outline"}</Button>
                          <Button><Loader2 className="size-4 animate-spin" /> Loading</Button>
                        </div>
                      </div>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Badge ─── */}
                <div id="comp-badge" className="mb-12">
                  <ComponentLabel>Badge</ComponentLabel>
                  <ComponentDesc>{"Labels, status indicators, and tags. Seven variants from solid to subtle."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">{"Base Variants"}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="default">Default</Badge>
                          <Badge variant="secondary">Secondary</Badge>
                          <Badge variant="destructive">Destructive</Badge>
                          <Badge variant="outline">Outline</Badge>
                          <Badge variant="new">New</Badge>
                          <Badge variant="beta">Beta</Badge>
                          <Badge variant="highlight">Highlight</Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">{"Semantic Status"}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="success">Success</Badge>
                          <Badge variant="warning">Warning</Badge>
                          <Badge variant="info">Info</Badge>
                          <Badge variant="muted">Muted</Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Sizes</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="default">Default</Badge>
                          <Badge variant="default" size="sm">Small</Badge>
                          <Badge variant="success" size="sm">Active</Badge>
                          <Badge variant="warning" size="sm">Pending</Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">{"With Icons"}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="default"><Star className="size-3" />Featured</Badge>
                          <Badge variant="success"><Check className="size-3" />Verified</Badge>
                          <Badge variant="info"><Info className="size-3" />v2.1.0</Badge>
                          <Badge variant="warning"><AlertTriangle className="size-3" />Pending</Badge>
                        </div>
                      </div>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Card ─── */}
                <div id="comp-card" className="mb-12">
                  <ComponentLabel>Card</ComponentLabel>
                  <ComponentDesc>{"Container with header, content, and footer slots. Default and glass (translucent, no blur) variants."}</ComponentDesc>
                  <DemoContainer>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Card variant="default">
                        <CardHeader>
                          <CardTitle>{"Default Card"}</CardTitle>
                          <CardDescription>{"Standard card with solid background."}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{"Card content goes here. Use for grouping related information."}</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm">
                            Action
                          </Button>
                        </CardFooter>
                      </Card>
                      <Card variant="glass">
                        <CardHeader>
                          <CardTitle>{"Glass Card"}</CardTitle>
                          <CardDescription>{"Translucent surface for overlays and panels."}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{"Card content goes here. Used for overlays and floating panels."}</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm">
                            Action
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Input ─── */}
                <div id="comp-input" className="mb-12">
                  <ComponentLabel>Input</ComponentLabel>
                  <ComponentDesc>{"Text input for forms and search. The canonical form-control treatment \u2014 Textarea & Select inherit the same bg-card surface, accent focus ring, and rounded-2xl shape."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-4 max-w-sm">
                      <div className="space-y-2">
                        <Label htmlFor="demo-input">Label</Label>
                        <Input type="text"
                          id="demo-input"
                          placeholder={"Default input"}
                        />
                      </div>
                      <Input type="text" placeholder={"With placeholder"} />
                      <Input type="password" placeholder={"Password input"} />
                      <Input type="text" disabled placeholder="Disabled" />
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Textarea ─── */}
                <div id="comp-textarea" className="mb-12">
                  <ComponentLabel>Textarea</ComponentLabel>
                  <ComponentDesc>{"Multi-line text input for longer content. Shares one treatment with Input & Select \u2014 bg-card surface, accent focus ring, rounded-2xl, no shadow."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-4 max-w-sm">
                      <Textarea placeholder={"Write something..."} />
                      <Textarea disabled placeholder={"Disabled textarea"} />
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Select ─── */}
                <div id="comp-select" className="mb-12">
                  <ComponentLabel>Select</ComponentLabel>
                  <ComponentDesc>{"Dropdown selection from a list of options. Matches Input & Textarea \u2014 same bg-card surface, accent focus ring, and rounded-2xl shape."}</ComponentDesc>
                  <DemoContainer>
                    <div className="max-w-xs">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={"Select a framework"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="next">Next.js</SelectItem>
                          <SelectItem value="remix">Remix</SelectItem>
                          <SelectItem value="astro">Astro</SelectItem>
                          <SelectItem value="nuxt">Nuxt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Checkbox ─── */}
                <div id="comp-checkbox" className="mb-12">
                  <ComponentLabel>Checkbox</ComponentLabel>
                  <ComponentDesc>{"Toggle for boolean values."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="check-1"
                          checked={checkboxChecked}
                          onCheckedChange={(v) =>
                            setCheckboxChecked(v as boolean)
                          }
                        />
                        <Label htmlFor="check-1">Checked</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="check-2" />
                        <Label htmlFor="check-2">Unchecked</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="check-3" disabled />
                        <Label
                          htmlFor="check-3"
                          className="text-muted-foreground"
                        >
                          Disabled
                        </Label>
                      </div>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Switch ─── */}
                <div id="comp-switch" className="mb-12">
                  <ComponentLabel>Switch</ComponentLabel>
                  <ComponentDesc>{"Toggle control for on/off states."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          id="switch-on"
                          checked={switchOn}
                          onCheckedChange={setSwitchOn}
                        />
                        <Label htmlFor="switch-on">On</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          id="switch-off"
                          checked={switchOff}
                          onCheckedChange={setSwitchOff}
                        />
                        <Label htmlFor="switch-off">Off</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch id="switch-dis" disabled />
                        <Label
                          htmlFor="switch-dis"
                          className="text-muted-foreground"
                        >
                          Disabled
                        </Label>
                      </div>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Toggle ─── */}
                <div id="comp-toggle" className="mb-12">
                  <ComponentLabel>Toggle</ComponentLabel>
                  <ComponentDesc>{"A two-state button with default and outline variants."}</ComponentDesc>
                  <DemoContainer>
                    <div className="flex flex-wrap gap-2">
                      <Toggle
                        variant="default"
                        pressed={togglePressed}
                        onPressedChange={setTogglePressed}
                        aria-label={"Toggle bold"}
                      >
                        <Bold className="size-4" />
                      </Toggle>
                      <Toggle variant="outline" aria-label={"Toggle settings"}>
                        <Settings className="size-4" />
                      </Toggle>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Radio Group ─── */}
                <div id="comp-radio" className="mb-12">
                  <ComponentLabel>{"Radio Group"}</ComponentLabel>
                  <ComponentDesc>{"Single selection from a set of options."}</ComponentDesc>
                  <DemoContainer>
                    <RadioGroup defaultValue="comfortable">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="default" id="r1" />
                        <Label htmlFor="r1">Default</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="comfortable" id="r2" />
                        <Label htmlFor="r2">Comfortable</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="compact" id="r3" />
                        <Label htmlFor="r3">Compact</Label>
                      </div>
                    </RadioGroup>
                  </DemoContainer>
                </div>

                {/* ─── Tabs ─── */}
                <div id="comp-tabs" className="mb-12">
                  <ComponentLabel>Tabs</ComponentLabel>
                  <ComponentDesc>{"Tabbed navigation with standard and compact variants."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs text-muted-foreground mb-3">
                          Standard
                        </p>
                        <Tabs defaultValue="tab1">
                          <TabsList>
                            <TabsTrigger value="tab1">Account</TabsTrigger>
                            <TabsTrigger value="tab2">Password</TabsTrigger>
                            <TabsTrigger value="tab3">Settings</TabsTrigger>
                          </TabsList>
                          <TabsContent value="tab1">
                            <p className="text-sm text-muted-foreground mt-2">{"Account settings and preferences."}</p>
                          </TabsContent>
                          <TabsContent value="tab2">
                            <p className="text-sm text-muted-foreground mt-2">{"Change your password."}</p>
                          </TabsContent>
                          <TabsContent value="tab3">
                            <p className="text-sm text-muted-foreground mt-2">{"General settings."}</p>
                          </TabsContent>
                        </Tabs>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-3">
                          Compact
                        </p>
                        <Tabs defaultValue="c1">
                          <TabsListCompact>
                            <TabsTriggerCompact value="c1">
                              Day
                            </TabsTriggerCompact>
                            <TabsTriggerCompact value="c2">
                              Week
                            </TabsTriggerCompact>
                            <TabsTriggerCompact value="c3">
                              Month
                            </TabsTriggerCompact>
                          </TabsListCompact>
                          <TabsContent value="c1">
                            <p className="text-sm text-muted-foreground mt-2">{"Daily view content."}</p>
                          </TabsContent>
                          <TabsContent value="c2">
                            <p className="text-sm text-muted-foreground mt-2">{"Weekly view content."}</p>
                          </TabsContent>
                          <TabsContent value="c3">
                            <p className="text-sm text-muted-foreground mt-2">{"Monthly view content."}</p>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Dialog ─── */}
                <div id="comp-dialog" className="mb-12">
                  <ComponentLabel>Dialog</ComponentLabel>
                  <ComponentDesc>{"Modal overlay for focused interactions."}</ComponentDesc>
                  <DemoContainer>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">{"Open Dialog"}</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{"Dialog Title"}</DialogTitle>
                          <DialogDescription>{"This is a description of the dialog content. It provides context for the user."}</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-muted-foreground">{"Dialog body content goes here."}</p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>Confirm</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </DemoContainer>
                </div>

                {/* ─── Drawer (Sheet replacement) ─── */}
                <div id="comp-sheet" className="mb-12">
                  <ComponentLabel>Drawer</ComponentLabel>
                  <ComponentDesc>{"Slide-out panel from the edge of the viewport."}</ComponentDesc>
                  <DemoContainer>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="outline">{"Open Drawer"}</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>{"Drawer Title"}</DrawerTitle>
                          <DrawerDescription>{"A side panel for secondary content and actions."}</DrawerDescription>
                        </DrawerHeader>
                        <div className="py-6 px-4">
                          <p className="text-sm text-muted-foreground">{"Drawer body content."}</p>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </DemoContainer>
                </div>

                {/* ─── Dropdown Menu ─── */}
                <div id="comp-dropdown" className="mb-12">
                  <ComponentLabel>{"Dropdown Menu"}</ComponentLabel>
                  <ComponentDesc>{"Contextual menu triggered by a button. Rows stay"}{' '}
                    <strong>neutral</strong>{"\u2014 even destructive ones like Delete or Remove. Red is the brake, not the paint: it appears only on the final confirm button, never on a menu row."}</ComponentDesc>
                  <DemoContainer>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <MoreHorizontal className="size-4" />
                          Options
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DemoContainer>
                </div>

                {/* ─── Tooltip ─── */}
                <div id="comp-tooltip" className="mb-12">
                  <ComponentLabel>Tooltip</ComponentLabel>
                  <ComponentDesc>{"Contextual information on hover."}</ComponentDesc>
                  <DemoContainer>
                    <div className="flex flex-wrap gap-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon">
                              <HelpCircle className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{"This is a helpful tooltip"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Settings className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Settings</p>
                            <KbdGroup>
                              <Kbd>⌘</Kbd>
                              <Kbd>,</Kbd>
                            </KbdGroup>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Popover ─── */}
                <div id="comp-popover" className="mb-12">
                  <ComponentLabel>Popover</ComponentLabel>
                  <ComponentDesc>{"Floating content panel attached to a trigger."}</ComponentDesc>
                  <DemoContainer>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">{"Open Popover"}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">{"Popover Title"}</p>
                          <p className="text-xs text-muted-foreground">{"This is the popover content. It can contain any elements."}</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </DemoContainer>
                </div>

                {/* ─── Alert ─── */}
                <div id="comp-alert" className="mb-12">
                  <ComponentLabel>Alert</ComponentLabel>
                  <ComponentDesc>{"Inline notification with contextual variants."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-3">
                      <Alert>
                        <Info className="size-4" />
                        <AlertTitle>{"Default Alert"}</AlertTitle>
                        <AlertDescription>{"This is a default informational alert."}</AlertDescription>
                      </Alert>
                      <Alert variant="destructive">
                        <AlertCircle className="size-4" />
                        <AlertTitle>Destructive</AlertTitle>
                        <AlertDescription>{"Something went wrong. Please try again."}</AlertDescription>
                      </Alert>
                      <Alert variant="warning">
                        <TriangleAlert className="size-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>{"This action may have unintended consequences."}</AlertDescription>
                      </Alert>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Alert Dialog ─── */}
                <div id="comp-alert-dialog" className="mb-12">
                  <ComponentLabel>{"Alert Dialog"}</ComponentLabel>
                  <ComponentDesc>{"Confirmation dialog for destructive or important actions."}</ComponentDesc>
                  <DemoContainer>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">{"Delete Item"}</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{"Are you sure?"}</AlertDialogTitle>
                          <AlertDialogDescription>{"This action cannot be undone. This will permanently delete the item and remove all associated data."}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DemoContainer>
                </div>

                {/* ─── Accordion ─── */}
                <div id="comp-accordion" className="mb-12">
                  <ComponentLabel>Accordion</ComponentLabel>
                  <ComponentDesc>{"Collapsible content sections with smooth animation."}</ComponentDesc>
                  <DemoContainer>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>{"What is Kortix?"}</AccordionTrigger>
                        <AccordionContent>{"Kortix is an AI-powered platform for building and deploying intelligent agents. It provides the infrastructure, tools, and interfaces needed to create production-grade AI workflows."}</AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>{"What design system does it use?"}</AccordionTrigger>
                        <AccordionContent>{"Kortix uses a monochromatic design system with strategic accent colors, built on OKLCH color tokens, the Roobert type family, and Radix UI primitives."}</AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>{"How do themes work?"}</AccordionTrigger>
                        <AccordionContent>{"Each theme defines a single accent hue applied to primary, ring, and chart tokens. All backgrounds, surfaces, and borders remain neutral. Seven themes are available: Graphite, Teal, Amber, Rose, Violet, Emerald, and Neon."}</AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </DemoContainer>
                </div>

                {/* ─── Collapsible ─── */}
                <div id="comp-collapsible" className="mb-12">
                  <ComponentLabel>Collapsible</ComponentLabel>
                  <ComponentDesc>{"A simpler expand/collapse primitive. Unlike Accordion, it controls a single section without exclusive selection."}</ComponentDesc>
                  <DemoContainer>
                    <Collapsible
                      open={collapsibleOpen}
                      onOpenChange={setCollapsibleOpen}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{"3 tagged items"}</span>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronsUpDown className="size-4" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <div className="rounded-2xl border border-border/50 px-4 py-2 mt-2 text-sm">{"@kortix/design-system"}</div>
                      <CollapsibleContent className="mt-2 space-y-2">
                        <div className="rounded-2xl border border-border/50 px-4 py-2 text-sm">{"@kortix/components"}</div>
                        <div className="rounded-2xl border border-border/50 px-4 py-2 text-sm">{"@kortix/tokens"}</div>
                      </CollapsibleContent>
                    </Collapsible>
                  </DemoContainer>
                </div>

                {/* ─── Separator ─── */}
                <div id="comp-separator" className="mb-12">
                  <ComponentLabel>Separator</ComponentLabel>
                  <ComponentDesc>{"Visual divider between content sections."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{"Content above"}</p>
                      <Separator />
                      <p className="text-sm text-muted-foreground">{"Content below"}</p>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Skeleton ─── */}
                <div id="comp-skeleton" className="mb-12">
                  <ComponentLabel>Skeleton</ComponentLabel>
                  <ComponentDesc>{"Loading placeholder for content that hasn"}{"'"}{"t loaded yet."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-6">
                      {/* Card-like skeleton */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-3">{"Card Skeleton"}</p>
                        <div className="flex items-start gap-4">
                          <Skeleton className="size-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        </div>
                      </div>
                      {/* Inline skeletons */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-3">{"Inline Variants"}</p>
                        <div className="space-y-3">
                          <Skeleton className="h-10 w-full rounded-2xl" />
                          <div className="flex gap-3">
                            <Skeleton className="h-8 w-24 rounded-xl" />
                            <Skeleton className="h-8 w-32 rounded-xl" />
                            <Skeleton className="h-8 w-20 rounded-xl" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Progress ─── */}
                <div id="comp-progress" className="mb-12">
                  <ComponentLabel>Progress</ComponentLabel>
                  <ComponentDesc>{"Visual indicator of completion or loading."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-4">
                      {[0, 25, 50, 75, 100].map((v) => (
                        <div key={v} className="space-y-1.5">
                          <span className="text-xs font-mono text-muted-foreground">
                            {v}%
                          </span>
                          <Progress value={v} />
                        </div>
                      ))}
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Slider ─── */}
                <div id="comp-slider" className="mb-12">
                  <ComponentLabel>Slider</ComponentLabel>
                  <ComponentDesc>{"Range input for selecting numeric values."}</ComponentDesc>
                  <DemoContainer>
                    <div className="max-w-sm space-y-4">
                      <Slider
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        max={100}
                        step={1}
                      />
                      <span className="text-xs font-mono text-muted-foreground">
                        Value: {sliderValue[0]}
                      </span>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Label ─── */}
                <div id="comp-label" className="mb-12">
                  <ComponentLabel>Label</ComponentLabel>
                  <ComponentDesc>{"Accessible label for form controls."}</ComponentDesc>
                  <DemoContainer>
                    <div className="max-w-sm space-y-2">
                      <Label htmlFor="label-demo">{"Email address"}</Label>
                      <Input
                        id="label-demo"
                        type="email"
                        placeholder={"you@example.com"}
                      />
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Breadcrumb ─── */}
                <div id="comp-breadcrumb" className="mb-12">
                  <ComponentLabel>Breadcrumb</ComponentLabel>
                  <ComponentDesc>{"Navigation hierarchy trail."}</ComponentDesc>
                  <DemoContainer>
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>{"Design System"}</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </DemoContainer>
                </div>

                {/* ─── Table ─── */}
                <div id="comp-table" className="mb-12">
                  <ComponentLabel>Table</ComponentLabel>
                  <ComponentDesc>{"Structured data display in rows and columns."}</ComponentDesc>
                  <DemoContainer className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Component</TableHead>
                          <TableHead>Variants</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">
                            Instances
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Button</TableCell>
                          <TableCell>6</TableCell>
                          <TableCell>
                            <Badge variant="new" className="text-xs">Stable</Badge>
                          </TableCell>
                          <TableCell className="text-right">624</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Badge</TableCell>
                          <TableCell>7</TableCell>
                          <TableCell>
                            <Badge variant="new" className="text-xs">Stable</Badge>
                          </TableCell>
                          <TableCell className="text-right">189</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Card</TableCell>
                          <TableCell>2</TableCell>
                          <TableCell>
                            <Badge variant="new" className="text-xs">Stable</Badge>
                          </TableCell>
                          <TableCell className="text-right">312</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Input</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell>
                            <Badge variant="beta" className="text-xs">Enhancing</Badge>
                          </TableCell>
                          <TableCell className="text-right">247</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </DemoContainer>
                </div>

                {/* ─── Kbd ─── */}
                <div id="comp-kbd" className="mb-12">
                  <ComponentLabel>Kbd</ComponentLabel>
                  <ComponentDesc>{"Keyboard shortcut indicators. Theme-aware, including automatic styling when nested inside tooltips."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-3">{"Individual Keys"}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Kbd>⌘</Kbd>
                          <Kbd>K</Kbd>
                          <Kbd>Shift</Kbd>
                          <Kbd>Enter</Kbd>
                          <Kbd>Esc</Kbd>
                          <Kbd>Tab</Kbd>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-3">{"Key Groups (Shortcuts)"}</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <KbdGroup>
                            <Kbd>⌘</Kbd>
                            <span className="text-muted-foreground text-xs">
                              +
                            </span>
                            <Kbd>K</Kbd>
                          </KbdGroup>
                          <KbdGroup>
                            <Kbd>⌘</Kbd>
                            <span className="text-muted-foreground text-xs">
                              +
                            </span>
                            <Kbd>Shift</Kbd>
                            <span className="text-muted-foreground text-xs">
                              +
                            </span>
                            <Kbd>P</Kbd>
                          </KbdGroup>
                          <KbdGroup>
                            <Kbd>Ctrl</Kbd>
                            <span className="text-muted-foreground text-xs">
                              +
                            </span>
                            <Kbd>C</Kbd>
                          </KbdGroup>
                        </div>
                      </div>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Calendar ─── */}
                <div id="comp-calendar" className="mb-12">
                  <ComponentLabel>Calendar</ComponentLabel>
                  <ComponentDesc>{"Date picker calendar grid."}</ComponentDesc>
                  <DemoContainer>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-lg border border-border/50"
                    />
                  </DemoContainer>
                </div>

                {/* ─── Scroll Area ─── */}
                <div id="comp-scrollarea" className="mb-12">
                  <ComponentLabel>{"Scroll Area"}</ComponentLabel>
                  <ComponentDesc>{"Custom scrollable container with styled scrollbar."}</ComponentDesc>
                  <DemoContainer>
                    <ScrollArea className="h-48 w-full rounded-2xl border border-border/50 p-4">
                      <div className="space-y-2">
                        {Array.from({ length: 20 }, (_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 py-1.5 border-b border-border/20"
                          >
                            <span className="text-xs font-mono text-muted-foreground w-6">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm text-foreground">{"List item"}{' '}{i + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DemoContainer>
                </div>

                {/* ─── Tag ─── */}
                <div id="comp-tag" className="mb-12">
                  <ComponentLabel>Tag</ComponentLabel>
                  <ComponentDesc>Compact label for categorization, filters, and metadata chips.</ComponentDesc>
                  <DemoContainer>
                    <div className="flex flex-wrap gap-2">
                      <Tag>Default</Tag>
                      <Tag variant="new">New</Tag>
                      <Tag variant="free">Free</Tag>
                      <Tag variant="latest">Latest</Tag>
                      <Tag variant="warning">Warning</Tag>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── Pagination ─── */}
                <div id="comp-pagination" className="mb-12">
                  <ComponentLabel>Pagination</ComponentLabel>
                  <ComponentDesc>Page navigation with optional page-size selector and results info, used across list management pages.</ComponentDesc>
                  <DemoContainer>
                    <Pagination
                      currentPage={paginationPage}
                      totalPages={8}
                      totalItems={152}
                      pageSize={20}
                      onPageChange={setPaginationPage}
                      showResultsInfo
                      position="standalone"
                    />
                  </DemoContainer>
                </div>

                {/* ─── Command ─── */}
                <div id="comp-command" className="mb-12">
                  <ComponentLabel>Command</ComponentLabel>
                  <ComponentDesc>Searchable command palette / list, the basis for command-K menus and combobox interfaces.</ComponentDesc>
                  <DemoContainer>
                    <Command className="rounded-lg border border-border/50 max-w-sm">
                      <CommandInput placeholder="Search commands…" />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                          <CommandItem>Profile</CommandItem>
                          <CommandItem>Billing</CommandItem>
                          <CommandItem>Settings</CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </DemoContainer>
                </div>

                {/* ─── Drawer ─── */}
                <div id="comp-drawer" className="mb-12">
                  <ComponentLabel>Drawer</ComponentLabel>
                  <ComponentDesc>Bottom-anchored sheet for mobile-friendly modal flows, built on vaul.</ComponentDesc>
                  <DemoContainer>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="outline">Open drawer</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Edit profile</DrawerTitle>
                          <DrawerDescription>
                            Make changes to your profile here. Click save when you&apos;re done.
                          </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                          <Button>Save changes</Button>
                          <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </DemoContainer>
                </div>

                {/* ─── Context Menu ─── */}
                <div id="comp-context-menu" className="mb-12">
                  <ComponentLabel>Context Menu</ComponentLabel>
                  <ComponentDesc>Right-click contextual menu for row and canvas actions.</ComponentDesc>
                  <DemoContainer>
                    <ContextMenu>
                      <ContextMenuTrigger className="flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-border/50 text-sm text-muted-foreground">
                        Right click here
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuLabel>Actions</ContextMenuLabel>
                        <ContextMenuSeparator />
                        <ContextMenuItem>Rename</ContextMenuItem>
                        <ContextMenuItem>Duplicate</ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </DemoContainer>
                </div>

                {/* ─── Data Table ─── */}
                <div id="comp-data-table" className="mb-12">
                  <ComponentLabel>Data Table</ComponentLabel>
                  <ComponentDesc>Composable table with optional row selection, click handlers, and header actions.</ComponentDesc>
                  <DemoContainer>
                    <DataTable
                      columns={DATA_TABLE_COLUMNS}
                      data={DATA_TABLE_ROWS}
                      getItemId={(row) => row.id}
                    />
                  </DemoContainer>
                </div>
              </section>

            {/* ═══════════════ Chat ═══════════════ */}
            <section id="chat">
              <SectionDivider />
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
                  Chat
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-8">{"Presentational primitives composed for chat surfaces — status indicators, collapsible reasoning panels, message bubbles, and system event cards. Built from the same tokens as the rest of the system (rounded-2xl containers, border-border/60, bg-muted/40 tints)."}</p>

                {/* ─── AnimatedThinkingText ─── */}
                <div id="chat-thinking-text" className="mb-12">
                  <ComponentLabel>AnimatedThinkingText</ComponentLabel>
                  <ComponentDesc>{"A typing + shimmer animated status line used while the assistant is working. Cycles through ambient messages, or types and shimmers a live "}<code className="font-mono text-xs bg-muted px-1 rounded">statusText</code>{" on loop."}</ComponentDesc>
                  <DemoContainer>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">{"Ambient (cycles through messages)"}</p>
                        <AnimatedThinkingText />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">{"Live status"}</p>
                        <AnimatedThinkingText statusText="Reading project files..." />
                      </div>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── ThinkingBlock ─── */}
                <div id="chat-thinking-block" className="mb-12">
                  <ComponentLabel>ThinkingBlock</ComponentLabel>
                  <ComponentDesc>{"Borderless inline row for collapsed agent reasoning — a "}<code className="font-mono text-xs bg-muted px-1 rounded">Brain</code>{" icon, a truncated one-line preview, and (while streaming) a spinner. Expanded content is indented with a left hairline rather than wrapped in a card — matching how reasoning actually renders inline in the timeline."}</ComponentDesc>
                  <DemoContainer>
                    <div className="w-full max-w-md space-y-1">
                      <ThinkingBlock preview="Reviewing the auth middleware for compliance gaps" streaming defaultOpen>
                        <p>{"Looking through the session validation flow to confirm tokens are never persisted in plaintext, then checking the refresh path for the same issue."}</p>
                      </ThinkingBlock>
                      <ThinkingBlock preview="Picked the approach that reuses the existing Collapsible primitive">
                        <p>{"Considered three approaches and chose the one with the smallest surface area against the design system."}</p>
                      </ThinkingBlock>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── QuestionsCard ─── */}
                <div id="chat-questions-card" className="mb-12">
                  <ComponentLabel>QuestionsCard</ComponentLabel>
                  <ComponentDesc>{"Collapsible summary of answered clarifying questions — bordered "}<code className="font-mono text-xs bg-muted px-1 rounded">rounded-2xl bg-muted/20</code>{" card with a "}<code className="font-mono text-xs bg-muted px-1 rounded">MessageSquare</code>{" icon and an answered-count trigger. (This is the card shape "}<code className="font-mono text-xs bg-muted px-1 rounded">ThinkingBlock</code>{" is sometimes mistaken for — they're visually distinct in the real chat.)"}</ComponentDesc>
                  <DemoContainer>
                    <div className="w-full max-w-md">
                      <QuestionsCard
                        defaultExpanded
                        items={[
                          { question: 'Which environment should the migration target first?', answer: 'Staging' },
                          { question: 'Should we notify the on-call channel before running it?', answer: 'Yes, #eng-oncall' },
                          { question: 'Run the backfill synchronously or in batches?', answer: 'In batches of 500' },
                        ]}
                      />
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── ToolCallCard ─── */}
                <div id="chat-tool-call" className="mb-12">
                  <ComponentLabel>ToolCallCard</ComponentLabel>
                  <ComponentDesc>{"A flat, borderless inline row for a tool invocation — icon, name, and a mono argument summary, matching how tool calls actually render in the chat timeline (no card chrome, just a quiet "}<code className="font-mono text-xs bg-muted px-1 rounded">text-xs text-muted-foreground/70</code>{" row). A spinner shows while running; a chevron appears only when there's output to expand."}</ComponentDesc>
                  <DemoContainer>
                    <div className="w-full max-w-md space-y-1">
                      <ToolCallCard icon={<FileText />} title="Read" subtitle="src/components/session/tool-renderers.tsx" status="completed">
                        {'1  \'use client\';\n2\n3  import { useTranslations } from \'next-intl\';'}
                      </ToolCallCard>
                      <ToolCallCard icon={<Search />} title="Grep" subtitle="pattern: useChatSendStore" status="running" defaultOpen />
                      <ToolCallCard icon={<Terminal />} title="Bash" subtitle="pnpm test --filter @kortix/ui" status="error" defaultOpen>
                        {'FAIL  src/components/button.test.tsx\n  ✕ renders disabled state (12 ms)'}
                      </ToolCallCard>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── ChatBubble ─── */}
                <div id="chat-bubble" className="mb-12">
                  <ComponentLabel>ChatBubble & ChatActionCard</ComponentLabel>
                  <ComponentDesc>{"User messages render as an asymmetric "}<code className="font-mono text-xs bg-muted px-1 rounded">rounded-3xl rounded-br-lg</code>{" bubble on a "}<code className="font-mono text-xs bg-muted px-1 rounded">bg-card</code>{" surface — the chat-tail shape distinguishes them at a glance. "}<code className="font-mono text-xs bg-muted px-1 rounded">ChatActionCard</code>{" is the related right-aligned shape for system-style turns (channel messages, triggers, slash commands), using "}<code className="font-mono text-xs bg-muted px-1 rounded">rounded-2xl bg-muted/40</code>{". Assistant replies render with no wrapper at all — plain markdown flowing in the timeline."}</ComponentDesc>
                  <DemoContainer>
                    <div className="w-full max-w-md space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">{"ChatBubble — user message"}</p>
                        <ChatBubble>
                          <p className="text-sm text-foreground">{"Can you review the migration script before we run it against production?"}</p>
                        </ChatBubble>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">{"Assistant reply — unwrapped, plain markdown"}</p>
                        <p className="text-sm text-muted-foreground">{"I've reviewed the migration script — it looks safe to run against production."}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">{"ChatActionCard — slash command"}</p>
                        <ChatActionCard>
                          <div className="flex items-center gap-2">
                            <Terminal className="size-3.5 text-muted-foreground shrink-0" />
                            <span className="font-mono text-sm text-foreground">{"/run-tests"}</span>
                          </div>
                          <span className="text-xs text-muted-foreground/70 font-mono pl-5.5">{"--filter @kortix/ui"}</span>
                        </ChatActionCard>
                      </div>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── ChatSystemCard ─── */}
                <div id="chat-system-card" className="mb-12">
                  <ComponentLabel>ChatSystemCard</ComponentLabel>
                  <ComponentDesc>{"Header-and-body card for system events in a chat timeline — compaction notices, tool summaries, and other non-message events."}</ComponentDesc>
                  <DemoContainer>
                    <div className="w-full max-w-md space-y-3">
                      <ChatSystemCard icon={Layers} label="Compaction">
                        <p>{"Conversation history was compacted to free up context. "}<strong>{"12 messages"}</strong>{" were summarized into a single note."}</p>
                      </ChatSystemCard>
                      <ChatSystemCard icon={MessageSquare} label="Questions">
                        <p>{"3 of 3 questions answered. The assistant has enough context to continue."}</p>
                      </ChatSystemCard>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── ChatDivider ─── */}
                <div id="chat-divider" className="mb-12">
                  <ComponentLabel>ChatDivider</ComponentLabel>
                  <ComponentDesc>{"Hairline divider with a centered muted label — separates turns with a quiet system status line, e.g. "}<code className="font-mono text-xs bg-muted px-1 rounded">Goal · iteration 3/50</code>{"."}</ComponentDesc>
                  <DemoContainer>
                    <div className="w-full max-w-md space-y-4">
                      <p className="text-sm text-muted-foreground">{"Picked up the migration task and started reviewing the schema changes."}</p>
                      <ChatDivider>{"Goal · iteration 3 / 50"}</ChatDivider>
                      <p className="text-sm text-muted-foreground">{"Applied the backfill and re-ran the test suite — all green."}</p>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── ChatInputShell ─── */}
                <div id="chat-input-shell" className="mb-12">
                  <ComponentLabel>ChatInputShell</ComponentLabel>
                  <ComponentDesc>{"The composer surface — a large "}<code className="font-mono text-xs bg-muted px-1 rounded">rounded-[24px]</code>{" card on "}<code className="font-mono text-xs bg-muted px-1 rounded">bg-card</code>{" that frames the textarea and toolbar. The "}<code className="font-mono text-xs bg-muted px-1 rounded">active</code>{" prop highlights the border, e.g. on file drag-over."}</ComponentDesc>
                  <DemoContainer>
                    <div className="w-full max-w-md">
                      <ChatInputShell>
                        <div className="px-4 pt-3.5 pb-2">
                          <p className="text-sm text-muted-foreground">{"Ask Kortix anything..."}</p>
                        </div>
                        <div className="flex items-center justify-between px-3 pb-3">
                          <button type="button" className="inline-flex items-center justify-center size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                            <Paperclip className="size-4" />
                          </button>
                          <button type="button" className="inline-flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground">
                            <ArrowUp className="size-4" />
                          </button>
                        </div>
                      </ChatInputShell>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── ChatAttachmentTile ─── */}
                <div id="chat-attachment-tile" className="mb-12">
                  <ComponentLabel>ChatAttachmentTile</ComponentLabel>
                  <ComponentDesc>{"Staged-file tile shown above the composer — image preview or icon, filename, and a hover-to-reveal remove button."}</ComponentDesc>
                  <DemoContainer>
                    <div className="flex flex-wrap gap-2">
                      <ChatAttachmentTile
                        name="diagram.png"
                        previewUrl="https://images.unsplash.com/photo-1518770660439-4636190af475?w=240&h=160&fit=crop"
                        onRemove={() => {}}
                      />
                      <ChatAttachmentTile
                        name="migration.sql"
                        icon={<FileCode2 className="size-8 text-muted-foreground/50" />}
                        onRemove={() => {}}
                      />
                      <ChatAttachmentTile
                        name="notes.txt"
                        icon={<FileText className="size-8 text-muted-foreground/50" />}
                        onRemove={() => {}}
                      />
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── ContextEventCard ─── */}
                <div id="chat-context-event" className="mb-12">
                  <ComponentLabel>ContextEventCard</ComponentLabel>
                  <ComponentDesc>{"Card for context-management events — shares "}<code className="font-mono text-xs bg-muted px-1 rounded">ChatSystemCard</code>{"'s "}<code className="font-mono text-xs bg-muted px-1 rounded">rounded-2xl bg-card/50</code>{" shape, but its header carries a cluster of status "}<code className="font-mono text-xs bg-muted px-1 rounded">Badge</code>{" pills (pruned count, tokens saved, ...) and expands to per-item detail rows."}</ComponentDesc>
                  <DemoContainer>
                    <div className="w-full max-w-md space-y-3">
                      <ContextEventCard
                        label="Context Compressed"
                        stats={[
                          { label: '12 msgs', variant: 'secondary' },
                          { label: '-3.2k tokens', variant: 'success' },
                          { label: '8.4k saved', variant: 'secondary' },
                        ]}
                      >
                        <div>
                          <div className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-1">{"Topic"}</div>
                          <div>{"Migration planning for the auth schema change"}</div>
                        </div>
                        <div className="border-t border-border/30 pt-1.5">
                          <div className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-1">{"Summary"}</div>
                          <div className="whitespace-pre-wrap break-words">{"Reviewed the migration script, confirmed staging target, and queued the backfill in batches of 500."}</div>
                        </div>
                      </ContextEventCard>
                      <ContextEventCard
                        label="Context Pruned"
                        stats={[
                          { label: '5 pruned', variant: 'warning' },
                          { label: '2.1k saved', variant: 'secondary' },
                        ]}
                      >
                        <div className="space-y-0.5">
                          {['read', 'grep', 'bash'].map((tool, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground/80">
                              <span className="text-muted-foreground/40">{'→'}</span>
                              <span className="font-mono text-xs px-1 py-0.5 rounded bg-muted/50 text-muted-foreground/70">{tool}</span>
                              <span className="truncate max-w-[300px]">{"large output trimmed from context"}</span>
                            </div>
                          ))}
                        </div>
                      </ContextEventCard>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── GroupedActivityRow ─── */}
                <div id="chat-grouped-activity" className="mb-12">
                  <ComponentLabel>GroupedActivityRow</ComponentLabel>
                  <ComponentDesc>{"Same borderless-row family as "}<code className="font-mono text-xs bg-muted px-1 rounded">ThinkingBlock</code>{" / "}<code className="font-mono text-xs bg-muted px-1 rounded">ToolCallCard</code>{", for collapsing a run of same-kind calls — "}<code className="font-mono text-xs bg-muted px-1 rounded">{'"Read · 5 files · 3s"'}</code>{" — into one row that expands into indented one-liners."}</ComponentDesc>
                  <DemoContainer>
                    <div className="w-full max-w-md space-y-1">
                      <GroupedActivityRow icon={Search} label="Gathered context · 3 reads, 2 searches" duration="4s" defaultOpen>
                        <div className="flex items-center gap-1.5 py-0.5 text-xs text-muted-foreground/60 min-w-0">
                          <span className="flex-shrink-0">{"Read"}</span>
                          <span className="font-mono truncate min-w-0 flex-1 opacity-70">{"src/lib/auth/session.ts"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 py-0.5 text-xs text-muted-foreground/60 min-w-0">
                          <span className="flex-shrink-0">{"Grep"}</span>
                          <span className="font-mono truncate min-w-0 flex-1 opacity-70">{"pattern: refreshToken"}</span>
                        </div>
                      </GroupedActivityRow>
                      <GroupedActivityRow icon={Globe} label="Researching · 2 searches, 1 fetch" running />
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── NotificationChip ─── */}
                <div id="chat-notification-chip" className="mb-12">
                  <ComponentLabel>NotificationChip</ComponentLabel>
                  <ComponentDesc>{"Small expandable pill for inline system notifications — PTY exits, agent completions, blockers. "}<code className="font-mono text-xs bg-muted px-1 rounded">tone</code>{" tints the icon (neutral / warning / error) without painting the whole chip, per the design system's restraint on color."}</ComponentDesc>
                  <DemoContainer>
                    <div className="w-full max-w-md space-y-2">
                      <NotificationChip icon={Terminal} label="Process exited · code 0">
                        <div className="flex gap-2 min-w-0">
                          <span className="text-muted-foreground/40 flex-shrink-0">{"duration:"}</span>
                          <span className="text-muted-foreground/60 font-mono text-xs">{"42s"}</span>
                        </div>
                      </NotificationChip>
                      <NotificationChip icon={StopCircle} label="Agent stopped · waiting for input" tone="warning" />
                      <NotificationChip icon={Ban} label="Task failed · 3 retries exhausted" tone="error">
                        <div className="text-muted-foreground/50 font-mono text-xs whitespace-pre-wrap break-all">
                          {"Error: connection timed out after 30000ms"}
                        </div>
                      </NotificationChip>
                    </div>
                  </DemoContainer>
                </div>

                {/* ─── ChatMessageActions ─── */}
                <div id="chat-message-actions" className="mb-12">
                  <ComponentLabel>ChatMessageActions</ComponentLabel>
                  <ComponentDesc>{"Row of icon-only ghost buttons that fades in on "}<code className="font-mono text-xs bg-muted px-1 rounded">group-hover/turn</code>{" — copy, edit & fork, fork. Hover the demo row to reveal it, exactly as it appears beneath a user message."}</ComponentDesc>
                  <DemoContainer>
                    <div className="w-full max-w-md group/turn">
                      <ChatBubble>
                        <p className="text-sm text-foreground">{"Can you review the migration script before we run it against production?"}</p>
                      </ChatBubble>
                      <div className="flex justify-end mt-1">
                        <ChatMessageActions
                          actions={[
                            { icon: <Copy className="size-3.5" />, label: 'Copy' },
                            { icon: <Pencil className="size-3.5" />, label: 'Edit & fork prompt' },
                            { icon: <GitFork className="size-3.5" />, label: 'Fork to new session' },
                          ]}
                        />
                      </div>
                    </div>
                  </DemoContainer>
                </div>
            </section>

            {/* ═══════════════ Page Patterns ═══════════════ */}
            <section id="page-patterns">
              <SectionDivider />
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">{"Page Patterns"}</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">{"How Kortix list / management pages are built. These are the shared chrome pieces used by"}<code className="text-xs font-mono">/scheduled-tasks</code>,{' '}
                <code className="text-xs font-mono">/tunnel</code>{". New management-style pages should compose the same pieces in the same order so the whole app feels like one product."}</p>

              {/* ── PageHeader ── */}
              <div id="pat-page-header" className="mb-12">
                <ComponentLabel>PageHeader</ComponentLabel>
                <ComponentDesc>{"The canonical hero for list/management pages. Rounded card with animated background, centered icon tile, and a single bold title line. Always rendered inside a container wrapper with"}<code className="text-xs font-mono">max-w-7xl</code>{"horizontal padding."}</ComponentDesc>
                <DemoContainer className="p-0 overflow-hidden">
                  <div className="p-6">
                    <PageHeader icon={Zap}>
                      <div className="space-y-2 sm:space-y-4">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
                          <span className="text-primary">{"Scheduled Tasks"}</span>
                        </div>
                      </div>
                    </PageHeader>
                  </div>
                </DemoContainer>
                <pre className="mt-3 text-xs font-mono text-muted-foreground bg-muted/20 rounded-lg px-4 py-3 overflow-x-auto">{`<div className="container mx-auto max-w-7xl px-3 sm:px-4 py-3 sm:py-4">
  <PageHeader icon={Zap}>
    <div className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
      <span className="text-primary">Scheduled Tasks</span>
    </div>
  </PageHeader>
</div>`}</pre>
              </div>

              <div id="pat-command-palette" className="mb-12">
                <ComponentLabel>{"CommandPalette"}</ComponentLabel>
                <ComponentDesc>{"⌘K launcher — composes"}<code className="font-mono text-xs bg-muted px-1 rounded">CommandDialog</code> + <code className="font-mono text-xs bg-muted px-1 rounded">CommandGroup</code>/<code className="font-mono text-xs bg-muted px-1 rounded">CommandItem</code> + <code className="font-mono text-xs bg-muted px-1 rounded">CommandFooter</code>{"out of existing primitives — there's no separate shell component, just this composition. Mirrors"}<code className="font-mono text-xs bg-muted px-1 rounded">command-palette.tsx</code>{"'s grouped sections (Suggestions, Sessions, Files) and keyboard-hint footer, with mocked results."}</ComponentDesc>
                <DemoContainer>
                  <Button variant="outline" onClick={() => setPaletteOpen(true)}>
                    <Search className="size-4" />
                    Open palette
                    <CommandShortcut className="ml-2">⌘K</CommandShortcut>
                  </Button>
                  <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen} title="Command Palette" description="Jump to a session, file, or action.">
                    <CommandInput placeholder="Search sessions, files, actions…" value={paletteQuery} onValueChange={setPaletteQuery} />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Suggestions">
                        <CommandItem>
                          <Bot className="size-4" />
                          <span>Switch agent…</span>
                          <CommandShortcut>⌘J</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                          <Sparkles className="size-4" />
                          <span>Switch model…</span>
                        </CommandItem>
                      </CommandGroup>
                      <CommandGroup heading="Sessions">
                        <CommandItem>
                          <MessageSquare className="size-4" />
                          <span>Refactor auth middleware</span>
                          <span className="ml-auto text-xs text-muted-foreground/50">2h ago</span>
                        </CommandItem>
                        <CommandItem>
                          <MessageSquare className="size-4" />
                          <span>Migration ordering bugfix</span>
                          <span className="ml-auto text-xs text-muted-foreground/50">yesterday</span>
                        </CommandItem>
                      </CommandGroup>
                      <CommandGroup heading="Files">
                        <CommandItem>
                          <FileText className="size-4" />
                          <span className="font-mono text-xs">src/lib/customize-sections.ts</span>
                        </CommandItem>
                        <CommandItem>
                          <FolderGit2 className="size-4" />
                          <span className="font-mono text-xs">apps/web/src/components/command-palette.tsx</span>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                    <CommandFooter>
                      <span className="flex items-center gap-1.5"><CommandKbd>↑</CommandKbd><CommandKbd>↓</CommandKbd> Navigate</span>
                      <span className="flex items-center gap-1.5"><CommandKbd>↵</CommandKbd> Select</span>
                      <span className="flex items-center gap-1.5"><CommandKbd>esc</CommandKbd> Close</span>
                      <span className="ml-auto flex items-center gap-1"><Hash className="size-3" />6 results</span>
                    </CommandFooter>
                  </CommandDialog>
                </DemoContainer>
              </div>

              <div id="pat-connection-pill" className="mb-12">
                <ComponentLabel>{"ConnectionPill"}</ComponentLabel>
                <ComponentDesc>{"Floating pill announcing a mid-session connection hiccup — pulsing dot + spinning icon + label/detail. Captures the shape of the real app's"}<code className="font-mono text-xs bg-muted px-1 rounded">ReconnectPill</code> / <code className="font-mono text-xs bg-muted px-1 rounded">HealthPill</code>{"(amber for transient states, destructive only for a truly unreachable sandbox — never a full red banner)."}</ComponentDesc>
                <DemoContainer>
                  <div className="flex flex-col items-start gap-3">
                    <ConnectionPill status="connecting" label="Connecting to sandbox…" />
                    <ConnectionPill status="reconnecting" label="Reconnecting" detail="12s" />
                    <ConnectionPill status="degraded" label="Runtime services degraded" />
                    <ConnectionPill status="unreachable" label="Sandbox unreachable" detail="Retrying in 30s" />
                  </div>
                </DemoContainer>
              </div>

              {/* ── SpotlightCard ── */}
              <div id="pat-spotlight-card" className="mb-12">
                <ComponentLabel>SpotlightCard</ComponentLabel>
                <ComponentDesc>{"Item card used across every list page. Mouse-following radial spotlight on hover plus a subtle border glow. Wrap with"}<code className="text-xs font-mono">{"bg-card border border-border/50"}</code>{"and apply your own inner padding."}</ComponentDesc>
                <DemoContainer>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: Cable, label: 'tunnel-42', sub: 'exposes :3000' },
                      { icon: Radio, label: '#releases', sub: 'Slack channel' },
                      { icon: Zap, label: 'nightly-cron', sub: 'every day at 03:00' },
                      { icon: Plug, label: 'GitHub', sub: 'Connected' },
                    ].map((item, i) => {
                      const I = item.icon;
                      return (
                        <SpotlightCard
                          key={i}
                          className="bg-card border border-border/50"
                        >
                          <div className="p-4 flex items-center gap-3 cursor-pointer">
                            <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-muted border border-border/50 shrink-0">
                              <I className="h-4 w-4 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-foreground truncate">
                                {item.label}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {item.sub}
                              </div>
                            </div>
                          </div>
                        </SpotlightCard>
                      );
                    })}
                  </div>
                </DemoContainer>
              </div>

              {/* ── PageSearchBar ── */}
              <div id="pat-search-bar" className="mb-12">
                <ComponentLabel>PageSearchBar</ComponentLabel>
                <ComponentDesc>{"Standard search pill placed in the action bar below the PageHeader. Leave a"}<code className="text-xs font-mono">max-w-md</code>{"width so it sits next to a right-aligned primary action without taking over."}</ComponentDesc>
                <DemoContainer>
                  <div className="flex items-center justify-between gap-4">
                    <PageSearchBar
                      value=""
                      onChange={() => {}}
                      placeholder={"Search connections..."}
                      className="max-w-md"
                    />
                    <Button size="sm" className="gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      New
                    </Button>
                  </div>
                </DemoContainer>
              </div>

              {/* ── Stagger Mount ── */}
              <div id="pat-stagger" className="mb-12">
                <ComponentLabel>{"Stagger Mount"}</ComponentLabel>
                <ComponentDesc>{"Every management page mounts its three zones with a staggered fade + slide. Header on entry, search bar at"}<code className="text-xs font-mono">delay-75</code>{", content at"}<code className="text-xs font-mono">delay-150</code>.
                </ComponentDesc>
                <DemoContainer>
                  <pre className="text-xs font-mono text-muted-foreground bg-muted/20 rounded-lg px-4 py-3 overflow-x-auto leading-relaxed">{`// Page header
<div className="... animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-both">

// Search + action bar
<div className="... animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-both delay-75">

// Content area
<div className="... animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-both delay-150">`}</pre>
                </DemoContainer>
              </div>

              <div id="pat-settings-shell" className="mb-12">
                <ComponentLabel>{"SettingsShell"}</ComponentLabel>
                <ComponentDesc>{"Generic settings dialog — grouped sidebar nav (groups × items with icons) + a scrollable content pane. Mirrors the shape of"}<code className="font-mono text-xs bg-muted px-1 rounded">user-settings-modal.tsx</code>{"in the real app, but content is fully composed by the caller (mocked here with General / Appearance / Notifications sections built from"}<code className="font-mono text-xs bg-muted px-1 rounded">Switch</code>, <code className="font-mono text-xs bg-muted px-1 rounded">RadioGroup</code>{", and"}<code className="font-mono text-xs bg-muted px-1 rounded">Input</code>{")."}</ComponentDesc>
                <DemoContainer>
                  <Button variant="outline" onClick={() => setSettingsOpen(true)}>
                    <Settings className="size-4" />
                    Open Settings
                  </Button>
                  <SettingsShell
                    open={settingsOpen}
                    onOpenChange={setSettingsOpen}
                    active={settingsActive}
                    onActiveChange={setSettingsActive}
                    groups={[
                      { label: 'Preferences', items: [
                        { id: 'general', label: 'General', icon: SlidersHorizontal },
                        { id: 'appearance', label: 'Appearance', icon: Palette },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'sounds', label: 'Sounds', icon: Volume2 },
                        { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
                      ]},
                      { label: 'Account', items: [
                        { id: 'profile', label: 'Profile', icon: User },
                        { id: 'tokens', label: 'CLI Tokens', icon: KeyRound },
                      ]},
                    ]}
                  >
                    {settingsActive === 'general' && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">General</h3>
                        <div className="space-y-1.5">
                          <Label htmlFor="ds-settings-name">Display name</Label>
                          <Input id="ds-settings-name" defaultValue="Ada Lovelace" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="ds-settings-lang">Language</Label>
                          <Select defaultValue="en">
                            <SelectTrigger id="ds-settings-lang"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    {settingsActive === 'appearance' && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Appearance</h3>
                        <RadioGroup value={mockTheme} onValueChange={setMockTheme} className="space-y-2">
                          {[
                            { value: 'system', label: 'System' },
                            { value: 'light', label: 'Light' },
                            { value: 'dark', label: 'Dark' },
                          ].map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer">
                              <RadioGroupItem value={opt.value} id={`ds-theme-${opt.value}`} />
                              {opt.label}
                            </label>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                    {settingsActive === 'notifications' && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-foreground">Email notifications</div>
                            <div className="text-xs text-muted-foreground/70">Run summaries and mentions</div>
                          </div>
                          <Switch checked={mockNotifyEmail} onCheckedChange={setMockNotifyEmail} />
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-foreground">Push notifications</div>
                            <div className="text-xs text-muted-foreground/70">Real-time alerts on this device</div>
                          </div>
                          <Switch checked={mockNotifyPush} onCheckedChange={setMockNotifyPush} />
                        </div>
                      </div>
                    )}
                    {settingsActive === 'sounds' && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Sounds</h3>
                        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3">
                          <div className="text-sm font-medium text-foreground">Play sound on completion</div>
                          <Switch checked={mockSoundOn} onCheckedChange={setMockSoundOn} />
                        </div>
                      </div>
                    )}
                    {settingsActive === 'shortcuts' && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-foreground mb-2">Keyboard Shortcuts</h3>
                        {[
                          { action: 'Open command palette', keys: ['⌘', 'K'] },
                          { action: 'New session', keys: ['⌘', 'N'] },
                          { action: 'Toggle sidebar', keys: ['⌘', 'B'] },
                        ].map((row) => (
                          <div key={row.action} className="flex items-center justify-between py-1.5">
                            <span className="text-sm text-muted-foreground">{row.action}</span>
                            <KbdGroup>
                              {row.keys.map((k) => <Kbd key={k}>{k}</Kbd>)}
                            </KbdGroup>
                          </div>
                        ))}
                      </div>
                    )}
                    {settingsActive === 'profile' && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Profile</h3>
                        <div className="flex items-center gap-3">
                          <UserAvatar name="Ada Lovelace" size="lg" />
                          <div>
                            <div className="text-sm font-medium text-foreground">Ada Lovelace</div>
                            <div className="text-xs text-muted-foreground/70">ada@kortix.ai</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {settingsActive === 'tokens' && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">CLI Tokens</h3>
                        <div className="rounded-2xl border border-border/60 bg-card px-4 py-3 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-foreground font-mono">opencode-cli-prod</div>
                            <div className="text-xs text-muted-foreground/70">Created 12 days ago · Last used today</div>
                          </div>
                          <Badge variant="secondary" size="sm">Active</Badge>
                        </div>
                      </div>
                    )}
                  </SettingsShell>
                </DemoContainer>
              </div>

              <div id="pat-overlay-shell" className="mb-12">
                <ComponentLabel>{"OverlayShell"}</ComponentLabel>
                <ComponentDesc>{"Full-screen “Customize”-style overlay — grouped sidebar rail (Build / Connect / Automate + footer group) with a content pane each section owns. Mirrors"}<code className="font-mono text-xs bg-muted px-1 rounded">customize-overlay.tsx</code>{", but the section content is fully composed by the caller. Mocked here with a master-detail Agents browser built from"}<code className="font-mono text-xs bg-muted px-1 rounded">List</code>, <code className="font-mono text-xs bg-muted px-1 rounded">ListRow</code>{", and"}<code className="font-mono text-xs bg-muted px-1 rounded">Badge</code>{"."}</ComponentDesc>
                <DemoContainer>
                  <Button variant="outline" onClick={() => setOverlayOpen(true)}>
                    <SlidersHorizontal className="size-4" />
                    Open Customize
                  </Button>
                  {(() => {
                    const mockAgents = [
                      {
                        id: 'kortix',
                        name: 'kortix',
                        default: true,
                        description: 'Generic Kortix general knowledge worker. Hands-on, full tool access, handles coding / research / content / ops / data tasks end-to-end in an isolated session sandbox.',
                        steps: [
                          { title: 'Understand first.', body: 'Read the relevant files, search the codebase or web, gather the context. Don’t guess.' },
                          { title: 'Plan briefly.', body: 'For non-trivial work, jot the approach to your todo list before touching anything.' },
                          { title: 'Do the work.', body: 'Make the change directly — edit, write, run, fetch. You don’t need approval for routine actions.' },
                          { title: 'Verify.', body: 'Run the project’s tests, hit the dev server, check the output.' },
                        ],
                      },
                      {
                        id: 'memory-reflector',
                        name: 'memory-reflector',
                        default: false,
                        description: 'Background agent that distills session activity into durable memory entries between runs.',
                        steps: [
                          { title: 'Scan the session.', body: 'Pull the latest turns and tool activity since the last reflection.' },
                          { title: 'Distill.', body: 'Keep only what changes future behavior — decisions, corrections, durable facts.' },
                        ],
                      },
                    ];
                    const agent = mockAgents.find((a) => a.id === overlayAgent) ?? mockAgents[0];
                    return (
                      <OverlayShell
                        open={overlayOpen}
                        onClose={() => setOverlayOpen(false)}
                        title="Customize"
                        subtitle="Vortex"
                        active={overlaySection}
                        onActiveChange={setOverlaySection}
                        groups={[
                          { label: 'Build', items: [
                            { id: 'agents', label: 'Agents', icon: Bot },
                            { id: 'skills', label: 'Skills', icon: Sparkles },
                            { id: 'commands', label: 'Commands', glyph: '/' },
                          ]},
                          { label: 'Connect', items: [
                            { id: 'connectors', label: 'Connectors', icon: Plug },
                            { id: 'secrets', label: 'Secrets', icon: KeyRound },
                            { id: 'channels', label: 'Channels', icon: MessageSquare },
                          ]},
                          { label: 'Automate', items: [
                            { id: 'schedules', label: 'Schedules', icon: Timer },
                            { id: 'webhooks', label: 'Webhooks', icon: Webhook },
                          ]},
                        ]}
                        footerGroup={[
                          { id: 'changes', label: 'Changes', icon: GitPullRequest },
                          { id: 'files', label: 'Files', icon: FolderOpen },
                          { id: 'sandbox', label: 'Sandbox', icon: Container },
                          { id: 'dev', label: 'Dev', icon: Terminal },
                          { id: 'members', label: 'Members', icon: Users },
                          { id: 'settings', label: 'Settings', icon: Settings },
                        ]}
                      >
                        {overlaySection === 'agents' ? (
                          <div className="flex h-full">
                            <div className="w-60 flex-shrink-0 border-r border-border/60 p-3 overflow-y-auto">
                              <List>
                                {mockAgents.map((a) => (
                                  <ListRow
                                    key={a.id}
                                    title={a.name}
                                    onClick={() => setOverlayAgent(a.id)}
                                    className={cn(
                                      a.id === overlayAgent && 'bg-primary/[0.05] border-l-2 border-l-primary',
                                    )}
                                    trailing={a.default ? <Star className="size-3.5 text-primary fill-primary" /> : undefined}
                                  />
                                ))}
                              </List>
                            </div>
                            <div className="flex-1 min-w-0 overflow-y-auto p-6">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" size="sm">Agent</Badge>
                                <Badge variant="secondary" size="sm">Primary</Badge>
                                {agent.default && <Badge variant="outline" size="sm"><Star className="size-3 mr-1" />Default</Badge>}
                              </div>
                              <h3 className="text-xl font-semibold text-foreground mb-2">{agent.name}</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{agent.description}</p>
                              <h4 className="text-sm font-semibold text-foreground mb-2">How you work</h4>
                              <ol className="space-y-2 list-decimal list-inside">
                                {agent.steps.map((s) => (
                                  <li key={s.title} className="text-sm text-muted-foreground leading-relaxed">
                                    <span className="font-medium text-foreground">{s.title}</span> {s.body}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <EmptyState
                              icon={Inbox}
                              title="Mocked section"
                              description="This demo only wires up the Agents section — every other rail item shares the same shell, with content owned by its own view."
                            />
                          </div>
                        )}
                      </OverlayShell>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Toast ── */}
              <div id="pat-toast" className="mb-12">
                <ComponentLabel>{"Toast"}</ComponentLabel>
                <ComponentDesc>{"Notifications via "}<code className="font-mono text-xs bg-muted px-1 rounded">sonner</code>{", themed through the shared "}<code className="font-mono text-xs bg-muted px-1 rounded">Toaster</code>{" (mounted once in the root layout). Mirrors the real app's "}<code className="font-mono text-xs bg-muted px-1 rounded">lib/toast.ts</code>{" helpers — call "}<code className="font-mono text-xs bg-muted px-1 rounded">toast.success / error / loading / promise</code>{" directly, no bespoke wrapper needed."}</ComponentDesc>
                <DemoContainer>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.success('Session renamed', { description: 'vortex-refactor → auth-rewrite' })}>
                      Success
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.error('Failed to connect to sandbox', { description: 'Connection timed out after 30s' })}>
                      Error
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.warning('Running low on credits', { description: '12% remaining this cycle' })}>
                      Warning
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.info('New version available', { description: 'Restart the session to pick it up' })}>
                      Info
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.message('Archived 3 sessions')}>
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
                          loading: 'Restarting sandbox…',
                          success: 'Sandbox restarted',
                          error: 'Restart failed',
                        })
                      }
                    >
                      Promise
                    </Button>
                  </div>
                </DemoContainer>
              </div>

              {/* ── SessionListRow ── */}
              <div id="pat-session-list-row" className="mb-12">
                <ComponentLabel>{"Session list row"}</ComponentLabel>
                <ComponentDesc>{"The exact row shape from the real "}<code className="font-mono text-xs bg-muted px-1 rounded">SessionRow</code>{" (sidebar) — pulsing status dot (busy = emerald, pending = amber), title that bolds when active, a subtle child-count pill, an amber pending badge, and a hover-revealed "}<code className="font-mono text-xs bg-muted px-1 rounded">DropdownMenu</code>{" kebab with Rename / Compact / Archive / Delete. Mocked here verbatim from "}<code className="font-mono text-xs bg-muted px-1 rounded">sidebar/session-list.tsx</code>{" — composed entirely from existing primitives, no new component."}</ComponentDesc>
                <DemoContainer>
                  <TooltipProvider>
                    <div className="max-w-xs rounded-2xl border border-border/60 bg-sidebar p-1.5 space-y-0.5">
                      {[
                        { title: 'auth-rewrite', isActive: true, isBusy: true, pendingCount: 0, childCount: 3, isExpanded: true },
                        { title: 'vortex-refactor', isActive: false, isBusy: false, pendingCount: 2, childCount: 0 },
                        { title: 'release-notes-draft', isActive: false, isBusy: false, pendingCount: 0, childCount: 0 },
                        { title: 'failed-migration-test', isActive: false, isBusy: false, pendingCount: 0, childCount: 0 },
                      ].map((s, i) => (
                        <div
                          key={i}
                          className={cn(
                            'group flex items-center gap-2 rounded-lg cursor-pointer transition-colors duration-150 pr-1.5 py-1 pl-2.5',
                            s.isActive
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
                          )}
                        >
                          {(s.isBusy || s.pendingCount > 0) ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex-shrink-0">
                                  {s.pendingCount > 0 ? (
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse block" />
                                  ) : (
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse block" />
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="text-xs">
                                {s.pendingCount > 0 ? `${s.pendingCount} questions waiting` : 'Working…'}
                              </TooltipContent>
                            </Tooltip>
                          ) : null}

                          <span className={cn('flex-1 truncate text-sm', s.isActive && 'font-medium')}>
                            {s.title}
                          </span>

                          {s.childCount > 0 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  aria-label={s.isExpanded ? 'Collapse sub-sessions' : 'Expand sub-sessions'}
                                  className={cn(
                                    'flex-shrink-0 inline-flex items-center rounded-full px-1.5 py-0.5 text-xs tabular-nums transition-colors cursor-pointer',
                                    s.isExpanded
                                      ? 'bg-sidebar-accent/80 text-sidebar-foreground'
                                      : 'text-muted-foreground/50 hover:bg-sidebar-accent/60 hover:text-muted-foreground',
                                  )}
                                >
                                  {s.childCount}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="text-xs">
                                {s.isExpanded ? 'Collapse' : 'Expand'} {s.childCount} sub-sessions
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {s.pendingCount > 0 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex-shrink-0 h-4 min-w-4 px-1 rounded-full bg-amber-500/15 text-amber-500 text-xs font-medium flex items-center justify-center">
                                  {s.pendingCount}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="text-xs">
                                {s.pendingCount} questions waiting for your input
                              </TooltipContent>
                            </Tooltip>
                          )}

                          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="p-0.5 rounded-md hover:bg-sidebar-accent transition-colors duration-150 text-muted-foreground hover:text-sidebar-foreground cursor-pointer opacity-0 group-hover:opacity-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 p-1">
                                <DropdownMenuItem className="cursor-pointer">
                                  <Pencil className="h-4 w-4" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Layers className="h-4 w-4" />
                                  Compact
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Archive className="h-4 w-4" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem variant="destructive" className="cursor-pointer">
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TooltipProvider>
                </DemoContainer>
              </div>

              {/* ── ModelSelector ── */}
              <div id="pat-model-selector" className="mb-12">
                <ComponentLabel>{"ModelSelector"}</ComponentLabel>
                <ComponentDesc>{"The chat composer's model picker — a "}<code className="font-mono text-xs bg-muted px-1 rounded">CommandPopover</code>{" pill that opens a searchable, provider-grouped list with a "}<code className="font-mono text-xs bg-muted px-1 rounded">Free</code>{" "}<code className="font-mono text-xs bg-muted px-1 rounded">Tag</code>{", a checkmark on the selected model, and a footer toggle to reveal older/superseded releases. Mocked from "}<code className="font-mono text-xs bg-muted px-1 rounded">session/model-selector.tsx</code>{" with provider icons swapped for "}<code className="font-mono text-xs bg-muted px-1 rounded">EntityAvatar</code>{"."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    const mockProviders = [
                      { id: 'anthropic', name: 'Anthropic', models: [
                        { id: 'claude-opus-4-8', name: 'Claude Opus 4.8', free: false },
                        { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', free: false },
                        { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', free: false },
                      ]},
                      { id: 'opencode', name: 'OpenCode', models: [
                        { id: 'kimi-k2', name: 'Kimi K2', free: true },
                        { id: 'qwen3-coder', name: 'Qwen3 Coder', free: true },
                      ]},
                      { id: 'openai', name: 'OpenAI', models: [
                        { id: 'gpt-5', name: 'GPT-5', free: false },
                      ]},
                    ];
                    const olderModels = [
                      { id: 'anthropic', name: 'Anthropic', models: [
                        { id: 'claude-sonnet-3-7', name: 'Claude Sonnet 3.7', free: false },
                      ]},
                    ];
                    const groups = showOlderModels ? [...mockProviders, ...olderModels] : mockProviders;
                    const q = modelSearch.toLowerCase();
                    const filtered = groups
                      .map((g) => ({ ...g, models: g.models.filter((m) => !q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)) }))
                      .filter((g) => g.models.length > 0);
                    const current = groups.flatMap((g) => g.models).find((m) => m.id === selectedModel);

                    return (
                      <CommandPopover open={modelPickerOpen} onOpenChange={setModelPickerOpen}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CommandPopoverTrigger>
                              <button
                                type="button"
                                className={cn(
                                  'inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 cursor-pointer',
                                  modelPickerOpen && 'bg-muted text-foreground',
                                )}
                              >
                                <span className="truncate max-w-[160px]">{current?.name ?? 'Model'}</span>
                                <ChevronDown className={cn('size-3 opacity-50 transition-transform duration-200', modelPickerOpen && 'rotate-180')} />
                              </button>
                            </CommandPopoverTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">Choose model</TooltipContent>
                        </Tooltip>

                        <CommandPopoverContent side="bottom" align="start" sideOffset={8} className="w-[320px]">
                          <CommandInput
                            compact
                            placeholder="Search models…"
                            value={modelSearch}
                            onValueChange={setModelSearch}
                            rightElement={
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={() => setModelPickerOpen(false)}
                                    className="size-7 rounded-md flex items-center justify-center text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">Connect provider</TooltipContent>
                              </Tooltip>
                            }
                          />
                          <CommandList className="max-h-[340px]">
                            {filtered.length > 0 ? filtered.map((group) => (
                              <CommandGroup
                                key={group.id}
                                heading={
                                  <div className="flex items-center gap-2">
                                    <EntityAvatar size="xs" name={group.name} />
                                    <span className="flex-1">{group.name}</span>
                                    <span className="text-xs text-muted-foreground/30 normal-case tracking-normal">{group.models.length}</span>
                                  </div>
                                }
                                forceMount
                              >
                                {group.models.map((model) => {
                                  const isSelected = selectedModel === model.id;
                                  return (
                                    <CommandItem
                                      key={model.id}
                                      value={`model-${model.id}`}
                                      className={cn('!pl-3', isSelected && 'bg-foreground/[0.06]')}
                                      onSelect={() => { setSelectedModel(model.id); setModelPickerOpen(false); }}
                                    >
                                      <div className="min-w-0 flex-1 py-0.5">
                                        <div className={cn('truncate text-sm leading-tight', isSelected ? 'font-semibold text-foreground' : 'font-medium text-foreground/90')}>
                                          {model.name}
                                        </div>
                                        <p className="truncate text-xs text-muted-foreground/55 leading-snug mt-1">{model.id}</p>
                                      </div>
                                      {model.free && <Tag variant="free">Free</Tag>}
                                      {isSelected && <Check className="text-foreground shrink-0" />}
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            )) : (
                              <div className="py-8 text-center text-xs text-muted-foreground/50">No models found</div>
                            )}
                          </CommandList>
                          {!modelSearch && (
                            <CommandFooter
                              role="button"
                              tabIndex={0}
                              onClick={() => setShowOlderModels((v) => !v)}
                              className="cursor-pointer select-none hover:bg-foreground/[0.04] hover:text-foreground transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>{showOlderModels ? 'Hide older models' : 'Show older models'}</span>
                            </CommandFooter>
                          )}
                        </CommandPopoverContent>
                      </CommandPopover>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Keyboard shortcuts ── */}
              <div id="pat-shortcuts" className="mb-12">
                <ComponentLabel>{"Keyboard shortcuts reference"}</ComponentLabel>
                <ComponentDesc>{"The shortcuts list from the "}<code className="font-mono text-xs bg-muted px-1 rounded">Settings → Shortcuts</code>{" tab — a divided "}<code className="font-mono text-xs bg-muted px-1 rounded">rounded-2xl border</code>{" panel pairing each action with a "}<code className="font-mono text-xs bg-muted px-1 rounded">Kbd</code>{" combo. Mocked from "}<code className="font-mono text-xs bg-muted px-1 rounded">KeyboardShortcutsTab</code>{" in "}<code className="font-mono text-xs bg-muted px-1 rounded">user-settings-modal.tsx</code>{"."}</ComponentDesc>
                <DemoContainer>
                  <div className="max-w-md rounded-2xl border border-border/60 divide-y divide-border/60">
                    {[
                      { label: 'Command palette', keys: ['⌘', 'K'] },
                      { label: 'New session', keys: ['Ctrl', 'J'] },
                      { label: 'Toggle left sidebar', keys: ['Ctrl', 'B'] },
                      { label: 'Toggle right sidebar', keys: ['Ctrl', 'Shift', 'B'] },
                      { label: 'Next tab', keys: ['⌘', 'Shift', ']'] },
                      { label: 'Close active tab', keys: ['Ctrl', 'W'] },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between px-3 py-2.5">
                        <span className="text-sm text-foreground">{s.label}</span>
                        <KbdGroup>
                          {s.keys.map((k, i) => <Kbd key={i}>{k}</Kbd>)}
                        </KbdGroup>
                      </div>
                    ))}
                  </div>
                </DemoContainer>
              </div>

              {/* ── Connect provider modal ── */}
              <div id="pat-provider-modal" className="mb-12">
                <ComponentLabel>{"Connect provider"}</ComponentLabel>
                <ComponentDesc>{"The provider catalog + connect flow from "}<code className="font-mono text-xs bg-muted px-1 rounded">connect-provider-content.tsx</code>{" — searchable list of "}<code className="font-mono text-xs bg-muted px-1 rounded">ProviderCard</code>{" rows with real "}<code className="font-mono text-xs bg-muted px-1 rounded">ProviderLogo</code>{" artwork, a collapsible "}<code className="font-mono text-xs bg-muted px-1 rounded">Accordion</code>{" for less-common providers, and the second-step connect screen (auth-method picker → API key form) with a back button."}</ComponentDesc>
                <DemoContainer>
                  <Button variant="outline" onClick={() => { setProviderModalOpen(true); setProviderView({ type: 'list' }); setProviderAuthMethod(null); setProviderApiKey(''); }}>
                    <Plug className="size-4" />
                    Connect provider
                  </Button>
                  {(() => {
                    const PROVIDER_ICONS: Record<string, string> = {
                      anthropic: '/provider-icons/anthropic.svg',
                      openai: '/provider-icons/openai.svg',
                      opencode: '/provider-icons/opencode.svg',
                      google: '/provider-icons/google.svg',
                      mistral: '/provider-icons/mistral.svg',
                      groq: '/provider-icons/groq.svg',
                    };
                    const ProviderLogoMock = ({ id, name, size = 'default' }: { id: string; name: string; size?: 'small' | 'default' | 'large' }) => {
                      const src = PROVIDER_ICONS[id];
                      const box = size === 'small' ? 'size-7' : size === 'large' ? 'size-11' : 'size-9';
                      const px = size === 'small' ? 14 : size === 'large' ? 22 : 18;
                      return (
                        <span className={cn('flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0', box)} aria-hidden="true">
                          {src ? (
                            <Image src={src} alt="" width={px} height={px} className="object-contain dark:invert" />
                          ) : (
                            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">{name.slice(0, 2).toUpperCase()}</span>
                          )}
                        </span>
                      );
                    };
                    const popular = [
                      { id: 'anthropic', name: 'Anthropic', desc: 'Claude Pro/Max subscription or your own API key', connected: true },
                      { id: 'openai', name: 'OpenAI', desc: 'ChatGPT Pro/Plus subscription or your own API key', connected: false },
                      { id: 'opencode', name: 'OpenCode', desc: 'One key for many hosted models', connected: true },
                    ];
                    const more = [
                      { id: 'google', name: 'Google', desc: 'Gemini models from Google AI Studio', connected: false },
                      { id: 'mistral', name: 'Mistral', desc: 'Mistral & Codestral models', connected: false },
                      { id: 'groq', name: 'Groq', desc: 'Fast inference', connected: false },
                    ];
                    const all = [...popular, ...more];
                    const q = providerSearch.toLowerCase();
                    const matches = (p: { name: string; desc: string }) => !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
                    const cardChrome = 'group flex h-auto w-full items-center gap-3 rounded-2xl border border-border/50 bg-muted/20 px-3.5 py-2.5 text-left transition-colors hover:bg-muted/35 cursor-pointer';
                    const renderCard = (p: { id: string; name: string; desc: string; connected: boolean }) => (
                      <button key={p.id} type="button" className={cardChrome} onClick={() => { setProviderView({ type: 'connect', id: p.id, name: p.name }); setProviderAuthMethod(null); setProviderApiKey(''); }}>
                        <ProviderLogoMock id={p.id} name={p.name} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium text-foreground">{p.name}</span>
                            {p.connected && (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-px text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                                connected
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 truncate text-xs text-muted-foreground/60">{p.desc}</div>
                        </div>
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
                      </button>
                    );
                    const selected = providerView.type === 'connect' ? all.find((p) => p.id === providerView.id) : undefined;
                    const handleBack = () => {
                      if (providerAuthMethod) { setProviderAuthMethod(null); setProviderApiKey(''); }
                      else setProviderView({ type: 'list' });
                    };
                    const customMatchesSearch = !q || 'custom provider'.includes(q) || 'ollama'.includes(q);
                    return (
                      <Dialog open={providerModalOpen} onOpenChange={(open) => { setProviderModalOpen(open); if (!open) { setProviderView({ type: 'list' }); setProviderAuthMethod(null); } }}>
                        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
                          {providerView.type === 'list' ? (
                            <DialogHeader className="border-b border-border/60 px-6 pt-6 pb-4">
                              <DialogTitle>Connect a provider</DialogTitle>
                              <DialogDescription>Add credentials to unlock more models in the picker.</DialogDescription>
                            </DialogHeader>
                          ) : (
                            <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
                              <Button type="button" onClick={handleBack} variant="ghost" size="icon-sm" className="-ml-1.5">
                                <ArrowLeft className="h-4 w-4" />
                              </Button>
                              <h3 className="flex-1 text-sm font-medium text-foreground">
                                {providerView.type === 'custom' ? 'Add Custom Provider' : `Connect ${selected?.name}`}
                              </h3>
                            </div>
                          )}

                          {providerView.type === 'list' && (
                            <div className="space-y-1 px-3 pb-4 pt-3 max-h-[60vh] overflow-y-auto">
                              <div className="relative pb-1">
                                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
                                <Input
                                  type="text"
                                  placeholder="Search providers…"
                                  value={providerSearch}
                                  onChange={(e) => setProviderSearch(e.target.value)}
                                  className="h-9 rounded-xl border-border/50 bg-muted/20 pl-9 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-ring/40"
                                />
                              </div>
                              <div className="space-y-1">{popular.filter(matches).map(renderCard)}</div>
                              {more.filter(matches).length > 0 && (
                                <Accordion type="single" collapsible value={providerOtherOpen ? 'other' : undefined} onValueChange={(v) => setProviderOtherOpen(v === 'other')}>
                                  <AccordionItem value="other" className="border-none">
                                    <AccordionTrigger className="rounded-xl px-3.5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/35 hover:no-underline hover:text-foreground [&>svg]:hidden">
                                      <span className="flex w-full items-center justify-between gap-2">
                                        <span>More providers ({more.filter(matches).length})</span>
                                        <ChevronDown className={cn('size-3.5 transition-transform', providerOtherOpen && 'rotate-180')} />
                                      </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-1 pt-1">
                                      {more.filter(matches).map(renderCard)}
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              )}
                              {customMatchesSearch && (
                                <button
                                  type="button"
                                  className={cardChrome}
                                  onClick={() => { setProviderView({ type: 'custom' }); setCustomProviderForm({ providerID: '', name: '', baseURL: '', apiKey: '', modelId: '', modelName: '' }); }}
                                >
                                  <span className="flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0 size-9 text-muted-foreground">
                                    <Plug className="h-4 w-4" />
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <span className="truncate text-sm font-medium text-foreground">Custom Provider</span>
                                    <div className="mt-0.5 truncate text-xs text-muted-foreground/60">Add any OpenAI-compatible endpoint — e.g. a local Ollama server</div>
                                  </div>
                                  <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
                                </button>
                              )}
                            </div>
                          )}

                          {providerView.type === 'custom' && (
                            <form
                              onSubmit={(e) => { e.preventDefault(); toast.success(`${customProviderForm.name || customProviderForm.providerID} connected`); setProviderModalOpen(false); }}
                              className="px-5 py-4 space-y-4"
                            >
                              <p className="text-sm text-muted-foreground/70">
                                Add an OpenAI-compatible provider — point it at a local Ollama server with{' '}
                                <code className="text-xs bg-muted px-1 py-0.5 rounded">http://localhost:11434/v1</code>.
                              </p>
                              <div className="space-y-4 rounded-2xl border border-border/50 bg-muted/20 p-4">
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Provider ID</label>
                                  <Input type="text" placeholder="ollama" value={customProviderForm.providerID} onChange={(e) => setCustomProviderForm((f) => ({ ...f, providerID: e.target.value }))} className="h-9 rounded-xl border-border/50 bg-background text-sm" autoFocus />
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Display name</label>
                                  <Input type="text" placeholder="Ollama (local)" value={customProviderForm.name} onChange={(e) => setCustomProviderForm((f) => ({ ...f, name: e.target.value }))} className="h-9 rounded-xl border-border/50 bg-background text-sm" />
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Base URL</label>
                                  <Input type="text" placeholder="http://localhost:11434/v1" value={customProviderForm.baseURL} onChange={(e) => setCustomProviderForm((f) => ({ ...f, baseURL: e.target.value }))} className="h-9 rounded-xl border-border/50 bg-background text-sm" />
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">API key <span className="font-normal text-muted-foreground/50">(optional)</span></label>
                                  <Input type="password" placeholder="sk-... (Ollama doesn't need one)" value={customProviderForm.apiKey} onChange={(e) => setCustomProviderForm((f) => ({ ...f, apiKey: e.target.value }))} className="h-9 rounded-xl border-border/50 bg-background text-sm" />
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Model</label>
                                  <div className="flex gap-2">
                                    <Input type="text" placeholder="llama3.1" value={customProviderForm.modelId} onChange={(e) => setCustomProviderForm((f) => ({ ...f, modelId: e.target.value }))} className="h-9 flex-1 rounded-xl border-border/50 bg-background text-sm" />
                                    <Input type="text" placeholder="Display name" value={customProviderForm.modelName} onChange={(e) => setCustomProviderForm((f) => ({ ...f, modelName: e.target.value }))} className="h-9 flex-1 rounded-xl border-border/50 bg-background text-sm" />
                                  </div>
                                </div>
                              </div>
                              <Button type="submit" disabled={!customProviderForm.providerID.trim() || !customProviderForm.baseURL.trim()} size="sm" className="px-4">Connect</Button>
                            </form>
                          )}

                          {providerView.type === 'connect' && selected && (
                            <div className="px-5 py-4 space-y-4">
                              <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/20 px-4 py-3.5">
                                <ProviderLogoMock id={selected.id} name={selected.name} size="large" />
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-semibold text-foreground">{selected.name}</div>
                                  <p className="text-xs text-muted-foreground mt-0.5">{selected.desc}</p>
                                </div>
                              </div>

                              {!providerAuthMethod && (
                                <>
                                  <p className="text-sm text-muted-foreground">Select a login method for {selected.name}.</p>
                                  <div className="rounded-2xl border border-border/50 bg-muted/20 p-2 space-y-0.5">
                                    <Button type="button" onClick={() => setProviderAuthMethod('oauth')} variant="ghost" className="group h-auto w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-background/70 justify-start">
                                      <span className="flex items-center justify-center size-8 rounded-lg bg-muted/50 text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                                        <Globe className="h-4 w-4" />
                                      </span>
                                      <span className="flex-1 min-w-0">
                                        <span className="text-sm font-medium block">Pro / Max subscription</span>
                                        <span className="text-xs text-muted-foreground/70 block mt-0.5">Use your existing subscription</span>
                                      </span>
                                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0 ml-auto" />
                                    </Button>
                                    <Button type="button" onClick={() => setProviderAuthMethod('api')} variant="ghost" className="group h-auto w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-background/70 justify-start">
                                      <span className="flex items-center justify-center size-8 rounded-lg bg-muted/50 text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                                        <Key className="h-4 w-4" />
                                      </span>
                                      <span className="flex-1 min-w-0">
                                        <span className="text-sm font-medium block">API key</span>
                                        <span className="text-xs text-muted-foreground/70 block mt-0.5">Manually enter an existing API key</span>
                                      </span>
                                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0 ml-auto" />
                                    </Button>
                                  </div>
                                </>
                              )}

                              {providerAuthMethod === 'api' && (
                                <form onSubmit={(e) => { e.preventDefault(); toast.success(`${selected.name} connected`); setProviderModalOpen(false); }} className="space-y-4 rounded-2xl border border-border/50 bg-muted/20 p-4">
                                  <p className="text-sm text-muted-foreground">Enter your {selected.name} API key.</p>
                                  <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">API key</label>
                                    <Input
                                      placeholder="sk-..."
                                      type="text"
                                      value={providerApiKey}
                                      onChange={(e) => setProviderApiKey(e.target.value)}
                                      className="h-9 rounded-xl border-border/50 bg-background text-sm"
                                      autoFocus
                                    />
                                  </div>
                                  <Button type="submit" disabled={!providerApiKey.trim()} size="sm" className="px-4">Connect</Button>
                                </form>
                              )}

                              {providerAuthMethod === 'oauth' && (
                                <form onSubmit={(e) => { e.preventDefault(); toast.success(`${selected.name} connected`); setProviderModalOpen(false); }} className="space-y-4 rounded-2xl border border-border/50 bg-muted/20 p-5">
                                  <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-foreground">Connect {selected.name}</h3>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                      {[
                                        'Click the button below to open the authorization page',
                                        'Sign in and authorize access',
                                        'Copy the full redirect URL from your browser',
                                        'Paste it below and click Connect',
                                      ].map((step, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center mt-0.5">{i + 1}</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <Button type="button" variant="outline" size="sm" className="w-full h-10 gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Open authorization page
                                  </Button>
                                  <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Redirect URL</label>
                                    <Input placeholder="http://localhost:.../callback?code=..." type="text" className="h-9 rounded-xl border-border/50 bg-background text-sm" />
                                  </div>
                                  <Button type="submit" size="sm" className="px-4">Connect</Button>
                                </form>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Session header ── */}
              <div id="pat-session-header" className="mb-12">
                <ComponentLabel>{"Session header"}</ComponentLabel>
                <ComponentDesc>{"The floating bar atop a session — leading title with a hover-revealed pencil that switches to inline editing (Enter to save, Escape to cancel), an overflow menu (Rename / Share / Restart / Delete), and a panel-toggle on the right. Mirrors "}<code className="font-mono text-xs bg-muted px-1 rounded">session-site-header.tsx</code>{", with the rename flow made inline rather than a separate dialog."}</ComponentDesc>
                <DemoContainer>
                  <div className="relative rounded-2xl border border-border/60 bg-card h-14 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-between px-3">
                      <div className="group flex items-center gap-1.5 min-w-0">
                        {headerEditing ? (
                          <Input
                            autoFocus
                            value={headerDraft}
                            onChange={(e) => setHeaderDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') { setHeaderTitle(headerDraft.trim() || headerTitle); setHeaderEditing(false); }
                              if (e.key === 'Escape') { setHeaderDraft(headerTitle); setHeaderEditing(false); }
                            }}
                            onBlur={() => { setHeaderTitle(headerDraft.trim() || headerTitle); setHeaderEditing(false); }}
                            className="h-7 max-w-xs rounded-lg text-sm"
                          />
                        ) : (
                          <>
                            <span className="truncate text-sm font-medium text-foreground">{headerTitle}</span>
                            <button
                              type="button"
                              aria-label="Rename session"
                              onClick={() => { setHeaderDraft(headerTitle); setHeaderEditing(true); }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground cursor-pointer"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => { setHeaderDraft(headerTitle); setHeaderEditing(true); }}>
                              <Pencil className="h-4 w-4" />
                              Rename…
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
                              <Share2 className="h-4 w-4" />
                              Share…
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RotateCcw className="h-4 w-4" />
                              Restart
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DemoContainer>
              </div>

              {/* ── Share session dialog ── */}
              <div id="pat-share-dialog" className="mb-12">
                <ComponentLabel>{"Share session"}</ComponentLabel>
                <ComponentDesc>{"Visibility picker from "}<code className="font-mono text-xs bg-muted px-1 rounded">SessionShareDialog</code>{" / "}<code className="font-mono text-xs bg-muted px-1 rounded">SharingPicker</code>{" — a "}<code className="font-mono text-xs bg-muted px-1 rounded">RadioGroup</code>{" of icon-tile option cards (Team / Private / Members) with a check on the active choice."}</ComponentDesc>
                <DemoContainer>
                  <Button variant="outline" onClick={() => setShareDialogOpen(true)}>
                    <Share2 className="size-4" />
                    Share session
                  </Button>
                  {(() => {
                    const options = [
                      { value: 'project', label: 'Whole team', desc: 'Everyone in this project', icon: Globe },
                      { value: 'private', label: 'Only you', desc: 'Private — just you', icon: Lock },
                      { value: 'members', label: 'Select members', desc: 'A chosen list of members', icon: Users },
                    ];
                    return (
                      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Share session</DialogTitle>
                            <DialogDescription>Sessions are private to you by default. Share read/continue access with your team or specific members.</DialogDescription>
                          </DialogHeader>
                          <div className="py-1">
                            <Label className="text-xs text-muted-foreground">Who can access this session</Label>
                            <RadioGroup value={shareMode} onValueChange={setShareMode} className="space-y-1.5 mt-2">
                              {options.map((opt) => {
                                const Icon = opt.icon;
                                const selected = shareMode === opt.value;
                                return (
                                  <label
                                    key={opt.value}
                                    className={cn(
                                      'flex cursor-pointer items-center gap-3 rounded-2xl border p-2.5 transition-colors',
                                      'focus-within:ring-2 focus-within:ring-primary/50',
                                      selected ? 'border-primary/50 bg-primary/[0.05]' : 'border-border/60 hover:bg-muted/40',
                                    )}
                                  >
                                    <RadioGroupItem value={opt.value} className="sr-only" />
                                    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors', selected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                                      <Icon className="h-4 w-4" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-medium text-foreground">{opt.label}</div>
                                      <div className="text-xs text-muted-foreground">{opt.desc}</div>
                                    </div>
                                    {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                                  </label>
                                );
                              })}
                            </RadioGroup>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>Cancel</Button>
                            <Button onClick={() => setShareDialogOpen(false)}>Save</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Command palette ── */}
              <div id="pat-command-palette-nav" className="mb-12">
                <ComponentLabel>{"Command palette — submenu navigation"}</ComponentLabel>
                <ComponentDesc>{"A second take on the ⌘K palette focused on "}<code className="font-mono text-xs bg-muted px-1 rounded">command-palette.tsx</code>{"'s breadcrumb-driven drill-down — selecting \"Change agent\" or \"Change model\" pushes a submenu page with a Back affordance, the way the real palette navigates into Agents/Models/Messages."}</ComponentDesc>
                <DemoContainer>
                  <Button variant="outline" onClick={() => { setPaletteOpen2(true); setPalettePage('root'); setPaletteQuery2(''); }}>
                    <Search className="size-4" />
                    Open palette
                    <KbdGroup className="ml-2"><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
                  </Button>
                  {(() => {
                    const agents = [
                      { id: 'a1', name: 'Default agent', desc: 'General-purpose' },
                      { id: 'a2', name: 'Code reviewer', desc: 'Reviews diffs & PRs' },
                      { id: 'a3', name: 'Researcher', desc: 'Web search & synthesis' },
                    ];
                    const models = [
                      { id: 'm1', name: 'Claude Sonnet 4.6', provider: 'Anthropic' },
                      { id: 'm2', name: 'GPT-5', provider: 'OpenAI' },
                      { id: 'm3', name: 'Gemini 2.5 Pro', provider: 'Google' },
                    ];
                    const recentSessions = [
                      { id: 's1', name: 'auth-rewrite: rotate refresh tokens', when: '2h ago', current: true },
                      { id: 's2', name: 'fix(billing): webhook retries', when: '1d ago', current: false },
                      { id: 's3', name: 'docs: onboarding rewrite', when: '3d ago', current: false },
                    ];
                    const pageTitle = palettePage === 'agents' ? 'Change Agent' : palettePage === 'models' ? 'Change Model' : '';
                    return (
                      <CommandDialog open={paletteOpen2} onOpenChange={setPaletteOpen2} className="sm:max-w-[680px]">
                        {palettePage !== 'root' && (
                          <div className="flex items-center gap-2 px-4 pt-3 pb-0.5">
                            <button
                              type="button"
                              onClick={() => setPalettePage('root')}
                              className="group flex items-center gap-1 rounded-md px-1.5 py-0.5 -ml-1.5 text-xs text-muted-foreground/60 hover:text-foreground hover:bg-foreground/[0.04] transition-colors cursor-pointer"
                            >
                              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
                              <span>Back</span>
                            </button>
                            <span className="text-xs text-muted-foreground/25">/</span>
                            <span className="text-xs font-medium text-foreground/85 tracking-[-0.005em]">{pageTitle}</span>
                          </div>
                        )}
                        <CommandInput placeholder="Type a command or search…" value={paletteQuery2} onValueChange={setPaletteQuery2} />
                        <CommandList>
                          {palettePage === 'root' && (
                            <>
                              <CommandGroup heading="Suggestions">
                                <CommandItem onSelect={() => setPalettePage('agents')}>
                                  <Bot className="h-4 w-4" />
                                  <span className="flex-1">Change agent</span>
                                  <span className="text-xs text-muted-foreground/40">Default agent</span>
                                  <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
                                </CommandItem>
                                <CommandItem onSelect={() => setPalettePage('models')}>
                                  <Cpu className="h-4 w-4" />
                                  <span className="flex-1">Change model</span>
                                  <span className="text-xs text-muted-foreground/40 truncate max-w-[160px]">Claude Sonnet 4.6</span>
                                  <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
                                </CommandItem>
                                <CommandItem onSelect={() => { setPaletteOpen2(false); toast.message('Jumping to message…'); }}>
                                  <MessageCircle className="h-4 w-4" />
                                  <span className="flex-1">Jump to message</span>
                                  <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
                                </CommandItem>
                                <CommandItem onSelect={() => { setPaletteOpen2(false); toast.success('New session started'); }}>
                                  <Plus className="h-4 w-4" />
                                  <span className="flex-1">New session</span>
                                  <CommandShortcut>⌘N</CommandShortcut>
                                </CommandItem>
                              </CommandGroup>
                              <CommandGroup heading="Recent sessions">
                                {recentSessions.map((s) => (
                                  <CommandItem key={s.id} onSelect={() => { setPaletteOpen2(false); toast.message(`Opening "${s.name}"`); }}>
                                    <MessageCircle className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate flex-1">{s.name}</span>
                                    {s.current && <span className="text-xs text-primary/60 font-medium">Current</span>}
                                    <span className="text-xs text-muted-foreground/30 tabular-nums flex-shrink-0">{s.when}</span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          )}
                          {palettePage === 'agents' && (
                            <CommandGroup heading="Agents">
                              {agents.map((a) => (
                                <CommandItem key={a.id} onSelect={() => { setPaletteOpen2(false); toast.success(`Switched to ${a.name}`); }}>
                                  <EntityAvatar size="xs" name={a.name} />
                                  <span className="flex-1 truncate">{a.name}</span>
                                  <span className="text-xs text-muted-foreground/40 truncate max-w-[160px]">{a.desc}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                          {palettePage === 'models' && (
                            <CommandGroup heading="Models">
                              {models.map((m) => (
                                <CommandItem key={m.id} onSelect={() => { setPaletteOpen2(false); toast.success(`Switched to ${m.name}`); }}>
                                  <EntityAvatar size="xs" name={m.provider} />
                                  <span className="flex-1 truncate">{m.name}</span>
                                  <span className="text-xs text-muted-foreground/40">{m.provider}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                          <CommandEmpty>No results found.</CommandEmpty>
                        </CommandList>
                        <CommandFooter>
                          <span className="flex items-center gap-1.5"><CommandKbd>↑</CommandKbd><CommandKbd>↓</CommandKbd> navigate</span>
                          <span className="flex items-center gap-1.5"><CommandKbd>↵</CommandKbd> select</span>
                          <span className="flex items-center gap-1.5"><CommandKbd>esc</CommandKbd> close</span>
                        </CommandFooter>
                      </CommandDialog>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Notifications bell ── */}
              <div id="pat-notifications-bell" className="mb-12">
                <ComponentLabel>{"Notifications bell"}</ComponentLabel>
                <ComponentDesc>{"The mention/assignment feed from "}<code className="font-mono text-xs bg-muted px-1 rounded">NotificationsBell</code>{" — a "}<code className="font-mono text-xs bg-muted px-1 rounded">Popover</code>{" panel listing recent activity, unread rows tinted "}<code className="font-mono text-xs bg-muted px-1 rounded">bg-primary/[0.04]</code>{" with a dot, and a destructive unread-count badge on the trigger."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    const notifications = [
                      { id: 'n1', kind: 'mention' as const, actor: '@sarah', summary: 'mentioned you', ticket: '#142 Refresh-token rotation', message: 'Can you take a look at the retry logic here before we ship?', when: '14m ago', at: '2026-06-07T09:00:00Z' },
                      { id: 'n2', kind: 'assign' as const, actor: '@github-bot', summary: 'assigned you', ticket: '#138 Webhook signature check', when: '2h ago', at: '2026-06-07T07:30:00Z' },
                      { id: 'n3', kind: 'mention' as const, actor: '@marco', summary: 'mentioned you', ticket: '#129 Onboarding rewrite', message: 'Left a comment on the new copy — wdyt?', when: 'yesterday', at: '2026-06-06T10:00:00Z' },
                      { id: 'n4', kind: 'assign' as const, actor: '@priya', summary: 'assigned you', ticket: '#121 Sandbox cold-start', when: '3d ago', at: '2026-06-04T08:00:00Z' },
                    ];
                    const unread = notifications.filter((n) => !notifLastSeen || n.at > notifLastSeen);
                    const markAllRead = () => setNotifLastSeen(notifications[0].at);
                    return (
                      <Popover open={notifBellOpen} onOpenChange={setNotifBellOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="relative h-8 w-8 p-0 text-muted-foreground/60 hover:text-foreground"
                            aria-label={unread.length ? `${unread.length} unread notifications` : 'Notifications'}
                          >
                            <Bell className="h-4 w-4" />
                            {unread.length > 0 && (
                              <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-[3px] inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-semibold leading-none tabular-nums ring-2 ring-background">
                                {unread.length > 99 ? '99+' : unread.length}
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" sideOffset={8} className="w-[400px] p-0 overflow-hidden border-border/60">
                          <div className="flex items-center gap-2 px-4 h-10 border-b border-border/40">
                            <Bell className="h-3.5 w-3.5 text-muted-foreground/55" />
                            <span className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground/55 font-semibold">Notifications</span>
                            {unread.length > 0 && <span className="text-[10px] text-muted-foreground/60 tabular-nums">{unread.length} new</span>}
                            <Button variant="ghost" size="sm" className="ml-auto h-6 px-2 text-[11px] text-muted-foreground/60 hover:text-foreground gap-1 disabled:opacity-40" onClick={markAllRead} disabled={unread.length === 0}>
                              <CheckCheck className="h-3 w-3" />
                              Mark all read
                            </Button>
                          </div>
                          <ul className="max-h-[420px] overflow-y-auto divide-y divide-border/30">
                            {notifications.map((n) => {
                              const isUnread = !notifLastSeen || n.at > notifLastSeen;
                              const KindIcon = n.kind === 'mention' ? AtSign : UserPlus;
                              const kindColor = n.kind === 'mention' ? 'text-primary/80' : 'text-emerald-500/80';
                              return (
                                <li key={n.id}>
                                  <button
                                    onClick={() => { setNotifBellOpen(false); toast.message(`Opening ${n.ticket}`); }}
                                    className={cn('w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-muted/25 transition-colors cursor-pointer', isUnread && 'bg-primary/[0.04]')}
                                  >
                                    <div className="relative shrink-0">
                                      <UserAvatar handle={n.actor} size="md" />
                                      <span className={cn('absolute -bottom-0.5 -right-0.5 inline-flex h-[14px] w-[14px] items-center justify-center rounded-full bg-background ring-1 ring-border/60', kindColor)}>
                                        <KindIcon className="h-2.5 w-2.5" />
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-baseline gap-1.5 text-[12px] text-foreground/85">
                                        <span className="font-semibold truncate max-w-[110px]">{n.actor}</span>
                                        <span className="text-muted-foreground/70 truncate">{n.summary}</span>
                                        <span className="text-muted-foreground/55 truncate">on {n.ticket}</span>
                                      </div>
                                      {n.message && <p className="text-[12px] text-muted-foreground/75 line-clamp-2 mt-0.5 leading-snug">{n.message}</p>}
                                    </div>
                                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                                      <span className="text-[10px] text-muted-foreground/45 tabular-nums whitespace-nowrap">{n.when}</span>
                                      {isUnread && <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-label="unread" />}
                                    </div>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </PopoverContent>
                      </Popover>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Notification settings ── */}
              <div id="pat-notifications-settings" className="mb-12">
                <ComponentLabel>{"Notification settings"}</ComponentLabel>
                <ComponentDesc>{"The Notifications tab from "}<code className="font-mono text-xs bg-muted px-1 rounded">user-settings-modal.tsx</code>{" — a master "}<code className="font-mono text-xs bg-muted px-1 rounded">Switch</code>{" that reveals grouped per-type and behavior toggles, each an icon + label/description row."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    const NotificationToggle = ({ icon: Icon, label, description, enabled, onToggle }: { icon: typeof Bell; label: string; description: string; enabled: boolean; onToggle: (v: boolean) => void }) => (
                      <div className="flex items-start justify-between gap-4 px-4 py-3">
                        <div className="flex items-start gap-3 flex-1">
                          <Icon className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="space-y-0.5 flex-1">
                            <Label className="text-sm font-medium cursor-pointer">{label}</Label>
                            <p className="text-xs text-muted-foreground">{description}</p>
                          </div>
                        </div>
                        <Switch checked={enabled} onCheckedChange={onToggle} />
                      </div>
                    );
                    return (
                      <div className="max-w-md rounded-2xl border border-border/60 bg-card overflow-hidden">
                        <div className="p-6 space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            <p className="text-sm text-muted-foreground mt-1">Configure how and when you receive notifications.</p>
                          </div>
                          <div className="rounded-2xl border border-border/60">
                            <NotificationToggle icon={Bell} label="Enable notifications" description="Browser permission granted" enabled={notifEnabled} onToggle={setNotifEnabled} />
                          </div>
                          {notifEnabled && (
                            <>
                              <div>
                                <h4 className="text-sm font-medium mb-3">Notification types</h4>
                                <div className="rounded-2xl border border-border/60 divide-y divide-border/60">
                                  <NotificationToggle icon={CheckCircle2} label="Task completions" description="When a session finishes its task" enabled={notifPrefs.onCompletion} onToggle={(v) => setNotifPrefs((p) => ({ ...p, onCompletion: v }))} />
                                  <NotificationToggle icon={AlertTriangle} label="Errors" description="When a session encounters an error" enabled={notifPrefs.onError} onToggle={(v) => setNotifPrefs((p) => ({ ...p, onError: v }))} />
                                  <NotificationToggle icon={HelpCircle} label="Questions" description="When Kortix needs your input to continue" enabled={notifPrefs.onQuestion} onToggle={(v) => setNotifPrefs((p) => ({ ...p, onQuestion: v }))} />
                                  <NotificationToggle icon={ShieldCheck} label="Permission requests" description="When Kortix needs permission to use a tool" enabled={notifPrefs.onPermission} onToggle={(v) => setNotifPrefs((p) => ({ ...p, onPermission: v }))} />
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-3">Behavior</h4>
                                <div className="rounded-2xl border border-border/60 divide-y divide-border/60">
                                  <NotificationToggle icon={EyeOff} label="Only when tab is hidden" description="Only notify when you're on another tab" enabled={notifPrefs.onlyWhenHidden} onToggle={(v) => setNotifPrefs((p) => ({ ...p, onlyWhenHidden: v }))} />
                                  <NotificationToggle icon={Volume2} label="Notification sound" description="Play a sound when a notification is sent" enabled={notifPrefs.playSound} onToggle={(v) => setNotifPrefs((p) => ({ ...p, playSound: v }))} />
                                </div>
                              </div>
                              <Button onClick={() => toast.message('Test notification sent')} variant="outline" size="sm">Send test notification</Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Wallpaper picker ── */}
              <div id="pat-wallpaper-picker" className="mb-12">
                <ComponentLabel>{"Wallpaper picker"}</ComponentLabel>
                <ComponentDesc>{"The "}<code className="font-mono text-xs bg-muted px-1 rounded">WallpaperCard</code>{" grid from "}<code className="font-mono text-xs bg-muted px-1 rounded">appearance-tab.tsx</code>{" — each "}<code className="font-mono text-xs bg-muted px-1 rounded">aspect-video</code>{" card renders its "}<code className="font-mono text-xs bg-muted px-1 rounded">WallpaperBackground</code>{" variant at thumbnail size, with a "}<code className="font-mono text-xs bg-muted px-1 rounded">border-primary</code>{" ring + check badge on the active pick (mocked previews stand in for the real SVG/shader assets)."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    const wallpapers: { id: string; name: string; isDefault?: boolean; preview: React.ReactNode }[] = [
                      {
                        id: 'brandmark', name: 'Brandmark', isDefault: true,
                        preview: (
                          <div className="absolute inset-0 flex items-center justify-center bg-background">
                            <div className="size-[140%] rounded-full border-[16px] border-foreground/[0.06]" />
                          </div>
                        ),
                      },
                      {
                        id: 'symbol', name: 'Symbol',
                        preview: (
                          <div className="absolute inset-0 flex items-center justify-center bg-background">
                            <div className="size-10 rounded-xl bg-foreground/[0.08]" />
                          </div>
                        ),
                      },
                      {
                        id: 'aurora', name: 'Aurora',
                        preview: (
                          <div
                            className="absolute inset-0 bg-[#0b0b0c]"
                            style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(168,85,247,0.35), transparent 55%), radial-gradient(circle at 70% 65%, rgba(56,189,248,0.3), transparent 55%)' }}
                          />
                        ),
                      },
                      {
                        id: 'nebula', name: 'Pixel Beams',
                        preview: (
                          <div
                            className="absolute inset-0 bg-[#0b0b0c]"
                            style={{ backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 14px)' }}
                          />
                        ),
                      },
                      {
                        id: 'ascii-tunnel', name: 'ASCII Tunnel',
                        preview: (
                          <div className="absolute inset-0 flex items-center justify-center bg-black font-mono text-[8px] leading-[10px] text-emerald-400/50 overflow-hidden tracking-widest">
                            <span>{'./. -:+*#%@*+:-. ./. -:+*#%@*+:-.'}</span>
                          </div>
                        ),
                      },
                      {
                        id: 'matrix', name: 'Enter the Matrix',
                        preview: (
                          <div
                            className="absolute inset-0 bg-black"
                            style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(16,185,129,0.35) 0 1px, transparent 1px 8px)' }}
                          />
                        ),
                      },
                    ];
                    return (
                      <div className="grid grid-cols-3 gap-2 max-w-xl">
                        {wallpapers.map((wp) => {
                          const active = wallpaperId === wp.id;
                          return (
                            <button
                              key={wp.id}
                              type="button"
                              onClick={() => setWallpaperId(wp.id)}
                              className="group relative cursor-pointer rounded-2xl text-left"
                            >
                              <div className={cn(
                                'relative w-full aspect-video bg-background overflow-hidden rounded-2xl isolate border transition-colors duration-200',
                                active ? 'border-primary' : 'border-border group-hover:border-border/80',
                              )}>
                                {wp.preview}
                                <div className={cn(
                                  'absolute inset-0 transition-colors duration-200 pointer-events-none',
                                  !active && 'group-hover:bg-foreground/[0.06]',
                                )} />
                                {active && (
                                  <div className="absolute top-1 right-1 size-4 rounded-full bg-primary flex items-center justify-center shadow-md">
                                    <Check className="size-2.5 text-primary-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="px-1.5 py-1">
                                <span className="text-xs font-medium text-foreground flex items-center gap-1">
                                  {wp.name}
                                  {wp.isDefault && (
                                    <span className="text-xs font-medium px-1 py-px rounded-full bg-muted text-muted-foreground">Default</span>
                                  )}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Agent & user avatars ── */}
              <div id="pat-agent-avatar" className="mb-12">
                <ComponentLabel>{"Agent & user avatars"}</ComponentLabel>
                <ComponentDesc>{"The "}<code className="font-mono text-xs bg-muted px-1 rounded">AgentAvatar</code>{"/"}<code className="font-mono text-xs bg-muted px-1 rounded">UserAvatar</code>{" pair from "}<code className="font-mono text-xs bg-muted px-1 rounded">kortix/agent-avatar.tsx</code>{" — agents get a persistent hue + Lucide icon on a fixed-saturation HSL background ("}<code className="font-mono text-xs bg-muted px-1 rounded">agentColors</code>{"); users get the same circular treatment with a handle-derived hue ("}<code className="font-mono text-xs bg-muted px-1 rounded">hashHue</code>{") and initials, so mixed assignee rows stay visually aligned."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    const colorsFor = (hue: number) => ({
                      bg: `hsl(${hue} 55% 22%)`,
                      fg: `hsl(${hue} 90% 80%)`,
                      ring: `hsl(${hue} 70% 45% / 0.45)`,
                    });
                    const hashHue = (s: string) => {
                      let h = 0;
                      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
                      return Math.abs(h) % 360;
                    };
                    const MiniAgentAvatar = ({ hue, icon: Icon, slug, size = 24 }: { hue: number; icon: typeof Bot; slug: string; size?: number }) => {
                      const c = colorsFor(hue);
                      return (
                        <span
                          className="inline-flex items-center justify-center rounded-full shrink-0"
                          style={{ width: size, height: size, backgroundColor: c.bg, color: c.fg, boxShadow: `inset 0 0 0 1px ${c.ring}` }}
                          title={`@${slug}`}
                        >
                          <Icon style={{ width: size * 0.58, height: size * 0.58 }} />
                        </span>
                      );
                    };
                    const MiniUserAvatar = ({ handle, size = 24 }: { handle: string; size?: number }) => {
                      const c = colorsFor(hashHue(handle));
                      return (
                        <span
                          className="inline-flex items-center justify-center rounded-full shrink-0 font-semibold leading-none"
                          style={{ width: size, height: size, backgroundColor: c.bg, color: c.fg, boxShadow: `inset 0 0 0 1px ${c.ring}`, fontSize: size * 0.42 }}
                          title={`@${handle}`}
                        >
                          {handle.charAt(0).toUpperCase()}
                        </span>
                      );
                    };
                    const agents = [
                      { slug: 'kortix', hue: 210, icon: Bot },
                      { slug: 'qa-bot', hue: 145, icon: ClipboardCheck },
                      { slug: 'sec-review', hue: 280, icon: Shield },
                      { slug: 'doc-writer', hue: 35, icon: BookOpen },
                      { slug: 'researcher', hue: 200, icon: Search },
                    ];
                    const users = ['sarah', 'marco', 'priya', 'alex'];
                    return (
                      <div className="space-y-5">
                        <div>
                          <p className="text-xs text-muted-foreground mb-2.5">{"Agents — hue + icon, fixed saturation/lightness"}</p>
                          <div className="flex flex-wrap items-center gap-3">
                            {agents.map((a) => (
                              <div key={a.slug} className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/20 py-1 pl-1 pr-3">
                                <MiniAgentAvatar hue={a.hue} icon={a.icon} slug={a.slug} size={26} />
                                <span className="text-xs text-foreground/80">@{a.slug}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2.5">{"Users — handle-derived hue (hashHue), initials fallback"}</p>
                          <div className="flex flex-wrap items-center gap-3">
                            {users.map((u) => (
                              <div key={u} className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/20 py-1 pl-1 pr-3">
                                <MiniUserAvatar handle={u} size={26} />
                                <span className="text-xs text-foreground/80">@{u}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2.5">{"Size scale (xs · sm · md · lg)"}</p>
                          <div className="flex items-center gap-3">
                            {[16, 20, 24, 32].map((s) => (
                              <MiniAgentAvatar key={s} hue={210} icon={Bot} slug="kortix" size={s} />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Mention textarea ── */}
              <div id="pat-mention-textarea" className="mb-12">
                <ComponentLabel>{"Mention textarea"}</ComponentLabel>
                <ComponentDesc>{"@-mention autocomplete from "}<code className="font-mono text-xs bg-muted px-1 rounded">kortix/mention-textarea.tsx</code>{" — typing "}<code className="font-mono text-xs bg-muted px-1 rounded">@</code>{" opens a dropdown of team members (agents + users), filtered by handle prefix; selecting one inserts "}<code className="font-mono text-xs bg-muted px-1 rounded">@slug </code>{" at the cursor. Mocked here as a trigger button for the menu — the real component drives it from live cursor position and a character-exact tokenizer overlay."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    const team = [
                      { slug: 'sarah', kind: 'user' as const, hue: 210 },
                      { slug: 'marco', kind: 'user' as const, hue: 30 },
                      { slug: 'kortix', kind: 'agent' as const, hue: 210, icon: Bot },
                      { slug: 'qa-bot', kind: 'agent' as const, hue: 145, icon: ClipboardCheck },
                    ];
                    const colorsFor = (hue: number) => ({ bg: `hsl(${hue} 55% 22%)`, fg: `hsl(${hue} 90% 80%)`, ring: `hsl(${hue} 70% 45% / 0.45)` });
                    const insertMention = (slug: string) => {
                      setMentionText((t) => {
                        const at = t.lastIndexOf('@');
                        return at >= 0 ? `${t.slice(0, at)}@${slug} ` : `${t}@${slug} `;
                      });
                      setMentionMenuOpen(false);
                    };
                    return (
                      <div className="max-w-lg space-y-2">
                        <Popover open={mentionMenuOpen} onOpenChange={setMentionMenuOpen}>
                          <PopoverTrigger asChild>
                            <div className="rounded-2xl border border-border bg-card px-3.5 py-3 transition-colors focus-within:border-foreground/20">
                              <textarea
                                value={mentionText}
                                onChange={(e) => setMentionText(e.target.value)}
                                onKeyUp={(e) => { if (e.key === '@') setMentionMenuOpen(true); }}
                                rows={3}
                                className="w-full resize-none border-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
                              />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-64 p-1.5">
                            <p className="px-2 pb-1 pt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/55 font-semibold">Mention someone</p>
                            <div className="space-y-0.5">
                              {team.map((m) => {
                                const c = colorsFor(m.hue);
                                const Icon = m.kind === 'agent' ? m.icon! : null;
                                return (
                                  <button
                                    key={m.slug}
                                    type="button"
                                    onClick={() => insertMention(m.slug)}
                                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-foreground/[0.05] transition-colors"
                                  >
                                    <span
                                      className="inline-flex h-6 w-6 items-center justify-center rounded-full shrink-0 text-[10px] font-semibold"
                                      style={{ backgroundColor: c.bg, color: c.fg, boxShadow: `inset 0 0 0 1px ${c.ring}` }}
                                    >
                                      {Icon ? <Icon className="size-3.5" /> : m.slug.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="text-foreground/85">@{m.slug}</span>
                                    {m.kind === 'agent' && <Badge variant="outline" size="sm" className="ml-auto">Agent</Badge>}
                                  </button>
                                );
                              })}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Button variant="outline" size="sm" onClick={() => setMentionMenuOpen(true)}>
                          <AtSign className="size-3.5" />
                          Mention someone
                        </Button>
                      </div>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Status pill ── */}
              <div id="pat-status-pill" className="mb-12">
                <ComponentLabel>{"Status pill"}</ComponentLabel>
                <ComponentDesc>{"The "}<code className="font-mono text-xs bg-muted px-1 rounded">StatusPill</code>{" dropdown from "}<code className="font-mono text-xs bg-muted px-1 rounded">kortix/task-pills.tsx</code>{" — used across the task tracker. A "}<code className="font-mono text-xs bg-muted px-1 rounded">DropdownMenu</code>{" trigger shows the current status icon + label (tinted per "}<code className="font-mono text-xs bg-muted px-1 rounded">STATUS_META</code>{"); the menu lists every status with a check on the active one."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    const STATUS_META = {
                      planned: { icon: Circle, color: 'text-muted-foreground/70', label: 'Planned' },
                      running: { icon: CircleDot, color: 'text-blue-400', label: 'Running' },
                      completed: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Completed' },
                    } as const;
                    const ALL: (keyof typeof STATUS_META)[] = ['planned', 'running', 'completed'];
                    const meta = STATUS_META[taskStatus];
                    const Icon = meta.icon;
                    return (
                      <div className="flex items-center gap-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs gap-1.5 font-medium">
                              <Icon className={cn('h-3.5 w-3.5', meta.color)} />
                              {meta.label}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-44">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Status</DropdownMenuLabel>
                            {ALL.map((s) => {
                              const M = STATUS_META[s];
                              const I = M.icon;
                              return (
                                <DropdownMenuItem key={s} onClick={() => setTaskStatus(s)}>
                                  <I className={cn('h-3.5 w-3.5 mr-2', M.color)} />
                                  {M.label}
                                  {taskStatus === s && <Check className="h-3 w-3 ml-auto" />}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md" title={meta.label}>
                          <Icon className={cn('h-4 w-4', meta.color)} />
                        </Button>
                        <span className="text-xs text-muted-foreground/50">{"← icon-only variant"}</span>
                      </div>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Diff view ── */}
              <div id="pat-diff-view" className="mb-12">
                <ComponentLabel>{"Diff view"}</ComponentLabel>
                <ComponentDesc>{"The shared "}<code className="font-mono text-xs bg-muted px-1 rounded">DiffView</code>{" from "}<code className="font-mono text-xs bg-muted px-1 rounded">diff/diff-view.tsx</code>{" — wraps "}<code className="font-mono text-xs bg-muted px-1 rounded">@pierre/diffs</code>{" with project defaults: split layout, bar indicators, word-level inline highlighting, theme-aware via "}<code className="font-mono text-xs bg-muted px-1 rounded">next-themes</code>{". The real renderer needs the Pierre engine — this mocks its split-pane chrome and +/- line treatment with plain markup."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    const before = ['export function retry(fn, attempts = 3) {', '  for (let i = 0; i < attempts; i++) {', '    try { return fn(); }', '    catch (e) { if (i === attempts - 1) throw e; }', '  }', '}'];
                    const after = ['export function retry(fn, attempts = 3, delayMs = 200) {', '  for (let i = 0; i < attempts; i++) {', '    try { return await fn(); }', '    catch (e) {', '      if (i === attempts - 1) throw e;', '      await sleep(delayMs * (i + 1));', '    }', '  }', '}'];
                    return (
                      <div className="overflow-hidden rounded-2xl border border-border/60">
                        <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-3.5 py-2 text-xs">
                          <FileCode className="size-3.5 text-muted-foreground/60" />
                          <span className="font-mono text-foreground/75">src/lib/retry.ts</span>
                          <span className="ml-auto flex items-center gap-2 text-muted-foreground/50">
                            <span className="text-emerald-500">+5</span>
                            <span className="text-destructive/70">−1</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-border/40 font-mono text-xs leading-[1.7]">
                          <div className="overflow-x-auto">
                            {before.map((line, i) => {
                              const removed = i === 2;
                              return (
                                <div key={i} className={cn('flex gap-3 px-3', removed && 'bg-destructive/[0.07]')}>
                                  <span className="w-4 shrink-0 select-none text-right text-muted-foreground/30">{i + 1}</span>
                                  <span className={cn('shrink-0 select-none', removed ? 'text-destructive/70' : 'text-transparent')}>{removed ? '−' : ' '}</span>
                                  <span className="whitespace-pre text-foreground/75">{line}</span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="overflow-x-auto">
                            {after.map((line, i) => {
                              const added = [0, 2, 3, 4, 5].includes(i);
                              return (
                                <div key={i} className={cn('flex gap-3 px-3', added && 'bg-emerald-500/[0.07]')}>
                                  <span className="w-4 shrink-0 select-none text-right text-muted-foreground/30">{i + 1}</span>
                                  <span className={cn('shrink-0 select-none', added ? 'text-emerald-500/80' : 'text-transparent')}>{added ? '+' : ' '}</span>
                                  <span className="whitespace-pre text-foreground/75">{line}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Session sidebar ── */}
              <div id="pat-session-sidebar" className="mb-12">
                <ComponentLabel>{"Session sidebar"}</ComponentLabel>
                <ComponentDesc>{"The collapsible nav rail from "}<code className="font-mono text-xs bg-muted px-1 rounded">sidebar/sidebar-left.tsx</code>{" — logo header with collapse toggle, "}<code className="font-mono text-xs bg-muted px-1 rounded">New session</code>{" / Search / Files rows with "}<code className="font-mono text-xs bg-muted px-1 rounded">⌘J</code>{"-style kbd hints, and a session list with the selected-row tint ("}<code className="font-mono text-xs bg-muted px-1 rounded">bg-primary/[0.05] border-l-2 border-l-primary</code>{"). Collapsing reduces it to an icon-only rail — the same treatment the real sidebar uses."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    const sessions = [
                      { id: 's1', name: 'auth-rewrite: rotate refresh tokens', when: '2h ago' },
                      { id: 's2', name: 'fix(billing): webhook retries', when: '5h ago' },
                      { id: 's3', name: 'docs: onboarding rewrite', when: 'yesterday' },
                      { id: 's4', name: 'migration ordering bugfix', when: '2d ago' },
                    ];
                    const navRow = (icon: React.ReactNode, label: string, kbd?: string) => (
                      <button
                        type="button"
                        className={cn(
                          'group/row flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium text-foreground/80 transition-colors hover:bg-muted/60',
                          sidebarCollapsed && 'justify-center px-0',
                        )}
                        title={sidebarCollapsed ? label : undefined}
                      >
                        <span className="shrink-0 text-foreground/70">{icon}</span>
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1 truncate">{label}</span>
                            {kbd && (
                              <span className="flex items-center gap-0.5 rounded-md border border-border/50 bg-muted/40 px-1 py-px text-[10px] text-muted-foreground/60 font-mono">
                                {kbd}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    );
                    return (
                      <div className={cn('flex h-[420px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-muted/10 transition-[width] duration-200', sidebarCollapsed ? 'w-[68px]' : 'w-[260px]')}>
                        <div className="flex h-12 shrink-0 items-center justify-between px-3">
                          {!sidebarCollapsed && <EntityAvatar label="Suna" size="sm" />}
                          <button
                            type="button"
                            onClick={() => setSidebarCollapsed((c) => !c)}
                            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            className={cn('flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground', sidebarCollapsed && 'mx-auto')}
                          >
                            {sidebarCollapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
                          </button>
                        </div>
                        <nav className="shrink-0 space-y-0.5 px-2.5 pb-2">
                          {navRow(<SquarePen className="size-4" />, 'New session', '⌘J')}
                          {navRow(<Search className="size-4" />, 'Search', '⌘K')}
                          {navRow(<FolderOpen className="size-4" />, 'Files')}
                        </nav>
                        <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-2.5">
                          {!sidebarCollapsed && (
                            <p className="flex items-center gap-1.5 px-2.5 pb-1 pt-1 text-[10px] uppercase tracking-wider text-muted-foreground/45 font-semibold">
                              <ListTree className="size-3" /> Sessions
                            </p>
                          )}
                          <ul className="space-y-0.5">
                            {sessions.map((s) => {
                              const active = sidebarActiveSession === s.id;
                              return (
                                <li key={s.id}>
                                  <button
                                    type="button"
                                    onClick={() => setSidebarActiveSession(s.id)}
                                    title={sidebarCollapsed ? s.name : undefined}
                                    className={cn(
                                      'flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors',
                                      sidebarCollapsed && 'justify-center px-0',
                                      active ? 'bg-primary/[0.05] border-l-2 border-l-primary text-foreground' : 'border-l-2 border-l-transparent text-muted-foreground/75 hover:bg-muted/50 hover:text-foreground',
                                    )}
                                  >
                                    <MessageCircle className="size-3.5 shrink-0" />
                                    {!sidebarCollapsed && (
                                      <>
                                        <span className="flex-1 truncate">{s.name}</span>
                                        <span className="shrink-0 text-[10px] text-muted-foreground/40 tabular-nums">{s.when}</span>
                                      </>
                                    )}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="shrink-0 border-t border-border/50 px-2.5 py-2.5">
                          {navRow(<History className="size-4" />, 'History')}
                        </div>
                      </div>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── File tree ── */}
              <div id="pat-file-tree" className="mb-12">
                <ComponentLabel>{"File tree"}</ComponentLabel>
                <ComponentDesc>{"The "}<code className="font-mono text-xs bg-muted px-1 rounded">TreeRow</code>{" browser from "}<code className="font-mono text-xs bg-muted px-1 rounded">home/developers/repo-browser.tsx</code>{" — recursive rows with depth-based indent ("}<code className="font-mono text-xs bg-muted px-1 rounded">paddingLeft: depth * 14 + 8</code>{"), a rotating chevron for directories, extension-mapped file icons, and the selected-file row tinted "}<code className="font-mono text-xs bg-muted px-1 rounded">bg-primary/[0.07]</code>{". Paired here with a minimal preview pane mirroring the master-detail layout."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    type Node = { name: string; path?: string; children?: Node[] };
                    const TREE: Node[] = [
                      { name: 'src', children: [
                        { name: 'components', children: [
                          { name: 'button.tsx', path: 'src/components/button.tsx' },
                          { name: 'card.tsx', path: 'src/components/card.tsx' },
                        ]},
                        { name: 'lib', children: [
                          { name: 'retry.ts', path: 'src/lib/retry.ts' },
                          { name: 'utils.ts', path: 'src/lib/utils.ts' },
                        ]},
                        { name: 'index.ts', path: 'src/index.ts' },
                      ]},
                      { name: 'package.json', path: 'package.json' },
                      { name: 'tsconfig.json', path: 'tsconfig.json' },
                      { name: 'README.md', path: 'README.md' },
                    ];
                    const fileIcon = (name: string) => {
                      if (name.endsWith('.json')) return FileJson;
                      if (name.endsWith('.md')) return FileText;
                      return FileCode;
                    };
                    const toggle = (path: string) => setFileTreeExpanded((prev) => {
                      const next = new Set(prev);
                      if (next.has(path)) next.delete(path); else next.add(path);
                      return next;
                    });
                    const TreeRow = ({ node, depth, dirPath = '' }: { node: Node; depth: number; dirPath?: string }): React.ReactElement => {
                      const isDir = !!node.children;
                      const selfPath = dirPath ? `${dirPath}/${node.name}` : node.name;
                      const isOpen = isDir && fileTreeExpanded.has(selfPath);
                      const isActive = !isDir && node.path === fileTreeSelected;
                      const Icon = isDir ? (isOpen ? FolderOpen : Folder) : fileIcon(node.name);
                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => (isDir ? toggle(selfPath) : node.path && setFileTreeSelected(node.path))}
                            className={cn(
                              'group flex w-full cursor-pointer items-center gap-1.5 rounded-lg py-1 pr-2 text-left text-sm transition-colors',
                              isActive ? 'bg-primary/[0.07] text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                            )}
                            style={{ paddingLeft: depth * 14 + 8 }}
                          >
                            {isDir ? (
                              <ChevronRight className={cn('size-3.5 shrink-0 text-muted-foreground/60 transition-transform', isOpen && 'rotate-90')} />
                            ) : (
                              <span className="w-3.5 shrink-0" />
                            )}
                            <Icon className="size-4 shrink-0" />
                            <span className="truncate">{node.name}</span>
                          </button>
                          {isDir && isOpen && node.children!.map((child) => (
                            <TreeRow key={child.name} node={child} depth={depth + 1} dirPath={selfPath} />
                          ))}
                        </>
                      );
                    };
                    const segments = fileTreeSelected.split('/');
                    const fileName = segments[segments.length - 1];
                    const previewLines: Record<string, string[]> = {
                      'src/lib/retry.ts': ['export function retry(fn, attempts = 3) {', '  for (let i = 0; i < attempts; i++) {', '    try { return fn(); }', '    catch (e) { if (i === attempts - 1) throw e; }', '  }', '}'],
                      'package.json': ['{', '  "name": "@kortix/ui",', '  "version": "0.1.0",', '  "private": true', '}'],
                      'README.md': ['# Kortix UI', '', 'Shared component library for Suna surfaces.'],
                    };
                    const lines = previewLines[fileTreeSelected] ?? ['// ' + fileName, '', '(preview not mocked for this file)'];
                    return (
                      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
                        <div className="flex h-11 items-center gap-2.5 border-b border-border/60 bg-muted/30 px-4">
                          <span className="flex size-5 items-center justify-center rounded-md bg-foreground text-[10px] font-semibold text-background">K</span>
                          <span className="text-sm font-medium text-foreground">kortix-ui</span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2 py-0.5 text-xs text-muted-foreground">
                            <GitBranch className="size-3" />
                            main
                          </span>
                        </div>
                        <div className="grid h-[420px] grid-cols-[200px_minmax(0,1fr)]">
                          <div className="overflow-y-auto border-r border-border/60 bg-muted/[0.18] p-2">
                            {TREE.map((node) => <TreeRow key={node.name} node={node} depth={0} />)}
                          </div>
                          <div className="flex min-w-0 flex-col overflow-hidden">
                            <div className="flex items-center gap-1.5 border-b border-border/50 px-4 py-2 text-xs text-muted-foreground/70">
                              {segments.map((seg, i) => (
                                <span key={i} className="flex items-center gap-1.5">
                                  {i > 0 && <span className="text-muted-foreground/30">/</span>}
                                  <span className={i === segments.length - 1 ? 'text-foreground/80 font-medium' : undefined}>{seg}</span>
                                </span>
                              ))}
                            </div>
                            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-[1.7] text-foreground/75">
                              {lines.map((line, i) => (
                                <div key={i} className="flex gap-3">
                                  <span className="w-4 shrink-0 select-none text-right text-muted-foreground/30">{i + 1}</span>
                                  <span className="whitespace-pre">{line}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Terminal output ── */}
              <div id="pat-terminal-output" className="mb-12">
                <ComponentLabel>{"Terminal output"}</ComponentLabel>
                <ComponentDesc>{"The dark monospace log surface from "}<code className="font-mono text-xs bg-muted px-1 rounded">session/pty-terminal.tsx</code>{" + "}<code className="font-mono text-xs bg-muted px-1 rounded">session-terminal-panel.tsx</code>{" — a chrome bar with the live/idle status dot, and a scrollable mono log pane with mocked ANSI-style coloring (stdout, stderr, success, paths) standing in for "}<code className="font-mono text-xs bg-muted px-1 rounded">xterm.js</code>{" output."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    type LogLine = { text: string; tone?: 'muted' | 'success' | 'error' | 'accent' };
                    const LOG: LogLine[] = [
                      { text: '$ pnpm test --filter @kortix/ui', tone: 'accent' },
                      { text: 'Scope: 1 of 14 workspace projects', tone: 'muted' },
                      { text: '' },
                      { text: ' RUN  v2.1.4 packages/ui', tone: 'muted' },
                      { text: '' },
                      { text: ' ✓ src/components/tool-call-card.test.tsx (4 tests) 18ms', tone: 'success' },
                      { text: ' ✓ src/components/diff-view.test.tsx (6 tests) 31ms', tone: 'success' },
                      { text: ' ✗ src/components/mention-textarea.test.tsx (1 test) 9ms', tone: 'error' },
                      { text: '   → expected token "@sar" to resolve to "sarah-chen"', tone: 'error' },
                      { text: '' },
                      { text: ' Test Files  1 failed | 2 passed (3)', tone: 'muted' },
                      { text: '      Tests  1 failed | 9 passed (10)', tone: 'muted' },
                      { text: '' },
                      { text: '$ ', tone: 'accent' },
                    ];
                    const toneClass: Record<NonNullable<LogLine['tone']>, string> = {
                      muted: 'text-zinc-400',
                      success: 'text-emerald-400',
                      error: 'text-red-400',
                      accent: 'text-zinc-100',
                    };
                    return (
                      <div className="overflow-hidden rounded-2xl border border-border/70">
                        <div className="flex h-10 items-center gap-2 border-b border-border/60 bg-muted/30 px-4">
                          <Terminal className="size-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">Terminal</span>
                          <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Connected
                          </span>
                        </div>
                        <div className="h-[320px] overflow-y-auto bg-[#0f0f14] px-4 py-3 font-mono text-xs leading-[1.7]">
                          {LOG.map((line, i) => (
                            <div key={i} className={cn('whitespace-pre', toneClass[line.tone ?? 'muted'])}>
                              {line.text || ' '}
                            </div>
                          ))}
                          <div className="flex items-center gap-1.5 text-zinc-100">
                            <span>{' '}</span>
                            <span className="inline-block h-[14px] w-[7px] animate-pulse bg-zinc-100/80" />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── Tab bar & split layout ── */}
              <div id="pat-tab-bar" className="mb-12">
                <ComponentLabel>{"Tab bar & split layout"}</ComponentLabel>
                <ComponentDesc>{"Chrome from "}<code className="font-mono text-xs bg-muted px-1 rounded">tabs/tab-bar.tsx</code>{" (38px tabs, "}<code className="font-mono text-xs bg-muted px-1 rounded">{'absolute -bottom-px h-[2px] bg-foreground/80'}</code>{" active underline, close buttons) above a "}<code className="font-mono text-xs bg-muted px-1 rounded">session-layout.tsx</code>{"-style split: a main pane and a side panel switching between Actions / Browser / Files / Terminal via plain underline tabs."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    const TABS = [
                      { id: 'session-layout', label: 'session-layout.tsx', icon: FileCode },
                      { id: 'retry', label: 'retry.ts', icon: FileCode },
                      { id: 'readme', label: 'README.md', icon: FileText },
                    ];
                    const SIDE_TABS: { id: typeof demoSidePanelTab; label: string }[] = [
                      { id: 'actions', label: 'Actions' },
                      { id: 'browser', label: 'Browser' },
                      { id: 'files', label: 'Files' },
                      { id: 'terminal', label: 'Terminal' },
                    ];
                    return (
                      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
                        {/* tab bar */}
                        <div className="flex h-[38px] items-center border-b border-border/60 bg-muted/20 pl-1 pr-2">
                          <div className="flex h-full flex-1 items-center gap-0.5 overflow-x-auto scrollbar-hide">
                            {TABS.map((tab) => {
                              const active = demoActiveTab === tab.id;
                              const Icon = tab.icon;
                              return (
                                <button
                                  key={tab.id}
                                  type="button"
                                  onClick={() => setDemoActiveTab(tab.id)}
                                  className={cn(
                                    'group relative flex h-full cursor-pointer items-center gap-1.5 rounded-t-lg px-3 text-sm transition-colors',
                                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                                  )}
                                >
                                  <Icon className="size-3.5 shrink-0 text-muted-foreground/70" />
                                  <span className="max-w-[140px] truncate">{tab.label}</span>
                                  <X className="size-3.5 shrink-0 rounded text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/60 hover:bg-muted" />
                                  {active && <span className="absolute -bottom-px left-2 right-2 h-[2px] bg-foreground/80" />}
                                </button>
                              );
                            })}
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2 py-0.5 text-xs text-muted-foreground">
                            <GitBranch className="size-3" />
                            main
                          </span>
                        </div>
                        {/* split layout */}
                        <div className="grid h-[340px] grid-cols-[minmax(0,1fr)_320px]">
                          <div className="flex flex-col gap-2 overflow-hidden border-r border-border/60 p-4">
                            <div className="text-sm font-medium text-foreground">{TABS.find((t) => t.id === demoActiveTab)?.label}</div>
                            <div className="flex-1 space-y-1.5 overflow-hidden font-mono text-xs leading-[1.7] text-muted-foreground/70">
                              <div>{"export function ResizableSessionLayout({ children, side }) {"}</div>
                              <div className="pl-4">{"const mainRef = useRef<ImperativePanelHandle>(null);"}</div>
                              <div className="pl-4">{"const sideRef = useRef<ImperativePanelHandle>(null);"}</div>
                              <div className="pl-4 text-muted-foreground/40">{"// … resizable panel group + handle"}</div>
                              <div>{"}"}</div>
                            </div>
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <div className="flex items-center gap-4 border-b border-border/50 px-4 pt-2.5">
                              {SIDE_TABS.map((tab) => {
                                const active = demoSidePanelTab === tab.id;
                                return (
                                  <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setDemoSidePanelTab(tab.id)}
                                    className={cn(
                                      'relative cursor-pointer pb-2.5 text-sm transition-colors',
                                      active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                                    )}
                                  >
                                    {tab.label}
                                    {active && <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-foreground/80" />}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex flex-1 items-center justify-center p-4 text-center text-sm text-muted-foreground">
                              {demoSidePanelTab === 'terminal' && <span className="inline-flex items-center gap-2"><Terminal className="size-4" />{'Terminal panel mock'}</span>}
                              {demoSidePanelTab === 'files' && <span className="inline-flex items-center gap-2"><Folder className="size-4" />{'File browser mock'}</span>}
                              {demoSidePanelTab === 'browser' && <span className="inline-flex items-center gap-2"><ImageIcon className="size-4" />{'Browser preview mock'}</span>}
                              {demoSidePanelTab === 'actions' && <span className="inline-flex items-center gap-2"><ListTree className="size-4" />{'Actions timeline mock'}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </DemoContainer>
              </div>

              {/* ── New session ── */}
              <div id="pat-new-session" className="mb-12">
                <ComponentLabel>{"New session"}</ComponentLabel>
                <ComponentDesc>{"The empty-state composer dock from "}<code className="font-mono text-xs bg-muted px-1 rounded">project-home.tsx</code>{" — full-bleed wallpaper backdrop ("}<code className="font-mono text-xs bg-muted px-1 rounded">SessionWelcome</code>{"), a chevron-paged "}<code className="font-mono text-xs bg-muted px-1 rounded">StarterPromptsCarousel</code>{" with edge-fade mask, and the pinned rounded composer — textarea, sandbox-template picker pill, and circular send button — matching the session chat input pixel-for-pixel."}</ComponentDesc>
                <DemoContainer>
                  {(() => {
                    const starters = [
                      { id: 'p1', icon: Building2, label: 'Onboard your agent' },
                      { id: 'p2', icon: Globe, label: 'Build a landing page' },
                      { id: 'p3', icon: Search, label: 'Research competitors' },
                      { id: 'p4', icon: Presentation, label: 'Create a pitch deck' },
                      { id: 'p5', icon: Scale, label: 'Draft a contract template' },
                      { id: 'p6', icon: BarChart3, label: 'Analyze last quarter' },
                    ];
                    const scrollRef = (node: HTMLDivElement | null) => { newSessionScrollRef.current = node; };
                    const scrollByPage = (dir: 1 | -1) => {
                      const el = newSessionScrollRef.current;
                      if (!el) return;
                      el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' });
                    };
                    return (
                      <div className="relative flex h-[460px] w-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-[#0b0b0c]">
                        {/* Wallpaper backdrop — dotted-grid stand-in for SessionWelcome */}
                        <div
                          className="pointer-events-none absolute inset-0 z-0 opacity-40"
                          aria-hidden
                          style={{
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)',
                            backgroundSize: '22px 22px',
                            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 30%, black 0%, transparent 70%)',
                            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 30%, black 0%, transparent 70%)',
                          }}
                        />
                        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
                          <EntityAvatar label="Suna" size="xl" className="shadow-sm" />
                          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">Suna</h1>
                        </div>
                        <div className="relative z-10 mx-auto w-full max-w-[40rem] px-4 pb-6">
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Previous suggestions"
                              disabled={newSessionAtStart}
                              onClick={() => scrollByPage(-1)}
                              className="shrink-0 text-white/50 hover:text-white hover:bg-white/10"
                            >
                              <ChevronLeft className="size-3.5" />
                            </Button>
                            <div
                              ref={scrollRef}
                              onScroll={(e) => {
                                const el = e.currentTarget;
                                setNewSessionAtStart(el.scrollLeft <= 4);
                                setNewSessionAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
                              }}
                              className="scrollbar-hide flex flex-1 items-center gap-2 overflow-x-auto"
                              style={{
                                WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
                                maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
                              }}
                            >
                              {starters.map((p) => {
                                const Icon = p.icon;
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setNewSessionText(`${p.label} for our team`)}
                                    className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
                                  >
                                    <Icon className="size-3.5" />
                                    {p.label}
                                  </button>
                                );
                              })}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="More suggestions"
                              disabled={newSessionAtEnd}
                              onClick={() => scrollByPage(1)}
                              className="shrink-0 text-white/50 hover:text-white hover:bg-white/10"
                            >
                              <ChevronRight className="size-3.5" />
                            </Button>
                          </div>

                          <div className="mt-2.5 w-full overflow-visible rounded-[24px] border border-border bg-card transition-colors focus-within:border-foreground/20">
                            <div className="flex flex-col gap-2">
                              <div className="px-3.5">
                                <textarea
                                  value={newSessionText}
                                  onChange={(e) => setNewSessionText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      if (newSessionText.trim()) { toast.success('Session started'); setNewSessionText(''); }
                                    }
                                  }}
                                  placeholder="Describe a task to start a session…"
                                  rows={1}
                                  className="relative max-h-[200px] min-h-[72px] w-full resize-none overflow-y-auto border-none bg-transparent px-0.5 pb-6 pt-4 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
                                />
                              </div>
                              <div className="mb-1.5 flex items-center justify-between gap-1 pl-2 pr-1.5">
                                <button
                                  type="button"
                                  aria-label="Sandbox template"
                                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2 py-1 text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
                                >
                                  <Package className="size-3.5" />
                                  <span className="max-w-[10rem] truncate">Default</span>
                                  <span className="size-1.5 rounded-full bg-emerald-500" />
                                </button>
                                <Button
                                  size="sm"
                                  onClick={() => { if (newSessionText.trim()) { toast.success('Session started'); setNewSessionText(''); } }}
                                  disabled={!newSessionText.trim()}
                                  aria-label="Start session"
                                  className="h-8 w-8 shrink-0 rounded-full p-0"
                                >
                                  <ArrowUp className="size-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </DemoContainer>
              </div>
            </section>

            {/* ═══════════════ Primitives ═══════════════ */}
            <section id="patterns">
              <SectionDivider />
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
                Primitives
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">{"Small composition pieces used inside project pages, issue details, and other structured internal surfaces that don't fit the hero + list shape."}</p>

              {/* ── PageShell ── */}
              <div id="pat-page-shell" className="mb-12">
                <ComponentLabel>PageShell</ComponentLabel>
                <ComponentDesc>{"The one layout wrapper. Standardises max-width, horizontal padding, and scroll behavior. Four width presets:"}{' '}
                  <code className="text-xs font-mono">{"reading (720)"}</code>,{' '}
                  <code className="text-xs font-mono">{"default (1000)"}</code>,{' '}
                  <code className="text-xs font-mono">{"wide (1280)"}</code>,{' '}
                  <code className="text-xs font-mono">full</code>.
                </ComponentDesc>
                <DemoContainer>
                  <div className="rounded-2xl border border-dashed border-border/60 py-10 text-center text-xs text-muted-foreground">
                    <code>{"<PageShell width=\"default\"> \u2026 </PageShell>"}</code>
                    <div className="mt-1 opacity-60">{"max-w-[1000px] \u00b7 px-6 lg:px-10 \u00b7 py-10"}</div>
                  </div>
                </DemoContainer>
              </div>

              {/* ── Section ── */}
              <div id="pat-section" className="mb-12">
                <ComponentLabel>Section</ComponentLabel>
                <ComponentDesc>{"Labelled section inside a PageShell. Uppercase micro-label, optional trailing action, opinionated top margin between siblings. No box, no chrome \u2014 typography and whitespace do the work."}</ComponentDesc>
                <DemoContainer>
                  <BrandSection label="About">
                    <p className="text-sm text-foreground leading-relaxed">{"Description content lives here. Sections separate concerns on a page without ever drawing a card."}</p>
                  </BrandSection>
                  <BrandSection
                    label="Details"
                    action={
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Edit
                      </Button>
                    }
                  >
                    <p className="text-sm text-muted-foreground">{"A second section with a trailing action."}</p>
                  </BrandSection>
                </DemoContainer>
              </div>

              {/* ── SectionCard ── */}
              <div id="pat-section-card" className="mb-12">
                <ComponentLabel>SectionCard</ComponentLabel>
                <ComponentDesc>{"The one panel pattern. Composes the design-system Card (rounded-2xl) and adds the divided header every settings/list surface needs: title, muted count, description, trailing action. Use"}<code>flush</code>{"to seat a List edge-to-edge, and"}{' '}
                  <code>{"tone=\"destructive\""}</code>{"for danger zones \u2014 no separate component. A danger zone stays calm: a neutral panel with a faint warm edge and a"}<strong>neutral</strong>{"trigger. Red is the brake, not the paint \u2014 it shows up only on the final confirm (the ConfirmDialog button), never on the panel."}</ComponentDesc>
                <DemoContainer className="space-y-4">
                  <SectionCard
                    title="Members"
                    count={2}
                    description={"People with access to this account."}
                    action={
                      <Button size="sm" className="h-8 px-3 text-sm">
                        Invite
                      </Button>
                    }
                  >
                    <p className="text-sm text-muted-foreground">{"Body content sits in the padded region. Pass"}{' '}
                      <code>flush</code>{"to drop the padding for a List."}</p>
                  </SectionCard>
                  <SectionCard
                    tone="destructive"
                    title={"Danger zone"}
                    description={"Irreversible actions live here."}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{"Delete this account"}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{"Permanently removes the account and all its data."}</p>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0">
                        Delete
                      </Button>
                    </div>
                  </SectionCard>
                </DemoContainer>
              </div>

              {/* ── Avatars ── */}
              <div id="pat-avatars" className="mb-12">
                <ComponentLabel>Avatars</ComponentLabel>
                <ComponentDesc>{"One rule:"}<strong>{"people are round, things are square"}</strong>.{' '}
                  <code>UserAvatar</code>{"renders a circular avatar for a person \u2014 the supabase profile picture when present, otherwise"}{' '}
                  <strong>{"neutral monochrome initials"}</strong>{"(no coloured backgrounds)."}<code>EntityAvatar</code>{"renders a rounded-square tile for accounts, projects, groups and other non-person entities \u2014 an initial or an icon. Both share the same neutral material and size scale so they align on a row."}</ComponentDesc>
                <DemoContainer className="space-y-5">
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-xs uppercase tracking-wider text-muted-foreground">
                      People
                    </span>
                    <UserAvatar email={"ada@kortix.ai"} name="Ada Lovelace" size="sm" />
                    <UserAvatar email={"grace@kortix.ai"} name="Grace Hopper" />
                    <UserAvatar email={"alan@kortix.ai"} name="Alan Turing" size="lg" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-xs uppercase tracking-wider text-muted-foreground">
                      Things
                    </span>
                    <EntityAvatar label={"Acme AGI"} size="sm" />
                    <EntityAvatar label="Kortix" />
                    <EntityAvatar icon={FolderGit2} />
                    <EntityAvatar icon={Users} size="lg" />
                  </div>
                </DemoContainer>
              </div>

              {/* ── List & ListRow ── */}
              <div id="pat-list" className="mb-12">
                <ComponentLabel>{"List & ListRow"}</ComponentLabel>
                <ComponentDesc>{"The standard list. A divider-separated"}<code>List</code> of{' '}
                  <code>ListRow</code>{"s, each with a leading avatar slot (UserAvatar for people, EntityAvatar for things), a title with inline badges, a subtitle (an InlineMeta strip reads well), and a trailing slot for status badges or a kebab. Drop it inside a"}{' '}
                  <code>{"SectionCard flush"}</code>.
                </ComponentDesc>
                <DemoContainer className="p-0">
                  <SectionCard title="Members" count={2} flush>
                    <List>
                      <ListRow
                        leading={<UserAvatar email={"grace@kortix.ai"} name="Grace Hopper" />}
                        title={"grace@kortix.ai"}
                        badges={
                          <Badge variant="outline" size="sm">
                            You
                          </Badge>
                        }
                        subtitle={
                          <InlineMeta>
                            <span>{"Joined Mar 3, 2026"}</span>
                            <span>{"4 projects"}</span>
                          </InlineMeta>
                        }
                        trailing={
                          <Badge variant="outline" size="sm" className="border-foreground/30 text-foreground">
                            Owner
                          </Badge>
                        }
                      />
                      <ListRow
                        leading={<UserAvatar email={"alan@kortix.ai"} name="Alan Turing" />}
                        title={"alan@kortix.ai"}
                        subtitle={
                          <InlineMeta>
                            <span>{"Joined Apr 1, 2026"}</span>
                          </InlineMeta>
                        }
                        trailing={
                          <Badge variant="outline" size="sm">
                            Member
                          </Badge>
                        }
                      />
                    </List>
                  </SectionCard>
                </DemoContainer>
              </div>

              {/* ── DefinitionList ── */}
              <div id="pat-definition-list" className="mb-12">
                <ComponentLabel>DefinitionList</ComponentLabel>
                <ComponentDesc>{"Key/value pairs. Fixed-width label column so values align vertically. Optional dividers for a Linear-style meta list."}</ComponentDesc>
                <DemoContainer>
                  <DefinitionList dividers>
                    <DefinitionRow label="Path">
                      <code className="text-xs font-mono text-foreground">
                        /workspace/jjk-domain-search
                      </code>
                    </DefinitionRow>
                    <DefinitionRow label="Created">{"2 days ago"}</DefinitionRow>
                    <DefinitionRow label="Updated">
                      <span className="tabular-nums">{"3m ago"}</span>
                    </DefinitionRow>
                    <DefinitionRow label="Sessions">8</DefinitionRow>
                  </DefinitionList>
                </DemoContainer>
              </div>

              {/* ── InlineMeta ── */}
              <div id="pat-inline-meta" className="mb-12">
                <ComponentLabel>InlineMeta</ComponentLabel>
                <ComponentDesc>{"Dot-separated facts. Drop any number of children \u2014 falsy ones are skipped. Used in page headers, row subtitles, card footers."}</ComponentDesc>
                <DemoContainer>
                  <InlineMeta>
                    <span className="font-mono text-foreground">
                      /workspace/jjk
                    </span>
                    <span>{"24 issues"}</span>
                    <span>{"created 2d ago"}</span>
                    <span>{"8 sessions"}</span>
                  </InlineMeta>
                </DemoContainer>
              </div>

              {/* ── EmptyState ── */}
              <div id="pat-empty-state" className="mb-12">
                <ComponentLabel>EmptyState</ComponentLabel>
                <ComponentDesc>{"The calm teaching moment. Icon, headline, one-line description, up to two actions. Used for zero-state views across every list and detail page."}</ComponentDesc>
                <DemoContainer className="p-0">
                  <EmptyState
                    icon={Inbox}
                    title={"No issues yet"}
                    description={"Create your first issue with C, or import from a session."}
                    action={
                      <Button size="sm" className="h-8 px-4 text-sm">{"New issue"}</Button>
                    }
                    secondaryAction={
                      <Button variant="ghost" size="sm" className="h-8 px-3 text-sm">{"Learn more"}</Button>
                    }
                  />
                </DemoContainer>
              </div>

              {/* ── InfoBanner ── */}
              <div id="pat-info-banner" className="mb-12">
                <ComponentLabel>InfoBanner</ComponentLabel>
                <ComponentDesc>{"An inline status / info notice \u2014 manifest status, a skipped email, a tip. Semantic"}<code>tone</code>{"(neutral / info / success / warning / destructive) instead of hand-rolled tinted borders. Icon + optional title + body + trailing action."}</ComponentDesc>
                <DemoContainer className="space-y-3">
                  <InfoBanner tone="info" icon={Info} title={"Heads up"}>{"The manifest is being re-synced \u2014 secrets apply in a moment."}</InfoBanner>
                  <InfoBanner tone="warning" icon={TriangleAlert} title={"Email skipped"}>{"Mailtrap isn't configured locally. Copy the invite link to share it."}</InfoBanner>
                  <InfoBanner
                    tone="success"
                    icon={Check}
                    title={"All set"}
                    action={
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                        Dismiss
                      </Button>
                    }
                  >{"Your repository is connected."}</InfoBanner>
                </DemoContainer>
              </div>

              <div id="pat-status" className="mb-12">
                <ComponentLabel>{"Status (Dot, Badge & DiffStat)"}</ComponentLabel>
                <ComponentDesc>{"The single source of truth for \u201cthis means success / warning / error / info\u201d coloring. Chips use"}{' '}
                  <code>Badge</code>{", boxes use"}<code>InfoBanner</code>{"\u2014 for the cases a component can't cover (a live activity dot, a diff +/- counter, a lone status icon) reach for"}<code>StatusDot</code>
                  , <code>DiffStat</code>{"or the"}<code>STATUS_TEXT/BG/BORDER</code>{' '}{"maps instead of re-inlining"}<code>text-emerald-500</code>.
                </ComponentDesc>
                <DemoContainer className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <StatusDot tone="success" /> Idle
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <StatusDot tone="success" pulse /> Running
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <StatusDot tone="warning" /> Warning
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <StatusDot tone="destructive" /> Error
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <StatusDot tone="info" /> Info
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <DiffStat additions={42} deletions={7} />
                    <DiffStat additions={12} />
                    <DiffStat deletions={3} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone="success">{"3 passed"}</StatusBadge>
                    <StatusBadge tone="warning">{"5 warnings"}</StatusBadge>
                    <StatusBadge tone="destructive">{"2 errors"}</StatusBadge>
                    <StatusBadge tone="info">Modified</StatusBadge>
                    <StatusBadge tone="neutral">Idle</StatusBadge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use <code>StatusBadge</code>{"for informational status (faint, incl. red)."}<code>{"Badge variant=\"destructive\""}</code>{' '}{"is a SOLID red pill \u2014 reserve it for actions, not status."}</p>
                </DemoContainer>
              </div>

              {/* ── ConfirmDialog ── */}
              <div id="pat-confirm-dialog" className="mb-12">
                <ComponentLabel>ConfirmDialog</ComponentLabel>
                <ComponentDesc>
                  Reusable confirmation dialog for destructive actions — delete, revoke, disable. Wraps{' '}
                  <code>AlertDialog</code> with a consistent title/description/confirm pattern.
                </ComponentDesc>
                <DemoContainer>
                  <Button variant="outline" onClick={() => setConfirmDialogOpen(true)}>
                    Delete project…
                  </Button>
                  <ConfirmDialog
                    open={confirmDialogOpen}
                    onOpenChange={setConfirmDialogOpen}
                    title="Delete project"
                    description="This will permanently delete the project and all of its data. This action cannot be undone."
                    confirmLabel="Delete"
                    confirmVariant="destructive"
                    onConfirm={() => setConfirmDialogOpen(false)}
                  />
                </DemoContainer>
              </div>

              {/* ── SubmitButton ── */}
              <div id="pat-submit-button" className="mb-12">
                <ComponentLabel>SubmitButton</ComponentLabel>
                <ComponentDesc>
                  Form submit button wired to a server action via <code>useFormStatus</code> /{' '}
                  <code>useActionState</code>, with built-in pending state and inline error display.
                </ComponentDesc>
                <DemoContainer>
                  <form className="max-w-xs">
                    <SubmitButton
                      formAction={async () => ({ message: '' })}
                      pendingText="Saving…"
                    >
                      Save changes
                    </SubmitButton>
                  </form>
                </DemoContainer>
              </div>
            </section>

            {/* ═══════════════ Anti-Patterns ═══════════════ */}
            <section id="anti-patterns">
              <SectionDivider />
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
                  Anti-Patterns
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-8">{"Code patterns that violate the design system. Follow these rules to maintain consistency, accessibility, and performance across the codebase."}</p>

                <div className="space-y-6">
                  <AntiPatternBlock
                    title={"AP-1: No inline style={} for fixed values"}
                    description={"Bypasses the utility system, can't be purged, creates specificity issues, invisible to design system audits."}
                    bad={`<div style={{ height: '14px', overflow: 'hidden' }}>\n  Content\n</div>`}
                    good={`<div className="h-3.5 overflow-hidden">\n  Content\n</div>`}
                  />

                  <AntiPatternBlock
                    title={"AP-2: No arbitrary text sizes"}
                    description={"Creates inconsistent type sizes with no semantic meaning and no relationship to the readable type scale."}
                    bad={
                      '<span className="text-' +
                      '[11px]">Label</span>\n<span className="text-' +
                      '[13.5px]">Meta</span>\n<span className="text-' +
                      '[0.875em]">Body</span>'
                    }
                    good={`<span className="text-xs">Label</span>\n<span className="text-xs">Meta</span>\n<span className="text-sm">Body</span>`}
                  />

                  <AntiPatternBlock
                    title={"AP-3: No raw <button> elements"}
                    description={"Raw buttons bypass variant system, have inconsistent sizing/padding/radius, no focus ring guarantee, no loading state support."}
                    bad={`<button\n  className="px-3 py-1.5 rounded-lg\n    bg-neutral-100 hover:bg-neutral-200"\n  onClick={handleClick}\n>\n  Save\n</button>`}
                    good={`<Button\n  variant="secondary"\n  size="sm"\n  onClick={handleClick}\n>\n  Save\n</Button>`}
                  />

                  <AntiPatternBlock
                    title={"AP-4: No transition-colors"}
                    description={"Animates every CSS property including width, height, padding. Causes layout thrashing. Performance killer on large lists."}
                    bad={`<div className="transition-colors duration-200\n  hover:bg-accent">`}
                    good={`<div className="transition-colors\n  duration-moderate hover:bg-accent">`}
                  />

                  <AntiPatternBlock
                    title={"AP-5: No hardcoded hex colors"}
                    description={"Completely bypasses the theme system. Will look wrong in non-default themes. Breaks dark mode."}
                    bad={`<div className="text-emerald-500">\n  Success\n</div>\n<div style={{ color: '#3b82f6' }}>\n  Info\n</div>`}
                    good={`<div className="text-success">\n  Success\n</div>\n<div className="text-info">\n  Info\n</div>`}
                  />

                  <AntiPatternBlock
                    title={"AP-6: No clickable <div> elements"}
                    description={"Not keyboard accessible. No focus ring. Not announced as interactive by screen readers."}
                    bad={`<div\n  onClick={handler}\n  className="cursor-pointer"\n>\n  Click me\n</div>`}
                    good={`<Button\n  variant="ghost"\n  onClick={handler}\n>\n  Click me\n</Button>`}
                  />
                </div>
            </section>

            {/* ═══════════════ Usage ═══════════════ */}
            <section id="usage">
              <SectionDivider />
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
                  Usage
                </h2>

                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-4">
                      Do
                    </p>
                    {[
                      'Use the logo on solid black or white backgrounds',
                      'Maintain minimum clear space on all sides',
                      'Use the provided SVG/PNG files',
                      'Black logo on light, white on dark',
                      'Scale proportionally',
                      'Use font-medium (500) for headings',
                      'Use semantic color tokens (success, warning, info)',
                      'Use the defined type scale tokens',
                      'Use specific transition properties',
                      'Use <Button> and <IconButton> components',
                    ].map((t) => (
                      <div
                        key={t}
                        className="flex items-start gap-2.5 py-2 border-b border-border/30"
                      >
                        <span className="mt-0.5 flex items-center justify-center size-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                          <Check className="size-2.5" />
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-400 tracking-widest uppercase mb-4">
                      Don{"'"}t
                    </p>
                    {[
                      'Rotate, skew, or stretch the logo',
                      'Add drop shadows or effects',
                      'Place on busy or patterned backgrounds',
                      'Use unapproved color combinations',
                      'Use bold (700) for headings',
                      'Use colored or tinted backgrounds',
                      'Use arbitrary pixel text sizes',
                      'Use transition-colors on elements',
                      'Use raw <button> for interactions',
                      'Use hardcoded hex colors in components',
                    ].map((t) => (
                      <div
                        key={t}
                        className="flex items-start gap-2.5 py-2 border-b border-border/30"
                      >
                        <span className="mt-0.5 flex items-center justify-center size-4 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                          <X className="size-2.5" />
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
