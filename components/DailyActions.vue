<template>
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden"
  >
    <div
      class="p-5 border-b border-slate-100 flex justify-between items-center"
    >
      <h3 class="text-lg font-bold text-orion-primary">Actions du jour</h3>
      <span class="text-xs text-slate-500">{{ clients.length }} client(s)</span>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th
              class="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
            >
              Client
            </th>
            <th
              class="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
            >
              Statut
            </th>
            <th
              class="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
            >
              Jours restants
            </th>
            <th
              class="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
            >
              Action
            </th>
            <th
              class="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="client in paginatedClients"
            :key="client.id || client._id"
            class="hover:bg-slate-50 transition-colors"
          >
            <td class="px-5 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 rounded-full bg-orion-primary flex items-center justify-center text-white text-xs font-bold"
                  >
                    {{ getInitials(getClientName(client)) }}
                  </div>
                </div>
                <div>
                  <div class="text-sm font-medium text-slate-900">
                    {{ getClientName(client) }}
                  </div>
                  <div
                    v-if="getClientEmail(client)"
                    class="text-xs text-slate-500"
                  >
                    {{ getClientEmail(client) }}
                  </div>
                  <div
                    v-if="getAdminNames(client).length > 0"
                    class="text-xs text-slate-400 mt-0.5"
                  >
                    👤 {{ getAdminNames(client).join(", ") }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-5 py-4 whitespace-nowrap">
              <StatusBadge
                :status="client.status"
                :jours-restants="client.joursRestants"
              />
            </td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-slate-600">
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
            <td class="px-5 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <span
                  class="text-xs font-medium"
                  :class="actionClass(client.actionRecommandee)"
                >
                  {{ client.actionRecommandee }}
                </span>
                <button
                  v-if="client.status !== 'actif'"
                  @click="$emit('relancer', client)"
                  class="px-3 py-1.5 text-xs font-medium bg-orion-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Relancer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="clients.length === 0" class="p-8 text-center text-slate-500">
      <p>Aucun client nécessitant une action aujourd'hui.</p>
    </div>

    <!-- Pagination -->
    <div
      v-if="clients.length > itemsPerPage"
      class="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50"
    >
      <div class="text-sm text-slate-600">
        Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à
        {{ Math.min(currentPage * itemsPerPage, clients.length) }} sur
        {{ clients.length }} résultats
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
</template>

<script setup>
const props = defineProps({
  clients: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["relancer"]);

// Pagination pour Actions du jour (5 éléments par page)
const currentPage = ref(1);
const itemsPerPage = 5;

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return props.clients.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(props.clients.length / itemsPerPage);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Réinitialiser la page quand la liste change
watch(
  () => props.clients.length,
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

const actionClass = (action) => {
  if (action === "URGENT – Appeler") return "text-red-600";
  if (action === "Relancer") return "text-amber-600";
  return "text-slate-500";
};
</script>
