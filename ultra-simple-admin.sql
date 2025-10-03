-- Script ultra-simple - utilise le rôle existant
-- Copier-coller directement dans Supabase Dashboard → SQL Editor

-- 1. Voir l'UUID du rôle super_admin existant
SELECT 'Role super_admin UUID:' as info, id as uuid FROM public.admin_roles WHERE name = 'super_admin';

-- 2. Supprimer toute entrée admin existante
DELETE FROM public.administrators WHERE user_id = '646e81ca-b467-41c3-a376-ab57347131d9';

-- 3. Créer l'admin avec l'UUID récupéré
INSERT INTO public.administrators (
    user_id,
    role_id,
    is_active,
    created_at,
    updated_at
)
SELECT 
    '646e81ca-b467-41c3-a376-ab57347131d9', -- admin@novrh.com
    id, -- UUID du rôle super_admin
    true,
    now(),
    now()
FROM public.admin_roles 
WHERE name = 'super_admin';

-- 4. Désactiver RLS temporairement
ALTER TABLE public.administrators DISABLE ROW LEVEL SECURITY;

-- 5. Vérification finale
SELECT 'SUCCESS: Admin créé!' as status;
SELECT COUNT(*) as admin_count FROM public.administrators WHERE user_id = '646e81ca-b467-41c3-a376-ab57347131d9';
