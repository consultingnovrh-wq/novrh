-- Migration pour corriger le cast du type user_type
-- Date: 17 janvier 2025

-- 1. Vérifier et corriger la contrainte user_type
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('candidate', 'employer', 'student', 'company', 'admin'));

-- 2. Recréer la fonction handle_new_user avec le bon cast
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
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'candidate'),
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

-- 3. Recréer la fonction handle_user_update avec le bon cast
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour automatiquement la table profiles
  UPDATE public.profiles
  SET
    email = NEW.email,
    first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', first_name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', last_name),
    user_type = COALESCE(NEW.raw_user_meta_data->>'user_type', user_type),
    email_verified = NEW.email_confirmed_at IS NOT NULL,
    updated_at = now()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Synchroniser les utilisateurs existants avec le bon cast
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
  COALESCE(au.raw_user_meta_data->>'user_type', 'candidate'),
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

-- 5. Afficher le résultat
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as admin_users,
  COUNT(CASE WHEN user_type = 'candidate' THEN 1 END) as candidate_users,
  COUNT(CASE WHEN user_type = 'company' THEN 1 END) as company_users
FROM public.profiles;
