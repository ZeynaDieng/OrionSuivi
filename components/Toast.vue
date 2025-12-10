<template>
  <Teleport to="body">
    <div
      v-if="toasts.length > 0"
      class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full"
    >
      <TransitionGroup
        name="toast"
        tag="div"
        class="flex flex-col gap-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="getToastClasses(toast.type)"
          class="px-4 py-3 rounded-lg shadow-lg border flex items-start gap-3 animate-slide-in"
        >
          <!-- Icône -->
          <div class="flex-shrink-0 mt-0.5">
            <i :class="getIconClass(toast.type)" class="text-lg"></i>
          </div>

          <!-- Message -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium">{{ toast.message }}</p>
          </div>

          <!-- Bouton de fermeture -->
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Fermer"
          >
            <i class="ph ph-x text-lg"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
const { toasts, removeToast } = useToast();

const getToastClasses = (type) => {
  const baseClasses = "bg-white";
  const typeClasses = {
    success: "border-emerald-200 text-emerald-800 bg-emerald-50",
    error: "border-red-200 text-red-800 bg-red-50",
    info: "border-blue-200 text-blue-800 bg-blue-50",
    warning: "border-amber-200 text-amber-800 bg-amber-50",
  };
  return `${baseClasses} ${typeClasses[type] || typeClasses.info}`;
};

const getIconClass = (type) => {
  const icons = {
    success: "ph ph-check-circle text-emerald-600",
    error: "ph ph-x-circle text-red-600",
    info: "ph ph-info text-blue-600",
    warning: "ph ph-warning text-amber-600",
  };
  return icons[type] || icons.info;
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease;
}
</style>

