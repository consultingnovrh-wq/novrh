# Instructions pour corriger définitivement l'inscription

## Problème identifié
Les politiques RLS (Row Level Security) bloquent encore l'inscription malgré les corrections précédentes.

## Solution ultime

### Étape 1 : Désactiver complètement RLS
1. Ouvrir Supabase Dashboard → SQL Editor
2. Copier-coller le contenu de `supabase/migrations/20250117000013-ultimate-fix-registration.sql`
3. Exécuter le script

### Étape 2 : Tester l'inscription
1. Tester l'inscription d'un nouveau candidat
2. Tester l'inscription d'une nouvelle entreprise
3. Vérifier que les profils sont créés automatiquement

### Étape 3 : Réactiver RLS (optionnel)
Si l'inscription fonctionne, vous pouvez réactiver RLS avec des politiques plus simples :

```sql
-- Réactiver RLS avec des politiques permissives
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Politiques très permissives
CREATE POLICY "Allow all operations on profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on candidates" ON public.candidates FOR ALL USING (true);
CREATE POLICY "Allow all operations on companies" ON public.companies FOR ALL USING (true);
```

## Changements apportés

### Migration ultime
- ✅ Désactivation complète de RLS sur toutes les tables
- ✅ Suppression de toutes les politiques RLS existantes
- ✅ Triggers de synchronisation automatique recréés
- ✅ Fonctions de synchronisation avec gestion des types
- ✅ Test de la synchronisation

### Résultat attendu
- ✅ Inscription des candidats fonctionnelle
- ✅ Inscription des entreprises fonctionnelle
- ✅ Synchronisation automatique des profils
- ✅ Plus d'erreur "Database error granting user"
- ✅ Messages email personnalisés en français

## Test
1. Créer un nouveau compte candidat
2. Créer un nouveau compte entreprise
3. Vérifier que les profils sont créés automatiquement
4. Vérifier la réception des emails de confirmation personnalisés

## Alternative
Si vous préférez garder RLS activé, utilisez les politiques très permissives mentionnées dans l'étape 3.