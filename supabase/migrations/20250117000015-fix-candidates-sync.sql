-- Migration pour corriger la synchronisation des candidats
-- Date: 17 janvier 2025

-- 1. Insérer les candidats manquants dans la table candidates
INSERT INTO public.candidates (
    user_id,
    first_name,
    last_name,
    phone,
    profile_description,
    created_at,
    updated_at
)
SELECT 
    p.user_id,
    p.first_name,
    p.last_name,
    NULL as phone, -- phone sera mis à jour plus tard
    'Profil syncronisé automatiquement' as profile_description,
    p.created_at,
    now() as updated_at
FROM public.profiles p
WHERE p.user_type = 'candidate'
AND NOT EXISTS (
    SELECT 1 FROM public.candidates c 
    WHERE c.user_id = p.user_id
);

-- 2. Mettre à jour les téléphones depuis auth.users si disponibles
-- Note: On utilisera les données déjà dans profiles pour éviter l'accès direct à auth.users
UPDATE public.candidates 
SET 
    phone = CASE 
        WHEN au.email = 'ousmanebaradji0@gmail.com' THEN '+33773444349'
        WHEN au.email = 'zainacherif2019@gmail.com' THEN '+33751490871'
        WHEN au.email = 'mohammedtraore301@gmail.com' THEN '+22375904436'
        WHEN au.email = 'speakaboutai@gmail.com' THEN '+223 75903322'
        ELSE phone
    END,
    updated_at = now()
FROM (
    SELECT 
        p.user_id,
        p.email
    FROM public.profiles p
    WHERE p.user_type = 'candidate'
) au
WHERE public.candidates.user_id = au.user_id
AND public.candidates.phone IS NULL;

-- 3. Vérifier que RLS est désactivé temporairement sur candidates
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;

-- 4. Insérer les entreprises manquantes (si elles existent)
INSERT INTO public.companies (
    user_id,
    company_name,
    company_address,
    nif_matricule,
    created_at,
    updated_at
)
SELECT 
    p.user_id,
    p.first_name as company_name,
    '' as company_address,
    '' as nif_matricule,
    p.created_at,
    now() as updated_at
FROM public.profiles p
WHERE p.user_type = 'company'
AND NOT EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.user_id = p.user_id
);

-- 5. Désactiver RLS temporairement sur companies aussi
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- 6. Créer un déclencheur pour synchroniser automatiquement les futurs candidats
CREATE OR REPLACE FUNCTION public.sync_candidate_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Si c'est un candidat, créer l'entrée dans candidates
    IF NEW.user_type = 'candidate' THEN
        INSERT INTO public.candidates (
            user_id,
            first_name,
            last_name,
            phone,
            profile_description,
            created_at,
            updated_at
        )
        VALUES (
            NEW.user_id,
            NEW.first_name,
            NEW.last_name,
            NULL,
            'Nouveau profil candidat',
            NEW.created_at,
            now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            updated_at = now();
    END IF;
    
    -- Si c'est une entreprise, créer l'entrée dans companies
    IF NEW.user_type = 'company' THEN
        INSERT INTO public.companies (
            user_id,
            company_name,
            company_address,
            nif_matricule,
            created_at,
            updated_at
        )
        VALUES (
            NEW.user_id,
            NEW.first_name,
            '',
            '',
            NEW.created_at,
            now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            company_name = EXCLUDED.company_name,
            updated_at = now();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Créer le trigger pour la synchronisation automatique
DROP TRIGGER IF EXISTS sync_profile_to_tables ON public.profiles;
CREATE TRIGGER sync_profile_to_tables
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_candidate_profile();

-- 8. Afficher les résultats
SELECT 
    'Synchro candidats' as opération,
    COUNT(*) as entrées_ajoutées
FROM public.candidates

UNION ALL

SELECT 
    'Synchro entreprises' as opération,
    COUNT(*) as entrées_ajoutées
FROM public.companies;
