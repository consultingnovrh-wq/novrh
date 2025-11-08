-- ============================================
-- MIGRATION: Standardisation des références utilisateur
-- Date: 2025-01-23
-- Objectif: Harmoniser toutes les FK pour pointer vers auth.users(id)
-- ============================================

-- ============================================
-- ÉTAPE 1: Créer les types ENUM manquants
-- ============================================

-- Type pour le statut des paiements
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'cancelled');
    END IF;
END $$;

-- Type pour le statut des abonnements
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'expired', 'cancelled', 'pending', 'trial');
    END IF;
END $$;

-- Vérifier/créer le type user_type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
        CREATE TYPE user_type AS ENUM ('candidate', 'company', 'admin');
    END IF;
END $$;

-- ============================================
-- ÉTAPE 2: Fonction trigger pour créer automatiquement un profil
-- ============================================

-- Fonction pour créer automatiquement un profil lors de la création d'un utilisateur auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        user_id,
        email,
        first_name,
        last_name,
        user_type,
        is_active,
        email_verified,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur'), ' ', 1)),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 
            CASE 
                WHEN NEW.raw_user_meta_data->>'full_name' IS NOT NULL 
                THEN SUBSTRING(NEW.raw_user_meta_data->>'full_name' FROM POSITION(' ' IN NEW.raw_user_meta_data->>'full_name') + 1)
                ELSE ''
            END
        ),
        COALESCE(
            CASE 
                WHEN NEW.raw_user_meta_data->>'user_type' = 'employer' THEN 'company'::user_type
                WHEN NEW.raw_user_meta_data->>'user_type' = 'student' THEN 'candidate'::user_type
                WHEN NEW.raw_user_meta_data->>'user_type' = 'admin' THEN 'admin'::user_type
                WHEN NEW.raw_user_meta_data->>'user_type' = 'company' THEN 'company'::user_type
                WHEN NEW.raw_user_meta_data->>'user_type' = 'candidate' THEN 'candidate'::user_type
                ELSE 'candidate'::user_type
            END,
            'candidate'::user_type
        ),
        true,
        (NEW.email_confirmed_at IS NOT NULL),
        COALESCE(NEW.created_at, NOW()),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger si il n'existe pas déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ÉTAPE 3: Créer tous les profils manquants pour les utilisateurs existants
-- ============================================

-- Désactiver RLS temporairement pour créer les profils
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Insérer les profils manquants
INSERT INTO public.profiles (
    user_id,
    email,
    first_name,
    last_name,
    user_type,
    is_active,
    email_verified,
    created_at,
    updated_at
)
SELECT 
    au.id as user_id,
    COALESCE(au.email, '') as email,
    COALESCE(
        au.raw_user_meta_data->>'first_name', 
        SPLIT_PART(COALESCE(au.raw_user_meta_data->>'full_name', 'Utilisateur'), ' ', 1),
        'Utilisateur'
    ) as first_name,
    COALESCE(
        au.raw_user_meta_data->>'last_name',
        CASE 
            WHEN au.raw_user_meta_data->>'full_name' IS NOT NULL 
            THEN SUBSTRING(au.raw_user_meta_data->>'full_name' FROM POSITION(' ' IN au.raw_user_meta_data->>'full_name') + 1)
            ELSE ''
        END,
        ''
    ) as last_name,
    COALESCE(
        CASE 
            WHEN au.raw_user_meta_data->>'user_type' = 'employer' THEN 'company'::user_type
            WHEN au.raw_user_meta_data->>'user_type' = 'student' THEN 'candidate'::user_type
            WHEN au.raw_user_meta_data->>'user_type' = 'admin' THEN 'admin'::user_type
            WHEN au.raw_user_meta_data->>'user_type' = 'company' THEN 'company'::user_type
            WHEN au.raw_user_meta_data->>'user_type' = 'candidate' THEN 'candidate'::user_type
            ELSE 'candidate'::user_type
        END,
        'candidate'::user_type
    ) as user_type,
    true as is_active,
    (au.email_confirmed_at IS NOT NULL) as email_verified,
    COALESCE(au.created_at, NOW()) as created_at,
    NOW() as updated_at
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.user_id = au.id
)
ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- Réactiver RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ÉTAPE 4: Migrer les données et corriger les FK
-- ============================================

