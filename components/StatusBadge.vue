<template>
  <span 
    :class="badgeClass"
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
  >
    <span v-if="showDot" :class="dotClass" class="w-1.5 h-1.5 rounded-full"></span>
    {{ label }}
    <span v-if="joursRestants !== null && joursRestants !== undefined" class="text-xs opacity-75">
      ({{ joursRestants }}j)
    </span>
  </span>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['actif', 'proche_fin', 'expire'].includes(value)
  },
  joursRestants: {
    type: Number,
    default: null
  },
  showDot: {
    type: Boolean,
    default: true
  }
})

const badgeConfig = {
  actif: {
    label: 'Actif',
    bgClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dotClass: 'bg-emerald-500'
  },
  proche_fin: {
    label: 'Proche fin',
    bgClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    dotClass: 'bg-amber-500'
  },
  expire: {
    label: 'Expiré',
    bgClass: 'bg-red-50 text-red-700 border border-red-200',
    dotClass: 'bg-red-500'
  }
}

const config = badgeConfig[props.status] || badgeConfig.actif
const badgeClass = computed(() => config.bgClass)
const dotClass = computed(() => config.dotClass)
const label = computed(() => config.label)
</script>
