<template>
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
  >
    <div class="p-6 border-b border-slate-100">
      <h3 class="text-lg font-bold text-orion-primary flex items-center gap-2">
        <i class="ph ph-chart-line text-xl"></i>
        Statistiques Financières
      </h3>
    </div>

    <div class="p-6 space-y-6">
      <!-- Statistiques Financières -->
      <div>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="bg-slate-50 rounded-lg p-4">
            <p class="text-xs text-slate-500 mb-1">Total Factures</p>
            <p class="text-2xl font-bold text-orion-primary">
              {{ formatNumber(advancedStats.financial.totalFactures) }}
            </p>
          </div>
          <div class="bg-slate-50 rounded-lg p-4">
            <p class="text-xs text-slate-500 mb-1">Total Transactions</p>
            <p class="text-2xl font-bold text-orion-blue">
              {{ formatNumber(advancedStats.financial.totalTransactions) }}
            </p>
          </div>
          <div class="bg-slate-50 rounded-lg p-4">
            <p class="text-xs text-slate-500 mb-1">Factures Impayées</p>
            <p class="text-2xl font-bold text-orion-danger">
              {{ formatNumber(advancedStats.financial.totalImpayees) }}
            </p>
          </div>
          <div class="bg-slate-50 rounded-lg p-4">
            <p class="text-xs text-slate-500 mb-1">Moy. Factures</p>
            <p class="text-2xl font-bold text-slate-700">
              {{ formatNumber(advancedStats.financial.moyenneFactures) }}
            </p>
          </div>
          <div class="bg-slate-50 rounded-lg p-4">
            <p class="text-xs text-slate-500 mb-1">Moy. Transactions</p>
            <p class="text-2xl font-bold text-slate-700">
              {{ formatNumber(advancedStats.financial.moyenneTransactions) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Statistiques par Devise -->
      <div v-if="Object.keys(advancedStats.byCurrency).length > 0">
        <h4
          class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"
        >
          <i class="ph ph-globe"></i>
          Répartition par Devise
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(data, currency) in advancedStats.byCurrency"
            :key="currency"
            class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100"
          >
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-semibold text-slate-700 uppercase">
                {{ currency }}
              </p>
              <span
                class="text-xs bg-white px-2 py-1 rounded-full text-slate-600"
              >
                {{ data.count }} clients
              </span>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-slate-600">
                <span class="font-medium">{{
                  formatNumber(data.factures)
                }}</span>
                factures
              </p>
              <p class="text-xs text-slate-600">
                <span class="font-medium">{{
                  formatNumber(data.transactions)
                }}</span>
                transactions
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques Temporelles -->
      <div>
        <h4
          class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"
        >
          <i class="ph ph-calendar"></i>
          Nouveaux Clients (Ce Mois)
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
            <p class="text-xs text-slate-600 mb-1">Total Nouveaux</p>
            <p class="text-2xl font-bold text-emerald-700">
              {{ advancedStats.temporal.nouveauxCeMois }}
            </p>
          </div>
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p class="text-xs text-slate-600 mb-1">Déjà Actifs</p>
            <p class="text-2xl font-bold text-blue-700">
              {{ advancedStats.temporal.nouveauxCeMoisActifs }}
            </p>
            <p class="text-xs text-slate-500 mt-1">
              {{
                advancedStats.temporal.nouveauxCeMois > 0
                  ? Math.round(
                      (advancedStats.temporal.nouveauxCeMoisActifs /
                        advancedStats.temporal.nouveauxCeMois) *
                        100
                    )
                  : 0
              }}% d'activation
            </p>
          </div>
        </div>
      </div>

      <!-- Statistiques d'Abonnement -->
      <div>
        <h4
          class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"
        >
          <i class="ph ph-credit-card"></i>
          Abonnements
        </h4>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-slate-50 rounded-lg p-4">
            <p class="text-xs text-slate-500 mb-1">Avec Abonnement</p>
            <p class="text-2xl font-bold text-orion-primary">
              {{ advancedStats.subscription.avecAbonnement }}
            </p>
          </div>
          <div class="bg-slate-50 rounded-lg p-4">
            <p class="text-xs text-slate-500 mb-1">Sans Abonnement</p>
            <p class="text-2xl font-bold text-slate-600">
              {{ advancedStats.subscription.sansAbonnement }}
            </p>
          </div>
          <div class="bg-slate-50 rounded-lg p-4">
            <p class="text-xs text-slate-500 mb-1">Durée Moyenne</p>
            <p class="text-2xl font-bold text-orion-blue">
              {{ advancedStats.subscription.dureeMoyenne }} mois
            </p>
          </div>
        </div>
      </div>

      <!-- Répartition par Durée -->
      <div v-if="Object.keys(advancedStats.byDuration).length > 0">
        <h4
          class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"
        >
          <i class="ph ph-clock"></i>
          Répartition par Durée d'Abonnement
        </h4>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(count, duree) in advancedStats.byDuration"
            :key="duree"
            class="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2"
          >
            <span class="text-sm font-semibold text-amber-800"
              >{{ duree }} mois</span
            >
            <span class="text-xs text-amber-600 ml-2"
              >({{ count }} clients)</span
            >
          </div>
        </div>
      </div>

      <!-- Top Clients par Activité -->
      <div v-if="advancedStats.activity.topClients.length > 0">
        <h4
          class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"
        >
          <i class="ph ph-trophy"></i>
          Top 5 Clients par Activité
        </h4>
        <div class="space-y-2">
          <div
            v-for="(client, index) in advancedStats.activity.topClients"
            :key="index"
            class="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-orion-primary flex items-center justify-center text-white text-xs font-bold"
              >
                {{ index + 1 }}
              </div>
              <div>
                <p class="text-sm font-medium text-slate-900">
                  {{ client.name }}
                </p>
                <p class="text-xs text-slate-500">
                  {{ client.transactions }} transactions •
                  {{ client.factures }} factures
                </p>
              </div>
            </div>
            <StatusBadge :status="client.status" :jours-restants="null" />
          </div>
        </div>
      </div>

      <!-- Statistiques d'Activité -->
      <div>
        <h4
          class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"
        >
          <i class="ph ph-activity"></i>
          Activité Globale
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
            <p class="text-xs text-slate-600 mb-1">Avec Transactions</p>
            <p class="text-2xl font-bold text-emerald-700">
              {{ advancedStats.activity.clientsAvecTransactions }}
            </p>
          </div>
          <div class="bg-slate-50 rounded-lg p-4">
            <p class="text-xs text-slate-500 mb-1">Sans Transactions</p>
            <p class="text-2xl font-bold text-slate-600">
              {{ advancedStats.activity.clientsSansTransactions }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { calculateAdvancedStats } from "~/utils/statusLogic";

const props = defineProps({
  clients: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const advancedStats = computed(() => {
  return calculateAdvancedStats(props.clients);
});

const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("fr-FR").format(num);
};
</script>
