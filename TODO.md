# 📋 Liste des Tâches Détaillée - Dashboard Orion

## 📊 Vue d'ensemble

**Projet:** Dashboard de Suivi Clientèle Orion  
**Version:** 1.0  
**Technologies principales:**

- ✅ **Nuxt 3** (Framework principal)
- ✅ **TailwindCSS** (Styling et design)
- Vue 3 Composition API
- vue-chart-3 ou Chart.js (pour les graphiques)

---

## ✅ Checklist Détaillée

### 1. Structure du Projet Nuxt 3 ✅

- [x] Initialiser le projet Nuxt 3

  - [x] Créer `package.json` avec dépendances nécessaires
  - [x] Installer Nuxt 3
  - [x] Installer TailwindCSS et configurer
  - [x] Installer vue-chart-3 ou Chart.js (vue-chartjs + chart.js)
  - [x] Configurer les modules Nuxt nécessaires

- [x] Créer `nuxt.config.ts`

  - [x] Configurer TailwindCSS
  - [x] Configurer les modules
  - [x] Configurer l'environnement (variables d'API si nécessaire)
  - [x] Configurer les alias de chemins

- [x] Créer `tailwind.config.js`

  - [x] Configurer les couleurs personnalisées Orion (primary, blue, cyan, success, warning, danger, light)
  - [x] Configurer les breakpoints responsive
  - [x] Ajouter les plugins nécessaires

- [x] Créer la structure de dossiers

  - [x] `composables/` - pour les composables
  - [x] `components/` - pour les composants Vue
  - [x] `pages/` - pour les pages
  - [x] `utils/` - pour les fonctions utilitaires (si nécessaire)

- [x] Créer les fichiers de configuration de base
  - [x] `.gitignore`
  - [x] `README.md` (si nécessaire)
  - [x] Fichiers de configuration TypeScript (si utilisé)

---

### 2. Composable useUsers.js

- [ ] Créer le fichier `composables/useUsers.js`

  - [ ] Importer les fonctions Nuxt nécessaires (`useAsyncData`, `useFetch`, etc.)

- [ ] Implémenter la fonction de récupération des utilisateurs

  - [ ] Créer fonction pour appeler `GET /users`
  - [ ] Créer fonction pour appeler `GET /users/actifs`
  - [ ] Gérer les erreurs API
  - [ ] Gérer les états de chargement

- [ ] Implémenter le rafraîchissement automatique toutes les 30 secondes

  - [ ] Utiliser `useAsyncData` avec `watch`
  - [ ] Créer un interval de 30 secondes
  - [ ] Implémenter `refresh()` pour forcer le rafraîchissement
  - [ ] Nettoyer l'interval lors du démontage du composant

- [ ] Retourner les données réactives

  - [ ] Retourner la liste des utilisateurs
  - [ ] Retourner l'état de chargement
  - [ ] Retourner les erreurs éventuelles
  - [ ] Retourner la fonction de refresh

- [ ] Tester le composable
  - [ ] Vérifier que les données sont bien récupérées
  - [ ] Vérifier que le rafraîchissement fonctionne toutes les 30s
  - [ ] Vérifier la gestion des erreurs

---

### 3. Logique Métier - Statuts et Calculs

- [ ] Créer le fichier `utils/statusLogic.js` ou dans le composable

  - [ ] Fonction pour déterminer le statut d'un client
    - [ ] Vérifier `activeAbonnement == true` ET `end > aujourd'hui` → **Actif** 🟢
    - [ ] Vérifier `0 < end - aujourd'hui ≤ 10 jours` → **Proche fin** 🟡
    - [ ] Vérifier `end < aujourd'hui` OU `activeAbonnement == false` → **Expiré** 🔴

- [ ] Fonction pour calculer les jours restants

  - [ ] `jours_restants = end - today`
  - [ ] Gérer les cas négatifs (expiré)
  - [ ] Retourner un nombre entier

- [ ] Fonction pour déterminer l'action recommandée

  - [ ] Actif → "RAS"
  - [ ] Proche fin → "Relancer"
  - [ ] Expiré → "URGENT – Appeler"

- [ ] Fonction pour calculer les statistiques globales

  - [ ] Compter le nombre total de clients
  - [ ] Compter les clients actifs
  - [ ] Compter les clients proche fin
  - [ ] Compter les clients expirés

