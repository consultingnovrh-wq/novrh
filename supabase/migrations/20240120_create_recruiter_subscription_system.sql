-- Migration pour créer le système d'abonnement pour les recruteurs
-- Date: 2024-01-20

-- Créer la table des plans d'abonnement pour recruteurs
CREATE TABLE IF NOT EXISTS recruiter_subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    duration_months INTEGER NOT NULL DEFAULT 1,
    max_cv_views INTEGER DEFAULT 10,
    max_job_postings INTEGER DEFAULT 5,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer les plans d'abonnement par défaut
INSERT INTO recruiter_subscription_plans (name, description, price, duration_months, max_cv_views, max_job_postings, features) VALUES
('Plan Basique', 'Accès limité aux CV et offres d''emploi', 50000.00, 1, 10, 5, '["Voir 10 CV par mois", "Publier 5 offres d''emploi", "Support email"]'::jsonb),
('Plan Standard', 'Accès étendu avec plus de fonctionnalités', 150000.00, 1, 50, 20, '["Voir 50 CV par mois", "Publier 20 offres d''emploi", "Support prioritaire", "Statistiques avancées"]'::jsonb),
('Plan Premium', 'Accès illimité avec toutes les fonctionnalités', 300000.00, 1, -1, -1, '["Accès illimité aux CV", "Publier des offres illimitées", "Support téléphonique", "Statistiques complètes", "Recherche avancée"]'::jsonb),
('Plan Annuel Basique', 'Plan basique avec réduction annuelle', 500000.00, 12, 120, 60, '["Voir 120 CV par an", "Publier 60 offres d''emploi", "Support email", "Réduction de 17%"]'::jsonb),
('Plan Annuel Standard', 'Plan standard avec réduction annuelle', 1500000.00, 12, 600, 240, '["Voir 600 CV par an", "Publier 240 offres d''emploi", "Support prioritaire", "Statistiques avancées", "Réduction de 17%"]'::jsonb),
('Plan Annuel Premium', 'Plan premium avec réduction annuelle', 3000000.00, 12, -1, -1, '["Accès illimité aux CV", "Publier des offres illimitées", "Support téléphonique", "Statistiques complètes", "Recherche avancée", "Réduction de 17%"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Créer la table des abonnements des recruteurs
CREATE TABLE IF NOT EXISTS recruiter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES recruiter_subscription_plans(id),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    auto_renew BOOLEAN DEFAULT true,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table pour tracker l'utilisation des fonctionnalités
CREATE TABLE IF NOT EXISTS recruiter_usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES recruiter_subscriptions(id) ON DELETE CASCADE,
    feature_type VARCHAR(50) NOT NULL CHECK (feature_type IN ('cv_view', 'job_posting')),
    usage_count INTEGER DEFAULT 0,
    last_reset_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table pour tracker les vues de CV
CREATE TABLE IF NOT EXISTS cv_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recruiter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    cv_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Créer la table pour les établissements de formation
CREATE TABLE IF NOT EXISTS training_institutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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

-- Créer la table pour les offres de formation
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

-- Créer les index pour optimiser les performances
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

-- Activer RLS
ALTER TABLE recruiter_subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_offers ENABLE ROW LEVEL SECURITY;

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

-- Fonctions utilitaires
CREATE OR REPLACE FUNCTION check_recruiter_cv_access(user_id UUID)
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
        WHERE rs.user_id = check_recruiter_cv_access.user_id
        AND rs.status = 'active'
        AND rs.end_date > NOW()
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
    WHERE rs.user_id = check_recruiter_cv_access.user_id
    AND rs.status = 'active'
    AND rs.end_date > NOW()
    ORDER BY rs.created_at DESC
    LIMIT 1;
    
    -- Si max_cv_views est -1, c'est illimité
    IF max_cv_views = -1 THEN
        RETURN TRUE;
    END IF;
    
    RETURN cv_views_used < max_cv_views;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_cv_view_count(user_id UUID)
RETURNS VOID AS $$
DECLARE
    current_subscription_id UUID;
BEGIN
    -- Récupérer l'abonnement actuel
    SELECT rs.id INTO current_subscription_id
    FROM recruiter_subscriptions rs
    WHERE rs.user_id = increment_cv_view_count.user_id
    AND rs.status = 'active'
    AND rs.end_date > NOW()
    ORDER BY rs.created_at DESC
    LIMIT 1;
    
    IF current_subscription_id IS NULL THEN
        RAISE EXCEPTION 'No active subscription found';
    END IF;
    
    -- Incrémenter le compteur d'utilisation
    INSERT INTO recruiter_usage_tracking (user_id, subscription_id, feature_type, usage_count)
    VALUES (increment_cv_view_count.user_id, current_subscription_id, 'cv_view', 1)
    ON CONFLICT (user_id, subscription_id, feature_type) 
    DO UPDATE SET 
        usage_count = recruiter_usage_tracking.usage_count + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier l'accès aux offres de formation
CREATE OR REPLACE FUNCTION check_training_offer_access(institution_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_subscription BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM training_institutions ti
        WHERE ti.id = check_training_offer_access.institution_id
        AND ti.subscription_status IN ('standard', 'premium')
        AND ti.subscription_end_date > NOW()
    ) INTO has_subscription;
    
    RETURN has_subscription;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Commentaires
COMMENT ON TABLE recruiter_subscription_plans IS 'Plans d''abonnement pour les recruteurs';
COMMENT ON TABLE recruiter_subscriptions IS 'Abonnements actifs des recruteurs';
COMMENT ON TABLE recruiter_usage_tracking IS 'Suivi de l''utilisation des fonctionnalités par les recruteurs';
COMMENT ON TABLE cv_views IS 'Historique des consultations de CV par les recruteurs';
COMMENT ON TABLE training_institutions IS 'Établissements de formation';
COMMENT ON TABLE training_offers IS 'Offres de formation publiées par les établissements';