-- 4.1: service_reviews - Migrer user_id de profiles.id vers auth.users.id
DO $$
DECLARE
    review_record RECORD;
    auth_user_id UUID;
BEGIN
    -- Pour chaque review qui référence profiles.id, trouver le auth.users.id correspondant
    FOR review_record IN 
        SELECT sr.id, sr.user_id as profile_id
        FROM service_reviews sr
        WHERE EXISTS (
            SELECT 1 FROM profiles p WHERE p.id = sr.user_id
        )
    LOOP
        -- Trouver l'auth.users.id correspondant
        SELECT p.user_id INTO auth_user_id
        FROM profiles p
        WHERE p.id = review_record.profile_id
        LIMIT 1;
        
        -- Mettre à jour si on trouve une correspondance
        IF auth_user_id IS NOT NULL THEN
            UPDATE service_reviews
            SET user_id = auth_user_id
            WHERE id = review_record.id;
        END IF;
    END LOOP;
END $$;

-- Supprimer l'ancienne FK et créer la nouvelle
DO $$
DECLARE
    fk_name TEXT;
BEGIN
    -- Trouver et supprimer l'ancienne FK
    SELECT tc.constraint_name INTO fk_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'public'
        AND tc.table_name = 'service_reviews'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'user_id'
        AND tc.constraint_name IN (
            SELECT ccu.constraint_name
            FROM information_schema.constraint_column_usage ccu
            WHERE ccu.table_schema = 'public'
                AND ccu.table_name = 'profiles'
        )
        LIMIT 1;
    
    IF fk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.service_reviews DROP CONSTRAINT IF EXISTS %I', fk_name);
    END IF;
END $$;

-- Créer la nouvelle FK vers auth.users
ALTER TABLE public.service_reviews
DROP CONSTRAINT IF EXISTS service_reviews_user_id_fkey;

ALTER TABLE public.service_reviews
ADD CONSTRAINT service_reviews_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 4.2: review_responses - Migrer responder_id
DO $$
DECLARE
    response_record RECORD;
    auth_user_id UUID;
BEGIN
    FOR response_record IN 
        SELECT rr.id, rr.responder_id as profile_id
        FROM review_responses rr
        WHERE EXISTS (
            SELECT 1 FROM profiles p WHERE p.id = rr.responder_id
        )
    LOOP
        SELECT p.user_id INTO auth_user_id
        FROM profiles p
        WHERE p.id = response_record.profile_id
        LIMIT 1;
        
        IF auth_user_id IS NOT NULL THEN
            UPDATE review_responses
            SET responder_id = auth_user_id
            WHERE id = response_record.id;
        END IF;
    END LOOP;
END $$;

-- Corriger la FK de review_responses.responder_id
DO $$
DECLARE
    fk_name TEXT;
BEGIN
    SELECT tc.constraint_name INTO fk_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'public'
        AND tc.table_name = 'review_responses'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'responder_id'
        AND tc.constraint_name IN (
            SELECT ccu.constraint_name
            FROM information_schema.constraint_column_usage ccu
            WHERE ccu.table_schema = 'public'
                AND ccu.table_name = 'profiles'
        )
        LIMIT 1;
    
    IF fk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.review_responses DROP CONSTRAINT IF EXISTS %I', fk_name);
    END IF;
END $$;

ALTER TABLE public.review_responses
DROP CONSTRAINT IF EXISTS review_responses_responder_id_fkey;

