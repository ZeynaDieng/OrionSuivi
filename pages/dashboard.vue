<template>
  <div class="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
    <!-- Header -->
    <header class="mb-10">
      <h1
        class="text-2xl md:text-3xl font-bold text-orion-primary tracking-tight mb-2"
      >
        Dashboard Suivi Clientèle
      </h1>
      <p class="text-slate-500 font-medium">
        Vue d'overview de l'activité en temps réel
      </p>
    </header>

    <!-- Loading State with Skeletons -->
    <div v-if="loading">
      <!-- KPI Skeletons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPISkeleton v-for="i in 4" :key="i" />
      </div>

      <!-- Table Skeleton -->
      <TableSkeleton :columns="5" :rows="5" />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
    >
      <p class="text-red-700 font-medium mb-2">
        Erreur lors du chargement des données
      </p>
      <p class="text-red-600 text-sm mb-3">
        {{ error.message || "L'API n'est pas disponible ou non configurée." }}
      </p>
      <p class="text-red-500 text-xs mb-3">
        Pour configurer l'API, ajoutez
        <code class="bg-red-100 px-2 py-1 rounded">public.apiBase</code> dans
        <code class="bg-red-100 px-2 py-1 rounded">nuxt.config.ts</code> ou la
        variable d'environnement
        <code class="bg-red-100 px-2 py-1 rounded">API_BASE_URL</code>
      </p>
      <button
        @click="refresh"
        class="mt-2 text-sm text-red-700 hover:text-red-900 underline"
      >
        Réessayer
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="!loading">
      <!-- KPI Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Clients"
          :value="stats.total"
          color="primary"
          icon="👥"
        />
        <KPICard
          title="Actifs"
          :value="stats.actifs"
          color="success"
          icon="✅"
        />
        <KPICard
          title="Proche fin"
          :value="stats.proche_fin"
          color="warning"
          icon="⚠️"
        />
        <KPICard
          title="Expirés"
          :value="stats.expires"
          color="danger"
          icon="🔴"
        />
      </div>

      <!-- Split Section (Chart + Actions) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Chart Section -->
        <div class="lg:col-span-1">
          <StatusChart :stats="stats" />
        </div>

        <!-- Daily Actions Section -->
        <div class="lg:col-span-2">
          <DailyActions :clients="clientsToAction" @relancer="handleRelancer" />
        </div>
      </div>

      <!-- Advanced Statistics Section -->
      <div class="mb-8">
        <AdvancedStats :clients="users" />
      </div>

      <!-- Complete Table -->
      <div
        class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <!-- Filters -->
        <div class="p-5 border-b border-slate-100 flex flex-col gap-4">
          <!-- Status Filters and Search Row -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              <button
                @click="filter = 'all'"
                :class="
                  filter === 'all'
                    ? 'bg-orion-primary text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                "
                class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
              >
                Tous
              </button>
              <button
                @click="filter = 'actif'"
                :class="
                  filter === 'actif'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                "
                class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap"
              >
                Actifs
              </button>
              <button
                @click="filter = 'proche_fin'"
                :class="
                  filter === 'proche_fin'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                "
                class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap"
              >
                Proche fin
              </button>
              <button
                @click="filter = 'expire'"
                :class="
                  filter === 'expire'
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                "
                class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap"
              >
                Expirés
              </button>
            </div>

            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher par nom, store..."
                class="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orion-blue focus:border-orion-blue w-full sm:w-64 transition-all"
              />
              <span
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                >🔍</span
              >
            </div>
          </div>

          <!-- Date Filters Row -->
          <div class="flex flex-col gap-3 pt-2 border-t border-slate-100">
            <!-- Date de fin d'abonnement -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
              <div class="flex items-center gap-2">
                <label
                  class="text-xs font-medium text-slate-600 whitespace-nowrap"
                  >Date de fin :</label
                >
                <input
                  v-model="dateStart"
                  type="date"
                  class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orion-blue focus:border-orion-blue transition-all"
                />
                <span class="text-slate-400">→</span>
                <input
                  v-model="dateEnd"
                  type="date"
                  class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orion-blue focus:border-orion-blue transition-all"
                />
              </div>

              <div class="flex gap-2 overflow-x-auto">
                <button
                  @click="setDateFilter('today')"
                  class="px-3 py-1.5 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Aujourd'hui
                </button>
                <button
                  @click="setDateFilter('week')"
                  class="px-3 py-1.5 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Cette semaine
                </button>
                <button
                  @click="setDateFilter('month')"
                  class="px-3 py-1.5 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Ce mois
                </button>
                <button
                  @click="setDateFilter('nextMonth')"
                  class="px-3 py-1.5 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Mois prochain
                </button>
                <button
                  @click="clearDateFilter"
                  class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            <!-- Date d'inscription -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
              <div class="flex items-center gap-2">
                <label
                  class="text-xs font-medium text-slate-600 whitespace-nowrap"
                  >Date d'inscription :</label
                >
                <input
                  v-model="inscriptionDateStart"
                  type="date"
                  class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orion-blue focus:border-orion-blue transition-all"
                />
                <span class="text-slate-400">→</span>
                <input
                  v-model="inscriptionDateEnd"
                  type="date"
                  class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orion-blue focus:border-orion-blue transition-all"
                />
              </div>

              <div class="flex gap-2 overflow-x-auto">
                <button
                  @click="setInscriptionDateFilter('today')"
                  class="px-3 py-1.5 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Aujourd'hui
                </button>
                <button
                  @click="setInscriptionDateFilter('week')"
                  class="px-3 py-1.5 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Cette semaine
                </button>
                <button
                  @click="setInscriptionDateFilter('month')"
                  class="px-3 py-1.5 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Ce mois
                </button>
                <button
                  @click="setInscriptionDateFilter('lastMonth')"
                  class="px-3 py-1.5 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Mois dernier
                </button>
                <button
                  @click="clearInscriptionDateFilter"
                  class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50">
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Client
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Jours restants
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Date d'inscription
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Action
                </th>
                <th
                  class="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-if="filteredClients.length === 0" class="hover:bg-slate-50">
                <td colspan="6" class="px-6 py-8 text-center text-slate-400">
                  <div v-if="stats.total === 0" class="space-y-2">
                    <p class="font-medium">Aucune donnée disponible</p>
                    <p class="text-xs">
                      Configurez l'URL de l'API dans nuxt.config.ts pour charger
                      les données
                    </p>
                  </div>
                  <div v-else>
                    Aucun client trouvé avec les filtres sélectionnés
                  </div>
                </td>
              </tr>
              <tr
                v-for="client in paginatedClients"
                :key="client.id || client._id"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 rounded-full bg-orion-primary flex items-center justify-center text-white text-xs font-bold"
                    >
                      {{ getInitials(getClientName(client)) }}
                    </div>
                    <div>
                      <p class="font-medium text-slate-900">
                        {{ getClientName(client) }}
                      </p>
                      <p
                        v-if="getClientEmail(client)"
                        class="text-xs text-slate-500"
                      >
                        {{ getClientEmail(client) }}
                      </p>
                      <p
                        v-if="getAdminNames(client).length > 0"
                        class="text-xs text-slate-400 mt-0.5"
                      >
                        👤 {{ getAdminNames(client).join(", ") }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge
                    :status="client.status"
                    :jours-restants="client.joursRestants"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  <span
                    v-if="
                      client.joursRestants !== null &&
                      client.joursRestants !== undefined
                    "
                  >
                    {{ client.joursRestants }} jour(s)
                  </span>
                  <span v-else class="text-slate-400">—</span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono"
                >
                  <span v-if="client.createdAt">
                    {{ formatDate(client.createdAt) }}
                  </span>
                  <span v-else class="text-slate-400">—</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="text-xs font-medium"
                    :class="getActionClass(client.actionRecommandee)"
                  >
                    {{ client.actionRecommandee }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    v-if="client.status !== 'actif'"
                    @click="handleRelancer(client)"
                    class="px-3 py-1.5 text-xs font-medium bg-orion-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Relancer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredClients.length > itemsPerPage"
          class="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50"
        >
          <div class="text-sm text-slate-600">
            Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à
            {{ Math.min(currentPage * itemsPerPage, filteredClients.length) }}
            sur {{ filteredClients.length }} résultats
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              :class="
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-200'
              "
              class="px-3 py-1.5 text-sm font-medium bg-white border border-slate-200 rounded-lg transition-colors"
            >
              Précédent
            </button>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-200'
              "
              class="px-3 py-1.5 text-sm font-medium bg-white border border-slate-200 rounded-lg transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Désactiver le SSR pour éviter les problèmes d'hydratation avec les appels API
definePageMeta({
  ssr: false,
  layout: "default",
});

const {
  users,
  stats,
  sortedUsers,
  clientsToAction,
  advancedStats,
  loading,
  error,
  refresh,
  startAutoRefresh,
  stopAutoRefresh,
} = useUsers();

const filter = ref("all");
const searchQuery = ref("");
const dateStart = ref("");
const dateEnd = ref("");
const inscriptionDateStart = ref("");
const inscriptionDateEnd = ref("");
const currentPage = ref(1);
const itemsPerPage = 5; // 5 éléments par page pour le dashboard

// Démarrer le rafraîchissement automatique au montage
onMounted(async () => {
  try {
    await refresh();
    startAutoRefresh();
  } catch (err) {
    console.error("Erreur lors du chargement initial:", err);
    // La page s'affichera quand même avec les valeurs par défaut
  }
});

// Arrêter le rafraîchissement automatique lors du démontage
onUnmounted(() => {
  stopAutoRefresh();
});

// Filtrer les clients selon le filtre, la recherche et les dates
const filteredClients = computed(() => {
  let result = sortedUsers.value;

  // Filtre par statut
  if (filter.value !== "all") {
    result = result.filter((client) => client.status === filter.value);
  }

  // Filtre par date de fin d'abonnement
  if (dateStart.value || dateEnd.value) {
    result = result.filter((client) => {
      if (!client.abonnement?.end) return false;
      const endDate = new Date(client.abonnement.end);
      endDate.setHours(0, 0, 0, 0);

      if (dateStart.value && dateEnd.value) {
        const start = new Date(dateStart.value);
        start.setHours(0, 0, 0, 0);
        const end = new Date(dateEnd.value);
        end.setHours(23, 59, 59, 999);
        return endDate >= start && endDate <= end;
      } else if (dateStart.value) {
        const start = new Date(dateStart.value);
        start.setHours(0, 0, 0, 0);
        return endDate >= start;
      } else if (dateEnd.value) {
        const end = new Date(dateEnd.value);
        end.setHours(23, 59, 59, 999);
        return endDate <= end;
      }
      return true;
    });
  }

  // Filtre par date d'inscription
  if (inscriptionDateStart.value || inscriptionDateEnd.value) {
    result = result.filter((client) => {
      if (!client.createdAt) return false;
      const inscriptionDate = new Date(client.createdAt);
      inscriptionDate.setHours(0, 0, 0, 0);

      if (inscriptionDateStart.value && inscriptionDateEnd.value) {
        const start = new Date(inscriptionDateStart.value);
        start.setHours(0, 0, 0, 0);
        const end = new Date(inscriptionDateEnd.value);
        end.setHours(23, 59, 59, 999);
        return inscriptionDate >= start && inscriptionDate <= end;
      } else if (inscriptionDateStart.value) {
        const start = new Date(inscriptionDateStart.value);
        start.setHours(0, 0, 0, 0);
        return inscriptionDate >= start;
      } else if (inscriptionDateEnd.value) {
        const end = new Date(inscriptionDateEnd.value);
        end.setHours(23, 59, 59, 999);
        return inscriptionDate <= end;
      }
      return true;
    });
  }

  // Recherche par nom/email/store/noms des admins
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((client) => {
      const name = getClientName(client).toLowerCase();
      const email = (getClientEmail(client) || "").toLowerCase();
      const store = (client.store || "").toLowerCase();
      const adminNames = getAdminNames(client).join(" ").toLowerCase();
      return (
        name.includes(query) ||
        email.includes(query) ||
        store.includes(query) ||
        adminNames.includes(query)
      );
    });
  }

  return result;
});

// Fonctions pour les filtres de date rapides
const setDateFilter = (period) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (period) {
    case "today":
      dateStart.value = formatDateForInput(today);
      dateEnd.value = formatDateForInput(today);
      break;
    case "week":
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      dateStart.value = formatDateForInput(weekStart);
      dateEnd.value = formatDateForInput(weekEnd);
      break;
    case "month":
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      dateStart.value = formatDateForInput(monthStart);
      dateEnd.value = formatDateForInput(monthEnd);
      break;
    case "nextMonth":
      const nextMonthStart = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
      );
      const nextMonthEnd = new Date(
        today.getFullYear(),
        today.getMonth() + 2,
        0
      );
      dateStart.value = formatDateForInput(nextMonthStart);
      dateEnd.value = formatDateForInput(nextMonthEnd);
      break;
  }
};

