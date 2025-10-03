# Instructions pour corriger l'erreur d'envoi d'email

## Problème identifié
L'erreur "Error sending confirmation email" indique que Supabase n'arrive pas à envoyer l'email de confirmation. Cela peut être dû à :
1. Configuration SMTP manquante ou incorrecte
2. Limites de quota email atteintes
3. Configuration email dans Supabase Dashboard

## Solutions

### Étape 1 : Vérifier la configuration SMTP
1. Aller dans Supabase Dashboard → Settings → Authentication
2. Vérifier la section "SMTP Settings"
3. Si SMTP n'est pas configuré, l'activer avec :
   - **Host** : `smtp.gmail.com` (ou votre fournisseur)
   - **Port** : `587`
   - **Username** : Votre email
   - **Password** : Mot de passe d'application
   - **Sender email** : `noreply@novrhconsulting.com`
   - **Sender name** : `NovRH Consulting`

### Étape 2 : Configurer Gmail (recommandé)
1. Activer l'authentification à 2 facteurs sur Gmail
2. Générer un mot de passe d'application :
   - Aller dans Google Account → Security → App passwords
   - Créer un mot de passe pour "Mail"
   - Utiliser ce mot de passe dans Supabase

### Étape 3 : Alternative - Désactiver la vérification email
Si vous voulez tester sans email :
1. Aller dans Supabase Dashboard → Authentication → Settings
2. Désactiver "Enable email confirmations"
3. Les utilisateurs pourront se connecter directement

### Étape 4 : Appliquer la migration de configuration
1. Ouvrir Supabase Dashboard → SQL Editor
2. Copier-coller le contenu de `supabase/migrations/20250117000014-fix-email-config.sql`
3. Exécuter le script

### Étape 5 : Tester l'inscription
1. Tester l'inscription d'un nouveau candidat
2. Vérifier que l'email de confirmation est envoyé
3. Confirmer que le message est personnalisé

## Configuration SMTP recommandée

### Gmail
```
Host: smtp.gmail.com
Port: 587
Username: votre-email@gmail.com
Password: mot-de-passe-application
Sender email: noreply@novrhconsulting.com
Sender name: NovRH Consulting
```

### Autres fournisseurs
- **Outlook** : `smtp-mail.outlook.com:587`
- **Yahoo** : `smtp.mail.yahoo.com:587`
- **SendGrid** : `smtp.sendgrid.net:587`

## Résultat attendu
- ✅ Inscription fonctionnelle
- ✅ Email de confirmation envoyé
- ✅ Message personnalisé en français
- ✅ Plus d'erreur "Error sending confirmation email"

## Test
1. Configurer SMTP dans Supabase Dashboard
2. Tester l'inscription d'un nouveau candidat
3. Vérifier la réception de l'email de confirmation
4. Confirmer que le message est personnalisé

## Alternative temporaire
Si vous voulez tester rapidement, désactivez la vérification email dans Supabase Dashboard → Authentication → Settings.
