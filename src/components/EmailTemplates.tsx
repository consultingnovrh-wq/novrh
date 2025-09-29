import React from 'react';

// Template d'email pour l'inscription
export const WelcomeEmailTemplate = ({ 
  firstName, 
  lastName, 
  userType, 
  loginUrl 
}: {
  firstName: string;
  lastName: string;
  userType: string;
  loginUrl: string;
}) => {
  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'company': return 'Entreprise';
      case 'candidate': return 'Candidat';
      case 'student': return 'Étudiant';
      case 'admin': return 'Administrateur';
      default: return 'Utilisateur';
    }
  };

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur NovRH Consulting</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #00167a;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #00167a;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
        }
        .content {
            margin-bottom: 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #00167a;
        }
        .message {
            margin-bottom: 25px;
            font-size: 16px;
        }
        .cta-button {
            display: inline-block;
            background-color: #00167a;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .cta-button:hover {
            background-color: #0020a0;
        }
        .features {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .feature-item {
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
        }
        .feature-item:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .contact-info {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">NOVRH CONSULTING</div>
            <div class="subtitle">Ressources Humaines Panafricaines</div>
        </div>
        
        <div class="content">
            <div class="greeting">
                Bonjour ${firstName} ${lastName},
            </div>
            
            <div class="message">
                <p>Bienvenue sur <strong>NovRH Consulting</strong> ! Nous sommes ravis de vous accueillir dans notre écosystème innovant dédié à l'avenir du travail en Afrique.</p>
                
                <p>Votre compte <strong>${getUserTypeLabel(userType)}</strong> a été créé avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités de notre plateforme.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${loginUrl}" class="cta-button">
                    Accéder à mon compte
                </a>
            </div>
            
            <div class="features">
                <h3 style="color: #00167a; margin-top: 0;">Ce que vous pouvez faire maintenant :</h3>
                ${userType === 'candidate' ? `
                <div class="feature-item">Créer et optimiser votre CV professionnel</div>
                <div class="feature-item">Postuler aux offres d'emploi qui vous correspondent</div>
                <div class="feature-item">Accéder à notre CVthèque et aux opportunités</div>
                <div class="feature-item">Bénéficier de nos services de coaching</div>
                ` : userType === 'company' ? `
                <div class="feature-item">Publier vos offres d'emploi</div>
                <div class="feature-item">Accéder à notre CVthèque de talents</div>
                <div class="feature-item">Utiliser nos outils de recrutement</div>
                <div class="feature-item">Bénéficier de nos services RH complets</div>
                ` : userType === 'student' ? `
                <div class="feature-item">Accéder à nos formations professionnelles</div>
                <div class="feature-item">Bénéficier de coaching CV et lettre de motivation</div>
                <div class="feature-item">Découvrir les opportunités d'emploi</div>
                <div class="feature-item">Participer à nos programmes d'accompagnement</div>
                ` : `
                <div class="feature-item">Accéder à toutes les fonctionnalités de la plateforme</div>
                <div class="feature-item">Gérer votre profil et vos préférences</div>
                <div class="feature-item">Bénéficier de notre support client</div>
                `}
            </div>
            
            <div class="contact-info">
                <h4 style="color: #00167a; margin-top: 0;">Besoin d'aide ?</h4>
                <p>Notre équipe est là pour vous accompagner :</p>
                <p>📧 Email : contact@novrhconsulting.com</p>
                <p>📞 Téléphone : +223 XX XX XX XX</p>
                <p>🌐 Site web : www.novrhconsulting.com</p>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2025 NovRH Consulting. Tous droits réservés.</p>
            <p>Innovons ensemble pour être les leaders de demain.</p>
        </div>
    </div>
</body>
</html>
  `;
};

// Template d'email pour les notifications d'admin
export const AdminNotificationTemplate = ({
  adminName,
  action,
  targetUser,
  details
}: {
  adminName: string;
  action: string;
  targetUser: string;
  details: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notification Admin - NovRH</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #00167a;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #00167a;
            margin-bottom: 10px;
        }
        .alert-box {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .action-details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">NOVRH CONSULTING</div>
            <div style="color: #666;">Notification Administrateur</div>
        </div>
        
        <div class="alert-box">
            <h3 style="color: #856404; margin-top: 0;">Action Administrateur</h3>
            <p><strong>Administrateur :</strong> ${adminName}</p>
            <p><strong>Action :</strong> ${action}</p>
            <p><strong>Utilisateur concerné :</strong> ${targetUser}</p>
        </div>
        
        <div class="action-details">
            <h4>Détails de l'action :</h4>
            <p>${details}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
            <p>© 2025 NovRH Consulting. Notification automatique.</p>
        </div>
    </div>
</body>
</html>
  `;
};

// Template d'email pour les invitations d'admin
export const AdminInvitationTemplate = ({
  firstName,
  lastName,
  role,
  invitationUrl,
  message
}: {
  firstName: string;
  lastName: string;
  role: string;
  invitationUrl: string;
  message?: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation Administrateur - NovRH</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #00167a;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #00167a;
            margin-bottom: 10px;
        }
        .invitation-box {
            background-color: #e8f5e8;
            border: 1px solid #4caf50;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .cta-button {
            display: inline-block;
            background-color: #00167a;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">NOVRH CONSULTING</div>
            <div style="color: #666;">Invitation Administrateur</div>
        </div>
        
        <div class="invitation-box">
            <h2 style="color: #2e7d32; margin-top: 0;">Invitation à rejoindre l'équipe d'administration</h2>
            <p>Bonjour ${firstName} ${lastName},</p>
            <p>Vous êtes invité(e) à rejoindre l'équipe d'administration de NovRH Consulting en tant que <strong>${role}</strong>.</p>
        </div>
        
        ${message ? `
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4>Message personnalisé :</h4>
            <p>${message}</p>
        </div>
        ` : ''}
        
        <div style="text-align: center;">
            <a href="${invitationUrl}" class="cta-button">
                Accepter l'invitation
            </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
            <p>© 2025 NovRH Consulting. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
  `;
};
