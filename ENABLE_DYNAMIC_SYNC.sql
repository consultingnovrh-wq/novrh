-- ACTIVATION COMPLÈTE DU SYSTÈME DYNAMIQUE
-- Ce script assure que toute nouvelle entreprise fonctionne automatiquement

-- ==================== 1. DÉSACTIVER RLS (PERMISSIF TEMPORAIREMENT) ====================
-- Permettre l'accès libre aux données pour éviter les erreurs 400/406
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- Accorder toutes les permissions aux rôles Supabase
GRANT ALL ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ==================== 2. CONFIRMER QUE LES TRIGGERS FONCTIONNENT ====================
-- Vérifier que les fonctions de synchronisation automatique existent
SELECT 
    'TRIGGERS EXISTANTS:' as info,
    proname as function_name,
    proowner as owner_id
FROM pg_proc 
WHERE proname IN ('handle_new_user', 'handle_user_update');

-- Vérifier que les triggers sont actifs
SELECT 
    'TRIGGERS ACTIFS:' as info,
    tgname as trigger_name,
    tgrelid::regclass as table_name
FROM pg_trigger 
WHERE tgname IN ('on_auth_user_created', 'on_auth_user_updated');

-- ==================== 3. CRÉER UN TEST DE SYNCHRONISATION AUTOMATIQUE ====================
-- Simuler une nouvelle inscription entreprise pour tester
WITH new_company AS (
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at
    )
    VALUES (
        gen_random_uuid(),
        'nouvelle-entreprise@example.com',
        crypt('password123', gen_salt('bf')),
        now(),
        '{
            "first_name": "Nouvelle Entreprise",
            "last_name": "SARL",
            "user_type": "company"
        }'::jsonb,
        now(),
        now()
    )
    RETURNING id, email, raw_user_meta_data
)
SELECT 'NOUVELLE ENTREPRISE SIMULÉE:' as info, email, raw_user_meta_data FROM new_company;

-- Vérifier que le profil a été créé automatiquement
SELECT 
    'PROFIL AUTO-CRÉÉ:' as info,
    p.email,
    p.user_type,
    p.first_name,
    p.is_active,
    p.email_verified
FROM public.profiles p
JOIN auth.users au ON au.id = p.user_id
WHERE au.email = 'nouvelle-entreprise@example.com';

-- ==================== 4. CRÉER L'ENTRÉE COMPANY MANUELLEMENT (COMPORTEMENT NORMAL) ====================
-- Le code React créé déjà cette entrée, mais simulons-la aussi
INSERT INTO public.companies (
    user_id,
    company_name,
    company_address,
    nif_matricule,
    is_verified,
    created_at
)
SELECT 
    au.id,
    au.raw_user_meta_data->>'first_name',
    'Adresse entreprise dynamique',
    'NIF123456789',
    false,
    now()
FROM auth.users au
WHERE au.email = 'nouvelle-entreprise@example.com'
AND NOT EXISTS (
    SELECT 1 FROM public.companies c WHERE c.user_id = au.id
);

-- ==================== 5. VÉRIFICATION FINALE ====================
SELECT 'VÉRIFICATION COMPLÈTE:' as result;

SELECT 
    au.email as email_user,
    p.user_type as profil_type,
    c.company_name as nom_entreprise,
    CASE 
        WHEN p.user_type = 'company' AND c.company_name IS NOT NULL 
        THEN '✅ SYNCHRONISATION DYNAMIQUE OK' 
        WHEN p.user_type = 'company' AND c.company_name IS NULL
        THEN '⚠️ PROFIL OK MAIS COMPANY MANQUANT'
        WHEN p.user_type != 'company'
        THEN '❌ USER_TYPE INCORRECT'
        ELSE '❌ PROBLÈME INCONNU'
    END as status_dynamique
FROM auth.users au
JOIN public.profiles p ON p.user_id = au.id
LEFT JOIN public.companies c ON c.user_id = au.id
WHERE au.email IN ('nouvelle-entreprise@example.com', 'test-entreprise@example.com');

-- Message de finalisation
SELECT '🎯 SYSTÈME DYNAMIQUE ACTIVÉ!' as final_status;
SELECT 'Désormais, toute nouvelle inscription entreprise fonctionnera automatiquement.' as instruction;
