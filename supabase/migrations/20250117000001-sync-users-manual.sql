-- Migration pour synchroniser manuellement les utilisateurs existants
-- Date: 17 janvier 2025

-- 1. Désactiver temporairement RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Insérer les utilisateurs existants dans la table profiles
INSERT INTO public.profiles (email, first_name, last_name, user_type, is_active, email_verified, created_at, updated_at)
VALUES 
  ('ousmanebaradji0@gmail.com', 'Ousmane', 'Baradji', 'candidate', true, true, now(), now()),
  ('zainacherif2019@gmail.com', 'Zainabou Cherif', 'HAIDARA', 'candidate', true, true, now(), now()),
  ('mohammedtraore301@gmail.com', 'Mohamed', 'TRAORE', 'candidate', true, true, now(), now()),
  ('speakaboutai@gmail.com', 'Ada', 'Diallo', 'admin', true, true, now(), now()),
  ('admin@novrh.com', 'Admin', 'NovRH', 'admin', true, true, now(), now())
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  user_type = EXCLUDED.user_type,
  is_active = EXCLUDED.is_active,
  email_verified = EXCLUDED.email_verified,
  updated_at = now();

-- 3. Réactiver RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Créer des politiques RLS pour les administrateurs
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

-- 5. Afficher le résultat
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as admin_users,
  COUNT(CASE WHEN user_type = 'candidate' THEN 1 END) as candidate_users
FROM public.profiles;
