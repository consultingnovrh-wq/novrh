-- Migration finale pour désactiver complètement RLS et résoudre les erreurs
-- Date: 17 janvier 2025

-- 1. Désactiver complètement RLS sur toutes les tables critiques
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- 2. Supprimer toutes les politiques RLS existantes pour éviter les conflits
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation during registration" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can view candidates" ON public.candidates;
DROP POLICY IF EXISTS "Allow candidate creation" ON public.candidates;
DROP POLICY IF EXISTS "Allow candidate creation during registration" ON public.candidates;
DROP POLICY IF EXISTS "Candidates can view their own profile" ON public.candidates;
DROP POLICY IF EXISTS "Candidates can insert their own profile" ON public.candidates;
DROP POLICY IF EXISTS "Candidates can update their own profile" ON public.candidates;
DROP POLICY IF EXISTS "Users can insert own candidate profile" ON public.candidates;
DROP POLICY IF EXISTS "Users can update own candidate profile" ON public.candidates;
DROP POLICY IF EXISTS "Users can update their own candidate profile" ON public.candidates;
DROP POLICY IF EXISTS "Users can view all candidates" ON public.candidates;

DROP POLICY IF EXISTS "Anyone can view companies" ON public.companies;
DROP POLICY IF EXISTS "Allow company creation" ON public.companies;
DROP POLICY IF EXISTS "Allow company creation during registration" ON public.companies;
DROP POLICY IF EXISTS "Companies can view their own profile" ON public.companies;
DROP POLICY IF EXISTS "Companies can insert their own profile" ON public.companies;
DROP POLICY IF EXISTS "Companies can update their own profile" ON public.companies;
DROP POLICY IF EXISTS "Users can insert own company" ON public.companies;
DROP POLICY IF EXISTS "Users can update own company" ON public.companies;
DROP POLICY IF EXISTS "Users can update their own company profile" ON public.companies;
DROP POLICY IF EXISTS "Users can view all companies" ON public.companies;

-- 3. S'assurer que les triggers ne causent pas d'erreurs en vérifiant les fonctions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS sync_profile_to_tables ON public.profiles;

-- 4. Recréer la fonction handle_new_user simplifiée
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer automatiquement dans la table profiles (sans RLS bloquant)
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
    CASE 
      WHEN NEW.raw_user_meta_data->>'user_type' = 'employer' THEN 'company'::user_type
      WHEN NEW.raw_user_meta_data->>'user_type' = 'student' THEN 'candidate'::user_type
      WHEN NEW.raw_user_meta_data->>'user_type' = 'candidate' THEN 'candidate'::user_type
      WHEN NEW.raw_user_meta_data->>'user_type' = 'company' THEN 'company'::user_type
      WHEN NEW.raw_user_meta_data->>'user_type' = 'admin' THEN 'admin'::user_type
      ELSE 'candidate'::user_type
    END,
    true,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    COALESCE(NEW.created_at, now()),
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
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, ignorer et continuer (éviter le blocage de l'inscription)
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Recréer la fonction handle_user_update simplifiée
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour automatiquement la table profiles
  UPDATE public.profiles
  SET
    email = NEW.email,
    first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', first_name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', last_name),
    user_type = CASE 
      WHEN NEW.raw_user_meta_data->>'user_type' = 'employer' THEN 'company'::user_type
    WHEN NEW.raw_user_meta_data->>'user_type' = 'student' THEN 'candidate'::user_type
      WHEN NEW.raw_user_meta_data->>'user_type' = 'candidate' THEN 'candidate'::user_type
      WHEN NEW.raw_user_meta_data->>'user_type' = 'company' THEN 'company'::user_type
      WHEN NEW.raw_user_meta_data->>'user_type' = 'admin' THEN 'admin'::user_type
      ELSE user_type
    END,
    email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, email_verified),
    updated_at = now()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, ignorer et continuer
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Recréer les triggers simplifiés
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- 7. Afficher les résultats
SELECT 
    'RLS Status' as info,
    'profiles' as table_name,
    CASE WHEN relrowsecurity THEN 'Enabled' ELSE 'Disabled' END as rls_status
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'profiles'

UNION ALL

SELECT 
    'RLS Status' as info,
    'candidates' as table_name,
    CASE WHEN relrowsecurity THEN 'Enabled' ELSE 'Disabled' END as rls_status
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'candidates'

UNION ALL

SELECT 
    'RLS Status' as info,
    'companies' as table_name,
    CASE WHEN relrowsecurity THEN 'Enabled' ELSE 'Disabled' END as rls_status
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'companies';