- [ ] Fonction pour trier les clients par priorité

  - [ ] Expirés en premier
  - [ ] Proche fin ensuite
  - [ ] Actifs en dernier

- [ ] Tester toutes les fonctions de logique métier
  - [ ] Tester avec différentes dates
  - [ ] Tester les cas limites
  - [ ] Vérifier les calculs

---

### 4. Composant KPICard.vue

- [ ] Créer le fichier `components/KPICard.vue`

  - [ ] Définir les props nécessaires
    - [ ] `title` - Titre du KPI
    - [ ] `value` - Valeur numérique
    - [ ] `icon` - Icône optionnelle
    - [ ] `color` - Couleur du badge (optionnel)

- [ ] Implémenter le template

  - [ ] Afficher le titre
  - [ ] Afficher la valeur en grand
  - [ ] Ajouter un style visuel attractif
  - [ ] Utiliser TailwindCSS pour le styling

- [ ] Ajouter les animations/transitions

  - [ ] Animation au changement de valeur
  - [ ] Effet hover si nécessaire

- [ ] Rendre le composant responsive

  - [ ] Adapter pour mobile
  - [ ] Adapter pour tablette
  - [ ] Adapter pour desktop

- [ ] Tester le composant
  - [ ] Vérifier l'affichage
  - [ ] Vérifier la réactivité
  - [ ] Vérifier le responsive

---

### 5. Composant StatusBadge.vue

- [ ] Créer le fichier `components/StatusBadge.vue`

  - [ ] Définir les props
    - [ ] `status` - Statut du client ("actif", "proche_fin", "expire")
    - [ ] `joursRestants` - Nombre de jours restants (optionnel)

- [ ] Implémenter la logique de couleur

  - [ ] Actif → 🟢 Vert (`bg-green-500` ou équivalent)
  - [ ] Proche fin → 🟡 Jaune (`bg-yellow-500` ou équivalent)
  - [ ] Expiré → 🔴 Rouge (`bg-red-500` ou équivalent)

- [ ] Implémenter le template

  - [ ] Afficher le texte du statut
  - [ ] Afficher la couleur de fond
  - [ ] Afficher les jours restants si fourni
  - [ ] Ajouter un style de badge arrondi

- [ ] Ajouter les styles TailwindCSS

  - [ ] Couleurs de fond
  - [ ] Couleurs de texte
  - [ ] Padding et margin
  - [ ] Border radius

- [ ] Tester le composant
  - [ ] Vérifier chaque statut
  - [ ] Vérifier l'affichage des jours restants

---

### 6. Composant StatusChart.vue

- [ ] Créer le fichier `components/StatusChart.vue`

  - [ ] Installer et importer vue-chart-3 ou Chart.js
  - [ ] Définir les props
    - [ ] `data` - Données des statuts (actifs, proche_fin, expires)

- [ ] Préparer les données pour le graphique

  - [ ] Transformer les données en format Chart.js
  - [ ] Définir les couleurs (vert, jaune, rouge)
  - [ ] Définir les labels

- [ ] Implémenter le graphique camembert (Pie Chart)

  - [ ] Configurer les options du graphique
  - [ ] Ajouter la légende
  - [ ] Personnaliser les couleurs

- [ ] Implémenter le graphique bar chart (alternative)

  - [ ] Créer une version bar chart si nécessaire
  - [ ] Configurer les axes

- [ ] Rendre le graphique réactif

  - [ ] Mettre à jour automatiquement quand les données changent
  - [ ] Utiliser `watch` ou `computed`

- [ ] Ajouter le styling TailwindCSS

  - [ ] Container responsive
  - [ ] Espacement

- [ ] Tester le composant
  - [ ] Vérifier l'affichage du graphique
  - [ ] Vérifier la mise à jour automatique
  - [ ] Vérifier le responsive

---

### 7. Composant DailyActions.vue

- [ ] Créer le fichier `components/DailyActions.vue`

  - [ ] Définir les props
    - [ ] `clients` - Liste des clients à afficher

- [ ] Implémenter le tri automatique

  - [ ] Expirés en premier
  - [ ] Proche fin ensuite
  - [ ] Actifs en dernier
  - [ ] Utiliser `computed` pour le tri réactif

- [ ] Créer le tableau avec les colonnes

  - [ ] Colonne "Client" - Nom du client/store
  - [ ] Colonne "Statut" - Utiliser StatusBadge
  - [ ] Colonne "Jours restants" - Afficher le nombre
  - [ ] Colonne "Action recommandée" - Texte de l'action
  - [ ] Colonne "Bouton Relancer" - Bouton d'action

