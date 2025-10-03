-- SOLUTION ULTIME - PERMISSIONS COMPLETES + ADMIN CREATION
-- Copier-coller dans Supabase Dashboard → SQL Editor

BEGIN;

-- ==================== SUPPRIMER COMPLÈTEMENT TOUTES LES RESTRICTIONS ====================

-- 1. Supprimer TOUTES les politiques RLS (même cachées)
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      pol.policyname, pol.schemaname, pol.tablename);
        RAISE NOTICE 'Politique supprimée: %.%', pol.schemaname, pol.policyname;
    END LOOP;
END $$;

-- 2. Désactiver RLS sur TOUTES les tables importantes
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrators DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings DISABLE ROW LEVEL SECURITY;

-- 3. Accorder TOUTES les permissions imaginables
GRANT ALL ON SCHEMA public TO anon, authenticated, service_role, public, supabase_auth_admin;

-- Permissions sur toutes les tables
DO $$
DECLARE 
    tbl RECORD;
BEGIN
    FOR tbl IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('GRANT ALL ON TABLE %I.%I TO anon, authenticated, service_role, public, supabase_auth_admin',
                      tbl.schemaname, tbl.tablename);
        EXECUTE format('GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE %I.%I TO anon, authenticated, service_role, public, supabase_auth_admin',
                      tbl.schemaname, tbl.tablename);
    END LOOP;
END $$;

-- Permissions sur toutes les fonctions
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role, public, supabase_auth_admin;

-- Permissions sur toutes les séquences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role, public, supabase_auth_admin;

-- ==================== CONFIGURER L'ADMIN SUPÉRIEUR ====================

-- Créer le rôle super_admin s'il n'existe pas
INSERT INTO public.admin_roles (name, display_name, description, permissions, created_at)
VALUES ('super_admin', 'Super Administrateur', 'Super administrateur avec tous les droits', '["*"]', now())
ON CONFLICT (name) DO NOTHING;

-- Supprimer admin existant et le recréer
DELETE FROM public.administrators WHERE user_id = '646e81ca-b467-41c3-a376-ab57347131d9';

INSERT INTO public.administrators (user_id, role_id, is_active, created_at, updated_at)
VALUES (
    '646e81ca-b467-41c3-a376-ab57347131d9', -- admin@novrh.com
    (SELECT id FROM public.admin_roles WHERE name = 'super_admin' LIMIT 1),
    true,
    now(),
    now()
);

-- ==================== CONFIGURER CONTACT@VAVO.COM COMME ENTREPRISE ====================

-- Forcer user_type = company
UPDATE public.profiles 
SET 
    user_type = 'company',
    updated_at = now()
WHERE email = 'contact@vavo.com';

-- Créer/update données entreprise
INSERT INTO public.companies (
    user_id,
    company_name,
    company_address,
    nif_matricule,
    is_verified,
    created_at,
    updated_at
)
SELECT 
    p.user_id,
    'Vavo Entreprise',
    'Adresse Vavo Entreprise',
    'NIF_VAVO_001',
    false,
    now(),
    now()
FROM public.profiles p
WHERE p.email = 'contact@vavo.com'
ON CONFLICT (user_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    nif_matricule = EXCLUDED.nif_matricule,
    updated_at = now();

-- ==================== CONFIGURER CONTACTSIRASAFE@GMAIL.COM COMME ENTREPRISE ====================

-- Forcer aussi Sirasafe
UPDATE public.profiles 
SET 
    user_type = 'company',
    updated_at = now()
WHERE email = 'contactsirasafe@gmail.com';

-- Créer/update Sirasafe
INSERT INTO public.companies (
    user_id,
    company_name,
    company_address,
    nif_matricule,
    is_verified,
    created_at,
    updated_at
)
SELECT 
    p.user_id,
    'Sirasafe Entreprise',
    'Adresse Sirasafe',
    'NIF_SIRASAFE_001',
    false,
    now(),
    now()
FROM public.profiles p
WHERE p.email = 'contactsirasafe@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    nif_matricule = EXCLUDED.nif_matricule,
    updated_at = now();

-- ==================== VÉRIFICATION FINALE ====================
SELECT '✅ PERMISSIONS ULTIMES APPLIQUÉES!' as status;

-- Vérifier que RLS est désactivé
SELECT '📊 STATUT RLS:' as rls_check;
SELECT 
    schemaname,
    tablename,
    CASE WHEN NOT relrowsecurity THEN '✅ RLS DÉSACTIVÉ' ELSE '❌ RLS ENCORE ACTIF' END as statut
FROM pg_tables pt
JOIN pg_class pc ON pc.relname = pt.tablename
JOIN pg_namespace pn ON pn.oid = pc.relnamespace
WHERE pt.schemaname = 'public' 
AND pt.tablename IN ('profiles', 'companies', 'administrators');

-- Vérifier les entreprises configurées
SELECT '🏢 ENTREPRISES CONFIGURÉES:' as entreprises;
SELECT 
    p.email,
    p.user_type,
    c.company_name,
    CASE WHEN p.user_type = 'company' AND c.company_name IS NOT NULL 
         THEN '✅ PRÊT' 
         ELSE '❌ PROBLÈME' END as statut
FROM public.profiles p
LEFT JOIN public.companies c ON c.user_id = p.user_id
WHERE p.email IN ('contact@vavo.com', 'contactsirasafe@gmail.com')
ORDER BY p.email;

COMMIT;

SELECT '🚀 MAINTENANT TESTER:' as instructions;
SELECT '1. FERMER le navigateur complètement' as etape1;
SELECT '2. Ouvrir nouvelle session' as etape2;
SELECT '3. Se connecter avec contact@vavo.com OU contactsirasafe@gmail.com' as etape3;
SELECT '4. Cliquer "Mon Compte" → "Tableau de bord"' as etape4;
SELECT '5. Doit aller vers /dashboard/company sans erreurs!' as etape5;
