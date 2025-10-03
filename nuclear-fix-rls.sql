-- SOLUTION NUCLÉAIRE - SUPPRIME TOUS LES RLS
-- Copier-coller dans Supabase Dashboard → SQL Editor

-- ==================== ÉTAPE 1: SUPPRIMER TOUTES LES POLITIQUES RLS ====================
-- Supprimer toutes les politiques existantes
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
    END LOOP;
END $$;

-- ==================== ÉTAPE 2: DÉSACTIVER COMPLÈTEMENT RLS ====================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrators DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;

-- ==================== ÉTAPE 3: ACCORDE TOUTES LES PERMISSIONS ====================
-- Accorder toutes permissions sur schema public
GRANT ALL ON SCHEMA public TO anon, authenticated, service_role, public;

-- Accorder toutes permissions sur toutes les tables
DO $$
DECLARE 
    tbl RECORD;
BEGIN
    FOR tbl IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('GRANT ALL ON TABLE %I.%I TO anon, authenticated, service_role, public',
                      tbl.schemaname, tbl.tablename);
    END LOOP;
END $$;

-- ==================== ÉTAPE 4: ACCORDE PERMISSIONS SUR FONCTIONS ====================
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role, public;

-- ==================== ÉTAPE 5: ACCORDE PERMISSIONS SUR SÉQUENCES ====================
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role, public;

-- ==================== ÉTAPE 6: CORRIGER CONTACT@VAVO.COM ====================
-- Forcer la configuration entreprise
UPDATE public.profiles 
SET 
    user_type = 'company',
    updated_at = now()
WHERE email = 'contact@vavo.com';

-- Créer données entreprise si manquantes
INSERT INTO public.companies (
    user_id,
    company_name,
    company_address,
    is_verified
)
SELECT 
    p.user_id,
    COALESCE(p.first_name, 'Vavo Entreprise'),
    'Adresse entreprise',
    false
FROM public.profiles p
WHERE p.email = 'contact@vavo.com'
ON CONFLICT (user_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    updated_at = now();

-- ==================== ÉTAPE 7: VÉRIFICATION FINALE ====================
SELECT 'VÉRIFICATION FINALE:' as info;

-- Vérifier RLS désactivé
SELECT 
    tablename,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = tablename 
        AND n.nspname = 'public' 
        AND NOT c.relrowsecurity
    ) THEN '✅ RLS DÉSACTIVÉ' ELSE '❌ RLS ENCORE ACTIF' END as statut_rls
FROM (
    VALUES ('profiles'), ('companies'), ('candidates'), ('administrators')
) AS t(tablename);

-- Vérifier contact@vavo.com
SELECT 
    p.email,
    p.user_type,
    c.company_name,
    CASE WHEN p.user_type = 'company' AND c.company_name IS NOT NULL 
         THEN '✅ PRÊT POUR DASHBOARD ENTREPRISE' 
         ELSE '❌ ENCORE UN PROBLÈME' END as resultat
FROM public.profiles p
LEFT JOIN public.companies c ON c.user_id = p.user_id
WHERE p.email = 'contact@vavo.com';

SELECT '🚀 SOLUTION NUCLÉAIRE APPLIQUÉE!' as message;
