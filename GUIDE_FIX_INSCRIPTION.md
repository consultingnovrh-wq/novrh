# 🔧 Guide de Correction - Problème d'Inscription

## 🐛 Problème Identifié

L'erreur **"Database error saving new user"** (500 Internal Server Error) se produit lors de l'inscription car :

1. **La fonction `handle_new_user()` est manquante ou défectueuse** - Cette fonction est censée créer automatiquement un profil dans `profiles` lors de la création d'un utilisateur
2. **Le trigger `on_auth_user_created` n'existe pas ou échoue** - Ce trigger appelle la fonction lors de l'inscription
3. **Les politiques RLS peuvent bloquer la création** - Les permissions sur les tables `candidates` et `companies` peuvent être insuffisantes

## ✅ Solution

### Étape 1 : Exécuter la migration de correction

1. Ouvrez **Supabase Dashboard** → **SQL Editor**
2. Copiez et collez le contenu du fichier **`supabase/migrations/20250118000000_fix-user-registration.sql`**
3. Exécutez le script

Cette migration :
- ✅ Crée la fonction `handle_new_user()` qui crée automatiquement un profil
- ✅ Crée le trigger `on_auth_user_created` qui se déclenche lors de l'inscription
- ✅ Gère les erreurs pour ne pas bloquer la création de l'utilisateur
- ✅ Utilise `SECURITY DEFINER` pour contourner les politiques RLS lors de la création initiale

### Étape 2 : Corriger les politiques RLS

1. Dans le même **SQL Editor** de Supabase
2. Copiez et collez le contenu du fichier **`fix-candidates-rls.sql`**
3. Exécutez le script

Cette migration :
- ✅ Ajoute les politiques RLS nécessaires pour la table `candidates`
- ✅ Ajoute les politiques RLS nécessaires pour la table `companies`
- ✅ Permet aux utilisateurs de créer leur propre profil lors de l'inscription

### Étape 3 : Vérifier l'installation

Exécutez cette requête SQL pour vérifier que tout est en place :

```sql
-- Vérifier que la fonction existe
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Vérifier que le trigger existe
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Vérifier les politiques RLS sur candidates
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'candidates' AND schemaname = 'public';

-- Vérifier les politiques RLS sur companies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'companies' AND schemaname = 'public';
```

Vous devriez voir :
- ✅ La fonction `handle_new_user` de type `FUNCTION`
- ✅ Le trigger `on_auth_user_created` sur la table `auth.users`
- ✅ Les politiques RLS pour `candidates` et `companies`

### Étape 4 : Tester l'inscription

1. Retournez sur votre site web
2. Essayez de créer un nouveau compte candidat
3. L'inscription devrait maintenant fonctionner ! 🎉

## 🔍 Diagnostic en cas d'erreur persistante

Si l'erreur persiste après avoir exécuté les migrations :

### Vérifier les logs Supabase

1. Allez dans **Supabase Dashboard** → **Logs** → **Postgres Logs**
2. Cherchez les erreurs liées à `handle_new_user` ou `on_auth_user_created`
3. Les messages d'erreur vous indiqueront la cause exacte

### Vérifier la structure de la table profiles

```sql
-- Vérifier que la table profiles existe et a les bonnes colonnes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;
```

### Vérifier les contraintes

```sql
-- Vérifier les contraintes sur profiles
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND table_name = 'profiles';
```

## 📝 Notes Importantes

1. **La fonction utilise `SECURITY DEFINER`** : Elle s'exécute avec les privilèges du propriétaire de la fonction, ce qui permet de contourner les politiques RLS lors de la création initiale du profil.

2. **Gestion des erreurs** : La fonction utilise un bloc `EXCEPTION` pour capturer les erreurs et les logger sans bloquer la création de l'utilisateur dans `auth.users`.

3. **ON CONFLICT** : La fonction utilise `ON CONFLICT DO UPDATE` pour éviter les erreurs si un profil existe déjà (cas de réinscription).

4. **Métadonnées utilisateur** : La fonction récupère les informations depuis `raw_user_meta_data` qui sont passées lors de l'inscription via `supabase.auth.signUp()`.

## 🚨 Si rien ne fonctionne

En dernier recours, vous pouvez temporairement désactiver RLS pour tester :

```sql
-- ATTENTION: À utiliser uniquement pour le diagnostic
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
```

**N'oubliez pas de réactiver RLS après les tests !**

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
```

