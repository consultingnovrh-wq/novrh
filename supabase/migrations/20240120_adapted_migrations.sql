-- Migration adaptée pour votre structure existante
-- Date: 2024-01-20
-- Compatible avec votre schéma Supabase

-- 1. Créer la table des demandes de devis (nouvelle fonctionnalité)
CREATE TABLE IF NOT EXISTS quote_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    service_type VARCHAR(100) NOT NULL,
    budget_range VARCHAR(100),
    timeline VARCHAR(100),
    description TEXT NOT NULL,
    additional_info TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    admin_notes TEXT,
    assigned_to UUID REFERENCES profiles(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE
);

-- 2. Créer la table des notifications admin (nouvelle fonctionnalité)
CREATE TABLE IF NOT EXISTS admin_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- 3. Créer la table des plans d'abonnement pour recruteurs (nouvelle fonctionnalité)
-- Utilise votre structure existante comme référence
CREATE TABLE IF NOT EXISTS recruiter_subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    duration_days INTEGER NOT NULL DEFAULT 30, -- Adapté à votre structure
    max_cv_views INTEGER DEFAULT 10,
    max_job_postings INTEGER DEFAULT 5,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer la table des abonnements recruteurs (nouvelle fonctionnalité)
-- Compatible avec votre structure user_subscriptions
CREATE TABLE IF NOT EXISTS recruiter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES recruiter_subscription_plans(id),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'cancelled')),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT true,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Créer la table de suivi d'utilisation (nouvelle fonctionnalité)
CREATE TABLE IF NOT EXISTS recruiter_usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES recruiter_subscriptions(id) ON DELETE CASCADE,
    feature_type VARCHAR(50) NOT NULL CHECK (feature_type IN ('cv_view', 'job_posting')),
    usage_count INTEGER DEFAULT 0,
    last_reset_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Créer la table des vues de CV (nouvelle fonctionnalité)
CREATE TABLE IF NOT EXISTS cv_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recruiter_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    cv_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- 7. Créer la table des établissements de formation (nouvelle fonctionnalité)
CREATE TABLE IF NOT EXISTS training_institutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    accreditation_number VARCHAR(100),
    is_verified BOOLEAN DEFAULT false,
    subscription_status VARCHAR(50) DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'standard', 'premium')),
    subscription_start_date TIMESTAMP WITH TIME ZONE,
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Créer la table des offres de formation (nouvelle fonctionnalité)
CREATE TABLE IF NOT EXISTS training_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institution_id UUID NOT NULL REFERENCES training_institutions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    duration_hours INTEGER,
    duration_weeks INTEGER,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'XOF',
    start_date DATE,
    end_date DATE,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    requirements TEXT,
    objectives TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Créer la table des avis clients (nouvelle fonctionnalité)
CREATE TABLE IF NOT EXISTS service_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL CHECK (service_type IN ('recruitment', 'training', 'consulting', 'audit', 'general')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Créer la table des réponses aux avis (nouvelle fonctionnalité)
CREATE TABLE IF NOT EXISTS review_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID NOT NULL REFERENCES service_reviews(id) ON DELETE CASCADE,
    responder_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    is_admin_response BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Créer la table des réactions aux avis (nouvelle fonctionnalité)
CREATE TABLE IF NOT EXISTS review_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID NOT NULL REFERENCES service_reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('like', 'dislike', 'helpful', 'not_helpful')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_id, reaction_type)
);

-- Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_quote_requests_user_id ON quote_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_is_read ON admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_recruiter_subscriptions_user_id ON recruiter_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_subscriptions_status ON recruiter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_recruiter_subscriptions_end_date ON recruiter_subscriptions(end_date);

CREATE INDEX IF NOT EXISTS idx_recruiter_usage_tracking_user_id ON recruiter_usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_usage_tracking_feature_type ON recruiter_usage_tracking(feature_type);

