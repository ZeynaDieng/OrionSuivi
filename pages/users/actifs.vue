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

            <button
              @click="handleExport"
              class="px-4 py-2 text-sm font-medium bg-orion-primary text-white rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-2 whitespace-nowrap"
              title="Exporter les données en CSV"
            >
              <i class="ph ph-download text-lg"></i>
              Exporter CSV
            </button>
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
                @click="sortBy('name')"
                class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div class="flex items-center gap-2">
                  Client
                  <i
                    v-if="sortColumn === 'name'"
                    :class="
                      sortDirection === 'asc'
                        ? 'ph ph-caret-up'
                        : 'ph ph-caret-down'
                    "
                    class="text-orion-primary"
                  ></i>
                  <i
                    v-else
                    class="ph ph-caret-up-down text-slate-400 opacity-50"
                  ></i>
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
              >
                Admins
              </th>
              <th
                @click="sortBy('status')"
                class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div class="flex items-center gap-2">
                  Statut
                  <i
                    v-if="sortColumn === 'status'"
                    :class="
                      sortDirection === 'asc'
                        ? 'ph ph-caret-up'
                        : 'ph ph-caret-down'
                    "
                    class="text-orion-primary"
                  ></i>
                  <i
                    v-else
                    class="ph ph-caret-up-down text-slate-400 opacity-50"
                  ></i>
                </div>
              </th>
              <th
                @click="sortBy('joursRestants')"
                class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div class="flex items-center gap-2">
                  Jours restants
                  <i
                    v-if="sortColumn === 'joursRestants'"
                    :class="
                      sortDirection === 'asc'
                        ? 'ph ph-caret-up'
                        : 'ph ph-caret-down'
                    "
                    class="text-orion-primary"
                  ></i>
                  <i
                    v-else
                    class="ph ph-caret-up-down text-slate-400 opacity-50"
                  ></i>
                </div>
              </th>
              <th
                @click="sortBy('abonnement.end')"
                class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div class="flex items-center gap-2">
                  Date fin
                  <i
                    v-if="sortColumn === 'abonnement.end'"
                    :class="
                      sortDirection === 'asc'
                        ? 'ph ph-caret-up'
                        : 'ph ph-caret-down'
                    "
                    class="text-orion-primary"
                  ></i>
                  <i
                    v-else
                    class="ph ph-caret-up-down text-slate-400 opacity-50"
                  ></i>
                </div>
              </th>
              <th
                @click="sortBy('createdAt')"
                class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div class="flex items-center gap-2">
                  Date d'inscription
                  <i
                    v-if="sortColumn === 'createdAt'"
                    :class="
                      sortDirection === 'asc'
                        ? 'ph ph-caret-up'
                        : 'ph ph-caret-down'
                    "
                    class="text-orion-primary"
                  ></i>
                  <i
                    v-else
                    class="ph ph-caret-up-down text-slate-400 opacity-50"
                  ></i>
                </div>
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
              <td colspan="7" class="px-6 py-8 text-center text-slate-400">
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
import { useUsers } from "~/composables/useUsers";

const { activeUsers, loading, error, refresh } = useUsers();

const searchQuery = ref("");
const statusFilter = ref("all"); // Filtre par statut
const dateStart = ref("");
const dateEnd = ref("");
const inscriptionDateStart = ref("");
const inscriptionDateEnd = ref("");
const sortColumn = ref(null);
const sortDirection = ref("asc");
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

// Filtrer les clients selon la recherche, le statut et les dates
const filteredClients = computed(() => {
  let result = enrichedActiveUsersList.value;

  // Filtre par statut
  if (statusFilter.value !== "all") {
    result = result.filter((client) => client.status === statusFilter.value);
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

// Tri des clients
const sortedClients = computed(() => {
  if (!sortColumn.value) return filteredClients.value;

  const sorted = [...filteredClients.value].sort((a, b) => {
    let aValue, bValue;

    switch (sortColumn.value) {
      case "name":
        aValue = getClientName(a).toLowerCase();
        bValue = getClientName(b).toLowerCase();
        break;
      case "status":
        aValue = a.status || "";
        bValue = b.status || "";
        break;
      case "joursRestants":
        aValue = a.joursRestants ?? Infinity;
        bValue = b.joursRestants ?? Infinity;
        break;
      case "abonnement.end":
        aValue = a.abonnement?.end ? new Date(a.abonnement.end).getTime() : 0;
        bValue = b.abonnement?.end ? new Date(b.abonnement.end).getTime() : 0;
        break;
      case "createdAt":
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection.value === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection.value === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
});

// Fonction pour trier par colonne
const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
  currentPage.value = 1; // Réinitialiser à la première page
};

// Pagination (10 éléments par page)
const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedClients.value.slice(start, end);
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

// Réinitialiser la page quand la recherche, le filtre ou les dates changent
watch(
  [
    searchQuery,
    statusFilter,
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

// Export de données
const { exportClientsToCSV } = useExport();
const { success, error: showError } = useToast();

const handleExport = () => {
  try {
    exportClientsToCSV(
      sortedClients.value,
      `clients_actifs_${new Date().toISOString().split("T")[0]}.csv`
    );
    success(
      `Export réussi : ${sortedClients.value.length} client(s) exporté(s)`
    );
  } catch (err) {
    console.error("Erreur lors de l'export:", err);
    showError("Erreur lors de l'export des données");
  }
};

// Charger les données au montage
onMounted(async () => {
  try {
    await refresh();
  } catch (err) {
    console.error("Erreur lors du chargement initial:", err);
  }
});
</script>
