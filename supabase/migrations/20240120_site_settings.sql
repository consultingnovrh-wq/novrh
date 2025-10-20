-- Migration pour créer et initialiser les paramètres du site
-- Date: 2024-01-20

-- Créer la table site_settings si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Créer un index sur setting_key pour les performances
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(setting_key);

-- Activer RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Les administrateurs peuvent voir tous les paramètres" ON public.site_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.administrators 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Les administrateurs peuvent modifier les paramètres" ON public.site_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.administrators 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_site_settings_updated_at();

-- Insérer les paramètres par défaut
INSERT INTO public.site_settings (setting_key, setting_value, description) VALUES
    ('site_name', 'NOVRH', 'Nom du site web'),
    ('site_description', 'Plateforme de recrutement et d''emploi au Mali', 'Description du site'),
    ('site_url', 'https://novrh.ml', 'URL principale du site'),
    ('contact_email', 'contact@novrh.ml', 'Email de contact principal'),
    ('support_phone', '+223 20 12 34 56', 'Numéro de téléphone du support'),
    ('timezone', 'Africa/Bamako', 'Fuseau horaire du site'),
    ('language', 'fr', 'Langue par défaut du site'),
    ('maintenance_mode', 'false', 'Mode maintenance activé ou non'),
    ('google_analytics', '', 'Code Google Analytics'),
    ('facebook_pixel', '', 'Code Facebook Pixel'),
    ('stripe_enabled', 'true', 'Paiement Stripe activé'),
    ('paypal_enabled', 'false', 'Paiement PayPal activé'),
    ('smtp_enabled', 'true', 'SMTP activé'),
    ('smtp_host', 'smtp.gmail.com', 'Serveur SMTP'),
    ('smtp_port', '587', 'Port SMTP'),
    ('smtp_user', '', 'Utilisateur SMTP'),
    ('smtp_password', '', 'Mot de passe SMTP'),
    ('password_min_length', '8', 'Longueur minimale des mots de passe'),
    ('require_special_chars', 'true', 'Exiger des caractères spéciaux'),
    ('require_numbers', 'true', 'Exiger des chiffres'),
    ('require_uppercase', 'true', 'Exiger des majuscules'),
    ('session_timeout', '30', 'Timeout de session en minutes'),
    ('max_login_attempts', '5', 'Nombre maximum de tentatives de connexion'),
    ('enable_two_factor', 'false', 'Authentification à deux facteurs'),
    ('enable_captcha', 'true', 'Captcha activé'),
    ('email_notifications', 'true', 'Notifications par email'),
    ('sms_notifications', 'false', 'Notifications par SMS'),
    ('push_notifications', 'true', 'Notifications push'),
    ('admin_alerts', 'true', 'Alertes administrateur'),
    ('user_registration_alert', 'true', 'Alerte inscription utilisateur'),
    ('job_posting_alert', 'true', 'Alerte publication d''emploi'),
    ('payment_alert', 'true', 'Alerte paiement')
ON CONFLICT (setting_key) DO NOTHING;

-- Accorder les permissions nécessaires
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Afficher les paramètres créés
SELECT 
    setting_key,
    setting_value,
    description
FROM public.site_settings
ORDER BY setting_key;
