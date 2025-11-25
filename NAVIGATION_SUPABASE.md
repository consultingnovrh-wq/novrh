# Instructions pour trouver le mot de passe Supabase

## Navigation dans le Dashboard Supabase

### Étape 1 : Accéder aux paramètres Database
1. Vous êtes actuellement sur la page **Settings** → **General**
2. Dans le menu latéral gauche, cherchez **"Database"** ou **"Database Settings"**
3. Cliquez sur **"Database"**

### Étape 2 : Trouver le mot de passe
Une fois dans **Settings** → **Database**, vous devriez voir :

- **Connection info** ou **Connection string**
- **Database Password** section
- Bouton **"Reset Database Password"** ou **"Show Database Password"**

### Étape 3 : Réinitialiser si nécessaire
Si vous ne voyez pas le mot de passe actuel :
1. Cliquez sur **"Reset Database Password"**
2. Un nouveau mot de passe sera généré
3. **Copiez-le immédiatement** (il ne sera affiché qu'une fois)

## Alternative : Utiliser le SQL Editor directement

Si vous avez juste besoin d'appliquer les migrations, vous pouvez :

1. Dans le menu latéral gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur **"New query"**
3. Copiez-collez le contenu de chaque migration SQL
4. Cliquez sur **"Run"** pour exécuter

**Pas besoin de mot de passe** pour utiliser le SQL Editor !

## Structure typique du menu Supabase :

```
Dashboard
├── Project Overview
├── Table Editor
├── SQL Editor ← Utilisez celui-ci pour les migrations
├── Authentication
├── Storage
├── Edge Functions
└── Settings
    ├── General (vous êtes ici)
    ├── Database ← Cliquez ici pour le mot de passe
    ├── API
    └── ...
```

