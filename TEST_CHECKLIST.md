# Checklist de Tests Post-Migration

## ✅ Tests Fonctionnels

### 1. Authentification et Profils

- [ ] **Création automatique de profil**
  - Créer un nouvel utilisateur via Supabase Auth
  - Vérifier qu'un profil est automatiquement créé dans `public.profiles`
  - Vérifier que les données (email, nom) sont correctement synchronisées

- [ ] **Vérification des profils existants**
  - Vérifier que tous les utilisateurs auth ont un profil correspondant
  - Exécuter : `SELECT COUNT(*) FROM auth.users;` vs `SELECT COUNT(*) FROM profiles;`
  - Les deux comptes doivent être égaux

### 2. Service Reviews (Avis)

- [ ] **Soumission d'un avis**
  - Se connecter en tant qu'utilisateur
  - Soumettre un avis via l'interface
  - Vérifier que l'avis est créé avec `user_id = auth.uid()`
  - Vérifier que l'avis apparaît dans la liste (après approbation admin)

- [ ] **Lecture des avis**
  - Vérifier que les avis approuvés sont visibles publiquement
  - Vérifier qu'un utilisateur peut voir ses propres avis (même non approuvés)
  - Vérifier que les avis anonymes n'affichent pas le nom de l'utilisateur

- [ ] **Modification/Suppression d'avis**
  - Vérifier qu'un utilisateur peut modifier son propre avis
  - Vérifier qu'un utilisateur peut supprimer son propre avis
  - Vérifier qu'un utilisateur ne peut pas modifier/supprimer les avis d'autres utilisateurs

### 3. Réponses aux Avis

- [ ] **Création de réponse**
  - Créer une réponse à un avis approuvé
  - Vérifier que `responder_id = auth.uid()`
  - Vérifier que la réponse est visible

- [ ] **Modification/Suppression de réponse**
  - Vérifier qu'un utilisateur peut modifier/supprimer ses propres réponses

### 4. Réactions aux Avis

- [ ] **Création de réaction**
  - Ajouter une réaction (like/dislike) à un avis
  - Vérifier que `user_id = auth.uid()`
  - Vérifier qu'un utilisateur ne peut pas réagir deux fois au même avis

### 5. RLS (Row Level Security)

- [ ] **Politiques de lecture**
  - Vérifier qu'un utilisateur non connecté peut voir les avis approuvés
  - Vérifier qu'un utilisateur connecté peut voir ses propres avis

- [ ] **Politiques d'écriture**
  - Vérifier qu'un utilisateur non connecté ne peut pas créer d'avis
  - Vérifier qu'un utilisateur connecté peut créer un avis avec `user_id = auth.uid()`
  - Vérifier qu'un utilisateur ne peut pas créer un avis avec un `user_id` différent

- [ ] **Politiques de modification**
  - Vérifier qu'un utilisateur ne peut modifier que ses propres avis
  - Vérifier qu'un admin peut modifier tous les avis

### 6. Fonctions RPC

- [ ] **get_recent_reviews**
  - Appeler la fonction : `SELECT * FROM get_recent_reviews(10);`
  - Vérifier que les résultats incluent les noms d'utilisateurs corrects
  - Vérifier que les avis anonymes affichent "Utilisateur anonyme"

- [ ] **get_service_rating_stats**
  - Appeler la fonction : `SELECT * FROM get_service_rating_stats('recruitment');`
  - Vérifier que les statistiques sont correctes

- [ ] **can_user_review_service**
  - Tester avec un utilisateur qui n'a pas encore laissé d'avis : doit retourner `true`
  - Tester avec un utilisateur qui a déjà laissé un avis : doit retourner `false`

## 🔍 Tests Techniques

### 7. Contraintes de Clé Étrangère

- [ ] **Vérifier les FK**
  ```sql
  SELECT 
      tc.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND kcu.column_name LIKE '%user_id%' OR kcu.column_name LIKE '%responder_id%' OR kcu.column_name LIKE '%recruiter_id%' OR kcu.column_name LIKE '%candidate_id%'
  ORDER BY tc.table_name;
  ```
  - Toutes les FK doivent pointer vers `auth.users(id)`

### 8. Index

- [ ] **Vérifier les index**
  ```sql
  SELECT 
      tablename,
      indexname,
      indexdef
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND tablename = 'service_reviews'
    AND indexname LIKE '%user_id%';
  ```
  - L'index `idx_service_reviews_user_id` doit exister

