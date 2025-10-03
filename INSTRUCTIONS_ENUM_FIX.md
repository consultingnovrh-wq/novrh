# Instructions pour corriger le problème ENUM user_type

## 🐛 Problème identifié
L'erreur `invalid input value for enum user_type: "employer"` indique que :
- Le type `user_type` est un ENUM PostgreSQL
- La valeur "employer" n'existe pas dans cet ENUM
- Il faut utiliser les bonnes valeurs ENUM

## 🔧 Solution

### Étape 1: Vérifier le type actuel
1. Ouvrez **Supabase Dashboard** → **SQL Editor**
2. Copiez et collez le contenu de `check-user-type.sql`
3. Exécutez le script pour voir le type actuel

### Étape 2: Corriger le type ENUM
1. Copiez et collez le contenu de `supabase/migrations/20250117000004-fix-enum-user-type.sql`
2. Exécutez le script

## 📋 Valeurs ENUM supportées

### Types d'utilisateurs valides :
- `candidate` - Candidat
- `company` - Entreprise  
- `admin` - Administrateur

### Types supprimés :
- `employer` - Supprimé (utiliser `company` à la place)
- `student` - Supprimé (utiliser `candidate` à la place)

## 🚀 Fonctionnement après correction

### Lors de l'inscription d'un candidat :
```javascript
// Dans Register.tsx
data: {
  first_name: candidateData.firstName,
  last_name: candidateData.lastName,
  phone: candidateData.phone,
  user_type: 'candidate'  // ✅ Valeur valide
}
```

### Lors de l'inscription d'une entreprise :
```javascript
// Dans Register.tsx
data: {
  first_name: companyData.companyName,
  last_name: 'Entreprise',
  user_type: 'company'  // ✅ Valeur valide
}
```

## 🔍 Vérification

### Après l'exécution de la migration :
```sql
-- Vérifier le type ENUM
SELECT enumlabel FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_type');

-- Vérifier les utilisateurs synchronisés
SELECT user_type, COUNT(*) FROM public.profiles GROUP BY user_type;
```

### Résultat attendu :
- Type ENUM créé avec 3 valeurs : `candidate`, `company`, `admin`
- Utilisateurs existants synchronisés
- Triggers fonctionnels
- Dashboard mis à jour

## 📊 Migration des données

### Si vous avez des utilisateurs avec `employer` :
- Ils seront automatiquement convertis en `company`
- Si vous avez des utilisateurs avec `student` :
- Ils seront automatiquement convertis en `candidate`

## 🎉 Avantages

✅ **Type sûr** : ENUM garantit l'intégrité des données
✅ **Performance** : ENUM plus rapide que TEXT avec CHECK
✅ **Maintenance** : Valeurs centralisées et contrôlées
✅ **Synchronisation** : Automatique et fiable

## 🛠️ En cas de problème

### Si la migration échoue :
1. Vérifiez qu'aucune contrainte de clé étrangère ne référence `user_type`
2. Vérifiez qu'aucune vue ou fonction ne dépend du type
3. Exécutez d'abord `check-user-type.sql` pour diagnostiquer

### Pour ajouter de nouveaux types plus tard :
```sql
-- Ajouter un nouveau type (exemple)
ALTER TYPE user_type ADD VALUE 'moderator';
```

La synchronisation automatique devrait maintenant fonctionner parfaitement avec le type ENUM ! 🚀
