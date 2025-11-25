-- Script ULTIME pour corriger définitivement tous les problèmes de profils
-- Ce script diagnostique et corrige TOUS les problèmes en une fois

-- ============================================
-- ÉTAPE 1: DIAGNOSTIC - Vérifier l'état actuel
-- ============================================
SELECT 
    '🔍 DIAGNOSTIC INITIAL' as etape,
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM profiles) as total_profiles,
    (SELECT COUNT(*) FROM auth.users au 
     LEFT JOIN profiles p ON p.user_id = au.id 
     WHERE p.id IS NULL) as users_sans_profil;

-- ============================================
-- ÉTAPE 2: DÉSACTIVER TEMPORAIREMENT RLS sur profiles
-- ============================================
-- Pour permettre la création sans blocage
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- ============================================
-- ÉTAPE 3: Créer TOUS les profils manquants
-- ============================================
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
    au.id as user_id,
    COALESCE(au.email, '') as email,
    COALESCE(
        au.raw_user_meta_data->>'first_name', 
        SPLIT_PART(COALESCE(au.raw_user_meta_data->>'full_name', 'Utilisateur'), ' ', 1),
        'Utilisateur'
    ) as first_name,
    COALESCE(
        au.raw_user_meta_data->>'last_name',
        CASE 
            WHEN au.raw_user_meta_data->>'full_name' IS NOT NULL 
            THEN SUBSTRING(au.raw_user_meta_data->>'full_name' FROM POSITION(' ' IN au.raw_user_meta_data->>'full_name') + 1)
            ELSE ''
        END,
        ''
    ) as last_name,
    COALESCE(
        CASE 
            WHEN au.raw_user_meta_data->>'user_type' = 'employer' THEN 'company'::user_type
            WHEN au.raw_user_meta_data->>'user_type' = 'student' THEN 'candidate'::user_type
            WHEN au.raw_user_meta_data->>'user_type' = 'admin' THEN 'admin'::user_type
            WHEN au.raw_user_meta_data->>'user_type' = 'company' THEN 'company'::user_type
            WHEN au.raw_user_meta_data->>'user_type' = 'candidate' THEN 'candidate'::user_type
            ELSE 'candidate'::user_type
        END,
        'candidate'::user_type
    ) as user_type,
    true as is_active,
    (au.email_confirmed_at IS NOT NULL) as email_verified,
    COALESCE(au.created_at, NOW()) as created_at,
    NOW() as updated_at
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.user_id = au.id
)
ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    user_type = COALESCE(EXCLUDED.user_type, profiles.user_type),
    email_verified = EXCLUDED.email_verified,
    updated_at = NOW();

-- ============================================
-- ÉTAPE 4: Recréer la fonction get_or_create_profile avec vérifications
-- ============================================
DROP FUNCTION IF EXISTS public.get_or_create_profile();

CREATE OR REPLACE FUNCTION public.get_or_create_profile()
RETURNS UUID AS $$
DECLARE
    profile_id UUID;
    current_auth_user_id UUID;
    profile_exists BOOLEAN;
BEGIN
    -- Obtenir l'ID de l'utilisateur authentifié
    current_auth_user_id := auth.uid();
    
    IF current_auth_user_id IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated';
    END IF;
    
    -- Essayer de récupérer le profil existant
    SELECT id INTO profile_id
    FROM public.profiles
    WHERE user_id = current_auth_user_id
    LIMIT 1;
    
    -- Si le profil n'existe pas, le créer
    IF profile_id IS NULL THEN
        -- Insérer le profil
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
            COALESCE(au.email, ''),
            COALESCE(
                au.raw_user_meta_data->>'first_name',
                SPLIT_PART(COALESCE(au.raw_user_meta_data->>'full_name', 'Utilisateur'), ' ', 1),
                'Utilisateur'
            ),
            COALESCE(
                au.raw_user_meta_data->>'last_name',
                CASE 
                    WHEN au.raw_user_meta_data->>'full_name' IS NOT NULL 
                    THEN SUBSTRING(au.raw_user_meta_data->>'full_name' FROM POSITION(' ' IN au.raw_user_meta_data->>'full_name') + 1)
                    ELSE ''
                END,
                ''
            ),
            COALESCE(
                CASE 
                    WHEN au.raw_user_meta_data->>'user_type' = 'employer' THEN 'company'::user_type
                    WHEN au.raw_user_meta_data->>'user_type' = 'student' THEN 'candidate'::user_type
                    WHEN au.raw_user_meta_data->>'user_type' = 'admin' THEN 'admin'::user_type
                    WHEN au.raw_user_meta_data->>'user_type' = 'company' THEN 'company'::user_type
                    WHEN au.raw_user_meta_data->>'user_type' = 'candidate' THEN 'candidate'::user_type
                    ELSE 'candidate'::user_type
                END,
                'candidate'::user_type
            ),
            true,
            (au.email_confirmed_at IS NOT NULL),
            COALESCE(au.created_at, NOW()),
            NOW()
        FROM auth.users au
        WHERE au.id = current_auth_user_id
        ON CONFLICT (user_id) DO UPDATE SET
            email = EXCLUDED.email,
            updated_at = NOW()
        RETURNING id INTO profile_id;
        
        -- Vérifier que l'ID a bien été récupéré
        IF profile_id IS NULL THEN
            -- Si l'INSERT a échoué, réessayer de récupérer
            SELECT id INTO profile_id
            FROM public.profiles
            WHERE user_id = current_auth_user_id
            LIMIT 1;
        END IF;
    END IF;
    
    -- Vérification finale : s'assurer que le profil existe vraiment
    SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id) INTO profile_exists;
    
    IF profile_id IS NULL OR NOT profile_exists THEN
        RAISE EXCEPTION 'Failed to create or retrieve profile for user %. Profile ID: %, Exists: %', 
            current_auth_user_id, profile_id, profile_exists;
    END IF;
    
    RETURN profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Donner les permissions
GRANT EXECUTE ON FUNCTION public.get_or_create_profile() TO authenticated;

-- ============================================
-- ÉTAPE 5: Réactiver RLS et créer les politiques correctes
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation during registration" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Créer les nouvelles politiques
CREATE POLICY "Allow profile creation during registration" ON public.profiles
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE 
  USING (auth.uid() = user_id);

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

-- ============================================
-- ÉTAPE 6: Vérification finale
-- ============================================
SELECT 
    '✅ RÉSULTAT FINAL' as etape,
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM profiles) as total_profiles,
    (SELECT COUNT(*) FROM auth.users au 
     LEFT JOIN profiles p ON p.user_id = au.id 
     WHERE p.id IS NULL) as users_sans_profil,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users au 
              LEFT JOIN profiles p ON p.user_id = au.id 
              WHERE p.id IS NULL) = 0
        THEN '✅ TOUS LES UTILISATEURS ONT UN PROFIL'
        ELSE '⚠️ IL RESTE DES UTILISATEURS SANS PROFIL'
    END as status_final;

-- Vérifier que la fonction existe
SELECT 
    '✅ Fonction créée' as status,
    proname as function_name,
    pg_get_function_arguments(oid) as arguments
FROM pg_proc 
WHERE proname = 'get_or_create_profile'
AND pronamespace = 'public'::regnamespace;

