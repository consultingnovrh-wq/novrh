-- Migration pour corriger les politiques RLS qui bloquent l'authentification
-- Date: 17 janvier 2025

-- 1. Supprimer TOUTES les politiques RLS problématiques
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation during registration" ON public.profiles;

-- 2. Désactiver temporairement RLS sur profiles pour permettre l'authentification
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 3. Recréer des politiques RLS simples et permissives
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture - tout le monde peut lire les profils
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

-- Politique pour la mise à jour - les utilisateurs peuvent mettre à jour leur propre profil
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour l'insertion - permettre la création de profils
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
CREATE POLICY "Allow profile creation" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- 4. Vérifier que le compte admin existe et est correctement configuré
DO $$
DECLARE
    admin_user_id UUID;
    admin_profile RECORD;
    admin_entry RECORD;
BEGIN
    -- Trouver l'utilisateur admin
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@novrh.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Vérifier le profil
        SELECT * INTO admin_profile 
        FROM public.profiles 
        WHERE user_id = admin_user_id;
        
        IF admin_profile IS NOT NULL THEN
            -- Mettre à jour le profil pour être sûr qu'il est admin
            UPDATE public.profiles 
            SET 
                user_type = 'admin',
                is_active = true,
                email_verified = true,
                updated_at = now()
            WHERE user_id = admin_user_id;
            
            RAISE NOTICE 'Profil admin mis à jour: %', admin_profile.email;
        ELSE
            RAISE NOTICE 'Profil admin non trouvé pour user_id: %', admin_user_id;
        END IF;
        
        -- Vérifier l'entrée dans administrators
        SELECT * INTO admin_entry 
        FROM public.administrators 
        WHERE user_id = admin_user_id;
        
        IF admin_entry IS NOT NULL THEN
            RAISE NOTICE 'Entrée administrateur trouvée: %', admin_entry.role_id;
        ELSE
            RAISE NOTICE 'Entrée administrateur manquante pour user_id: %', admin_user_id;
        END IF;
    ELSE
        RAISE NOTICE 'Utilisateur admin@novrh.com non trouvé dans auth.users';
    END IF;
END $$;

-- 5. Afficher l'état final
SELECT 
    'Profiles' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as admin_count,
    COUNT(CASE WHEN user_type = 'candidate' THEN 1 END) as candidate_count,
    COUNT(CASE WHEN user_type = 'company' THEN 1 END) as company_count
FROM public.profiles

UNION ALL

SELECT 
    'Administrators' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_active = true THEN 1 END) as admin_count,
    0 as candidate_count,
    0 as company_count
FROM public.administrators;
