<template>
  <div class="min-h-screen bg-slate-50">
    <Sidebar />
    <main class="lg:ml-20 min-h-screen bg-slate-50">
      <slot />
    </main>
  </div>
</template>

<script setup>
// Layout par défaut avec sidebar
// Ce layout inclut la Sidebar qui est visible sur les écrans >= 1024px (lg breakpoint)
</script>

