<template>
  <aside
    class="fixed top-0 left-0 h-full w-20 bg-white border-r border-slate-100 hidden lg:flex flex-col items-center py-6 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
  >
    <!-- Logo -->
    <NuxtLink
      to="/"
      class="w-10 h-10 rounded-xl bg-orion-primary flex items-center justify-center text-white font-bold text-lg mb-8 shadow-lg shadow-indigo-900/20"
    >
      O
    </NuxtLink>

    <!-- Navigation Items -->
    <div class="space-y-6 w-full flex flex-col items-center">
      <NuxtLink
        to="/dashboard"
        :class="[
          'p-3 rounded-xl transition-all',
          isActive('/dashboard')
            ? 'text-orion-blue bg-blue-50'
            : 'text-slate-400 hover:text-orion-primary hover:bg-slate-50',
        ]"
        title="Dashboard"
      >
        <i class="ph ph-squares-four text-2xl"></i>
      </NuxtLink>

      <NuxtLink
        to="/users"
        :class="[
          'p-3 rounded-xl transition-all',
          isActive('/users')
            ? 'text-orion-blue bg-blue-50'
            : 'text-slate-400 hover:text-orion-primary hover:bg-slate-50',
        ]"
        title="Tous les clients"
      >
        <i class="ph ph-users text-2xl"></i>
      </NuxtLink>

      <NuxtLink
        to="/users/actifs"
        :class="[
          'p-3 rounded-xl transition-all',
          isActive('/users/actifs')
            ? 'text-orion-blue bg-blue-50'
            : 'text-slate-400 hover:text-orion-primary hover:bg-slate-50',
        ]"
        title="Clients actifs"
      >
        <i class="ph ph-chart-pie-slice text-2xl"></i>
      </NuxtLink>

      <NuxtLink
        to="/users/appeler"
        :class="[
          'p-3 rounded-xl transition-all',
          isActive('/users/appeler')
            ? 'text-orion-blue bg-blue-50'
            : 'text-slate-400 hover:text-orion-primary hover:bg-slate-50',
        ]"
        title="Clients à appeler"
      >
        <i class="ph ph-phone text-2xl"></i>
      </NuxtLink>
    </div>

    <!-- Déconnexion -->
    <div class="mt-auto w-full px-2">
      <button
        class="w-full p-3 text-slate-400 hover:text-orion-danger hover:bg-red-50 rounded-xl transition-all"
        title="Déconnexion"
      >
        <i class="ph ph-sign-out text-2xl"></i>
      </button>
    </div>
  </aside>

  <!-- Mobile Menu Button -->
  <button
    @click="mobileMenuOpen = !mobileMenuOpen"
    class="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md border border-slate-200"
  >
    <i class="ph ph-list text-2xl text-slate-700"></i>
  </button>

  <!-- Mobile Sidebar -->
  <div
    v-if="mobileMenuOpen"
    class="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
    @click="mobileMenuOpen = false"
  >
    <aside
      class="fixed top-0 left-0 h-full w-64 bg-white shadow-xl flex flex-col py-6"
      @click.stop
    >
      <!-- Logo -->
      <div class="px-6 mb-8">
        <NuxtLink
          to="/"
          class="w-10 h-10 rounded-xl bg-orion-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-900/20"
          @click="mobileMenuOpen = false"
        >
          O
        </NuxtLink>
      </div>

      <!-- Navigation Items -->
      <nav class="flex-1 px-4 space-y-2">
        <NuxtLink
          to="/dashboard"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
            isActive('/dashboard')
              ? 'text-orion-blue bg-blue-50 font-medium'
              : 'text-slate-600 hover:text-orion-primary hover:bg-slate-50',
          ]"
          @click="mobileMenuOpen = false"
        >
          <i class="ph ph-squares-four text-xl"></i>
          <span>Dashboard</span>
        </NuxtLink>

        <NuxtLink
          to="/users"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
            isActive('/users') && !isActive('/users/actifs')
              ? 'text-orion-blue bg-blue-50 font-medium'
              : 'text-slate-600 hover:text-orion-primary hover:bg-slate-50',
          ]"
          @click="mobileMenuOpen = false"
        >
          <i class="ph ph-users text-xl"></i>
          <span>Tous les clients</span>
        </NuxtLink>

        <NuxtLink
          to="/users/actifs"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
            isActive('/users/actifs')
              ? 'text-orion-blue bg-blue-50 font-medium'
              : 'text-slate-600 hover:text-orion-primary hover:bg-slate-50',
          ]"
          @click="mobileMenuOpen = false"
        >
          <i class="ph ph-chart-pie-slice text-xl"></i>
          <span>Clients actifs</span>
        </NuxtLink>

        <NuxtLink
          to="/users/appeler"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
            isActive('/users/appeler')
              ? 'text-orion-blue bg-blue-50 font-medium'
              : 'text-slate-600 hover:text-orion-primary hover:bg-slate-50',
          ]"
          @click="mobileMenuOpen = false"
        >
          <i class="ph ph-phone text-xl"></i>
          <span>Clients à appeler</span>
        </NuxtLink>
      </nav>

      <!-- Close Button -->
      <div class="px-4">
        <button
          @click="mobileMenuOpen = false"
          class="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-orion-danger hover:bg-red-50 rounded-xl transition-all"
        >
          <i class="ph ph-sign-out text-xl"></i>
          <span>Fermer</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const mobileMenuOpen = ref(false);

const isActive = (path) => {
  if (
    path === "/users" &&
    (route.path === "/users/actifs" || route.path === "/users/appeler")
  ) {
    return false;
  }
  return route.path === path || route.path.startsWith(path + "/");
};
</script>
