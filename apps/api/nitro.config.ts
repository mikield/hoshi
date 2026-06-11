import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  compatibilityDate: '2025-07-15',

  // better-sqlite3 is a native module — keep it external to the Nitro bundle.
  externals: {
    external: ['better-sqlite3'],
  },
})
