export type StatusTone = "success" | "warning" | "destructive" | "info" | "neutral"

export const STATUS_TEXT: Record<StatusTone, string> = {
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  destructive: "text-destructive",
  info: "text-blue-600 dark:text-blue-400",
  neutral: "text-muted-foreground",
}

export const STATUS_BG: Record<StatusTone, string> = {
  success: "bg-emerald-500/10",
  warning: "bg-amber-500/10",
  destructive: "bg-destructive/10",
  info: "bg-blue-500/10",
  neutral: "bg-muted/50",
}

export const STATUS_BORDER: Record<StatusTone, string> = {
  success: "border-emerald-500/25",
  warning: "border-amber-500/30",
  destructive: "border-destructive/30",
  info: "border-blue-500/25",
  neutral: "border-border/60",
}

export const STATUS_DOT: Record<StatusTone, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  destructive: "bg-destructive",
  info: "bg-blue-500",
  neutral: "bg-muted-foreground/40",
}

export function statusText(tone: StatusTone) {
  return STATUS_TEXT[tone]
}
