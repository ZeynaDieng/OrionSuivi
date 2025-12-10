<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click.self="close"
      >
        <div
          class="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Header -->
          <div class="p-6 border-b border-slate-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-orion-primary">
                Relancer un client
              </h3>
              <button
                @click="close"
                class="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Fermer"
              >
                <i class="ph ph-x text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div v-if="client" class="p-6 space-y-4">
            <!-- Informations client -->
            <div class="space-y-3">
              <div>
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Client
                </label>
                <p class="mt-1 text-sm font-medium text-slate-900">
                  {{ getClientName(client) }}
                </p>
                <p v-if="getClientEmail(client)" class="text-xs text-slate-500">
                  {{ getClientEmail(client) }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Statut
                  </label>
                  <div class="mt-1">
                    <StatusBadge
                      :status="client.status"
                      :jours-restants="client.joursRestants"
                    />
                  </div>
                </div>

                <div>
                  <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Jours restants
                  </label>
                  <p class="mt-1 text-sm text-slate-900">
                    {{ client.joursRestants ?? "—" }} jour(s)
                  </p>
                </div>
              </div>

              <div v-if="client.abonnement?.end">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date de fin d'abonnement
                </label>
                <p class="mt-1 text-sm text-slate-900">
                  {{ formatDate(client.abonnement.end) }}
                </p>
              </div>
            </div>

            <!-- Note/Commentaire -->
            <div>
              <label
                for="relance-note"
                class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2"
              >
                Note (optionnel)
              </label>
              <textarea
                id="relance-note"
                v-model="note"
                rows="3"
                placeholder="Ajouter une note ou un commentaire..."
                class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orion-blue focus:border-orion-blue resize-none bg-white text-slate-900 placeholder-slate-400"
              ></textarea>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              @click="close"
              class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="handleConfirm"
              class="px-4 py-2 text-sm font-medium text-white bg-orion-primary rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-2"
            >
              <i class="ph ph-paper-plane-tilt"></i>
              Confirmer la relance
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
// Fonctions utilitaires pour obtenir le nom et l'email du client
const getClientName = (client) => {
  if (!client) return "Client inconnu";
  if (client.name) return client.name;
  if (client.store) return client.store;
  if (client.email) return client.email;
  if (client.admin && client.admin.length > 0 && client.admin[0].name) {
    return client.admin[0].name;
  }
  return "Client inconnu";
};

const getClientEmail = (client) => {
  if (!client) return null;
  if (client.email) return client.email;
  if (client.admin && Array.isArray(client.admin) && client.admin.length > 0) {
    const admin = client.admin.find(
      (a) => a.role === "admin" && !a.deleted && a.email
    );
    if (admin?.email) return admin.email;
  }
  return null;
};

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "confirm"]);

const note = ref("");

const close = () => {
  note.value = "";
  emit("close");
};

const handleConfirm = () => {
  emit("confirm", {
    client: props.client,
    note: note.value,
  });
  close();
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

// Réinitialiser la note quand le client change
watch(
  () => props.client,
  () => {
    note.value = "";
  }
);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}
</style>

