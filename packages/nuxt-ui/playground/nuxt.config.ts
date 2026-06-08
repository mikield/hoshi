import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        'class-variance-authority',
        'clsx',
        'lucide-vue-next',
        'reka-ui',
        'tailwind-merge',
        'vaul-vue',
        'vee-validate',
        'vue-sonner',
      ],
    },
  },
})
