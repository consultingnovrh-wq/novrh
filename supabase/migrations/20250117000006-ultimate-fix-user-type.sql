-- Migration ultime pour corriger le type user_type
-- Date: 17 janvier 2025

-- 1. Vérifier et créer la table profiles si nécessaire
DO $$
BEGIN
    -- Vérifier si la table profiles existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        -- Créer la table profiles
        CREATE TABLE public.profiles (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT,
            first_name TEXT,
            last_name TEXT,
            is_active BOOLEAN DEFAULT true,
            email_verified BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            UNIQUE(user_id)
        );
        
        RAISE NOTICE 'Table profiles créée';
    ELSE
        RAISE NOTICE 'Table profiles existe déjà';
    END IF;
END $$;

-- 2. Ajouter les colonnes manquantes si elles n'existent pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- 3. Supprimer l'ancienne contrainte CHECK
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- 4. Supprimer le type ENUM s'il existe
DROP TYPE IF EXISTS user_type CASCADE;

-- 5. Créer le type ENUM user_type avec les bonnes valeurs
CREATE TYPE user_type AS ENUM ('candidate', 'company', 'admin');

-- 6. Gérer la colonne user_type de manière sécurisée
DO $$
BEGIN
    -- Vérifier si la colonne user_type existe
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' 
               AND column_name = 'user_type' 
               AND table_schema = 'public') THEN
        
        -- Supprimer la colonne existante pour la recréer
        ALTER TABLE public.profiles DROP COLUMN user_type;
        RAISE NOTICE 'Colonne user_type existante supprimée';
    END IF;
    
    -- Ajouter la colonne avec le type ENUM
    ALTER TABLE public.profiles 
    ADD COLUMN user_type user_type NOT NULL DEFAULT 'candidate';
    
    RAISE NOTICE 'Colonne user_type ajoutée avec type ENUM';
END $$;

-- 7. Recréer la fonction handle_new_user avec le bon cast
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer automatiquement dans la table profiles
  INSERT INTO public.profiles (
    user_id,
    email,
    first_name,
    last_name,
    user_type,
    is_active,
    email_verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Anonyme'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'candidate')::user_type,
    true,
    NEW.email_confirmed_at IS NOT NULL,
    NEW.created_at,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    user_type = EXCLUDED.user_type,
    email_verified = EXCLUDED.email_verified,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Recréer la fonction handle_user_update avec le bon cast
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour automatiquement la table profiles
  UPDATE public.profiles
  SET
    email = NEW.email,
    first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', first_name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', last_name),
    user_type = COALESCE(NEW.raw_user_meta_data->>'user_type', user_type)::user_type,
    email_verified = NEW.email_confirmed_at IS NOT NULL,
    updated_at = now()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Recréer les triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- 10. Synchroniser les utilisateurs existants avec le bon cast
INSERT INTO public.profiles (
  user_id,
  email,
  first_name,
  last_name,
  user_type,
  is_active,
  email_verified,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', 'Utilisateur'),
  COALESCE(au.raw_user_meta_data->>'last_name', 'Anonyme'),
  CASE 
    WHEN au.raw_user_meta_data->>'user_type' = 'employer' THEN 'company'::user_type
    WHEN au.raw_user_meta_data->>'user_type' = 'student' THEN 'candidate'::user_type
    WHEN au.raw_user_meta_data->>'user_type' = 'admin' THEN 'admin'::user_type
    WHEN au.raw_user_meta_data->>'user_type' = 'company' THEN 'company'::user_type
    WHEN au.raw_user_meta_data->>'user_type' = 'candidate' THEN 'candidate'::user_type
    ELSE 'candidate'::user_type
  END,
  true,
  au.email_confirmed_at IS NOT NULL,
  au.created_at,
  now()
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = au.id
)
AND au.email IS NOT NULL
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  user_type = EXCLUDED.user_type,
  email_verified = EXCLUDED.email_verified,
  updated_at = now();

-- 11. Créer des politiques RLS pour les administrateurs
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
    )
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
    )
  );

-- 12. Afficher le résultat
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as admin_users,
  COUNT(CASE WHEN user_type = 'candidate' THEN 1 END) as candidate_users,
  COUNT(CASE WHEN user_type = 'company' THEN 1 END) as company_users
FROM public.profiles;
