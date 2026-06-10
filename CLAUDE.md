# Hoshi — Engineering Standards

Read this before touching code. These are the working agreements for this repo.

## Product context

- Pre-release product. **Backward compatibility does not matter** — if the right design
  requires a breaking change, make the breaking change. Never keep a worse API for
  compatibility's sake.
- The UI/UX north star is the Suna app (`/Users/vgaysyuk/Code/suna/apps/web`) — as
  **inspiration, not a copy target**:
  - For surfaces Suna already has (chat shell, sidebar, dropdowns, composer): check how
    Suna does it and match its structure, spacing, and interaction patterns.
  - For **new features Suna doesn't have**: design something new that carries Suna's
    "vibe" — same density, radii, token usage, motion, and quiet-by-default chrome —
    rather than transplanting the nearest Suna screen. Study its patterns, then build
    an original surface that feels like it belongs in the same product.

## Code quality

- **No code smell, no leftovers.** No dead code, no commented-out blocks, no
  "TODO: refactor later", no unused imports/props/components. If a change makes
  something obsolete, delete it in the same change.
- Modular, high-standard **Vue 3 + Nuxt 4** code: `<script setup lang="ts">`,
  composables for shared state/logic (`app/composables/`), typed props/emits,
  `defineModel` for v-model, no options API.
- Components stay small and single-purpose. A page file should compose components,
  not contain hundred-line template blobs.

## Where code lives

- **`packages/ui` (@hoshi/ui)** — anything visual that is repeatable or could be reused
  by another app goes here as a component (and gets exported from `src/index.ts`).
  Examples: markdown rendering, thinking/reasoning blocks, avatars, chat chrome.
  App-specific wiring (routing, auth, API calls) stays in `apps/app`.
- **`apps/app`** — Nuxt 4 app. Pages under `app/pages`, components under
  `app/components`, composables under `app/composables`, server routes under `server/`.

## Styling

- Tailwind v4 with design tokens from `apps/app/app/assets/css/main.css`
  (`--background`, `--card`, `--sidebar*`, `--border`, etc.). Always style through
  tokens (`text-muted-foreground`, `bg-card`, `border-border/60`) — never hardcoded
  colors.
- Merge classes with `cn()` from `@hoshi/ui`.
- **Animations and motion matter.** Use the transition/animate utilities the design
  system already uses (`animate-in`, `fade-in-0`, `zoom-in-[0.97]`, `transition-colors`,
  pulse dots for busy states). New interactive surfaces should have enter/exit motion
  consistent with existing dropdowns/dialogs.
- Hidden scrollbars on chat/sidebar scroll areas:
  `[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none`.

## Gotchas learned in this repo

- Vue renders `false` boolean props as literal `data-*="false"` attributes; Tailwind
  `data-[x]:` variants match on attribute *presence*. Bind conditionally:
  `:data-inset="inset ? '' : undefined"`.
- Avoid client-only branching during SSR render (e.g. `navigator.platform`) — resolve
  in `onMounted` to prevent hydration mismatches.
- Theme-dependent assets are themed with CSS (`invert dark:invert-0`), never with JS
  color-mode lookups.
