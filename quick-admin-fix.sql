-- Script ultra-rapide pour créer juste l'admin
-- Copier-coller directement dans Supabase Dashboard → SQL Editor

-- Solution simple : créer directement l'admin avec un UUID de rôle

BEGIN;

-- Approche simple : d'abord créer le rôle, puis l'admin

-- 1. Créer le rôle super_admin s'il n'existe pas
INSERT INTO public.admin_roles (
    id,
    name,
    display_name,
    description,
    permissions,
    created_at
)
VALUES (
    '89b0be4c-8209-437d-a305-1576a28cb9af', -- UUID fixe pour super_admin
    'super_admin',
    'Super Administrateur',
    'Super administrateur avec tous les droits',
    '["*"]',
    now()
)
WHERE NOT EXISTS (SELECT 1 FROM public.admin_roles WHERE id = '89b0be4c-8209-437d-a305-1576a28cb9af');

-- 2. Supprimer l'admin existant s'il existe pour éviter les conflits
DELETE FROM public.administrators WHERE user_id = '646e81ca-b467-41c3-a376-ab57347131d9';

-- 3. Insérer l'admin
INSERT INTO public.administrators (
    user_id,
    role_id,
    is_active,
    created_at,
    updated_at
)
VALUES (
    '646e81ca-b467-41c3-a376-ab57347131d9', -- admin@novrh.com
    '89b0be4c-8209-437d-a305-1576a28cb9af', -- UUID du rôle super_admin
    true,
    now(),
    now()
);

-- 3. Désactiver RLS temporairement
ALTER TABLE public.administrators DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;

COMMIT;

-- Vérifier
SELECT 'SUCCESS' as status;
SELECT COUNT(*) as admin_count FROM public.administrators WHERE user_id = '646e81ca-b467-41c3-a376-ab57347131d9';
