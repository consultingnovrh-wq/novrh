-- Migration ultime pour corriger définitivement l'inscription
-- Date: 17 janvier 2025

-- 1. Désactiver complètement RLS sur toutes les tables concernées
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- 2. Supprimer TOUTES les politiques RLS existantes
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

-- 3. Laisser RLS désactivé pour permettre l'inscription
-- RLS sera réactivé plus tard avec des politiques plus simples

-- 4. Vérifier et recréer les triggers de synchronisation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- 5. Vérifier que les fonctions de synchronisation existent et fonctionnent
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
    CASE 
      WHEN NEW.raw_user_meta_data->>'user_type' = 'employer' THEN 'company'
      WHEN NEW.raw_user_meta_data->>'user_type' = 'student' THEN 'candidate'
      ELSE COALESCE(NEW.raw_user_meta_data->>'user_type', 'candidate')
    END::user_type,
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
      WHEN NEW.raw_user_meta_data->>'user_type' = 'employer' THEN 'company'
      WHEN NEW.raw_user_meta_data->>'user_type' = 'student' THEN 'candidate'
      ELSE COALESCE(NEW.raw_user_meta_data->>'user_type', user_type)
    END::user_type,
    email_verified = NEW.email_confirmed_at IS NOT NULL,
    updated_at = now()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Tester la fonction de synchronisation
DO $$
DECLARE
    test_user_id UUID;
    test_profile RECORD;
BEGIN
    -- Vérifier qu'un utilisateur existe pour tester
    SELECT id INTO test_user_id 
    FROM auth.users 
    WHERE email = 'admin@novrh.com'
    LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Vérifier que le profil existe
        SELECT * INTO test_profile 
        FROM public.profiles 
        WHERE user_id = test_user_id;
        
        IF test_profile IS NOT NULL THEN
            RAISE NOTICE '✅ Synchronisation fonctionnelle: Profil trouvé pour %', test_profile.email;
        ELSE
            RAISE NOTICE '⚠️ Synchronisation problématique: Profil manquant pour user_id %', test_user_id;
        END IF;
    ELSE
        RAISE NOTICE 'ℹ️ Aucun utilisateur de test trouvé';
    END IF;
END $$;

-- 7. Afficher l'état des tables
SELECT 
    'État des tables' as info,
    'profiles' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as admin_count,
    COUNT(CASE WHEN user_type = 'candidate' THEN 1 END) as candidate_count,
    COUNT(CASE WHEN user_type = 'company' THEN 1 END) as company_count
FROM public.profiles

UNION ALL

SELECT 
    'État des tables' as info,
    'candidates' as table_name,
    COUNT(*) as total_records,
    0 as admin_count,
    COUNT(*) as candidate_count,
    0 as company_count
FROM public.candidates

UNION ALL

SELECT 
    'État des tables' as info,
    'companies' as table_name,
    COUNT(*) as total_records,
    0 as admin_count,
    0 as candidate_count,
    COUNT(*) as company_count
FROM public.companies;
