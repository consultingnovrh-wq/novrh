-- Script pour vérifier et corriger le problème de profil manquant
-- Le problème : le profil ID utilisé n'existe pas dans la table profiles

-- 1. Vérifier si le profil existe
SELECT 
    'Vérification des profils' as action,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN id = '8ce555bf-0798-4a3e-9e43-4bd1c067f121' THEN 1 END) as profile_exists
FROM profiles;

-- 2. Vérifier les utilisateurs auth sans profil
SELECT 
    'Utilisateurs auth sans profil' as action,
    au.id as auth_user_id,
    au.email,
    p.id as profile_id
FROM auth.users au
LEFT JOIN profiles p ON p.user_id = au.id
WHERE p.id IS NULL
LIMIT 10;

-- 3. Créer les profils manquants pour tous les utilisateurs auth
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
    au.email,
    COALESCE(au.raw_user_meta_data->>'first_name', au.raw_user_meta_data->>'full_name', 'Utilisateur') as first_name,
    COALESCE(au.raw_user_meta_data->>'last_name', '') as last_name,
    COALESCE((au.raw_user_meta_data->>'user_type')::user_type, 'candidate'::user_type) as user_type,
    true as is_active,
    (au.email_confirmed_at IS NOT NULL) as email_verified,
    COALESCE(au.created_at, NOW()) as created_at,
    NOW() as updated_at
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.user_id = au.id
)
ON CONFLICT (user_id) DO NOTHING;

-- 4. Vérifier que tous les utilisateurs ont maintenant un profil
SELECT 
    'Résultat final' as action,
    COUNT(DISTINCT au.id) as total_auth_users,
    COUNT(DISTINCT p.id) as total_profiles,
    COUNT(DISTINCT au.id) - COUNT(DISTINCT p.id) as missing_profiles
FROM auth.users au
LEFT JOIN profiles p ON p.user_id = au.id;

-- 5. Vérifier spécifiquement le profil problématique
SELECT 
    'Vérification profil spécifique' as action,
    p.id,
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.user_type
FROM profiles p
WHERE p.id = '8ce555bf-0798-4a3e-9e43-4bd1c067f121'
   OR p.user_id IN (
       SELECT id FROM auth.users 
       WHERE email = (SELECT email FROM auth.users WHERE id IN (
           SELECT user_id FROM profiles WHERE id = '8ce555bf-0798-4a3e-9e43-4bd1c067f121'
       ))
   );

