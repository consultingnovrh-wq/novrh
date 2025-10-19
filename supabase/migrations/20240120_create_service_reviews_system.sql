-- Migration pour créer le système de commentaires et avis
-- Date: 2024-01-20

-- Créer la table des commentaires/avis
CREATE TABLE IF NOT EXISTS service_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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

-- Créer la table des réponses aux commentaires
CREATE TABLE IF NOT EXISTS review_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID NOT NULL REFERENCES service_reviews(id) ON DELETE CASCADE,
    responder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    is_admin_response BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table des réactions aux commentaires
CREATE TABLE IF NOT EXISTS review_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID NOT NULL REFERENCES service_reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('like', 'dislike', 'helpful', 'not_helpful')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_id, reaction_type)
);

-- Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_service_reviews_service_type ON service_reviews(service_type);
CREATE INDEX IF NOT EXISTS idx_service_reviews_rating ON service_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_service_reviews_is_approved ON service_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_service_reviews_created_at ON service_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_reviews_user_id ON service_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON review_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_responder_id ON review_responses(responder_id);
CREATE INDEX IF NOT EXISTS idx_review_reactions_review_id ON review_reactions(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reactions_user_id ON review_reactions(user_id);

-- Activer RLS
ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reactions ENABLE ROW LEVEL SECURITY;

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

-- Fonctions utilitaires
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
    LEFT JOIN profiles p ON sr.user_id = p.id
    WHERE sr.is_approved = true
    ORDER BY sr.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si un utilisateur peut laisser un avis
CREATE OR REPLACE FUNCTION can_user_review_service(user_id_param UUID, service_type_param VARCHAR(100))
RETURNS BOOLEAN AS $$
DECLARE
    existing_review_count INTEGER;
BEGIN
    -- Vérifier si l'utilisateur a déjà laissé un avis pour ce type de service
    SELECT COUNT(*) INTO existing_review_count
    FROM service_reviews
    WHERE user_id = user_id_param
    AND service_type = service_type_param;
    
    -- Pour l'instant, on permet un avis par type de service par utilisateur
    -- On pourrait modifier cette logique selon les besoins
    RETURN existing_review_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_service_reviews_updated_at
    BEFORE UPDATE ON service_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_responses_updated_at
    BEFORE UPDATE ON review_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour notifier les admins lors de nouveaux avis
CREATE OR REPLACE FUNCTION notify_admin_new_review()
RETURNS TRIGGER AS $$
BEGIN
    -- Insérer une notification pour les admins
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

-- Trigger pour notifier les nouveaux avis
CREATE TRIGGER trigger_notify_admin_new_review
    AFTER INSERT ON service_reviews
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_new_review();

-- Insérer quelques avis d'exemple (optionnel)
INSERT INTO service_reviews (user_id, service_type, rating, title, comment, is_approved) VALUES
-- Ces avis seront ajoutés avec des IDs d'utilisateurs existants si nécessaire
-- Pour l'instant, on les laisse en commentaire pour éviter les erreurs de contrainte
/*
('user-uuid-1', 'recruitment', 5, 'Excellent service de recrutement', 'NovRH nous a aidés à trouver les meilleurs candidats pour notre équipe. Service professionnel et efficace.', true),
('user-uuid-2', 'training', 4, 'Formation de qualité', 'Les formations proposées sont très pertinentes et bien structurées. Je recommande vivement.', true),
('user-uuid-3', 'consulting', 5, 'Conseil RH exceptionnel', 'L''équipe de NovRH nous a accompagnés dans la restructuration de notre département RH. Résultats excellents.', true),
('user-uuid-4', 'audit', 4, 'Audit RH complet', 'Audit très professionnel qui nous a permis d''identifier les axes d''amélioration.', true),
('user-uuid-5', 'general', 5, 'Service global excellent', 'NovRH est un partenaire de confiance pour tous nos besoins RH. Je recommande sans hésitation.', true)
*/
ON CONFLICT DO NOTHING;

-- Commentaires
COMMENT ON TABLE service_reviews IS 'Avis et commentaires des clients sur les services';
COMMENT ON TABLE review_responses IS 'Réponses aux avis (par l''équipe ou d''autres utilisateurs)';
COMMENT ON TABLE review_reactions IS 'Réactions (like/dislike) aux avis';
COMMENT ON COLUMN service_reviews.service_type IS 'Type de service évalué (recruitment, training, consulting, audit, general)';
COMMENT ON COLUMN service_reviews.rating IS 'Note de 1 à 5 étoiles';
COMMENT ON COLUMN service_reviews.is_anonymous IS 'Si l''avis est publié de manière anonyme';
COMMENT ON COLUMN service_reviews.is_verified IS 'Si l''avis provient d''un client vérifié';
COMMENT ON COLUMN service_reviews.is_approved IS 'Si l''avis est approuvé par l''admin et visible publiquement';
COMMENT ON COLUMN review_responses.is_admin_response IS 'Si la réponse provient d''un administrateur';
COMMENT ON COLUMN review_reactions.reaction_type IS 'Type de réaction (like, dislike, helpful, not_helpful)';
