<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, ref } from "vue"
import { toast } from "vue-sonner"
import {
  ArrowLeft,
  Archive,
  ArrowRight,
  ArrowUp,
  AtSign,
  BarChart3,
  Bell,
  Ban,
  Bold,
  BookOpen,
  Bot,
  Brain,
  Building2,
  Cable,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Circle,
  CircleDot,
  ClipboardCheck,
  Code2,
  Copy,
  Cpu,
  Download,
  Eye,
  ExternalLink,
  EyeOff,
  File,
  FileCode2,
  FileJson,
  FileText,
  Folder,
  FolderGit2,
  FolderOpen,
  GitFork,
  GitBranch,
  Globe,
  Hash,
  HelpCircle,
  Inbox,
  Info,
  Key,
  KeyRound,
  Layers,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  MessageSquare,
  Moon,
  Package,
  Presentation,
  RotateCcw,
  Scale,
  Share2,
  ShieldCheck,
  Sun,
  MoreHorizontal,
  Palette,
  Paperclip,
  Pencil,
  Plug,
  Plus,
  Radio,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Sparkles,
  SquarePen,
  Star,
  Terminal,
  Trash2,
  AlertTriangle,
  TriangleAlert,
  StopCircle,
  Upload,
  User,
  UserPlus,
  Users,
  Volume2,
  Wifi,
  X,
  Zap,
  ListTree,
  History,
  Keyboard,
  Timer,
  Webhook,
  GitPullRequest,
  Container,
} from "lucide-vue-next"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Alert, AlertDescription, AlertTitle,
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
  AnimatedThinkingText,
  Avatar, AvatarFallback, AvatarImage,
  Badge,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
  Button,
  Calendar,
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  ChatActionCard, ChatAttachmentTile, ChatBubble, ChatDivider, ChatInputShell, ChatMessageActions, ChatSystemCard,
  Checkbox,
  Collapsible, CollapsibleContent, CollapsibleTrigger,
  Command, CommandDialog, CommandEmpty, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandKbd, CommandList, CommandPopover, CommandPopoverContent, CommandPopoverTrigger, CommandShortcut,
  ConfirmDialog,
  ConnectionPill,
  ContextEventCard,
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger,
  DataTable,
  DefinitionList, DefinitionRow,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  DiffStat,
  Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  EmptyState,
  EntityAvatar,
  GroupedActivityRow,
  InfoBanner,
  InlineMeta,
  Input,
  Kbd, KbdGroup,
  Label,
  List, ListRow,
  NotificationChip,
  OverlayShell,
  PageShell,
  Pagination,
  Popover, PopoverContent, PopoverTrigger,
  Progress,
  QuestionsCard,
  RadioGroup, RadioGroupItem,
  ScrollArea,
  Section as BrandSection,
  SectionCard,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Separator,
  SettingsShell,
  Skeleton,
  Slider,
  StatusBadge, StatusDot,
  SubmitButton,
  Switch,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsContent, TabsList, TabsListCompact, TabsTrigger, TabsTriggerCompact,
  Tag,
  Textarea,
  ThinkingBlock,
  Toaster,
  Toggle,
  ToolCallCard,
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
  UserAvatar,
  type DataTableColumn,
} from "@kortix/nuxt-ui"

type IssueRow = {
  id: string
  title: string
  owner: string
  status: string
  branch: string
  additions: number
  deletions: number
}

type Provider = {
  id: string
  name: string
  desc: string
  connected: boolean
}

type ProviderView = { type: "list" } | { type: "connect"; id: string; name: string } | { type: "custom" }

const tocSections = [
  { id: "hero", label: "Overview" },
  { id: "logo", label: "Logo" },
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "motion", label: "Motion" },
  { id: "spacing", label: "Spacing" },
  { id: "components", label: "Components", children: [
    { id: "comp-button", label: "Button" },
    { id: "comp-badge", label: "Badge" },
    { id: "comp-card", label: "Card" },
    { id: "comp-input", label: "Input" },
    { id: "comp-textarea", label: "Textarea" },
    { id: "comp-select", label: "Select" },
    { id: "comp-checkbox", label: "Checkbox" },
    { id: "comp-switch", label: "Switch" },
    { id: "comp-toggle", label: "Toggle" },
    { id: "comp-radio", label: "Radio Group" },
    { id: "comp-tabs", label: "Tabs" },
    { id: "comp-dialog", label: "Dialog" },
    { id: "comp-sheet", label: "Sheet" },
    { id: "comp-dropdown", label: "Dropdown" },
    { id: "comp-tooltip", label: "Tooltip" },
    { id: "comp-popover", label: "Popover" },
    { id: "comp-alert", label: "Alert" },
    { id: "comp-alert-dialog", label: "Alert Dialog" },
    { id: "comp-accordion", label: "Accordion" },
    { id: "comp-collapsible", label: "Collapsible" },
    { id: "comp-separator", label: "Separator" },
    { id: "comp-skeleton", label: "Skeleton" },
    { id: "comp-progress", label: "Progress" },
    { id: "comp-slider", label: "Slider" },
    { id: "comp-label", label: "Label" },
    { id: "comp-breadcrumb", label: "Breadcrumb" },
    { id: "comp-table", label: "Table" },
    { id: "comp-kbd", label: "Kbd" },
    { id: "comp-calendar", label: "Calendar" },
    { id: "comp-scrollarea", label: "Scroll Area" },
    { id: "comp-tag", label: "Tag" },
    { id: "comp-pagination", label: "Pagination" },
    { id: "comp-command", label: "Command" },
    { id: "comp-drawer", label: "Drawer" },
    { id: "comp-context-menu", label: "Context Menu" },
    { id: "comp-data-table", label: "Data Table" },
  ] },
  { id: "chat", label: "Chat", children: [
    { id: "chat-thinking-text", label: "AnimatedThinkingText" },
    { id: "chat-thinking-block", label: "ThinkingBlock" },
    { id: "chat-questions-card", label: "QuestionsCard" },
    { id: "chat-tool-call", label: "ToolCallCard" },
    { id: "chat-bubble", label: "ChatBubble" },
    { id: "chat-system-card", label: "ChatSystemCard" },
    { id: "chat-divider", label: "ChatDivider" },
    { id: "chat-input-shell", label: "ChatInputShell" },
    { id: "chat-attachment-tile", label: "ChatAttachmentTile" },
    { id: "chat-context-event", label: "ContextEventCard" },
    { id: "chat-grouped-activity", label: "GroupedActivityRow" },
    { id: "chat-notification-chip", label: "NotificationChip" },
    { id: "chat-message-actions", label: "ChatMessageActions" },
  ] },
  { id: "page-patterns", label: "Page Patterns", children: [
    { id: "pat-page-header", label: "PageHeader" },
    { id: "pat-command-palette", label: "CommandPalette" },
    { id: "pat-connection-pill", label: "ConnectionPill" },
    { id: "pat-spotlight-card", label: "SpotlightCard" },
    { id: "pat-search-bar", label: "PageSearchBar" },
    { id: "pat-stagger", label: "Stagger Mount" },
    { id: "pat-settings-shell", label: "SettingsShell" },
    { id: "pat-overlay-shell", label: "OverlayShell" },
    { id: "pat-toast", label: "Toast" },
    { id: "pat-session-list-row", label: "Session list row" },
    { id: "pat-model-selector", label: "ModelSelector" },
    { id: "pat-shortcuts", label: "Keyboard shortcuts" },
    { id: "pat-provider-modal", label: "Connect provider" },
    { id: "pat-session-header", label: "Session header" },
    { id: "pat-share-dialog", label: "Share session" },
    { id: "pat-command-palette-nav", label: "Command palette (submenu nav)" },
    { id: "pat-notifications-bell", label: "Notifications bell" },
    { id: "pat-notifications-settings", label: "Notification settings" },
    { id: "pat-wallpaper-picker", label: "Wallpaper picker" },
    { id: "pat-agent-avatar", label: "Agent & user avatars" },
    { id: "pat-mention-textarea", label: "Mention textarea" },
    { id: "pat-status-pill", label: "Status pill" },
    { id: "pat-diff-view", label: "Diff view" },
    { id: "pat-session-sidebar", label: "Session sidebar" },
    { id: "pat-file-tree", label: "File tree" },
    { id: "pat-terminal-output", label: "Terminal output" },
    { id: "pat-tab-bar", label: "Tab bar & split layout" },
    { id: "pat-new-session", label: "New session" },
  ] },
  { id: "patterns", label: "Primitives", children: [
    { id: "pat-page-shell", label: "PageShell" },
    { id: "pat-section", label: "Section" },
    { id: "pat-section-card", label: "SectionCard" },
    { id: "pat-avatars", label: "Avatars" },
    { id: "pat-list", label: "List & ListRow" },
    { id: "pat-definition-list", label: "DefinitionList" },
    { id: "pat-inline-meta", label: "InlineMeta" },
    { id: "pat-empty-state", label: "EmptyState" },
    { id: "pat-info-banner", label: "InfoBanner" },
    { id: "pat-status", label: "Status (Dot, Badge, Diff)" },
    { id: "pat-confirm-dialog", label: "ConfirmDialog" },
    { id: "pat-submit-button", label: "SubmitButton" },
  ] },
  { id: "anti-patterns", label: "Anti-Patterns" },
  { id: "usage", label: "Usage" },
] as const

type TocSection = typeof tocSections[number]
type TocChild = Exclude<TocSection["children"], undefined>[number]

const ALL_SECTION_IDS = tocSections.flatMap((s) =>
  "children" in s && s.children ? [s.id, ...s.children.map((c) => c.id)] : [s.id]
)
const activeId = ref("hero")
const activeParentId = computed(() => {
  return tocSections.find((s) => {
    if (s.id === activeId.value) return true
    if ("children" in s && s.children) return s.children.some((c) => c.id === activeId.value)
    return false
  })?.id
})
function tocHasChildren(section: TocSection) {
  return "children" in section && !!section.children
}
function tocIsParentActive(section: TocSection) {
  return section.id === activeParentId.value
}

const isDark = ref(true)
function applyTheme(dark: boolean) {
  isDark.value = dark
  document.documentElement.classList.toggle("dark", dark)
}
function toggleTheme() {
  applyTheme(!isDark.value)
}
onMounted(() => {
  const mql = window.matchMedia("(prefers-color-scheme: dark)")
  applyTheme(document.documentElement.classList.contains("dark") || mql.matches)
  mql.addEventListener("change", (e) => applyTheme(e.matches))

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
  )
  for (const id of ALL_SECTION_IDS) {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  }
  onBeforeUnmount(() => observer.disconnect())
})

const dialogOpen = ref(false)
const commandOpen = ref(false)
const commandPopoverOpen = ref(false)
const modelSearch = ref("")
const selectedModel = ref("claude-sonnet-4-6")
const showOlderModels = ref(false)

const MODEL_PROVIDERS = [
  { id: "anthropic", name: "Anthropic", models: [
    { id: "claude-opus-4-8", name: "Claude Opus 4.8", free: false },
    { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", free: false },
    { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", free: false },
  ]},
  { id: "opencode", name: "OpenCode", models: [
    { id: "kimi-k2", name: "Kimi K2", free: true },
    { id: "qwen3-coder", name: "Qwen3 Coder", free: true },
  ]},
  { id: "openai", name: "OpenAI", models: [
    { id: "gpt-5", name: "GPT-5", free: false },
  ]},
]
const MODEL_OLDER = [
  { id: "anthropic", name: "Anthropic", models: [
    { id: "claude-sonnet-3-7", name: "Claude Sonnet 3.7", free: false },
  ]},
]

function onModelSearch(e: Event) {
  modelSearch.value = (e.target as HTMLInputElement).value
}
const confirmOpen = ref(false)
const providerModalOpen = ref(false)
const providerSearch = ref("")
const providerOtherOpen = ref(false)
const providerView = ref<ProviderView>({ type: "list" })
const providerAuthMethod = ref<"oauth" | "api" | null>(null)
const providerApiKey = ref("")
const customProviderForm = ref({ providerID: "", name: "", baseURL: "", apiKey: "", modelId: "", modelName: "" })
const settingsOpen = ref(false)
const overlayOpen = ref(false)
const switchOn = ref(true)
const checked = ref(true)
const toggled = ref(false)
const selectVal = ref("apple")
const radioVal = ref("comfortable")
const tabVal = ref("overview")
const compactTabVal = ref("open")
const collapsibleOpen = ref(false)
const page = ref(2)
const pageSize = ref(20)
const selectedRows = ref<IssueRow[]>([])
const activeSettings = ref("general")
const activeOverlay = ref("agents")
const sliderValue = ref([50])
const shareDialogOpen = ref(false)
const shareMode = ref("private")
const headerTitle = ref("auth-rewrite: rotate refresh tokens")
const headerDraft = ref(headerTitle.value)
const headerEditing = ref(false)
const paletteOpen2 = ref(false)
const palettePage = ref<"root" | "agents" | "models">("root")
const notifBellOpen = ref(false)
const notifEnabled = ref(true)
const wallpaperId = ref("brandmark")
const mentionText = ref("Hey @sar - can you take a look at the retry logic before we ship?")
const mentionMenuOpen = ref(false)
const taskStatus = ref<"planned" | "running" | "completed">("running")
const sidebarCollapsed = ref(false)
const sidebarActiveSession = ref("s2")
const fileTreeSelected = ref("src/lib/retry.ts")
const demoActiveTab = ref("session-layout")
const demoSidePanelTab = ref<"actions" | "browser" | "files" | "terminal">("terminal")
const newSessionText = ref("")
const notifLastSeen = ref<string | null>(null)
const newSessionAtStart = ref(true)
const newSessionAtEnd = ref(false)
const newSessionScrollEl = ref<HTMLElement | null>(null)
const scrollRows = ["Inbox sync completed", "Token refresh queued", "Workspace indexed", "Branch preview ready", "Agent joined session", "Tool output attached", "Review requested", "Deploy check passed", "Cache warmed", "Settings saved", "Snapshot exported", "Session archived"]

const FOUNDATION_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "Off-Black", hex: "#1A1A1A" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Off-White", hex: "#F5F5F5" },
]

const CORE_PALETTE = [
  { name: "Background", var: "--background", light: "oklch(1 0 0)", dark: "oklch(0.145 0 0)" },
  { name: "Foreground", var: "--foreground", light: "oklch(0.145 0 0)", dark: "oklch(0.94 0 0)" },
  { name: "Card", var: "--card", light: "oklch(0.99 0 0)", dark: "oklch(0.21 0 0)" },
  { name: "Card Foreground", var: "--card-foreground", light: "oklch(0.145 0 0)", dark: "oklch(0.94 0 0)" },
  { name: "Popover", var: "--popover", light: "oklch(1 0 0)", dark: "oklch(0.24 0 0)" },
  { name: "Popover Foreground", var: "--popover-foreground", light: "oklch(0.145 0 0)", dark: "oklch(0.94 0 0)" },
  { name: "Primary", var: "--primary", light: "oklch(0.205 0 0)", dark: "oklch(0.94 0 0)" },
  { name: "Primary Foreground", var: "--primary-foreground", light: "oklch(0.985 0 0)", dark: "oklch(0.18 0 0)" },
  { name: "Secondary", var: "--secondary", light: "oklch(0.46 0 0)", dark: "oklch(0.55 0.01 260)" },
  { name: "Secondary Foreground", var: "--secondary-foreground", light: "oklch(1 0 0)", dark: "oklch(0.94 0 0)" },
  { name: "Muted", var: "--muted", light: "oklch(0.955 0 0)", dark: "oklch(0.27 0 0)" },
  { name: "Muted Foreground", var: "--muted-foreground", light: "oklch(0.45 0 0)", dark: "oklch(0.60 0 0)" },
  { name: "Accent", var: "--accent", light: "oklch(0.96 0 0)", dark: "oklch(0.25 0 0)" },
  { name: "Accent Foreground", var: "--accent-foreground", light: "oklch(0.145 0 0)", dark: "oklch(0.94 0 0)" },
  { name: "Border", var: "--border", light: "oklch(0.885 0 0)", dark: "oklch(0.30 0 0)" },
  { name: "Input", var: "--input", light: "oklch(0.905 0 0)", dark: "oklch(0.27 0 0)" },
  { name: "Ring", var: "--ring", light: "oklch(0.708 0 0)", dark: "oklch(0.50 0 0)" },
  { name: "Destructive", var: "--destructive", light: "oklch(0.577 0.245 27.325)", dark: "oklch(0.396 0.141 25.723)" },
]

const copiedHex = ref<Record<string, boolean>>({})
function copyHex(value: string) {
  navigator.clipboard?.writeText(value)
  copiedHex.value[value] = true
  setTimeout(() => { copiedHex.value[value] = false }, 1200)
}

/* Brand: Hoshi (星, "star") — named for the six-point radiating form of ※
   (komejirushi, the reference mark), which the symbol is drawn from. */
const BRAND_NAME = "Hoshi"
const BRAND_SLUG = "hoshi"

type LogoFormat = "svg" | "png"
const LOGO_FORMATS: LogoFormat[] = ["svg", "png"]
const logoFmt = ref<LogoFormat>("svg")

interface LogoAsset {
  id: string
  label: "Symbol" | "Logo"
  variant: "Black" | "White"
  svgSrc: string
  pngSrc: string
  dark: boolean
}
const LOGO_ASSETS: LogoAsset[] = [
  { id: "brandmark-black", label: "Symbol", variant: "Black", svgSrc: "/brandkit/Logo/Brandmark/SVG/Brandmark Black.svg", pngSrc: "/brandkit/Logo/Brandmark/PNG/Brandmark Black.png", dark: false },
  { id: "brandmark-white", label: "Symbol", variant: "White", svgSrc: "/brandkit/Logo/Brandmark/SVG/Brandmark White.svg", pngSrc: "/brandkit/Logo/Brandmark/PNG/Brandmark White.png", dark: true },
  { id: "logomark-black", label: "Logo", variant: "Black", svgSrc: "/brandkit/Logo/Logomark/SVG/Logomark Black.svg", pngSrc: "/brandkit/Logo/Logomark/PNG/Logomark Black.png", dark: false },
  { id: "logomark-white", label: "Logo", variant: "White", svgSrc: "/brandkit/Logo/Logomark/SVG/Logomark White.svg", pngSrc: "/brandkit/Logo/Logomark/PNG/Logomark White.png", dark: true },
]

interface SocialAsset {
  id: string
  variant: "Black" | "White"
  /** Square 1:1 profile-picture PNG — symbol centred on a solid field. */
  pngSrc: string
  dark: boolean
}
const SOCIAL_ASSETS: SocialAsset[] = [
  { id: "social-black", variant: "Black", pngSrc: "/brandkit/Profile Picture/Avatar Black.png", dark: true },
  { id: "social-white", variant: "White", pngSrc: "/brandkit/Profile Picture/Avatar White.png", dark: false },
]

const LOGO_DESCRIPTION = "The mark is named Hoshi — Japanese for “star” (星) — and is traced directly from ※ (komejirushi, “reference mark”): a crossing pair of strokes with four points at north, south, east and west, redrawn as a precise geometric form. Use it as a favicon, app icon, or whenever the full wordmark isn't practical. Never stretch, rotate, or recolor it."
const FONT_WEIGHT_ITEMS = ["Medium · 500", "Regular · 400"]
const TYPE_SCALE = [
  { token: "text-xs", size: "0.75rem", px: "~12px", use: "Secondary labels, tooltips, KBD" },
  { token: "text-sm", size: "0.875rem", px: "~14px", use: "Body text, menu items" },
  { token: "text-base", size: "1rem", px: "~16px", use: "Default UI text, inputs" },
  { token: "text-lg", size: "1.125rem", px: "~18px", use: "Section headers, dialog titles" },
  { token: "text-xl", size: "1.25rem", px: "~20px", use: "Page section titles" },
  { token: "text-2xl", size: "1.5rem", px: "~24px", use: "Page titles" },
  { token: "text-3xl", size: "1.875rem", px: "~30px", use: "Hero subheadings" },
  { token: "text-4xl", size: "2.25rem", px: "~36px", use: "Display / hero headings" },
  { token: "text-5xl", size: "3rem", px: "~48px", use: "Marketing display" },
  { token: "text-6xl", size: "3.75rem", px: "~60px", use: "Large display" },
  { token: "text-7xl", size: "4.5rem", px: "~72px", use: "Oversized display" },
  { token: "text-8xl", size: "6rem", px: "~96px", use: "Hero numerals / clocks" },
] as const
const MOTION_DURATIONS = [
  { name: "Fast", token: "--duration-fast", ms: 100 },
  { name: "Normal", token: "--duration-normal", ms: 150 },
  { name: "Moderate", token: "--duration-moderate", ms: 200 },
  { name: "Slow", token: "--duration-slow", ms: 300 },
  { name: "Slower", token: "--duration-slower", ms: 500 },
] as const
const EASING_CURVES = [
  { name: "Default", token: "--ease-default", value: "cubic-bezier(0.2, 0, 0, 1)" },
  { name: "Ease In", token: "--ease-in", value: "cubic-bezier(0.4, 0, 1, 1)" },
  { name: "Ease Out", token: "--ease-out", value: "cubic-bezier(0, 0, 0.2, 1)" },
  { name: "Ease In-Out", token: "--ease-in-out", value: "cubic-bezier(0.4, 0, 0.2, 1)" },
] as const
const motionBarActive = ref<Record<string, boolean>>({})
function toggleMotionBar(token: string) {
  motionBarActive.value[token] = !motionBarActive.value[token]
}
const SPACING_SCALE_STEPS = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16]
const OPACITY_STEPS = [0, 25, 50, 75, 100]
const TOOL_NAMES = ["read", "grep", "bash"]

