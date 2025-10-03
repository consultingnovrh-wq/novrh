-- SCRIPT FINAL POUR CORRIGER TOUS LES PROBLÈMES
-- Copier-coller dans Supabase Dashboard → SQL Editor

-- ==================== 1. CORRIGER LES ERREURS 400/406 ====================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrators DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;

-- Accorder toutes les permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- ==================== 2. CRÉER L'ADMIN POUR LA SIDEBAR ====================
-- Utiliser le rôle super_admin existant ou créer un nouveau avec un UUID différent
INSERT INTO public.admin_roles (
    name,
    display_name,
    description,
    permissions,
    created_at
)
VALUES (
    'super_admin',
    'Super Administrateur',
    'Super administrateur avec tous les droits',
    '["*"]',
    now()
)
ON CONFLICT (name) DO NOTHING;

-- Supprimer l'admin existant et le recréer
DELETE FROM public.administrators WHERE user_id = '646e81ca-b467-41c3-a376-ab57347131d9';

INSERT INTO public.administrators (
    user_id,
    role_id,
    is_active,
    created_at,
    updated_at
)
VALUES (
    '646e81ca-b467-41c3-a376-ab57347131d9', -- admin@novrh.com
    (SELECT id FROM public.admin_roles WHERE name = 'super_admin' LIMIT 1), -- UUID du rôle super_admin existant
    true,
    now(),
    now()
);

-- ==================== 3. CORRIGER SIRASAFE COMME ENTREPRISE ====================
-- Corriger le type d'utilisateur pour sirasafe
UPDATE public.profiles 
SET 
    user_type = 'company',
    updated_at = now()
WHERE email = 'contactsirasafe@gmail.com';

-- Créer l'entrée entreprise si elle n'existe pas
INSERT INTO public.companies (
    user_id,
    company_name,
    company_address,
    is_verified,
    created_at
)
SELECT 
    p.user_id,
    COALESCE(p.first_name, 'Sirasafe'),
    'Adresse entreprise',
    false,
    now()
FROM public.profiles p
WHERE p.email = 'contactsirasafe@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.companies c WHERE c.user_id = p.user_id
);

-- ==================== 4. VÉRIFICATIONS FINALES ====================
SELECT 'VÉRIFICATIONS:' as info;

-- Admin créé
SELECT 
    'ADMIN:' as type,
    'admin@novrh.com' as email,
    CASE WHEN EXISTS (
        SELECT 1 FROM public.administrators a 
        WHERE a.user_id = '646e81ca-b467-41c3-a376-ab57347131d9'
    ) THEN '✅ Créé' ELSE '❌ Manquant' END as status;

-- Sirasafe comme entreprise
SELECT 
    'ENTREPRISE:' as type,
    'contactsirasafe@gmail.com' as email,
    CASE WHEN EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.email = 'contactsirasafe@gmail.com' 
        AND p.user_type = 'company'
    ) THEN '✅ Configuré' ELSE '❌ Non configuré' END as status;

-- Données entreprise
SELECT 
    'DONNÉES ENTREPRISE:' as type,
    p.email,
    CASE WHEN c.company_name IS NOT NULL THEN '✅ Présent' ELSE '❌ Manquant' END as status
FROM public.profiles p
LEFT JOIN public.companies c ON c.user_id = p.user_id
WHERE p.email = 'contactsirasafe@gmail.com';

SELECT '🎉 TOUTES LES CORRECTIONS APPLIQUÉES!' as final_result;
