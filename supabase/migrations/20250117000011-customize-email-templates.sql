-- Migration pour personnaliser les templates d'email
-- Date: 17 janvier 2025

-- 1. Créer une table pour stocker les templates d'email personnalisés
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Activer RLS sur la table email_templates
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- 3. Créer des politiques RLS pour email_templates
CREATE POLICY "Anyone can view active email templates" ON public.email_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage email templates" ON public.email_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
    )
  );

-- 4. Insérer le template d'email de confirmation personnalisé
INSERT INTO public.email_templates (template_name, subject, html_content, text_content) VALUES
(
    'confirm_signup',
    'Finalisez votre inscription - NovRH Consulting',
    '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation d''inscription</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Bienvenue sur NovRH Consulting</h1>
                <p>Votre plateforme RH Panafricaine</p>
            </div>
            <div class="content">
                <h2>Il vous reste une étape à réaliser afin de finaliser l''activation de votre compte.</h2>
                <p>Grâce à lui vous pourrez découvrir tous nos services en ligne.</p>
                
                <p>Cliquez sur le bouton ci-dessous pour confirmer votre inscription :</p>
                
                <div style="text-align: center;">
                    <a href="{{ .ConfirmationURL }}" class="button">Confirmer mon inscription</a>
                </div>
                
                <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">{{ .ConfirmationURL }}</p>
                
                <p><strong>Nos services :</strong></p>
                <ul>
                    <li>Recrutement et placement de talents</li>
                    <li>Formation professionnelle</li>
                    <li>Conseil en ressources humaines</li>
                    <li>Gestion de carrière</li>
                </ul>
                
                <p>Merci de nous faire confiance !</p>
                <p>L''équipe NovRH Consulting</p>
            </div>
            <div class="footer">
                <p>© 2025 NovRH Consulting. Tous droits réservés.</p>
                <p>Si vous n''avez pas demandé cette inscription, vous pouvez ignorer cet email.</p>
            </div>
        </div>
    </body>
    </html>
    ',
    '
    Bienvenue sur NovRH Consulting
    
    Il vous reste une étape à réaliser afin de finaliser l''activation de votre compte.
    Grâce à lui vous pourrez découvrir tous nos services en ligne.
    
    Confirmez votre inscription en cliquant sur ce lien :
    {{ .ConfirmationURL }}
    
    Nos services :
    - Recrutement et placement de talents
    - Formation professionnelle
    - Conseil en ressources humaines
    - Gestion de carrière
    
    Merci de nous faire confiance !
    L''équipe NovRH Consulting
    
    © 2025 NovRH Consulting. Tous droits réservés.
    '
)
ON CONFLICT (template_name) DO UPDATE SET
    subject = EXCLUDED.subject,
    html_content = EXCLUDED.html_content,
    text_content = EXCLUDED.text_content,
    updated_at = now();

-- 5. Créer une fonction pour récupérer un template d'email
CREATE OR REPLACE FUNCTION public.get_email_template(template_name_param VARCHAR(100))
RETURNS TABLE (
    id UUID,
    template_name VARCHAR(100),
    subject VARCHAR(255),
    html_content TEXT,
    text_content TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        et.id,
        et.template_name,
        et.subject,
        et.html_content,
        et.text_content
    FROM public.email_templates et
    WHERE et.template_name = template_name_param
    AND et.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Créer la fonction update_updated_at_column si elle n'existe pas
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON public.email_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Accorder les permissions nécessaires
GRANT SELECT ON public.email_templates TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_email_template TO anon, authenticated;

-- 9. Afficher le résultat
SELECT 
    'Email Templates' as table_name,
    COUNT(*) as total_templates,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_templates
FROM public.email_templates;
