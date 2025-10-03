-- Migration pour synchroniser les utilisateurs existants de auth.users vers profiles
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

-- 5. Créer des politiques RLS pour les administrateurs
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
