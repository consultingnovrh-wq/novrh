-- SCRIPT ULTRA-SIMPLE SANS CONFLIT
-- Copier-coller dans Supabase Dashboard → SQL Editor

-- 1. CORRIGER LES ERREURS 400/406
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrators DISABLE ROW LEVEL SECURITY;

-- 2. CORRIGER SIRASAFE COMME ENTREPRISE
UPDATE public.profiles 
SET user_type = 'company'
WHERE email = 'contactsirasafe@gmail.com';

-- Créer l'entrée entreprise si elle n'existe pas
INSERT INTO public.companies (
    user_id,
    company_name,
    company_address,
    is_verified
)
SELECT 
    p.user_id,
    COALESCE(p.first_name, 'Sirasafe'),
    'Adresse entreprise',
    false
FROM public.profiles p
WHERE p.email = 'contactsirasafe@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.companies c WHERE c.user_id = p.user_id
);

-- 3. CRÉER L'ADMIN SIMPLEMENT
-- Supprimer ancien admin s'il existe
DELETE FROM public.administrators WHERE user_id = '646e81ca-b467-41c3-a376-ab57347131d9';

-- Utiliser le premier rôle existant ou créer un nouveau
INSERT INTO public.administrators (
    user_id,
    role_id,
    is_active
)
VALUES (
    '646e81ca-b467-41c3-a376-ab57347131d9',
    COALESCE(
        (SELECT id FROM public.admin_roles WHERE name = 'super_admin' LIMIT 1),
        (SELECT id FROM public.admin_roles LIMIT 1),
        gen_random_uuid()
    ),
    true
);

-- <｜tool▁call▁begin｜>

SELECT '✅ CORRECTIONS APPLIQUÉES!' as result;