const INTEGRATION_ITEMS = [
  { icon: Cable, label: "tunnel-42", sub: "exposes :3000" },
  { icon: Radio, label: "#releases", sub: "Slack channel" },
  { icon: Zap, label: "nightly-cron", sub: "every day at 03:00" },
  { icon: Plug, label: "GitHub", sub: "Connected" },
]

const SESSION_SUMMARY_ITEMS = [
  { title: "auth-rewrite", active: true, busy: true, count: 3 },
  { title: "vortex-refactor", active: false, busy: false, pending: 2 },
  { title: "release-notes-draft", active: false },
  { title: "failed-migration-test", active: false },
]

const SHARE_VISIBILITY_OPTIONS = [
  { value: "project", label: "Whole team", desc: "Everyone in this project", icon: Globe },
  { value: "private", label: "Only you", desc: "Private — just you", icon: Lock },
  { value: "members", label: "Select members", desc: "A chosen list of members", icon: Users },
]

const NOTIFICATION_ITEMS = [
  { id: 'n1', kind: 'mention', actor: '@sarah', summary: 'mentioned you', ticket: '#142 Refresh-token rotation', message: 'Can you take a look at the retry logic here before we ship?', when: '14m ago', at: '2026-06-07T09:00:00Z' },
  { id: 'n2', kind: 'assign', actor: '@github-bot', summary: 'assigned you', ticket: '#138 Webhook signature check', message: null, when: '2h ago', at: '2026-06-07T07:30:00Z' },
  { id: 'n3', kind: 'mention', actor: '@marco', summary: 'mentioned you', ticket: '#129 Onboarding rewrite', message: 'Left a comment on the new copy — wdyt?', when: 'yesterday', at: '2026-06-06T10:00:00Z' },
  { id: 'n4', kind: 'assign', actor: '@priya', summary: 'assigned you', ticket: '#121 Sandbox cold-start', message: null, when: '3d ago', at: '2026-06-04T08:00:00Z' },
]

const NOTIFICATION_TOGGLE_ROWS = [
  { icon: CheckCircle2, label: "Task completions", desc: "When a session finishes its task" },
  { icon: AlertTriangle, label: "Errors", desc: "When a session encounters an error" },
  { icon: HelpCircle, label: "Questions", desc: "When Kortix needs your input to continue" },
  { icon: ShieldCheck, label: "Permission requests", desc: "When Kortix needs permission to use a tool" },
]

const NOTIFICATION_BEHAVIOR_ROWS = [
  { icon: EyeOff, label: "Only when tab is hidden", desc: "Only notify when you're on another tab" },
  { icon: Volume2, label: "Notification sound", desc: "Play a sound when a notification is sent" },
]

const WALLPAPER_ITEMS = [
  { id: "brandmark", name: "Brandmark", def: true },
  { id: "symbol", name: "Symbol" },
  { id: "aurora", name: "Aurora" },
  { id: "nebula", name: "Pixel Beams" },
  { id: "ascii-tunnel", name: "ASCII Tunnel" },
  { id: "matrix", name: "Enter the Matrix" },
]

const AGENT_AVATAR_ITEMS = [
  { slug: "kortix", icon: Bot, hue: 210 },
  { slug: "qa-bot", icon: ClipboardCheck, hue: 145 },
  { slug: "sec-review", icon: Shield, hue: 280 },
  { slug: "doc-writer", icon: BookOpen, hue: 35 },
  { slug: "researcher", icon: Search, hue: 200 },
]

const MENTION_USER_HANDLES = ['sarah', 'marco', 'priya', 'alex']

function agentColorsFor(hue: number) {
  return {
    bg: `hsl(${hue} 55% 22%)`,
    fg: `hsl(${hue} 90% 80%)`,
    ring: `hsl(${hue} 70% 45% / 0.45)`,
  }
}

function hashHue(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h) % 360
}

const MENTION_AUTOCOMPLETE_HANDLES = [
  { slug: 'sarah', kind: 'user', hue: 210, icon: null },
  { slug: 'marco', kind: 'user', hue: 30, icon: null },
  { slug: 'kortix', kind: 'agent', hue: 210, icon: Bot },
  { slug: 'qa-bot', kind: 'agent', hue: 145, icon: ClipboardCheck },
]

const SIDEBAR_ACTION_ROWS = [
  { icon: SquarePen, label: "New session", kbd: "⌘J" },
  { icon: Search, label: "Search", kbd: "⌘K" },
  { icon: FolderOpen, label: "Files" },
]

const SIDEBAR_SESSION_ITEMS = [
  { id: "s1", name: "auth-rewrite: rotate refresh tokens", when: "2h ago" },
  { id: "s2", name: "fix(billing): webhook retries", when: "5h ago" },
  { id: "s3", name: "docs: onboarding rewrite", when: "yesterday" },
  { id: "s4", name: "migration ordering bugfix", when: "2d ago" },
]

const FILE_TREE_DATA: any[] = [
  { name: "src", dir: true, children: [
    { name: "components", dir: true, children: [
      { name: "button.tsx", path: "src/components/button.tsx" },
      { name: "card.tsx", path: "src/components/card.tsx" },
    ]},
    { name: "lib", dir: true, children: [
      { name: "retry.ts", path: "src/lib/retry.ts" },
      { name: "utils.ts", path: "src/lib/utils.ts" },
    ]},
    { name: "index.ts", path: "src/index.ts" },
  ]},
  { name: "package.json", path: "package.json" },
  { name: "tsconfig.json", path: "tsconfig.json" },
  { name: "README.md", path: "README.md" },
]

const FILE_TREE_PREVIEW: Record<string, string[]> = {
  'src/lib/retry.ts': ['export function retry(fn, attempts = 3) {', '  for (let i = 0; i < attempts; i++) {', '    try { return fn(); }', '    catch (e) { if (i === attempts - 1) throw e; }', '  }', '}'],
  'package.json': ['{', '  "name": "@kortix/ui",', '  "version": "0.1.0",', '  "private": true', '}'],
  'README.md': ['# Kortix UI', '', 'Shared component library for Suna surfaces.'],
}

const fileTreeExpanded = ref(new Set<string>(["src", "src/lib"]))

function flattenFileTree(nodes: any[], depth = 0, parentPath = ""): any[] {
  const result: any[] = []
  for (const node of nodes) {
    const selfPath = parentPath ? `${parentPath}/${node.name}` : node.name
    result.push({ ...node, depth, selfPath })
    if (node.dir && node.children && fileTreeExpanded.value.has(selfPath)) {
      result.push(...flattenFileTree(node.children, depth + 1, selfPath))
    }
  }
  return result
}

const fileTreeItems = computed(() => flattenFileTree(FILE_TREE_DATA))

function toggleDir(selfPath: string) {
  const next = new Set(fileTreeExpanded.value)
  if (next.has(selfPath)) next.delete(selfPath)
  else next.add(selfPath)
  fileTreeExpanded.value = next
}

const DIFF_BEFORE = [
  "export function retry(fn, attempts = 3) {",
  "  for (let i = 0; i < attempts; i++) {",
  "    try { return fn(); }",
  "    catch (e) { if (i === attempts - 1) throw e; }",
  "  }",
  "}",
]

const DIFF_AFTER = [
  "export function retry(fn, attempts = 3, delayMs = 200) {",
  "  for (let i = 0; i < attempts; i++) {",
  "    try { return await fn(); }",
  "    catch (e) {",
  "      if (i === attempts - 1) throw e;",
  "      await sleep(delayMs * (i + 1));",
  "    }",
  "  }",
  "}",
]

const DIFF_REMOVED = new Set([2])
const DIFF_ADDED = new Set([0, 2, 3, 4, 5])

const DEMO_FILE_TABS = [
  { id: "session-layout", label: "session-layout.tsx", icon: FileCode2 },
  { id: "retry", label: "retry.ts", icon: FileCode2 },
  { id: "readme", label: "README.md", icon: FileText },
]

const DEMO_SIDE_PANEL_TABS = ["actions", "browser", "files", "terminal"]

const SHORTCUT_ROWS = [
  { label: "Command palette", keys: ["⌘", "K"] },
  { label: "New session", keys: ["Ctrl", "J"] },
  { label: "Toggle left sidebar", keys: ["Ctrl", "B"] },
  { label: "Toggle right sidebar", keys: ["Ctrl", "Shift", "B"] },
  { label: "Next tab", keys: ["⌘", "Shift", "]"] },
  { label: "Close active tab", keys: ["Ctrl", "W"] },
]

const NEW_SESSION_SUGGESTIONS = [
  { id: 'p1', icon: Building2, label: 'Onboard your agent' },
  { id: 'p2', icon: Globe, label: 'Build a landing page' },
  { id: 'p3', icon: Search, label: 'Research competitors' },
  { id: 'p4', icon: Presentation, label: 'Create a pitch deck' },
  { id: 'p5', icon: Scale, label: 'Draft a contract template' },
  { id: 'p6', icon: BarChart3, label: 'Analyze last quarter' },
]

const settingsGroups = [
  {
    label: "Preferences",
    items: [
      { id: "general", label: "General", icon: SlidersHorizontal },
      { id: "appearance", label: "Appearance", icon: Palette },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "sounds", label: "Sounds", icon: Volume2 },
      { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "profile", label: "Profile", icon: User },
      { id: "tokens", label: "CLI Tokens", icon: KeyRound },
    ],
  },
]

const overlayGroups = [
  {
    label: "Build",
    items: [
      { id: "agents", label: "Agents", icon: Bot },
      { id: "skills", label: "Skills", icon: Sparkles },
      { id: "commands", label: "Commands", glyph: "/" },
    ],
  },
  {
    label: "Connect",
    items: [
      { id: "connectors", label: "Connectors", icon: Plug },
      { id: "secrets", label: "Secrets", icon: KeyRound },
      { id: "channels", label: "Channels", icon: MessageSquare },
    ],
  },
  {
    label: "Automate",
    items: [
      { id: "schedules", label: "Schedules", icon: Timer },
      { id: "webhooks", label: "Webhooks", icon: Webhook },
    ],
  },
]

