# 🚀 Guide de Démarrage Rapide - NovRH

## 📋 **Étapes pour exécuter votre projet corrigé**

### **1. Configuration de la base de données Supabase**

#### **Option A : Via la console Supabase (Recommandé)**
1. Allez sur [supabase.com](https://supabase.com) et connectez-vous
2. Ouvrez votre projet NovRH
3. Allez dans **SQL Editor** (dans le menu de gauche)
4. Copiez tout le contenu du fichier `setup-database.sql`
5. Collez-le dans l'éditeur SQL et cliquez sur **Run**
6. Attendez le message "Base de données configurée avec succès !"

#### **Option B : Via la CLI Supabase**
```bash
# Installer la CLI Supabase
npm install -g @supabase/cli

# Se connecter à votre projet
supabase login

# Appliquer les migrations
supabase db push
```

### **2. Configuration des variables d'environnement**

1. **Créez un fichier `.env`** à la racine de votre projet
2. **Ajoutez vos informations Supabase** :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

**Pour trouver ces informations :**
- Allez dans votre projet Supabase
- Cliquez sur **Settings** → **API**
- Copiez l'URL et la clé anon/public

### **3. Installation des dépendances**

```bash
npm install
```

### **4. Lancement de l'application**

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:8080`

## 🔧 **Vérification de la configuration**

### **Vérifiez que les tables sont créées :**
Dans la console Supabase, allez dans **Table Editor** et vérifiez que vous avez :
- ✅ `profiles`
- ✅ `candidates` 
- ✅ `companies`
- ✅ `jobs`
- ✅ `job_applications`
- ✅ `subscription_plans`
- ✅ `user_subscriptions`
- ✅ `service_access`

### **Vérifiez que RLS est activé :**
Dans **Table Editor**, cliquez sur chaque table et vérifiez que **RLS** est activé.

## 🎯 **Fonctionnalités maintenant disponibles**

- ✅ **Inscription/Connexion** sans erreur de profils
- ✅ **Ajout/Modification de CV** pour les candidats
- ✅ **Publication d'offres d'emploi** pour les employeurs
- ✅ **Consultation et candidature** aux offres
- ✅ **Système de tarification** fonctionnel
- ✅ **Navigation simplifiée** (menus redondants supprimés)

## 🚨 **En cas de problème**

### **Erreur "violation des règles profiles"**
- Vérifiez que la table `profiles` est créée
- Vérifiez que les politiques RLS sont en place

### **Erreur de connexion Supabase**
- Vérifiez vos variables d'environnement
- Vérifiez que votre projet Supabase est actif

### **Erreur de migration**
- Vérifiez que vous avez les droits d'administration sur votre projet
- Essayez d'exécuter le script SQL manuellement

## 📞 **Support**

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs dans la console Supabase
3. Assurez-vous que toutes les étapes ont été suivies

---

**🎉 Votre application NovRH est maintenant prête à fonctionner !**
