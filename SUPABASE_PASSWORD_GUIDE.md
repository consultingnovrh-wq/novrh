# Guide pour récupérer le mot de passe Supabase

## Où trouver votre mot de passe Supabase

### Option 1 : Via le Dashboard Supabase (Recommandé)

1. Allez sur https://supabase.com/dashboard
2. Connectez-vous avec votre compte Supabase
3. Sélectionnez votre projet : `dsxkfzqqgghwqiihierm`
4. Allez dans **Settings** (Paramètres) → **Database**
5. Dans la section **Database Password**, vous pouvez :
   - **Voir** le mot de passe actuel (si vous l'avez déjà configuré)
   - **Réinitialiser** le mot de passe en cliquant sur "Reset Database Password"

### Option 2 : Réinitialiser le mot de passe

Si vous ne vous souvenez plus du mot de passe :

1. Dashboard → Votre projet → **Settings** → **Database**
2. Cliquez sur **"Reset Database Password"**
3. Un nouveau mot de passe sera généré
4. **IMPORTANT** : Copiez-le immédiatement car il ne sera affiché qu'une seule fois

### Option 3 : Utiliser la connexion directe sans mot de passe (pour les migrations)

Si vous avez seulement besoin d'appliquer les migrations, vous pouvez :

1. Utiliser le **SQL Editor** du dashboard Supabase (pas besoin de mot de passe CLI)
2. Copier-coller les migrations SQL directement dans l'éditeur
3. Exécuter les migrations une par une

## Connexion CLI Supabase

Une fois que vous avez le mot de passe :

```bash
# Se connecter à Supabase CLI
supabase login

# Lier votre projet
supabase link --project-ref dsxkfzqqgghwqiihierm

# Appliquer les migrations
supabase db push
```

## Note importante

- Le mot de passe de la base de données est différent de votre mot de passe de compte Supabase
- Le mot de passe de la base de données est utilisé uniquement pour les connexions PostgreSQL directes
- Pour la CLI, vous devez d'abord vous connecter avec `supabase login` (votre compte Supabase)