- [ ] Implémenter le bouton "Relancer"

  - [ ] Ajouter l'événement click
  - [ ] Émettre un événement vers le parent
  - [ ] Styling du bouton

- [ ] Ajouter le styling TailwindCSS

  - [ ] Tableau responsive
  - [ ] Alternance de couleurs des lignes
  - [ ] Hover effects
  - [ ] Style moderne

- [ ] Gérer les cas vides

  - [ ] Afficher un message si aucun client
  - [ ] Gérer les états de chargement

- [ ] Tester le composant
  - [ ] Vérifier le tri
  - [ ] Vérifier l'affichage
  - [ ] Vérifier le bouton relancer
  - [ ] Vérifier le responsive

---

### 8. Page dashboard.vue

- [ ] Créer le fichier `pages/dashboard.vue`

  - [ ] Importer tous les composants nécessaires
  - [ ] Importer le composable `useUsers`

- [ ] Implémenter la logique de la page

  - [ ] Utiliser `useUsers()` pour récupérer les données
  - [ ] Calculer les statistiques avec la logique métier
  - [ ] Créer les computed pour les données filtrées

- [ ] Créer la section KPI en haut

  - [ ] 4 KPICard : Total, Actifs, Proche fin, Expirés
  - [ ] Layout en grid responsive (4 colonnes desktop, 2 tablette, 1 mobile)

- [ ] Créer la section graphique et actions du jour

  - [ ] Graphique StatusChart à gauche
  - [ ] Tableau DailyActions à droite
  - [ ] Layout responsive (stack sur mobile)

- [ ] Créer le tableau complet des clients

  - [ ] Afficher tous les clients avec leurs informations
  - [ ] Utiliser les mêmes colonnes que DailyActions
  - [ ] Ajouter la pagination si nécessaire

- [ ] Implémenter le layout général

  - [ ] Header avec titre "Dashboard Orion"
  - [ ] Sections bien espacées
  - [ ] Footer si nécessaire

- [ ] Ajouter le styling TailwindCSS

  - [ ] Container principal
  - [ ] Espacements cohérents
  - [ ] Responsive design

- [ ] Tester la page complète
  - [ ] Vérifier l'affichage de tous les éléments
  - [ ] Vérifier la réactivité
  - [ ] Vérifier le responsive
  - [ ] Vérifier les performances

---

### 9. Filtres Rapides

- [ ] Créer le composant de filtres (ou intégrer dans dashboard.vue)

  - [ ] Zone de filtres en haut du tableau

- [ ] Implémenter le filtre par statut

  - [ ] Dropdown ou boutons radio
  - [ ] Options : Tous, Actif, Proche fin, Expiré
  - [ ] Filtrer la liste des clients

- [ ] Implémenter le filtre par nom/store

  - [ ] Input de recherche textuelle
  - [ ] Filtrer par nom ou nom du store
  - [ ] Recherche en temps réel

- [ ] Implémenter le filtre par jours restants

  - [ ] Input numérique ou slider
  - [ ] Filtrer les clients avec X jours restants ou moins
  - [ ] Option pour filtrer les expirés

- [ ] Combiner les filtres

  - [ ] Tous les filtres fonctionnent ensemble
  - [ ] Utiliser `computed` pour la logique de filtrage

- [ ] Ajouter un bouton "Réinitialiser les filtres"

  - [ ] Remettre tous les filtres à zéro
  - [ ] Afficher tous les clients

- [ ] Styling TailwindCSS

  - [ ] Design moderne des filtres
  - [ ] Responsive

- [ ] Tester les filtres
  - [ ] Vérifier chaque filtre individuellement
  - [ ] Vérifier la combinaison des filtres
  - [ ] Vérifier la performance avec beaucoup de données

---

### 10. Styling TailwindCSS

- [ ] Créer un thème cohérent

  - [ ] Définir les couleurs principales
  - [ ] Définir les espacements
  - [ ] Définir les typographies

- [ ] Styliser tous les composants

  - [ ] KPICard - Design moderne avec ombres
  - [ ] StatusBadge - Badges arrondis et colorés
  - [ ] StatusChart - Container avec bordure
  - [ ] DailyActions - Tableau moderne
  - [ ] Dashboard - Layout professionnel

