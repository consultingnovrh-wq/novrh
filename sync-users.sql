-- Script pour synchroniser les utilisateurs existants de auth.users vers profiles
-- Date: 17 janvier 2025

-- 1. Désactiver temporairement RLS pour permettre la synchronisation
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Synchroniser tous les utilisateurs existants de auth.users vers profiles
INSERT INTO public.profiles (user_id, email, first_name, last_name, user_type, is_active, email_verified, created_at, updated_at)
SELECT 
    au.id as user_id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'first_name', 'Utilisateur') as first_name,
    COALESCE(au.raw_user_meta_data->>'last_name', 'Anonyme') as last_name,
    'candidate' as user_type, -- Type par défaut
    true as is_active,
    au.email_confirmed_at IS NOT NULL as email_verified,
    au.created_at,
    now() as updated_at
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = au.id
)
AND au.email IS NOT NULL;

-- 3. Mettre à jour le type d'utilisateur pour l'admin
UPDATE public.profiles 
SET user_type = 'admin', 
    first_name = 'Admin',
    last_name = 'NovRH'
WHERE email = 'admin@novrh.com' OR email = 'speakaboutai@gmail.com';

-- 4. Réactiver RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Afficher le résultat
SELECT 
    COUNT(*) as total_users_in_profiles,
    COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as admin_users,
    COUNT(CASE WHEN user_type = 'candidate' THEN 1 END) as candidate_users,
    COUNT(CASE WHEN user_type = 'company' THEN 1 END) as company_users
FROM public.profiles;

-- 6. Afficher la liste des utilisateurs synchronisés
SELECT 
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.user_type,
    p.is_active,
    p.email_verified,
    p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;
