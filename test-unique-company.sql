-- TESTER AVEC UN EMAIL UNIQUE
-- Copier-coller dans Supabase Dashboard → SQL Editor

-- ==================== ÉTAPE 1: CRÉER UNE ENTREPRISE TEST UNIQUE ====================
-- Utiliser un email avec timestamp pour être unique
DO $$
DECLARE
    test_email TEXT := 'test-entreprise-' || EXTRACT(EPOCH FROM NOW()) || '@example.com';
    result_user TEXT;
BEGIN
    RAISE NOTICE 'Création entreprise test avec email: %', test_email;
    
    -- Insérer dans auth.users (simulation - ne peut pas être fait via SQL direct)
    RAISE NOTICE 'IMPORTANT: Utiliser le frontend pour créer cette entreprise avec cet email: %', test_email;
    RAISE NOTICE 'Puis exécuter la migration de synchronisation automatique';
    
END $$;

-- ==================== ÉTAPE 2: OU TESTER AVEC UN EMAIL EXISTANT ====================
-- Si vous voulez tester avec un email qui existe déjà
DO $$
DECLARE
    existing_email TEXT := 'contactsirasafe@gmail.com'; -- Email qui existe déjà
    user_info RECORD;
BEGIN
    RAISE NOTICE '--- DIAGNOSTIC POUR EMAIL EXISTANT: % ---', existing_email;
    
    -- Vérifier dans auth.users
    SELECT COUNT(*) as count_auth_users INTO user_info
    FROM auth.users WHERE email = existing_email;
    
    RAISE NOTICE 'Présent dans auth.users: %', user_info.count_auth_users;
    
    -- Vérifier dans profiles
    SELECT COUNT(*) as count_profiles INTO user_info  
    FROM public.profiles WHERE email = existing_email;
    
    RAISE NOTICE 'Présent quand type 'company': %', user_info.count_profiles;
    
    -- Forcer cette entreprise à être configurée correctement
    UPDATE public.profiles 
    SET 
        user_type = 'company',
        updated_at = now()
    WHERE email = existing_email;
    
    IF FOUND THEN
        RAISE NOTICE '✅ Profil mis à jour vers company pour: %', existing_email;
        
        -- Créer données entreprise si manquantes
        INSERT INTO public.companies (
            user_id,
            company_name,
            company_address,
            nif_matricule,
            is_verified
        )
        SELECT 
            p.user_id,
            COALESCE(p.first_name, 'Test Entreprise'),
            'Adresse test',
            'NIF_TEST_' || ABS(HASHTEXT(existing_email)),
            false
        FROM public.profiles p
        WHERE p.email = existing_email
        ON CONFLICT (user_id) DO UPDATE SET
            company_name = EXCLUDED.company_name,
            updated_at = now();
            
        RAISE NOTICE '✅ Données entreprise créées/mises à jour pour: %', existing_email;
    ELSE
        RAISE NOTICE '❌ Profil non trouvé pour: %', existing_email;
    END IF;

END $$;

-- ==================== ÉTAPE 3: VÉRIFICATION FINALE ====================
SELECT '-- RÉSUMÉ DES ENTREPRISES CONFIGURÉES --' as info;

SELECT 
    p.email,
    p.user_type,
    c.company_name,
    CASE 
        WHEN p.user_type = 'company' AND c.company_name IS NOT NULL 
        THEN '✅ PRÊT POUR /dashboard/company' 
        WHEN p.user_type = 'company' 
        THEN '⚠️ ENTREPRISE SANS DONNÉES' 
        ELSE '❌ PAS CONFIGURÉE COMME ENTREPRISE' 
    END as statut,
    'Connexion recommandée: ' || p.email as suggestion_connexion
FROM public.profiles p
LEFT JOIN public.companies c ON c.user_id = p.user_type = 'company';

SELECT '-- INSTRUCTIONS DE TEST --' as instructions;
SELECT '1. Utiliser emails existants:' as instruction;
SELECT '2. Contactsirasafe@gmail.com OU contact@vavo.com' as emails_disponibles;
SELECT '3. Se connecter avec un de ces emails' as connexion;
SELECT '4. Cliquer "Mon Compte" → "Tableau de bord"' as test_navigation;
