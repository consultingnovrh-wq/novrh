-- DIAGNOSTIC URGENT - NOUVELLE ENTREPRISE NON FONCTIONNELLE
-- Copier-coller dans Supabase Dashboard → SQL Editor

-- 1. État RLS actuel
SELECT 'ÉTAT RLS:' as info;

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_active
FROM pg_tables 
WHERE tablename IN ('profiles', 'companies', 'candidates')
AND schemaname = 'public';

-- 2. Profil de contact@vavo.com
SELECT 'PROFIL VAVO:' as info;
SELECT 
    p.email,
    p.user_type,
    p.first_name,
    p.last_name,
    p.is_active,
    p.email_verified,
    p.created_at
FROM public.profiles p
WHERE p.email = 'contact@vavo.com';

-- 3. Données entreprise VAVO
SELECT 'DONNÉES ENTREPRISE VAVO:' as info;
SELECT 
    c.user_id,
    c.company_name,
    c.company_address,
    c.nif_matricule,
    c.is_verified,
    c.created_at
FROM public.companies c
JOIN public.profiles p ON c.user_id = p.user_id
WHERE p.email = 'contact@vavo.com';

-- 4. Vérification auth.users pour VAVO
SELECT 'AUTH USERS VAVO:' as info;
SELECT 
    au.email,
    au.email_confirmed_at,
    au.raw_user_meta_data->>'user_type' as user_type_meta,
    au.raw_user_meta_data->>'first_name' as first_name_meta,
    au.created_at
FROM auth.users au
WHERE au.email = 'contact@vavo.com';

-- 5. Diagnostic global VAVO
SELECT 'DIAGNOSTIC FINAL VAVO:' as info;
SELECT 
    au.email as email_auth,
    au.raw_user_meta_data->>'user_type' as type_inscription,
    p.user_type as type_profil,
    p.is_active as profil_actif,
    c.company_name as nom_entreprise,
    CASE 
        WHEN au.raw_user_meta_data->>'user_type' = 'company' 
         AND p.user_type = 'company' 
         AND c.company_name IS NOT NULL
        THEN '✅ SYNCHRONISATION PARFAITE'
        WHEN au.raw_user_meta_data->>'user_type' = 'company' 
         AND p.user_type = 'company' 
         AND c.company_name IS NULL
        THEN '⚠️ Profil OK mais données entreprise manquantes'
        WHEN au.raw_user_meta_data->>'user_type' = 'company' 
         AND p.user_type != 'company'
        THEN '❀ ERREUR TRIGGER: user_type pas transféré'
        WHEN au.raw_user_meta_data->>'user_type' != 'company'
        THEN '❌ Inscription pas comme entreprise'
        ELSE '❓ PROBLÈME INCONNU'
    END as diagnostic_complet
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
LEFT JOIN public.companies c ON c.user_id = au.id
WHERE au.email = 'contact@vavo.com';

-- 6. Correction urgente si nécessaire
UPDATE public.profiles 
SET 
    user_type = 'company',
    updated_at = now()
WHERE email = 'contact@vavo.com'
AND user_type != 'company';

-- Message final
SELECT '🆘 DIAGNOSTIC TERMINÉ' as message;
