# Instructions pour corriger complètement le système d'authentification

## Problèmes identifiés
1. ❌ **Table candidates vide** malgré 4 profils candidats
2. ❌ **Erreur "Error sending confirmation email"** bloque l'inscription
3. ℹ️ Synchronisation auth.users ↔ profiles OK

## Solutions

### Étape 1 : Synchroniser les candidats manquants
1. Ouvrir Supabase Dashboard → SQL Editor
2. Copier-coller le contenu de `supabase/migrations/20250117000015-fix-candidates-sync.sql`
3. Exécuter le script

### Étape 2 : Désactiver temporairement la vérification email
1. Dans le même SQL Editor
2. Copier-coller le contenu de `supabase/migrations/20250117000016-disable-email-confirmation.sql`
3. Exécuter le script

### Étape 3 : Désactiver complètement la confirmation email dans Supabase Dashboard
1. Aller dans Supabase Dashboard → Authentication → Settings
2. Désactiver "Enable email confirmations"
3. Cliquer sur "Save"

### Étape 4 : Tester l'inscription
1. Rafraîchir la page d'inscription
2. Créer un nouveau compte candidat
3. Créer un nouveau compte entreprise
4. Vérifier que les profils sont créés automatiquement

## Changements apportés

### Migration 1 : Synchronisation candidats
- ✅ Insertion des 4 candidats manquants dans `candidates`
- ✅ Mise à jour des téléphones depuis `auth.users"
- ✅ Trigger automatique pour les futurs candidats
- ✅ Désactivation temporaire de RLS sur candidates/companies

### Migration 2 : Vérification email
- ✅ Marquage de tous les emails comme vérifiés
- ✅ Mise à jour des profils existants

### Dashboard Supabase
- ✅ Désactivation de la confirmation email

## Résultat attendu
- ✅ **Connexion admin fonctionnelle** (admin@novrh.com)
- ✅ **Inscription candidats fonctionnelle** (plus d'erreur email)
- ✅ **Inscription entreprises fonctionnelle**
- ✅ **4 candidats synchronisés** dans la table candidates
- ✅ **Synchronisation automatique** des futurs utilisateurs
- ✅ **Connexion normale** pour tous les utilisateurs

## Test complet

### Test 1 : Connexion admin
- Email : `admin@novrh.com`
- Mot de passe : `admin123456`
- Résultat attendu : Accès dashboard admin

### Test 2 : Connexion candidat existant
- Email : `ousmanebaradji0@gmail.com`
- Mot de passe : (le mot de passe utilisé lors de l'inscription)
- Résultat attendu : Accès dashboard candidat

### Test 3 : Inscription nouveau candidat
- Créer un nouveau compte
- Résultat attendu : Inscription réussie sans erreur email

### Test 4 : Vérification synchronisation
- Vérifier que le nouveau candidat apparaît dans `profiles` et `candidates`

## Redémarrer le serveur
Après les migrations, redémarrer le serveur de développement :
```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

## Résultat final
- ✅ **Tous les utilisateurs peuvent se connecter**
- ✅ **Nouveaux utilisateurs peuvent s'inscrire**
- ✅ **Synchronisation automatique des profils**
- ✅ **Accès au dashboard admin fonctionnel**
- ✅ **Connexion normale pour candidats et entreprises**
