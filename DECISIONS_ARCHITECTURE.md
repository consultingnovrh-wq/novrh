# Décisions Architecturales : Standardisation des Références Utilisateur

## 🎯 Objectif

Harmoniser toutes les références d'utilisateur dans la base de données pour pointer vers `auth.users(id)` au lieu de `profiles.id` ou `profiles.user_id`.

## 📊 Analyse Comparative

### Option 1 : Pointer vers `profiles.id` (Ancienne approche)

**Avantages :**
- Séparation claire entre authentification et données de profil
- Permet de gérer des profils sans utilisateur auth (cas d'usage spéciaux)

**Inconvénients :**
- ❌ Nécessite toujours de vérifier/créer le profil avant d'insérer des données
- ❌ Problèmes de synchronisation entre `auth.users` et `profiles`
- ❌ RLS policies plus complexes (besoin de fonctions intermédiaires)
- ❌ Plus de JOIN nécessaires dans les requêtes
- ❌ Source de vérité non unique (deux IDs : `auth.users.id` et `profiles.id`)

### Option 2 : Pointer vers `auth.users(id)` (Approche choisie) ✅

**Avantages :**
- ✅ Source de vérité unique : `auth.users` est géré par Supabase Auth
- ✅ Simplicité : Utilisation directe de `auth.uid()` dans les RLS policies
- ✅ Performance : Moins de JOIN nécessaires
- ✅ Cohérence : La plupart des tables pointent déjà vers `auth.users(id)`
- ✅ Sécurité : RLS policies plus simples et directes
- ✅ Automatisation : Trigger crée automatiquement le profil

**Inconvénients :**
- ⚠️ Nécessite un trigger pour créer automatiquement le profil
- ⚠️ Migration des données existantes nécessaire

## 🔄 Structure Finale

```
┌─────────────────┐
│   auth.users    │ ← Source de vérité (géré par Supabase Auth)
│   (id, email)   │
└────────┬────────┘
         │ 1:1
         │
         ▼
┌─────────────────┐
│    profiles     │ ← Données étendues (créé automatiquement via trigger)
│ (user_id → FK)  │
└─────────────────┘

         │
         │ Toutes les autres tables
         ▼
┌─────────────────┐
│ service_reviews │
│  (user_id → FK) │ ← Pointe vers auth.users(id)
└─────────────────┘

┌─────────────────┐
│ review_reactions│
│  (user_id → FK) │ ← Pointe vers auth.users(id)
└─────────────────┘

... (autres tables)
```

## 📋 Tables Migrées

| Table | Colonne | Ancienne FK | Nouvelle FK | ON DELETE |
|-------|---------|-------------|-------------|-----------|
| `service_reviews` | `user_id` | `profiles.id` | `auth.users(id)` | CASCADE |
| `review_responses` | `responder_id` | `profiles.id` | `auth.users(id)` | CASCADE |
| `review_reactions` | `user_id` | `profiles.id` | `auth.users(id)` | CASCADE |
| `recruiter_subscriptions` | `user_id` | `profiles.id` | `auth.users(id)` | CASCADE |
| `recruiter_usage_tracking` | `user_id` | `profiles.id` | `auth.users(id)` | CASCADE |
| `cv_views` | `recruiter_id` | `profiles.id` | `auth.users(id)` | CASCADE |
| `cv_views` | `candidate_id` | `profiles.id` | `auth.users(id)` | CASCADE |
| `training_institutions` | `user_id` | `profiles.id` | `auth.users(id)` | CASCADE |
| `quote_requests` | `assigned_to` | `profiles.id` | `auth.users(id)` | SET NULL |

## 🔧 Mécanismes de Garantie

### 1. Trigger Automatique

```sql
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
```

**Rôle :** Crée automatiquement un profil dans `public.profiles` lors de la création d'un utilisateur dans `auth.users`.

**Avantages :**
- Garantit qu'un profil existe toujours
- Synchronisation automatique des données de base
- Plus besoin de créer le profil manuellement

### 2. RLS Policies Simplifiées

**Avant :**
```sql
CREATE POLICY "Users can create reviews" ON service_reviews
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND user_id = get_profile_id_from_auth_uid()  -- Fonction intermédiaire nécessaire
    );
```

**Après :**
```sql
CREATE POLICY "Users can create reviews" ON service_reviews
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND user_id = auth.uid()  -- Direct, simple, performant
    );
```

## 💻 Impact sur le Code Client

### Avant la Migration

```typescript
// 1. Récupérer l'utilisateur auth
const { data: { user } } = await supabase.auth.getUser();

// 2. Récupérer le profil
const { data: profile } = await supabase
  .from('profiles')
  .select('id')
  .eq('user_id', user.id)
  .single();

// 3. Utiliser profile.id pour insérer
await supabase
  .from('service_reviews')
  .insert({ user_id: profile.id, ... });
```

**Problèmes :**
- 3 requêtes nécessaires
- Gestion d'erreurs complexe si le profil n'existe pas
- Code verbeux

### Après la Migration

```typescript
// 1. Récupérer l'utilisateur auth
const { data: { user } } = await supabase.auth.getUser();

// 2. Utiliser directement user.id (le profil est créé automatiquement)
await supabase
  .from('service_reviews')
  .insert({ user_id: user.id, ... });
```

**Avantages :**
- 2 requêtes seulement
- Code simplifié
- Pas de gestion de profil manuelle

## 🎨 Types ENUM Créés

### `payment_status`
- `pending` : Paiement en attente
- `completed` : Paiement complété
- `failed` : Paiement échoué
- `refunded` : Paiement remboursé
- `cancelled` : Paiement annulé

### `subscription_status`
- `active` : Abonnement actif
- `inactive` : Abonnement inactif
- `expired` : Abonnement expiré
- `cancelled` : Abonnement annulé
- `pending` : Abonnement en attente
- `trial` : Période d'essai

### `user_type`
- `candidate` : Candidat
- `company` : Entreprise
- `admin` : Administrateur

## 🔐 Sécurité et RLS

### Principe

Toutes les RLS policies utilisent directement `auth.uid()` pour vérifier l'identité de l'utilisateur.

### Exemple : `service_reviews`

**Lecture :**
- Public : Peut voir les avis approuvés
- Utilisateur : Peut voir ses propres avis (même non approuvés)
- Admin : Peut voir tous les avis

**Écriture :**
- Utilisateur authentifié : Peut créer un avis avec `user_id = auth.uid()`
- Ne peut pas créer un avis avec un `user_id` différent

**Modification :**
- Utilisateur : Peut modifier uniquement ses propres avis
- Admin : Peut modifier tous les avis

## 📈 Performance

### Avant
```sql
-- Requête avec JOIN nécessaire
SELECT sr.*, p.first_name, p.last_name
FROM service_reviews sr
JOIN profiles p ON p.id = sr.user_id  -- JOIN nécessaire
WHERE sr.is_approved = true;
```

### Après
```sql
-- Requête simplifiée (si on n'a pas besoin du profil)
SELECT sr.*
FROM service_reviews sr
WHERE sr.is_approved = true;

-- Ou avec JOIN direct vers auth.users si nécessaire
SELECT sr.*, au.email
FROM service_reviews sr
JOIN auth.users au ON au.id = sr.user_id
WHERE sr.is_approved = true;
```

**Gain :** Moins de JOIN, requêtes plus rapides.

## 🚀 Migration des Données

### Stratégie

1. **Créer tous les profils manquants** pour les utilisateurs auth existants
2. **Migrer les données** de `profiles.id` vers `auth.users.id` correspondant
3. **Mettre à jour les FK** pour pointer vers `auth.users(id)`
4. **Mettre à jour les fonctions** qui utilisent `profiles.id`
5. **Mettre à jour les RLS policies** pour utiliser `auth.uid()` directement

### Gestion des Duplications

Le script de migration gère automatiquement les cas de duplication (ex: `review_reactions` avec le même `review_id` et `user_id`).

## ✅ Validation

### Vérifications Post-Migration

1. ✅ Tous les utilisateurs auth ont un profil correspondant
2. ✅ Toutes les FK pointent vers `auth.users(id)`
3. ✅ Les RLS policies fonctionnent correctement
4. ✅ Les fonctions RPC sont mises à jour
5. ✅ Aucune donnée orpheline
6. ✅ Le trigger crée automatiquement les profils

## 📝 Conclusion

La migration vers `auth.users(id)` comme référence unique simplifie considérablement :
- Le code client (moins de requêtes, code plus simple)
- Les RLS policies (utilisation directe de `auth.uid()`)
- Les performances (moins de JOIN)
- La maintenance (source de vérité unique)

Le trigger automatique garantit qu'un profil existe toujours, éliminant les problèmes de synchronisation.

