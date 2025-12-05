/**
 * Détermine le statut d'un client
 * @param {Object} client - Le client avec activeAbonnement et abonnement.end
 * @returns {string} - 'actif', 'proche_fin', ou 'expire'
 */
export const getClientStatus = (client) => {
  if (!client) return 'expire'
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const endDate = client.abonnement?.end ? new Date(client.abonnement.end) : null
  
  if (!endDate) {
    return client.activeAbonnement ? 'actif' : 'expire'
  }
  
  endDate.setHours(0, 0, 0, 0)
  
  const diffTime = endDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Si expiré
  if (!client.activeAbonnement || diffDays < 0) {
    return 'expire'
  }
  
  // Si proche fin (0 à 10 jours)
  if (diffDays <= 10) {
    return 'proche_fin'
  }
  
  // Sinon actif
  return 'actif'
}

/**
 * Calcule le nombre de jours restants avant la fin de l'abonnement
 * @param {Object} client - Le client avec abonnement.end
 * @returns {number|null} - Nombre de jours restants ou null
 */
export const getJoursRestants = (client) => {
  if (!client?.abonnement?.end) return null
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const endDate = new Date(client.abonnement.end)
  endDate.setHours(0, 0, 0, 0)
  
  const diffTime = endDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * Détermine l'action recommandée selon le statut
 * @param {string} status - Le statut du client
 * @returns {string} - L'action recommandée
 */
export const getActionRecommandee = (status) => {
  const actions = {
    actif: 'RAS',
    proche_fin: 'Relancer',
    expire: 'URGENT – Appeler'
  }
  
  return actions[status] || 'RAS'
}

/**
 * Calcule les statistiques globales
 * @param {Array} clients - Liste des clients
 * @returns {Object} - Statistiques (total, actifs, proche_fin, expires)
 */
export const calculateStats = (clients) => {
  if (!clients || clients.length === 0) {
    return {
      total: 0,
      actifs: 0,
      proche_fin: 0,
      expires: 0
    }
  }
  
  const stats = {
    total: clients.length,
    actifs: 0,
    proche_fin: 0,
    expires: 0
  }
  
  clients.forEach(client => {
    const status = getClientStatus(client)
    if (status === 'actif') stats.actifs++
    else if (status === 'proche_fin') stats.proche_fin++
    else if (status === 'expire') stats.expires++
  })
  
  return stats
}

/**
 * Trie les clients par priorité (expirés > proche fin > actifs)
 * @param {Array} clients - Liste des clients
 * @returns {Array} - Liste triée
 */
export const sortClientsByPriority = (clients) => {
  if (!clients || clients.length === 0) return []
  
  const priority = { expire: 1, proche_fin: 2, actif: 3 }
  
  return [...clients].sort((a, b) => {
    const statusA = getClientStatus(a)
    const statusB = getClientStatus(b)
    return priority[statusA] - priority[statusB]
  })
}

/**
 * Calcule les statistiques avancées basées sur les données API
 * @param {Array} clients - Liste des clients
 * @returns {Object} - Statistiques avancées
 */
export const calculateAdvancedStats = (clients) => {
  if (!clients || clients.length === 0) {
    return {
      financial: {
        totalFactures: 0,
        totalTransactions: 0,
        totalImpayees: 0,
        moyenneFactures: 0,
        moyenneTransactions: 0
      },
      byCurrency: {},
      byDuration: {},
      temporal: {
        nouveauxCeMois: 0,
        nouveauxCeMoisActifs: 0
      },
      activity: {
        clientsAvecTransactions: 0,
        clientsSansTransactions: 0,
        topClients: []
      },
      subscription: {
        avecAbonnement: 0,
        sansAbonnement: 0,
        dureeMoyenne: 0
      }
    }
  }

  const stats = {
    financial: {
      totalFactures: 0,
      totalTransactions: 0,
      totalImpayees: 0,
      moyenneFactures: 0,
      moyenneTransactions: 0
    },
    byCurrency: {},
    byDuration: {},
    temporal: {
      nouveauxCeMois: 0,
      nouveauxCeMoisActifs: 0
    },
    activity: {
      clientsAvecTransactions: 0,
      clientsSansTransactions: 0,
      topClients: []
    },
    subscription: {
      avecAbonnement: 0,
      sansAbonnement: 0,
      dureeMoyenne: 0
    }
  }

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  let totalDuree = 0
  let countDuree = 0

  clients.forEach(client => {
    // Statistiques financières
    const factures = client.factures || 0
    const transactions = client.transactions || 0
    const impayees = client.impayees || 0

    stats.financial.totalFactures += factures
    stats.financial.totalTransactions += transactions
    stats.financial.totalImpayees += impayees

    // Statistiques par devise
    const currency = client.currency || 'unknown'
    if (!stats.byCurrency[currency]) {
      stats.byCurrency[currency] = {
        count: 0,
        factures: 0,
        transactions: 0
      }
    }
    stats.byCurrency[currency].count++
    stats.byCurrency[currency].factures += factures
    stats.byCurrency[currency].transactions += transactions

    // Statistiques par durée d'abonnement
    if (client.abonnement?.duree) {
      const duree = client.abonnement.duree
      if (!stats.byDuration[duree]) {
        stats.byDuration[duree] = 0
      }
      stats.byDuration[duree]++
      totalDuree += duree
      countDuree++
    }

    // Statistiques temporelles (nouveaux clients ce mois)
    if (client.createdAt) {
      const createdAt = new Date(client.createdAt)
      if (createdAt >= firstDayOfMonth) {
        stats.temporal.nouveauxCeMois++
        if (getClientStatus(client) === 'actif') {
          stats.temporal.nouveauxCeMoisActifs++
        }
      }
    }

    // Statistiques d'activité
    if (transactions > 0) {
      stats.activity.clientsAvecTransactions++
    } else {
      stats.activity.clientsSansTransactions++
    }

    // Statistiques d'abonnement
    if (client.activeAbonnement && client.abonnement) {
      stats.subscription.avecAbonnement++
    } else {
      stats.subscription.sansAbonnement++
    }
  })

  // Calcul des moyennes
  const clientsCount = clients.length
  stats.financial.moyenneFactures = clientsCount > 0 
    ? Math.round(stats.financial.totalFactures / clientsCount) 
    : 0
  stats.financial.moyenneTransactions = clientsCount > 0 
    ? Math.round(stats.financial.totalTransactions / clientsCount) 
    : 0

  // Durée moyenne d'abonnement
  stats.subscription.dureeMoyenne = countDuree > 0 
    ? Math.round((totalDuree / countDuree) * 10) / 10 
    : 0

  // Top 5 clients par nombre de transactions
  stats.activity.topClients = [...clients]
    .sort((a, b) => (b.transactions || 0) - (a.transactions || 0))
    .slice(0, 5)
    .map(client => ({
      name: client.store || client.name || 'Client inconnu',
      transactions: client.transactions || 0,
      factures: client.factures || 0,
      status: getClientStatus(client)
    }))

  return stats
}
