# Instructions pour corriger définitivement l'inscription

## Problèmes identifiés
1. **Inscription échoue** : Les politiques RLS bloquent encore l'inscription
2. **Message email non personnalisé** : Le template Supabase n'utilise pas notre message personnalisé

## Solution

### Étape 1 : Corriger l'inscription
1. Ouvrir Supabase Dashboard → SQL Editor
2. Copier-coller le contenu de `supabase/migrations/20250117000012-final-fix-registration.sql`
3. Exécuter le script

### Étape 2 : Configurer le template email dans Supabase
1. Aller dans Supabase Dashboard → Authentication → Email Templates
2. Cliquer sur "Confirm signup"
3. Remplacer le contenu par :

**Subject :**
```
Finalisez votre inscription - NovRH Consulting
```

**Body :**
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

© 2025 NovRH Consulting. Tous droits réservés.
```

4. Cliquer sur "Save"

### Étape 3 : Tester
1. Tester l'inscription d'un nouveau candidat
2. Vérifier la réception de l'email de confirmation
3. Confirmer que le message est en français et personnalisé

## Changements apportés

### Migration finale
- ✅ Désactivation temporaire de RLS pour corriger les politiques
- ✅ Politiques très permissives pour l'inscription
- ✅ Triggers de synchronisation automatique recréés
- ✅ Fonctions de synchronisation avec gestion des types

### Template email
- ✅ Message personnalisé en français
- ✅ Informations sur les services NovRH
- ✅ Design professionnel

## Résultat attendu
- ✅ Inscription des candidats fonctionnelle
- ✅ Inscription des entreprises fonctionnelle
- ✅ Message de confirmation personnalisé en français
- ✅ Synchronisation automatique des profils
- ✅ Plus d'erreur "Database error granting user"

## Alternative si le template ne se met pas à jour
Si le template Supabase ne se met pas à jour, utilisez la table `email_templates` créée dans la migration précédente pour récupérer le contenu personnalisé et l'envoyer via votre service d'email.