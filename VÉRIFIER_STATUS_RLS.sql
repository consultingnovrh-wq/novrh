-- VÉRIFIER LE STATUT ACTUEL DES RLS ET PERMISSIONS
-- Copier-coller dans Supabase Dashboard → SQL Editor

-- ==================== VÉRIFIER RLS STATUS ====================
SELECT '📊 STATUT RLS ACTUEL:' as info;

SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_class c 
            JOIN pg_namespace n ON n.oid = c.relnamespace 
            WHERE c.relname = tablename 
            AND n.nspname = schemaname 
            AND c.relrowsecurity = false
        ) THEN '✅ RLS DÉSACTIVÉ'
        ELSE '❌ RLS ENCORE ACTIF' 
    END as statut_rls
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'companies', 'candidates', 'administrators')
ORDER BY tablename;

-- ==================== VÉRIFIER LES POLITIQUES RLS ====================
SELECT '📋 POLITIQUES RLS RESTANTES:' as info;

SELECT 
    schemaname,
    tablename,
    policyname,
    'Politique active' as statut
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ==================== VERSIFIER LES ENTREPRISES ====================
SELECT '🏢 ENTREPRISES CONFIGURÉES:' as info;

SELECT 
    p.email,
    p.user_type,
    c.company_name,
    CASE 
        WHEN p.user_type = 'company' AND c.company_name IS NOT NULL 
        THEN '✅ PRÊT POUR /dashboard/company'
        WHEN p.user_type = 'company' 
        THEN '⚠️ ENTREPRISE SANS DONNÉES COMPANIES'
        ELSE '❌ PAS CONFIGURÉE COMME ENTREPRISE' 
    END as statut
FROM public.profiles p
LEFT JOIN public.companies c ON c.user_id = p.user_id
WHERE p.email IN ('google@gmail.com', 'contact@vavo.com', 'contactsirasafe@gmail.com')
ORDER BY p.email;

-- ==================== PERMISSIONS DE RÔLES ====================
SELECT '🔐 PERMISSIONS DES RÔLES:' as info;

SELECT 
    r.rolname as role_name,
    'Permissions sur schema public' as scope,
    CASE 
        WHEN has_schema_privilege(r.oid, 'public', 'USAGE') THEN '✅ USAGE'
        ELSE '❌ PAS USAGE'
    END as permissions
FROM pg_roles r
WHERE r.rolname IN ('anon', 'authenticated', 'service_role')
ORDER BY r.rolname;

-- ==================== VÉRIFIER FONCTION TRIGGER ====================
SELECT '⚙️ FONCTIONS TRIGGER:' as info;

SELECT 
    routine_name,
    routine_type,
    'Fonction présente' as statut
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE 'handle_%user%'
ORDER BY routine_name;

-- ==================== RÉSUMÉ DIAGNOSTIC ====================
SELECT '🎯 RÉSUMÉ DIAGNOSTIC:' as summary;

-- Compter les tables avec RLS activé
SELECT 
    COUNT(*) as tables_avec_rls_actif,
    'Tables avec RLS encore actif' as description
FROM pg_tables pt
JOIN pg_class pc ON pc.relname = pt.tablename
JOIN pg_namespace pn ON pn.oid = pc.relnamespace
WHERE pt.schemaname = 'public' 
AND pt.tablename IN ('profiles', 'companies', 'candidates', 'administrators')
AND pc.relrowsecurity = true;

-- Compter les politiques RLS restantes
SELECT 
    COUNT(*) as politiques_rls_restantes,
    'Politiques RLS encore présentes' as description
FROM pg_policies 
WHERE schemaname = 'public';

SELECT '🔧 ACTIONS RECOMMANDÉES:' as actions;
SELECT 'Si RLS encore actif → Relancer ULTIMATE_PERMISSIONS_FIX.sql' as action1;
SELECT 'Si google@gmail.com pas configuré → Ajouter dans le script' as action2;
SELECT 'Si erreurs 406 persistent → Débugger l''application frontend' as action3;
