# Guide de Migration : Standardisation des Références Utilisateur

## 📋 Résumé des Décisions

### Pourquoi pointer vers `auth.users(id)` plutôt que `profiles.id` ?

1. **Source de vérité unique** : `auth.users` est la table centrale gérée par Supabase Auth. C'est la référence absolue pour l'authentification.

2. **Simplicité** : Évite les problèmes de synchronisation entre `auth.users` et `profiles`. Plus besoin de vérifier si un profil existe avant d'insérer des données.

3. **Performance** : Moins de JOIN nécessaires dans les requêtes. On peut directement utiliser `auth.uid()` dans les RLS policies.

4. **Cohérence** : La plupart des tables pointent déjà vers `auth.users(id)`. Cette migration harmonise tout le schéma.

5. **Sécurité** : Les RLS policies peuvent directement utiliser `auth.uid()` sans passer par une fonction intermédiaire.

### Structure après migration

```
auth.users (source de vérité)
    ↓ (1:1)
profiles (données étendues, créé automatiquement via trigger)
    ↓
[autres tables pointent vers auth.users(id)]
```

## 🔄 Tables Migrées

Les tables suivantes ont été migrées pour pointer vers `auth.users(id)` :

1. ✅ `service_reviews.user_id`
2. ✅ `review_responses.responder_id`
3. ✅ `review_reactions.user_id`
4. ✅ `recruiter_subscriptions.user_id`
5. ✅ `recruiter_usage_tracking.user_id`
6. ✅ `cv_views.recruiter_id` et `candidate_id`
7. ✅ `training_institutions.user_id`
8. ✅ `quote_requests.assigned_to` (si existe)

## 📝 Types ENUM Créés

- `payment_status`: `pending`, `completed`, `failed`, `refunded`, `cancelled`
- `subscription_status`: `active`, `inactive`, `expired`, `cancelled`, `pending`, `trial`
- `user_type`: `candidate`, `company`, `admin` (déjà existant)

## 🔧 Fonctionnalités Ajoutées

### Trigger Automatique

Un trigger `on_auth_user_created` crée automatiquement un profil dans `public.profiles` lors de la création d'un utilisateur dans `auth.users`.

**Avantages** :
- Plus besoin de créer le profil manuellement lors de l'inscription
- Garantit qu'un profil existe toujours pour chaque utilisateur auth
- Synchronisation automatique des données de base (email, nom, etc.)

## 🚀 Exécution de la Migration

### Prérequis

1. Sauvegarder la base de données
2. Vérifier que tous les utilisateurs auth ont un profil correspondant (le script le fait automatiquement)
3. S'assurer qu'il n'y a pas de données orphelines

### Étapes

1. **Exécuter la migration** :
   ```bash
   supabase db push
   ```
   Ou via le SQL Editor de Supabase

2. **Vérifier les résultats** :
   - Tous les utilisateurs auth ont un profil
   - Les FK pointent vers `auth.users(id)`
   - Les RLS policies fonctionnent correctement

3. **Tester l'insertion d'un avis** :
   - Se connecter
   - Soumettre un avis
   - Vérifier qu'il est créé avec succès

## ⚠️ Points d'Attention

1. **Migration des données** : Les données existantes sont automatiquement migrées de `profiles.id` vers `auth.users.id` correspondant.

2. **Duplications** : Le script gère les cas de duplication (ex: `review_reactions`).

3. **RLS Policies** : Toutes les policies ont été mises à jour pour utiliser `auth.uid()` directement.

4. **Fonctions** : Les fonctions `get_recent_reviews` et `can_user_review_service` ont été mises à jour.

## 🔙 Rollback

Le script de rollback (`20250123000000_standardize-user-references-rollback.sql`) supprime les contraintes et le trigger, mais **ne restaure pas les données**. Pour un rollback complet, il faudrait :

1. Migrer les données de `auth.users.id` vers `profiles.id`
2. Recréer les FK vers `profiles.id`
3. Restaurer les fonctions et policies

**Recommandation** : Tester la migration sur un environnement de staging avant de l'appliquer en production.

## 📊 Impact sur le Code Client

### Avant la migration

```typescript
// Il fallait récupérer le profil.id
const { data: profile } = await supabase
  .from('profiles')
  .select('id')
  .eq('user_id', user.id)
  .single();

await supabase
  .from('service_reviews')
  .insert({ user_id: profile.id, ... });
```

### Après la migration

```typescript
// On utilise directement auth.uid()
const { data: { user } } = await supabase.auth.getUser();

await supabase
  .from('service_reviews')
  .insert({ user_id: user.id, ... });
```

**Simplification** : Plus besoin de récupérer le profil, on utilise directement `user.id` !

