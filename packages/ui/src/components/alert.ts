import { cva, type VariantProps } from "class-variance-authority"

export const alertVariants = cva(
  "relative w-full rounded-2xl border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
        warning:
          "text-amber-600 border-amber-600/50 bg-amber-200/10 dark:bg-amber-900/10 dark:border-amber-600/50 dark:text-amber-400 [&>svg]:text-current *:data-[slot=alert-description]:text-amber-500/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type AlertVariants = VariantProps<typeof alertVariants>
