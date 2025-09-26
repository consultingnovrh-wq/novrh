# NovRH Consulting - Système de Paiement et d'Abonnement

## 🎯 Vue d'ensemble

Ce système de paiement et d'abonnement permet à tous les utilisateurs de s'inscrire gratuitement sur le site, mais conditionne l'accès à certains services selon le type d'abonnement choisi. Le système est basé sur Supabase et utilise React avec TypeScript.

## 💰 Structure de Tarification

### 🎓 Services Étudiants

#### Étudiants Internationaux (France ou à l'étranger – hors Mali)
- **Coaching CV** : 15 €
- **Lettre de motivation** : 15 €
- **Pack CV + Lettre de motivation** : 20 €

#### Étudiants Maliens vivant au Mali
- **Coaching CV** : 5 000 FCFA
- **Lettre de motivation** : 5 000 FCFA
- **Pack CV + Lettre de motivation** : 7 500 FCFA

### 🏢 Services Entreprises

#### 1. Tarifs par service
- **Recrutement complet** (de la publication à l'intégration) : **15%** du salaire brut annuel
- **Recrutement à partir de l'annonce sur notre site** (suivi depuis espace employeur) : **10%** du salaire brut annuel
- **Recrutement en autonomie** (accompagnement léger) : **5%** du salaire brut annuel

#### 2. Abonnements – Recrutement complet (Mensuel ou annuel)
- **0 à 100 salariés** : 1 500 000 FCFA/an ou 150 000 FCFA/mois
- **0 à 500 salariés** : 2 000 000 FCFA/an ou 200 000 FCFA/mois
- **500+ salariés** : 3 000 000 FCFA/an ou 300 000 FCFA/mois

#### 3. Abonnements – Recrutement partiel
- **0 à 100 salariés** : 700 000 FCFA/an ou 70 000 FCFA/mois
- **0 à 500 salariés** : 1 000 000 FCFA/an ou 100 000 FCFA/mois
- **500+ salariés** : 1 500 000 FCFA/an ou 150 000 FCFA/mois

#### 4. Abonnements – Recrutement en autonomie
- **500 000 FCFA/an** ou **45 000 FCFA/mois**

### 🎓 Établissements Scolaires & Universitaires
- **Modules de cours** : sur devis
- **Séance sur CV & Lettre de motivation** : 100 000 FCFA par classe
- **Accompagnement jusqu'à un premier CDI ou contrat** : sur devis (selon le nombre d'étudiants)

## 🗄️ Structure de Base de Données

### Tables principales

#### `subscription_plans`
- Plans d'abonnement avec tarifs exacts selon la structure fournie
- Devises : EUR (étudiants internationaux) et XOF (étudiants maliens et entreprises)
- Durées : 30 jours (mensuel) et 365 jours (annuel)

#### `user_subscriptions`
- Abonnements actifs des utilisateurs
- Statuts : active, cancelled, expired
- Dates de début et fin d'abonnement

#### `payments`
- Historique des paiements
- Méthodes de paiement (simulation pour le moment)
- Statuts des transactions

#### `service_access`
- Règles d'accès aux services
- Types de plans requis pour chaque service
- Contrôle d'accès granulaire

### Fonction RPC `check_service_access`
- Vérifie l'accès d'un utilisateur à un service spécifique
- Prend en compte le type d'abonnement et les fonctionnalités incluses
- Logique de contrôle basée sur la devise et le nom du plan

## 🎨 Composants Principaux

### `Pricing.tsx`
- Page principale de tarification avec onglets pour étudiants, entreprises et établissements
- Affichage dynamique des plans selon la devise et la localisation
- Comparaison des fonctionnalités entre plans

### `StudentServices.tsx`
- Services dédiés aux étudiants (CV, lettre de motivation)
- Tarification différenciée selon la localisation
- Processus d'abonnement intégré

### `CompanyServices.tsx`
- Services de recrutement pour entreprises
- Trois niveaux de service avec comparaison détaillée
- Toggle mensuel/annuel avec calcul des économies

### `ProtectedRoute.tsx`
- Composant de protection des routes
- Vérification d'accès aux services selon l'abonnement
- Interface de fallback pour inciter à l'abonnement

### `useSubscription.ts`
- Hook personnalisé pour la gestion des abonnements
- Fonctions de vérification d'accès, abonnement, annulation
- Gestion des plans par catégorie et devise

## 🚀 Utilisation

### 1. Vérification d'accès à un service
```typescript
import { useSubscription } from '@/hooks/use-subscription';

const { checkServiceAccess } = useSubscription();
const hasAccess = await checkServiceAccess('Poster une offre');
```

### 2. Protection d'une route
```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

<ProtectedRoute serviceName="Poster une offre">
  <YourComponent />
</ProtectedRoute>
```

### 3. Abonnement à un plan
```typescript
const { subscribeToPlan } = useSubscription();
await subscribeToPlan(planId);
```

## 🔧 Configuration

### Migration de base de données
Exécutez la migration `20250716150000-update-tarification.sql` pour :
- Mettre à jour les plans d'abonnement selon la tarification exacte
- Créer les règles d'accès aux services
- Mettre à jour la fonction `check_service_access`

### Variables d'environnement
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

## 💳 Intégration Paiement

**Note importante** : Le système actuel utilise une simulation de paiement. Pour la production, remplacez `simulatePaymentProcessing` dans `useSubscription.ts` par :

- **Orange Money** (Mali)
- **Moov Money** (Mali)
- **Stripe** (international)
- **PayPal** (international)

## 📱 Pages et Routes

- `/pricing` - Tarification générale
- `/student-services` - Services étudiants
- `/company-services` - Services entreprises
- `/dashboard` - Tableau de bord utilisateur
- `/post-job` - Publication d'offres (protégé)

## 🔒 Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- Vérification d'accès côté serveur et client
- Contrôle des permissions basé sur les abonnements actifs
- Protection contre l'accès non autorisé aux services payants

## 🚧 Développement Futur

### Fonctionnalités prévues
- [ ] Intégration de vrais systèmes de paiement
- [ ] Système de facturation automatique
- [ ] Gestion des renouvellements d'abonnement
- [ ] Tableau de bord administrateur
- [ ] Rapports et analytics
- [ ] Système de parrainage et réductions

### Améliorations techniques
- [ ] Cache Redis pour les vérifications d'accès
- [ ] Webhooks pour les notifications de paiement
- [ ] Système de logs détaillé
- [ ] Tests automatisés complets
- [ ] Monitoring des performances

## 📞 Support

Pour toute question sur l'implémentation ou la configuration :
1. Consultez la documentation Supabase
2. Vérifiez les logs de la console
3. Testez les migrations en environnement de développement

---

**Dernière mise à jour** : 16 juillet 2025  
**Version** : 2.0.0 - Tarification exacte implémentée
