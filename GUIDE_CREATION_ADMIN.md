# 🚀 Guide de Création du Compte Administrateur NovRH

## 📋 Informations du Compte

- **Email**: `speakaboutai@gmail.com`
- **Mot de passe**: `Mariamden7576`
- **Rôle**: Super Administrateur
- **Accès**: `https://novrhconsulting.com/admin`

## 🎯 Méthodes de Création

### **Méthode 1: Interface Web (Recommandée)**

1. **Ouvrir le fichier** `create-admin-web.html` dans votre navigateur
2. **Cliquer sur** "🎯 Créer le Compte Administrateur"
3. **Attendre** la confirmation de création
4. **Accéder** au dashboard via le bouton fourni

### **Méthode 2: Script Node.js**

1. **Installer les dépendances** :
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Remplacer** `YOUR_SERVICE_ROLE_KEY` dans `create-admin-account.js` par votre clé de service Supabase

3. **Exécuter** le script :
   ```bash
   node create-admin-account.js
   ```

### **Méthode 3: SQL Direct (Avancée)**

1. **Créer l'utilisateur** via l'interface Supabase Auth
2. **Exécuter** le script `create-admin-sql.sql` dans l'éditeur SQL de Supabase
3. **Remplacer** `USER_ID_FROM_AUTH` par l'ID de l'utilisateur créé

## 🔑 Obtention de la Clé de Service Supabase

1. **Aller sur** [supabase.com](https://supabase.com)
2. **Se connecter** à votre projet
3. **Aller dans** Settings > API
4. **Copier** la "service_role" key (attention: gardez-la secrète !)

## 🌐 Accès au Dashboard

Une fois le compte créé :

1. **Aller sur** `https://novrhconsulting.com/admin`
2. **Se connecter** avec :
   - Email: `speakaboutai@gmail.com`
   - Mot de passe: `Mariamden7576`

## ✅ Vérification de la Création

Le compte est créé avec succès si vous voyez :

- ✅ Message de confirmation
- ✅ Accès au dashboard administrateur
- ✅ Toutes les fonctionnalités disponibles

## 🚨 Dépannage

### **Erreur "Utilisateur déjà existant"**
- Le compte existe déjà
- Essayez de vous connecter directement

### **Erreur de permissions**
- Vérifiez que les migrations de base de données sont appliquées
- Vérifiez que la table `profiles` existe

### **Erreur de connexion**
- Vérifiez votre connexion internet
- Vérifiez que le projet Supabase est actif

## 🔒 Sécurité

- **Ne partagez jamais** votre mot de passe
- **Changez le mot de passe** après la première connexion
- **Activez l'authentification à deux facteurs** si possible
- **Surveillez** les connexions suspectes

## 📞 Support

En cas de problème :

1. **Vérifiez** les logs d'erreur dans la console du navigateur
2. **Consultez** la documentation Supabase
3. **Contactez** l'équipe technique

---

**🎉 Félicitations ! Votre compte administrateur NovRH est maintenant prêt à être utilisé !**
