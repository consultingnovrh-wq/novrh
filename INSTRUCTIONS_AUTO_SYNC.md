# Instructions pour la synchronisation automatique des utilisateurs

## 🎯 Objectif
Créer un système automatique qui synchronise les utilisateurs entre `auth.users` et `profiles` en temps réel, sans intervention manuelle.

## 🔧 Solution implémentée

### 1. Trigger PostgreSQL automatique
- **Fonction**: `handle_new_user()` - Crée automatiquement un profil à chaque nouvel utilisateur
- **Fonction**: `handle_user_update()` - Met à jour le profil lors des modifications
- **Trigger**: `on_auth_user_created` - Déclenché à chaque insertion dans `auth.users`
- **Trigger**: `on_auth_user_updated` - Déclenché à chaque mise à jour dans `auth.users`

### 2. Code d'inscription optimisé
- Suppression de l'insertion manuelle dans `profiles`
- Ajout du `user_type` dans les métadonnées d'inscription
- Synchronisation automatique via les triggers

## 📋 Instructions d'installation

### Étape 1: Exécuter la migration
1. Ouvrez **Supabase Dashboard** → **SQL Editor**
2. Copiez et collez le contenu de `supabase/migrations/20250117000002-auto-sync-users.sql`
3. Exécutez le script

### Étape 2: Vérifier l'installation
```sql
-- Vérifier que les triggers existent
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name LIKE '%auth_user%';

-- Vérifier que les fonctions existent
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name LIKE '%handle_user%';
```

### Étape 3: Tester la synchronisation
1. Créez un nouveau compte via l'interface d'inscription
2. Vérifiez que le profil est automatiquement créé dans `profiles`
3. Le dashboard devrait se mettre à jour automatiquement

## 🚀 Fonctionnement

### Lors de l'inscription d'un candidat:
1. `supabase.auth.signUp()` crée l'utilisateur dans `auth.users`
2. Le trigger `on_auth_user_created` se déclenche automatiquement
3. La fonction `handle_new_user()` crée le profil dans `profiles`
4. Le dashboard se met à jour en temps réel

### Lors de l'inscription d'une entreprise:
1. Même processus avec `user_type: 'company'`
2. Synchronisation automatique du profil
3. Création du profil entreprise dans la table `companies`

### Lors de la mise à jour d'un utilisateur:
1. Le trigger `on_auth_user_updated` se déclenche
2. La fonction `handle_user_update()` met à jour le profil
3. Synchronisation automatique des données

## 📊 Avantages

✅ **Automatique**: Plus besoin d'intervention manuelle
✅ **Temps réel**: Synchronisation instantanée
✅ **Fiable**: Triggers PostgreSQL garantissent la cohérence
✅ **Performant**: Pas de requêtes supplémentaires côté client
✅ **Maintenable**: Code plus simple et robuste

## 🔍 Vérification

### Dashboard Admin
- Le compteur d'utilisateurs se met à jour automatiquement
- Plus de décalage entre `auth.users` et `profiles`
- Statistiques en temps réel

### Base de données
- Tous les utilisateurs ont un profil correspondant
- Données synchronisées entre les tables
- Pas de doublons ou d'incohérences

## 🛠️ Maintenance

### Si vous devez modifier le système:
1. Modifiez les fonctions PostgreSQL dans Supabase
2. Les triggers se mettront à jour automatiquement
3. Aucune modification côté client nécessaire

### Pour désactiver temporairement:
```sql
-- Désactiver les triggers
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_updated;

-- Réactiver les triggers
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_updated;
```

## 🎉 Résultat

Après l'installation, chaque nouvel utilisateur sera automatiquement synchronisé et le dashboard affichera le bon nombre d'utilisateurs en temps réel, sans aucune intervention manuelle !
