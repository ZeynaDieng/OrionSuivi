<template>
  <div class="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
    <!-- Header -->
    <header class="mb-10">
      <h1
        class="text-2xl md:text-3xl font-bold text-orion-primary tracking-tight mb-2"
      >
        Clients Actifs
      </h1>
    </header>

    <!-- Loading State with Skeleton -->
    <TableSkeleton v-if="loading" :columns="5" :rows="10" />

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
    >
      <p class="text-red-700 font-medium mb-2">
        Erreur lors du chargement des données
      </p>
      <p class="text-red-600 text-sm mb-3">
        {{ error.message || "L'API n'est pas disponible." }}
      </p>
      <button
        @click="refresh"
        class="mt-2 text-sm text-red-700 hover:text-red-900 underline"
      >
        Réessayer
      </button>
    </div>

    <!-- Table -->
    <div
      v-else
      class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <!-- Filters -->
      <div class="p-5 border-b border-slate-100 flex flex-col gap-4">
        <!-- Stats and Search Row -->
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div class="flex items-center gap-4">
            <span class="text-sm font-medium text-slate-600">
              Total:
              <span class="font-bold text-emerald-600">{{
                enrichedActiveUsersList.length
              }}</span>
              clients actifs
            </span>
          </div>

          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher par nom, store, email..."
              class="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orion-blue focus:border-orion-blue w-full sm:w-64 transition-all"
            />
            <span
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              >🔍</span
            >
          </div>
        </div>

        <!-- Filter Buttons -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="statusFilter = 'all'"
            :class="
              statusFilter === 'all'
                ? 'bg-orion-primary text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            "
            class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
          >
            Tous
          </button>
          <button
            @click="statusFilter = 'actif'"
            :class="
              statusFilter === 'actif'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            "
            class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap"
          >
            Actifs
          </button>
          <button
            @click="statusFilter = 'proche_fin'"
            :class="
              statusFilter === 'proche_fin'
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            "
            class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap"
          >
            Proche fin
          </button>
          <button
            @click="statusFilter = 'expire'"
            :class="
              statusFilter === 'expire'
                ? 'bg-red-100 text-red-800 border-red-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            "
            class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap"
          >
            Expirés
          </button>
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
                Admins
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
                Date fin
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <tr v-if="filteredClients.length === 0" class="hover:bg-slate-50">
              <td colspan="6" class="px-6 py-8 text-center text-slate-400">
                <div v-if="activeUsers.length === 0" class="space-y-2">
                  <p class="font-medium">Aucune donnée disponible</p>
                  <p class="text-xs">
                    Les données seront chargées depuis l'API /users/actifs
                  </p>
                </div>
                <div v-else>Aucun client trouvé avec la recherche</div>
              </td>
            </tr>
            <tr
              v-for="client in paginatedClients"
              :key="client._id || client.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold"
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
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                <div v-if="getAdminNames(client).length > 0">
                  <span
                    v-for="(adminName, index) in getAdminNames(client)"
                    :key="index"
                    class="inline-block"
                  >
                    <span class="text-slate-700">{{ adminName }}</span
                    ><span
                      v-if="index < getAdminNames(client).length - 1"
                      class="text-slate-400 mx-1"
                      >•</span
                    >
                  </span>
                </div>
                <span v-else class="text-slate-400">—</span>
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
                <span v-if="client.abonnement?.end">
                  {{ formatDate(client.abonnement.end) }}
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
          {{ Math.min(currentPage * itemsPerPage, filteredClients.length) }} sur
          {{ filteredClients.length }} résultats
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
</template>

<script setup>
// Désactiver le SSR pour éviter les problèmes d'hydratation avec les appels API
definePageMeta({
  ssr: false,
});

import {
  getClientStatus,
  getJoursRestants,
  getActionRecommandee,
} from "~/utils/statusLogic";

const {
  activeUsers,
  loading,
  error,
  refresh,
  startAutoRefresh,
  stopAutoRefresh,
} = useUsers();

const searchQuery = ref("");
const statusFilter = ref("all"); // Filtre par statut
const currentPage = ref(1);
const itemsPerPage = 10; // 10 éléments par page pour les listes

// Enrichir les clients actifs avec les statuts
const enrichedActiveUsersList = computed(() => {
  return activeUsers.value.map((client) => ({
    ...client,
    status: getClientStatus(client),
    joursRestants: getJoursRestants(client),
    actionRecommandee: getActionRecommandee(getClientStatus(client)),
  }));
});

// Filtrer les clients selon la recherche et le statut
const filteredClients = computed(() => {
  let result = enrichedActiveUsersList.value;

  // Filtre par statut
  if (statusFilter.value !== "all") {
    result = result.filter((client) => client.status === statusFilter.value);
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

// Pagination (10 éléments par page)
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// Réinitialiser la page quand la recherche ou le filtre change
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1;
});

const getClientName = (client) => {
  if (client.name) return client.name;
  if (client.store) return client.store;
  if (client.admin && client.admin.length > 0 && client.admin[0].name)
    return client.admin[0].name;
  return "Client inconnu";
};

const getClientEmail = (client) => {
  if (client.email) return client.email;
  if (client.admin && client.admin.length > 0 && client.admin[0].email)
    return client.admin[0].email;
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

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getActionClass = (action) => {
  if (action === "URGENT – Appeler") return "text-red-600";
  if (action === "Relancer") return "text-amber-600";
  return "text-slate-500";
};

// Démarrer le rafraîchissement automatique au montage
onMounted(async () => {
  try {
    await refresh();
    startAutoRefresh();
  } catch (err) {
    console.error("Erreur lors du chargement initial:", err);
  }
});

// Arrêter le rafraîchissement automatique lors du démontage
onUnmounted(() => {
  stopAutoRefresh();
});
</script>
