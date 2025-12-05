<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center">
    <div class="text-center px-4">
      <h1 class="text-3xl font-bold text-orion-primary mb-4">
        Dashboard Orion - Suivi Clientèle
      </h1>
      <p class="text-slate-600 mb-6">
        Bienvenue sur le dashboard de suivi clientèle.
      </p>
      <a
        href="/dashboard"
        class="inline-flex items-center gap-2 bg-orion-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-900 transition-colors shadow-lg cursor-pointer"
      >
        Accéder au Dashboard
      </a>
    </div>
  </div>
</template>

<script setup>
// Désactiver le SSR pour éviter les problèmes d'hydratation
// Utiliser un layout vide pour ne pas afficher la sidebar
definePageMeta({
  ssr: false,
  layout: "blank",
});
</script>
