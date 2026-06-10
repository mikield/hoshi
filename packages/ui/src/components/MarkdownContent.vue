<script setup lang="ts">
import { cn } from "../lib/utils"

// Design-system styling for rendered markdown (MDC, marked, etc.). The renderer
// owns the HTML; this container owns the look, so every app renders markdown
// identically. Compact spacing tuned for chat. Selectors are scoped via Tailwind
// descendant variants — no global CSS, all theme tokens.
const props = defineProps<{ class?: string }>()

const STYLES = [
  // Base
  "min-w-0 max-w-full text-sm leading-relaxed text-foreground break-words",
  // Headings — compact, no decoration
  "[&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1:first-child]:mt-0",
  "[&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2:first-child]:mt-0",
  "[&_h3]:mt-5 [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold [&_h3:first-child]:mt-0",
  "[&_h4]:mt-4 [&_h4]:mb-1 [&_h4]:text-sm [&_h4]:font-semibold [&_h4:first-child]:mt-0",
  "[&_h5]:mt-3 [&_h5]:mb-1 [&_h5]:text-sm [&_h5]:font-medium [&_h5:first-child]:mt-0",
  "[&_h6]:mt-3 [&_h6]:mb-1 [&_h6]:text-xs [&_h6]:font-medium [&_h6]:uppercase [&_h6]:tracking-wide [&_h6]:text-muted-foreground [&_h6:first-child]:mt-0",
  // Heading anchor links (MDC wraps headings in <a>) — inherit the heading, no link chrome
  "[&_:is(h1,h2,h3,h4,h5,h6)_a]:font-[inherit] [&_:is(h1,h2,h3,h4,h5,h6)_a]:text-[inherit] [&_:is(h1,h2,h3,h4,h5,h6)_a]:no-underline",
  // Paragraphs
  "[&_p]:my-3 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
  // Lists
  "[&_ul]:my-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul:first-child]:mt-0 [&_ul:last-child]:mb-0 [&_ul]:marker:text-muted-foreground/60",
  "[&_ol]:my-3 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol:first-child]:mt-0 [&_ol:last-child]:mb-0 [&_ol]:marker:font-medium [&_ol]:marker:text-muted-foreground/60",
  "[&_li]:pl-1 [&_li]:leading-relaxed [&_li>p]:my-1",
  "[&_li>ul]:my-1 [&_li>ol]:my-1",
  // Links — quiet, never underlined; hover only shifts tone
  "[&_a]:font-medium [&_a]:text-foreground [&_a]:no-underline hover:[&_a]:text-foreground/70 [&_a]:transition-colors [&_a]:duration-150",
  // Inline code (not inside pre)
  "[&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:border [&_:not(pre)>code]:border-border/50 [&_:not(pre)>code]:bg-muted/60 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.85em] [&_:not(pre)>code]:font-medium [&_:not(pre)>code]:before:content-none [&_:not(pre)>code]:after:content-none",
  // Code blocks
  "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border/60 [&_pre]:bg-card/50 [&_pre]:p-3.5 [&_pre:first-child]:mt-0 [&_pre:last-child]:mb-0",
  "[&_pre>code]:block [&_pre>code]:whitespace-pre [&_pre>code]:bg-transparent [&_pre>code]:p-0 [&_pre>code]:font-mono [&_pre>code]:text-[13px] [&_pre>code]:leading-[1.6]",
  // Blockquote
  "[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:py-0.5 [&_blockquote]:pl-3.5 [&_blockquote]:text-muted-foreground [&_blockquote>p]:my-1.5",
  // Horizontal rule
  "[&_hr]:my-6 [&_hr]:h-px [&_hr]:border-0 [&_hr]:bg-border/60",
  // Tables
  "[&_table]:my-4 [&_table]:w-full [&_table]:border-separate [&_table]:border-spacing-0 [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-border/60 [&_table]:text-sm",
  "[&_thead]:bg-muted/50 dark:[&_thead]:bg-muted/30",
  "[&_th]:border-b [&_th]:border-border/60 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground",
  "[&_td]:border-b [&_td]:border-border/40 [&_td]:px-3 [&_td]:py-2 [&_tr:last-child>td]:border-b-0",
  "[&_tbody_tr]:transition-colors hover:[&_tbody_tr]:bg-muted/30",
  // Media
  "[&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-border/50",
  // Emphasis
  "[&_strong]:font-semibold [&_strong]:text-foreground",
].join(" ")
</script>

<template>
  <div data-slot="markdown-content" :class="cn(STYLES, props.class)">
    <slot />
  </div>
</template>
