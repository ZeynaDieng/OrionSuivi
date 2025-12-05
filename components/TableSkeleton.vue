<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <!-- Header Skeleton -->
    <div class="p-5 border-b border-slate-100">
      <div class="h-6 bg-slate-200 rounded w-48 animate-pulse"></div>
    </div>

    <!-- Table Skeleton -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th v-for="i in columns" :key="i" class="px-6 py-4">
              <div class="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="i in rows" :key="i" class="hover:bg-slate-50">
            <td v-for="j in columns" :key="j" class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div v-if="j === 1" class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                  <div class="space-y-2">
                    <div class="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
                    <div class="h-3 bg-slate-200 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div v-else class="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Number,
    default: 5
  },
  rows: {
    type: Number,
    default: 5
  }
})
</script>