ALTER TABLE public.review_responses
ADD CONSTRAINT review_responses_responder_id_fkey
FOREIGN KEY (responder_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 4.3: review_reactions - Migrer user_id
DO $$
DECLARE
    reaction_record RECORD;
    auth_user_id UUID;
BEGIN
    FOR reaction_record IN 
        SELECT rr.id, rr.user_id as profile_id, rr.review_id
        FROM review_reactions rr
        WHERE EXISTS (
            SELECT 1 FROM profiles p WHERE p.id = rr.user_id
        )
    LOOP
        SELECT p.user_id INTO auth_user_id
        FROM profiles p
        WHERE p.id = reaction_record.profile_id
        LIMIT 1;
        
        IF auth_user_id IS NOT NULL THEN
            -- Vérifier qu'il n'y a pas déjà une réaction avec ce auth_user_id
            IF NOT EXISTS (
                SELECT 1 FROM review_reactions 
                WHERE review_id = reaction_record.review_id 
                AND user_id = auth_user_id
                AND id != reaction_record.id
            ) THEN
                UPDATE review_reactions
                SET user_id = auth_user_id
                WHERE id = reaction_record.id;
            ELSE
                -- Supprimer la duplication
                DELETE FROM review_reactions WHERE id = reaction_record.id;
            END IF;
        END IF;
    END LOOP;
END $$;

-- Corriger la FK de review_reactions.user_id
DO $$
DECLARE
    fk_name TEXT;
BEGIN
    SELECT tc.constraint_name INTO fk_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'public'
        AND tc.table_name = 'review_reactions'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'user_id'
        AND tc.constraint_name IN (
            SELECT ccu.constraint_name
            FROM information_schema.constraint_column_usage ccu
            WHERE ccu.table_schema = 'public'
                AND ccu.table_name = 'profiles'
        )
        LIMIT 1;
    
    IF fk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.review_reactions DROP CONSTRAINT IF EXISTS %I', fk_name);
    END IF;
END $$;

ALTER TABLE public.review_reactions
DROP CONSTRAINT IF EXISTS review_reactions_user_id_fkey;

ALTER TABLE public.review_reactions
ADD CONSTRAINT review_reactions_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 4.4: recruiter_subscriptions - Migrer user_id
DO $$
DECLARE
    sub_record RECORD;
    auth_user_id UUID;
BEGIN
    FOR sub_record IN 
        SELECT rs.id, rs.user_id as profile_id
        FROM recruiter_subscriptions rs
        WHERE EXISTS (
            SELECT 1 FROM profiles p WHERE p.id = rs.user_id
        )
    LOOP
        SELECT p.user_id INTO auth_user_id
        FROM profiles p
        WHERE p.id = sub_record.profile_id
        LIMIT 1;
        
        IF auth_user_id IS NOT NULL THEN
            UPDATE recruiter_subscriptions
            SET user_id = auth_user_id
            WHERE id = sub_record.id;
        END IF;
    END LOOP;
END $$;

-- Corriger la FK
DO $$
DECLARE
    fk_name TEXT;
BEGIN
    SELECT tc.constraint_name INTO fk_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'public'
        AND tc.table_name = 'recruiter_subscriptions'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'user_id'
        AND tc.constraint_name IN (
            SELECT ccu.constraint_name
            FROM information_schema.constraint_column_usage ccu
            WHERE ccu.table_schema = 'public'
                AND ccu.table_name = 'profiles'
        )
        LIMIT 1;
    
    IF fk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.recruiter_subscriptions DROP CONSTRAINT IF EXISTS %I', fk_name);
    END IF;
END $$;

ALTER TABLE public.recruiter_subscriptions
DROP CONSTRAINT IF EXISTS recruiter_subscriptions_user_id_fkey;

ALTER TABLE public.recruiter_subscriptions
ADD CONSTRAINT recruiter_subscriptions_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 4.5: recruiter_usage_tracking - Migrer user_id
DO $$
DECLARE
    usage_record RECORD;
    auth_user_id UUID;
BEGIN
    FOR usage_record IN 
        SELECT rut.id, rut.user_id as profile_id
        FROM recruiter_usage_tracking rut
        WHERE EXISTS (
            SELECT 1 FROM profiles p WHERE p.id = rut.user_id
        )
    LOOP
        SELECT p.user_id INTO auth_user_id
        FROM profiles p
        WHERE p.id = usage_record.profile_id
        LIMIT 1;
        
        IF auth_user_id IS NOT NULL THEN
            UPDATE recruiter_usage_tracking
            SET user_id = auth_user_id
            WHERE id = usage_record.id;
        END IF;
    END LOOP;
END $$;

-- Corriger la FK
DO $$
DECLARE
    fk_name TEXT;
BEGIN
    SELECT tc.constraint_name INTO fk_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'public'
        AND tc.table_name = 'recruiter_usage_tracking'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'user_id'
        AND tc.constraint_name IN (
            SELECT ccu.constraint_name
            FROM information_schema.constraint_column_usage ccu
            WHERE ccu.table_schema = 'public'
                AND ccu.table_name = 'profiles'
        )
        LIMIT 1;
    
    IF fk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.recruiter_usage_tracking DROP CONSTRAINT IF EXISTS %I', fk_name);
    END IF;
END $$;

ALTER TABLE public.recruiter_usage_tracking
DROP CONSTRAINT IF EXISTS recruiter_usage_tracking_user_id_fkey;

ALTER TABLE public.recruiter_usage_tracking
ADD CONSTRAINT recruiter_usage_tracking_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 4.6: cv_views - Migrer recruiter_id et candidate_id
DO $$
DECLARE
    cv_record RECORD;
    recruiter_auth_id UUID;
    candidate_auth_id UUID;
BEGIN
    FOR cv_record IN 
        SELECT cv.id, cv.recruiter_id as recruiter_profile_id, cv.candidate_id as candidate_profile_id
        FROM cv_views cv
        WHERE EXISTS (
            SELECT 1 FROM profiles p WHERE p.id = cv.recruiter_id OR p.id = cv.candidate_id
        )
    LOOP
        -- Migrer recruiter_id
        SELECT p.user_id INTO recruiter_auth_id
        FROM profiles p
        WHERE p.id = cv_record.recruiter_profile_id
        LIMIT 1;
        
        -- Migrer candidate_id
        SELECT p.user_id INTO candidate_auth_id
        FROM profiles p
        WHERE p.id = cv_record.candidate_profile_id
        LIMIT 1;
        
        IF recruiter_auth_id IS NOT NULL AND candidate_auth_id IS NOT NULL THEN
            UPDATE cv_views
            SET recruiter_id = recruiter_auth_id,
                candidate_id = candidate_auth_id
            WHERE id = cv_record.id;
        END IF;
    END LOOP;
END $$;

-- Corriger les FK de cv_views
DO $$
DECLARE
    fk_name TEXT;
BEGIN
    -- Supprimer FK recruiter_id
    SELECT tc.constraint_name INTO fk_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'public'
        AND tc.table_name = 'cv_views'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'recruiter_id'
        AND tc.constraint_name IN (
            SELECT ccu.constraint_name
            FROM information_schema.constraint_column_usage ccu
            WHERE ccu.table_schema = 'public'
                AND ccu.table_name = 'profiles'
        )
        LIMIT 1;
    
    IF fk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.cv_views DROP CONSTRAINT IF EXISTS %I', fk_name);
    END IF;
    
    -- Supprimer FK candidate_id
    SELECT tc.constraint_name INTO fk_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'public'
        AND tc.table_name = 'cv_views'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'candidate_id'
        AND tc.constraint_name IN (
            SELECT ccu.constraint_name
            FROM information_schema.constraint_column_usage ccu
            WHERE ccu.table_schema = 'public'
                AND ccu.table_name = 'profiles'
        )
        LIMIT 1;
    
    IF fk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.cv_views DROP CONSTRAINT IF EXISTS %I', fk_name);
    END IF;
END $$;

ALTER TABLE public.cv_views
DROP CONSTRAINT IF EXISTS cv_views_recruiter_id_fkey;

ALTER TABLE public.cv_views
ADD CONSTRAINT cv_views_recruiter_id_fkey
FOREIGN KEY (recruiter_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

ALTER TABLE public.cv_views
DROP CONSTRAINT IF EXISTS cv_views_candidate_id_fkey;

ALTER TABLE public.cv_views
ADD CONSTRAINT cv_views_candidate_id_fkey
FOREIGN KEY (candidate_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 4.7: training_institutions - Migrer user_id
DO $$
DECLARE
    inst_record RECORD;
    auth_user_id UUID;
BEGIN
    FOR inst_record IN 
        SELECT ti.id, ti.user_id as profile_id
        FROM training_institutions ti
        WHERE EXISTS (
            SELECT 1 FROM profiles p WHERE p.id = ti.user_id
        )
    LOOP
        SELECT p.user_id INTO auth_user_id
        FROM profiles p
        WHERE p.id = inst_record.profile_id
        LIMIT 1;
        
        IF auth_user_id IS NOT NULL THEN
            UPDATE training_institutions
            SET user_id = auth_user_id
            WHERE id = inst_record.id;
        END IF;
    END LOOP;
END $$;

-- Corriger la FK
DO $$
DECLARE
    fk_name TEXT;
BEGIN
    SELECT tc.constraint_name INTO fk_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'public'
        AND tc.table_name = 'training_institutions'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'user_id'
        AND tc.constraint_name IN (
            SELECT ccu.constraint_name
            FROM information_schema.constraint_column_usage ccu
            WHERE ccu.table_schema = 'public'
                AND ccu.table_name = 'profiles'
        )
        LIMIT 1;
    
    IF fk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.training_institutions DROP CONSTRAINT IF EXISTS %I', fk_name);
    END IF;
END $$;

ALTER TABLE public.training_institutions
DROP CONSTRAINT IF EXISTS training_institutions_user_id_fkey;

ALTER TABLE public.training_institutions
ADD CONSTRAINT training_institutions_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 4.8: quote_requests - Migrer assigned_to si elle existe
DO $$
DECLARE
    quote_record RECORD;
    auth_user_id UUID;
    fk_name TEXT;
BEGIN
    -- Vérifier si la colonne assigned_to existe et référence profiles
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'quote_requests' 
        AND column_name = 'assigned_to'
    ) THEN
        FOR quote_record IN 
            SELECT qr.id, qr.assigned_to as profile_id
            FROM quote_requests qr
            WHERE qr.assigned_to IS NOT NULL
            AND EXISTS (
                SELECT 1 FROM profiles p WHERE p.id = qr.assigned_to
            )
        LOOP
            SELECT p.user_id INTO auth_user_id
            FROM profiles p
            WHERE p.id = quote_record.profile_id
            LIMIT 1;
            
            IF auth_user_id IS NOT NULL THEN
                UPDATE quote_requests
                SET assigned_to = auth_user_id
                WHERE id = quote_record.id;
            END IF;
        END LOOP;
        
        -- Corriger la FK assigned_to (intégré dans le même bloc)
        SELECT tc.constraint_name INTO fk_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public'
            AND tc.table_name = 'quote_requests'
            AND tc.constraint_type = 'FOREIGN KEY'
            AND kcu.column_name = 'assigned_to'
            AND tc.constraint_name IN (
                SELECT ccu.constraint_name
                FROM information_schema.constraint_column_usage ccu
                WHERE ccu.table_schema = 'public'
                    AND ccu.table_name = 'profiles'
            )
        LIMIT 1;
        
        IF fk_name IS NOT NULL THEN
            EXECUTE format('ALTER TABLE public.quote_requests DROP CONSTRAINT IF EXISTS %I', fk_name);
        END IF;
        
        ALTER TABLE public.quote_requests
        DROP CONSTRAINT IF EXISTS quote_requests_assigned_to_fkey;
        
        ALTER TABLE public.quote_requests
        ADD CONSTRAINT quote_requests_assigned_to_fkey
        FOREIGN KEY (assigned_to)
        REFERENCES auth.users(id)
        ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================
-- ÉTAPE 5: Mettre à jour les index
-- ============================================

-- S'assurer que l'index existe sur service_reviews.user_id
CREATE INDEX IF NOT EXISTS idx_service_reviews_user_id ON public.service_reviews(user_id);

-- ============================================
-- ÉTAPE 6: Mettre à jour les fonctions qui utilisent profiles.id
-- ============================================

-- Mettre à jour get_recent_reviews pour utiliser auth.users
DROP FUNCTION IF EXISTS get_recent_reviews(INTEGER);
CREATE OR REPLACE FUNCTION get_recent_reviews(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    user_name VARCHAR(255),
    service_type VARCHAR(100),
    rating INTEGER,
    title VARCHAR(255),
    comment TEXT,
    is_anonymous BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sr.id,
        CASE 
            WHEN sr.is_anonymous THEN 'Utilisateur anonyme'
            ELSE COALESCE(p.first_name || ' ' || p.last_name, p.email, au.email)
        END as user_name,
        sr.service_type,
        sr.rating,
        sr.title,
        sr.comment,
        sr.is_anonymous,
        sr.created_at
    FROM service_reviews sr
    LEFT JOIN auth.users au ON au.id = sr.user_id
    LEFT JOIN profiles p ON p.user_id = au.id
    WHERE sr.is_approved = true
    ORDER BY sr.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mettre à jour can_user_review_service
DROP FUNCTION IF EXISTS can_user_review_service(UUID, VARCHAR);
CREATE OR REPLACE FUNCTION can_user_review_service(user_id_param UUID, service_type_param VARCHAR(100))
RETURNS BOOLEAN AS $$
DECLARE
    existing_review_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO existing_review_count
    FROM service_reviews
    WHERE user_id = user_id_param
    AND service_type = service_type_param;
    
    RETURN existing_review_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ÉTAPE 7: Mettre à jour les politiques RLS
-- ============================================

-- 7.1: service_reviews - RLS policies
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.service_reviews;
CREATE POLICY "Anyone can view approved reviews" ON public.service_reviews
    FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Users can view their own reviews" ON public.service_reviews;
CREATE POLICY "Users can view their own reviews" ON public.service_reviews
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.service_reviews;
CREATE POLICY "Authenticated users can create reviews" ON public.service_reviews
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND user_id = auth.uid()
    );

DROP POLICY IF EXISTS "Users can update their own reviews" ON public.service_reviews;
CREATE POLICY "Users can update their own reviews" ON public.service_reviews
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.service_reviews;
CREATE POLICY "Users can delete their own reviews" ON public.service_reviews
    FOR DELETE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.service_reviews;
CREATE POLICY "Admins can manage all reviews" ON public.service_reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

-- 7.2: review_responses - RLS policies
DROP POLICY IF EXISTS "Anyone can view responses to approved reviews" ON public.review_responses;
CREATE POLICY "Anyone can view responses to approved reviews" ON public.review_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM service_reviews sr 
            WHERE sr.id = review_responses.review_id 
            AND sr.is_approved = true
        )
    );

