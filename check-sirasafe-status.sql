-- Vérifier le statut de Sirasafe après la création
-- Copier-coller dans Supabase Dashboard → SQL Editor

-- 1. Vérifier le profil automatique de Sirasafe
SELECT 'PROFIL SIRASAFE:' as info;
SELECT 
    p.email,
    p.user_type,
    p.first_name,
    p.last_name,
    p.is_active,
    p.email_verified,
    p.created_at
FROM public.profiles p
WHERE p.email = 'contactsirasafe@gmail.com';

-- 2. Vérifier les données entreprise Sirasafe
SELECT 'DONNÉES ENTREPRISE SIRASAFE:' as info;
SELECT 
    c.user_id,
    c.company_name,
    c.company_address,
    c.nif_matricule,
    c.is_verified,
    c.created_at
FROM public.companies c
JOIN public.profiles p ON c.user_id = p.user_id
WHERE p.email = 'contactsirasafe@gmail.com';

-- 3. Diagnostic final complet
SELECT 'DIAGNOSTIC FINAL SIRASAFE:' as info;
SELECT 
    p.email,
    p.user_type,
    c.company_name as nom_entreprise,
    CASE 
        WHEN p.user_type = 'company' AND c.company_name IS NOT NULL 
        THEN '✅ ENTREPRISE PARFAITEMENT CONFIGURÉE' 
        WHEN p.user_type = 'company' AND c.company_name IS NULL
        THEN '⚠️ Profil OK mais données entreprise manquantes'
        WHEN p.user_type != 'company' AND p.user_type IS NOT NULL
        THEN CONCAT('❌ Mauvais user_type: ', p.user_type)
        WHEN p.user_type IS NULL
        THEN '❌ Profil non créé par le trigger'
        ELSE '❌ Problème inconnu'
    END as statut_configuration
FROM public.profiles p
LEFT JOIN public.companies c ON c.user_id = p.user_id
WHERE p.email = 'contactsirasafe@gmail.com';

-- 4. Vérification dans auth.users pour comparaison
SELECT 'COMPARAISON AUTH.USERS:' as info;
SELECT 
    'User ID:' as field,
    au.id::text as valeur
FROM auth.users au
WHERE au.email = 'contactsirasafe@gmail.com'
UNION ALL
SELECT 
    'Display Name:' as field,
    COALESCE(au.raw_user_meta_data->>'first_name', 'Non défini') as valeur
FROM auth.users au
WHERE au.email = 'contactsirasafe@gmail.com'
UNION ALL
SELECT 
    'User Type dans meta:' as field,
    COALESCE(au.raw_user_meta_data->>'user_type', 'Non défini') as valeur
FROM auth.users au
WHERE au.email = 'contactsirasafe@gmail.com';
