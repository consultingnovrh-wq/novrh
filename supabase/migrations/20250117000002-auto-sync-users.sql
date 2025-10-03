-- Migration pour créer la synchronisation automatique des utilisateurs
-- Date: 17 janvier 2025

-- 1. Créer une fonction pour synchroniser automatiquement les utilisateurs
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
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'candidate')::text,
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

-- 2. Créer un trigger pour exécuter la fonction à chaque nouvel utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Créer une fonction pour mettre à jour les profils existants
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour automatiquement la table profiles
  UPDATE public.profiles
  SET
    email = NEW.email,
    first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', first_name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', last_name),
    user_type = COALESCE(NEW.raw_user_meta_data->>'user_type', user_type)::text,
    email_verified = NEW.email_confirmed_at IS NOT NULL,
    updated_at = now()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Créer un trigger pour mettre à jour les profils lors des modifications
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- 5. Synchroniser les utilisateurs existants
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
  COALESCE(au.raw_user_meta_data->>'user_type', 'candidate')::text,
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

-- 6. Créer des politiques RLS pour les administrateurs
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

-- 7. Afficher le résultat
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as admin_users,
  COUNT(CASE WHEN user_type = 'candidate' THEN 1 END) as candidate_users,
  COUNT(CASE WHEN user_type = 'company' THEN 1 END) as company_users
FROM public.profiles;