CREATE INDEX IF NOT EXISTS idx_cv_views_recruiter_id ON cv_views(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_cv_views_candidate_id ON cv_views(candidate_id);
CREATE INDEX IF NOT EXISTS idx_cv_views_viewed_at ON cv_views(viewed_at);

CREATE INDEX IF NOT EXISTS idx_training_institutions_user_id ON training_institutions(user_id);
CREATE INDEX IF NOT EXISTS idx_training_institutions_subscription_status ON training_institutions(subscription_status);

CREATE INDEX IF NOT EXISTS idx_training_offers_institution_id ON training_offers(institution_id);
CREATE INDEX IF NOT EXISTS idx_training_offers_status ON training_offers(status);

CREATE INDEX IF NOT EXISTS idx_service_reviews_service_type ON service_reviews(service_type);
CREATE INDEX IF NOT EXISTS idx_service_reviews_rating ON service_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_service_reviews_is_approved ON service_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_service_reviews_created_at ON service_reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON review_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_responder_id ON review_responses(responder_id);

CREATE INDEX IF NOT EXISTS idx_review_reactions_review_id ON review_reactions(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reactions_user_id ON review_reactions(user_id);

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reactions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour quote_requests
CREATE POLICY "Admins can view all quote requests" ON quote_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

CREATE POLICY "Admins can update all quote requests" ON quote_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

CREATE POLICY "Authenticated users can create quote requests" ON quote_requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own quote requests" ON quote_requests
    FOR SELECT USING (user_id = auth.uid());

-- Politiques RLS pour admin_notifications
CREATE POLICY "Admins can manage admin notifications" ON admin_notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

-- Politiques RLS pour recruiter_subscription_plans
CREATE POLICY "Anyone can view active subscription plans" ON recruiter_subscription_plans
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subscription plans" ON recruiter_subscription_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

-- Politiques RLS pour recruiter_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON recruiter_subscriptions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own subscriptions" ON recruiter_subscriptions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own subscriptions" ON recruiter_subscriptions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all subscriptions" ON recruiter_subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

-- Politiques RLS pour recruiter_usage_tracking
CREATE POLICY "Users can view their own usage" ON recruiter_usage_tracking
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can update usage tracking" ON recruiter_usage_tracking
    FOR ALL USING (true);

-- Politiques RLS pour cv_views
CREATE POLICY "Recruiters can view their own CV views" ON cv_views
    FOR SELECT USING (recruiter_id = auth.uid());

CREATE POLICY "Recruiters can create CV views" ON cv_views
    FOR INSERT WITH CHECK (recruiter_id = auth.uid());

CREATE POLICY "Candidates can view who viewed their CV" ON cv_views
    FOR SELECT USING (candidate_id = auth.uid());

-- Politiques RLS pour training_institutions
CREATE POLICY "Users can manage their own institution" ON training_institutions
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Anyone can view verified institutions" ON training_institutions
    FOR SELECT USING (is_verified = true);

CREATE POLICY "Admins can manage all institutions" ON training_institutions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

-- Politiques RLS pour training_offers
CREATE POLICY "Institution owners can manage their offers" ON training_offers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM training_institutions 
            WHERE training_institutions.id = training_offers.institution_id 
            AND training_institutions.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view published training offers" ON training_offers
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all training offers" ON training_offers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

-- Politiques RLS pour service_reviews
CREATE POLICY "Anyone can view approved reviews" ON service_reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can view their own reviews" ON service_reviews
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can create reviews" ON service_reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Users can update their own reviews" ON service_reviews
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews" ON service_reviews
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all reviews" ON service_reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

-- Politiques RLS pour review_responses
CREATE POLICY "Anyone can view responses to approved reviews" ON review_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM service_reviews sr 
            WHERE sr.id = review_responses.review_id 
            AND sr.is_approved = true
        )
    );

CREATE POLICY "Users can view responses to their reviews" ON review_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM service_reviews sr 
            WHERE sr.id = review_responses.review_id 
            AND sr.user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create responses" ON review_responses
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND responder_id = auth.uid());

CREATE POLICY "Users can update their own responses" ON review_responses
    FOR UPDATE USING (responder_id = auth.uid());

CREATE POLICY "Users can delete their own responses" ON review_responses
    FOR DELETE USING (responder_id = auth.uid());

CREATE POLICY "Admins can manage all responses" ON review_responses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

-- Politiques RLS pour review_reactions
CREATE POLICY "Users can view reactions to approved reviews" ON review_reactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM service_reviews sr 
            WHERE sr.id = review_reactions.review_id 
            AND sr.is_approved = true
        )
    );

CREATE POLICY "Users can view their own reactions" ON review_reactions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can create reactions" ON review_reactions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Users can update their own reactions" ON review_reactions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reactions" ON review_reactions
    FOR DELETE USING (user_id = auth.uid());

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_quote_requests_updated_at
    BEFORE UPDATE ON quote_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruiter_subscription_plans_updated_at
    BEFORE UPDATE ON recruiter_subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruiter_subscriptions_updated_at
    BEFORE UPDATE ON recruiter_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruiter_usage_tracking_updated_at
    BEFORE UPDATE ON recruiter_usage_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_institutions_updated_at
    BEFORE UPDATE ON training_institutions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_offers_updated_at
    BEFORE UPDATE ON training_offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_reviews_updated_at
    BEFORE UPDATE ON service_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_responses_updated_at
    BEFORE UPDATE ON review_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour vérifier l'accès aux CV des recruteurs
