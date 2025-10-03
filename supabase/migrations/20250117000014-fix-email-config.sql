-- Migration pour corriger la configuration email
-- Date: 17 janvier 2025

-- 1. Vérifier la configuration SMTP dans Supabase
-- Cette migration ne peut pas modifier la configuration SMTP directement
-- Mais elle peut vérifier les paramètres et suggérer des corrections

-- 2. Créer une table pour stocker les paramètres email
CREATE TABLE IF NOT EXISTS public.email_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Activer RLS sur la table email_settings
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;

-- 4. Créer des politiques RLS pour email_settings
CREATE POLICY "Anyone can view active email settings" ON public.email_settings
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage email settings" ON public.email_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
    )
  );

-- 5. Insérer les paramètres email par défaut
INSERT INTO public.email_settings (setting_key, setting_value, description) VALUES
('smtp_enabled', 'false', 'Activer/désactiver SMTP'),
('smtp_host', 'smtp.gmail.com', 'Serveur SMTP'),
('smtp_port', '587', 'Port SMTP'),
('smtp_user', '', 'Utilisateur SMTP'),
('smtp_pass', '', 'Mot de passe SMTP'),
('from_email', 'noreply@novrhconsulting.com', 'Email expéditeur'),
('from_name', 'NovRH Consulting', 'Nom expéditeur'),
('email_verification_enabled', 'true', 'Activer la vérification email'),
('welcome_email_enabled', 'true', 'Activer les emails de bienvenue')
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    updated_at = now();

-- 6. Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER update_email_settings_updated_at
    BEFORE UPDATE ON public.email_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Créer une fonction pour récupérer les paramètres email
CREATE OR REPLACE FUNCTION public.get_email_setting(setting_key_param VARCHAR(100))
RETURNS TEXT AS $$
DECLARE
    setting_value TEXT;
BEGIN
    SELECT setting_value INTO setting_value
    FROM public.email_settings
    WHERE setting_key = setting_key_param
    AND is_active = true;
    
    RETURN setting_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Accorder les permissions nécessaires
GRANT SELECT ON public.email_settings TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_email_setting TO anon, authenticated;

-- 9. Afficher les paramètres email
SELECT 
    setting_key,
    setting_value,
    description
FROM public.email_settings
WHERE is_active = true
ORDER BY setting_key;
