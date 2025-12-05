# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Orion – Dashboard de Suivi Clientèle

**Version :** 1.0

**Rédactrice :** Seynabou (Customer Success / Fullstack Dev)

**Objectif :** Mettre en place un dashboard simple, rapide et en temps réel pour suivre l'activité client d'Orion.

---

## 1️⃣ Résumé exécutif

L'application Orion dispose déjà des API permettant de lister les utilisateurs et les utilisateurs actifs.

Le besoin est de construire un dashboard simple, lisible et réactif, permettant d'avoir une vue complète sur l'état des clients :

- Qui est actif ?
- Qui arrive bientôt à la fin ?
- Qui est expiré ?
- Quels sont les clients à relancer aujourd'hui ?

Le dashboard sera développé en Nuxt 3, connecté aux API existantes, avec mises à jour automatiques toutes les 30 secondes.

---

## 2️⃣ Objectifs du produit

### 🎯 Objectifs principaux

- Donner à l'équipe Customer Success une vue claire de la situation client.
- Réduire les expirations non-renouvelées.
- Améliorer le taux de renouvellement.
- Prioriser les actions de relance.
- Suivre l'activité en temps réel.

### 🎯 Objectifs secondaires

- Fournir des statistiques simples mais clés.
- Permettre une segmentation rapide des statuts.
- Aider à prendre des décisions SMART (Simples, Mesurables, Atteignables, Réalistes, Temporelles).

---

## 3️⃣ Personas

### 👩🏽‍💼 Customer Success Manager (Seynabou)

- A besoin d'un outil simple pour savoir qui relancer.
- A besoin d'un suivi à jour automatiquement.
- A besoin de filtrer les clients selon leurs statuts.

### 👨‍💻 Développeur Orion (Cheikh Mbacké Gaye)

- Doit comprendre facilement où se trouvent les problèmes.
- Doit recevoir des retours synthétiques et utilisables.

---

## 4️⃣ API disponibles

**Déjà présentes :**

### 1. GET /users

→ Retourne : liste complète des clients

Contient dans chaque client (exemple extrait du fichier) :

- `response`
- `activeAbonnement`
- `abonnement.start`
- `abonnement.end`
- informations business (transactions, factures…)

### 2. GET /users/actifs

→ Retourne : clients actifs du mois en cours

---

## 5️⃣ Règles métier (Business Logic)

### 📌 Détermination du statut

| Statut | Condition | Couleur |
|--------|-----------|---------|
| Actif | `activeAbonnement == true` ET `end > aujourd'hui` | 🟢 |
| Proche fin | `0 < end - aujourd'hui ≤ 10 jours` | 🟡 |
| Expiré | `end < aujourd'hui` OU `activeAbonnement == false` | 🔴 |

### 📌 Jours restants

```
jours_restants = end - today
```

### 📌 Action recommandée

| Statut | Action |
|--------|--------|
| Actif | RAS |
| Proche fin | Relancer |
| Expiré | URGENT – Appeler |

---

## 6️⃣ Fonctionnalités principales du Dashboard

### 🔹 1. KPI en haut de page

- Nombre total de clients
- Nombre de clients actifs
- Nombre de clients proche fin
- Nombre de clients expirés

→ Calculés dynamiquement à chaque rafraîchissement de l'API.

### 🔹 2. Tableau "Actions du jour"

**Colonnes :**

- Client
- Statut
- Jours restants
- Action recommandée
- Bouton : "Relancer"

**Tri automatique :**

1. Expirés
2. Proche fin
3. Actifs

### 🔹 3. Graphique "Répartition des statuts"

- Camembert ou bar chart
- Données : Actifs / Proche fin / Expirés
- Mise à jour en temps réel

### 🔹 4. Actualisation automatique

Le dashboard doit se rafraîchir toutes les 30 secondes grâce à :

```javascript
useAsyncData(..., { watch: [timeInterval] })
```

### 🔹 5. Filtres rapides

- Filtrer par statut
- Filtrer par nom / store
- Filtrer par jours restants

---

## 7️⃣ Contraintes techniques

### Frontend

- ✅ **Nuxt 3** (Framework principal - obligatoire)
- ✅ **TailwindCSS** (Styling - obligatoire)
- Vue 3 Composition API
- vue-chart-3 ou Chart.js

### Réactivité

- `watchEffect`
- `computed`
- Composable `useUsers()` pour fetch + refresh

### Performance

- API appelées toutes les 30 sec max
- Utilisation de `lazy` et `suspense` si nécessaire

---

## 8️⃣ Wireframe (Structure simplifiée)

```
---------------------------------------------
| KPI  |  KPI  |  KPI  |  KPI |
---------------------------------------------

[ Graphique ]          [ Actions du jour ]
                       Client | Statut | Jours | Action

---------------------------------------------
| Tableau complet des clients |
---------------------------------------------
```

---

## 9️⃣ Livrables attendus

1. Page `/dashboard.vue` complète
2. Composable `useUsers.js`
3. Composants :
   - `KPICard.vue`
   - `StatusBadge.vue`
   - `StatusChart.vue`
   - `DailyActions.vue`

---

## 🔟 Critères de succès (KPIs produit)

- Réduction du nombre de clients expirés.
- Augmentation du taux de renouvellement.
- Rapidité : chargement < 1,5 sec.
- Mise à jour automatique fiable.
- Dashboard compréhensible pour un non-technique.