### 9. Trigger

- [ ] **Vérifier le trigger**
  ```sql
  SELECT 
      trigger_name,
      event_manipulation,
      event_object_table,
      action_statement
  FROM information_schema.triggers
  WHERE trigger_name = 'on_auth_user_created';
  ```
  - Le trigger doit exister et être actif

### 10. Types ENUM

- [ ] **Vérifier les types ENUM**
  ```sql
  SELECT typname, typtype
  FROM pg_type
  WHERE typname IN ('payment_status', 'subscription_status', 'user_type');
  ```
  - Les trois types doivent exister

## 🐛 Tests d'Erreurs

### 11. Gestion des Erreurs

- [ ] **Insertion avec user_id invalide**
  - Essayer d'insérer un avis avec un `user_id` qui n'existe pas dans `auth.users`
  - Doit retourner une erreur de contrainte FK

- [ ] **Insertion sans authentification**
  - Essayer d'insérer un avis sans être connecté
  - Doit retourner une erreur d'authentification

- [ ] **Insertion avec user_id différent de auth.uid()**
  - Essayer d'insérer un avis avec `user_id != auth.uid()`
  - Doit être bloqué par la RLS policy

## 📊 Tests de Performance

### 12. Performance des Requêtes

- [ ] **Requête des avis récents**
  - Mesurer le temps d'exécution de `get_recent_reviews(10)`
  - Doit être < 100ms

- [ ] **Requête avec JOIN**
  - Tester une requête qui joint `service_reviews` avec `auth.users` et `profiles`
  - Vérifier que les performances sont acceptables

## 🔐 Tests de Sécurité

### 13. Sécurité RLS

- [ ] **Isolation des données**
  - Vérifier qu'un utilisateur A ne peut pas voir les avis non approuvés de l'utilisateur B
  - Vérifier qu'un utilisateur A ne peut pas modifier les avis de l'utilisateur B

- [ ] **Accès Admin**
  - Vérifier qu'un admin peut voir tous les avis
  - Vérifier qu'un admin peut modifier/supprimer tous les avis

## 📝 Tests de Migration de Données

### 14. Intégrité des Données

- [ ] **Vérifier la migration des données**
  ```sql
  -- Vérifier qu'il n'y a pas de données orphelines
  SELECT COUNT(*) 
  FROM service_reviews sr
  WHERE NOT EXISTS (
      SELECT 1 FROM auth.users au WHERE au.id = sr.user_id
  );
  ```
  - Le résultat doit être 0

- [ ] **Vérifier la cohérence**
  ```sql
  -- Vérifier que tous les user_id dans service_reviews correspondent à des auth.users
  SELECT COUNT(DISTINCT sr.user_id) as reviews_users,
         COUNT(DISTINCT au.id) as auth_users
  FROM service_reviews sr
  JOIN auth.users au ON au.id = sr.user_id;
  ```
  - Les comptes doivent correspondre

## 🎯 Tests d'Intégration

### 15. Flux Complet

- [ ] **Flux complet de soumission d'avis**
  1. Créer un nouvel utilisateur
  2. Vérifier que le profil est créé automatiquement
  3. Se connecter
  4. Soumettre un avis
  5. Vérifier que l'avis est créé avec le bon `user_id`
  6. Vérifier que l'avis est visible (après approbation)
  7. Ajouter une réaction
  8. Ajouter une réponse

## 📋 Checklist de Validation Finale

- [ ] Tous les tests fonctionnels passent
- [ ] Toutes les contraintes FK sont correctes
- [ ] Toutes les RLS policies fonctionnent
- [ ] Aucune donnée orpheline
- [ ] Les performances sont acceptables
- [ ] La sécurité est assurée
- [ ] Le code client fonctionne avec les nouvelles références
- [ ] La documentation est à jour

## 🚨 Points d'Attention

1. **Tester sur un environnement de staging avant la production**
2. **Sauvegarder la base de données avant la migration**
3. **Vérifier les logs d'erreur après la migration**
4. **Monitorer les performances pendant les premiers jours**

## 📞 Support

En cas de problème :
1. Vérifier les logs Supabase
2. Vérifier les erreurs dans la console du navigateur
3. Vérifier les RLS policies avec `EXPLAIN`
4. Consulter la documentation Supabase

