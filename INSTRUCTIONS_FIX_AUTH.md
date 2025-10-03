# Instructions pour corriger l'authentification admin

## Problème identifié
L'erreur "Database error granting user" est causée par des politiques RLS (Row Level Security) trop restrictives qui bloquent l'authentification.

## Solution

### Étape 1 : Appliquer la migration de correction
1. Ouvrir Supabase Dashboard → SQL Editor
2. Copier-coller le contenu de `supabase/migrations/20250117000009-fix-auth-rls.sql`
3. Exécuter le script

### Étape 2 : Vérifier la correction
1. Tester la connexion avec :
   - **Email** : `admin@novrh.com`
   - **Mot de passe** : `admin123456`
2. Accéder au dashboard admin : `http://localhost:8081/admin`

### Étape 3 : Vérification finale
Le script affichera :
- Nombre total de profils
- Nombre d'administrateurs
- État du compte admin

## Changements apportés
1. **Suppression des politiques RLS problématiques**
2. **Désactivation temporaire de RLS** sur la table profiles
3. **Recréation de politiques permissives** :
   - Lecture : tout le monde peut lire les profils
   - Mise à jour : les utilisateurs peuvent modifier leur propre profil
   - Insertion : création de profils autorisée
4. **Vérification et correction du compte admin**

## Résultat attendu
- ✅ Connexion admin fonctionnelle
- ✅ Accès au dashboard admin
- ✅ Synchronisation automatique des utilisateurs
- ✅ Compteur d'utilisateurs correct
