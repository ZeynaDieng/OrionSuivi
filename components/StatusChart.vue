<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-bold text-orion-primary">Répartition des statuts</h3>
      <button class="text-slate-400 hover:text-orion-blue transition-colors">
        <PhDotsThree :size="24" />
      </button>
    </div>
    
    <div class="flex-1 flex items-center justify-center relative w-full h-64 md:h-80">
      <Doughnut v-if="hasData" :data="chartData" :options="chartOptions" />
      <div v-else class="text-center text-slate-400">
        <p class="text-sm">Aucune donnée disponible</p>
      </div>
    </div>
    
    <div class="mt-6 grid grid-cols-3 gap-4 border-t border-slate-50 pt-4">
      <div v-for="(stat, index) in stats" :key="index" class="text-center">
        <span :class="stat.color" class="block w-2 h-2 rounded-full mx-auto mb-1"></span>
        <span class="block text-xs text-slate-500">{{ stat.label }}</span>
        <span class="block font-bold text-orion-primary">{{ stat.value }}</span>
        <span class="block text-xs text-slate-400">{{ stat.percentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { PhDotsThree } from '@phosphor-icons/vue'
import { computed } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      total: 0,
      actifs: 0,
      proche_fin: 0,
      expires: 0
    })
  }
})

const hasData = computed(() => {
  return (props.stats?.total || 0) > 0
})

const chartData = computed(() => {
  return {
    labels: ['Actifs', 'Proche fin', 'Expirés'],
    datasets: [{
      data: [
        props.stats?.actifs || 0, 
        props.stats?.proche_fin || 0, 
        props.stats?.expires || 0
      ],
      backgroundColor: [
        '#00C48C', // orion-success
        '#F7C948', // orion-warning
        '#FF4D4F'  // orion-danger
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#0B0F3B',
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: function(context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = total > 0 ? Math.round((context.parsed / total) * 100) : 0
          return `${context.label}: ${context.parsed} (${percentage}%)`
        }
      }
    }
  }
}

const stats = computed(() => {
  const total = props.stats.total || 1
  const actifs = props.stats.actifs || 0
  const procheFin = props.stats.proche_fin || 0
  const expires = props.stats.expires || 0
  
  return [
    {
      label: 'Actifs',
      value: actifs,
      percentage: Math.round((actifs / total) * 100),
      color: 'bg-orion-success'
    },
    {
      label: 'Attention',
      value: procheFin,
      percentage: Math.round((procheFin / total) * 100),
      color: 'bg-orion-warning'
    },
    {
      label: 'Critique',
      value: expires,
      percentage: Math.round((expires / total) * 100),
      color: 'bg-orion-danger'
    }
  ]
})
</script>
