<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Download, Check, Copy, Settings, Bot, Sparkles, Search, Plus, Star,
  ChevronRight, ChevronDown, Bell, Mail, User, Folder, File,
  FileText, FileCode2, Terminal, Paperclip, ArrowUp, Layers, MessageSquare, Globe,
  StopCircle, Ban, Pencil, GitFork, Pin, Trash2, MoreHorizontal, MoreVertical,
  ArrowRight, Image, Hash, AtSign, Slash, X, Loader2, Filter, SlidersHorizontal,
  Smile, Moon, Sun, Monitor, Cloud, Github, ExternalLink, ArrowLeft, Play, Square,
  Code2, GripVertical, ListFilter, Wand2, Maximize2, type LucideIcon,
  Cable, Radio, Plug, FolderGit2, Archive, Cpu, MessageCircle, AtSign as AtSignIcon,
  CheckCheck, UserPlus, AlertTriangle, HelpCircle, ShieldCheck, EyeOff, CheckCircle2,
  ClipboardCheck, Shield, BookOpen, FileCode, FileCode2 as FileCode2Icon, GitBranch,
  History, Image as ImageIcon, ListTree, Building2, Presentation, Scale, BarChart3, Package,
  ChevronLeft, Lock, Share2, RotateCcw, Eye,
} from 'lucide-vue-next'
import { cn } from '@kortix/nuxt-ui'
import {
  Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Checkbox, Switch, Toggle, RadioGroup, RadioGroupItem,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  Tooltip, TooltipContent, TooltipTrigger, TooltipProvider,
  Popover, PopoverContent, PopoverTrigger,
  Alert, AlertTitle, AlertDescription,
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Separator, Skeleton, Progress, Slider, Label,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Kbd, KbdGroup, ScrollArea,
  Collapsible, CollapsibleContent, CollapsibleTrigger,
  PageShell, Section as BrandSection, DefinitionList, DefinitionRow, InlineMeta,
  EmptyState, EntityAvatar, InfoBanner, StatusDot, DiffStat, StatusBadge, UserAvatar,
  List, ListRow, SectionCard, Tag, Pagination,
  AnimatedThinkingText, ThinkingBlock, ChatBubble, ChatActionCard, ChatSystemCard, ChatDivider,
  ChatInputShell, ChatAttachmentTile, ContextEventCard, GroupedActivityRow, NotificationChip,
  ChatMessageActions, QuestionsCard, ToolCallCard, ConnectionPill, ConfirmDialog,
  Avatar, AvatarImage, AvatarFallback,
  SubmitButton,
  Calendar,
  Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose,
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuLabel, ContextMenuSeparator, ContextMenuItem,
  DataTable,
} from '@kortix/nuxt-ui'
import type { DataTableColumn } from '@kortix/nuxt-ui'

/* ─────────────────── Data ─────────────────── */

const BRAND_COLORS = [
  { name: 'Black', hex: '#000000', oklch: 'oklch(0 0 0)', light: false },
  { name: 'Off-Black', hex: '#1A1A1A', oklch: 'oklch(0.145 0 0)', light: false },
  { name: 'White', hex: '#FFFFFF', oklch: 'oklch(1 0 0)', light: true },
  { name: 'Off-White', hex: '#F5F5F5', oklch: 'oklch(0.965 0 0)', light: true },
] as const

const CORE_PALETTE = [
  { name: 'Background', var: '--background', light: 'oklch(1 0 0)', dark: 'oklch(0.145 0 0)' },
  { name: 'Foreground', var: '--foreground', light: 'oklch(0.145 0 0)', dark: 'oklch(0.94 0 0)' },
  { name: 'Card', var: '--card', light: 'oklch(0.99 0 0)', dark: 'oklch(0.21 0 0)' },
  { name: 'Card Foreground', var: '--card-foreground', light: 'oklch(0.145 0 0)', dark: 'oklch(0.94 0 0)' },
  { name: 'Popover', var: '--popover', light: 'oklch(1 0 0)', dark: 'oklch(0.24 0 0)' },
  { name: 'Popover Foreground', var: '--popover-foreground', light: 'oklch(0.145 0 0)', dark: 'oklch(0.94 0 0)' },
  { name: 'Primary', var: '--primary', light: 'oklch(0.205 0 0)', dark: 'oklch(0.94 0 0)' },
  { name: 'Primary Foreground', var: '--primary-foreground', light: 'oklch(0.985 0 0)', dark: 'oklch(0.18 0 0)' },
  { name: 'Secondary', var: '--secondary', light: 'oklch(0.46 0 0)', dark: 'oklch(0.55 0.01 260)' },
  { name: 'Secondary Foreground', var: '--secondary-foreground', light: 'oklch(1 0 0)', dark: 'oklch(0.94 0 0)' },
  { name: 'Muted', var: '--muted', light: 'oklch(0.955 0 0)', dark: 'oklch(0.27 0 0)' },
  { name: 'Muted Foreground', var: '--muted-foreground', light: 'oklch(0.45 0 0)', dark: 'oklch(0.60 0 0)' },
  { name: 'Accent', var: '--accent', light: 'oklch(0.96 0 0)', dark: 'oklch(0.25 0 0)' },
  { name: 'Accent Foreground', var: '--accent-foreground', light: 'oklch(0.145 0 0)', dark: 'oklch(0.94 0 0)' },
  { name: 'Border', var: '--border', light: 'oklch(0.885 0 0)', dark: 'oklch(0.30 0 0)' },
  { name: 'Input', var: '--input', light: 'oklch(0.905 0 0)', dark: 'oklch(0.27 0 0)' },
  { name: 'Ring', var: '--ring', light: 'oklch(0.708 0 0)', dark: 'oklch(0.50 0 0)' },
  { name: 'Destructive', var: '--destructive', light: 'oklch(0.577 0.245 27.325)', dark: 'oklch(0.396 0.141 25.723)' },
] as const

const TYPE_SCALE = [
  { token: 'text-xs', size: '0.75rem', px: '~12px', use: 'Secondary labels, tooltips, KBD' },
  { token: 'text-sm', size: '0.875rem', px: '~14px', use: 'Body text, menu items' },
  { token: 'text-base', size: '1rem', px: '~16px', use: 'Default UI text, inputs' },
  { token: 'text-lg', size: '1.125rem', px: '~18px', use: 'Section headers, dialog titles' },
  { token: 'text-xl', size: '1.25rem', px: '~20px', use: 'Page section titles' },
  { token: 'text-2xl', size: '1.5rem', px: '~24px', use: 'Page titles' },
  { token: 'text-3xl', size: '1.875rem', px: '~30px', use: 'Hero subheadings' },
  { token: 'text-4xl', size: '2.25rem', px: '~36px', use: 'Display / hero headings' },
] as const

const MOTION_DURATIONS = [
  { name: 'Fast', token: '--duration-fast', ms: 100 },
  { name: 'Normal', token: '--duration-normal', ms: 150 },
  { name: 'Moderate', token: '--duration-moderate', ms: 200 },
  { name: 'Slow', token: '--duration-slow', ms: 300 },
  { name: 'Slower', token: '--duration-slower', ms: 500 },
] as const

const EASING_CURVES = [
  { name: 'Default', value: 'cubic-bezier(0.2, 0, 0, 1)' },
  { name: 'Ease In', value: 'cubic-bezier(0.4, 0, 1, 1)' },
  { name: 'Ease Out', value: 'cubic-bezier(0, 0, 0.2, 1)' },
  { name: 'Ease In-Out', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
] as const

const SPACING_SCALE = [
  { token: '0.5', px: 2 }, { token: '1', px: 4 }, { token: '1.5', px: 6 }, { token: '2', px: 8 },
  { token: '3', px: 12 }, { token: '4', px: 16 }, { token: '5', px: 20 }, { token: '6', px: 24 },
  { token: '8', px: 32 }, { token: '10', px: 40 }, { token: '12', px: 48 }, { token: '16', px: 64 },
] as const

const DATA_TABLE_ROWS = [
  { id: '1', name: 'Onboarding flow', status: 'Active', updated: '2h ago' },
  { id: '2', name: 'Weekly digest', status: 'Paused', updated: '1d ago' },
  { id: '3', name: 'Lead enrichment', status: 'Active', updated: '3d ago' },
]

const DATA_TABLE_COLUMNS: DataTableColumn<typeof DATA_TABLE_ROWS[number]>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'status', header: 'Status', accessorKey: 'status' },
  { id: 'updated', header: 'Updated', accessorKey: 'updated' },
]

const copiedHex = ref<Record<string, boolean>>({})
function copyHex(value: string) {
  navigator.clipboard?.writeText(value)
  copiedHex.value[value] = true
  setTimeout(() => { copiedHex.value[value] = false }, 1200)
}

const logoFmt = ref<'svg' | 'png'>('svg')
const LOGO_ASSETS = [
  { id: 'brandmark-black', label: 'Symbol', variant: 'Black', svgSrc: '/brandkit/Logo/Brandmark/SVG/Brandmark Black.svg', pngSrc: '/brandkit/Logo/Brandmark/PNG/Brandmark Black.png', dark: false },
  { id: 'brandmark-white', label: 'Symbol', variant: 'White', svgSrc: '/brandkit/Logo/Brandmark/SVG/Brandmark White.svg', pngSrc: '/brandkit/Logo/Brandmark/PNG/Brandmark White.png', dark: true },
  { id: 'logo-black', label: 'Logo', variant: 'Black', svgSrc: '/brandkit/Logo/Logomark/SVG/Logomark Black.svg', pngSrc: '/brandkit/Logo/Logomark/PNG/Logomark Black.png', dark: false },
  { id: 'logo-white', label: 'Logo', variant: 'White', svgSrc: '/brandkit/Logo/Logomark/SVG/Logomark White.svg', pngSrc: '/brandkit/Logo/Logomark/PNG/Logomark White.png', dark: true },
]
const SOCIAL_ASSETS = [
  { id: 'social-black', variant: 'Black', pngSrc: '/brandkit/Profile Picture/Avatar Black.png', dark: true },
  { id: 'social-white', variant: 'White', pngSrc: '/brandkit/Profile Picture/Avatar White.png', dark: false },
]

const selectedDate = ref()

const TOC_SECTIONS = [
  { id: 'hero', label: 'Overview' },
  { id: 'logo', label: 'Logo' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'motion', label: 'Motion' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'components', label: 'Components' },
  { id: 'chat', label: 'Chat' },
  { id: 'page-patterns', label: 'Page Patterns' },
  { id: 'patterns', label: 'Primitives' },
  { id: 'anti-patterns', label: 'Anti-Patterns' },
  { id: 'usage', label: 'Usage' },
] as const

/* ─────────────────── Local state ─────────────────── */

const sliderValue = ref([40])
const paginationPage = ref(1)
const progressValue = ref(64)
const checkboxState = ref(true)
const collapsibleOpen = ref(false)
const switchState = ref(true)
const radioValue = ref('default')
const motionRunning = ref<Record<string, boolean>>({})

/* Page-pattern demo state */
const paletteOpen = ref(false)
const settingsOpen = ref(false)
const settingsActive = ref('general')
const overlayOpen = ref(false)
const overlaySection = ref('agents')
const shareDialogOpen = ref(false)
const shareMode = ref('project')
const headerEditing = ref(false)
const headerTitle = ref('auth-rewrite: rotate refresh tokens')
const notifBellOpen = ref(false)
const notifEnabled = ref(true)
const notifPrefs = ref({ onCompletion: true, onError: true, onQuestion: true, onPermission: false, onlyWhenHidden: true, playSound: false })
const wallpaperId = ref('brandmark')
const mentionMenuOpen = ref(false)
const mentionText = ref('Hey @')
const sidebarCollapsed = ref(false)
const sidebarActiveSession = ref('s1')
const fileTreeSelected = ref('src/lib/retry.ts')
const demoActiveTab = ref('session-layout')
const demoSidePanelTab = ref('actions')
const newSessionText = ref('')
const confirmDialogOpen = ref(false)

const ANTI_PATTERNS = [
  { title: 'AP-1: No inline style={} for fixed values', description: "Bypasses the utility system, can't be purged, creates specificity issues, invisible to design system audits.",
    bad: `<div style={{ height: '14px', overflow: 'hidden' }}>\n  Content\n</div>`,
    good: `<div className="h-3.5 overflow-hidden">\n  Content\n</div>` },
  { title: 'AP-2: No arbitrary text sizes', description: 'Creates inconsistent type sizes with no semantic meaning and no relationship to the readable type scale.',
    bad: `<span className="text-[11px]">Label</span>\n<span className="text-[13.5px]">Meta</span>\n<span className="text-[0.875em]">Body</span>`,
    good: `<span className="text-xs">Label</span>\n<span className="text-xs">Meta</span>\n<span className="text-sm">Body</span>` },
  { title: 'AP-3: No raw <button> elements', description: 'Raw buttons bypass variant system, have inconsistent sizing/padding/radius, no focus ring guarantee, no loading state support.',
    bad: `<button\n  className="px-3 py-1.5 rounded-lg\n    bg-neutral-100 hover:bg-neutral-200"\n  onClick={handleClick}\n>\n  Save\n</button>`,
    good: `<Button\n  variant="secondary"\n  size="sm"\n  onClick={handleClick}\n>\n  Save\n</Button>` },
  { title: 'AP-4: No transition-colors', description: 'Animates every CSS property including width, height, padding. Causes layout thrashing. Performance killer on large lists.',
    bad: `<div className="transition-colors duration-200\n  hover:bg-accent">`,
    good: `<div className="transition-colors\n  duration-moderate hover:bg-accent">` },
  { title: 'AP-5: No hardcoded hex colors', description: 'Completely bypasses the theme system. Will look wrong in non-default themes. Breaks dark mode.',
    bad: `<div className="text-emerald-500">\n  Success\n</div>\n<div style={{ color: '#3b82f6' }}>\n  Info\n</div>`,
    good: `<div className="text-success">\n  Success\n</div>\n<div className="text-info">\n  Info\n</div>` },
  { title: 'AP-6: No clickable <div> elements', description: 'Not keyboard accessible. No focus ring. Not announced as interactive by screen readers.',
    bad: `<div\n  onClick={handler}\n  className="cursor-pointer"\n>\n  Click me\n</div>`,
    good: `<Button\n  variant="ghost"\n  onClick={handler}\n>\n  Click me\n</Button>` },
]

