import { cva, type VariantProps } from "class-variance-authority"

export const cardVariants = cva(
  "flex flex-col gap-6 rounded-2xl border text-card-foreground",
  {
    variants: {
      variant: {
        default: "bg-card py-6",
        glass: "bg-card/40 shadow-lg py-6 border border-border/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type CardVariants = VariantProps<typeof cardVariants>