const clearDateFilter = () => {
  dateStart.value = "";
  dateEnd.value = "";
};

// Fonctions pour les filtres de date d'inscription rapides
const setInscriptionDateFilter = (period) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (period) {
    case "today":
      inscriptionDateStart.value = formatDateForInput(today);
      inscriptionDateEnd.value = formatDateForInput(today);
      break;
    case "week":
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      inscriptionDateStart.value = formatDateForInput(weekStart);
      inscriptionDateEnd.value = formatDateForInput(weekEnd);
      break;
    case "month":
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      inscriptionDateStart.value = formatDateForInput(monthStart);
      inscriptionDateEnd.value = formatDateForInput(monthEnd);
      break;
    case "lastMonth":
      const lastMonthStart = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      inscriptionDateStart.value = formatDateForInput(lastMonthStart);
      inscriptionDateEnd.value = formatDateForInput(lastMonthEnd);
      break;
  }
};

const clearInscriptionDateFilter = () => {
  inscriptionDateStart.value = "";
  inscriptionDateEnd.value = "";
};

const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Pagination pour le dashboard (5 éléments par page)
const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredClients.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredClients.value.length / itemsPerPage);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // Scroll vers le haut du tableau
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// Réinitialiser la page quand le filtre, la recherche ou les dates changent
watch(
  [
    filter,
    searchQuery,
    dateStart,
    dateEnd,
    inscriptionDateStart,
    inscriptionDateEnd,
  ],
  () => {
    currentPage.value = 1;
  }
);

