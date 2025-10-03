-- Script SQL pour synchroniser les utilisateurs existants
-- À exécuter directement dans l'interface Supabase SQL Editor

-- 1. Désactiver temporairement RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Insérer les utilisateurs existants
INSERT INTO public.profiles (email, first_name, last_name, user_type, is_active, email_verified, created_at, updated_at)
VALUES 
  ('ousmanebaradji0@gmail.com', 'Ousmane', 'Baradji', 'candidate', true, true, now(), now()),
  ('zainacherif2019@gmail.com', 'Zainabou Cherif', 'HAIDARA', 'candidate', true, true, now(), now()),
  ('mohammedtraore301@gmail.com', 'Mohamed', 'TRAORE', 'candidate', true, true, now(), now()),
  ('speakaboutai@gmail.com', 'Ada', 'Diallo', 'admin', true, true, now(), now()),
  ('admin@novrh.com', 'Admin', 'NovRH', 'admin', true, true, now(), now())
ON CONFLICT (email) DO NOTHING;

-- 3. Réactiver RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Vérifier le résultat
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as admin_users,
  COUNT(CASE WHEN user_type = 'candidate' THEN 1 END) as candidate_users
FROM public.profiles;

-- 5. Afficher la liste des utilisateurs
SELECT 
  email,
  first_name,
  last_name,
  user_type,
  is_active,
  created_at
FROM public.profiles
ORDER BY created_at DESC;
