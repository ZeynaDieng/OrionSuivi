// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Variables privées (uniquement côté serveur)
    apiSecret: process.env.API_SECRET,
    
    // Variables publiques (exposées au client)
    public: {
      apiBase: process.env.API_BASE_URL || 'https://orionsn.com/api/v1'
    }
  },

  app: {
    head: {
      title: 'Dashboard Orion - Suivi Clientèle',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Dashboard de suivi clientèle Orion' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ],
      script: [
        { src: 'https://unpkg.com/@phosphor-icons/web', defer: true }
      ]
    }
  }
})

