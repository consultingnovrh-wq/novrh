# Guide pour appliquer les migrations Supabase

## Étapes pour appliquer les migrations

### 1. Se connecter à Supabase CLI
```bash
supabase login
```
Cela ouvrira votre navigateur pour vous authentifier avec votre compte Supabase.

### 2. Lier votre projet local à votre projet Supabase
```bash
cd /Users/mohpython/Desktop/novrh
supabase link --project-ref dsxkfzqqgghwqiihierm
```

### 3. Appliquer les migrations
```bash
supabase db push
```

Cela appliquera toutes les migrations dans le dossier `supabase/migrations/` qui n'ont pas encore été appliquées.

## Migrations à appliquer

1. **20250121000001-fix-get-recent-reviews-function.sql** - Corrige la fonction SQL `get_recent_reviews`
2. **20250121000002-fix-service-reviews-rls-policies.sql** - Corrige les politiques RLS pour permettre l'insertion d'avis

## Alternative : Appliquer via le SQL Editor

Si vous préférez appliquer les migrations manuellement via le dashboard Supabase :

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans "SQL Editor"
4. Copiez-collez le contenu de chaque fichier de migration et exécutez-les dans l'ordre

