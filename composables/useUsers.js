import {
  getClientStatus,
  getJoursRestants,
  getActionRecommandee,
  calculateStats,
  sortClientsByPriority,
  calculateAdvancedStats,
} from "~/utils/statusLogic";

/**
 * Composable pour gérer les utilisateurs et le rafraîchissement automatique
 */
export const useUsers = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase || process.env.API_BASE_URL || "";

  // État réactif pour les données
  const users = ref([]);
  const activeUsers = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const lastUpdate = ref(null); // Timestamp de la dernière mise à jour

  // Cache simple en mémoire pour éviter les appels API inutiles
  const cache = ref({
    users: null,
    activeUsers: null,
    lastFetch: null,
    cacheDuration: 30000, // 30 secondes de cache
  });

  // Flag pour éviter les appels multiples simultanés
  const isFetching = ref(false);

  // Le rafraîchissement automatique a été désactivé

  /**
   * Extrait la liste des utilisateurs depuis la réponse API
   * Fonction optimisée pour éviter la duplication de code
   */
  const extractUsersList = (responseData) => {
    if (Array.isArray(responseData)) {
      return responseData;
    } else if (responseData?.liste && Array.isArray(responseData.liste)) {
      return responseData.liste;
    } else if (responseData?.data && Array.isArray(responseData.data)) {
      return responseData.data;
    } else if (responseData?.response && Array.isArray(responseData.response)) {
      return responseData.response;
    } else if (responseData?.users && Array.isArray(responseData.users)) {
      return responseData.users;
    } else if (responseData?.result && Array.isArray(responseData.result)) {
      return responseData.result;
    } else if (responseData && typeof responseData === "object") {
      const keys = Object.keys(responseData);
      for (const key of keys) {
        if (Array.isArray(responseData[key])) {
          return responseData[key];
        }
      }
    }
    return [];
  };

  /**
   * Récupère la liste complète des utilisateurs depuis /user/globalstat
   * Cette API retourne tous les users pour calculer les statistiques
   * Optimisé avec cache et protection contre les appels multiples
   */
  const fetchUsers = async (forceRefresh = false) => {
    // Vérifier le cache si pas de rafraîchissement forcé
    if (!forceRefresh && cache.value.users && cache.value.lastFetch) {
      const cacheAge = Date.now() - cache.value.lastFetch;
      if (cacheAge < cache.value.cacheDuration) {
        console.log("✅ Utilisation du cache pour les utilisateurs");
        users.value = cache.value.users;
        return users.value;
      }
    }

    // Éviter les appels multiples simultanés
    if (isFetching.value) {
      console.log("⏳ Appel API déjà en cours, attente...");
      // Attendre que l'appel en cours se termine
      while (isFetching.value) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return users.value;
    }

    try {
      isFetching.value = true;
      loading.value = true;
      error.value = null;

      // Si pas d'URL de base configurée, retourner un tableau vide
      if (!baseURL) {
        console.warn(
          "API base URL non configurée. Utilisez la variable d'environnement API_BASE_URL ou configurez public.apiBase dans nuxt.config.ts"
        );
        users.value = [];
        loading.value = false;
        isFetching.value = false;
        return [];
      }

      console.log("📡 Appel API: /user/globalstat");
      const url = `${baseURL}/user/globalstat`;
      console.log("🔗 URL complète:", url);

      // Utiliser $fetch avec options optimisées
      // Timeout de 60 secondes, mais avec retry et compression
      const startTime = Date.now();
      const responseData = await $fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate, br", // Compression pour réduire la taille
        },
        timeout: 60000,
        retry: 1, // 1 tentative de retry en cas d'échec
        retryDelay: 1000, // 1 seconde entre les tentatives
      }).catch((err) => {
        console.error("❌ Erreur lors de l'appel API:", err);
        console.error("❌ Détails de l'erreur:", {
          message: err.message,
          status: err.status,
          statusCode: err.statusCode,
          statusText: err.statusText,
          data: err.data,
          response: err.response,
        });

        // Gestion spéciale pour les timeouts
        if (err.message && err.message.includes("timeout")) {
          error.value = new Error(
            "L'API prend trop de temps à répondre (timeout après 60 secondes). " +
              "Vérifiez votre connexion internet ou contactez l'administrateur."
          );
        } else {
          error.value = err;
        }

        throw err;
      });

      const fetchDuration = Date.now() - startTime;
      console.log(`⏱️ Temps de chargement: ${fetchDuration}ms`);

      // Extraction optimisée des données
      const usersList = extractUsersList(responseData);

      if (usersList.length > 0) {
        console.log(
          `✅ ${usersList.length} utilisateurs chargés depuis /user/globalstat en ${fetchDuration}ms`
        );
        if (responseData?.nbr) {
          console.log(`📊 Nombre total déclaré (nbr): ${responseData.nbr}`);
        }
      } else {
        console.warn("⚠️ Aucun utilisateur trouvé dans la réponse");
      }

      // Mettre à jour le cache
      users.value = usersList;
      cache.value.users = usersList;
      cache.value.lastFetch = Date.now();

      return users.value;
    } catch (err) {
      error.value = err;
      console.error("❌ Erreur lors de la récupération des utilisateurs:", err);
      // En cas d'erreur, utiliser le cache si disponible
      if (cache.value.users) {
        console.log("⚠️ Utilisation du cache en cas d'erreur");
        users.value = cache.value.users;
        return users.value;
      }
      users.value = [];
      return [];
    } finally {
      loading.value = false;
      isFetching.value = false;
    }
  };

  /**
   * Récupère la liste des utilisateurs actifs du mois en cours depuis /user/globalstatv1
   * Cette API retourne les users actifs pour référence/cross-check
   * Optimisé avec cache
   */
  const fetchActiveUsers = async (forceRefresh = false) => {
    // Vérifier le cache si pas de rafraîchissement forcé
    if (!forceRefresh && cache.value.activeUsers && cache.value.lastFetch) {
      const cacheAge = Date.now() - cache.value.lastFetch;
      if (cacheAge < cache.value.cacheDuration) {
        console.log("✅ Utilisation du cache pour les utilisateurs actifs");
        activeUsers.value = cache.value.activeUsers;
        return activeUsers.value;
      }
    }

    try {
      // Ne pas bloquer le chargement principal si cette API échoue
      if (!baseURL) {
        activeUsers.value = [];
        return [];
      }

      console.log("📡 Appel API: /user/globalstatv1");
      const url = `${baseURL}/user/globalstatv1`;
      console.log("🔗 URL complète:", url);

      const startTime = Date.now();
      // Utiliser $fetch avec options optimisées
      const responseData = await $fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate, br",
        },
        timeout: 60000,
        retry: 1,
        retryDelay: 1000,
      }).catch((err) => {
        console.warn(
          "⚠️ Erreur lors de la récupération des users actifs (non bloquant):",
          {
            message: err.message,
            status: err.status,
            statusCode: err.statusCode,
            statusText: err.statusText,
            data: err.data,
          }
        );
        return null;
      });

      if (!responseData) {
        // En cas d'erreur, utiliser le cache si disponible
        if (cache.value.activeUsers) {
          console.log("⚠️ Utilisation du cache en cas d'erreur");
          activeUsers.value = cache.value.activeUsers;
          return activeUsers.value;
        }
        activeUsers.value = [];
        return [];
      }

      const fetchDuration = Date.now() - startTime;
      console.log(`⏱️ Temps de chargement actifs: ${fetchDuration}ms`);

      // Extraction optimisée des données
      const activeUsersList = extractUsersList(responseData);

      if (activeUsersList.length > 0) {
        console.log(
          `✅ ${activeUsersList.length} utilisateurs actifs chargés depuis /user/globalstatv1 en ${fetchDuration}ms`
        );
        if (responseData?.nbr) {
          console.log(`📊 Nombre total déclaré (nbr): ${responseData.nbr}`);
        }
      }

      // Mettre à jour le cache
      activeUsers.value = activeUsersList;
      cache.value.activeUsers = activeUsersList;
      cache.value.lastFetch = Date.now();

      return activeUsers.value;
    } catch (err) {
      // Ne pas bloquer si cette API échoue, ce n'est qu'une référence
      console.warn(
        "⚠️ Erreur lors de la récupération des utilisateurs actifs (non bloquant):",
        err
      );
      activeUsers.value = [];
      return [];
    }
  };

  /**
   * Rafraîchit toutes les données depuis les deux API
   * - /user/globalstat : Liste complète pour calculer les stats
   * - /user/globalstatv1 : Users actifs du mois (référence)
   * Optimisé avec rafraîchissement forcé et parallélisation
   */
  const refresh = async (forceRefresh = false) => {
    try {
      const startTime = Date.now();

      // Appeler les deux API en parallèle pour optimiser le temps de chargement
      // La première est prioritaire pour les stats, la seconde est optionnelle
      await Promise.allSettled([
        fetchUsers(forceRefresh), // Prioritaire - nécessaire pour les stats
        fetchActiveUsers(forceRefresh), // Optionnel - pour référence
      ]);

      const refreshDuration = Date.now() - startTime;
      console.log(`🔄 Données rafraîchies avec succès en ${refreshDuration}ms`);
    } catch (err) {
      console.error("❌ Erreur lors du rafraîchissement:", err);
    }
  };

  // Le rafraîchissement automatique a été désactivé - les données ne se mettent à jour que lors d'un rafraîchissement manuel

  /**
   * Enrichit les clients avec les informations calculées (statut, jours restants, action)
   */
  const enrichClients = (clients) => {
    return clients.map((client) => ({
      ...client,
      status: getClientStatus(client),
      joursRestants: getJoursRestants(client),
      actionRecommandee: getActionRecommandee(getClientStatus(client)),
    }));
  };

  /**
   * Retourne les clients enrichis avec leurs statuts
   */
  const enrichedUsers = computed(() => {
    return enrichClients(users.value);
  });

  /**
   * Retourne les statistiques calculées à partir de la liste complète des users
   * Les stats sont calculées en analysant chaque user (actif, proche fin, expiré)
   */
  const stats = computed(() => {
    const calculatedStats = calculateStats(users.value);

    // Log pour debug
    if (users.value.length > 0) {
      console.log("📊 Statistiques calculées:", calculatedStats);
    }

    return calculatedStats;
  });

  /**
   * Retourne les clients triés par priorité
   */
  const sortedUsers = computed(() => {
    return sortClientsByPriority(enrichedUsers.value);
  });

  /**
   * Retourne les clients nécessitant une action aujourd'hui (expirés + proche fin)
   */
  const clientsToAction = computed(() => {
    return sortedUsers.value.filter(
      (client) => client.status === "expire" || client.status === "proche_fin"
    );
  });

  /**
   * Retourne les statistiques avancées calculées à partir des données API
   */
  const advancedStats = computed(() => {
    return calculateAdvancedStats(users.value);
  });

  // Le rafraîchissement automatique a été désactivé

  return {
    // Données
    users: readonly(users),
    activeUsers: readonly(activeUsers),
    enrichedUsers,
    sortedUsers,
    clientsToAction,
    stats,
    advancedStats,

    // États
    loading: readonly(loading),
    error: readonly(error),
    lastUpdate: readonly(lastUpdate),

    // Méthodes
    fetchUsers,
    fetchActiveUsers,
    refresh,
  };
};