const getClientName = (client) => {
  // Priorité: name > store > email (direct ou depuis admin) > 'Client inconnu'
  if (client.name) return client.name;
  if (client.store) return client.store;
  if (client.email) return client.email;

  // Essayer d'extraire un email depuis le tableau admin
  if (client.admin && Array.isArray(client.admin) && client.admin.length > 0) {
    const admin = client.admin.find(
      (a) => a.role === "admin" && !a.deleted && a.email
    );
    if (admin?.email) return admin.email;
  }

  return "Client inconnu";
};

const getClientEmail = (client) => {
  // Priorité: email direct > email depuis admin > null
  if (client.email) return client.email;

  if (client.admin && Array.isArray(client.admin) && client.admin.length > 0) {
    const admin = client.admin.find(
      (a) => a.role === "admin" && !a.deleted && a.email
    );
    if (admin?.email) return admin.email;
  }

  return null;
};

const getAdminNames = (client) => {
  // Retourne la liste des noms des admins (non supprimés)
  if (!client.admin || !Array.isArray(client.admin)) return [];

  return client.admin
    .filter((a) => !a.deleted && a.name && a.name.trim())
    .map((a) => a.name)
    .filter((name, index, self) => self.indexOf(name) === index); // Supprimer les doublons
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getActionClass = (action) => {
  if (action === "URGENT – Appeler") return "text-red-600";
  if (action === "Relancer") return "text-amber-600";
  return "text-slate-500";
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const handleRelancer = (client) => {
  // TODO: Implémenter la logique de relance
  console.log("Relancer client:", client);
  alert(`Relance de ${getClientName(client)}`);
};
</script>