- [ ] Implémenter le responsive design

  - [ ] Mobile first approach
  - [ ] Breakpoints : sm, md, lg, xl
  - [ ] Tester sur différentes tailles d'écran

- [ ] Ajouter les animations et transitions

  - [ ] Transitions douces
  - [ ] Hover effects
  - [ ] Loading states

- [ ] Vérifier l'accessibilité

  - [ ] Contrastes de couleurs
  - [ ] Tailles de texte
  - [ ] Navigation au clavier

- [ ] Optimiser le CSS
  - [ ] Utiliser les classes Tailwind efficacement
  - [ ] Éviter le CSS personnalisé inutile
  - [ ] Purger le CSS non utilisé

---

### 11. Test Mise à Jour Automatique

- [ ] Vérifier le rafraîchissement toutes les 30 secondes

  - [ ] Tester que les données se mettent à jour
  - [ ] Vérifier que l'interval fonctionne correctement
  - [ ] Vérifier qu'il n'y a pas de fuites mémoire

- [ ] Tester avec des changements de données

  - [ ] Simuler des changements côté API
  - [ ] Vérifier que le dashboard reflète les changements
  - [ ] Vérifier que les KPI se mettent à jour

- [ ] Tester la gestion des erreurs

  - [ ] Simuler une erreur API
  - [ ] Vérifier que l'application ne plante pas
  - [ ] Afficher un message d'erreur approprié

- [ ] Tester la performance

  - [ ] Vérifier que le rafraîchissement ne bloque pas l'UI
  - [ ] Vérifier qu'il n'y a pas de re-renders inutiles
  - [ ] Optimiser si nécessaire

- [ ] Tester le nettoyage
  - [ ] Vérifier que l'interval est nettoyé lors du démontage
  - [ ] Vérifier qu'il n'y a pas de fuites mémoire

---

### 12. Optimisation Performances

- [ ] Mesurer le temps de chargement initial

  - [ ] Objectif : < 1,5 secondes
  - [ ] Utiliser les DevTools du navigateur
  - [ ] Identifier les bottlenecks

- [ ] Optimiser les appels API

  - [ ] Vérifier qu'on n'appelle pas l'API trop souvent
  - [ ] Utiliser le cache si possible
  - [ ] Optimiser la taille des réponses

- [ ] Optimiser le rendu

  - [ ] Utiliser `v-show` vs `v-if` appropriément
  - [ ] Utiliser `lazy` et `suspense` si nécessaire
  - [ ] Éviter les re-renders inutiles

- [ ] Optimiser les computed et watch

  - [ ] Vérifier qu'ils ne sont pas trop lourds
  - [ ] Optimiser les dépendances

- [ ] Optimiser les images et assets

  - [ ] Compresser les images si nécessaire
  - [ ] Utiliser le lazy loading

- [ ] Code splitting

  - [ ] Séparer le code en chunks
  - [ ] Charger les composants à la demande

- [ ] Tests finaux de performance
  - [ ] Test sur différents navigateurs
  - [ ] Test sur différentes connexions
  - [ ] Vérifier que l'objectif < 1,5s est atteint

---

## 📝 Notes de Développement

### API Endpoints à utiliser :

- `GET /users` - Liste complète des clients
- `GET /users/actifs` - Clients actifs du mois en cours

### Structure de données attendue :

```javascript
{
  response: {...},
  activeAbonnement: boolean,
  abonnement: {
    start: Date,
    end: Date
  },
  // autres informations business
}
```

### Règles métier importantes :

- **Actif** : `activeAbonnement == true` ET `end > aujourd'hui` 🟢
- **Proche fin** : `0 < end - aujourd'hui ≤ 10 jours` 🟡
- **Expiré** : `end < aujourd'hui` OU `activeAbonnement == false` 🔴

### Technologies :

- ✅ **Nuxt 3** - Framework principal (obligatoire)
- ✅ **TailwindCSS** - Framework CSS pour le styling (obligatoire)
- Vue 3 Composition API - Utilisé avec Nuxt 3
- vue-chart-3 ou Chart.js - Pour les graphiques

---

## 🎯 Critères de Succès

- [ ] Réduction du nombre de clients expirés
- [ ] Augmentation du taux de renouvellement
- [ ] Rapidité : chargement < 1,5 sec
- [ ] Mise à jour automatique fiable
- [ ] Dashboard compréhensible pour un non-technique

---

**Dernière mise à jour:** Date de création  
**Statut global:** 🚀 En cours de développement
