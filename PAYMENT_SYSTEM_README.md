# Système de Paiement et d'Abonnements - NovRH Consulting

## Vue d'ensemble

Ce système permet de gérer les abonnements et l'accès aux services selon le type d'utilisateur et leur plan d'abonnement. Tous les utilisateurs peuvent s'inscrire gratuitement, mais certains services sont conditionnés par le paiement.

## Structure de la Base de Données

### Tables principales

1. **subscription_plans** - Plans d'abonnement disponibles
2. **user_subscriptions** - Abonnements des utilisateurs
3. **payments** - Historique des paiements
4. **service_access** - Règles d'accès aux services

### Plans d'abonnement par défaut

- **Gratuit** (0 XOF) - Accès de base
- **Basique** (25,000 XOF) - Services de recrutement
- **Premium** (50,000 XOF) - Services avancés
- **Entreprise** (100,000 XOF) - Solution complète

## Services et Accès

### Services gratuits (tous les utilisateurs)
- Inscription et connexion
- Profil de base
- Recherche d'emploi basique

### Services payants
- **Poster une offre** - Basique, Premium, Entreprise
- **Accès aux CV** - Basique, Premium, Entreprise
- **Recherche avancée** - Premium, Entreprise
- **Support prioritaire** - Premium, Entreprise
- **Analytics** - Premium, Entreprise
- **Fonctionnalités personnalisées** - Entreprise uniquement

## Composants Principaux

### 1. useSubscription Hook
```typescript
const {
  plans,                    // Plans disponibles
  userSubscription,         // Abonnement actuel
  checkServiceAccess,       // Vérifier l'accès à un service
  subscribeToPlan,          // S'abonner à un plan
  cancelSubscription,       // Annuler l'abonnement
  hasActiveSubscription,    // Vérifier si l'utilisateur a un abonnement actif
  getCurrentPlanName        // Nom du plan actuel
} = useSubscription();
```

### 2. ProtectedRoute Component
```typescript
<ProtectedRoute serviceName="Poster une offre">
  {/* Contenu protégé */}
</ProtectedRoute>
```

### 3. UserDashboard Component
Affiche l'état de l'abonnement, l'historique des paiements et les fonctionnalités incluses.

## Utilisation

### 1. Vérifier l'accès à un service
```typescript
const { checkServiceAccess } = useSubscription();

const canPostJob = await checkServiceAccess("Poster une offre");
if (canPostJob) {
  // Afficher le formulaire de publication
} else {
  // Rediriger vers la tarification
}
```

### 2. Protéger une route
```typescript
import ProtectedRoute from "@/components/ProtectedRoute";

const PostJobPage = () => (
  <ProtectedRoute serviceName="Poster une offre">
    <div>Formulaire de publication d'emploi</div>
  </ProtectedRoute>
);
```

### 3. Afficher le statut de l'abonnement
```typescript
const { hasActiveSubscription, getCurrentPlanName } = useSubscription();

if (hasActiveSubscription()) {
  console.log(`Plan actuel: ${getCurrentPlanName()}`);
}
```

## Intégration du Paiement

### Simulation actuelle
Le système simule actuellement le traitement des paiements. Pour une production, intégrez un vrai processeur de paiement :

1. **Orange Money**
2. **MTN Mobile Money**
3. **Moov Money**
4. **Carte bancaire**

### Remplacement de la simulation
```typescript
// Remplacer simulatePaymentProcessing dans useSubscription
const processRealPayment = async (planId: string, paymentMethod: string) => {
  // Intégrer avec votre processeur de paiement
  const paymentResult = await paymentGateway.process({
    amount: plan.price,
    currency: 'XOF',
    method: paymentMethod,
    // autres paramètres
  });
  
  if (paymentResult.success) {
    // Mettre à jour le statut de l'abonnement
    await activateSubscription(subscriptionId);
  }
};
```

## Migration de Base de Données

Exécutez la migration pour créer les tables nécessaires :

```bash
# Dans Supabase
supabase db push
```

Ou exécutez manuellement le fichier SQL :
```sql
-- Voir supabase/migrations/20250716140000-subscription-system.sql
```

## Configuration

### Variables d'environnement
```env
# Ajouter dans .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### RLS (Row Level Security)
Les politiques de sécurité sont configurées pour :
- Permettre la lecture publique des plans d'abonnement
- Restreindre l'accès aux abonnements et paiements aux utilisateurs propriétaires
- Permettre la lecture publique des règles d'accès aux services

## Personnalisation

### Ajouter un nouveau service
1. Insérer dans `service_access`
2. Mettre à jour les types TypeScript
3. Utiliser `ProtectedRoute` ou `checkServiceAccess`

### Modifier les plans
1. Mettre à jour `subscription_plans`
2. Ajuster les règles dans `service_access`
3. Mettre à jour l'interface utilisateur

### Ajouter un processeur de paiement
1. Créer un service de paiement
2. Remplacer `simulatePaymentProcessing`
3. Gérer les webhooks de confirmation

## Sécurité

- Toutes les vérifications d'accès se font côté serveur via Supabase RLS
- Les utilisateurs ne peuvent voir que leurs propres abonnements et paiements
- La fonction `check_service_access` est sécurisée avec `SECURITY DEFINER`

## Support

Pour toute question ou problème :
1. Vérifiez les logs de la console
2. Consultez la documentation Supabase
3. Vérifiez les politiques RLS
4. Testez avec différents types d'utilisateurs

## Développement Futur

- [ ] Intégration avec de vrais processeurs de paiement
- [ ] Système de facturation automatique
- [ ] Gestion des remises et codes promo
- [ ] Analytics des abonnements
- [ ] Système de notifications de renouvellement
- [ ] Gestion des essais gratuits
- [ ] Support multi-devises