CREATE OR REPLACE FUNCTION check_recruiter_cv_access(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_active_subscription BOOLEAN;
    cv_views_used INTEGER;
    max_cv_views INTEGER;
BEGIN
    -- Vérifier si l'utilisateur a un abonnement actif
    SELECT EXISTS(
        SELECT 1 FROM recruiter_subscriptions rs
        JOIN recruiter_subscription_plans rsp ON rs.plan_id = rsp.id
        WHERE rs.user_id = user_id_param
        AND rs.status = 'active'
        AND rs.end_date > CURRENT_DATE
    ) INTO has_active_subscription;
    
    IF NOT has_active_subscription THEN
        RETURN FALSE;
    END IF;
    
    -- Vérifier les limites d'utilisation
    SELECT 
        COALESCE(rut.usage_count, 0),
        rsp.max_cv_views
    INTO cv_views_used, max_cv_views
    FROM recruiter_subscriptions rs
    JOIN recruiter_subscription_plans rsp ON rs.plan_id = rsp.id
    LEFT JOIN recruiter_usage_tracking rut ON rut.user_id = rs.user_id 
        AND rut.subscription_id = rs.id 
        AND rut.feature_type = 'cv_view'
    WHERE rs.user_id = user_id_param
    AND rs.status = 'active'
    AND rs.end_date > CURRENT_DATE
    ORDER BY rs.created_at DESC
    LIMIT 1;
    
    -- Si max_cv_views est -1, c'est illimité
    IF max_cv_views = -1 THEN
        RETURN TRUE;
    END IF;
    
    RETURN cv_views_used < max_cv_views;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour incrémenter le compteur de vues de CV
CREATE OR REPLACE FUNCTION increment_cv_view_count(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
    current_subscription_id UUID;
BEGIN
    -- Récupérer l'abonnement actuel
    SELECT rs.id INTO current_subscription_id
    FROM recruiter_subscriptions rs
    WHERE rs.user_id = user_id_param
    AND rs.status = 'active'
    AND rs.end_date > CURRENT_DATE
    ORDER BY rs.created_at DESC
    LIMIT 1;
    
    IF current_subscription_id IS NULL THEN
        RAISE EXCEPTION 'No active subscription found';
    END IF;
    
    -- Incrémenter le compteur d'utilisation
    INSERT INTO recruiter_usage_tracking (user_id, subscription_id, feature_type, usage_count)
    VALUES (user_id_param, current_subscription_id, 'cv_view', 1)
    ON CONFLICT (user_id, subscription_id, feature_type) 
    DO UPDATE SET 
        usage_count = recruiter_usage_tracking.usage_count + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier l'accès aux offres de formation
CREATE OR REPLACE FUNCTION check_training_offer_access(institution_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_subscription BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM training_institutions ti
        WHERE ti.id = institution_id_param
        AND ti.subscription_status IN ('standard', 'premium')
        AND ti.subscription_end_date > NOW()
    ) INTO has_subscription;
    
    RETURN has_subscription;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques de notation
CREATE OR REPLACE FUNCTION get_service_rating_stats(service_type_param VARCHAR(100))
RETURNS TABLE (
    total_reviews BIGINT,
    average_rating NUMERIC,
    rating_1_count BIGINT,
    rating_2_count BIGINT,
    rating_3_count BIGINT,
    rating_4_count BIGINT,
    rating_5_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_reviews,
        ROUND(AVG(rating), 2) as average_rating,
        COUNT(*) FILTER (WHERE rating = 1) as rating_1_count,
        COUNT(*) FILTER (WHERE rating = 2) as rating_2_count,
        COUNT(*) FILTER (WHERE rating = 3) as rating_3_count,
        COUNT(*) FILTER (WHERE rating = 4) as rating_4_count,
        COUNT(*) FILTER (WHERE rating = 5) as rating_5_count
    FROM service_reviews
    WHERE service_type = service_type_param
    AND is_approved = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les avis récents
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
            ELSE COALESCE(p.first_name || ' ' || p.last_name, p.email)
        END as user_name,
        sr.service_type,
        sr.rating,
        sr.title,
        sr.comment,
        sr.is_anonymous,
        sr.created_at
    FROM service_reviews sr
    LEFT JOIN profiles p ON sr.user_id = p.user_id
    WHERE sr.is_approved = true
    ORDER BY sr.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour notifier les admins lors de nouvelles demandes de devis
CREATE OR REPLACE FUNCTION notify_admin_new_quote_request()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_notifications (
        type,
        title,
        message,
        data,
        created_at
    ) VALUES (
        'quote_request',
        'Nouvelle demande de devis',
        'Une nouvelle demande de devis a été soumise par ' || NEW.contact_name || ' (' || NEW.company_name || ')',
        json_build_object(
            'quote_request_id', NEW.id,
            'company_name', NEW.company_name,
            'contact_name', NEW.contact_name,
            'email', NEW.email,
            'service_type', NEW.service_type
        ),
        NOW()
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour notifier les admins lors de nouveaux avis
CREATE OR REPLACE FUNCTION notify_admin_new_review()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_notifications (
        type,
        title,
        message,
        data,
        created_at
    ) VALUES (
        'new_review',
        'Nouvel avis client',
        'Un nouvel avis a été soumis par ' || 
        CASE 
            WHEN NEW.is_anonymous THEN 'un utilisateur anonyme'
            ELSE 'un utilisateur'
        END || ' pour le service ' || NEW.service_type,
        json_build_object(
            'review_id', NEW.id,
            'service_type', NEW.service_type,
            'rating', NEW.rating,
            'title', NEW.title,
            'is_anonymous', NEW.is_anonymous
        ),
        NOW()
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour les notifications
CREATE TRIGGER trigger_notify_admin_new_quote_request
    AFTER INSERT ON quote_requests
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_new_quote_request();

CREATE TRIGGER trigger_notify_admin_new_review
    AFTER INSERT ON service_reviews
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_new_review();

-- Insérer les plans d'abonnement recruteurs par défaut
INSERT INTO recruiter_subscription_plans (name, description, price, currency, duration_days, max_cv_views, max_job_postings, features) VALUES
('Plan Basique', 'Accès limité aux CV et offres d''emploi', 50000.00, 'XOF', 30, 10, 5, '["Voir 10 CV par mois", "Publier 5 offres d''emploi", "Support email"]'::jsonb),
('Plan Standard', 'Accès étendu avec plus de fonctionnalités', 150000.00, 'XOF', 30, 50, 20, '["Voir 50 CV par mois", "Publier 20 offres d''emploi", "Support prioritaire", "Statistiques avancées"]'::jsonb),
('Plan Premium', 'Accès illimité avec toutes les fonctionnalités', 300000.00, 'XOF', 30, -1, -1, '["Accès illimité aux CV", "Publier des offres illimitées", "Support téléphonique", "Statistiques complètes", "Recherche avancée"]'::jsonb),
('Plan Annuel Basique', 'Plan basique avec réduction annuelle', 500000.00, 'XOF', 365, 120, 60, '["Voir 120 CV par an", "Publier 60 offres d''emploi", "Support email", "Réduction de 17%"]'::jsonb),
('Plan Annuel Standard', 'Plan standard avec réduction annuelle', 1500000.00, 'XOF', 365, 600, 240, '["Voir 600 CV par an", "Publier 240 offres d''emploi", "Support prioritaire", "Statistiques avancées", "Réduction de 17%"]'::jsonb),
('Plan Annuel Premium', 'Plan premium avec réduction annuelle', 3000000.00, 'XOF', 365, -1, -1, '["Accès illimité aux CV", "Publier des offres illimitées", "Support téléphonique", "Statistiques complètes", "Recherche avancée", "Réduction de 17%"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Commentaires sur les nouvelles tables
COMMENT ON TABLE quote_requests IS 'Demandes de devis des clients';
COMMENT ON TABLE admin_notifications IS 'Notifications pour les administrateurs';
COMMENT ON TABLE recruiter_subscription_plans IS 'Plans d''abonnement pour les recruteurs';
COMMENT ON TABLE recruiter_subscriptions IS 'Abonnements actifs des recruteurs';
COMMENT ON TABLE recruiter_usage_tracking IS 'Suivi de l''utilisation des fonctionnalités par les recruteurs';
COMMENT ON TABLE cv_views IS 'Historique des consultations de CV par les recruteurs';
COMMENT ON TABLE training_institutions IS 'Établissements de formation';
COMMENT ON TABLE training_offers IS 'Offres de formation publiées par les établissements';
COMMENT ON TABLE service_reviews IS 'Avis et commentaires des clients sur les services';
COMMENT ON TABLE review_responses IS 'Réponses aux avis (par l''équipe ou d''autres utilisateurs)';
COMMENT ON TABLE review_reactions IS 'Réactions (like/dislike) aux avis';