const overlayFooterGroup = [
  { id: "changes", label: "Changes", icon: GitPullRequest },
  { id: "files", label: "Files", icon: FolderOpen },
  { id: "sandbox", label: "Sandbox", icon: Container },
  { id: "dev", label: "Dev", icon: Terminal },
  { id: "members", label: "Members", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
]

const rows: IssueRow[] = [
  { id: "px-128", title: "Port command surface", owner: "Maya", status: "Review", branch: "nuxt-ui-parity", additions: 124, deletions: 18 },
  { id: "px-129", title: "Verify overlay shell", owner: "Jon", status: "Active", branch: "overlay-polish", additions: 42, deletions: 4 },
  { id: "px-130", title: "Document chat cards", owner: "Rae", status: "Queued", branch: "chat-patterns", additions: 88, deletions: 11 },
]

const columns: DataTableColumn<IssueRow>[] = [
  { id: "id", header: "ID", accessorKey: "id", width: "w-[90px]", class: "font-mono text-xs text-muted-foreground" },
  { id: "title", header: "Title", accessorKey: "title" },
  { id: "owner", header: "Owner", accessorKey: "owner" },
  { id: "status", header: "Status", accessorKey: "status" },
  {
    id: "diff",
    header: "Diff",
    cell: (item) => h(DiffStat, { additions: item.additions, deletions: item.deletions }),
  },
]

const questions = [
  { question: "Which environment should the migration target first?", answer: "Staging" },
  { question: "Should we notify the on-call channel before running it?", answer: "Yes, #eng-oncall" },
  { question: "Run the backfill synchronously or in batches?", answer: "In batches of 500" },
]

const chatActions = [
  { icon: Copy, label: "Copy", onClick: () => toast("Copied message") },
  { icon: Pencil, label: "Edit & fork prompt", onClick: () => toast("Prompt forked") },
  { icon: GitFork, label: "Fork to new session", onClick: () => toast("Forked to new session") },
]

const antiPatterns = [
  {
    title: "AP-1: No inline style={} for fixed values",
    description: "Bypasses the utility system, can't be purged, creates specificity issues, invisible to design system audits.",
    bad: "<div style={{ height: '14px', overflow: 'hidden' }}>\n  Content\n</div>",
    good: '<div className="h-3.5 overflow-hidden">\n  Content\n</div>',
  },
  {
    title: "AP-2: No arbitrary text sizes",
    description: "Creates inconsistent type sizes with no semantic meaning and no relationship to the readable type scale.",
    bad: '<span className="text-[11px]">Label</span>\n<span className="text-[13.5px]">Meta</span>\n<span className="text-[0.875em]">Body</span>',
    good: '<span className="text-xs">Label</span>\n<span className="text-xs">Meta</span>\n<span className="text-sm">Body</span>',
  },
  {
    title: "AP-3: No raw <button> elements",
    description: "Raw buttons bypass variant system, have inconsistent sizing/padding/radius, no focus ring guarantee, no loading state support.",
    bad: '<button\n  className="px-3 py-1.5 rounded-lg\n    bg-neutral-100 hover:bg-neutral-200"\n  onClick={handleClick}\n>\n  Save\n</button>',
    good: '<Button\n  variant="secondary"\n  size="sm"\n  onClick={handleClick}\n>\n  Save\n</Button>',
  },
  {
    title: "AP-4: No transition-colors",
    description: "Animates every CSS property including width, height, padding. Causes layout thrashing. Performance killer on large lists.",
    bad: '<div className="transition-colors duration-200\n  hover:bg-accent">',
    good: '<div className="transition-colors\n  duration-moderate hover:bg-accent">',
  },
  {
    title: "AP-5: No hardcoded hex colors",
    description: "Completely bypasses the theme system. Will look wrong in non-default themes. Breaks dark mode.",
    bad: '<div className="text-emerald-500">\n  Success\n</div>\n<div style={{ color: \'#3b82f6\' }}>\n  Info\n</div>',
    good: '<div className="text-success">\n  Success\n</div>\n<div className="text-info">\n  Info\n</div>',
  },
  {
    title: "AP-6: No clickable <div> elements",
    description: "Not keyboard accessible. No focus ring. Not announced as interactive by screen readers.",
    bad: '<div\n  onClick={handler}\n  className="cursor-pointer"\n>\n  Click me\n</div>',
    good: '<Button\n  variant="ghost"\n  onClick={handler}\n>\n  Click me\n</Button>',
  },
]

const usageDo = [
  "Use the logo on solid black or white backgrounds",
  "Maintain minimum clear space on all sides",
  "Use the provided SVG/PNG files",
  "Black logo on light, white on dark",
  "Scale proportionally",
  "Use font-medium (500) for headings",
  "Use semantic color tokens (success, warning, info)",
  "Use the defined type scale tokens",
  "Use specific transition properties",
  "Use <Button> and <IconButton> components",
]

const usageDont = [
  "Rotate, skew, or stretch the logo",
  "Add drop shadows or effects",
  "Place on busy or patterned backgrounds",
  "Use unapproved color combinations",
  "Use bold (700) for headings",
  "Use colored or tinted backgrounds",
  "Use arbitrary pixel text sizes",
  "Use transition-colors on elements",
  "Use raw <button> for interactions",
  "Use hardcoded hex colors in components",
]

const pagePatternDescriptions: Record<string, string> = {
  "pat-page-header": "The canonical hero for list/management pages. Rounded card with animated background, centered icon tile, and a single bold title line. Always rendered inside a container wrapper with max-w-7xl horizontal padding.",
  "pat-command-palette": "Command-K launcher composed from CommandDialog, CommandGroup, CommandItem, and CommandFooter. Mirrors the grouped Suggestions, Sessions, and Files sections with a keyboard-hint footer.",
  "pat-connection-pill": "Floating pill announcing a mid-session connection hiccup - pulsing dot plus label/detail. Amber is used for transient states; destructive is reserved for truly unreachable sandboxes.",
  "pat-spotlight-card": "Item card used across list pages. The React app adds mouse-following spotlight chrome; this Nuxt playground keeps the same card grid, icon tile, label/subtitle rhythm, and border treatment.",
  "pat-search-bar": "Standard search pill placed in the action bar below a PageHeader. It stays max-w-md so it can sit beside a right-aligned primary action.",
  "pat-stagger": "Management pages mount header, action bar, and content with staggered fade-and-slide delays: entry, delay-75, and delay-150.",
  "pat-settings-shell": "Generic settings dialog - grouped sidebar nav plus a scrollable content pane. The content remains caller-composed from form controls and cards.",
  "pat-overlay-shell": "Full-screen Customize-style overlay - grouped sidebar rail with a content pane each section owns. Built from the OverlayShell primitive.",
  "pat-toast": "Notifications via sonner/vue-sonner, themed through the shared Toaster mounted once in the root.",
  "pat-session-list-row": "The exact sidebar row shape: status dot, active title, child-count pill, pending badge, and hover-revealed kebab actions.",
  "pat-model-selector": "The chat composer's model picker - a CommandPopover pill opening a searchable provider-grouped model list with free tags and selected checks.",
  "pat-shortcuts": "The shortcuts reference from Settings - a divided rounded-2xl panel pairing each action with a Kbd combo.",
  "pat-provider-modal": "The provider catalog + connect flow from connect-provider-content.tsx - searchable ProviderCard rows with real ProviderLogo artwork, less-common providers, and a second-step connect screen.",
  "pat-session-header": "Session header chrome with branch/status metadata, share controls, and compact icon actions that sit above the timeline.",
  "pat-share-dialog": "Share session dialog - invite link, visibility state, copy action, and explicit neutral/destructive separation.",
  "pat-command-palette-nav": "Command palette with submenu navigation. Parent rows lead into narrower action lists while the footer keeps consistent keyboard hints.",
  "pat-notifications-bell": "Notifications bell popover - unread dot, compact actor/ticket rows, timestamps, and a focused list surface.",
  "pat-notifications-settings": "The Notifications settings tab - a master Switch that reveals grouped per-type and behavior toggles.",
  "pat-wallpaper-picker": "Wallpaper picker grid - aspect-video cards, active border-primary state, default badge, and check marker on the selected pick.",
  "pat-agent-avatar": "Agent and user avatars - agents get hue plus Lucide icon; users get initials from handle. Both align in mixed assignee rows.",
  "pat-mention-textarea": "Mention textarea autocomplete - typing @ opens a team member list and inserts @slug at the cursor.",
  "pat-status-pill": "Task tracker status dropdown - trigger shows current status icon + label; the menu lists every status with a check on the active one.",
  "pat-diff-view": "Shared diff-view shape - split layout, bar indicators, theme-aware code surface, and plus/minus line treatment.",
  "pat-session-sidebar": "Collapsible session sidebar - logo header, New/Search/Files rows, selected session tint, and icon-only collapsed rail.",
  "pat-file-tree": "Recursive file tree - depth-based indent, rotating chevrons for directories, extension-mapped file icons, and selected file tint.",
  "pat-terminal-output": "Dark monospace terminal surface - chrome bar with live status dot and scrollable ANSI-style log pane.",
  "pat-tab-bar": "Tab bar and split layout - active underline, close buttons, branch chip, main pane, and side-panel tab switcher.",
  "pat-new-session": "New session empty-state composer - wallpaper backdrop, starter prompt chips, and pinned rounded composer with template pill and send button.",
}

const componentHeadingOverrides: Record<string, string> = {
  "comp-sheet": "Drawer",
  "comp-dropdown": "Dropdown Menu",
}
function componentHeading(child: TocChild) {
  return componentHeadingOverrides[child.id] ?? child.label
}
const componentDescriptions: Record<string, string> = {
  "comp-button": "10 variants by 8 sizes. The foundation of every interaction. The destructive variant is reserved for the one irreversible confirm action.",
  "comp-badge": "Labels, status indicators, and tags. Seven variants from solid to subtle.",
  "comp-card": "Container with header, content, and footer slots. Default and glass (translucent, no blur) variants.",
  "comp-input": "Text input for forms and search. The canonical form-control treatment.",
  "comp-textarea": "Multi-line text input for longer content. Shares one treatment with Input and Select.",
  "comp-select": "Dropdown selection from a list of options. Matches Input &amp; Textarea — same bg-card surface, accent focus ring, and rounded-2xl shape.",
  "comp-checkbox": "Toggle for boolean values.",
  "comp-switch": "Toggle control for on/off states.",
  "comp-toggle": "A two-state button with default and outline variants.",
  "comp-radio": "Single selection from a set of options.",
  "comp-tabs": "Tabbed navigation with standard and compact variants.",
  "comp-dialog": "Modal overlay for focused interactions.",
  "comp-sheet": "Slide-out panel from the edge of the viewport.",
  "comp-dropdown": "Contextual menu triggered by a button. Rows stay <strong>neutral</strong>— even destructive ones like Delete or Remove. Red is the brake, not the paint: it appears only on the final confirm button, never on a menu row.",
  "comp-tooltip": "Contextual information on hover.",
  "comp-popover": "Floating content panel attached to a trigger.",
  "comp-alert": "Inline notification with contextual variants.",
  "comp-alert-dialog": "Confirmation dialog for destructive or important actions.",
  "comp-accordion": "Collapsible content sections with smooth animation.",
  "comp-collapsible": "A simpler expand/collapse primitive. Unlike Accordion, it controls a single section without exclusive selection.",
  "comp-separator": "Visual divider between content sections.",
  "comp-skeleton": "Loading shimmer for content that has not loaded yet.",
  "comp-progress": "Visual indicator of completion or loading.",
  "comp-slider": "Range input for selecting numeric values.",
  "comp-label": "Accessible label for form controls.",
  "comp-breadcrumb": "Navigation hierarchy trail.",
  "comp-table": "Structured data display in rows and columns.",
  "comp-kbd": "Keyboard shortcut indicators.",
  "comp-calendar": "Date picker calendar grid.",
  "comp-scrollarea": "Custom scrollable container with styled scrollbar.",
  "comp-tag": "Compact label for categorization, filters, and metadata chips.",
  "comp-pagination": "Page navigation with optional page-size selector and results info.",
  "comp-command": "Searchable command palette/list for command-K menus and combobox interfaces.",
  "comp-drawer": "Bottom-anchored sheet for mobile-friendly modal flows, built on vaul.",
  "comp-context-menu": "Right-click contextual menu for row and canvas actions.",
  "comp-data-table": "Composable table with row selection, click handlers, and header actions.",
}

const providerIcons: Record<string, string> = {
  anthropic: "/provider-icons/anthropic.svg",
  openai: "/provider-icons/openai.svg",
  opencode: "/provider-icons/opencode.svg",
  google: "/provider-icons/google.svg",
  mistral: "/provider-icons/mistral.svg",
  groq: "/provider-icons/groq.svg",
}

const popularProviders: Provider[] = [
  { id: "anthropic", name: "Anthropic", desc: "Claude Pro/Max subscription or your own API key", connected: true },
  { id: "openai", name: "OpenAI", desc: "ChatGPT Pro/Plus subscription or your own API key", connected: false },
  { id: "opencode", name: "OpenCode", desc: "One key for many hosted models", connected: true },
]

const moreProviders: Provider[] = [
  { id: "google", name: "Google", desc: "Gemini models from Google AI Studio", connected: false },
  { id: "mistral", name: "Mistral", desc: "Mistral & Codestral models", connected: false },
  { id: "groq", name: "Groq", desc: "Fast inference", connected: false },
]

const allProviders = [...popularProviders, ...moreProviders]
const providerQuery = computed(() => providerSearch.value.toLowerCase())
const filteredPopularProviders = computed(() => popularProviders.filter(matchesProvider))
const filteredMoreProviders = computed(() => moreProviders.filter(matchesProvider))
const selectedProvider = computed(() => providerView.value.type === "connect" ? allProviders.find((p) => p.id === providerView.value.id) : undefined)
const customMatchesSearch = computed(() => !providerQuery.value || "custom provider".includes(providerQuery.value) || "ollama".includes(providerQuery.value))

function matchesProvider(provider: { name: string; desc: string }) {
  const q = providerQuery.value
  return !q || provider.name.toLowerCase().includes(q) || provider.desc.toLowerCase().includes(q)
}

function providerInitials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

function openProviderModal() {
  providerModalOpen.value = true
  providerView.value = { type: "list" }
  providerAuthMethod.value = null
  providerApiKey.value = ""
}

function closeProviderModal(open: boolean) {
  providerModalOpen.value = open
  if (!open) {
    providerView.value = { type: "list" }
    providerAuthMethod.value = null
  }
}

function connectProvider(provider: Provider) {
  providerView.value = { type: "connect", id: provider.id, name: provider.name }
  providerAuthMethod.value = null
  providerApiKey.value = ""
}

function showCustomProviderForm() {
  providerView.value = { type: "custom" }
  customProviderForm.value = { providerID: "", name: "", baseURL: "", apiKey: "", modelId: "", modelName: "" }
}

function handleProviderBack() {
  if (providerAuthMethod.value) {
    providerAuthMethod.value = null
    providerApiKey.value = ""
    return
  }
  providerView.value = { type: "list" }
}

function submitCustomProvider() {
  toast.success(`${customProviderForm.value.name || customProviderForm.value.providerID} connected`)
  providerModalOpen.value = false
}

function submitSelectedProvider() {
  if (selectedProvider.value) {
    toast.success(`${selectedProvider.value.name} connected`)
  }
  providerModalOpen.value = false
}

function showToast() {
  toast.success("Nuxt UI playground toast", {
    description: "Toaster is the Vue equivalent of the React sonner surface.",
  })
}

function handleConfirm() {
  confirmOpen.value = false
  toast("Confirmed demo action")
}
</script>

<template>
  <main class="min-h-screen bg-background">
    <div class="mx-auto max-w-5xl px-6 pb-24 pt-24 sm:pb-32 sm:pt-32">
      <div class="flex gap-16">
        <nav class="hidden w-48 shrink-0 self-start pt-2 lg:sticky lg:top-20 lg:block">
          <ul class="space-y-0.5">
            <li v-for="section in tocSections" :key="section.id">
              <a
                :href="'#' + section.id"
                class="block py-1 text-xs transition-colors"
                :class="(activeId === section.id || tocIsParentActive(section)) ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'"
              >{{ section.label }}</a>
              <ul v-if="tocHasChildren(section) && tocIsParentActive(section)" class="mb-1 ml-2.5 mt-0.5 space-y-0 border-l border-border/30 pl-2.5">
                <li v-for="child in section.children" :key="child.id">
                  <a
                    :href="'#' + child.id"
                    class="block py-0.5 text-xs transition-colors"
                    :class="activeId === child.id ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'"
                  >{{ child.label }}</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div class="max-w-3xl flex-1">
          <section id="hero">
            <div class="mb-3 flex items-center justify-between"><Badge variant="outline" class="font-mono text-xs">v1.0</Badge>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
                :aria-pressed="isDark"
                @click="toggleTheme"
              >
                <Sun v-if="isDark" class="size-3.5" />
                <Moon v-else class="size-3.5" />
                {{ isDark ? 'Light mode' : 'Dark mode' }}
              </button>
            </div>
            <h1 class="mb-5 text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">Brand & Design System</h1>
            <p class="max-w-xl text-base leading-relaxed text-muted-foreground">Logo assets, color palette, typography, motion tokens, component library, and usage rules for building Kortix. The complete reference for designers and engineers.</p>
            <div class="mt-6 flex flex-wrap gap-2"><Badge variant="secondary"><span class="font-mono">30+</span> Components</Badge><Badge variant="secondary"><span class="font-mono">7</span> Themes</Badge><Badge variant="secondary">OKLCH Colors</Badge><Badge variant="secondary">Radix Primitives</Badge></div>
          </section>
          <section id="logo" class="mt-14"><div class="mb-5 flex items-center justify-between"><h2 class="text-xs uppercase tracking-widest text-muted-foreground">Logo</h2><div class="flex items-center gap-0.5 rounded-full bg-foreground/[0.05] p-0.5"><button v-for="f in LOGO_FORMATS" :key="f" type="button" class="cursor-pointer rounded-full px-3 py-1 font-mono text-xs transition-colors" :class="logoFmt === f ? 'bg-background text-foreground shadow-sm ring-1 ring-foreground/[0.06]' : 'text-muted-foreground hover:text-foreground'" @click="logoFmt = f">{{ f.toUpperCase() }}</button></div></div><p class="mb-6 text-base leading-relaxed text-muted-foreground">Two forms — the symbol on its own, and the full logo. Each in black and white.</p><div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><div v-for="asset in LOGO_ASSETS" :key="asset.id" class="group relative"><div class="relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-lg transition-colors" :class="[asset.label === 'Symbol' ? 'p-10' : 'px-6 py-8', asset.dark ? 'bg-neutral-950 ring-1 ring-white/[0.06]' : 'bg-white ring-1 ring-black/[0.06]']"><img :src="asset.svgSrc" :alt="`${BRAND_NAME} ${asset.label} ${asset.variant}`" :class="['object-contain', asset.label === 'Symbol' ? 'max-h-10 w-auto md:max-h-12' : 'w-full max-h-8 md:max-h-10']"><a :href="logoFmt === 'png' ? asset.pngSrc : asset.svgSrc" :download="`${BRAND_SLUG}-${asset.label.toLowerCase()}-${asset.variant.toLowerCase()}.${logoFmt}`" class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/[0.04] opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white/[0.04]"><span class="flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-medium shadow-sm ring-1 ring-border"><Download class="size-3" /> {{ logoFmt.toUpperCase() }}</span></a></div><div class="mt-2 flex items-baseline gap-1.5 px-0.5"><span class="text-xs font-medium text-foreground">{{ asset.label }}</span><span class="font-mono text-xs text-muted-foreground">{{ asset.variant }}</span></div></div></div><p class="mt-6 text-sm leading-relaxed text-muted-foreground">{{ LOGO_DESCRIPTION }}</p><div class="mt-10"><h3 class="mb-5 text-xs uppercase tracking-widest text-muted-foreground">Social Avatar</h3><p class="mb-6 text-base leading-relaxed text-muted-foreground">The symbol centred on a solid field, square 1:1 — drop it straight into a profile picture or social handle. Hover to download the ready-made PNG (1000×1000, &lt;1 MB).</p><div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"><div v-for="asset in SOCIAL_ASSETS" :key="asset.id" class="group relative"><div class="relative aspect-square overflow-hidden rounded-lg ring-1" :class="asset.dark ? 'ring-white/[0.06]' : 'ring-black/[0.06]'"><img :src="asset.pngSrc" :alt="`${BRAND_NAME} avatar ${asset.variant}`" class="size-full object-cover"><a :href="asset.pngSrc" :download="`${BRAND_SLUG}-avatar-${asset.variant.toLowerCase()}.png`" class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/[0.04] opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white/[0.04]"><span class="flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-medium shadow-sm ring-1 ring-border"><Download class="size-3" /> PNG</span></a></div><div class="mt-2 flex items-baseline gap-1.5 px-0.5"><span class="text-xs font-medium text-foreground">Avatar</span><span class="font-mono text-xs text-muted-foreground">{{ asset.variant }}</span></div></div></div></div></section>
          <section id="colors"><div class="mt-14 border-t border-border/50 pt-8" /><h2 class="mb-5 text-xs uppercase tracking-widest text-muted-foreground">Colors</h2><p class="mb-6 text-base leading-relaxed text-muted-foreground">Black and white is the foundation. Each UI theme pairs the neutral base with exactly one accent color. The OKLCH color space ensures perceptual uniformity across all themes.</p><div class="mb-8"><p class="mb-3 text-xs text-muted-foreground">Foundation</p><div class="grid grid-cols-2 gap-3 md:grid-cols-4"><div v-for="color in FOUNDATION_COLORS" :key="color.hex"><div class="aspect-[4/3] rounded-lg ring-1 ring-black/[0.08]" :style="{ backgroundColor: color.hex }" /><div class="mt-2 space-y-0.5 px-0.5"><span class="text-xs font-medium text-foreground">{{ color.name }}</span><div class="font-mono text-xs text-muted-foreground">{{ color.hex }}</div></div></div></div></div><div><div class="mb-3 flex items-baseline justify-between"><p class="text-xs text-muted-foreground">Core palette</p><p class="font-mono text-xs text-muted-foreground/70">globals.css · :root / .dark</p></div><div class="grid grid-cols-1 gap-3 md:grid-cols-2"><div v-for="token in CORE_PALETTE" :key="token.var" class="overflow-hidden rounded-lg border border-border/50"><div class="grid h-14 grid-cols-2"><div class="relative ring-1 ring-inset ring-black/[0.06]" :style="{ backgroundColor: token.light }"><span class="absolute bottom-1 left-2 text-xs font-mono uppercase tracking-widest text-black/55">light</span></div><div class="relative ring-1 ring-inset ring-white/[0.06]" :style="{ backgroundColor: token.dark }"><span class="absolute bottom-1 left-2 text-xs font-mono uppercase tracking-widest text-white/55">dark</span></div></div><div class="bg-background px-3 py-2.5"><div class="mb-1 flex items-baseline justify-between gap-2"><span class="truncate text-xs font-medium text-foreground">{{ token.name }}</span><span class="shrink-0 font-mono text-xs text-muted-foreground">{{ token.var }}</span></div><div class="flex items-center justify-between gap-2"><button type="button" class="inline-flex items-center gap-1.5 group cursor-pointer" @click="copyHex(token.light)"><span class="font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">{{ token.light }}</span><Check v-if="copiedHex[token.light]" class="size-2.5 text-emerald-500" /><Copy v-else class="size-2.5 text-muted-foreground transition-colors group-hover:text-muted-foreground" /></button><button type="button" class="inline-flex items-center gap-1.5 group cursor-pointer" @click="copyHex(token.dark)"><span class="font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">{{ token.dark }}</span><Check v-if="copiedHex[token.dark]" class="size-2.5 text-emerald-500" /><Copy v-else class="size-2.5 text-muted-foreground transition-colors group-hover:text-muted-foreground" /></button></div></div></div></div></div></section>
          <section id="typography"><div class="mt-14 border-t border-border/50 pt-8" /><h2 class="mb-5 text-xs uppercase tracking-widest text-muted-foreground">Typography</h2><p class="mb-8 text-base leading-relaxed text-muted-foreground">Roobert — a geometric sans-serif. Font-medium (500) is the brand weight. Roobert Mono for code and data.</p><div class="space-y-6"><div v-for="weight in FONT_WEIGHT_ITEMS" :key="weight" class="border-b border-border/30 pb-5"><span class="mb-2 block font-mono text-xs tracking-widest text-muted-foreground">{{ weight }}</span><p class="text-3xl tracking-tight text-foreground md:text-5xl">Kortix Computer</p></div></div><div class="mt-6 rounded-lg bg-neutral-950 p-5 text-neutral-100 md:p-6"><span class="mb-3 block font-mono text-xs tracking-widest text-neutral-500">Roobert Mono</span><p class="font-mono text-lg tracking-tight md:text-2xl">const agent = new Kortix();</p><p class="mt-4 font-mono text-xs text-neutral-600">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p></div><div class="mt-8"><p class="mb-4 text-xs text-muted-foreground">Type Scale</p><div class="space-y-0"><div v-for="t in TYPE_SCALE" :key="t.token" class="flex items-baseline gap-4 border-b border-border/20 py-3"><div class="w-24 shrink-0"><span class="font-mono text-xs text-muted-foreground">{{ t.token }}</span></div><div class="w-16 shrink-0"><span class="font-mono text-xs text-muted-foreground">{{ t.px }}</span></div><div class="min-w-0 flex-1"><span class="block truncate font-medium text-foreground" :style="{ fontSize: t.size }">The quick brown fox</span></div><div class="hidden max-w-48 shrink-0 sm:block"><span class="block truncate text-xs text-muted-foreground">{{ t.use }}</span></div></div></div></div></section>
          <section id="motion"><div class="mt-14 border-t border-border/50 pt-8" /><h2 class="mb-5 text-xs uppercase tracking-widest text-muted-foreground">Motion</h2><p class="mb-6 text-base leading-relaxed text-muted-foreground">Standardized duration and easing tokens ensure every transition feels consistent. Click the labels to trigger the animation.</p>
            <div class="mb-8">
              <p class="mb-4 text-xs text-muted-foreground">Duration Scale</p>
              <div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50">
                <div class="space-y-3">
                  <div v-for="d in MOTION_DURATIONS" :key="d.token" class="flex items-center gap-4">
                    <button type="button" class="w-24 shrink-0 cursor-pointer text-left font-mono text-xs text-muted-foreground transition-colors hover:text-foreground" @click="toggleMotionBar(d.token)">{{ d.name }}</button>
                    <div class="relative h-7 flex-1 overflow-hidden rounded-md bg-muted/30">
                      <div class="absolute bottom-1 left-1 top-1 rounded-sm bg-foreground/70" :style="{ width: motionBarActive[d.token] ? 'calc(100% - 8px)' : '24px', transitionProperty: 'width', transitionDuration: d.ms + 'ms', transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)' }" />
                    </div>
                    <span class="w-14 shrink-0 text-right font-mono text-xs text-muted-foreground">{{ d.ms }}ms</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p class="mb-4 text-xs text-muted-foreground">Easing Curves</p>
              <div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50">
                <div class="space-y-3">
                  <div v-for="e in EASING_CURVES" :key="e.token" class="flex items-center gap-4">
                    <button type="button" class="w-24 shrink-0 cursor-pointer text-left font-mono text-xs text-muted-foreground transition-colors hover:text-foreground" @click="toggleMotionBar(e.token)">{{ e.name }}</button>
                    <div class="relative h-7 flex-1 overflow-hidden rounded-md bg-muted/30">
                      <div class="absolute bottom-1 left-1 top-1 rounded-sm bg-foreground/70" :style="{ width: motionBarActive[e.token] ? 'calc(100% - 8px)' : '24px', transitionProperty: 'width', transitionDuration: '300ms', transitionTimingFunction: e.value }" />
                    </div>
                    <span class="w-14 shrink-0 text-right font-mono text-xs text-muted-foreground">300ms</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="spacing"><div class="mt-14 border-t border-border/50 pt-8" /><h2 class="mb-5 text-xs uppercase tracking-widest text-muted-foreground">Spacing</h2><p class="mb-6 text-base leading-relaxed text-muted-foreground">A consistent spacing scale based on 4px increments. Used for padding, margins, and gaps throughout the UI.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div v-for="n in SPACING_SCALE_STEPS" :key="n" class="flex items-center gap-4 py-1"><span class="w-8 shrink-0 text-right font-mono text-xs text-muted-foreground">{{ n }}</span><div class="h-5 rounded-sm bg-foreground/60" :style="{ width: (n * 12) + 'px' }" /><span class="font-mono text-xs text-muted-foreground">{{ n * 4 }}px</span></div></div></section>
          <section id="components"><div class="mt-14 border-t border-border/50 pt-8" /><h2 class="mb-5 text-xs uppercase tracking-widest text-muted-foreground">Components</h2><p class="mb-8 text-base leading-relaxed text-muted-foreground">The complete component library. Each component uses a consistent API with variant and size props managed through class-variance-authority. Built on Radix UI primitives for accessibility and composability.</p><div v-for="child in tocSections.find((s) => s.id === 'components')?.children" :id="child.id" :key="child.id" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{{ componentHeading(child) }}</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground" v-html="componentDescriptions[child.id]" /><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div v-if="child.id === 'comp-button'" class="space-y-6"><div><p class="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Base Variants</p><div class="flex flex-wrap gap-2"><Button variant="default">Default</Button><Button variant="secondary">Secondary</Button><Button variant="destructive">Destructive</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="link">Link</Button></div></div><div><p class="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Kortix Variants</p><div class="flex flex-wrap gap-2"><Button variant="subtle">Subtle</Button><Button variant="muted">Muted</Button><Button variant="inverse">Inverse</Button><Button variant="success">Success</Button></div></div><div><p class="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Standard Sizes</p><div class="flex flex-wrap items-center gap-2"><Button size="lg">Large</Button><Button size="default">Default</Button><Button size="sm">Small</Button><Button size="icon"><Settings class="size-4" /></Button></div></div><div><p class="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Compact Sizes</p><div class="flex flex-wrap items-center gap-2"><Button size="toolbar" variant="muted">Toolbar</Button><Button size="xs" variant="muted">XSmall</Button><Button size="icon-sm" variant="ghost"><Settings class="size-3.5" /></Button><Button size="icon-xs" variant="ghost"><X class="size-3" /></Button></div></div><div><p class="mb-3 text-xs uppercase tracking-wider text-muted-foreground">With Icons</p><div class="flex flex-wrap items-center gap-2"><Button><Mail class="size-4" />Send Email</Button><Button variant="outline"><Plus class="size-4" />Create</Button><Button variant="subtle"><Search class="size-4" />Search</Button><Button variant="destructive"><Trash2 class="size-4" />Delete</Button><Button variant="inverse"><ArrowRight class="size-4" />Launch</Button><Button variant="success" size="toolbar"><Check class="size-3.5" />Confirm</Button></div></div><div><p class="mb-3 text-xs uppercase tracking-wider text-muted-foreground">States</p><div class="flex flex-wrap items-center gap-2"><Button disabled>Disabled</Button><Button disabled variant="outline">Disabled Outline</Button><Button><Loader2 class="size-4 animate-spin" />Loading</Button></div></div></div><div v-else-if="child.id === 'comp-badge'" class="space-y-4"><div><p class="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Base Variants</p><div class="flex flex-wrap gap-2"><Badge variant="default">Default</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="destructive">Destructive</Badge><Badge variant="outline">Outline</Badge><Badge variant="new">New</Badge><Badge variant="beta">Beta</Badge><Badge variant="highlight">Highlight</Badge></div></div><div><p class="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Semantic Status</p><div class="flex flex-wrap gap-2"><Badge variant="success">Success</Badge><Badge variant="warning">Warning</Badge><Badge variant="info">Info</Badge><Badge variant="muted">Muted</Badge></div></div><div><p class="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Sizes</p><div class="flex flex-wrap items-center gap-2"><Badge variant="default">Default</Badge><Badge variant="default" size="sm">Small</Badge><Badge variant="success" size="sm">Active</Badge><Badge variant="warning" size="sm">Pending</Badge></div></div><div><p class="mb-3 text-xs uppercase tracking-wider text-muted-foreground">With Icons</p><div class="flex flex-wrap gap-2"><Badge variant="default"><Star class="size-3" />Featured</Badge><Badge variant="success"><Check class="size-3" />Verified</Badge><Badge variant="info"><Info class="size-3" />v2.1.0</Badge><Badge variant="warning"><AlertTriangle class="size-3" />Pending</Badge></div></div></div><div v-else-if="child.id === 'comp-input'" class="max-w-sm space-y-4"><div class="space-y-2"><Label for="demo-input">Label</Label><Input id="demo-input" placeholder="Default input" /></div><Input placeholder="With placeholder" /><Input type="password" placeholder="Password input" /><Input disabled placeholder="Disabled" /></div><div v-else-if="child.id === 'comp-textarea'" class="max-w-sm space-y-4"><Textarea placeholder="Write something..." /><Textarea disabled placeholder="Disabled textarea" /></div><div v-else-if="child.id === 'comp-select'" class="max-w-xs"><Select v-model="selectVal"><SelectTrigger><SelectValue placeholder="Select a framework" /></SelectTrigger><SelectContent><SelectItem value="next">Next.js</SelectItem><SelectItem value="remix">Remix</SelectItem><SelectItem value="astro">Astro</SelectItem><SelectItem value="nuxt">Nuxt</SelectItem></SelectContent></Select></div><div v-else-if="child.id === 'comp-checkbox'" class="space-y-4"><div class="flex items-center gap-2"><Checkbox id="check-1" v-model="checked" /><Label for="check-1">Checked</Label></div><div class="flex items-center gap-2"><Checkbox id="check-2" /><Label for="check-2">Unchecked</Label></div><div class="flex items-center gap-2"><Checkbox id="check-3" disabled /><Label for="check-3" class="text-muted-foreground">Disabled</Label></div></div><div v-else-if="child.id === 'comp-switch'" class="space-y-4"><div class="flex items-center gap-3"><Switch id="switch-on" v-model="switchOn" /><Label for="switch-on">On</Label></div><div class="flex items-center gap-3"><Switch id="switch-off" /><Label for="switch-off">Off</Label></div><div class="flex items-center gap-3"><Switch id="switch-dis" disabled /><Label for="switch-dis" class="text-muted-foreground">Disabled</Label></div></div><div v-else-if="child.id === 'comp-toggle'" class="flex flex-wrap gap-2"><Toggle v-model="toggled" aria-label="Toggle bold"><Bold class="size-4" /></Toggle><Toggle variant="outline" aria-label="Toggle settings"><Settings class="size-4" /></Toggle></div><div v-else-if="child.id === 'comp-radio'"><RadioGroup v-model="radioVal"><div class="flex items-center gap-2"><RadioGroupItem value="default" id="r1" /><Label for="r1">Default</Label></div><div class="flex items-center gap-2"><RadioGroupItem value="comfortable" id="r2" /><Label for="r2">Comfortable</Label></div><div class="flex items-center gap-2"><RadioGroupItem value="compact" id="r3" /><Label for="r3">Compact</Label></div></RadioGroup></div><div v-else-if="child.id === 'comp-tabs'" class="space-y-6"><div><p class="mb-3 text-xs text-muted-foreground">Standard</p><Tabs v-model="tabVal"><TabsList><TabsTrigger value="tab1">Account</TabsTrigger><TabsTrigger value="tab2">Password</TabsTrigger><TabsTrigger value="tab3">Settings</TabsTrigger></TabsList><TabsContent value="tab1"><p class="mt-2 text-sm text-muted-foreground">Account settings and preferences.</p></TabsContent><TabsContent value="tab2"><p class="mt-2 text-sm text-muted-foreground">Change your password.</p></TabsContent><TabsContent value="tab3"><p class="mt-2 text-sm text-muted-foreground">General settings.</p></TabsContent></Tabs></div><div><p class="mb-3 text-xs text-muted-foreground">Compact</p><Tabs v-model="compactTabVal"><TabsListCompact><TabsTriggerCompact value="c1">Day</TabsTriggerCompact><TabsTriggerCompact value="c2">Week</TabsTriggerCompact><TabsTriggerCompact value="c3">Month</TabsTriggerCompact></TabsListCompact><TabsContent value="c1"><p class="mt-2 text-sm text-muted-foreground">Daily view content.</p></TabsContent><TabsContent value="c2"><p class="mt-2 text-sm text-muted-foreground">Weekly view content.</p></TabsContent><TabsContent value="c3"><p class="mt-2 text-sm text-muted-foreground">Monthly view content.</p></TabsContent></Tabs></div></div><div v-else-if="child.id === 'comp-card'" class="grid gap-4 sm:grid-cols-2"><Card variant="default"><CardHeader><CardTitle>Default Card</CardTitle><CardDescription>Standard card with solid background.</CardDescription></CardHeader><CardContent><p class="text-sm text-muted-foreground">Card content goes here. Use for grouping related information.</p></CardContent><CardFooter><Button variant="outline" size="sm">Action</Button></CardFooter></Card><Card variant="glass"><CardHeader><CardTitle>Glass Card</CardTitle><CardDescription>Translucent surface for overlays and panels.</CardDescription></CardHeader><CardContent><p class="text-sm text-muted-foreground">Card content goes here. Used for overlays and floating panels.</p></CardContent><CardFooter><Button variant="outline" size="sm">Action</Button></CardFooter></Card></div><div v-else-if="child.id === 'comp-dialog'"><Dialog><DialogTrigger as-child><Button variant="outline">Open Dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Dialog Title</DialogTitle><DialogDescription>This is a description of the dialog content. It provides context for the user.</DialogDescription></DialogHeader><div class="py-4"><p class="text-sm text-muted-foreground">Dialog body content goes here.</p></div><DialogFooter><Button variant="outline">Cancel</Button><Button>Confirm</Button></DialogFooter></DialogContent></Dialog></div><div v-else-if="child.id === 'comp-sheet'"><Drawer><DrawerTrigger as-child><Button variant="outline">Open Drawer</Button></DrawerTrigger><DrawerContent><DrawerHeader><DrawerTitle>Drawer Title</DrawerTitle><DrawerDescription>A side panel for secondary content and actions.</DrawerDescription></DrawerHeader><div class="px-4 py-6"><p class="text-sm text-muted-foreground">Drawer body content.</p></div></DrawerContent></Drawer></div><div v-else-if="child.id === 'comp-dropdown'"><DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline"><MoreHorizontal class="size-4" />Options</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem>Edit</DropdownMenuItem><DropdownMenuItem>Duplicate</DropdownMenuItem><DropdownMenuItem>Archive</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem>Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div><div v-else-if="child.id === 'comp-drawer'"><Drawer><DrawerTrigger as-child><Button variant="outline">Open drawer</Button></DrawerTrigger><DrawerContent><DrawerHeader><DrawerTitle>Edit profile</DrawerTitle><DrawerDescription>Make changes to your profile here. Click save when you're done.</DrawerDescription></DrawerHeader><DrawerFooter><Button>Save changes</Button><DrawerClose as-child><Button variant="outline">Cancel</Button></DrawerClose></DrawerFooter></DrawerContent></Drawer></div><div v-else-if="child.id === 'comp-tooltip'" class="flex gap-4"><TooltipProvider><Tooltip><TooltipTrigger as-child><Button variant="outline">Hover me</Button></TooltipTrigger><TooltipContent>Tooltip content</TooltipContent></Tooltip></TooltipProvider></div><div v-else-if="child.id === 'comp-popover'"><Popover><PopoverTrigger as-child><Button variant="outline">Open Popover</Button></PopoverTrigger><PopoverContent><div class="space-y-2"><h4 class="text-sm font-medium">Popover Title</h4><p class="text-sm text-muted-foreground">Popover content with actions or details.</p></div></PopoverContent></Popover></div><div v-else-if="child.id === 'comp-alert'" class="space-y-3"><Alert><Info class="size-4" /><AlertTitle>Default Alert</AlertTitle><AlertDescription>This is a default informational alert.</AlertDescription></Alert><Alert variant="destructive"><AlertTriangle class="size-4" /><AlertTitle>Destructive</AlertTitle><AlertDescription>Something went wrong. Please try again.</AlertDescription></Alert><Alert variant="warning"><TriangleAlert class="size-4" /><AlertTitle>Warning</AlertTitle><AlertDescription>This action may have unintended consequences.</AlertDescription></Alert></div><div v-else-if="child.id === 'comp-alert-dialog'"><AlertDialog><AlertDialogTrigger as-child><Button variant="outline">Show Alert Dialog</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div><div v-else-if="child.id === 'comp-accordion'"><Accordion type="single" collapsible class="w-full"><AccordionItem value="item-1"><AccordionTrigger>What is Kortix?</AccordionTrigger><AccordionContent>Kortix is an AI-powered platform for building and deploying intelligent agents. It provides the infrastructure, tools, and interfaces needed to create production-grade AI workflows.</AccordionContent></AccordionItem><AccordionItem value="item-2"><AccordionTrigger>What design system does it use?</AccordionTrigger><AccordionContent>Kortix uses a monochromatic design system with strategic accent colors, built on OKLCH color tokens, the Roobert type family, and Radix UI primitives.</AccordionContent></AccordionItem><AccordionItem value="item-3"><AccordionTrigger>How do themes work?</AccordionTrigger><AccordionContent>Each theme defines a single accent hue applied to primary, ring, and chart tokens. All backgrounds, surfaces, and borders remain neutral. Seven themes are available: Graphite, Teal, Amber, Rose, Violet, Emerald, and Neon.</AccordionContent></AccordionItem></Accordion></div><div v-else-if="child.id === 'comp-collapsible'" class="w-full"><Collapsible v-model:open="collapsibleOpen"><div class="flex items-center justify-between"><span class="text-sm font-medium">3 tagged items</span><CollapsibleTrigger as-child><Button variant="ghost" size="sm"><ChevronsUpDown class="size-4" /><span class="sr-only">Toggle</span></Button></CollapsibleTrigger></div><div class="mt-2 rounded-2xl border border-border/50 px-4 py-2 text-sm">@kortix/design-system</div><CollapsibleContent class="mt-2 space-y-2"><div class="rounded-2xl border border-border/50 px-4 py-2 text-sm">@kortix/components</div><div class="rounded-2xl border border-border/50 px-4 py-2 text-sm">@kortix/tokens</div></CollapsibleContent></Collapsible></div><div v-else-if="child.id === 'comp-separator'" class="space-y-4"><div>Above</div><Separator /><div>Below</div></div><div v-else-if="child.id === 'comp-skeleton'" class="space-y-6"><div><p class="mb-3 text-xs text-muted-foreground">Card Skeleton</p><div class="flex items-start gap-4"><Skeleton class="size-12 rounded-full" /><div class="flex-1 space-y-2"><Skeleton class="h-4 w-48" /><Skeleton class="h-4 w-full" /><Skeleton class="h-4 w-3/4" /></div></div></div><div><p class="mb-3 text-xs text-muted-foreground">Inline Variants</p><div class="space-y-3"><Skeleton class="h-10 w-full rounded-2xl" /><div class="flex gap-3"><Skeleton class="h-8 w-24 rounded-xl" /><Skeleton class="h-8 w-32 rounded-xl" /><Skeleton class="h-8 w-20 rounded-xl" /></div></div></div></div><div v-else-if="child.id === 'comp-progress'" class="space-y-4"><div v-for="v in OPACITY_STEPS" :key="v" class="space-y-1.5"><span class="font-mono text-xs text-muted-foreground">{{ v }}%</span><Progress :model-value="v" /></div></div><div v-else-if="child.id === 'comp-slider'"><div class="max-w-sm space-y-4"><Slider v-model="sliderValue" :max="100" :step="1" /><span class="font-mono text-xs text-muted-foreground">Value: {{ sliderValue[0] }}</span></div></div><div v-else-if="child.id === 'comp-label'" class="space-y-2"><Label for="label-demo">Email</Label><Input id="label-demo" placeholder="name@example.com" /></div><div v-else-if="child.id === 'comp-breadcrumb'"><Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb></div><div v-else-if="child.id === 'comp-table'" class="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead>Role</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Alex</TableCell><TableCell>Active</TableCell><TableCell>Owner</TableCell></TableRow><TableRow><TableCell>Sam</TableCell><TableCell>Invited</TableCell><TableCell>Member</TableCell></TableRow></TableBody></Table></div><div v-else-if="child.id === 'comp-kbd'" class="space-y-4"><div><p class="mb-3 text-xs text-muted-foreground">Individual Keys</p><div class="flex flex-wrap items-center gap-2"><Kbd>⌘</Kbd><Kbd>K</Kbd><Kbd>Shift</Kbd><Kbd>Enter</Kbd><Kbd>Esc</Kbd><Kbd>Tab</Kbd></div></div><div><p class="mb-3 text-xs text-muted-foreground">Key Groups (Shortcuts)</p><div class="flex flex-wrap items-center gap-4"><KbdGroup><Kbd>⌘</Kbd><span class="text-xs text-muted-foreground">+</span><Kbd>K</Kbd></KbdGroup><KbdGroup><Kbd>⌘</Kbd><span class="text-xs text-muted-foreground">+</span><Kbd>Shift</Kbd><span class="text-xs text-muted-foreground">+</span><Kbd>P</Kbd></KbdGroup><KbdGroup><Kbd>Ctrl</Kbd><span class="text-xs text-muted-foreground">+</span><Kbd>C</Kbd></KbdGroup></div></div></div><div v-else-if="child.id === 'comp-calendar'"><Calendar /></div><div v-else-if="child.id === 'comp-scrollarea'"><ScrollArea class="h-48 w-full rounded-2xl border border-border/50 p-4"><div class="space-y-2"><div v-for="(row, i) in scrollRows" :key="row" class="flex items-center gap-3 border-b border-border/20 py-1.5"><span class="w-6 font-mono text-xs text-muted-foreground">{{ String(i + 1).padStart(2, '0') }}</span><span class="text-sm text-foreground">{{ row }}</span></div></div></ScrollArea></div><div v-else-if="child.id === 'comp-tag'" class="flex flex-wrap gap-2"><Tag>Default</Tag><Tag variant="new">New</Tag><Tag variant="free">Free</Tag><Tag variant="latest">Latest</Tag><Tag variant="warning">Warning</Tag></div><div v-else-if="child.id === 'comp-pagination'"><Pagination :current-page="page" :total-pages="8" :total-items="148" :page-size="pageSize" @page-change="page = $event" @page-size-change="pageSize = $event" /></div><div v-else-if="child.id === 'comp-command'"><Command class="rounded-2xl border border-border/60"><CommandInput placeholder="Search..." /><CommandList><CommandEmpty>No results.</CommandEmpty><CommandGroup heading="Suggestions"><CommandItem value="calendar">Calendar</CommandItem><CommandItem value="search">Search</CommandItem><CommandItem value="settings">Settings</CommandItem></CommandGroup></CommandList></Command></div><div v-else-if="child.id === 'comp-context-menu'"><ContextMenu><ContextMenuTrigger as-child><div class="rounded-2xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">Right click here</div></ContextMenuTrigger><ContextMenuContent><ContextMenuLabel>Actions</ContextMenuLabel><ContextMenuItem>Preview</ContextMenuItem><ContextMenuItem>Rename</ContextMenuItem><ContextMenuSeparator /><ContextMenuItem>Delete</ContextMenuItem></ContextMenuContent></ContextMenu></div><div v-else-if="child.id === 'comp-data-table'"><DataTable :columns="columns" :data="rows" selectable :selected-items="selectedRows" :get-item-id="(item: IssueRow) => item.id" @selection-change="selectedRows = $event" /></div><div v-else /></div></div></section>
          <section id="chat"><div class="mt-14 border-t border-border/50 pt-8" /><h2 class="mb-5 text-xs uppercase tracking-widest text-muted-foreground">Chat</h2><p class="mb-8 text-base leading-relaxed text-muted-foreground">Presentational primitives composed for chat surfaces - status indicators, collapsible reasoning panels, message bubbles, and system event cards. Built from the same tokens as the rest of the system (rounded-2xl containers, border-border/60, bg-muted/40 tints).</p>
            <div id="chat-thinking-text" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">AnimatedThinkingText</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">A typing + shimmer animated status line used while the assistant is working. Cycles through ambient messages, or types and shimmers a live <code class="rounded bg-muted px-1 font-mono text-xs">statusText</code> on loop.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="space-y-4"><div><p class="mb-2 text-xs text-muted-foreground">Ambient (cycles through messages)</p><AnimatedThinkingText /></div><div><p class="mb-2 text-xs text-muted-foreground">Live status</p><AnimatedThinkingText status-text="Reading project files..." /></div></div></div></div>
            <div id="chat-thinking-block" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">ThinkingBlock</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Borderless inline row for collapsed agent reasoning - a <code class="rounded bg-muted px-1 font-mono text-xs">Brain</code> icon, a truncated one-line preview, and (while streaming) a spinner. Expanded content is indented with a left hairline rather than wrapped in a card - matching how reasoning actually renders inline in the timeline.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="w-full max-w-md space-y-1"><ThinkingBlock preview="Reviewing the auth middleware for compliance gaps" streaming default-open><p>Looking through the session validation flow to confirm tokens are never persisted in plaintext, then checking the refresh path for the same issue.</p></ThinkingBlock><ThinkingBlock preview="Picked the approach that reuses the existing Collapsible primitive"><p>Considered three approaches and chose the one with the smallest surface area against the design system.</p></ThinkingBlock></div></div></div>
            <div id="chat-questions-card" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">QuestionsCard</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Collapsible summary of answered clarifying questions - bordered <code class="rounded bg-muted px-1 font-mono text-xs">rounded-2xl bg-muted/20</code> card with a <code class="rounded bg-muted px-1 font-mono text-xs">MessageSquare</code> icon and an answered-count trigger. This is the card shape <code class="rounded bg-muted px-1 font-mono text-xs">ThinkingBlock</code> is sometimes mistaken for - they are visually distinct in the real chat.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="w-full max-w-md"><QuestionsCard :items="questions" default-expanded /></div></div></div>
            <div id="chat-tool-call" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">ToolCallCard</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">A flat, borderless inline row for a tool invocation - icon, name, and a mono argument summary, matching how tool calls actually render in the chat timeline (no card chrome, just a quiet <code class="rounded bg-muted px-1 font-mono text-xs">text-xs text-muted-foreground/70</code> row). A spinner shows while running; a chevron appears only when there is output to expand.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="w-full max-w-md space-y-1"><ToolCallCard title="Read" subtitle="src/components/session/tool-renderers.tsx" status="completed"><template #icon><FileText /></template>1  'use client';
2
3  import { useTranslations } from 'next-intl';</ToolCallCard><ToolCallCard title="Grep" subtitle="pattern: useChatSendStore" status="running" default-open><template #icon><Search /></template></ToolCallCard><ToolCallCard title="Bash" subtitle="pnpm test --filter @kortix/ui" status="error" default-open><template #icon><Terminal /></template>FAIL  src/components/button.test.tsx
  x renders disabled state (12 ms)</ToolCallCard></div></div></div>
            <div id="chat-bubble" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">ChatBubble & ChatActionCard</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">User messages render as an asymmetric <code class="rounded bg-muted px-1 font-mono text-xs">rounded-3xl rounded-br-lg</code> bubble on a <code class="rounded bg-muted px-1 font-mono text-xs">bg-card</code> surface - the chat-tail shape distinguishes them at a glance. <code class="rounded bg-muted px-1 font-mono text-xs">ChatActionCard</code> is the related right-aligned shape for system-style turns (channel messages, triggers, slash commands), using <code class="rounded bg-muted px-1 font-mono text-xs">rounded-2xl bg-muted/40</code>. Assistant replies render with no wrapper at all - plain markdown flowing in the timeline.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="w-full max-w-md space-y-4"><div><p class="mb-2 text-xs text-muted-foreground">ChatBubble - user message</p><ChatBubble><p class="text-sm text-foreground">Can you review the migration script before we run it against production?</p></ChatBubble></div><div><p class="mb-2 text-xs text-muted-foreground">Assistant reply - unwrapped, plain markdown</p><p class="text-sm text-muted-foreground">I've reviewed the migration script - it looks safe to run against production.</p></div><div><p class="mb-2 text-xs text-muted-foreground">ChatActionCard - slash command</p><ChatActionCard><div class="flex items-center gap-2"><Terminal class="size-3.5 shrink-0 text-muted-foreground" /><span class="font-mono text-sm text-foreground">/run-tests</span></div><span class="pl-5.5 font-mono text-xs text-muted-foreground/70">--filter @kortix/ui</span></ChatActionCard></div></div></div></div>
            <div id="chat-system-card" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">ChatSystemCard</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Header-and-body card for system events in a chat timeline - compaction notices, tool summaries, and other non-message events.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="w-full max-w-md space-y-3"><ChatSystemCard :icon="Layers" label="Compaction"><p>Conversation history was compacted to free up context. <strong>12 messages</strong> were summarized into a single note.</p></ChatSystemCard><ChatSystemCard :icon="MessageSquare" label="Questions"><p>3 of 3 questions answered. The assistant has enough context to continue.</p></ChatSystemCard></div></div></div>
            <div id="chat-divider" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">ChatDivider</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Hairline divider with a centered muted label - separates turns with a quiet system status line, e.g. <code class="rounded bg-muted px-1 font-mono text-xs">Goal · iteration 3/50</code>.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="w-full max-w-md space-y-4"><p class="text-sm text-muted-foreground">Picked up the migration task and started reviewing the schema changes.</p><ChatDivider>Goal · iteration 3 / 50</ChatDivider><p class="text-sm text-muted-foreground">Applied the backfill and re-ran the test suite - all green.</p></div></div></div>
            <div id="chat-input-shell" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">ChatInputShell</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">The composer surface - a large <code class="rounded bg-muted px-1 font-mono text-xs">rounded-[24px]</code> card on <code class="rounded bg-muted px-1 font-mono text-xs">bg-card</code> that frames the textarea and toolbar. The <code class="rounded bg-muted px-1 font-mono text-xs">active</code> prop highlights the border, e.g. on file drag-over.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="w-full max-w-md"><ChatInputShell><div class="px-4 pb-2 pt-3.5"><p class="text-sm text-muted-foreground">Ask Kortix anything...</p></div><div class="flex items-center justify-between px-3 pb-3"><button type="button" class="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><Paperclip class="size-4" /></button><button type="button" class="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><ArrowUp class="size-4" /></button></div></ChatInputShell></div></div></div>
            <div id="chat-attachment-tile" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">ChatAttachmentTile</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Staged-file tile shown above the composer - image preview or icon, filename, and a hover-to-reveal remove button.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="flex flex-wrap gap-2"><ChatAttachmentTile name="diagram.png" preview-url="https://images.unsplash.com/photo-1518770660439-4636190af475?w=240&h=160&fit=crop" removable /><ChatAttachmentTile name="migration.sql" removable><template #icon><FileCode2 class="size-8 text-muted-foreground/50" /></template></ChatAttachmentTile><ChatAttachmentTile name="notes.txt" removable><template #icon><FileText class="size-8 text-muted-foreground/50" /></template></ChatAttachmentTile></div></div></div>
            <div id="chat-context-event" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">ContextEventCard</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Card for context-management events - shares <code class="rounded bg-muted px-1 font-mono text-xs">ChatSystemCard</code>'s <code class="rounded bg-muted px-1 font-mono text-xs">rounded-2xl bg-card/50</code> shape, but its header carries a cluster of status <code class="rounded bg-muted px-1 font-mono text-xs">Badge</code> pills and expands to per-item detail rows.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="w-full max-w-md space-y-3"><ContextEventCard label="Context Compressed" :stats="[{ label: '12 msgs', variant: 'secondary' }, { label: '-3.2k tokens', variant: 'success' }, { label: '8.4k saved', variant: 'secondary' }]"><div><div class="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Topic</div><div>Migration planning for the auth schema change</div></div><div class="border-t border-border/30 pt-1.5"><div class="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Summary</div><div class="whitespace-pre-wrap break-words">Reviewed the migration script, confirmed staging target, and queued the backfill in batches of 500.</div></div></ContextEventCard><ContextEventCard label="Context Pruned" :stats="[{ label: '5 pruned', variant: 'warning' }, { label: '2.1k saved', variant: 'secondary' }]"><div class="space-y-0.5"><div v-for="tool in TOOL_NAMES" :key="tool" class="flex min-w-0 items-center gap-2 text-xs text-muted-foreground/80"><span class="text-muted-foreground/40">→</span><span class="rounded bg-muted/50 px-1 py-0.5 font-mono text-xs text-muted-foreground/70">{{ tool }}</span><span class="max-w-[300px] truncate">large output trimmed from context</span></div></div></ContextEventCard></div></div></div>
            <div id="chat-grouped-activity" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">GroupedActivityRow</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Same borderless-row family as <code class="rounded bg-muted px-1 font-mono text-xs">ThinkingBlock</code> / <code class="rounded bg-muted px-1 font-mono text-xs">ToolCallCard</code>, for collapsing a run of same-kind calls - <code class="rounded bg-muted px-1 font-mono text-xs">Read · 5 files · 3s</code> - into one row that expands into indented one-liners.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="w-full max-w-md space-y-1"><GroupedActivityRow :icon="Search" label="Gathered context · 3 reads, 2 searches" duration="4s" default-open><div class="flex min-w-0 items-center gap-1.5 py-0.5 text-xs text-muted-foreground/60"><span class="shrink-0">Read</span><span class="min-w-0 flex-1 truncate font-mono opacity-70">src/lib/auth/session.ts</span></div><div class="flex min-w-0 items-center gap-1.5 py-0.5 text-xs text-muted-foreground/60"><span class="shrink-0">Grep</span><span class="min-w-0 flex-1 truncate font-mono opacity-70">pattern: refreshToken</span></div></GroupedActivityRow><GroupedActivityRow :icon="Globe" label="Researching · 2 searches, 1 fetch" running /></div></div></div>
            <div id="chat-notification-chip" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">NotificationChip</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Small expandable pill for inline system notifications - PTY exits, agent completions, blockers. <code class="rounded bg-muted px-1 font-mono text-xs">tone</code> tints the icon (neutral / warning / error) without painting the whole chip, per the design system's restraint on color.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="w-full max-w-md space-y-2"><NotificationChip :icon="Terminal"><template #label>Process exited · code 0</template><div class="flex min-w-0 gap-2"><span class="shrink-0 text-muted-foreground/40">duration:</span><span class="font-mono text-xs text-muted-foreground/60">42s</span></div></NotificationChip><NotificationChip :icon="StopCircle" tone="warning"><template #label>Agent stopped · waiting for input</template></NotificationChip><NotificationChip :icon="Ban" tone="error"><template #label>Task failed · 3 retries exhausted</template><div class="whitespace-pre-wrap break-all font-mono text-xs text-muted-foreground/50">Error: connection timed out after 30000ms</div></NotificationChip></div></div></div>
            <div id="chat-message-actions" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">ChatMessageActions</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Row of icon-only ghost buttons that fades in on <code class="rounded bg-muted px-1 font-mono text-xs">group-hover/turn</code> - copy, edit & fork, fork. Hover the demo row to reveal it, exactly as it appears beneath a user message.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><TooltipProvider><div class="group/turn w-full max-w-md"><ChatBubble><p class="text-sm text-foreground">Can you review the migration script before we run it against production?</p></ChatBubble><div class="mt-1 flex justify-end"><ChatMessageActions :actions="chatActions" /></div></div></TooltipProvider></div></div>
          </section>
          <section id="page-patterns"><div class="mt-14 border-t border-border/50 pt-8" /><h2 class="mb-5 text-xs uppercase tracking-widest text-muted-foreground">Page Patterns</h2><p class="mb-8 text-base leading-relaxed text-muted-foreground">How Kortix list / management pages are built. These are the shared chrome pieces used by <code class="font-mono text-xs">/scheduled-tasks</code>, <code class="font-mono text-xs">/tunnel</code>, and new management-style pages.</p><div v-for="child in tocSections.find((s) => s.id === 'page-patterns')?.children" :id="child.id" :key="child.id" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{{ componentHeading(child) }}</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">{{ pagePatternDescriptions[child.id] }}</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50">
              <template v-if="child.id === 'pat-page-header'"><div class="rounded-2xl border border-border/60 bg-muted/20 p-6 text-center"><div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-card"><Zap class="size-5 text-primary" /></div><div class="text-2xl font-semibold tracking-tight sm:text-3xl"><span class="text-primary">Scheduled Tasks</span></div></div><pre class="mt-3 overflow-x-auto rounded-lg bg-muted/20 px-4 py-3 font-mono text-xs text-muted-foreground">&lt;div class=&quot;container mx-auto max-w-7xl px-3 sm:px-4 py-3 sm:py-4&quot;&gt;...&lt;/div&gt;</pre></template>
              <template v-else-if="child.id === 'pat-command-palette'"><Button variant="outline" @click="commandOpen = true"><Search class="size-4" />Open palette<CommandShortcut class="ml-2">⌘K</CommandShortcut></Button><CommandDialog v-model:open="commandOpen" title="Command Palette" description="Jump to a session, file, or action."><CommandInput placeholder="Search sessions, files, actions…" /><CommandList><CommandEmpty>No results found.</CommandEmpty><CommandGroup heading="Suggestions"><CommandItem value="switch-agent"><Bot class="size-4" /><span>Switch agent…</span><CommandShortcut>⌘J</CommandShortcut></CommandItem><CommandItem value="switch-model"><Sparkles class="size-4" /><span>Switch model…</span></CommandItem></CommandGroup><CommandGroup heading="Sessions"><CommandItem value="auth"><MessageSquare class="size-4" /><span>Refactor auth middleware</span><span class="ml-auto text-xs text-muted-foreground/50">2h ago</span></CommandItem><CommandItem value="migration"><MessageSquare class="size-4" /><span>Migration ordering bugfix</span><span class="ml-auto text-xs text-muted-foreground/50">yesterday</span></CommandItem></CommandGroup><CommandGroup heading="Files"><CommandItem value="sections"><FileText class="size-4" /><span class="font-mono text-xs">src/lib/customize-sections.ts</span></CommandItem><CommandItem value="palette"><FolderGit2 class="size-4" /><span class="font-mono text-xs">apps/web/src/components/command-palette.tsx</span></CommandItem></CommandGroup></CommandList><CommandFooter><span class="flex items-center gap-1.5"><CommandKbd>↑</CommandKbd><CommandKbd>↓</CommandKbd> Navigate</span><span class="flex items-center gap-1.5"><CommandKbd>↵</CommandKbd> Select</span><span class="flex items-center gap-1.5"><CommandKbd>esc</CommandKbd> Close</span><span class="ml-auto flex items-center gap-1"><Hash class="size-3" />6 results</span></CommandFooter></CommandDialog></template>
              <template v-else-if="child.id === 'pat-connection-pill'"><div class="flex flex-col items-start gap-3"><ConnectionPill status="connecting" label="Connecting to sandbox…" /><ConnectionPill status="reconnecting" label="Reconnecting" detail="12s" /><ConnectionPill status="degraded" label="Runtime services degraded" /><ConnectionPill status="unreachable" label="Sandbox unreachable" detail="Retrying in 30s" /></div></template>
              <template v-else-if="child.id === 'pat-spotlight-card'"><div class="grid gap-4 sm:grid-cols-2"><div v-for="item in INTEGRATION_ITEMS" :key="item.label" class="rounded-2xl border border-border/50 bg-card p-4 transition-colors hover:border-border"><div class="flex items-center gap-3"><div class="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-border/50 bg-muted"><component :is="item.icon" class="size-4 text-foreground" /></div><div class="min-w-0 flex-1"><div class="truncate text-sm font-semibold text-foreground">{{ item.label }}</div><div class="truncate text-xs text-muted-foreground">{{ item.sub }}</div></div></div></div></div></template>
              <template v-else-if="child.id === 'pat-search-bar'"><div class="flex items-center justify-between gap-4"><div class="relative max-w-md flex-1"><Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search connections..." class="pl-9" /></div><Button size="sm"><Plus class="size-3.5" />New</Button></div></template>
              <template v-else-if="child.id === 'pat-stagger'"><pre class="overflow-x-auto rounded-lg bg-muted/20 px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">// Page header
&lt;div class=&quot;animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-both&quot;&gt;

// Search + action bar
&lt;div class=&quot;animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-both delay-75&quot;&gt;

// Content area
&lt;div class=&quot;animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-both delay-150&quot;&gt;</pre></template>
              <template v-else-if="child.id === 'pat-settings-shell'"><Button variant="outline" @click="settingsOpen = true"><Settings class="size-4" />Open Settings</Button><SettingsShell v-model:open="settingsOpen" :active="activeSettings" :groups="settingsGroups" @active-change="activeSettings = $event"><template v-if="activeSettings === 'general'"><div class="space-y-4"><h3 class="text-sm font-semibold text-foreground">General</h3><div class="space-y-1.5"><Label>Display name</Label><Input default-value="Ada Lovelace" /></div></div></template><template v-else-if="activeSettings === 'appearance'"><div class="space-y-4"><h3 class="text-sm font-semibold text-foreground">Appearance</h3><div class="space-y-2"><label v-for="opt in [{value:'system',label:'System'},{value:'light',label:'Light'},{value:'dark',label:'Dark'}]" :key="opt.value" class="flex cursor-pointer items-center gap-2.5 text-sm text-foreground"><input type="radio" name="ds-theme" :value="opt.value" v-model="switchOn" class="accent-primary" />{{ opt.label }}</label></div></div></template><template v-else-if="activeSettings === 'notifications'"><div class="space-y-4"><h3 class="text-sm font-semibold text-foreground">Notifications</h3><div class="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3"><div><div class="text-sm font-medium text-foreground">Email notifications</div><div class="text-xs text-muted-foreground/70">Run summaries and mentions</div></div><Switch v-model="switchOn" /></div><div class="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3"><div><div class="text-sm font-medium text-foreground">Push notifications</div><div class="text-xs text-muted-foreground/70">Real-time alerts on this device</div></div><Switch /></div></div></template><template v-else-if="activeSettings === 'sounds'"><div class="space-y-4"><h3 class="text-sm font-semibold text-foreground">Sounds</h3><div class="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3"><div class="text-sm font-medium text-foreground">Play sound on completion</div><Switch /></div></div></template><template v-else-if="activeSettings === 'shortcuts'"><div class="space-y-2"><h3 class="mb-2 text-sm font-semibold text-foreground">Keyboard Shortcuts</h3><div v-for="row in [{action:'Open command palette',keys:['⌘','K']},{action:'New session',keys:['⌘','N']},{action:'Toggle sidebar',keys:['⌘','B']}]" :key="row.action" class="flex items-center justify-between py-1.5"><span class="text-sm text-muted-foreground">{{ row.action }}</span><KbdGroup><Kbd v-for="k in row.keys" :key="k">{{ k }}</Kbd></KbdGroup></div></div></template><template v-else-if="activeSettings === 'profile'"><div class="space-y-4"><h3 class="text-sm font-semibold text-foreground">Profile</h3><div class="flex items-center gap-3"><EntityAvatar label="Ada Lovelace" size="lg" /><div><div class="text-sm font-medium text-foreground">Ada Lovelace</div><div class="text-xs text-muted-foreground/70">ada@kortix.ai</div></div></div></div></template><template v-else-if="activeSettings === 'tokens'"><div class="space-y-4"><h3 class="text-sm font-semibold text-foreground">CLI Tokens</h3><div class="rounded-2xl border border-border/60 bg-card px-4 py-3"><div class="text-sm text-muted-foreground/70">No tokens created yet.</div></div></div></template></SettingsShell></template>
              <template v-else-if="child.id === 'pat-overlay-shell'"><Button variant="outline" @click="overlayOpen = true"><SlidersHorizontal class="size-4" />Open Customize</Button><OverlayShell :open="overlayOpen" title="Customize" subtitle="Vortex" :groups="overlayGroups" :footer-group="overlayFooterGroup" :active="activeOverlay" @close="overlayOpen = false" @active-change="activeOverlay = $event"><div class="p-6"><SectionCard title="Agents" description="Master-detail content composed by the caller."><List><ListRow><template #leading><EntityAvatar :icon="Bot" /></template><template #title>kortix</template><template #badges><Badge variant="outline" size="sm">default</Badge></template><template #subtitle><InlineMeta><span>full tool access</span></InlineMeta></template><template #trailing><Star class="size-3.5 text-primary fill-primary" /></template></ListRow><ListRow><template #leading><EntityAvatar :icon="Brain" /></template><template #title>memory-reflector</template><template #subtitle><InlineMeta><span>background agent</span></InlineMeta></template></ListRow></List></SectionCard></div></OverlayShell></template>
              <template v-else-if="child.id === 'pat-toast'"><div class="flex flex-wrap items-center gap-2"><Button variant="outline" size="sm" @click="toast.success('Session renamed', { description: 'vortex-refactor → auth-rewrite' })">Success</Button><Button variant="outline" size="sm" @click="toast.error('Failed to connect to sandbox', { description: 'Connection timed out after 30s' })">Error</Button><Button variant="outline" size="sm" @click="toast.warning('Running low on credits', { description: '12% remaining this cycle' })">Warning</Button><Button variant="outline" size="sm" @click="toast.info('New version available', { description: 'Restart the session to pick it up' })">Info</Button><Button variant="outline" size="sm" @click="toast.message('Archived 3 sessions')">Message</Button></div></template>
              <template v-else-if="child.id === 'pat-provider-modal'"><Button variant="outline" @click="openProviderModal"><Plug class="size-4" />Connect provider</Button></template>
              <template v-else-if="child.id === 'pat-session-list-row'"><TooltipProvider><div class="max-w-xs space-y-0.5 rounded-2xl border border-border/60 bg-sidebar p-1.5"><div v-for="s in SESSION_SUMMARY_ITEMS" :key="s.title" :class="['group flex cursor-pointer items-center gap-2 rounded-lg py-1 pl-2.5 pr-1.5 text-sm transition-colors', s.active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground']"><span v-if="s.busy" class="size-1.5 rounded-full bg-emerald-500 animate-pulse" /><span v-else-if="s.pending" class="size-1.5 rounded-full bg-amber-500 animate-pulse" /><span class="flex-1 truncate" :class="s.active && 'font-medium'">{{ s.title }}</span><span v-if="s.count" class="rounded-full bg-sidebar-accent/80 px-1.5 py-0.5 text-xs">{{ s.count }}</span><span v-if="s.pending" class="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500/15 px-1 text-xs font-medium text-amber-500">{{ s.pending }}</span><DropdownMenu><DropdownMenuTrigger as-child><button class="rounded-md p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent group-hover:opacity-100"><MoreHorizontal class="size-3.5" /></button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem><Pencil class="size-4" />Rename</DropdownMenuItem><DropdownMenuItem><Layers class="size-4" />Compact</DropdownMenuItem><DropdownMenuItem><Archive class="size-4" />Archive</DropdownMenuItem><DropdownMenuItem variant="destructive"><Trash2 class="size-4" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></div></TooltipProvider></template>
              <template v-else-if="child.id === 'pat-model-selector'"><TooltipProvider><CommandPopover v-model:open="commandPopoverOpen"><Tooltip><TooltipTrigger as-child><CommandPopoverTrigger><button type="button" :class="['inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground cursor-pointer', commandPopoverOpen && 'bg-muted text-foreground']"><span class="max-w-[160px] truncate">{{ MODEL_PROVIDERS.flatMap(g => g.models).find(m => m.id === selectedModel)?.name ?? 'Model' }}</span><ChevronDown :class="['size-3 opacity-50 transition-transform duration-200', commandPopoverOpen && 'rotate-180']" /></button></CommandPopoverTrigger></TooltipTrigger><TooltipContent side="top" class="text-xs">Choose model</TooltipContent></Tooltip><CommandPopoverContent class="w-[320px]"><CommandInput compact placeholder="Search models…" :value="modelSearch" @input="onModelSearch"><template #rightElement><Tooltip><TooltipTrigger as-child><button type="button" class="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground/50 transition-colors hover:bg-muted/50 hover:text-foreground" @click="commandPopoverOpen = false"><Plus class="size-3.5" /></button></TooltipTrigger><TooltipContent side="top" class="text-xs">Connect provider</TooltipContent></Tooltip></template></CommandInput><CommandList class="max-h-[340px]"><template v-for="group in (showOlderModels ? [...MODEL_PROVIDERS, ...MODEL_OLDER] : MODEL_PROVIDERS).map(g => ({ ...g, models: g.models.filter(m => !modelSearch || m.name.toLowerCase().includes(modelSearch.toLowerCase()) || m.id.toLowerCase().includes(modelSearch.toLowerCase())) })).filter(g => g.models.length > 0)" :key="group.id"><CommandGroup :heading="group.name"><template #heading><div class="flex items-center gap-2"><EntityAvatar size="xs" :label="group.name" /><span class="flex-1">{{ group.name }}</span><span class="normal-case tracking-normal text-xs text-muted-foreground/30">{{ group.models.length }}</span></div></template><CommandItem v-for="model in group.models" :key="model.id" :value="`model-${model.id}`" :class="['!pl-3', selectedModel === model.id && 'bg-foreground/[0.06]']" @select="selectedModel = model.id; commandPopoverOpen = false"><div class="min-w-0 flex-1 py-0.5"><div :class="['truncate text-sm leading-tight', selectedModel === model.id ? 'font-semibold text-foreground' : 'font-medium text-foreground/90']">{{ model.name }}</div><p class="mt-1 truncate text-xs leading-snug text-muted-foreground/55">{{ model.id }}</p></div><Tag v-if="model.free" variant="free">Free</Tag><Check v-if="selectedModel === model.id" class="shrink-0 text-foreground" /></CommandItem></CommandGroup></template><div v-if="(showOlderModels ? [...MODEL_PROVIDERS, ...MODEL_OLDER] : MODEL_PROVIDERS).flatMap(g => g.models).filter(m => !modelSearch || m.name.toLowerCase().includes(modelSearch.toLowerCase())).length === 0" class="py-8 text-center text-xs text-muted-foreground/50">No models found</div></CommandList><CommandFooter v-if="!modelSearch" role="button" tabindex="0" class="cursor-pointer select-none transition-colors hover:bg-foreground/[0.04] hover:text-foreground" @click="showOlderModels = !showOlderModels"><Eye class="size-3.5" /><span>{{ showOlderModels ? 'Hide older models' : 'Show older models' }}</span></CommandFooter></CommandPopoverContent></CommandPopover></TooltipProvider></template>
              <template v-else-if="child.id === 'pat-shortcuts'"><div class="max-w-md divide-y divide-border/60 rounded-2xl border border-border/60"><div v-for="row in SHORTCUT_ROWS" :key="row.label" class="flex items-center justify-between px-3 py-2.5"><span class="text-sm text-foreground">{{ row.label }}</span><KbdGroup><Kbd v-for="key in row.keys" :key="key">{{ key }}</Kbd></KbdGroup></div></div></template>
              <template v-else-if="child.id === 'pat-status-pill'"><div class="flex items-center gap-3"><DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline" size="sm" class="h-7 gap-1.5 px-2.5 text-xs font-medium"><component :is="taskStatus === 'planned' ? Circle : taskStatus === 'running' ? CircleDot : CheckCircle2" :class="['size-3.5', taskStatus === 'planned' ? 'text-muted-foreground/70' : taskStatus === 'running' ? 'text-blue-400' : 'text-emerald-500']" />{{ taskStatus === 'planned' ? 'Planned' : taskStatus === 'running' ? 'Running' : 'Completed' }}</Button></DropdownMenuTrigger><DropdownMenuContent align="start" class="w-44"><DropdownMenuLabel class="text-[10px] uppercase tracking-wider text-muted-foreground/60">Status</DropdownMenuLabel><DropdownMenuItem @click="taskStatus = 'planned'"><Circle class="size-3.5 text-muted-foreground/70" />Planned<Check v-if="taskStatus === 'planned'" class="ml-auto size-3" /></DropdownMenuItem><DropdownMenuItem @click="taskStatus = 'running'"><CircleDot class="size-3.5 text-blue-400" />Running<Check v-if="taskStatus === 'running'" class="ml-auto size-3" /></DropdownMenuItem><DropdownMenuItem @click="taskStatus = 'completed'"><CheckCircle2 class="size-3.5 text-emerald-500" />Completed<Check v-if="taskStatus === 'completed'" class="ml-auto size-3" /></DropdownMenuItem></DropdownMenuContent></DropdownMenu><Button variant="ghost" size="icon" class="size-6 rounded-md" :title="taskStatus"><component :is="taskStatus === 'planned' ? Circle : taskStatus === 'running' ? CircleDot : CheckCircle2" :class="['size-4', taskStatus === 'planned' ? 'text-muted-foreground/70' : taskStatus === 'running' ? 'text-blue-400' : 'text-emerald-500']" /></Button><span class="text-xs text-muted-foreground/50">← icon-only variant</span></div></template>
              <template v-else-if="child.id === 'pat-diff-view'"><div class="overflow-hidden rounded-2xl border border-border/60"><div class="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-3.5 py-2 text-xs"><FileCode2 class="size-3.5 text-muted-foreground/60" /><span class="font-mono text-foreground/75">src/lib/retry.ts</span><span class="ml-auto flex items-center gap-2 text-muted-foreground/50"><span class="text-emerald-500">+5</span><span class="text-destructive/70">−1</span></span></div><div class="grid grid-cols-2 divide-x divide-border/40 font-mono text-xs leading-[1.7]"><div class="overflow-x-auto"><div v-for="(line, i) in DIFF_BEFORE" :key="i" :class="['flex gap-3 px-3', DIFF_REMOVED.has(i) && 'bg-destructive/[0.07]']"><span class="w-4 shrink-0 select-none text-right text-muted-foreground/30">{{ i + 1 }}</span><span :class="['shrink-0 select-none', DIFF_REMOVED.has(i) ? 'text-destructive/70' : 'text-transparent']">{{ DIFF_REMOVED.has(i) ? '−' : ' ' }}</span><span class="whitespace-pre text-foreground/75">{{ line }}</span></div></div><div class="overflow-x-auto"><div v-for="(line, i) in DIFF_AFTER" :key="i" :class="['flex gap-3 px-3', DIFF_ADDED.has(i) && 'bg-emerald-500/[0.07]']"><span class="w-4 shrink-0 select-none text-right text-muted-foreground/30">{{ i + 1 }}</span><span :class="['shrink-0 select-none', DIFF_ADDED.has(i) ? 'text-emerald-500/80' : 'text-transparent']">{{ DIFF_ADDED.has(i) ? '+' : ' ' }}</span><span class="whitespace-pre text-foreground/75">{{ line }}</span></div></div></div></div></template>
              <template v-else-if="child.id === 'pat-terminal-output'"><div class="overflow-hidden rounded-2xl border border-border/70"><div class="flex h-10 items-center gap-2 border-b border-border/60 bg-muted/30 px-4"><Terminal class="size-4 text-muted-foreground" /><span class="text-sm font-medium text-foreground">Terminal</span><span class="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span class="size-1.5 rounded-full bg-emerald-500" />Connected</span></div><div class="h-[320px] overflow-y-auto bg-[#0f0f14] px-4 py-3 font-mono text-xs leading-[1.7]"><div class="whitespace-pre text-zinc-100">$ pnpm test --filter @kortix/ui</div><div class="whitespace-pre text-zinc-400">Scope: 1 of 14 workspace projects</div><div class="whitespace-pre text-zinc-400"> </div><div class="whitespace-pre text-zinc-400"> RUN  v2.1.4 packages/ui</div><div class="whitespace-pre text-zinc-400"> </div><div class="whitespace-pre text-emerald-400"> ✓ src/components/tool-call-card.test.tsx (4 tests) 18ms</div><div class="whitespace-pre text-emerald-400"> ✓ src/components/diff-view.test.tsx (6 tests) 31ms</div><div class="whitespace-pre text-red-400"> ✗ src/components/mention-textarea.test.tsx (1 test) 9ms</div><div class="whitespace-pre text-red-400">   → expected token "@sar" to resolve to "sarah-chen"</div><div class="whitespace-pre text-zinc-400"> </div><div class="whitespace-pre text-zinc-400"> Test Files  1 failed | 2 passed (3)</div><div class="whitespace-pre text-zinc-400">      Tests  1 failed | 9 passed (10)</div><div class="whitespace-pre text-zinc-400"> </div><div class="whitespace-pre text-zinc-100">$ </div><div class="flex items-center gap-1.5 text-zinc-100"><span> </span><span class="inline-block h-[14px] w-[7px] animate-pulse bg-zinc-100/80" /></div></div></div></template>
              <template v-else-if="child.id === 'pat-session-header'"><div class="relative h-14 overflow-hidden rounded-2xl border border-border/60 bg-card"><div class="absolute inset-0 flex items-center justify-between px-3"><div class="group flex min-w-0 items-center gap-1.5"><Input v-if="headerEditing" v-model="headerDraft" class="h-7 max-w-xs rounded-lg text-sm" @keydown.enter="headerTitle = headerDraft.trim() || headerTitle; headerEditing = false" @keydown.esc="headerDraft = headerTitle; headerEditing = false" @blur="headerTitle = headerDraft.trim() || headerTitle; headerEditing = false" /><template v-else><span class="truncate text-sm font-medium text-foreground">{{ headerTitle }}</span><button type="button" aria-label="Rename session" class="shrink-0 rounded-md p-1 text-muted-foreground/60 opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100" @click="headerDraft = headerTitle; headerEditing = true"><Pencil class="size-3.5" /></button></template></div><div class="flex shrink-0 items-center gap-1.5"><DropdownMenu><DropdownMenuTrigger as-child><Button variant="ghost" size="icon" class="size-8 text-muted-foreground hover:text-foreground"><MoreHorizontal class="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" class="w-44"><DropdownMenuItem @click="headerDraft = headerTitle; headerEditing = true"><Pencil class="size-4" />Rename…</DropdownMenuItem><DropdownMenuItem @click="shareDialogOpen = true"><Share2 class="size-4" />Share…</DropdownMenuItem><DropdownMenuItem><RotateCcw class="size-4" />Restart</DropdownMenuItem><DropdownMenuItem variant="destructive"><Trash2 class="size-4" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu><Button variant="ghost" size="icon" class="size-8 text-muted-foreground hover:text-foreground"><SlidersHorizontal class="size-4" /></Button></div></div></div></template>
              <template v-else-if="child.id === 'pat-share-dialog'"><Button variant="outline" @click="shareDialogOpen = true"><Share2 class="size-4" />Share session</Button><Dialog v-model:open="shareDialogOpen"><DialogContent class="sm:max-w-md"><DialogHeader><DialogTitle>Share session</DialogTitle><DialogDescription>Sessions are private to you by default. Share read/continue access with your team or specific members.</DialogDescription></DialogHeader><div class="py-1"><Label class="text-xs text-muted-foreground">Who can access this session</Label><RadioGroup v-model="shareMode" class="mt-2 space-y-1.5"><label v-for="opt in SHARE_VISIBILITY_OPTIONS" :key="opt.value" :class="['flex cursor-pointer items-center gap-3 rounded-2xl border p-2.5 transition-colors', shareMode === opt.value ? 'border-primary/50 bg-primary/[0.05]' : 'border-border/60 hover:bg-muted/40']"><RadioGroupItem :value="opt.value" class="sr-only" /><span :class="['flex size-8 shrink-0 items-center justify-center rounded-lg', shareMode === opt.value ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground']"><component :is="opt.icon" class="size-4" /></span><div class="min-w-0 flex-1"><div class="text-sm font-medium text-foreground">{{ opt.label }}</div><div class="text-xs text-muted-foreground">{{ opt.desc }}</div></div><Check v-if="shareMode === opt.value" class="size-4 shrink-0 text-primary" /></label></RadioGroup></div><DialogFooter><Button variant="outline" @click="shareDialogOpen = false">Cancel</Button><Button @click="shareDialogOpen = false">Save</Button></DialogFooter></DialogContent></Dialog></template>
              <template v-else-if="child.id === 'pat-command-palette-nav'"><Button variant="outline" @click="paletteOpen2 = true; palettePage = 'root'"><Search class="size-4" />Open palette<KbdGroup class="ml-2"><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup></Button><CommandDialog v-model:open="paletteOpen2" class="sm:max-w-[680px]" title="Command Palette" description="Drill-down command palette"><div v-if="palettePage !== 'root'" class="flex items-center gap-2 px-4 pb-0.5 pt-3"><button type="button" class="group -ml-1.5 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground/60 transition-colors hover:bg-foreground/[0.04] hover:text-foreground" @click="palettePage = 'root'"><ArrowLeft class="size-3 transition-transform group-hover:-translate-x-0.5" />Back</button><span class="text-xs text-muted-foreground/25">/</span><span class="text-xs font-medium tracking-[-0.005em] text-foreground/85">{{ palettePage === 'agents' ? 'Change Agent' : 'Change Model' }}</span></div><CommandInput placeholder="Type a command or search…" /><CommandList><template v-if="palettePage === 'root'"><CommandGroup heading="Suggestions"><CommandItem value="agent" @select="palettePage = 'agents'"><Bot class="size-4" /><span class="flex-1">Change agent</span><span class="text-xs text-muted-foreground/40">Default agent</span><ChevronRight class="size-3 text-muted-foreground/30" /></CommandItem><CommandItem value="model" @select="palettePage = 'models'"><Cpu class="size-4" /><span class="flex-1">Change model</span><span class="max-w-[160px] truncate text-xs text-muted-foreground/40">Claude Sonnet 4.6</span><ChevronRight class="size-3 text-muted-foreground/30" /></CommandItem><CommandItem value="jump" @select="paletteOpen2 = false"><MessageCircle class="size-4" /><span class="flex-1">Jump to message</span><ChevronRight class="size-3 text-muted-foreground/30" /></CommandItem><CommandItem value="new" @select="paletteOpen2 = false"><Plus class="size-4" /><span class="flex-1">New session</span><CommandShortcut>⌘N</CommandShortcut></CommandItem></CommandGroup><CommandGroup heading="Recent sessions"><CommandItem value="s1" @select="paletteOpen2 = false"><MessageCircle class="size-4 shrink-0" /><span class="flex-1 truncate">auth-rewrite: rotate refresh tokens</span><span class="text-xs font-medium text-primary/60">Current</span><span class="shrink-0 tabular-nums text-xs text-muted-foreground/30">2h ago</span></CommandItem><CommandItem value="s2" @select="paletteOpen2 = false"><MessageCircle class="size-4 shrink-0" /><span class="flex-1 truncate">fix(billing): webhook retries</span><span class="shrink-0 tabular-nums text-xs text-muted-foreground/30">1d ago</span></CommandItem><CommandItem value="s3" @select="paletteOpen2 = false"><MessageCircle class="size-4 shrink-0" /><span class="flex-1 truncate">docs: onboarding rewrite</span><span class="shrink-0 tabular-nums text-xs text-muted-foreground/30">3d ago</span></CommandItem></CommandGroup></template><CommandGroup v-else-if="palettePage === 'agents'" heading="Agents"><CommandItem value="default" @select="paletteOpen2 = false"><EntityAvatar size="xs" label="Default agent" /><span class="flex-1 truncate">Default agent</span><span class="max-w-[160px] truncate text-xs text-muted-foreground/40">General-purpose</span></CommandItem><CommandItem value="review" @select="paletteOpen2 = false"><EntityAvatar size="xs" label="Code reviewer" /><span class="flex-1 truncate">Code reviewer</span><span class="max-w-[160px] truncate text-xs text-muted-foreground/40">Reviews diffs &amp; PRs</span></CommandItem><CommandItem value="researcher" @select="paletteOpen2 = false"><EntityAvatar size="xs" label="Researcher" /><span class="flex-1 truncate">Researcher</span><span class="max-w-[160px] truncate text-xs text-muted-foreground/40">Web search &amp; synthesis</span></CommandItem></CommandGroup><CommandGroup v-else heading="Models"><CommandItem value="sonnet" @select="paletteOpen2 = false"><EntityAvatar size="xs" label="Anthropic" /><span class="flex-1 truncate">Claude Sonnet 4.6</span><span class="text-xs text-muted-foreground/40">Anthropic</span></CommandItem><CommandItem value="gpt" @select="paletteOpen2 = false"><EntityAvatar size="xs" label="OpenAI" /><span class="flex-1 truncate">GPT-5</span><span class="text-xs text-muted-foreground/40">OpenAI</span></CommandItem><CommandItem value="gemini" @select="paletteOpen2 = false"><EntityAvatar size="xs" label="Google" /><span class="flex-1 truncate">Gemini 2.5 Pro</span><span class="text-xs text-muted-foreground/40">Google</span></CommandItem></CommandGroup><CommandEmpty>No results found.</CommandEmpty></CommandList><CommandFooter><span class="flex items-center gap-1.5"><CommandKbd>↑</CommandKbd><CommandKbd>↓</CommandKbd> navigate</span><span class="flex items-center gap-1.5"><CommandKbd>↵</CommandKbd> select</span><span class="flex items-center gap-1.5"><CommandKbd>esc</CommandKbd> close</span></CommandFooter></CommandDialog></template>
              <template v-else-if="child.id === 'pat-notifications-bell'"><Popover v-model:open="notifBellOpen"><PopoverTrigger as-child><Button variant="ghost" size="sm" class="relative size-8 p-0 text-muted-foreground/60 hover:text-foreground" :aria-label="NOTIFICATION_ITEMS.filter(n => !notifLastSeen || n.at > notifLastSeen).length ? `${NOTIFICATION_ITEMS.filter(n => !notifLastSeen || n.at > notifLastSeen).length} unread notifications` : 'Notifications'"><Bell class="size-4" /><span v-if="NOTIFICATION_ITEMS.filter(n => !notifLastSeen || n.at > notifLastSeen).length" class="absolute -right-0.5 -top-0.5 inline-flex min-w-[14px] h-[14px] items-center justify-center rounded-full bg-destructive px-[3px] text-[9px] font-semibold leading-none tabular-nums text-destructive-foreground ring-2 ring-background">{{ NOTIFICATION_ITEMS.filter(n => !notifLastSeen || n.at > notifLastSeen).length }}</span></Button></PopoverTrigger><PopoverContent align="start" :side-offset="8" class="w-[400px] overflow-hidden border-border/60 p-0"><div class="flex h-10 items-center gap-2 border-b border-border/40 px-4"><Bell class="size-3.5 text-muted-foreground/55" /><span class="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/55">Notifications</span><span v-if="NOTIFICATION_ITEMS.filter(n => !notifLastSeen || n.at > notifLastSeen).length" class="tabular-nums text-[10px] text-muted-foreground/60">{{ NOTIFICATION_ITEMS.filter(n => !notifLastSeen || n.at > notifLastSeen).length }} new</span><Button variant="ghost" size="sm" class="ml-auto h-6 gap-1 px-2 text-[11px] text-muted-foreground/60 hover:text-foreground disabled:opacity-40" :disabled="!NOTIFICATION_ITEMS.filter(n => !notifLastSeen || n.at > notifLastSeen).length" @click="notifLastSeen = NOTIFICATION_ITEMS[0].at"><CheckCheck class="size-3" />Mark all read</Button></div><ul class="max-h-[420px] divide-y divide-border/30 overflow-y-auto"><li v-for="n in NOTIFICATION_ITEMS" :key="n.id"><button :class="['flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/25', (!notifLastSeen || n.at > notifLastSeen) && 'bg-primary/[0.04]']" @click="notifBellOpen = false"><div class="relative shrink-0"><EntityAvatar :label="n.actor" size="sm" /><span :class="['absolute -bottom-0.5 -right-0.5 inline-flex size-[14px] items-center justify-center rounded-full bg-background ring-1 ring-border/60', n.kind === 'mention' ? 'text-primary/80' : 'text-emerald-500/80']"><AtSign v-if="n.kind === 'mention'" class="size-2.5" /><UserPlus v-else class="size-2.5" /></span></div><div class="min-w-0 flex-1"><div class="flex items-baseline gap-1.5 text-[12px] text-foreground/85"><span class="max-w-[110px] truncate font-semibold">{{ n.actor }}</span><span class="truncate text-muted-foreground/70">{{ n.summary }}</span><span class="truncate text-muted-foreground/55">on {{ n.ticket }}</span></div><p v-if="n.message" class="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted-foreground/75">{{ n.message }}</p></div><div class="flex shrink-0 flex-col items-end gap-0.5"><span class="whitespace-nowrap tabular-nums text-[10px] text-muted-foreground/45">{{ n.when }}</span><span v-if="!notifLastSeen || n.at > notifLastSeen" class="size-1.5 rounded-full bg-primary" aria-label="unread" /></div></button></li></ul></PopoverContent></Popover></template>
              <template v-else-if="child.id === 'pat-notifications-settings'"><div class="max-w-md overflow-hidden rounded-2xl border border-border/60 bg-card"><div class="space-y-5 p-6"><div><h3 class="text-lg font-semibold">Notifications</h3><p class="mt-1 text-sm text-muted-foreground">Configure how and when you receive notifications.</p></div><div class="rounded-2xl border border-border/60"><div class="flex items-start justify-between gap-4 px-4 py-3"><div class="flex items-start gap-3"><Bell class="mt-0.5 size-4 text-muted-foreground" /><div><Label class="text-sm font-medium">Enable notifications</Label><p class="text-xs text-muted-foreground">Browser permission granted</p></div></div><Switch v-model="notifEnabled" /></div></div><div v-if="notifEnabled" class="space-y-4"><div><h4 class="mb-3 text-sm font-medium">Notification types</h4><div class="divide-y divide-border/60 rounded-2xl border border-border/60"><div v-for="row in NOTIFICATION_TOGGLE_ROWS" :key="row.label" class="flex items-start justify-between gap-4 px-4 py-3"><div class="flex items-start gap-3"><component :is="row.icon" class="mt-0.5 size-4 text-muted-foreground" /><div><Label class="text-sm font-medium">{{ row.label }}</Label><p class="text-xs text-muted-foreground">{{ row.desc }}</p></div></div><Switch :model-value="row.label !== 'Permission requests'" /></div></div></div><div><h4 class="mb-3 text-sm font-medium">Behavior</h4><div class="divide-y divide-border/60 rounded-2xl border border-border/60"><div v-for="row in NOTIFICATION_BEHAVIOR_ROWS" :key="row.label" class="flex items-start justify-between gap-4 px-4 py-3"><div class="flex items-start gap-3"><component :is="row.icon" class="mt-0.5 size-4 text-muted-foreground" /><div><Label class="text-sm font-medium">{{ row.label }}</Label><p class="text-xs text-muted-foreground">{{ row.desc }}</p></div></div><Switch :model-value="false" /></div></div></div><Button variant="outline" size="sm" @click="toast.message('Test notification sent')">Send test notification</Button></div></div></div></template>
              <template v-else-if="child.id === 'pat-wallpaper-picker'"><div class="grid max-w-xl grid-cols-3 gap-2"><button v-for="wp in WALLPAPER_ITEMS" :key="wp.id" type="button" class="group relative cursor-pointer rounded-2xl text-left" @click="wallpaperId = wp.id"><div :class="['relative aspect-video w-full overflow-hidden rounded-2xl border bg-background transition-colors', wallpaperId === wp.id ? 'border-primary' : 'border-border group-hover:border-border/80']"><template v-if="wp.id === 'brandmark'"><div class="absolute inset-0 flex items-center justify-center bg-background"><div class="size-[140%] rounded-full border-[16px] border-foreground/[0.06]" /></div></template><template v-else-if="wp.id === 'symbol'"><div class="absolute inset-0 flex items-center justify-center bg-background"><div class="size-10 rounded-xl bg-foreground/[0.08]" /></div></template><template v-else-if="wp.id === 'aurora'"><div class="absolute inset-0 bg-[#0b0b0c]" :style="{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(168,85,247,.35), transparent 55%), radial-gradient(circle at 70% 65%, rgba(56,189,248,.3), transparent 55%)' }" /></template><template v-else-if="wp.id === 'nebula'"><div class="absolute inset-0 bg-[#0b0b0c]" :style="{ backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,.08) 0 2px, transparent 2px 14px)' }" /></template><template v-else-if="wp.id === 'ascii-tunnel'"><div class="absolute inset-0 flex items-center justify-center bg-black font-mono text-[8px] leading-[10px] text-emerald-400/50 overflow-hidden tracking-widest"><span>./. -:+*#%@*+:-. ./. -:+*#%@*+:-.</span></div></template><template v-else-if="wp.id === 'matrix'"><div class="absolute inset-0 bg-black" :style="{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(16,185,129,.35) 0 1px, transparent 1px 8px)' }" /></template><div :class="['absolute inset-0 pointer-events-none transition-colors duration-200', wallpaperId !== wp.id && 'group-hover:bg-foreground/[0.06]']" /><div v-if="wallpaperId === wp.id" class="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary shadow-md"><Check class="size-2.5 text-primary-foreground" /></div></div><div class="px-1.5 py-1"><span class="flex items-center gap-1 text-xs font-medium text-foreground">{{ wp.name }}<span v-if="wp.def" class="rounded-full bg-muted px-1 py-px text-xs text-muted-foreground">Default</span></span></div></button></div></template>
              <template v-else-if="child.id === 'pat-agent-avatar'"><div class="space-y-5"><div><p class="mb-2.5 text-xs text-muted-foreground">Agents — hue + icon, fixed saturation/lightness</p><div class="flex flex-wrap items-center gap-3"><div v-for="a in AGENT_AVATAR_ITEMS" :key="a.slug" class="flex items-center gap-2 rounded-full border border-border/50 bg-muted/20 py-1 pl-1 pr-3"><span class="inline-flex size-[26px] shrink-0 items-center justify-center rounded-full" :style="{ backgroundColor: agentColorsFor(a.hue).bg, color: agentColorsFor(a.hue).fg, boxShadow: `inset 0 0 0 1px ${agentColorsFor(a.hue).ring}` }"><component :is="a.icon" class="size-[15px]" /></span><span class="text-xs text-foreground/80">@{{ a.slug }}</span></div></div></div><div><p class="mb-2.5 text-xs text-muted-foreground">Users — handle-derived hue (hashHue), initials fallback</p><div class="flex flex-wrap items-center gap-3"><div v-for="u in MENTION_USER_HANDLES" :key="u" class="flex items-center gap-2 rounded-full border border-border/50 bg-muted/20 py-1 pl-1 pr-3"><span class="inline-flex size-[26px] shrink-0 items-center justify-center rounded-full font-semibold leading-none text-[11px]" :style="{ backgroundColor: agentColorsFor(hashHue(u)).bg, color: agentColorsFor(hashHue(u)).fg, boxShadow: `inset 0 0 0 1px ${agentColorsFor(hashHue(u)).ring}` }">{{ u.charAt(0).toUpperCase() }}</span><span class="text-xs text-foreground/80">@{{ u }}</span></div></div></div><div><p class="mb-2.5 text-xs text-muted-foreground">Size scale (xs · sm · md · lg)</p><div class="flex items-center gap-3"><span v-for="s in [16, 20, 24, 32]" :key="s" class="inline-flex shrink-0 items-center justify-center rounded-full" :style="{ width: s + 'px', height: s + 'px', backgroundColor: agentColorsFor(210).bg, color: agentColorsFor(210).fg, boxShadow: `inset 0 0 0 1px ${agentColorsFor(210).ring}` }"><Bot :style="{ width: (s * 0.58) + 'px', height: (s * 0.58) + 'px' }" /></span></div></div></div></template>
              <template v-else-if="child.id === 'pat-mention-textarea'"><div class="max-w-lg space-y-2"><Popover v-model:open="mentionMenuOpen"><PopoverTrigger as-child><div class="rounded-2xl border border-border bg-card px-3.5 py-3 transition-colors focus-within:border-foreground/20"><textarea v-model="mentionText" rows="3" class="w-full resize-none border-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground" @keyup="($event.key === '@') && (mentionMenuOpen = true)" /></div></PopoverTrigger><PopoverContent align="start" class="w-64 p-1.5"><p class="px-2 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/55">Mention someone</p><div class="space-y-0.5"><button v-for="m in MENTION_AUTOCOMPLETE_HANDLES" :key="m.slug" type="button" class="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-foreground/[0.05]" @click="mentionText = mentionText.slice(0, mentionText.lastIndexOf('@') >= 0 ? mentionText.lastIndexOf('@') : mentionText.length) + '@' + m.slug + ' '; mentionMenuOpen = false"><span class="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold" :style="{ backgroundColor: agentColorsFor(m.hue).bg, color: agentColorsFor(m.hue).fg, boxShadow: `inset 0 0 0 1px ${agentColorsFor(m.hue).ring}` }"><component v-if="m.icon" :is="m.icon" class="size-3.5" /><template v-else>{{ m.slug.charAt(0).toUpperCase() }}</template></span><span class="text-foreground/85">@{{ m.slug }}</span><Badge v-if="m.kind === 'agent'" variant="outline" size="sm" class="ml-auto">Agent</Badge></button></div></PopoverContent></Popover><Button variant="outline" size="sm" @click="mentionMenuOpen = true"><AtSign class="size-3.5" />Mention someone</Button></div></template>
              <template v-else-if="child.id === 'pat-session-sidebar'"><div :class="['flex h-[420px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-muted/10 transition-[width] duration-200', sidebarCollapsed ? 'w-[68px]' : 'w-[260px]']"><div class="flex h-12 shrink-0 items-center justify-between px-3"><EntityAvatar v-if="!sidebarCollapsed" label="Suna" size="sm" /><button type="button" :aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'" :class="['flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground', sidebarCollapsed && 'mx-auto']" @click="sidebarCollapsed = !sidebarCollapsed"><ChevronRight :class="['size-3.5 transition-transform', !sidebarCollapsed && 'rotate-180']" /></button></div><nav class="shrink-0 space-y-0.5 px-2.5 pb-2"><button v-for="row in SIDEBAR_ACTION_ROWS" :key="row.label" type="button" :title="sidebarCollapsed ? row.label : undefined" :class="['group/row flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium text-foreground/80 transition-colors hover:bg-muted/60', sidebarCollapsed && 'justify-center px-0']"><span class="shrink-0 text-foreground/70"><component :is="row.icon" class="size-4" /></span><template v-if="!sidebarCollapsed"><span class="flex-1 truncate">{{ row.label }}</span><span v-if="row.kbd" class="flex items-center gap-0.5 rounded-md border border-border/50 bg-muted/40 px-1 py-px font-mono text-[10px] text-muted-foreground/60">{{ row.kbd }}</span></template></button></nav><div class="min-h-0 flex-1 overflow-y-auto px-2.5 pb-2.5"><p v-if="!sidebarCollapsed" class="flex items-center gap-1.5 px-2.5 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45"><ListTree class="size-3" /> Sessions</p><ul class="space-y-0.5"><li v-for="s in SIDEBAR_SESSION_ITEMS" :key="s.id"><button type="button" :title="sidebarCollapsed ? s.name : undefined" :class="['flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors', sidebarCollapsed && 'justify-center px-0', sidebarActiveSession === s.id ? 'border-l-2 border-l-primary bg-primary/[0.05] text-foreground' : 'border-l-2 border-l-transparent text-muted-foreground/75 hover:bg-muted/50 hover:text-foreground']" @click="sidebarActiveSession = s.id"><MessageCircle class="size-3.5 shrink-0" /><template v-if="!sidebarCollapsed"><span class="flex-1 truncate">{{ s.name }}</span><span class="shrink-0 tabular-nums text-[10px] text-muted-foreground/40">{{ s.when }}</span></template></button></li></ul></div><div class="shrink-0 border-t border-border/50 px-2.5 py-2.5"><button type="button" :title="sidebarCollapsed ? 'History' : undefined" :class="['group/row flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium text-foreground/80 transition-colors hover:bg-muted/60', sidebarCollapsed && 'justify-center px-0']"><span class="shrink-0 text-foreground/70"><History class="size-4" /></span><span v-if="!sidebarCollapsed" class="flex-1 truncate">History</span></button></div></div></template>
              <template v-else-if="child.id === 'pat-file-tree'"><div class="overflow-hidden rounded-2xl border border-border/70 bg-card"><div class="flex h-11 items-center gap-2.5 border-b border-border/60 bg-muted/30 px-4"><span class="flex size-5 items-center justify-center rounded-md bg-foreground text-[10px] font-semibold text-background">K</span><span class="text-sm font-medium text-foreground">kortix-ui</span><span class="inline-flex items-center gap-1 rounded-full border border-border/70 px-2 py-0.5 text-xs text-muted-foreground"><GitBranch class="size-3" />main</span></div><div class="grid h-[420px] grid-cols-[200px_minmax(0,1fr)]"><div class="overflow-y-auto border-r border-border/60 bg-muted/[0.18] p-2"><button v-for="f in fileTreeItems" :key="f.selfPath" :class="['group flex w-full cursor-pointer items-center gap-1.5 rounded-lg py-1 pr-2 text-left text-sm transition-colors', fileTreeSelected === f.path ? 'bg-primary/[0.07] text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground']" :style="{ paddingLeft: `${f.depth * 14 + 8}px` }" @click="f.dir ? toggleDir(f.selfPath) : (f.path && (fileTreeSelected = f.path))"><ChevronRight v-if="f.dir" :class="['size-3.5 shrink-0 text-muted-foreground/60 transition-transform', fileTreeExpanded.has(f.selfPath) && 'rotate-90']" /><span v-else class="w-3.5 shrink-0" /><component :is="f.dir ? (fileTreeExpanded.has(f.selfPath) ? FolderOpen : Folder) : f.name.endsWith('.json') ? FileJson : f.name.endsWith('.md') ? FileText : FileCode2" class="size-4 shrink-0" /><span class="truncate">{{ f.name }}</span></button></div><div class="flex min-w-0 flex-col overflow-hidden"><div class="flex items-center gap-1.5 border-b border-border/50 px-4 py-2 text-xs text-muted-foreground/70"><span v-for="(seg, i) in fileTreeSelected.split('/')" :key="i" class="flex items-center gap-1.5"><span v-if="i > 0" class="text-muted-foreground/30">/</span><span :class="i === fileTreeSelected.split('/').length - 1 ? 'font-medium text-foreground/80' : ''">{{ seg }}</span></span></div><div class="flex-1 overflow-auto p-4 font-mono text-xs leading-[1.7] text-foreground/75"><div v-for="(line, i) in (FILE_TREE_PREVIEW[fileTreeSelected] ?? ['// ' + fileTreeSelected.split('/').pop(), '', '(preview not mocked for this file)'])" :key="i" class="flex gap-3"><span class="w-4 shrink-0 select-none text-right text-muted-foreground/30">{{ i + 1 }}</span><span class="whitespace-pre">{{ line }}</span></div></div></div></div></div></template>
              <template v-else-if="child.id === 'pat-tab-bar'"><div class="overflow-hidden rounded-2xl border border-border/70 bg-card"><div class="flex h-[38px] items-center border-b border-border/60 bg-muted/20 pl-1 pr-2"><div class="flex h-full flex-1 items-center gap-0.5 overflow-x-auto scrollbar-hide"><button v-for="tab in DEMO_FILE_TABS" :key="tab.id" type="button" :class="['group relative flex h-full cursor-pointer items-center gap-1.5 rounded-t-lg px-3 text-sm transition-colors', demoActiveTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground']" @click="demoActiveTab = tab.id"><component :is="tab.icon" class="size-3.5 shrink-0 text-muted-foreground/70" /><span class="max-w-[140px] truncate">{{ tab.label }}</span><X class="size-3.5 shrink-0 rounded text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/60 hover:bg-muted" /><span v-if="demoActiveTab === tab.id" class="absolute -bottom-px left-2 right-2 h-[2px] bg-foreground/80" /></button></div><span class="inline-flex items-center gap-1 rounded-full border border-border/70 px-2 py-0.5 text-xs text-muted-foreground"><GitBranch class="size-3" />main</span></div><div class="grid h-[340px] grid-cols-[minmax(0,1fr)_320px]"><div class="flex flex-col gap-2 overflow-hidden border-r border-border/60 p-4"><div class="text-sm font-medium text-foreground">{{ DEMO_FILE_TABS.find(t => t.id === demoActiveTab)?.label }}</div><div class="flex-1 space-y-1.5 overflow-hidden font-mono text-xs leading-[1.7] text-muted-foreground/70"><div>export function ResizableSessionLayout({ children, side }) {</div><div class="pl-4">const mainRef = useRef(null);</div><div class="pl-4">const sideRef = useRef(null);</div><div class="pl-4 text-muted-foreground/40">// … resizable panel group + handle</div><div>}</div></div></div><div class="flex flex-col overflow-hidden"><div class="flex items-center gap-4 border-b border-border/50 px-4 pt-2.5"><button v-for="t in DEMO_SIDE_PANEL_TABS" :key="t" type="button" :class="['relative cursor-pointer pb-2.5 text-sm transition-colors', demoSidePanelTab === t ? 'text-foreground' : 'text-muted-foreground hover:text-foreground']" @click="demoSidePanelTab = t as any">{{ t.charAt(0).toUpperCase() + t.slice(1) }}<span v-if="demoSidePanelTab === t" class="absolute -bottom-px left-0 right-0 h-[2px] bg-foreground/80" /></button></div><div class="flex flex-1 items-center justify-center p-4 text-center text-sm text-muted-foreground"><span v-if="demoSidePanelTab === 'terminal'" class="inline-flex items-center gap-2"><Terminal class="size-4" />Terminal panel mock</span><span v-else-if="demoSidePanelTab === 'files'" class="inline-flex items-center gap-2"><Folder class="size-4" />File browser mock</span><span v-else-if="demoSidePanelTab === 'browser'" class="inline-flex items-center gap-2"><Globe class="size-4" />Browser preview mock</span><span v-else-if="demoSidePanelTab === 'actions'" class="inline-flex items-center gap-2"><ListTree class="size-4" />Actions timeline mock</span></div></div></div></div></template>
              <template v-else-if="child.id === 'pat-new-session'"><div class="relative flex h-[460px] w-full flex-col overflow-hidden rounded-2xl border border-border/60" style="background-color: var(--new-session-bg)"><div class="pointer-events-none absolute inset-0 z-0 opacity-40" aria-hidden style="background-image: radial-gradient(circle, var(--new-session-dot) 1px, transparent 1px); background-size: 22px 22px; mask-image: radial-gradient(ellipse 60% 50% at 50% 30%, black 0%, transparent 70%); -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 30%, black 0%, transparent 70%)" /><div class="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center"><EntityAvatar label="Suna" size="xl" class="shadow-sm" /><h1 class="mt-5 text-2xl font-semibold tracking-tight text-foreground">Suna</h1></div><div class="relative z-10 mx-auto w-full max-w-[40rem] px-4 pb-6"><div class="flex items-center gap-1.5"><Button variant="ghost" size="icon-sm" aria-label="Previous suggestions" :disabled="newSessionAtStart" class="shrink-0 text-muted-foreground hover:bg-accent hover:text-foreground" @click="newSessionScrollEl?.scrollBy({ left: -(newSessionScrollEl.clientWidth * 0.7), behavior: 'smooth' })"><ChevronLeft class="size-3.5" /></Button><div :ref="(el) => { newSessionScrollEl = el as HTMLElement | null }" class="scrollbar-hide flex flex-1 items-center gap-2 overflow-x-auto" style="mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent)" @scroll="(e) => { const el = e.currentTarget as HTMLElement; newSessionAtStart = el.scrollLeft <= 4; newSessionAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4 }"><button v-for="p in NEW_SESSION_SUGGESTIONS" :key="p.id" type="button" class="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs text-foreground/70 backdrop-blur-sm transition-colors hover:border-border hover:bg-background hover:text-foreground" @click="newSessionText = p.label + ' for our team'"><component :is="p.icon" class="size-3.5" />{{ p.label }}</button></div><Button variant="ghost" size="icon-sm" aria-label="More suggestions" :disabled="newSessionAtEnd" class="shrink-0 text-muted-foreground hover:bg-accent hover:text-foreground" @click="newSessionScrollEl?.scrollBy({ left: newSessionScrollEl.clientWidth * 0.7, behavior: 'smooth' })"><ChevronRight class="size-3.5" /></Button></div><div class="mt-2.5 w-full overflow-visible rounded-[24px] border border-border bg-card transition-colors focus-within:border-foreground/20"><div class="flex flex-col gap-2"><div class="px-3.5"><textarea v-model="newSessionText" placeholder="Describe a task to start a session…" rows="1" class="relative max-h-[200px] min-h-[72px] w-full resize-none border-none bg-transparent px-0.5 pb-6 pt-4 text-sm leading-relaxed outline-none placeholder:text-muted-foreground" /></div><div class="mb-1.5 flex items-center justify-between gap-1 pl-2 pr-1.5"><button type="button" aria-label="Sandbox template" class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/50"><Package class="size-3.5" /><span class="max-w-[10rem] truncate">Default</span><span class="size-1.5 rounded-full bg-emerald-500" /></button><Button size="sm" :disabled="!newSessionText.trim()" aria-label="Start session" class="size-8 shrink-0 rounded-full p-0" @click="if (newSessionText.trim()) { toast.success('Session started'); newSessionText = '' }"><ArrowUp class="size-4" /></Button></div></div></div></div></div></template>
              <template v-else><div /></template>
            </div></div></section>
          <section id="patterns"><div class="mt-14 border-t border-border/50 pt-8" /><h2 class="mb-5 text-xs uppercase tracking-widest text-muted-foreground">Primitives</h2><p class="mb-8 text-base leading-relaxed text-muted-foreground">Small composition pieces used inside project pages, issue details, and other structured internal surfaces that don't fit the hero + list shape.</p>
            <div id="pat-page-shell" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">PageShell</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">The one layout wrapper. Standardises max-width, horizontal padding, and scroll behavior. Four width presets: <code class="font-mono text-xs">reading (720)</code>, <code class="font-mono text-xs">default (1000)</code>, <code class="font-mono text-xs">wide (1280)</code>, <code class="font-mono text-xs">full</code>.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="rounded-2xl border border-dashed border-border/60 py-10 text-center text-xs text-muted-foreground"><code>&lt;PageShell width=&quot;default&quot;&gt; ... &lt;/PageShell&gt;</code><div class="mt-1 opacity-60">max-w-[1000px] · px-6 lg:px-10 · py-10</div></div></div></div>
            <div id="pat-section" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Section</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Labelled section inside a PageShell. Uppercase micro-label, optional trailing action, opinionated top margin between siblings. No box, no chrome - typography and whitespace do the work.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><BrandSection label="About"><p class="text-sm leading-relaxed text-foreground">Description content lives here. Sections separate concerns on a page without ever drawing a card.</p></BrandSection><BrandSection label="Details"><template #action><Button variant="ghost" size="sm" class="h-6 px-2 text-xs">Edit</Button></template><p class="text-sm text-muted-foreground">A second section with a trailing action.</p></BrandSection></div></div>
            <div id="pat-section-card" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">SectionCard</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">The one panel pattern. Composes the design-system Card (rounded-2xl) and adds the divided header every settings/list surface needs: title, muted count, description, trailing action. Use <code>flush</code> to seat a List edge-to-edge, and <code>tone=&quot;destructive&quot;</code> for danger zones - no separate component. A danger zone stays calm: a neutral panel with a faint warm edge and a <strong>neutral</strong> trigger. Red is the brake, not the paint - it shows up only on the final confirm button, never on the panel.</p><div class="space-y-4 rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><SectionCard title="Members" :count="2" description="People with access to this account."><template #action><Button size="sm" class="h-8 px-3 text-sm">Invite</Button></template><p class="text-sm text-muted-foreground">Body content sits in the padded region. Pass <code>flush</code> to drop the padding for a List.</p></SectionCard><SectionCard tone="destructive" title="Danger zone" description="Irreversible actions live here."><div class="flex items-center justify-between gap-4"><div class="min-w-0"><p class="text-sm font-medium text-foreground">Delete this account</p><p class="mt-0.5 text-xs text-muted-foreground">Permanently removes the account and all its data.</p></div><Button variant="outline" size="sm" class="shrink-0">Delete</Button></div></SectionCard></div></div>
            <div id="pat-avatars" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Avatars</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">One rule: <strong>people are round, things are square</strong>. <code>UserAvatar</code> renders a circular avatar for a person - the supabase profile picture when present, otherwise <strong>neutral monochrome initials</strong>. <code>EntityAvatar</code> renders a rounded-square tile for accounts, projects, groups and other non-person entities - an initial or an icon. Both share the same neutral material and size scale so they align on a row.</p><div class="space-y-5 rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="flex items-center gap-4"><span class="w-24 text-xs uppercase tracking-wider text-muted-foreground">People</span><UserAvatar email="ada@kortix.ai" name="Ada Lovelace" size="sm" /><UserAvatar email="grace@kortix.ai" name="Grace Hopper" /><UserAvatar email="alan@kortix.ai" name="Alan Turing" size="lg" /></div><div class="flex items-center gap-4"><span class="w-24 text-xs uppercase tracking-wider text-muted-foreground">Things</span><EntityAvatar label="Acme AGI" size="sm" /><EntityAvatar label="Kortix" /><EntityAvatar :icon="FolderGit2" /><EntityAvatar :icon="Users" size="lg" /></div></div></div>
            <div id="pat-list" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">List & ListRow</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">The standard list. A divider-separated <code>List</code> of <code>ListRow</code>s, each with a leading avatar slot, a title with inline badges, a subtitle, and a trailing slot. Drop it inside a <code>SectionCard flush</code>.</p><div class="rounded-2xl bg-card/30 p-0 ring-1 ring-border/50"><SectionCard title="Members" :count="2" flush><List><ListRow><template #leading><UserAvatar email="grace@kortix.ai" name="Grace Hopper" /></template><template #title>grace@kortix.ai</template><template #badges><Badge variant="outline" size="sm">You</Badge></template><template #subtitle><InlineMeta><span>Joined Mar 3, 2026</span><span>4 projects</span></InlineMeta></template><template #trailing><Badge variant="outline" size="sm" class="border-foreground/30 text-foreground">Owner</Badge></template></ListRow><ListRow><template #leading><UserAvatar email="alan@kortix.ai" name="Alan Turing" /></template><template #title>alan@kortix.ai</template><template #subtitle><InlineMeta><span>Joined Apr 1, 2026</span></InlineMeta></template><template #trailing><Badge variant="outline" size="sm">Member</Badge></template></ListRow></List></SectionCard></div></div>
            <div id="pat-definition-list" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">DefinitionList</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Key/value pairs. Fixed-width label column so values align vertically. Optional dividers for a Linear-style meta list.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><DefinitionList dividers><DefinitionRow label="Path"><code class="font-mono text-xs text-foreground">/workspace/jjk-domain-search</code></DefinitionRow><DefinitionRow label="Created">2 days ago</DefinitionRow><DefinitionRow label="Updated"><span class="tabular-nums">3m ago</span></DefinitionRow><DefinitionRow label="Sessions">8</DefinitionRow></DefinitionList></div></div>
            <div id="pat-inline-meta" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">InlineMeta</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Dot-separated facts. Drop any number of children - falsy ones are skipped. Used in page headers, row subtitles, card footers.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><InlineMeta><span class="font-mono text-foreground">/workspace/jjk</span><span>24 issues</span><span>created 2d ago</span><span>8 sessions</span></InlineMeta></div></div>
            <div id="pat-empty-state" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">EmptyState</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">The calm teaching moment. Icon, headline, one-line description, up to two actions. Used for zero-state views across every list and detail page.</p><div class="rounded-2xl bg-card/30 p-0 ring-1 ring-border/50"><EmptyState :icon="Inbox" title="No issues yet"><template #description>Create your first issue with C, or import from a session.</template><template #action><Button size="sm" class="h-8 px-4 text-sm">New issue</Button></template><template #secondaryAction><Button variant="ghost" size="sm" class="h-8 px-3 text-sm">Learn more</Button></template></EmptyState></div></div>
            <div id="pat-info-banner" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">InfoBanner</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">An inline status / info notice - manifest status, a skipped email, a tip. Semantic <code>tone</code> (neutral / info / success / warning / destructive) instead of hand-rolled tinted borders. Icon + optional title + body + trailing action.</p><div class="space-y-3 rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><InfoBanner tone="info" :icon="Info" title="Heads up">The manifest is being re-synced - secrets apply in a moment.</InfoBanner><InfoBanner tone="warning" :icon="TriangleAlert" title="Email skipped">Mailtrap isn't configured locally. Copy the invite link to share it.</InfoBanner><InfoBanner tone="success" :icon="Check" title="All set"><template #action><Button size="sm" variant="ghost" class="h-7 px-2 text-xs">Dismiss</Button></template>Your repository is connected.</InfoBanner></div></div>
            <div id="pat-status" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Status (Dot, Badge & DiffStat)</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">The single source of truth for this means success / warning / error / info coloring. Chips use <code>Badge</code>, boxes use <code>InfoBanner</code> - for the cases a component can't cover reach for <code>StatusDot</code>, <code>DiffStat</code>, or the status maps instead of re-inlining <code>text-emerald-500</code>.</p><div class="flex flex-col gap-4 rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><div class="flex flex-wrap items-center gap-4 text-sm"><span class="inline-flex items-center gap-1.5"><StatusDot tone="success" />Idle</span><span class="inline-flex items-center gap-1.5"><StatusDot tone="success" pulse />Running</span><span class="inline-flex items-center gap-1.5"><StatusDot tone="warning" />Warning</span><span class="inline-flex items-center gap-1.5"><StatusDot tone="destructive" />Error</span><span class="inline-flex items-center gap-1.5"><StatusDot tone="info" />Info</span></div><div class="flex items-center gap-4 text-sm"><DiffStat :additions="42" :deletions="7" /><DiffStat :additions="12" /><DiffStat :deletions="3" /></div><div class="flex flex-wrap items-center gap-2"><StatusBadge tone="success">3 passed</StatusBadge><StatusBadge tone="warning">5 warnings</StatusBadge><StatusBadge tone="destructive">2 errors</StatusBadge><StatusBadge tone="info">Modified</StatusBadge><StatusBadge tone="neutral">Idle</StatusBadge></div><p class="text-xs text-muted-foreground">Use <code>StatusBadge</code> for informational status (faint, incl. red). <code>Badge variant=&quot;destructive&quot;</code> is a solid red pill - reserve it for actions, not status.</p></div></div>
            <div id="pat-confirm-dialog" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">ConfirmDialog</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Reusable confirmation dialog for destructive actions - delete, revoke, disable. Wraps <code>AlertDialog</code> with a consistent title/description/confirm pattern.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><Button variant="outline" @click="confirmOpen = true">Delete project...</Button><ConfirmDialog v-model:open="confirmOpen" title="Delete project" confirm-label="Delete" confirm-variant="destructive" @confirm="handleConfirm"><template #description>This will permanently delete the project and all of its data. This action cannot be undone.</template></ConfirmDialog></div></div>
            <div id="pat-submit-button" class="mb-12"><h3 class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">SubmitButton</h3><p class="mb-4 text-sm leading-relaxed text-muted-foreground">Form submit button wired to a server action via <code>useFormStatus</code> / <code>useActionState</code>, with built-in pending state and inline error display.</p><div class="rounded-2xl bg-card/30 p-6 ring-1 ring-border/50"><form class="max-w-xs"><SubmitButton pending-text="Saving...">Save changes</SubmitButton></form></div></div>
          </section>
          <section id="anti-patterns"><div class="mt-14 border-t border-border/50 pt-8" /><h2 class="mb-5 text-xs uppercase tracking-widest text-muted-foreground">Anti-Patterns</h2><p class="mb-8 text-base leading-relaxed text-muted-foreground">Code patterns that violate the design system. Follow these rules to maintain consistency, accessibility, and performance across the codebase.</p><div class="space-y-6"><div v-for="item in antiPatterns" :key="item.title" class="rounded-2xl border border-border/60 bg-card/30 p-5"><h3 class="text-sm font-semibold text-foreground">{{ item.title }}</h3><p class="mt-1 text-sm text-muted-foreground">{{ item.description }}</p><div class="mt-4 grid gap-3 md:grid-cols-2"><pre class="overflow-x-auto rounded-lg border border-destructive/20 bg-destructive/[0.04] p-3 text-xs text-muted-foreground"><code>{{ item.bad }}</code></pre><pre class="overflow-x-auto rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-xs text-muted-foreground"><code>{{ item.good }}</code></pre></div></div></div></section>
          <section id="usage"><div class="mt-14 border-t border-border/50 pt-8" /><h2 class="mb-5 text-xs uppercase tracking-widest text-muted-foreground">Usage</h2><div class="grid gap-10 md:grid-cols-2"><div><p class="mb-4 text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Do</p><div v-for="item in usageDo" :key="item" class="flex items-start gap-2.5 border-b border-border/30 py-2"><span class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Check class="size-2.5" /></span><span class="text-sm text-muted-foreground">{{ item }}</span></div></div><div><p class="mb-4 text-xs uppercase tracking-widest text-red-600 dark:text-red-400">Don't</p><div v-for="item in usageDont" :key="item" class="flex items-start gap-2.5 border-b border-border/30 py-2"><span class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400"><X class="size-2.5" /></span><span class="text-sm text-muted-foreground">{{ item }}</span></div></div></div></section>
        </div>
      </div>
    </div>
    <Dialog :open="providerModalOpen" @update:open="closeProviderModal">
      <DialogContent class="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader v-if="providerView.type === 'list'" class="border-b border-border/60 px-6 pb-4 pt-6">
          <DialogTitle>Connect a provider</DialogTitle>
          <DialogDescription>Add credentials to unlock more models in the picker.</DialogDescription>
        </DialogHeader>
        <div v-else class="flex items-center gap-2 border-b border-border/60 px-4 py-3">
          <Button type="button" variant="ghost" size="icon-sm" class="-ml-1.5" @click="handleProviderBack">
            <ArrowLeft class="h-4 w-4" />
          </Button>
          <h3 class="flex-1 text-sm font-medium text-foreground">
            {{ providerView.type === 'custom' ? 'Add Custom Provider' : 'Connect ' + selectedProvider?.name }}
          </h3>
        </div>

        <div v-if="providerView.type === 'list'" class="max-h-[60vh] space-y-1 overflow-y-auto px-3 pb-4 pt-3">
          <div class="relative pb-1">
            <Search class="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              v-model="providerSearch"
              placeholder="Search providers..."
              class="h-9 rounded-xl border-border/50 bg-muted/20 pl-9 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-ring/40"
            />
          </div>

          <div class="space-y-1">
            <button
              v-for="provider in filteredPopularProviders"
              :key="provider.id"
              type="button"
              class="group flex h-auto w-full cursor-pointer items-center gap-3 rounded-2xl border border-border/50 bg-muted/20 px-3.5 py-2.5 text-left transition-colors hover:bg-muted/35"
              @click="connectProvider(provider)"
            >
              <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800" aria-hidden="true">
                <img v-if="providerIcons[provider.id]" :src="providerIcons[provider.id]" alt="" width="18" height="18" class="object-contain dark:invert" />
                <span v-else class="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">{{ providerInitials(provider.name) }}</span>
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="truncate text-sm font-medium text-foreground">{{ provider.name }}</span>
                  <span v-if="provider.connected" class="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-px text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span class="h-1 w-1 rounded-full bg-emerald-500" />
                    connected
                  </span>
                </div>
                <div class="mt-0.5 truncate text-xs text-muted-foreground/60">{{ provider.desc }}</div>
              </div>
              <ChevronRight class="ml-auto h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
            </button>
          </div>

          <Accordion v-if="filteredMoreProviders.length" type="single" collapsible :model-value="providerOtherOpen ? 'other' : undefined" @update:model-value="providerOtherOpen = $event === 'other'">
            <AccordionItem value="other" class="border-none">
              <AccordionTrigger class="rounded-xl px-3.5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/35 hover:no-underline hover:text-foreground [&>svg]:hidden">
                <span class="flex w-full items-center justify-between gap-2">
                  <span>More providers ({{ filteredMoreProviders.length }})</span>
                  <ChevronDown class="size-3.5 transition-transform" :class="providerOtherOpen && 'rotate-180'" />
                </span>
              </AccordionTrigger>
              <AccordionContent class="space-y-1 pt-1">
                <button
                  v-for="provider in filteredMoreProviders"
                  :key="provider.id"
                  type="button"
                  class="group flex h-auto w-full cursor-pointer items-center gap-3 rounded-2xl border border-border/50 bg-muted/20 px-3.5 py-2.5 text-left transition-colors hover:bg-muted/35"
                  @click="connectProvider(provider)"
                >
                  <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800" aria-hidden="true">
                    <img v-if="providerIcons[provider.id]" :src="providerIcons[provider.id]" alt="" width="18" height="18" class="object-contain dark:invert" />
                    <span v-else class="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">{{ providerInitials(provider.name) }}</span>
                  </span>
                  <div class="min-w-0 flex-1">
                    <span class="truncate text-sm font-medium text-foreground">{{ provider.name }}</span>
                    <div class="mt-0.5 truncate text-xs text-muted-foreground/60">{{ provider.desc }}</div>
                  </div>
                  <ChevronRight class="ml-auto h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
                </button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <button
            v-if="customMatchesSearch"
            type="button"
            class="group flex h-auto w-full cursor-pointer items-center gap-3 rounded-2xl border border-border/50 bg-muted/20 px-3.5 py-2.5 text-left transition-colors hover:bg-muted/35"
            @click="showCustomProviderForm"
          >
            <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-muted-foreground dark:bg-zinc-800">
              <Plug class="h-4 w-4" />
            </span>
            <div class="min-w-0 flex-1">
              <span class="truncate text-sm font-medium text-foreground">Custom Provider</span>
              <div class="mt-0.5 truncate text-xs text-muted-foreground/60">Add any OpenAI-compatible endpoint - e.g. a local Ollama server</div>
            </div>
            <ChevronRight class="ml-auto h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
          </button>
        </div>

        <form v-if="providerView.type === 'custom'" class="space-y-4 px-5 py-4" @submit.prevent="submitCustomProvider">
          <p class="text-sm text-muted-foreground/70">
            Add an OpenAI-compatible provider - point it at a local Ollama server with
            <code class="rounded bg-muted px-1 py-0.5 text-xs">http://localhost:11434/v1</code>.
          </p>
          <div class="space-y-4 rounded-2xl border border-border/50 bg-muted/20 p-4">
            <div>
              <Label class="mb-1.5 block text-xs font-medium text-muted-foreground">Provider ID</Label>
              <Input v-model="customProviderForm.providerID" placeholder="ollama" class="h-9 rounded-xl border-border/50 bg-background text-sm" autofocus />
            </div>
            <div>
              <Label class="mb-1.5 block text-xs font-medium text-muted-foreground">Display name</Label>
              <Input v-model="customProviderForm.name" placeholder="Ollama (local)" class="h-9 rounded-xl border-border/50 bg-background text-sm" />
            </div>
            <div>
              <Label class="mb-1.5 block text-xs font-medium text-muted-foreground">Base URL</Label>
              <Input v-model="customProviderForm.baseURL" placeholder="http://localhost:11434/v1" class="h-9 rounded-xl border-border/50 bg-background text-sm" />
            </div>
            <div>
              <Label class="mb-1.5 block text-xs font-medium text-muted-foreground">API key <span class="font-normal text-muted-foreground/50">(optional)</span></Label>
              <Input v-model="customProviderForm.apiKey" type="password" placeholder="sk-... (Ollama doesn't need one)" class="h-9 rounded-xl border-border/50 bg-background text-sm" />
            </div>
            <div>
              <Label class="mb-1.5 block text-xs font-medium text-muted-foreground">Model</Label>
              <div class="flex gap-2">
                <Input v-model="customProviderForm.modelId" placeholder="llama3.1" class="h-9 flex-1 rounded-xl border-border/50 bg-background text-sm" />
                <Input v-model="customProviderForm.modelName" placeholder="Display name" class="h-9 flex-1 rounded-xl border-border/50 bg-background text-sm" />
              </div>
            </div>
          </div>
          <Button type="submit" :disabled="!customProviderForm.providerID.trim() || !customProviderForm.baseURL.trim()" size="sm" class="px-4">Connect</Button>
        </form>

        <div v-if="providerView.type === 'connect' && selectedProvider" class="space-y-4 px-5 py-4">
          <div class="flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/20 px-4 py-3.5">
            <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800" aria-hidden="true">
              <img v-if="providerIcons[selectedProvider.id]" :src="providerIcons[selectedProvider.id]" alt="" width="22" height="22" class="object-contain dark:invert" />
              <span v-else class="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">{{ providerInitials(selectedProvider.name) }}</span>
            </span>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-foreground">{{ selectedProvider.name }}</div>
              <p class="mt-0.5 text-xs text-muted-foreground">{{ selectedProvider.desc }}</p>
            </div>
          </div>

          <template v-if="!providerAuthMethod">
            <p class="text-sm text-muted-foreground">Select a login method for {{ selectedProvider.name }}.</p>
            <div class="space-y-0.5 rounded-2xl border border-border/50 bg-muted/20 p-2">
              <Button type="button" variant="ghost" class="group h-auto w-full justify-start gap-3 rounded-xl px-3 py-3 text-left hover:bg-background/70" @click="providerAuthMethod = 'oauth'">
                <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors group-hover:text-foreground">
                  <Globe class="h-4 w-4" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-medium">Pro / Max subscription</span>
                  <span class="mt-0.5 block text-xs text-muted-foreground/70">Use your existing subscription</span>
                </span>
                <ChevronRight class="ml-auto h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
              </Button>
              <Button type="button" variant="ghost" class="group h-auto w-full justify-start gap-3 rounded-xl px-3 py-3 text-left hover:bg-background/70" @click="providerAuthMethod = 'api'">
                <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors group-hover:text-foreground">
                  <Key class="h-4 w-4" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-medium">API key</span>
                  <span class="mt-0.5 block text-xs text-muted-foreground/70">Manually enter an existing API key</span>
                </span>
                <ChevronRight class="ml-auto h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
              </Button>
            </div>
          </template>

          <form v-else-if="providerAuthMethod === 'api'" class="space-y-4 rounded-2xl border border-border/50 bg-muted/20 p-4" @submit.prevent="submitSelectedProvider">
            <p class="text-sm text-muted-foreground">Enter your {{ selectedProvider.name }} API key.</p>
            <div>
              <Label class="mb-1.5 block text-xs font-medium text-muted-foreground">API key</Label>
              <Input v-model="providerApiKey" placeholder="sk-..." class="h-9 rounded-xl border-border/50 bg-background text-sm" autofocus />
            </div>
            <Button type="submit" :disabled="!providerApiKey.trim()" size="sm" class="px-4">Connect</Button>
          </form>

          <form v-else class="space-y-4 rounded-2xl border border-border/50 bg-muted/20 p-5" @submit.prevent="submitSelectedProvider">
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-foreground">Connect {{ selectedProvider.name }}</h3>
              <div class="space-y-2 text-sm text-muted-foreground">
                <div v-for="(step, index) in ['Click the button below to open the authorization page', 'Sign in and authorize access', 'Copy the full redirect URL from your browser', 'Paste it below and click Connect']" :key="step" class="flex items-start gap-2">
                  <span class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">{{ index + 1 }}</span>
                  <span>{{ step }}</span>
                </div>
              </div>
            </div>
            <Button type="button" variant="outline" class="w-full justify-center">
              <ExternalLink class="size-4" />
              Open authorization page
            </Button>
            <div>
              <Label class="mb-1.5 block text-xs font-medium text-muted-foreground">Redirect URL</Label>
              <Input placeholder="https://kortix.local/callback?code=..." class="h-9 rounded-xl border-border/50 bg-background text-sm" />
            </div>
            <Button type="submit" size="sm" class="px-4">Connect</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
    <Toaster />
  </main>
</template>
