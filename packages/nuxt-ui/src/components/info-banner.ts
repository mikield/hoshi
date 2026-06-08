import { cva, type VariantProps } from "class-variance-authority"

export const bannerVariants = cva("flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm", {
  variants: {
    tone: {
      neutral: "border-border/70 bg-muted/30 text-foreground",
      info: "border-blue-500/25 bg-blue-500/[0.06] text-foreground",
      success: "border-emerald-500/25 bg-emerald-500/[0.06] text-foreground",
      warning: "border-amber-500/30 bg-amber-500/[0.06] text-foreground",
      destructive: "border-destructive/30 bg-destructive/5 text-foreground",
    },
  },
  defaultVariants: { tone: "neutral" },
})

export const ICON_TONE: Record<string, string> = {
  neutral: "text-muted-foreground",
  info: "text-blue-600 dark:text-blue-400",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  destructive: "text-destructive",
}

export type BannerVariants = VariantProps<typeof bannerVariants>
