/**
 * Composable pour gérer les notifications Toast
 */
export const useToast = () => {
  const toasts = ref([]);
  let toastIdCounter = 0;

  /**
   * Affiche une notification toast
   * @param {string} message - Message à afficher
   * @param {string} type - Type de toast: 'success', 'error', 'info', 'warning'
   * @param {number} duration - Durée d'affichage en ms (défaut: 3000)
   */
  const showToast = (message, type = "info", duration = 3000) => {
    const id = ++toastIdCounter;
    const toast = {
      id,
      message,
      type,
      duration,
    };

    toasts.value.push(toast);

    // Supprimer automatiquement après la durée spécifiée
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  /**
   * Affiche un toast de succès
   */
  const success = (message, duration = 3000) => {
    return showToast(message, "success", duration);
  };

  /**
   * Affiche un toast d'erreur
   */
  const error = (message, duration = 5000) => {
    return showToast(message, "error", duration);
  };

  /**
   * Affiche un toast d'information
   */
  const info = (message, duration = 3000) => {
    return showToast(message, "info", duration);
  };

  /**
   * Affiche un toast d'avertissement
   */
  const warning = (message, duration = 4000) => {
    return showToast(message, "warning", duration);
  };

  /**
   * Supprime un toast
   */
  const removeToast = (id) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  /**
   * Supprime tous les toasts
   */
  const clearAll = () => {
    toasts.value = [];
  };

  return {
    toasts: readonly(toasts),
    showToast,
    success,
    error,
    info,
    warning,
    removeToast,
    clearAll,
  };
};

