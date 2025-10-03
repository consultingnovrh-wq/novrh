# Instructions de correction pour les problèmes

## Problèmes corrigés ✅

### 1. **Route entreprise corrigée** ✅
- **Problème** : `navigate('/company-dashboard')` → 404 Not Found
- **Solution** : Changé vers `navigate('/dashboard/company')` dans `Login.tsx`
- **Statut** : ✅ Appliqué

### 2. **Export utilisateurs implémenté** ✅
- **Problème** : Bouton "Exporter" sans fonction
- **Solution** : Ajouté fonction `exportUsers()` qui génère CSV
- **Statut** : ✅ Appliqué

## Scripts à exécuter pour les derniers problèmes 🔧

### **Script 1 : Corriger erreurs 400**
```sql
-- Copier-coller dans Supabase Dashboard → SQL Editor
SELECT 'Script fix-400-errors.sql à exécuter' as instruction;
-- Contenu du fichier fix-400-errors.sql
```

### **Script 2 : Créer admin + sidebar**
```sql
-- Copier-coller dans Supabase Dashboard → SQL Editor  
SELECT 'Script ultra-simple-admin.sql à exécuter' as instruction;
-- Contenu du fichier ultra-simple-admin.sql
```

## Tests après corrections 🧪

### Test 1 : Entreprise se connecte
1. Créer une entreprise via `/register`
2. Se connecter
3. ✅ Devrait aller vers `/dashboard/company` (plus d'erreur 404)

### Test 2 : Export utilisateurs  
1. Aller dans Admin → Utilisateurs
2. Cliquer "Exporter"
3. ✅ Devrait télécharger `utilisateurs-2025-01-17.csv`

### Test 3 : Dashboard admin avec sidebar
1. Se connecter comme `admin@novrh.com`
2. ✅ Devrait voir sidebar admin
3. ✅ Entreprises visibles dans dashboard

## Résumé des fichiers modifiés 📁

- ✅ `src/pages/Login.tsx` - Route entreprise corrigée
- ✅ `src/pages/AdminUsers.tsx` - Export CSV implémenté
- 🔧 `fix-400-errors.sql` - À exécuter 
- 🔧 `ultra-simple-admin.sql` - À exécuter
