# Système de Tarification NovRH Consulting

## Vue d'ensemble

Ce système de tarification a été implémenté pour gérer les différents services et abonnements de NovRH Consulting, incluant les services pour étudiants, entreprises et établissements éducatifs.

## Structure de la base de données

### Tables principales

1. **`pricing_plans`** - Plans de tarification
   - `id` - Identifiant unique
   - `name` - Nom du plan/service
   - `description` - Description détaillée
   - `price` - Prix du service
   - `currency` - Devise (EUR, FCFA)
   - `billing_cycle` - Cycle de facturation (monthly, yearly, one_time)
   - `features` - Fonctionnalités incluses (JSON)
   - `category` - Catégorie du service
   - `is_active` - Statut actif/inactif

2. **`user_subscriptions`** - Abonnements utilisateurs
   - `id` - Identifiant unique
   - `user_id` - Référence vers l'utilisateur
   - `plan_id` - Référence vers le plan
   - `status` - Statut (active, cancelled, expired, pending)
   - `start_date` - Date de début
   - `end_date` - Date de fin
   - `payment_status` - Statut du paiement

3. **`feature_usage`** - Suivi de l'utilisation des fonctionnalités
   - `id` - Identifiant unique
   - `user_id` - Référence vers l'utilisateur
   - `feature_name` - Nom de la fonctionnalité
   - `usage_count` - Nombre d'utilisations
   - `limit_count` - Limite d'utilisation (optionnel)

## Catégories de services

### 1. Étudiants Internationaux (`student_international`)
- **Coaching CV** : 15€
- **Lettre de motivation** : 15€
- **Pack CV + Lettre** : 20€

### 2. Étudiants Maliens (`student_mali`)
- **Coaching CV** : 5 000 FCFA
- **Lettre de motivation** : 5 000 FCFA
- **Pack CV + Lettre** : 7 500 FCFA

### 3. Entreprises - Recrutement Complet (`business_complete`)
- **0-100 salariés** : 150 000 FCFA/mois
- **0-500 salariés** : 200 000 FCFA/mois
- **500+ salariés** : 300 000 FCFA/mois

### 4. Entreprises - Recrutement Partiel (`business_partial`)
- **0-100 salariés** : 70 000 FCFA/mois
- **0-500 salariés** : 100 000 FCFA/mois
- **500+ salariés** : 150 000 FCFA/mois

### 5. Entreprises - Recrutement en Autonomie (`business_autonomy`)
- **Recrutement en autonomie** : 45 000 FCFA/mois

### 6. Établissements Éducatifs (`education`)
- **Séance CV par classe** : 100 000 FCFA
- **Modules de cours** : Sur devis
- **Accompagnement CDI** : Sur devis

## Composants React

### 1. `PricingGate`
Protège les fonctionnalités selon le niveau d'abonnement de l'utilisateur.

```tsx
import PricingGate from "@/components/PricingGate";

<PricingGate feature="job_posting">
  {/* Contenu protégé */}
</PricingGate>
```

### 2. `PricingBanner`
Affiche une bannière promotionnelle pour les plans de tarification.

```tsx
import PricingBanner from "@/components/PricingBanner";

<PricingBanner variant="compact" />
```

### 3. Hooks personnalisés

#### `usePricing()`
Gère la récupération des plans de tarification.

```tsx
const { plans, loading, error } = usePricing();
```

#### `useUserSubscription(userId)`
Gère les abonnements utilisateur.

```tsx
const { subscription, createSubscription } = useUserSubscription(userId);
```

#### `useFeatureAccess(userId, featureName)`
Vérifie l'accès aux fonctionnalités.

```tsx
const { hasAccess, usage } = useFeatureAccess(userId, 'job_posting');
```

## Utilisation

### 1. Protection des fonctionnalités

```tsx
// Dans une page ou composant
<PricingGate feature="job_posting" userId={currentUserId}>
  <JobPostingForm />
</PricingGate>
```

### 2. Affichage des tarifs

```tsx
// Page de tarification
const { plans, loading } = usePricing();

if (loading) return <LoadingSpinner />;

return (
  <div>
    {plans.map(plan => (
      <PricingCard key={plan.id} plan={plan} />
    ))}
  </div>
);
```

### 3. Vérification des accès

```tsx
// Dans un composant
const { hasAccess } = useFeatureAccess(userId, 'cv_access');

if (!hasAccess) {
  return <UpgradePrompt feature="cv_access" />;
}

return <CVTheque />;
```

## Migration de base de données

Pour installer le système de tarification :

1. Exécutez la migration SQL :
```bash
# Dans votre projet Supabase
supabase db push
```

2. Les plans de tarification seront automatiquement créés avec les données par défaut.

## Personnalisation

### Ajouter un nouveau plan

1. Insérez dans la table `pricing_plans`
2. Ajoutez les fonctionnalités correspondantes dans `FEATURES`
3. Mettez à jour les composants si nécessaire

### Modifier les tarifs

1. Mettez à jour les prix dans la table `pricing_plans`
2. Les changements seront automatiquement reflétés dans l'interface

### Ajouter une nouvelle fonctionnalité

1. Ajoutez la fonctionnalité dans `FEATURES`
2. Mettez à jour les plans qui l'incluent
3. Utilisez `PricingGate` pour la protéger

## Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- Les utilisateurs ne peuvent voir que leurs propres abonnements
- Les plans de tarification sont publics en lecture seule
- Validation des accès côté serveur et client

## Support

Pour toute question ou problème avec le système de tarification, consultez la documentation Supabase ou contactez l'équipe de développement.
