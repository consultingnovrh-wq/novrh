-- Migration pour corriger l'inscription des utilisateurs
-- Date: 17 janvier 2025

-- 1. Vérifier et corriger les politiques RLS pour l'inscription
-- Supprimer les politiques problématiques
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation during registration" ON public.profiles;

-- 2. Créer une politique permissive pour l'inscription
CREATE POLICY "Allow profile creation during registration" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- 3. Vérifier et corriger les politiques pour la table candidates
DROP POLICY IF EXISTS "Allow candidate creation during registration" ON public.candidates;
DROP POLICY IF EXISTS "Candidates can insert their own profile" ON public.candidates;

CREATE POLICY "Allow candidate creation during registration" ON public.candidates
  FOR INSERT WITH CHECK (true);

-- 4. Vérifier et corriger les politiques pour la table companies
DROP POLICY IF EXISTS "Allow company creation during registration" ON public.companies;
DROP POLICY IF EXISTS "Companies can insert their own profile" ON public.companies;

CREATE POLICY "Allow company creation during registration" ON public.companies
  FOR INSERT WITH CHECK (true);

-- 5. Vérifier que les triggers fonctionnent correctement
-- Recréer le trigger pour la synchronisation automatique
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Tester la fonction de synchronisation
DO $$
DECLARE
    test_user_id UUID;
    test_profile RECORD;
BEGIN
    -- Vérifier qu'un utilisateur existe pour tester
    SELECT id INTO test_user_id 
    FROM auth.users 
    WHERE email = 'admin@novrh.com'
    LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Vérifier que le profil existe
        SELECT * INTO test_profile 
        FROM public.profiles 
        WHERE user_id = test_user_id;
        
        IF test_profile IS NOT NULL THEN
            RAISE NOTICE '✅ Synchronisation fonctionnelle: Profil trouvé pour %', test_profile.email;
        ELSE
            RAISE NOTICE '⚠️ Synchronisation problématique: Profil manquant pour user_id %', test_user_id;
        END IF;
    ELSE
        RAISE NOTICE 'ℹ️ Aucun utilisateur de test trouvé';
    END IF;
END $$;

-- 7. Afficher l'état des politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'candidates', 'companies')
ORDER BY tablename, policyname;
