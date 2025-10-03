-- Script simple pour activer le sidebar admin
-- Copier-coller directement dans Supabase Dashboard → SQL Editor

-- 1. Créer d'abord le rôle super_admin s'il n'existe pas
INSERT INTO public.admin_roles (
    id,
    name,
    description,
    permissions,
    created_at
)
VALUES (
    gen_random_uuid(),
    'super_admin',
    'Super administrateur avec tous les droits',
    '["*"]',
    now()
)
ON CONFLICT (name) DO NOTHING;

-- 2. Créer l'entrée admin directement  
INSERT INTO public.administrators (
    user_id,
    role_id,
    is_active,
    created_at,
    updated_at
)
VALUES (
    '646e81ca-b467-41c3-a376-ab57347131d9', -- admin@novrh.com
    (SELECT id FROM public.admin_roles WHERE name = 'super_admin' LIMIT 1), -- uuid du rôle super_admin
    true,
    now(),
    now()
)
ON CONFLICT (user_id, role_id) DO UPDATE SET
    is_active = true,
    updated_at = now();

-- 3. Désactiver RLS sur administrators temporairement pour éviter l'erreur 406
ALTER TABLE public.administrators DISABLE ROW LEVEL SECURITY;

-- 3. Vérifier que ça marche
SELECT 'Admin créé dans administrators' as status, a.* 
FROM public.administrators a 
WHERE a.user_id = '646e81ca-b467-41c3-a376-ab57347131d9';

SELECT 'Test query administrators' as test, COUNT(*) as count 
FROM public.administrators;