function copyToClipboard(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {})
  }
}
</script>

<template>
  <main class="min-h-screen bg-background">
    <div class="max-w-5xl mx-auto px-6 pt-24 sm:pt-32 pb-24 sm:pb-32">
      <div class="flex gap-16">
        <!-- TOC sidebar -->
        <nav class="hidden lg:block w-44 shrink-0">
          <div class="sticky top-24 space-y-1">
            <a
              v-for="s in TOC_SECTIONS"
              :key="s.id"
              :href="`#${s.id}`"
              class="block text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
            >{{ s.label }}</a>
          </div>
        </nav>

        <!-- Main content -->
        <div class="flex-1 max-w-3xl">
          <!-- Hero -->
          <section id="hero">
            <div class="mb-3">
              <Badge variant="outline" class="text-xs font-mono">v1.0</Badge>
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-5">Brand &amp; Design System</h1>
            <p class="text-base text-muted-foreground leading-relaxed max-w-xl">
              Logo assets, color palette, typography, motion tokens, component library, and usage rules for building Kortix. The complete reference for designers and engineers.
            </p>
            <div class="flex flex-wrap gap-2 mt-6">
              <Badge variant="secondary"><span class="font-mono">30+</span> Components</Badge>
              <Badge variant="secondary"><span class="font-mono">7</span> Themes</Badge>
              <Badge variant="secondary">OKLCH Colors</Badge>
              <Badge variant="secondary">Reka Primitives</Badge>
            </div>
          </section>

          <!-- Logo -->
          <section id="logo" class="mt-14">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-xs uppercase tracking-widest text-muted-foreground">Logo</h2>
              <div class="flex items-center gap-0.5 bg-foreground/[0.05] rounded-full p-0.5">
                <button
                  v-for="f in (['svg', 'png'] as const)"
                  :key="f"
                  type="button"
                  class="text-xs font-mono px-3 py-1 rounded-full transition-colors cursor-pointer"
                  :class="logoFmt === f ? 'bg-background text-foreground shadow-sm ring-1 ring-foreground/[0.06]' : 'text-muted-foreground hover:text-foreground'"
                  @click="logoFmt = f"
                >{{ f.toUpperCase() }}</button>
              </div>
            </div>
            <p class="text-base text-muted-foreground leading-relaxed mb-6">
              Two forms — the symbol on its own, and the full logo. Each in black and white.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="a in LOGO_ASSETS" :key="a.id" class="group relative">
                <div
                  :class="cn(
                    'aspect-[3/2] rounded-lg flex items-center justify-center transition-colors relative overflow-hidden',
                    a.label !== 'Symbol' ? 'px-6 py-8' : 'p-10',
                    a.dark ? 'bg-neutral-950 ring-1 ring-white/[0.06]' : 'bg-white ring-1 ring-black/[0.06]'
                  )"
                >
                  <img
                    :src="a.svgSrc"
                    :alt="`Kortix ${a.label} ${a.variant}`"
                    :class="cn('object-contain', a.label !== 'Symbol' ? 'max-h-8 md:max-h-10 w-full' : 'max-h-10 md:max-h-12 w-auto')"
                  >
                  <a
                    :href="logoFmt === 'png' ? a.pngSrc : a.svgSrc"
                    :download="`kortix-${a.label.toLowerCase()}-${a.variant.toLowerCase()}.${logoFmt}`"
                    class="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/[0.04] dark:bg-white/[0.04] cursor-pointer"
                  >
                    <span class="flex items-center gap-1.5 text-xs font-medium bg-background ring-1 ring-border rounded-full px-3 py-1.5 shadow-sm">
                      <Download class="size-3" /> {{ logoFmt.toUpperCase() }}
                    </span>
                  </a>
                </div>
                <div class="mt-2 flex items-baseline gap-1.5 px-0.5">
                  <span class="text-xs font-medium text-foreground">{{ a.label }}</span>
                  <span class="text-xs font-mono text-muted-foreground">{{ a.variant }}</span>
                </div>
              </div>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-6">
              The symbol is derived from the letter K — connectivity and intelligence abstracted into a geometric mark. Use it as a favicon, app icon, or whenever the full wordmark isn't practical. Never stretch, rotate, or recolor it.
            </p>

            <div class="mt-10">
              <h3 class="text-xs uppercase tracking-widest text-muted-foreground mb-5">Social Avatar</h3>
              <p class="text-base text-muted-foreground leading-relaxed mb-6">
                The symbol centred on a solid field, square 1:1 — drop it straight into a profile picture or social handle. Hover to download the ready-made PNG (1000&times;1000, &lt;1&nbsp;MB).
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <div v-for="a in SOCIAL_ASSETS" :key="a.id" class="group relative">
                  <div :class="cn('aspect-square rounded-lg overflow-hidden ring-1 relative', a.dark ? 'ring-white/[0.06]' : 'ring-black/[0.06]')">
                    <img :src="a.pngSrc" :alt="`Kortix avatar ${a.variant}`" class="size-full object-cover">
                    <a
                      :href="a.pngSrc"
                      :download="`kortix-avatar-${a.variant.toLowerCase()}.png`"
                      class="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/[0.04] dark:bg-white/[0.04] cursor-pointer"
                    >
                      <span class="flex items-center gap-1.5 text-xs font-medium bg-background ring-1 ring-border rounded-full px-3 py-1.5 shadow-sm">
                        <Download class="size-3" /> PNG
                      </span>
                    </a>
                  </div>
                  <div class="mt-2 flex items-baseline gap-1.5 px-0.5">
                    <span class="text-xs font-medium text-foreground">Avatar</span>
                    <span class="text-xs font-mono text-muted-foreground">{{ a.variant }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Colors -->
          <section id="colors">
            <Separator class="my-14" />
            <h2 class="text-xs uppercase tracking-widest text-muted-foreground mb-5">Colors</h2>
            <p class="text-base text-muted-foreground leading-relaxed mb-6">
              Black and white is the foundation. Each UI theme pairs the neutral base with exactly one accent color. The OKLCH color space ensures perceptual uniformity across all themes.
            </p>

            <div class="mb-8">
              <p class="text-xs text-muted-foreground mb-3">Foundation</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div v-for="c in BRAND_COLORS" :key="c.hex">
                  <div
                    :class="cn('aspect-[4/3] rounded-lg', c.light ? 'ring-1 ring-black/[0.08]' : '')"
                    :style="{ backgroundColor: c.hex }"
                  />
                  <div class="mt-2 px-0.5 space-y-0.5">
                    <span class="text-xs font-medium text-foreground">{{ c.name }}</span>
                    <div class="flex flex-col">
                      <button type="button" class="inline-flex items-center gap-1.5 group cursor-pointer" @click="copyHex(c.hex)">
                        <span class="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">{{ c.hex }}</span>
                        <Check v-if="copiedHex[c.hex]" class="size-2.5 text-emerald-500" />
                        <Copy v-else class="size-2.5 text-muted-foreground group-hover:text-muted-foreground transition-colors" />
                      </button>
                      <button type="button" class="inline-flex items-center gap-1.5 group cursor-pointer" @click="copyHex(c.oklch)">
                        <span class="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">{{ c.oklch }}</span>
                        <Check v-if="copiedHex[c.oklch]" class="size-2.5 text-emerald-500" />
                        <Copy v-else class="size-2.5 text-muted-foreground group-hover:text-muted-foreground transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div class="flex items-baseline justify-between mb-3">
                <p class="text-xs text-muted-foreground">Core palette</p>
                <p class="font-mono text-xs text-muted-foreground/70">globals.css · :root / .dark</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="token in CORE_PALETTE" :key="token.var" class="rounded-lg border border-border/50 overflow-hidden">
                  <div class="grid grid-cols-2 h-14">
                    <div class="relative ring-1 ring-inset ring-black/[0.06]" :style="{ backgroundColor: token.light }">
                      <span class="absolute bottom-1 left-2 text-xs font-mono text-black/55 uppercase tracking-widest">light</span>
                    </div>
                    <div class="relative ring-1 ring-inset ring-white/[0.06]" :style="{ backgroundColor: token.dark }">
                      <span class="absolute bottom-1 left-2 text-xs font-mono text-white/55 uppercase tracking-widest">dark</span>
                    </div>
                  </div>
                  <div class="px-3 py-2.5 bg-background">
                    <div class="flex items-baseline justify-between gap-2 mb-1">
                      <span class="text-xs font-medium text-foreground truncate">{{ token.name }}</span>
                      <span class="font-mono text-xs text-muted-foreground shrink-0">{{ token.var }}</span>
                    </div>
                    <div class="flex items-center justify-between gap-2">
                      <button type="button" class="inline-flex items-center gap-1.5 group cursor-pointer" @click="copyHex(token.light)">
                        <span class="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">{{ token.light }}</span>
                        <Check v-if="copiedHex[token.light]" class="size-2.5 text-emerald-500" />
                        <Copy v-else class="size-2.5 text-muted-foreground group-hover:text-muted-foreground transition-colors" />
                      </button>
                      <button type="button" class="inline-flex items-center gap-1.5 group cursor-pointer" @click="copyHex(token.dark)">
                        <span class="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">{{ token.dark }}</span>
                        <Check v-if="copiedHex[token.dark]" class="size-2.5 text-emerald-500" />
                        <Copy v-else class="size-2.5 text-muted-foreground group-hover:text-muted-foreground transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Typography -->
          <section id="typography">
            <Separator class="my-14" />
            <h2 class="text-xs uppercase tracking-widest text-muted-foreground mb-5">Typography</h2>
            <p class="text-base text-muted-foreground leading-relaxed mb-8">
              Roobert — a geometric sans-serif. Font-medium (500) is the brand weight. Roobert Mono for code and data.
            </p>

            <div class="space-y-6">
              <div v-for="s in [{ label: 'Medium · 500', cls: 'font-medium' }, { label: 'Regular · 400', cls: 'font-normal' }]" :key="s.label" class="border-b border-border/30 pb-5">
                <span class="font-mono text-xs text-muted-foreground tracking-widest block mb-2">{{ s.label }}</span>
                <p :class="cn('text-3xl md:text-5xl tracking-tight text-foreground', s.cls)">Kortix Computer</p>
              </div>
            </div>

            <div class="bg-neutral-950 text-neutral-100 rounded-lg p-5 md:p-6 mt-6">
              <span class="font-mono text-xs text-neutral-500 tracking-widest block mb-3">Roobert Mono</span>
              <p class="font-mono text-lg md:text-2xl tracking-tight">const agent = new Kortix();</p>
              <p class="font-mono text-xs text-neutral-600 mt-4">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
            </div>

            <div class="mt-8">
              <p class="text-xs text-muted-foreground mb-4">Type Scale</p>
              <div class="space-y-0">
                <div v-for="t in TYPE_SCALE" :key="t.token" class="flex items-baseline gap-4 py-3 border-b border-border/20">
                  <div class="w-24 shrink-0"><span class="font-mono text-xs text-muted-foreground">{{ t.token }}</span></div>
                  <div class="w-16 shrink-0"><span class="font-mono text-xs text-muted-foreground">{{ t.px }}</span></div>
                  <div class="flex-1 min-w-0">
                    <span class="text-foreground font-medium truncate block" :style="{ fontSize: t.size }">The quick brown fox</span>
                  </div>
                  <div class="hidden sm:block shrink-0 max-w-48">
                    <span class="text-xs text-muted-foreground truncate block">{{ t.use }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Motion -->
          <section id="motion">
            <Separator class="my-14" />
            <h2 class="text-xs uppercase tracking-widest text-muted-foreground mb-5">Motion</h2>
            <p class="text-base text-muted-foreground leading-relaxed mb-6">
              Standardized duration and easing tokens ensure every transition feels consistent. Click the labels to trigger the animation.
            </p>

            <div class="mb-8">
              <p class="text-xs text-muted-foreground mb-4">Duration Scale</p>
              <div class="rounded-2xl ring-1 ring-border/50 bg-card/30 p-6">
                <div class="space-y-3">
                  <div v-for="d in MOTION_DURATIONS" :key="d.token" class="flex items-center gap-4">
                    <button
                      type="button"
                      class="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer w-24 shrink-0 text-left"
                      @click="motionRunning[d.token] = !motionRunning[d.token]"
                    >{{ d.name }}</button>
                    <div class="flex-1 h-7 bg-muted/30 rounded-md relative overflow-hidden">
                      <div
                        class="absolute top-1 bottom-1 left-1 rounded-sm bg-foreground/70"
                        :style="{ width: motionRunning[d.token] ? 'calc(100% - 8px)' : '24px', transitionProperty: 'width', transitionDuration: `${d.ms}ms`, transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)' }"
                      />
                    </div>
                    <span class="text-xs font-mono text-muted-foreground/70 w-12 text-right shrink-0">{{ d.ms }}ms</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p class="text-xs text-muted-foreground mb-4">Easing Curves</p>
              <div class="rounded-2xl ring-1 ring-border/50 bg-card/30 p-6">
                <div class="space-y-3">
                  <div v-for="e in EASING_CURVES" :key="e.token" class="flex items-center gap-4">
                    <button
                      type="button"
                      class="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer w-24 shrink-0 text-left"
                      @click="motionRunning[e.name] = !motionRunning[e.name]"
                    >{{ e.name }}</button>
                    <div class="flex-1 h-7 bg-muted/30 rounded-md relative overflow-hidden">
                      <div
                        class="absolute top-1 bottom-1 left-1 rounded-sm bg-foreground/70"
                        :style="{ width: motionRunning[e.name] ? 'calc(100% - 8px)' : '24px', transitionProperty: 'width', transitionDuration: '300ms', transitionTimingFunction: e.value }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Spacing -->
          <section id="spacing">
            <Separator class="my-14" />
            <h2 class="text-xs uppercase tracking-widest text-muted-foreground mb-5">Spacing</h2>
            <p class="text-base text-muted-foreground leading-relaxed mb-6">A consistent spacing scale based on 4px increments. Used for padding, margins, and gaps throughout the UI.</p>
            <div class="rounded-2xl ring-1 ring-border/50 bg-card/30 p-6">
              <div class="space-y-2.5">
                <div v-for="s in SPACING_SCALE" :key="s.token" class="flex items-center gap-4">
                  <span class="font-mono text-xs text-muted-foreground w-8 shrink-0 text-right">{{ s.token }}</span>
                  <div class="h-5 rounded-sm bg-foreground/60" :style="{ width: `${s.px * 3}px` }" />
                  <span class="font-mono text-xs text-muted-foreground">{{ s.px }}px</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Components -->
          <section id="components">
            <Separator class="my-14" />
            <h2 class="text-xs uppercase tracking-widest text-muted-foreground mb-5">Components</h2>
            <p class="text-base text-muted-foreground leading-relaxed mb-8">A tour of the primitive component library — every building block used to assemble Kortix interfaces.</p>

            <div id="comp-button" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Button</p>
              <div class="rounded-lg border border-border/50 p-6 flex flex-wrap gap-3 items-center">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
                <Button disabled>Disabled</Button>
                <Button size="icon" variant="outline"><Settings class="size-4" /></Button>
              </div>
            </div>

            <div id="comp-badge" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Badge</p>
              <div class="rounded-lg border border-border/50 p-6 flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            <div id="comp-card" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Card</p>
              <Card class="max-w-sm">
                <CardHeader>
                  <CardTitle>Project Alpha</CardTitle>
                  <CardDescription>Last updated 2 hours ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <p class="text-sm text-muted-foreground">A short description of the card content goes here, demonstrating typical usage.</p>
                </CardContent>
                <CardFooter class="gap-2">
                  <Button size="sm">Open</Button>
                  <Button size="sm" variant="outline">Archive</Button>
                </CardFooter>
              </Card>
            </div>

            <div id="comp-input" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Input &amp; Textarea</p>
              <div class="rounded-lg border border-border/50 p-6 space-y-4 max-w-sm">
                <Input id="demo-input" placeholder="Type something…" />
                <Textarea placeholder="Write a longer message…" />
              </div>
            </div>

            <div id="comp-textarea" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Textarea</p>
              <div class="rounded-lg border border-border/50 p-6 space-y-4 max-w-sm">
                <Textarea placeholder="Write something..." />
                <Textarea disabled placeholder="Disabled textarea" />
              </div>
            </div>

            <div id="comp-select" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Select</p>
              <div class="rounded-lg border border-border/50 p-6 max-w-sm">
                <Select default-value="apple">
                  <SelectTrigger><SelectValue placeholder="Choose a fruit" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="cherry">Cherry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div id="comp-checkbox" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Checkbox / Switch / Toggle / Radio</p>
              <div class="rounded-lg border border-border/50 p-6 flex flex-wrap gap-8 items-center">
                <div class="flex items-center gap-2">
                  <Checkbox id="check-1" v-model:checked="checkboxState" />
                  <Label for="check-1">Accept terms</Label>
                </div>
                <div class="flex items-center gap-2">
                  <Switch id="switch-on" v-model:checked="switchState" />
                  <Label for="switch-on">Notifications</Label>
                </div>
                <Toggle aria-label="Bold"><Star class="size-4" /></Toggle>
                <RadioGroup v-model="radioValue" class="flex gap-4">
                  <div class="flex items-center gap-2"><RadioGroupItem value="default" id="r1" /><Label for="r1">Default</Label></div>
                  <div class="flex items-center gap-2"><RadioGroupItem value="comfortable" id="r2" /><Label for="r2">Comfortable</Label></div>
                </RadioGroup>
              </div>
            </div>

            <div id="comp-switch" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Switch</p>
              <div class="rounded-lg border border-border/50 p-6 space-y-4">
                <div class="flex items-center gap-3"><Switch id="switch-on2" v-model:checked="switchState" /><Label for="switch-on2">On</Label></div>
                <div class="flex items-center gap-3"><Switch id="switch-off2" /><Label for="switch-off2">Off</Label></div>
                <div class="flex items-center gap-3"><Switch id="switch-dis2" disabled /><Label for="switch-dis2" class="text-muted-foreground">Disabled</Label></div>
              </div>
            </div>

            <div id="comp-toggle" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Toggle</p>
              <div class="rounded-lg border border-border/50 p-6 flex flex-wrap gap-2">
                <Toggle variant="default" aria-label="Toggle bold"><Star class="size-4" /></Toggle>
                <Toggle variant="outline" aria-label="Toggle settings"><Settings class="size-4" /></Toggle>
              </div>
            </div>

            <div id="comp-radio" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Radio Group</p>
              <div class="rounded-lg border border-border/50 p-6">
                <RadioGroup default-value="comfortable">
                  <div class="flex items-center gap-2"><RadioGroupItem value="default" id="rr1" /><Label for="rr1">Default</Label></div>
                  <div class="flex items-center gap-2"><RadioGroupItem value="comfortable" id="rr2" /><Label for="rr2">Comfortable</Label></div>
                  <div class="flex items-center gap-2"><RadioGroupItem value="compact" id="rr3" /><Label for="rr3">Compact</Label></div>
                </RadioGroup>
              </div>
            </div>

            <div id="comp-tabs" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Tabs</p>
              <Tabs default-value="account" class="max-w-sm">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account" class="text-sm text-muted-foreground pt-3">Manage your account settings here.</TabsContent>
                <TabsContent value="password" class="text-sm text-muted-foreground pt-3">Update your password here.</TabsContent>
              </Tabs>
            </div>

            <div id="comp-dialog" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Dialog</p>
              <Dialog>
                <DialogTrigger as-child><Button variant="outline">Open dialog</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>Make changes to your profile here.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div id="comp-sheet" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Drawer</p>
              <div class="rounded-lg border border-border/50 p-6">
                <Drawer>
                  <DrawerTrigger as-child><Button variant="outline">Open Drawer</Button></DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Drawer Title</DrawerTitle>
                      <DrawerDescription>A side panel for secondary content and actions.</DrawerDescription>
                    </DrawerHeader>
                    <div class="py-6 px-4"><p class="text-sm text-muted-foreground">Drawer body content.</p></div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>

            <div id="comp-dropdown" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Dropdown Menu</p>
              <DropdownMenu>
                <DropdownMenuTrigger as-child><Button variant="outline">Open menu</Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div id="comp-tooltip" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Tooltip / Popover</p>
              <div class="flex gap-4 items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child><Button variant="outline">Hover me</Button></TooltipTrigger>
                    <TooltipContent>Helpful tip text</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Popover>
                  <PopoverTrigger as-child><Button variant="outline">Open popover</Button></PopoverTrigger>
                  <PopoverContent class="text-sm text-muted-foreground">Popover content goes here.</PopoverContent>
                </Popover>
              </div>
            </div>

            <div id="comp-popover" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Popover</p>
              <div class="rounded-lg border border-border/50 p-6">
                <Popover>
                  <PopoverTrigger as-child><Button variant="outline">Open Popover</Button></PopoverTrigger>
                  <PopoverContent class="w-64">
                    <div class="space-y-2">
                      <p class="text-sm font-medium">Popover Title</p>
                      <p class="text-xs text-muted-foreground">This is the popover content. It can contain any elements.</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div id="comp-alert-dialog" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Alert Dialog</p>
              <div class="rounded-lg border border-border/50 p-6">
                <AlertDialog>
                  <AlertDialogTrigger as-child><Button variant="destructive">Delete Item</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone. This will permanently delete the item and remove all associated data.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div id="comp-alert" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Alert / Alert Dialog</p>
              <Alert class="mb-4">
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>You can add components to your app.</AlertDescription>
              </Alert>
              <AlertDialog>
                <AlertDialogTrigger as-child><Button variant="destructive">Delete account</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div id="comp-accordion" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Accordion / Collapsible</p>
              <Accordion type="single" collapsible class="max-w-sm mb-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>Yes, it adheres to the WAI-ARIA design pattern.</AccordionContent>
                </AccordionItem>
              </Accordion>
              <Collapsible class="max-w-sm">
                <CollapsibleTrigger as-child><Button variant="outline" size="sm">Toggle</Button></CollapsibleTrigger>
                <CollapsibleContent class="text-sm text-muted-foreground pt-2">Hidden content revealed.</CollapsibleContent>
              </Collapsible>
            </div>

            <div id="comp-collapsible" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Collapsible</p>
              <div class="rounded-lg border border-border/50 p-6">
                <Collapsible v-model:open="collapsibleOpen" class="w-full">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">3 tagged items</span>
                    <CollapsibleTrigger as-child>
                      <Button variant="ghost" size="sm">Toggle</Button>
                    </CollapsibleTrigger>
                  </div>
                  <div class="rounded-2xl border border-border/50 px-4 py-2 mt-2 text-sm">@kortix/design-system</div>
                  <CollapsibleContent class="mt-2 space-y-2">
                    <div class="rounded-2xl border border-border/50 px-4 py-2 text-sm">@kortix/components</div>
                    <div class="rounded-2xl border border-border/50 px-4 py-2 text-sm">@kortix/tokens</div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            <div id="comp-separator" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Separator</p>
              <div class="rounded-lg border border-border/50 p-6 max-w-sm space-y-4">
                <p class="text-sm text-muted-foreground">Content above</p>
                <Separator />
                <p class="text-sm text-muted-foreground">Content below</p>
              </div>
            </div>

            <div id="comp-label" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Label</p>
              <div class="rounded-lg border border-border/50 p-6 max-w-sm space-y-2">
                <Label for="label-demo">Email address</Label>
                <Input id="label-demo" type="email" placeholder="you@example.com" />
              </div>
            </div>

            <div id="comp-skeleton" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Skeleton / Progress / Slider</p>
              <div class="rounded-lg border border-border/50 p-6 space-y-4 max-w-sm">
                <div class="space-y-2">
                  <Skeleton class="h-4 w-3/4" />
                  <Skeleton class="h-4 w-1/2" />
                </div>
                <Progress :model-value="progressValue" />
                <Slider v-model="sliderValue" :max="100" :step="1" />
              </div>
            </div>

            <div id="comp-progress" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Progress</p>
              <div class="rounded-lg border border-border/50 p-6 space-y-4">
                <div v-for="v in [0, 25, 50, 75, 100]" :key="v" class="space-y-1.5">
                  <span class="text-xs font-mono text-muted-foreground">{{ v }}%</span>
                  <Progress :model-value="v" />
                </div>
              </div>
            </div>

            <div id="comp-slider" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Slider</p>
              <div class="rounded-lg border border-border/50 p-6 max-w-sm space-y-4">
                <Slider v-model="sliderValue" :max="100" :step="1" />
                <span class="text-xs font-mono text-muted-foreground">Value: {{ sliderValue[0] }}</span>
              </div>
            </div>

            <div id="comp-breadcrumb" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Breadcrumb / Kbd</p>
              <Breadcrumb class="mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbLink href="#">Projects</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbPage>Alpha</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </div>

            <div id="comp-table" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Table</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="row in DATA_TABLE_ROWS" :key="row.id">
                    <TableCell>{{ row.name }}</TableCell>
                    <TableCell><Badge variant="secondary">{{ row.status }}</Badge></TableCell>
                    <TableCell class="text-muted-foreground">{{ row.updated }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div id="comp-kbd" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Kbd</p>
              <div class="rounded-lg border border-border/50 p-6 space-y-4">
                <div>
                  <p class="text-xs text-muted-foreground mb-3">Individual Keys</p>
                  <div class="flex flex-wrap items-center gap-2">
                    <Kbd>⌘</Kbd><Kbd>K</Kbd><Kbd>Shift</Kbd><Kbd>Enter</Kbd><Kbd>Esc</Kbd><Kbd>Tab</Kbd>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-muted-foreground mb-3">Key Groups (Shortcuts)</p>
                  <div class="flex flex-wrap items-center gap-4">
                    <KbdGroup><Kbd>⌘</Kbd><span class="text-muted-foreground text-xs">+</span><Kbd>K</Kbd></KbdGroup>
                    <KbdGroup><Kbd>⌘</Kbd><span class="text-muted-foreground text-xs">+</span><Kbd>Shift</Kbd><span class="text-muted-foreground text-xs">+</span><Kbd>P</Kbd></KbdGroup>
                    <KbdGroup><Kbd>Ctrl</Kbd><span class="text-muted-foreground text-xs">+</span><Kbd>C</Kbd></KbdGroup>
                  </div>
                </div>
              </div>
            </div>

            <div id="comp-tag" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Tag / Pagination / Scroll Area</p>
              <div class="flex gap-2 mb-4">
                <Tag>design</Tag>
                <Tag>engineering</Tag>
                <Tag>ai</Tag>
              </div>
              <Pagination :current-page="2" :total-pages="8" :total-items="80" :page-size="10" position="standalone" class="mb-4" />
              <ScrollArea class="h-24 w-full rounded-md border border-border/50 p-3 text-sm text-muted-foreground">
                Long scrollable content lives here, demonstrating the scroll area component with a fixed viewport height and styled scrollbar overlay.
              </ScrollArea>
            </div>

            <div id="comp-pagination" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Pagination</p>
              <div class="rounded-lg border border-border/50 p-6">
                <Pagination
                  :current-page="paginationPage"
                  :total-pages="8"
                  :total-items="152"
                  :page-size="20"
                  show-results-info
                  position="standalone"
                  @page-change="paginationPage = $event"
                />
              </div>
            </div>

            <div id="comp-calendar" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Calendar</p>
              <Calendar v-model="selectedDate" class="rounded-lg border border-border/50" />
            </div>

            <div id="comp-scrollarea" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Scroll Area</p>
              <ScrollArea class="h-48 w-full rounded-2xl border border-border/50 p-4">
                <div class="space-y-2">
                  <div v-for="i in 20" :key="i" class="flex items-center gap-3 py-1.5 border-b border-border/20">
                    <span class="text-xs font-mono text-muted-foreground w-6">{{ String(i).padStart(2, '0') }}</span>
                    <span class="text-sm text-foreground">List item {{ i }}</span>
                  </div>
                </div>
              </ScrollArea>
            </div>

            <div id="comp-command" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Command</p>
              <Command class="rounded-lg border border-border/50 max-w-sm">
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
            </div>

            <div id="comp-drawer" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Drawer</p>
              <Drawer>
                <DrawerTrigger as-child>
                  <Button variant="outline">Open drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Edit profile</DrawerTitle>
                    <DrawerDescription>Make changes to your profile here. Click save when you're done.</DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button>Save changes</Button>
                    <DrawerClose as-child>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>

            <div id="comp-context-menu" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Context Menu</p>
              <ContextMenu>
                <ContextMenuTrigger class="flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-border/50 text-sm text-muted-foreground">
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
            </div>

            <div id="comp-data-table" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Data Table</p>
              <DataTable :columns="DATA_TABLE_COLUMNS" :data="DATA_TABLE_ROWS" :get-item-id="(row: typeof DATA_TABLE_ROWS[number]) => row.id" />
            </div>
          </section>

          <!-- Chat -->
          <section id="chat">
            <Separator class="my-14" />
            <h2 class="text-xs uppercase tracking-widest text-muted-foreground mb-5">Chat</h2>
            <p class="text-base text-muted-foreground leading-relaxed mb-8">Conversation primitives — bubbles, thinking indicators, system cards, and dividers used to build the agent chat experience.</p>

            <div id="chat-thinking-text" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">AnimatedThinkingText / ThinkingBlock</p>
              <div class="rounded-lg border border-border/50 p-6 space-y-4">
                <AnimatedThinkingText text="Thinking…" />
                <ThinkingBlock>
                  <p class="text-sm text-muted-foreground">Reasoning through the approach before responding…</p>
                </ThinkingBlock>
              </div>
            </div>

            <div id="chat-thinking-block" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">ThinkingBlock</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="w-full max-w-md space-y-1">
                  <ThinkingBlock preview="Reviewing the auth middleware for compliance gaps" streaming default-open>
                    <p>Looking through the session validation flow to confirm tokens are never persisted in plaintext, then checking the refresh path for the same issue.</p>
                  </ThinkingBlock>
                  <ThinkingBlock preview="Picked the approach that reuses the existing Collapsible primitive">
                    <p>Considered three approaches and chose the one with the smallest surface area against the design system.</p>
                  </ThinkingBlock>
                </div>
              </div>
            </div>

            <div id="chat-questions-card" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">QuestionsCard</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="w-full max-w-md">
                  <QuestionsCard
                    default-expanded
                    :items="[
                      { question: 'Which environment should the migration target first?', answer: 'Staging' },
                      { question: 'Should we notify the on-call channel before running it?', answer: 'Yes, #eng-oncall' },
                      { question: 'Run the backfill synchronously or in batches?', answer: 'In batches of 500' },
                    ]"
                  />
                </div>
              </div>
            </div>

            <div id="chat-tool-call" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">ToolCallCard</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="w-full max-w-md space-y-1">
                  <ToolCallCard title="Read" subtitle="src/components/session/tool-renderers.tsx" status="completed">
                    <template #icon><FileText /></template>
                    1  'use client';

                    3  import { useTranslations } from 'next-intl';
                  </ToolCallCard>
                  <ToolCallCard title="Grep" subtitle="pattern: useChatSendStore" status="running" default-open>
                    <template #icon><Search /></template>
                  </ToolCallCard>
                  <ToolCallCard title="Bash" subtitle="pnpm test --filter @kortix/ui" status="error" default-open>
                    <template #icon><Terminal /></template>
                    FAIL  src/components/button.test.tsx
                      ✕ renders disabled state (12 ms)
                  </ToolCallCard>
                </div>
              </div>
            </div>

            <div id="chat-bubble" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">ChatBubble &amp; ChatActionCard</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="w-full max-w-md space-y-4">
                  <div>
                    <p class="text-xs text-muted-foreground mb-2">ChatBubble — user message</p>
                    <ChatBubble>
                      <p class="text-sm text-foreground">Can you review the migration script before we run it against production?</p>
                    </ChatBubble>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground mb-2">Assistant reply — unwrapped, plain markdown</p>
                    <p class="text-sm text-muted-foreground">I've reviewed the migration script — it looks safe to run against production.</p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground mb-2">ChatActionCard — slash command</p>
                    <ChatActionCard>
                      <div class="flex items-center gap-2">
                        <Terminal class="size-3.5 text-muted-foreground shrink-0" />
                        <span class="font-mono text-sm text-foreground">/run-tests</span>
                      </div>
                      <span class="text-xs text-muted-foreground/70 font-mono pl-5.5">--filter @kortix/ui</span>
                    </ChatActionCard>
                  </div>
                </div>
              </div>
            </div>

            <div id="chat-system-card" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">ChatSystemCard</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="w-full max-w-md space-y-3">
                  <ChatSystemCard :icon="Layers" label="Compaction">
                    <p>Conversation history was compacted to free up context. <strong>12 messages</strong> were summarized into a single note.</p>
                  </ChatSystemCard>
                  <ChatSystemCard :icon="MessageSquare" label="Questions">
                    <p>3 of 3 questions answered. The assistant has enough context to continue.</p>
                  </ChatSystemCard>
                </div>
              </div>
            </div>

            <div id="chat-divider" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">ChatDivider</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="w-full max-w-md space-y-4">
                  <p class="text-sm text-muted-foreground">Picked up the migration task and started reviewing the schema changes.</p>
                  <ChatDivider>Goal · iteration 3 / 50</ChatDivider>
                  <p class="text-sm text-muted-foreground">Applied the backfill and re-ran the test suite — all green.</p>
                </div>
              </div>
            </div>

            <div id="chat-input-shell" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">ChatInputShell</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="w-full max-w-md">
                  <ChatInputShell>
                    <div class="px-4 pt-3.5 pb-2">
                      <p class="text-sm text-muted-foreground">Ask Kortix anything...</p>
                    </div>
                    <div class="flex items-center justify-between px-3 pb-3">
                      <button type="button" class="inline-flex items-center justify-center size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <Paperclip class="size-4" />
                      </button>
                      <button type="button" class="inline-flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground">
                        <ArrowUp class="size-4" />
                      </button>
                    </div>
                  </ChatInputShell>
                </div>
              </div>
            </div>

            <div id="chat-attachment-tile" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">ChatAttachmentTile</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="flex flex-wrap gap-2">
                  <ChatAttachmentTile name="diagram.png" preview-url="https://images.unsplash.com/photo-1518770660439-4636190af475?w=240&h=160&fit=crop" removable />
                  <ChatAttachmentTile name="migration.sql" removable>
                    <template #icon><FileCode2 class="size-8 text-muted-foreground/50" /></template>
                  </ChatAttachmentTile>
                  <ChatAttachmentTile name="notes.txt" removable>
                    <template #icon><FileText class="size-8 text-muted-foreground/50" /></template>
                  </ChatAttachmentTile>
                </div>
              </div>
            </div>

            <div id="chat-context-event" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">ContextEventCard</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="w-full max-w-md space-y-3">
                  <ContextEventCard
                    label="Context Compressed"
                    :stats="[
                      { label: '12 msgs', variant: 'secondary' },
                      { label: '-3.2k tokens', variant: 'success' },
                      { label: '8.4k saved', variant: 'secondary' },
                    ]"
                  >
                    <div>
                      <div class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-1">Topic</div>
                      <div>Migration planning for the auth schema change</div>
                    </div>
                    <div class="border-t border-border/30 pt-1.5">
                      <div class="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-1">Summary</div>
                      <div class="whitespace-pre-wrap break-words">Reviewed the migration script, confirmed staging target, and queued the backfill in batches of 500.</div>
                    </div>
                  </ContextEventCard>
                  <ContextEventCard
                    label="Context Pruned"
                    :stats="[
                      { label: '5 pruned', variant: 'warning' },
                      { label: '2.1k saved', variant: 'secondary' },
                    ]"
                  >
                    <div class="space-y-0.5">
                      <div v-for="tool in ['read', 'grep', 'bash']" :key="tool" class="flex items-center gap-2 text-xs text-muted-foreground/80">
                        <span class="text-muted-foreground/40">→</span>
                        <span class="font-mono text-xs px-1 py-0.5 rounded bg-muted/50 text-muted-foreground/70">{{ tool }}</span>
                        <span class="truncate max-w-[300px]">large output trimmed from context</span>
                      </div>
                    </div>
                  </ContextEventCard>
                </div>
              </div>
            </div>

            <div id="chat-grouped-activity" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">GroupedActivityRow</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="w-full max-w-md space-y-1">
                  <GroupedActivityRow :icon="Search" label="Gathered context · 3 reads, 2 searches" duration="4s" default-open>
                    <div class="flex items-center gap-1.5 py-0.5 text-xs text-muted-foreground/60 min-w-0">
                      <span class="flex-shrink-0">Read</span>
                      <span class="font-mono truncate min-w-0 flex-1 opacity-70">src/lib/auth/session.ts</span>
                    </div>
                    <div class="flex items-center gap-1.5 py-0.5 text-xs text-muted-foreground/60 min-w-0">
                      <span class="flex-shrink-0">Grep</span>
                      <span class="font-mono truncate min-w-0 flex-1 opacity-70">pattern: refreshToken</span>
                    </div>
                  </GroupedActivityRow>
                  <GroupedActivityRow :icon="Globe" label="Researching · 2 searches, 1 fetch" running />
                </div>
              </div>
            </div>

            <div id="chat-notification-chip" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">NotificationChip</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="w-full max-w-md space-y-2">
                  <NotificationChip :icon="Terminal" label="Process exited · code 0">
                    <div class="flex gap-2 min-w-0">
                      <span class="text-muted-foreground/40 flex-shrink-0">duration:</span>
                      <span class="text-muted-foreground/60 font-mono text-xs">42s</span>
                    </div>
                  </NotificationChip>
                  <NotificationChip :icon="StopCircle" label="Agent stopped · waiting for input" tone="warning" />
                  <NotificationChip :icon="Ban" label="Task failed · 3 retries exhausted" tone="error">
                    <div class="text-muted-foreground/50 font-mono text-xs whitespace-pre-wrap break-all">Error: connection timed out after 30000ms</div>
                  </NotificationChip>
                </div>
              </div>
            </div>

            <div id="chat-message-actions" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">ChatMessageActions</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="w-full max-w-md group/turn">
                  <ChatBubble>
                    <p class="text-sm text-foreground">Can you review the migration script before we run it against production?</p>
                  </ChatBubble>
                  <div class="flex justify-end mt-1">
                    <ChatMessageActions
                      :actions="[
                        { icon: Copy, label: 'Copy' },
                        { icon: Pencil, label: 'Edit & fork prompt' },
                        { icon: GitFork, label: 'Fork to new session' },
                      ]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Page Patterns -->
          <section id="page-patterns">
            <Separator class="my-14" />
            <h2 class="text-xs uppercase tracking-widest text-muted-foreground mb-5">Page Patterns</h2>
            <p class="text-base text-muted-foreground leading-relaxed mb-8">Higher-level compositions assembled from primitives — headers, search, settings shells, and more.</p>

            <div id="pat-page-header" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Page header</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-medium text-foreground">Project Settings</h3>
                    <p class="text-sm text-muted-foreground">Configure preferences for this project</p>
                  </div>
                  <Button size="sm">Save</Button>
                </div>
              </div>
            </div>

            <div id="pat-command-palette" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">CommandPalette</p>
              <div class="rounded-lg border border-border/50 p-6">
                <Button variant="outline" @click="paletteOpen = true">
                  <Search class="size-4" /> Open palette
                  <CommandShortcut class="ml-2">⌘K</CommandShortcut>
                </Button>
                <CommandDialog v-model:open="paletteOpen" title="Command Palette" description="Jump to a session, file, or action.">
                  <CommandInput placeholder="Search sessions, files, actions…" />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      <CommandItem><Bot class="size-4" /><span>Switch agent…</span><CommandShortcut>⌘J</CommandShortcut></CommandItem>
                      <CommandItem><Sparkles class="size-4" /><span>Switch model…</span></CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Sessions">
                      <CommandItem><MessageSquare class="size-4" /><span>Refactor auth middleware</span><span class="ml-auto text-xs text-muted-foreground/50">2h ago</span></CommandItem>
                      <CommandItem><MessageSquare class="size-4" /><span>Migration ordering bugfix</span><span class="ml-auto text-xs text-muted-foreground/50">yesterday</span></CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Files">
                      <CommandItem><FileText class="size-4" /><span class="font-mono text-xs">src/lib/customize-sections.ts</span></CommandItem>
                      <CommandItem><FolderGit2 class="size-4" /><span class="font-mono text-xs">apps/web/src/components/command-palette.tsx</span></CommandItem>
                    </CommandGroup>
                  </CommandList>
                  <CommandFooter>
                    <span class="flex items-center gap-1.5"><CommandKbd>↑</CommandKbd><CommandKbd>↓</CommandKbd> Navigate</span>
                    <span class="flex items-center gap-1.5"><CommandKbd>↵</CommandKbd> Select</span>
                    <span class="flex items-center gap-1.5"><CommandKbd>esc</CommandKbd> Close</span>
                    <span class="ml-auto flex items-center gap-1"><Hash class="size-3" />6 results</span>
                  </CommandFooter>
                </CommandDialog>
              </div>
            </div>

            <div id="pat-connection-pill" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">ConnectionPill</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="flex flex-col items-start gap-3">
                  <ConnectionPill status="connecting" label="Connecting to sandbox…" />
                  <ConnectionPill status="reconnecting" label="Reconnecting" detail="12s" />
                  <ConnectionPill status="degraded" label="Runtime services degraded" />
                  <ConnectionPill status="unreachable" label="Sandbox unreachable" detail="Retrying in 30s" />
                </div>
              </div>
            </div>

            <div id="pat-spotlight-card" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">SpotlightCard</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-for="item in [
                    { icon: Cable, label: 'tunnel-42', sub: 'exposes :3000' },
                    { icon: Radio, label: '#releases', sub: 'Slack channel' },
                    { icon: Sparkles, label: 'nightly-cron', sub: 'every day at 03:00' },
                    { icon: Plug, label: 'GitHub', sub: 'Connected' },
                  ]" :key="item.label" class="bg-card border border-border/50 rounded-2xl">
                    <div class="p-4 flex items-center gap-3 cursor-pointer">
                      <div class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-muted border border-border/50 shrink-0">
                        <component :is="item.icon" class="h-4 w-4 text-foreground" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-semibold text-foreground truncate">{{ item.label }}</div>
                        <div class="text-xs text-muted-foreground truncate">{{ item.sub }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-search-bar" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Search bar</p>
              <div class="relative max-w-sm">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search…" class="pl-9" />
              </div>
            </div>

            <div id="pat-toast" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Toast / Confirm dialog / Submit button</p>
              <div class="rounded-lg border border-border/50 p-6 flex flex-wrap gap-3 items-center">
                <Button variant="outline" @click="copyToClipboard('hello')">
                  <Copy class="size-4 mr-1.5" /> Copy text
                </Button>
                <Button variant="destructive" size="sm">Delete (see ConfirmDialog)</Button>
                <SubmitButton>Submit</SubmitButton>
              </div>
            </div>

            <div id="pat-stagger" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Stagger Mount</p>
              <div class="rounded-lg border border-border/50 p-6">
                <pre class="text-xs font-mono text-muted-foreground bg-muted/20 rounded-lg px-4 py-3 overflow-x-auto leading-relaxed">// Page header
&lt;div class="... animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-both"&gt;

// Search + action bar
&lt;div class="... animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-both delay-75"&gt;

// Content area
&lt;div class="... animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-both delay-150"&gt;</pre>
              </div>
            </div>

            <div id="pat-settings-shell" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">SettingsShell</p>
              <div class="rounded-lg border border-border/50 p-6">
                <Button variant="outline" @click="settingsOpen = true"><Settings class="size-4" /> Open Settings</Button>
                <SettingsShell
                  v-model:open="settingsOpen"
                  v-model:active="settingsActive"
                  :groups="[
                    { label: 'Preferences', items: [
                      { id: 'general', label: 'General', icon: SlidersHorizontal },
                      { id: 'appearance', label: 'Appearance', icon: Settings },
                      { id: 'notifications', label: 'Notifications', icon: Bell },
                    ]},
                    { label: 'Account', items: [
                      { id: 'profile', label: 'Profile', icon: User },
                    ]},
                  ]"
                >
                  <div v-if="settingsActive === 'general'" class="space-y-4">
                    <h3 class="text-sm font-semibold text-foreground">General</h3>
                    <div class="space-y-1.5">
                      <Label for="ds-settings-name">Display name</Label>
                      <Input id="ds-settings-name" default-value="Ada Lovelace" />
                    </div>
                  </div>
                  <div v-else-if="settingsActive === 'appearance'" class="space-y-4">
                    <h3 class="text-sm font-semibold text-foreground">Appearance</h3>
                    <RadioGroup default-value="system" class="space-y-2">
                      <label v-for="opt in [{value:'system',label:'System'},{value:'light',label:'Light'},{value:'dark',label:'Dark'}]" :key="opt.value" class="flex items-center gap-2.5 text-sm text-foreground cursor-pointer">
                        <RadioGroupItem :value="opt.value" :id="`ds-theme-${opt.value}`" /> {{ opt.label }}
                      </label>
                    </RadioGroup>
                  </div>
                  <div v-else-if="settingsActive === 'notifications'" class="space-y-4">
                    <h3 class="text-sm font-semibold text-foreground">Notifications</h3>
                    <div class="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3">
                      <div>
                        <div class="text-sm font-medium text-foreground">Email notifications</div>
                        <div class="text-xs text-muted-foreground/70">Run summaries and mentions</div>
                      </div>
                      <Switch :checked="true" />
                    </div>
                  </div>
                  <div v-else-if="settingsActive === 'profile'" class="space-y-4">
                    <h3 class="text-sm font-semibold text-foreground">Profile</h3>
                    <div class="flex items-center gap-3">
                      <UserAvatar name="Ada Lovelace" size="lg" />
                      <div>
                        <div class="text-sm font-medium text-foreground">Ada Lovelace</div>
                        <div class="text-xs text-muted-foreground/70">ada@kortix.ai</div>
                      </div>
                    </div>
                  </div>
                </SettingsShell>
              </div>
            </div>

            <div id="pat-overlay-shell" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">OverlayShell</p>
              <div class="rounded-lg border border-border/50 p-6">
                <Button variant="outline" @click="overlayOpen = true"><SlidersHorizontal class="size-4" /> Open Customize</Button>
                <OverlayShell
                  v-model:open="overlayOpen"
                  title="Customize"
                  subtitle="Vortex"
                  v-model:active="overlaySection"
                  :groups="[
                    { label: 'Build', items: [
                      { id: 'agents', label: 'Agents', icon: Bot },
                      { id: 'skills', label: 'Skills', icon: Sparkles },
                    ]},
                    { label: 'Connect', items: [
                      { id: 'connectors', label: 'Connectors', icon: Plug },
                      { id: 'channels', label: 'Channels', icon: MessageSquare },
                    ]},
                  ]"
                  :footer-group="[
                    { id: 'settings', label: 'Settings', icon: Settings },
                  ]"
                >
                  <div v-if="overlaySection === 'agents'" class="flex h-full">
                    <div class="w-60 flex-shrink-0 border-r border-border/60 p-3 overflow-y-auto">
                      <List>
                        <ListRow title="kortix" :trailing="undefined" />
                        <ListRow title="memory-reflector" />
                      </List>
                    </div>
                    <div class="flex-1 min-w-0 overflow-y-auto p-6">
                      <div class="flex items-center gap-2 mb-2">
                        <Badge variant="outline" size="sm">Agent</Badge>
                        <Badge variant="secondary" size="sm">Primary</Badge>
                      </div>
                      <h3 class="text-xl font-semibold text-foreground mb-2">kortix</h3>
                      <p class="text-sm text-muted-foreground leading-relaxed mb-6">Generic Kortix general knowledge worker. Hands-on, full tool access, handles coding / research / content / ops / data tasks end-to-end in an isolated session sandbox.</p>
                    </div>
                  </div>
                  <div v-else class="flex items-center justify-center h-full">
                    <EmptyState title="Mocked section" description="This demo only wires up the Agents section." />
                  </div>
                </OverlayShell>
              </div>
            </div>

            <div id="pat-status-pill" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Status pill / Diff stat / User avatar</p>
              <div class="rounded-lg border border-border/50 p-6 flex flex-wrap gap-6 items-center">
                <div class="flex items-center gap-2"><StatusDot tone="success" /> <span class="text-sm">Online</span></div>
                <StatusBadge tone="success">Active</StatusBadge>
                <DiffStat :additions="12" :deletions="4" />
                <UserAvatar email="ada@kortix.ai" name="Ada Lovelace" />
                <EntityAvatar label="Acme Corp" />
              </div>
            </div>

            <div id="pat-session-list-row" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Session list row</p>
              <div class="rounded-lg border border-border/50 p-6">
                <TooltipProvider>
                  <div class="max-w-xs rounded-2xl border border-border/60 bg-sidebar p-1.5 space-y-0.5">
                    <div v-for="(s, i) in [
                      { title: 'auth-rewrite', isActive: true, isBusy: true, pendingCount: 0, childCount: 3 },
                      { title: 'vortex-refactor', isActive: false, isBusy: false, pendingCount: 2, childCount: 0 },
                      { title: 'release-notes-draft', isActive: false, isBusy: false, pendingCount: 0, childCount: 0 },
                      { title: 'failed-migration-test', isActive: false, isBusy: false, pendingCount: 0, childCount: 0 },
                    ]" :key="i" :class="cn('group flex items-center gap-2 rounded-lg cursor-pointer transition-colors duration-150 pr-1.5 py-1 pl-2.5', s.isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground')">
                      <span v-if="s.isBusy || s.pendingCount > 0" class="flex-shrink-0">
                        <span :class="cn('h-1.5 w-1.5 rounded-full animate-pulse block', s.pendingCount > 0 ? 'bg-amber-500' : 'bg-emerald-500')" />
                      </span>
                      <span :class="cn('flex-1 truncate text-sm', s.isActive && 'font-medium')">{{ s.title }}</span>
                      <button v-if="s.childCount > 0" type="button" class="flex-shrink-0 inline-flex items-center rounded-full px-1.5 py-0.5 text-xs tabular-nums transition-colors cursor-pointer bg-sidebar-accent/80 text-sidebar-foreground">{{ s.childCount }}</button>
                      <span v-if="s.pendingCount > 0" class="flex-shrink-0 h-4 min-w-4 px-1 rounded-full bg-amber-500/15 text-amber-500 text-xs font-medium flex items-center justify-center">{{ s.pendingCount }}</span>
                      <div class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger as-child>
                            <button class="p-0.5 rounded-md hover:bg-sidebar-accent transition-colors duration-150 text-muted-foreground hover:text-sidebar-foreground cursor-pointer opacity-0 group-hover:opacity-100">
                              <MoreHorizontal class="h-3.5 w-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" class="w-40 p-1">
                            <DropdownMenuItem><Pencil class="h-4 w-4" /> Rename</DropdownMenuItem>
                            <DropdownMenuItem><Layers class="h-4 w-4" /> Compact</DropdownMenuItem>
                            <DropdownMenuItem><Archive class="h-4 w-4" /> Archive</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive"><Trash2 class="h-4 w-4" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </TooltipProvider>
              </div>
            </div>

            <div id="pat-model-selector" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">ModelSelector</p>
              <div class="rounded-lg border border-border/50 p-6">
                <CommandPopover>
                  <CommandPopoverTrigger>
                    <button type="button" class="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 cursor-pointer">
                      <span class="truncate max-w-[160px]">Claude Sonnet 4.6</span>
                      <ChevronDown class="size-3 opacity-50 transition-transform duration-200" />
                    </button>
                  </CommandPopoverTrigger>
                  <CommandPopoverContent side="bottom" align="start" :side-offset="8" class="w-[320px]">
                    <CommandInput compact placeholder="Search models…" />
                    <CommandList class="max-h-[340px]">
                      <CommandGroup heading="Anthropic">
                        <CommandItem v-for="m in [{name:'Claude Opus 4.8',id:'claude-opus-4-8'},{name:'Claude Sonnet 4.6',id:'claude-sonnet-4-6'},{name:'Claude Haiku 4.5',id:'claude-haiku-4-5'}]" :key="m.id" :class="cn('!pl-3', m.id==='claude-sonnet-4-6' && 'bg-foreground/[0.06]')">
                          <div class="min-w-0 flex-1 py-0.5">
                            <div :class="cn('truncate text-sm leading-tight', m.id==='claude-sonnet-4-6' ? 'font-semibold text-foreground' : 'font-medium text-foreground/90')">{{ m.name }}</div>
                            <p class="truncate text-xs text-muted-foreground/55 leading-snug mt-1">{{ m.id }}</p>
                          </div>
                          <Check v-if="m.id==='claude-sonnet-4-6'" class="text-foreground shrink-0" />
                        </CommandItem>
                      </CommandGroup>
                      <CommandGroup heading="OpenCode">
                        <CommandItem v-for="m in [{name:'Kimi K2',id:'kimi-k2'},{name:'Qwen3 Coder',id:'qwen3-coder'}]" :key="m.id" class="!pl-3">
                          <div class="min-w-0 flex-1 py-0.5">
                            <div class="truncate text-sm leading-tight font-medium text-foreground/90">{{ m.name }}</div>
                            <p class="truncate text-xs text-muted-foreground/55 leading-snug mt-1">{{ m.id }}</p>
                          </div>
                          <Tag variant="free">Free</Tag>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                    <CommandFooter class="cursor-pointer select-none hover:bg-foreground/[0.04] hover:text-foreground transition-colors">
                      <Eye class="h-3.5 w-3.5" />
                      <span>Show older models</span>
                    </CommandFooter>
                  </CommandPopoverContent>
                </CommandPopover>
              </div>
            </div>

            <div id="pat-shortcuts" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Keyboard shortcuts reference</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="max-w-md rounded-2xl border border-border/60 divide-y divide-border/60">
                  <div v-for="s in [
                    { label: 'Command palette', keys: ['⌘','K'] },
                    { label: 'New session', keys: ['Ctrl','J'] },
                    { label: 'Toggle left sidebar', keys: ['Ctrl','B'] },
                    { label: 'Toggle right sidebar', keys: ['Ctrl','Shift','B'] },
                    { label: 'Next tab', keys: ['⌘','Shift',']'] },
                    { label: 'Close active tab', keys: ['Ctrl','W'] },
                  ]" :key="s.label" class="flex items-center justify-between px-3 py-2.5">
                    <span class="text-sm text-foreground">{{ s.label }}</span>
                    <KbdGroup><Kbd v-for="(k,i) in s.keys" :key="i">{{ k }}</Kbd></KbdGroup>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-provider-modal" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Connect provider</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="space-y-3 max-w-md">
                  <Button variant="outline"><Plug class="size-4" /> Connect provider</Button>
                  <div class="rounded-2xl border border-border/60 divide-y divide-border/60">
                    <div v-for="p in [{name:'Anthropic',id:'anthropic'},{name:'OpenAI',id:'openai'},{name:'OpenCode',id:'opencode'}]" :key="p.id" class="flex items-center gap-3 px-4 py-3">
                      <div class="size-9 rounded-xl bg-muted border border-border/50 flex items-center justify-center text-xs font-semibold text-muted-foreground">{{ p.name.charAt(0) }}</div>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-foreground">{{ p.name }}</div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-session-header" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Session header</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="relative rounded-2xl border border-border/60 bg-card h-14 overflow-hidden">
                  <div class="absolute inset-0 flex items-center justify-between px-3">
                    <div class="group flex items-center gap-1.5 min-w-0">
                      <span class="truncate text-sm font-medium text-foreground">{{ headerTitle }}</span>
                      <button type="button" class="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground cursor-pointer">
                        <Pencil class="size-3.5" />
                      </button>
                    </div>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-foreground"><MoreHorizontal class="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-44">
                          <DropdownMenuItem><Pencil class="h-4 w-4" /> Rename…</DropdownMenuItem>
                          <DropdownMenuItem @click="shareDialogOpen = true"><Share2 class="h-4 w-4" /> Share…</DropdownMenuItem>
                          <DropdownMenuItem><RotateCcw class="h-4 w-4" /> Restart</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive"><Trash2 class="h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-foreground"><SlidersHorizontal class="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-share-dialog" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Share session</p>
              <div class="rounded-lg border border-border/50 p-6">
                <Button variant="outline" @click="shareDialogOpen = true"><Share2 class="size-4" /> Share session</Button>
                <Dialog v-model:open="shareDialogOpen">
                  <DialogContent class="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share session</DialogTitle>
                      <DialogDescription>Sessions are private to you by default. Share read/continue access with your team or specific members.</DialogDescription>
                    </DialogHeader>
                    <div class="py-1">
                      <Label class="text-xs text-muted-foreground">Who can access this session</Label>
                      <RadioGroup v-model="shareMode" class="space-y-1.5 mt-2">
                        <label v-for="opt in [
                          { value: 'project', label: 'Whole team', desc: 'Everyone in this project', icon: Globe },
                          { value: 'private', label: 'Only you', desc: 'Private — just you', icon: Lock },
                          { value: 'members', label: 'Select members', desc: 'A chosen list of members', icon: User },
                        ]" :key="opt.value" :class="cn('flex cursor-pointer items-center gap-3 rounded-2xl border p-2.5 transition-colors focus-within:ring-2 focus-within:ring-primary/50', shareMode === opt.value ? 'border-primary/50 bg-primary/[0.05]' : 'border-border/60 hover:bg-muted/40')">
                          <RadioGroupItem :value="opt.value" class="sr-only" />
                          <span :class="cn('flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors', shareMode === opt.value ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')">
                            <component :is="opt.icon" class="h-4 w-4" />
                          </span>
                          <div class="min-w-0 flex-1">
                            <div class="text-sm font-medium text-foreground">{{ opt.label }}</div>
                            <div class="text-xs text-muted-foreground">{{ opt.desc }}</div>
                          </div>
                          <Check v-if="shareMode === opt.value" class="h-4 w-4 shrink-0 text-primary" />
                        </label>
                      </RadioGroup>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" @click="shareDialogOpen = false">Cancel</Button>
                      <Button @click="shareDialogOpen = false">Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div id="pat-command-palette-nav" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Command palette — submenu navigation</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="flex items-center gap-2 px-1 pb-0.5 text-xs text-muted-foreground">
                  <button type="button" class="group flex items-center gap-1 rounded-md px-1.5 py-0.5 -ml-1.5 hover:text-foreground hover:bg-foreground/[0.04] transition-colors cursor-pointer">
                    <ChevronLeft class="h-3 w-3" /> <span>Back</span>
                  </button>
                  <span class="text-muted-foreground/25">/</span>
                  <span class="font-medium text-foreground/85">Change Agent</span>
                </div>
                <div class="rounded-2xl border border-border/60 mt-2 divide-y divide-border/40">
                  <div v-for="a in [{name:'Default agent',desc:'General-purpose'},{name:'Code reviewer',desc:'Reviews diffs & PRs'},{name:'Researcher',desc:'Web search & synthesis'}]" :key="a.name" class="flex items-center gap-2 px-3 py-2 text-sm">
                    <EntityAvatar size="xs" :name="a.name" />
                    <span class="flex-1 truncate">{{ a.name }}</span>
                    <span class="text-xs text-muted-foreground/40 truncate max-w-[160px]">{{ a.desc }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-notifications-bell" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Notifications bell</p>
              <div class="rounded-lg border border-border/50 p-6">
                <Popover v-model:open="notifBellOpen">
                  <PopoverTrigger as-child>
                    <Button variant="ghost" size="sm" class="relative h-8 w-8 p-0 text-muted-foreground/60 hover:text-foreground">
                      <Bell class="h-4 w-4" />
                      <span class="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-[3px] inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-semibold leading-none tabular-nums ring-2 ring-background">3</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" :side-offset="8" class="w-[400px] p-0 overflow-hidden border-border/60">
                    <div class="flex items-center gap-2 px-4 h-10 border-b border-border/40">
                      <Bell class="h-3.5 w-3.5 text-muted-foreground/55" />
                      <span class="text-[10px] uppercase tracking-[0.08em] text-muted-foreground/55 font-semibold">Notifications</span>
                      <Button variant="ghost" size="sm" class="ml-auto h-6 px-2 text-[11px] text-muted-foreground/60 hover:text-foreground gap-1"><CheckCheck class="h-3 w-3" /> Mark all read</Button>
                    </div>
                    <ul class="max-h-[420px] overflow-y-auto divide-y divide-border/30">
                      <li v-for="n in [
                        { id:'n1', actor:'@sarah', kind:'mention', summary:'mentioned you', ticket:'#142 Refresh-token rotation', message: 'Can you take a look at the retry logic here before we ship?', when:'14m ago' },
                        { id:'n2', actor:'@github-bot', kind:'assign', summary:'assigned you', ticket:'#138 Webhook signature check', when:'2h ago' },
                      ]" :key="n.id">
                        <button class="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-muted/25 transition-colors cursor-pointer bg-primary/[0.04]">
                          <div class="relative shrink-0">
                            <UserAvatar :handle="n.actor" size="md" />
                            <span class="absolute -bottom-0.5 -right-0.5 inline-flex h-[14px] w-[14px] items-center justify-center rounded-full bg-background ring-1 ring-border/60 text-primary/80">
                              <component :is="n.kind === 'mention' ? AtSignIcon : UserPlus" class="h-2.5 w-2.5" />
                            </span>
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="flex items-baseline gap-1.5 text-[12px] text-foreground/85">
                              <span class="font-semibold truncate max-w-[110px]">{{ n.actor }}</span>
                              <span class="text-muted-foreground/70 truncate">{{ n.summary }}</span>
                              <span class="text-muted-foreground/55 truncate">on {{ n.ticket }}</span>
                            </div>
                            <p v-if="n.message" class="text-[12px] text-muted-foreground/75 line-clamp-2 mt-0.5 leading-snug">{{ n.message }}</p>
                          </div>
                          <div class="flex flex-col items-end gap-0.5 shrink-0">
                            <span class="text-[10px] text-muted-foreground/45 tabular-nums whitespace-nowrap">{{ n.when }}</span>
                            <span class="h-1.5 w-1.5 rounded-full bg-primary" />
                          </div>
                        </button>
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div id="pat-notifications-settings" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Notification settings</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="max-w-md rounded-2xl border border-border/60 bg-card overflow-hidden">
                  <div class="p-6 space-y-6">
                    <div>
                      <h3 class="text-lg font-semibold">Notifications</h3>
                      <p class="text-sm text-muted-foreground mt-1">Configure how and when you receive notifications.</p>
                    </div>
                    <div class="rounded-2xl border border-border/60">
                      <div class="flex items-start justify-between gap-4 px-4 py-3">
                        <div class="flex items-start gap-3 flex-1">
                          <Bell class="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div class="space-y-0.5 flex-1">
                            <Label class="text-sm font-medium cursor-pointer">Enable notifications</Label>
                            <p class="text-xs text-muted-foreground">Browser permission granted</p>
                          </div>
                        </div>
                        <Switch v-model:checked="notifEnabled" />
                      </div>
                    </div>
                    <div v-if="notifEnabled">
                      <h4 class="text-sm font-medium mb-3">Notification types</h4>
                      <div class="rounded-2xl border border-border/60 divide-y divide-border/60">
                        <div v-for="t in [
                          { icon: CheckCircle2, label: 'Task completions', desc: 'When a session finishes its task', key: 'onCompletion' },
                          { icon: AlertTriangle, label: 'Errors', desc: 'When a session encounters an error', key: 'onError' },
                          { icon: HelpCircle, label: 'Questions', desc: 'When Kortix needs your input to continue', key: 'onQuestion' },
                          { icon: ShieldCheck, label: 'Permission requests', desc: 'When Kortix needs permission to use a tool', key: 'onPermission' },
                        ]" :key="t.key" class="flex items-start justify-between gap-4 px-4 py-3">
                          <div class="flex items-start gap-3 flex-1">
                            <component :is="t.icon" class="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div class="space-y-0.5 flex-1">
                              <Label class="text-sm font-medium cursor-pointer">{{ t.label }}</Label>
                              <p class="text-xs text-muted-foreground">{{ t.desc }}</p>
                            </div>
                          </div>
                          <Switch v-model:checked="(notifPrefs as any)[t.key]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-wallpaper-picker" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Wallpaper picker</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="grid grid-cols-3 gap-2 max-w-xl">
                  <button v-for="wp in [
                    { id: 'brandmark', name: 'Brandmark', isDefault: true },
                    { id: 'symbol', name: 'Symbol' },
                    { id: 'aurora', name: 'Aurora' },
                  ]" :key="wp.id" type="button" class="group relative cursor-pointer rounded-2xl text-left" @click="wallpaperId = wp.id">
                    <div :class="cn('relative w-full aspect-video bg-background overflow-hidden rounded-2xl isolate border transition-colors duration-200', wallpaperId === wp.id ? 'border-primary' : 'border-border group-hover:border-border/80')">
                      <div class="absolute inset-0 flex items-center justify-center bg-background">
                        <div class="size-10 rounded-xl bg-foreground/[0.08]" />
                      </div>
                      <div v-if="wallpaperId === wp.id" class="absolute top-1 right-1 size-4 rounded-full bg-primary flex items-center justify-center shadow-md">
                        <Check class="size-2.5 text-primary-foreground" />
                      </div>
                    </div>
                    <div class="px-1.5 py-1">
                      <span class="text-xs font-medium text-foreground flex items-center gap-1">
                        {{ wp.name }}
                        <span v-if="wp.isDefault" class="text-xs font-medium px-1 py-px rounded-full bg-muted text-muted-foreground">Default</span>
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div id="pat-agent-avatar" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Agent &amp; user avatars</p>
              <div class="rounded-lg border border-border/50 p-6 space-y-5">
                <div>
                  <p class="text-xs text-muted-foreground mb-2.5">Agents — hue + icon, fixed saturation/lightness</p>
                  <div class="flex flex-wrap items-center gap-3">
                    <div v-for="a in [
                      { slug: 'kortix', hue: 210, icon: Bot },
                      { slug: 'qa-bot', hue: 145, icon: ClipboardCheck },
                      { slug: 'sec-review', hue: 280, icon: Shield },
                      { slug: 'doc-writer', hue: 35, icon: BookOpen },
                    ]" :key="a.slug" class="flex items-center gap-2 rounded-full border border-border/50 bg-muted/20 py-1 pl-1 pr-3">
                      <span class="inline-flex items-center justify-center rounded-full shrink-0" :style="{ width: '26px', height: '26px', backgroundColor: `hsl(${a.hue} 55% 22%)`, color: `hsl(${a.hue} 90% 80%)`, boxShadow: `inset 0 0 0 1px hsl(${a.hue} 70% 45% / 0.45)` }">
                        <component :is="a.icon" :style="{ width: '15px', height: '15px' }" />
                      </span>
                      <span class="text-xs text-foreground/80">@{{ a.slug }}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-muted-foreground mb-2.5">Users — handle-derived hue, initials fallback</p>
                  <div class="flex flex-wrap items-center gap-3">
                    <div v-for="u in ['sarah','marco','priya','alex']" :key="u" class="flex items-center gap-2 rounded-full border border-border/50 bg-muted/20 py-1 pl-1 pr-3">
                      <UserAvatar :handle="u" size="sm" />
                      <span class="text-xs text-foreground/80">@{{ u }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-mention-textarea" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Mention textarea</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="max-w-lg space-y-2">
                  <Popover v-model:open="mentionMenuOpen">
                    <PopoverTrigger as-child>
                      <div class="rounded-2xl border border-border bg-card px-3.5 py-3 transition-colors focus-within:border-foreground/20">
                        <Textarea v-model="mentionText" :rows="3" class="w-full resize-none border-none bg-transparent text-sm leading-relaxed outline-none" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent align="start" class="w-64 p-1.5">
                      <p class="px-2 pb-1 pt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/55 font-semibold">Mention someone</p>
                      <div class="space-y-0.5">
                        <button v-for="m in [{slug:'sarah',hue:210},{slug:'marco',hue:30},{slug:'kortix',hue:210,agent:true},{slug:'qa-bot',hue:145,agent:true}]" :key="m.slug" type="button" class="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-foreground/[0.05] transition-colors">
                          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full shrink-0 text-[10px] font-semibold" :style="{ backgroundColor: `hsl(${m.hue} 55% 22%)`, color: `hsl(${m.hue} 90% 80%)` }">{{ m.slug.charAt(0).toUpperCase() }}</span>
                          <span class="text-foreground/85">@{{ m.slug }}</span>
                          <Badge v-if="m.agent" variant="outline" size="sm" class="ml-auto">Agent</Badge>
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button variant="outline" size="sm" @click="mentionMenuOpen = true"><AtSignIcon class="size-3.5" /> Mention someone</Button>
                </div>
              </div>
            </div>

            <div id="pat-diff-view" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Diff view</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="overflow-hidden rounded-2xl border border-border/60">
                  <div class="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-3.5 py-2 text-xs">
                    <FileCode class="size-3.5 text-muted-foreground/60" />
                    <span class="font-mono text-foreground/75">src/lib/retry.ts</span>
                    <span class="ml-auto flex items-center gap-2 text-muted-foreground/50">
                      <span class="text-emerald-500">+5</span>
                      <span class="text-destructive/70">−1</span>
                    </span>
                  </div>
                  <div class="font-mono text-xs leading-[1.7] py-2">
                    <div v-for="(line, i) in [
                      { text: 'export function retry(fn, attempts = 3, delayMs = 200) {', added: true },
                      { text: '  for (let i = 0; i < attempts; i++) {', added: false },
                      { text: '    try { return await fn(); }', added: true },
                      { text: '    catch (e) {', added: true },
                      { text: '      await sleep(delayMs * (i + 1));', added: true },
                      { text: '  }', added: false },
                    ]" :key="i" :class="cn('flex gap-3 px-3', line.added && 'bg-emerald-500/[0.07]')">
                      <span class="w-4 shrink-0 select-none text-right text-muted-foreground/30">{{ i + 1 }}</span>
                      <span :class="cn('shrink-0 select-none', line.added ? 'text-emerald-500/80' : 'text-transparent')">{{ line.added ? '+' : ' ' }}</span>
                      <span class="whitespace-pre text-foreground/75">{{ line.text }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-session-sidebar" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Session sidebar</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="flex h-[360px] max-w-md overflow-hidden rounded-2xl border border-border/60 bg-sidebar">
                  <div class="flex flex-col flex-1 min-w-0">
                    <div class="shrink-0 border-b border-border/50 px-2.5 py-2.5 flex items-center gap-2">
                      <Button variant="ghost" size="icon-sm" @click="sidebarCollapsed = !sidebarCollapsed"><GripVertical class="size-4" /></Button>
                      <span class="text-xs font-medium text-foreground">Sessions</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-2">
                      <ul class="space-y-0.5">
                        <li v-for="s in [
                          { id: 's1', name: 'auth-rewrite', when: '2h' },
                          { id: 's2', name: 'vortex-refactor', when: '1d' },
                          { id: 's3', name: 'release-notes-draft', when: '3d' },
                        ]" :key="s.id">
                          <button type="button" :class="cn('flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors', sidebarActiveSession === s.id ? 'bg-primary/[0.05] border-l-2 border-l-primary text-foreground' : 'border-l-2 border-l-transparent text-muted-foreground/75 hover:bg-muted/50 hover:text-foreground')" @click="sidebarActiveSession = s.id">
                            <MessageCircle class="size-3.5 shrink-0" />
                            <span class="flex-1 truncate">{{ s.name }}</span>
                            <span class="shrink-0 text-[10px] text-muted-foreground/40 tabular-nums">{{ s.when }}</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div class="shrink-0 border-t border-border/50 px-2.5 py-2.5 flex items-center gap-2 text-sm text-muted-foreground">
                      <History class="size-4" /> History
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-file-tree" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">File tree</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="overflow-hidden rounded-2xl border border-border/70 bg-card">
                  <div class="flex h-11 items-center gap-2.5 border-b border-border/60 bg-muted/30 px-4">
                    <span class="flex size-5 items-center justify-center rounded-md bg-foreground text-[10px] font-semibold text-background">K</span>
                    <span class="text-sm font-medium text-foreground">kortix-ui</span>
                    <span class="inline-flex items-center gap-1 rounded-full border border-border/70 px-2 py-0.5 text-xs text-muted-foreground"><GitBranch class="size-3" /> main</span>
                  </div>
                  <div class="grid h-[340px] grid-cols-[200px_minmax(0,1fr)]">
                    <div class="overflow-y-auto border-r border-border/60 bg-muted/[0.18] p-2 text-sm">
                      <div class="flex items-center gap-1.5 py-1 px-2 rounded text-muted-foreground"><ChevronDown class="size-3.5" /><Folder class="size-3.5" /> src</div>
                      <div class="flex items-center gap-1.5 py-1 pl-7 pr-2 rounded text-muted-foreground"><ChevronRight class="size-3.5" /><Folder class="size-3.5" /> components</div>
                      <div :class="cn('flex items-center gap-1.5 py-1 pl-7 pr-2 rounded cursor-pointer', fileTreeSelected==='src/lib/retry.ts' ? 'bg-primary/[0.07] text-foreground' : 'text-muted-foreground')" @click="fileTreeSelected = 'src/lib/retry.ts'"><File class="size-3.5" /> retry.ts</div>
                      <div class="flex items-center gap-1.5 py-1 px-2 rounded text-muted-foreground"><File class="size-3.5" /> package.json</div>
                      <div class="flex items-center gap-1.5 py-1 px-2 rounded text-muted-foreground"><File class="size-3.5" /> README.md</div>
                    </div>
                    <div class="flex min-w-0 flex-col overflow-hidden">
                      <div class="flex items-center gap-1.5 border-b border-border/50 px-4 py-2 text-xs text-muted-foreground/70">
                        <span v-for="(seg,i) in fileTreeSelected.split('/')" :key="i" class="flex items-center gap-1.5">
                          <span v-if="i>0" class="text-muted-foreground/30">/</span>
                          <span :class="i === fileTreeSelected.split('/').length-1 ? 'text-foreground/80 font-medium' : undefined">{{ seg }}</span>
                        </span>
                      </div>
                      <div class="flex-1 overflow-auto p-4 font-mono text-xs leading-[1.7] text-foreground/75">
                        <div v-for="(line,i) in [
                          'export function retry(fn, attempts = 3) {',
                          '  for (let i = 0; i < attempts; i++) {',
                          '    try { return fn(); }',
                          '  }',
                          '}',
                        ]" :key="i" class="flex gap-3">
                          <span class="w-4 shrink-0 select-none text-right text-muted-foreground/30">{{ i+1 }}</span>
                          <span class="whitespace-pre">{{ line }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-terminal-output" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Terminal output</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="overflow-hidden rounded-2xl border border-border/60 bg-[#0b0b0c]">
                  <div class="flex items-center gap-2 border-b border-white/10 px-3.5 py-2 text-xs text-white/60">
                    <span class="size-1.5 rounded-full bg-emerald-500" /> live · pnpm test
                  </div>
                  <div class="p-3 font-mono text-xs leading-[1.7] text-white/70 space-y-0.5 max-h-[220px] overflow-auto">
                    <div class="text-sky-400">$ pnpm test --filter @kortix/ui</div>
                    <div class="text-white/40">Scope: 1 of 14 workspace projects</div>
                    <div></div>
                    <div class="text-white/40"> RUN  v2.1.4 packages/ui</div>
                    <div class="text-emerald-400">✓ button.test.tsx (4 tests) 12ms</div>
                    <div class="text-emerald-400">✓ card.test.tsx (2 tests) 6ms</div>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-tab-bar" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Tab bar &amp; split layout</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="overflow-hidden rounded-2xl border border-border/70 bg-card">
                  <div class="flex h-[38px] items-center border-b border-border/60 bg-muted/20 pl-1 pr-2">
                    <div class="flex h-full flex-1 items-center gap-0.5 overflow-x-auto">
                      <button v-for="tab in [
                        { id: 'session-layout', label: 'session-layout.tsx', icon: FileCode },
                        { id: 'retry', label: 'retry.ts', icon: FileCode },
                        { id: 'readme', label: 'README.md', icon: FileText },
                      ]" :key="tab.id" type="button" :class="cn('group relative flex h-full cursor-pointer items-center gap-1.5 rounded-t-lg px-3 text-sm transition-colors', demoActiveTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')" @click="demoActiveTab = tab.id">
                        <component :is="tab.icon" class="size-3.5 shrink-0 text-muted-foreground/70" />
                        <span class="max-w-[140px] truncate">{{ tab.label }}</span>
                        <X class="size-3.5 shrink-0 rounded text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/60 hover:bg-muted" />
                        <span v-if="demoActiveTab === tab.id" class="absolute -bottom-px left-2 right-2 h-[2px] bg-foreground/80" />
                      </button>
                    </div>
                    <span class="inline-flex items-center gap-1 rounded-full border border-border/70 px-2 py-0.5 text-xs text-muted-foreground"><GitBranch class="size-3" /> main</span>
                  </div>
                  <div class="flex h-[220px]">
                    <div class="flex-1 flex items-center justify-center text-sm text-muted-foreground">Editor pane mock</div>
                    <div class="w-64 border-l border-border/60 flex flex-col">
                      <div class="flex items-center gap-4 border-b border-border/50 px-4 pt-2.5">
                        <button v-for="tab in [{id:'actions',label:'Actions'},{id:'browser',label:'Browser'},{id:'files',label:'Files'},{id:'terminal',label:'Terminal'}]" :key="tab.id" type="button" :class="cn('relative cursor-pointer pb-2.5 text-sm transition-colors', demoSidePanelTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')" @click="demoSidePanelTab = tab.id">
                          {{ tab.label }}
                          <span v-if="demoSidePanelTab === tab.id" class="absolute -bottom-px left-0 right-0 h-[2px] bg-foreground/80" />
                        </button>
                      </div>
                      <div class="flex flex-1 items-center justify-center p-4 text-center text-sm text-muted-foreground">
                        <span v-if="demoSidePanelTab==='terminal'" class="inline-flex items-center gap-2"><Terminal class="size-4" /> Terminal panel mock</span>
                        <span v-else-if="demoSidePanelTab==='files'" class="inline-flex items-center gap-2"><Folder class="size-4" /> File browser mock</span>
                        <span v-else-if="demoSidePanelTab==='browser'" class="inline-flex items-center gap-2"><ImageIcon class="size-4" /> Browser preview mock</span>
                        <span v-else class="inline-flex items-center gap-2"><ListTree class="size-4" /> Actions timeline mock</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-new-session" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">New session</p>
              <div class="rounded-lg border border-border/50 p-6">
                <div class="relative flex h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-[#0b0b0c]">
                  <div class="absolute inset-0 flex items-center justify-center opacity-30">
                    <div class="size-[220px] rounded-full border-[24px] border-white/[0.04]" />
                  </div>
                  <div class="relative mt-auto p-5">
                    <div class="flex items-center gap-2 overflow-x-auto pb-2.5">
                      <button v-for="p in [
                        { icon: Building2, label: 'Onboard your agent' },
                        { icon: Globe, label: 'Build a landing page' },
                        { icon: Search, label: 'Research competitors' },
                        { icon: Presentation, label: 'Create a pitch deck' },
                      ]" :key="p.label" type="button" class="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white" @click="newSessionText = `${p.label} for our team`">
                        <component :is="p.icon" class="size-3.5" /> {{ p.label }}
                      </button>
                    </div>
                    <div class="mt-2.5 w-full overflow-visible rounded-[24px] border border-border bg-card transition-colors focus-within:border-foreground/20">
                      <div class="flex flex-col gap-2">
                        <div class="px-3.5">
                          <Textarea v-model="newSessionText" placeholder="Describe a task to start a session…" :rows="1" class="relative max-h-[200px] min-h-[72px] w-full resize-none overflow-y-auto border-none bg-transparent px-0.5 pb-6 pt-4 text-sm leading-relaxed outline-none" />
                        </div>
                        <div class="mb-1.5 flex items-center justify-between gap-1 pl-2 pr-1.5">
                          <button type="button" class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2 py-1 text-xs text-muted-foreground hover:bg-muted/50 transition-colors">
                            <Package class="size-3.5" /><span class="max-w-[10rem] truncate">Default</span><span class="size-1.5 rounded-full bg-emerald-500" />
                          </button>
                          <Button size="sm" :disabled="!newSessionText.trim()" aria-label="Start session" class="h-8 w-8 shrink-0 rounded-full p-0"><ArrowUp class="size-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="pat-empty-state" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Empty state / Info banner</p>
              <EmptyState title="No results found" class="mb-4">
                <template #description>Try adjusting your filters or search terms.</template>
              </EmptyState>
              <InfoBanner title="Free plan">This workspace is on the free plan — upgrade for more seats.</InfoBanner>
            </div>
          </section>

          <!-- Primitives -->
          <section id="patterns">
            <Separator class="my-14" />
            <h2 class="text-xs uppercase tracking-widest text-muted-foreground mb-5">Primitives</h2>
            <p class="text-base text-muted-foreground leading-relaxed mb-8">Layout and content primitives that compose into full pages.</p>

            <div id="pat-page-shell" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">PageShell / Section / SectionCard</p>
              <PageShell>
                <BrandSection label="Members">
                  <SectionCard title="Active members" description="3 people have access">
                    <p class="text-sm text-muted-foreground">Ada, Grace, Alan</p>
                  </SectionCard>
                </BrandSection>
              </PageShell>
            </div>

            <div id="pat-section" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Section</p>
              <div class="rounded-lg border border-border/50 p-6">
                <BrandSection label="About">
                  <p class="text-sm text-foreground leading-relaxed">Description content lives here. Sections separate concerns on a page without ever drawing a card.</p>
                </BrandSection>
                <BrandSection label="Details">
                  <template #action><Button variant="ghost" size="sm" class="h-6 px-2 text-xs">Edit</Button></template>
                  <p class="text-sm text-muted-foreground">A second section with a trailing action.</p>
                </BrandSection>
              </div>
            </div>

            <div id="pat-section-card" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">SectionCard</p>
              <div class="rounded-lg border border-border/50 p-6 space-y-4">
                <SectionCard title="Members" :count="2" description="People with access to this account.">
                  <template #action><Button size="sm" class="h-8 px-3 text-sm">Invite</Button></template>
                  <p class="text-sm text-muted-foreground">Body content sits in the padded region. Pass <code>flush</code> to drop the padding for a List.</p>
                </SectionCard>
                <SectionCard tone="destructive" title="Danger zone" description="Irreversible actions live here.">
                  <div class="flex items-center justify-between gap-4">
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-foreground">Delete this account</p>
                      <p class="mt-0.5 text-xs text-muted-foreground">Permanently removes the account and all its data.</p>
                    </div>
                    <Button variant="outline" size="sm" class="shrink-0">Delete</Button>
                  </div>
                </SectionCard>
              </div>
            </div>

            <div id="pat-avatars" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Avatars</p>
              <div class="rounded-lg border border-border/50 p-6 space-y-5">
                <div class="flex items-center gap-4">
                  <span class="w-24 text-xs uppercase tracking-wider text-muted-foreground">People</span>
                  <UserAvatar email="ada@kortix.ai" name="Ada Lovelace" size="sm" />
                  <UserAvatar email="grace@kortix.ai" name="Grace Hopper" />
                  <UserAvatar email="alan@kortix.ai" name="Alan Turing" size="lg" />
                </div>
                <div class="flex items-center gap-4">
                  <span class="w-24 text-xs uppercase tracking-wider text-muted-foreground">Things</span>
                  <EntityAvatar label="Acme AGI" size="sm" />
                  <EntityAvatar label="Kortix" />
                  <EntityAvatar :icon="FolderGit2" />
                  <EntityAvatar :icon="User" size="lg" />
                </div>
              </div>
            </div>

            <div id="pat-list" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">List &amp; ListRow</p>
              <div class="rounded-lg border border-border/50 p-0 overflow-hidden">
                <SectionCard title="Members" :count="2" flush>
                  <List>
                    <ListRow title="grace@kortix.ai">
                      <template #leading><UserAvatar email="grace@kortix.ai" name="Grace Hopper" /></template>
                      <template #badges><Badge variant="outline" size="sm">You</Badge></template>
                      <template #subtitle><InlineMeta><span>Joined Mar 3, 2026</span><span>4 projects</span></InlineMeta></template>
                      <template #trailing><Badge variant="outline" size="sm" class="border-foreground/30 text-foreground">Owner</Badge></template>
                    </ListRow>
                    <ListRow title="alan@kortix.ai">
                      <template #leading><UserAvatar email="alan@kortix.ai" name="Alan Turing" /></template>
                      <template #subtitle><InlineMeta><span>Joined Apr 1, 2026</span></InlineMeta></template>
                      <template #trailing><Badge variant="outline" size="sm">Member</Badge></template>
                    </ListRow>
                  </List>
                </SectionCard>
              </div>
            </div>

            <div id="pat-definition-list" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">DefinitionList / InlineMeta</p>
              <DefinitionList class="mb-4">
                <DefinitionRow label="Owner">Ada Lovelace</DefinitionRow>
                <DefinitionRow label="Created">Jan 12, 2025</DefinitionRow>
                <DefinitionRow label="Plan">Pro</DefinitionRow>
              </DefinitionList>
              <InlineMeta>3 members · Updated 2h ago · Public</InlineMeta>
            </div>

            <div id="pat-inline-meta" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">InlineMeta</p>
              <div class="rounded-lg border border-border/50 p-6">
                <InlineMeta>
                  <span class="font-mono text-foreground">/workspace/jjk</span>
                  <span>24 issues</span>
                  <span>created 2d ago</span>
                  <span>8 sessions</span>
                </InlineMeta>
              </div>
            </div>

            <div id="pat-empty-state" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">EmptyState</p>
              <div class="rounded-lg border border-border/50 p-0 overflow-hidden">
                <EmptyState :icon="Folder" title="No issues yet" description="Create your first issue with C, or import from a session.">
                  <template #action><Button size="sm" class="h-8 px-4 text-sm">New issue</Button></template>
                  <template #secondaryAction><Button variant="ghost" size="sm" class="h-8 px-3 text-sm">Learn more</Button></template>
                </EmptyState>
              </div>
            </div>

            <div id="pat-info-banner" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">InfoBanner</p>
              <div class="rounded-lg border border-border/50 p-6 space-y-3">
                <InfoBanner tone="info" title="Heads up">The manifest is being re-synced — secrets apply in a moment.</InfoBanner>
                <InfoBanner tone="warning" title="Email skipped">Mailtrap isn't configured locally. Copy the invite link to share it.</InfoBanner>
                <InfoBanner tone="success" title="All set">
                  <template #action><Button size="sm" variant="ghost" class="h-7 px-2 text-xs">Dismiss</Button></template>
                  Your repository is connected.
                </InfoBanner>
              </div>
            </div>

            <div id="pat-status" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">Status (Dot, Badge &amp; DiffStat)</p>
              <div class="rounded-lg border border-border/50 p-6 flex flex-col gap-4">
                <div class="flex items-center gap-4 text-sm">
                  <span class="inline-flex items-center gap-1.5"><StatusDot tone="success" /> Idle</span>
                  <span class="inline-flex items-center gap-1.5"><StatusDot tone="success" pulse /> Running</span>
                  <span class="inline-flex items-center gap-1.5"><StatusDot tone="warning" /> Warning</span>
                  <span class="inline-flex items-center gap-1.5"><StatusDot tone="destructive" /> Error</span>
                  <span class="inline-flex items-center gap-1.5"><StatusDot tone="info" /> Info</span>
                </div>
                <div class="flex items-center gap-4 text-sm">
                  <DiffStat :additions="42" :deletions="7" />
                  <DiffStat :additions="12" />
                  <DiffStat :deletions="3" />
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <StatusBadge tone="success">3 passed</StatusBadge>
                  <StatusBadge tone="warning">5 warnings</StatusBadge>
                  <StatusBadge tone="destructive">2 errors</StatusBadge>
                  <StatusBadge tone="info">Modified</StatusBadge>
                  <StatusBadge tone="neutral">Idle</StatusBadge>
                </div>
                <p class="text-xs text-muted-foreground">Use <code>StatusBadge</code> for informational status (faint, incl. red). <code>Badge variant="destructive"</code> is a SOLID red pill — reserve it for actions, not status.</p>
              </div>
            </div>

            <div id="pat-confirm-dialog" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">ConfirmDialog</p>
              <div class="rounded-lg border border-border/50 p-6">
                <Button variant="outline" @click="confirmDialogOpen = true">Delete project…</Button>
                <ConfirmDialog
                  v-model:open="confirmDialogOpen"
                  title="Delete project"
                  description="This will permanently delete the project and all of its data. This action cannot be undone."
                  confirm-label="Delete"
                  confirm-variant="destructive"
                  @confirm="confirmDialogOpen = false"
                />
              </div>
            </div>

            <div id="pat-submit-button" class="mb-12">
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-4">SubmitButton</p>
              <div class="rounded-lg border border-border/50 p-6">
                <form class="max-w-xs">
                  <SubmitButton pending-text="Saving…">Save changes</SubmitButton>
                </form>
              </div>
            </div>
          </section>

          <!-- Anti-patterns -->
          <section id="anti-patterns">
            <Separator class="my-14" />
            <h2 class="text-xs uppercase tracking-widest text-muted-foreground mb-5">Anti-Patterns</h2>
            <p class="text-base text-muted-foreground leading-relaxed mb-8">Common mistakes to avoid when building Kortix interfaces.</p>

            <div class="space-y-6">
              <div v-for="ap in ANTI_PATTERNS" :key="ap.title" class="space-y-2.5">
                <h3 class="text-sm font-medium text-foreground">{{ ap.title }}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">{{ ap.description }}</p>
                <div class="grid sm:grid-cols-2 gap-3">
                  <div class="rounded-lg border border-destructive/30 bg-destructive/5 overflow-hidden">
                    <div class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive border-b border-destructive/20"><X class="size-3" /> Bad</div>
                    <pre class="text-xs font-mono text-muted-foreground p-3 overflow-x-auto whitespace-pre">{{ ap.bad }}</pre>
                  </div>
                  <div class="rounded-lg border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
                    <div class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/20"><Check class="size-3" /> Good</div>
                    <pre class="text-xs font-mono text-muted-foreground p-3 overflow-x-auto whitespace-pre">{{ ap.good }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Usage -->
          <section id="usage">
            <Separator class="my-14" />
            <h2 class="text-xs uppercase tracking-widest text-muted-foreground mb-5">Usage</h2>
            <p class="text-base text-muted-foreground leading-relaxed mb-6">
              Import components from <code class="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">@kortix/nuxt-ui</code> and compose with the shared
              <code class="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">cn()</code> helper for conditional class merging.
            </p>
            <div class="bg-neutral-950 text-neutral-100 rounded-lg p-5 md:p-6 font-mono text-xs leading-relaxed overflow-x-auto">
              <pre>import { Button, Card, cn } from '@kortix/nuxt-ui'

&lt;Button :class="cn('w-full', isActive &amp;&amp; 'bg-primary')"&gt;
  Continue
&lt;/Button&gt;</pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>
