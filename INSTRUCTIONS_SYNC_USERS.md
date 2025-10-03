# Instructions pour corriger le compteur d'utilisateurs

## Problème identifié
Le dashboard affiche 1 utilisateur au lieu de 5 car les utilisateurs existent dans `auth.users` mais ne sont pas synchronisés dans la table `profiles`.

## Solution

### Étape 1: Exécuter le script SQL
1. Ouvrez l'interface Supabase (https://supabase.com/dashboard)
2. Allez dans **SQL Editor**
3. Copiez et collez le contenu du fichier `run-sync-migration.sql`
4. Exécutez le script

### Étape 2: Vérifier le résultat
Après l'exécution, vous devriez voir :
- 5 utilisateurs au total
- 2 administrateurs
- 3 candidats

### Étape 3: Tester le dashboard
1. Rafraîchissez votre dashboard admin
2. Le compteur d'utilisateurs devrait maintenant afficher 5

## Utilisateurs à synchroniser
- ousmanebaradji0@gmail.com (Candidat)
- zainacherif2019@gmail.com (Candidat)  
- mohammedtraore301@gmail.com (Candidat)
- speakaboutai@gmail.com (Admin)
- admin@novrh.com (Admin)

## Alternative si le script SQL ne fonctionne pas
Si vous ne pouvez pas exécuter le script SQL, vous pouvez :
1. Créer manuellement les profils via l'interface admin
2. Ou utiliser la fonction d'inscription pour recréer les comptes

## Vérification
Après la synchronisation, le dashboard devrait afficher :
- **Utilisateurs**: 5
- **Entreprises**: 0 (ou le nombre réel)
- **Revenus**: 0 FCFA (ou le montant réel)
- **Abonnements**: 0 (ou le nombre réel)
