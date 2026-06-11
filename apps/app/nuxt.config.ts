import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Hoshi API server (apps/api) — override with NUXT_PUBLIC_API_BASE.
      apiBase: 'http://localhost:4100',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ['@nuxtjs/color-mode', '@nuxtjs/mdc', '@pinia/nuxt'],

  imports: {
    dirs: ['stores'],
  },
})
