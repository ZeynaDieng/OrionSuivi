<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-medium text-slate-600">{{ title }}</h3>
      <div v-if="icon" class="text-2xl" :class="iconClass">
        {{ icon }}
      </div>
    </div>
    <div class="flex items-baseline gap-2">
      <p class="text-3xl font-bold" :class="valueClass">{{ formattedValue }}</p>
      <span v-if="trend" class="text-sm" :class="trendClass">
        {{ trend }}
      </span>
    </div>
    <p v-if="subtitle" class="text-xs text-slate-500 mt-2">{{ subtitle }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'blue', 'cyan'].includes(value)
  },
  subtitle: {
    type: String,
    default: null
  },
  trend: {
    type: String,
    default: null
  }
})

const colorConfig = {
  primary: { value: 'text-orion-primary', icon: 'text-orion-primary' },
  success: { value: 'text-orion-success', icon: 'text-emerald-500' },
  warning: { value: 'text-amber-500', icon: 'text-amber-500' },
  danger: { value: 'text-red-500', icon: 'text-red-500' },
  blue: { value: 'text-orion-blue', icon: 'text-blue-500' },
  cyan: { value: 'text-orion-cyan', icon: 'text-cyan-500' }
}

const config = colorConfig[props.color] || colorConfig.primary
const valueClass = computed(() => config.value)
const iconClass = computed(() => config.icon)

const formattedValue = computed(() => {
  return props.value.toLocaleString('fr-FR')
})

const trendClass = computed(() => {
  if (!props.trend) return ''
  if (props.trend.startsWith('+')) return 'text-emerald-600'
  if (props.trend.startsWith('-')) return 'text-red-600'
  return 'text-slate-600'
})
</script>
