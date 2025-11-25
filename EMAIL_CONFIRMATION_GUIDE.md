# Configuration Email Confirmation - Supabase

## Étapes pour activer la confirmation d'email

### 1. Configuration dans le Dashboard Supabase

1. **Aller dans Authentication > Settings**
   - URL: `https://supabase.com/dashboard/project/[votre-projet]/auth/settings`

2. **Activer la confirmation d'email**
   - Cocher "Enable email confirmations"
   - Cocher "Enable email change confirmations"

3. **Configurer les templates d'email**
   - **Confirmation d'inscription** : Template personnalisé
   - **Changement d'email** : Template personnalisé

### 2. Template d'email recommandé

```html
<h2>Bienvenue sur NOVRH !</h2>
<p>Bonjour {{ .Email }},</p>
<p>Merci de vous être inscrit sur notre plateforme de recrutement.</p>
<p>Veuillez confirmer votre email en cliquant sur le lien ci-dessous :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
<p>Après confirmation, vous pourrez vous connecter et accéder à votre tableau de bord.</p>
<p>Cordialement,<br>L'équipe NOVRH</p>
```

### 3. Configuration des URLs de redirection

- **Site URL** : `http://localhost:8081`
- **Redirect URLs** : 
  - `http://localhost:8081/login`
  - `http://localhost:8081/dashboard`
  - `http://localhost:8081/dashboard/company`
  - `http://localhost:8081/candidate-dashboard`

### 4. Test du flux complet

1. **Inscription** : Créer un compte entreprise/candidat
2. **Email** : Vérifier la réception de l'email de confirmation
3. **Confirmation** : Cliquer sur le lien dans l'email
4. **Login** : Se connecter avec les identifiants
5. **Redirection** : Vérifier la redirection vers le bon dashboard

### 5. Debugging

Si la redirection ne fonctionne pas :

1. **Vérifier les logs** dans la console du navigateur
2. **Vérifier la table profiles** dans Supabase
3. **Vérifier le champ user_type** dans le profil
4. **Vérifier email_verified** dans le profil

### 6. Commandes utiles

```sql
-- Vérifier les profils créés
SELECT user_id, email, user_type, email_verified, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- Vérifier les entreprises
SELECT c.*, p.email, p.user_type 
FROM companies c 
JOIN profiles p ON c.user_id = p.user_id;

-- Vérifier les candidats
SELECT c.*, p.email, p.user_type 
FROM candidates c 
JOIN profiles p ON c.user_id = p.user_id;
```

## Flux attendu

```
Inscription → Email confirmation → Login → Redirection selon user_type
```

- **Entreprise** : `/dashboard/company`
- **Candidat** : `/candidate-dashboard`  
- **Admin** : `/admin`
