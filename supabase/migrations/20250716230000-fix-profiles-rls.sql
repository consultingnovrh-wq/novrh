-- Migration pour corriger les politiques RLS de la table profiles
-- Date: 16 juillet 2025

-- 1. Supprimer toutes les politiques existantes sur profiles
DROP POLICY IF EXISTS "Allow all operations for profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation during registration" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 2. Créer des politiques RLS appropriées pour profiles
-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent insérer leur propre profil
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Les admins peuvent voir tous les profils
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      JOIN public.admin_roles ar ON a.role_id = ar.id
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
      AND ar.name IN ('super_admin', 'admin')
    )
  );

-- Les admins peuvent mettre à jour tous les profils
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      JOIN public.admin_roles ar ON a.role_id = ar.id
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
      AND ar.name IN ('super_admin', 'admin')
    )
  );

-- 3. S'assurer que RLS est activé sur profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Créer un super admin par défaut si aucun n'existe
DO $$
DECLARE
    admin_user_id UUID;
    super_admin_role_id UUID;
BEGIN
    -- Vérifier si un super admin existe déjà
    IF NOT EXISTS (SELECT 1 FROM public.administrators a 
                   JOIN public.admin_roles ar ON a.role_id = ar.id 
                   WHERE ar.name = 'super_admin' AND a.is_active = true) THEN
        
        -- Trouver l'utilisateur speakaboutai@gmail.com
        SELECT id INTO admin_user_id 
        FROM auth.users 
        WHERE email = 'speakaboutai@gmail.com';
        
        -- Trouver le rôle super_admin
        SELECT id INTO super_admin_role_id 
        FROM public.admin_roles 
        WHERE name = 'super_admin';
        
        -- Créer le profil admin si nécessaire
        INSERT INTO public.profiles (user_id, user_type, email, first_name, last_name, is_active)
        VALUES (admin_user_id, 'admin', 'speakaboutai@gmail.com', 'Admin', 'User', true)
        ON CONFLICT (user_id) DO UPDATE SET 
            user_type = 'admin',
            email = 'speakaboutai@gmail.com',
            is_active = true;
        
        -- Créer l'administrateur
        IF admin_user_id IS NOT NULL AND super_admin_role_id IS NOT NULL THEN
            INSERT INTO public.administrators (user_id, role_id, is_active)
            VALUES (admin_user_id, super_admin_role_id, true)
            ON CONFLICT (user_id) DO UPDATE SET 
                role_id = super_admin_role_id,
                is_active = true;
        END IF;
    END IF;
END $$;
