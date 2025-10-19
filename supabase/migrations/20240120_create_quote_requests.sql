-- Migration pour créer la table des demandes de devis
-- Date: 2024-01-20

-- Créer la table quote_requests
CREATE TABLE IF NOT EXISTS quote_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Créer un index sur l'email pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);

-- Créer un index sur le statut pour filtrer les demandes
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);

-- Créer un index sur la date de création pour trier par date
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);

-- Créer un index sur le type de service
CREATE INDEX IF NOT EXISTS idx_quote_requests_service_type ON quote_requests(service_type);

-- Activer RLS (Row Level Security)
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux admins de voir toutes les demandes
CREATE POLICY "Admins can view all quote requests" ON quote_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

-- Politique pour permettre aux admins de modifier toutes les demandes
CREATE POLICY "Admins can update all quote requests" ON quote_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

-- Politique pour permettre à tous les utilisateurs authentifiés de créer des demandes
CREATE POLICY "Authenticated users can create quote requests" ON quote_requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politique pour permettre aux utilisateurs de voir leurs propres demandes
CREATE POLICY "Users can view their own quote requests" ON quote_requests
    FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_quote_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER trigger_update_quote_requests_updated_at
    BEFORE UPDATE ON quote_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_quote_requests_updated_at();

-- Fonction pour envoyer une notification email lors de nouvelles demandes
CREATE OR REPLACE FUNCTION notify_new_quote_request()
RETURNS TRIGGER AS $$
BEGIN
    -- Ici on pourrait ajouter une logique pour envoyer une notification
    -- Par exemple, insérer dans une table de notifications
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

-- Créer la table des notifications admin si elle n'existe pas
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

-- Activer RLS pour admin_notifications
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Politique pour les notifications admin
CREATE POLICY "Admins can manage admin notifications" ON admin_notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM administrators 
            WHERE administrators.user_id = auth.uid() 
            AND administrators.is_active = true
        )
    );

-- Trigger pour notifier les nouvelles demandes de devis
CREATE TRIGGER trigger_notify_new_quote_request
    AFTER INSERT ON quote_requests
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_quote_request();

-- Commentaires sur la table
COMMENT ON TABLE quote_requests IS 'Table pour stocker les demandes de devis des clients';
COMMENT ON COLUMN quote_requests.company_name IS 'Nom de l''entreprise qui fait la demande';
COMMENT ON COLUMN quote_requests.contact_name IS 'Nom de la personne de contact';
COMMENT ON COLUMN quote_requests.email IS 'Email de contact';
COMMENT ON COLUMN quote_requests.phone IS 'Numéro de téléphone (optionnel)';
COMMENT ON COLUMN quote_requests.service_type IS 'Type de service demandé';
COMMENT ON COLUMN quote_requests.budget_range IS 'Fourchette de budget estimée';
COMMENT ON COLUMN quote_requests.timeline IS 'Délai souhaité pour le projet';
COMMENT ON COLUMN quote_requests.description IS 'Description détaillée du projet';
COMMENT ON COLUMN quote_requests.additional_info IS 'Informations supplémentaires';
COMMENT ON COLUMN quote_requests.status IS 'Statut de la demande (pending, in_progress, completed, cancelled)';
COMMENT ON COLUMN quote_requests.admin_notes IS 'Notes internes de l''administrateur';
COMMENT ON COLUMN quote_requests.assigned_to IS 'ID de l''administrateur assigné à cette demande';
COMMENT ON COLUMN quote_requests.responded_at IS 'Date de première réponse à la demande';