DROP POLICY IF EXISTS "Users can view responses to their reviews" ON public.review_responses;
CREATE POLICY "Users can view responses to their reviews" ON public.review_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM service_reviews sr 
            WHERE sr.id = review_responses.review_id 
            AND sr.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Authenticated users can create responses" ON public.review_responses;
CREATE POLICY "Authenticated users can create responses" ON public.review_responses
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND responder_id = auth.uid()
    );

DROP POLICY IF EXISTS "Users can update their own responses" ON public.review_responses;
CREATE POLICY "Users can update their own responses" ON public.review_responses
    FOR UPDATE USING (responder_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own responses" ON public.review_responses;
CREATE POLICY "Users can delete their own responses" ON public.review_responses
    FOR DELETE USING (responder_id = auth.uid());

-- 7.3: review_reactions - RLS policies
DROP POLICY IF EXISTS "Users can view reactions to approved reviews" ON public.review_reactions;
CREATE POLICY "Users can view reactions to approved reviews" ON public.review_reactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM service_reviews sr 
            WHERE sr.id = review_reactions.review_id 
            AND sr.is_approved = true
        )
    );

DROP POLICY IF EXISTS "Users can view their own reactions" ON public.review_reactions;
CREATE POLICY "Users can view their own reactions" ON public.review_reactions
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can create reactions" ON public.review_reactions;
CREATE POLICY "Authenticated users can create reactions" ON public.review_reactions
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND user_id = auth.uid()
    );

DROP POLICY IF EXISTS "Users can update their own reactions" ON public.review_reactions;
CREATE POLICY "Users can update their own reactions" ON public.review_reactions
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own reactions" ON public.review_reactions;
CREATE POLICY "Users can delete their own reactions" ON public.review_reactions
    FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- ÉTAPE 8: Commentaires et documentation
-- ============================================

COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to automatically create a profile when a new auth user is created';
COMMENT ON CONSTRAINT service_reviews_user_id_fkey ON public.service_reviews IS 'Foreign key to auth.users(id) - standardized user reference';

