# Instructions pour corriger l'inscription et personnaliser les emails

## Problèmes identifiés
1. **Erreur d'inscription** : "Database error granting user" - les politiques RLS bloquent l'inscription
2. **Message email générique** : Le message de confirmation Supabase est en anglais et générique

## Solutions

### Étape 1 : Corriger l'inscription
1. Ouvrir Supabase Dashboard → SQL Editor
2. Copier-coller le contenu de `supabase/migrations/20250117000010-fix-registration-rls.sql`
3. Exécuter le script

### Étape 2 : Personnaliser les templates d'email
1. Dans le même SQL Editor
2. Copier-coller le contenu de `supabase/migrations/20250117000011-customize-email-templates.sql`
3. Exécuter le script

### Étape 3 : Configurer Supabase Auth (Optionnel)
Pour utiliser les templates personnalisés, vous pouvez configurer Supabase Auth :

1. Aller dans Supabase Dashboard → Authentication → Email Templates
2. Personnaliser le template "Confirm signup" avec :
   - **Subject** : `Finalisez votre inscription - NovRH Consulting`
   - **Body** : 
   ```
   Il vous reste une étape à réaliser afin de finaliser l'activation de votre compte.
   Grâce à lui vous pourrez découvrir tous nos services en ligne.
   
   Cliquez sur le lien suivant pour confirmer votre inscription :
   {{ .ConfirmationURL }}
   
   Nos services :
   - Recrutement et placement de talents
   - Formation professionnelle
   - Conseil en ressources humaines
   - Gestion de carrière
   
   Merci de nous faire confiance !
   L'équipe NovRH Consulting
   ```

## Changements apportés

### Migration 1 : Correction inscription
- ✅ Politiques RLS permissives pour l'inscription
- ✅ Trigger de synchronisation automatique
- ✅ Vérification des politiques existantes

### Migration 2 : Templates email personnalisés
- ✅ Table `email_templates` créée
- ✅ Template de confirmation personnalisé
- ✅ Fonction `get_email_template()` pour récupérer les templates
- ✅ Politiques RLS pour la gestion des templates

## Résultat attendu
- ✅ Inscription des candidats fonctionnelle
- ✅ Inscription des entreprises fonctionnelle
- ✅ Message de confirmation personnalisé en français
- ✅ Synchronisation automatique des profils

## Test
1. Tester l'inscription d'un nouveau candidat
2. Vérifier la réception de l'email de confirmation
3. Confirmer que le message est personnalisé
4. Vérifier que le profil est créé automatiquement

## Alternative
Si les templates Supabase ne se mettent pas à jour, utilisez la fonction `get_email_template()` dans votre application pour récupérer le contenu personnalisé et l'envoyer via votre service d'email.
