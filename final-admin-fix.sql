-- Script final ultra-simple pour créer l'admin
-- Copier-coller directement dans Supabase Dashboard → SQL Editor

-- 1. Le rôle super_admin existe déjà, on l'utilise directement
-- Récupérer son UUID et créer l'admin

-- 2. Supprimer les éventuelles entrées admin existantes d'abord
DELETE FROM public.administrators WHERE user_id = '646e81ca-b467-41c3-a376-ab57347131d9';

-- 3. Créer l'admin avec l'UUID du rôle existant
INSERT INTO public.administrators (
    user_id,
    role_id,
    is_active
)
VALUES (
    '646e81ca-b467-41c3-a376-ab57347131d9', -- admin@novrh.com
    (SELECT id FROM public.admin_roles WHERE name = 'super_admin' LIMIT 1), -- UUID du rôle existant
    true
);

-- 3. Désactiver RLS temporairement
ALTER TABLE public.administrators DISABLE ROW LEVEL SECURITY;

-- 4. Vérifier
SELECT 'Admin créé avec succès!' as status;
SELECT COUNT(*) as admin_count FROM public.administrators WHERE user_id = '646e81ca-b467-41c3-a376-ab57347131d9';
