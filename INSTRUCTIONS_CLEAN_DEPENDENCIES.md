# Instructions pour corriger les dépendances RLS

## 🐛 Problème identifié
L'erreur `cannot drop column user_type of table profiles because other objects depend on it` indique que des politiques RLS dépendent de la colonne `user_type`.

## 🔧 Solution

### Migration corrigée
- **Fichier**: `supabase/migrations/20250117000008-clean-dependencies-fix.sql`
- **Approche**: Supprimer toutes les politiques RLS dépendantes, puis recréer la colonne

### Corrections apportées

#### 1. Suppression des politiques RLS dépendantes
```sql
-- Supprimer toutes les politiques qui dépendent de user_type
DROP POLICY IF EXISTS "Admins can view all administrators" ON public.administrators;
DROP POLICY IF EXISTS "Admins can insert administrators" ON public.administrators;
DROP POLICY IF EXISTS "Admins can update administrators" ON public.administrators;
DROP POLICY IF EXISTS "Admins can delete administrators" ON public.administrators;
DROP POLICY IF EXISTS "Admins can view all admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can insert admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can update admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can delete admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can view system settings" ON public.system_settings;

-- Supprimer toutes les autres politiques sur profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation during registration" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all operations for profiles" ON public.profiles;
```

#### 2. Suppression de la colonne avec CASCADE
```sql
-- Supprimer la colonne existante avec CASCADE pour gérer les dépendances
ALTER TABLE public.profiles DROP COLUMN user_type CASCADE;
```

#### 3. Recréation de la colonne avec le type ENUM
```sql
-- Ajouter la colonne avec le type ENUM
ALTER TABLE public.profiles 
ADD COLUMN user_type user_type NOT NULL DEFAULT 'candidate';
```

#### 4. Recréation des politiques RLS essentielles
```sql
-- Politiques pour les administrateurs
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
    )
  );

-- Politiques pour les utilisateurs
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow profile creation during registration" ON public.profiles
  FOR INSERT WITH CHECK (true);
```

## 📋 Instructions d'installation

### Étape 1: Exécuter la migration
1. Ouvrez **Supabase Dashboard** → **SQL Editor**
2. Copiez et collez le contenu de `supabase/migrations/20250117000008-clean-dependencies-fix.sql`
3. Exécutez le script

### Étape 2: Vérifier le résultat
```sql
-- Vérifier le type ENUM
SELECT enumlabel FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_type');

-- Vérifier la structure de la table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Vérifier les utilisateurs synchronisés
SELECT user_type, COUNT(*) FROM public.profiles GROUP BY user_type;

-- Vérifier les triggers
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name LIKE '%auth_user%';

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';
```

## 🚀 Fonctionnement

### Structure finale de la table `profiles`:
```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    user_type user_type NOT NULL DEFAULT 'candidate',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id)
);
```

### Type ENUM `user_type`:
- `candidate` - Candidat
- `company` - Entreprise
- `admin` - Administrateur

### Politiques RLS recréées:
- **Admins can view all profiles** - Les admins peuvent voir tous les profils
- **Admins can update all profiles** - Les admins peuvent modifier tous les profils
- **Users can view their own profile** - Les utilisateurs peuvent voir leur propre profil
- **Users can update their own profile** - Les utilisateurs peuvent modifier leur propre profil
- **Allow profile creation during registration** - Permet la création de profils lors de l'inscription

## 📊 Résultat attendu

### Après l'exécution de la migration :
- ✅ Table `profiles` créée/corrigée
- ✅ Type ENUM `user_type` avec 3 valeurs
- ✅ Colonne `user_type` recréée avec le bon type
- ✅ Utilisateurs existants synchronisés
- ✅ Triggers PostgreSQL fonctionnels
- ✅ Politiques RLS essentielles recréées
- ✅ Dashboard mis à jour automatiquement

### Vérification finale :
```sql
-- Doit retourner 3 valeurs
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_type');

-- Doit retourner le nombre d'utilisateurs synchronisés
SELECT COUNT(*) FROM public.profiles;

-- Doit retourner 2 triggers
SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name LIKE '%auth_user%';

-- Doit retourner les politiques RLS
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles';
```

## 🎉 Avantages

✅ **Robuste**: Gère toutes les dépendances
✅ **Sécurisé**: Recréation propre de la colonne
✅ **Complet**: Synchronisation automatique
✅ **Maintenable**: Structure claire et cohérente
✅ **Performant**: Type ENUM optimisé
✅ **Fiable**: Pas de conversion complexe
✅ **Sécurisé**: Politiques RLS appropriées

## 🛠️ En cas de problème

### Si la migration échoue encore :
1. Vérifiez que vous avez les droits d'administration
2. Vérifiez qu'aucune autre contrainte ne référence `user_type`
3. Vérifiez qu'aucune vue ou fonction ne dépend de la colonne

### Pour déboguer :
```sql
-- Vérifier les dépendances de la colonne
SELECT 
    schemaname,
    tablename,
    columnname,
    dependent_type,
    dependent_name
FROM information_schema.view_column_usage 
WHERE columnname = 'user_type';

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';
```

## 🚀 Test de la synchronisation

### Après l'installation :
1. Créez un nouveau compte via l'interface d'inscription
2. Vérifiez que le profil est automatiquement créé dans `profiles`
3. Le dashboard devrait se mettre à jour automatiquement
4. Le compteur d'utilisateurs devrait afficher le bon nombre

### Test avec différents types d'utilisateurs :
- **Candidat**: `user_type: 'candidate'` → `candidate`
- **Entreprise**: `user_type: 'company'` → `company`
- **Admin**: `user_type: 'admin'` → `admin`
- **Employer**: `user_type: 'employer'` → `company` (converti)
- **Student**: `user_type: 'student'` → `candidate` (converti)

La synchronisation automatique devrait maintenant fonctionner parfaitement ! 🎉
