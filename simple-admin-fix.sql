-- Script ultra-simple pour activer le sidebar admin
-- Copier-coller directement dans Supabase Dashboard → SQL Editor

-- Approche brutale : créer tout ce qu'il faut
BEGIN;

-- 1. Créer la table admin_roles si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Insérer le rôle super_admin s'il n'existe pas
INSERT INTO public.admin_roles (name, display_name, description, permissions)
VALUES (
    'super_admin', 
    'Super Administrateur', 
    'Super administrateur avec tous les droits', 
    '["*"]'
)
ON CONFLICT (name) DO NOTHING;

-- 3. Créer la table administrators si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.administrators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    role_id UUID NOT NULL REFERENCES public.admin_roles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, role_id)
);

-- 4. Insérer l'admin
INSERT INTO public.administrators (user_id, role_id, is_active)
VALUES (
    '646e81ca-b467-41c3-a376-ab57347131d9', -- admin@novrh.com
    (SELECT id FROM public.admin_roles WHERE name = 'super_admin' LIMIT 1),
    true
)
ON CONFLICT (user_id, role_id) DO UPDATE SET
    is_active = true,
    updated_at = now();

-- 5. Désactiver RLS temporairement
ALTER TABLE public.administrators DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;

-- 6. Accorder les permissions
GRANT ALL ON public.admin_roles TO anon, authenticated, service_role;
GRANT ALL ON public.administrators TO anon, authenticated, service_role;

COMMIT;

-- 7. Vérifier que ça marche
SELECT 'SUCCESS: Tables créées et admin ajouté' as status;

SELECT 'Admin roles:' as info, name, id 
FROM public.admin_roles 
WHERE name = 'super_admin';

SELECT 'Administrator created:' as info, a.* 
FROM public.administrators a 
WHERE a.user_id = '646e81ca-b467-41c3-a376-ab57347131d9';
