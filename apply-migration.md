# Guide d'Application de la Migration de Tarification

## 🚀 Application de la Migration

### 1. Prérequis
- Accès à votre base de données Supabase
- Permissions d'administrateur pour exécuter des migrations

### 2. Fichier de Migration
Le fichier `supabase/migrations/20250716150000-update-tarification.sql` contient :
- Suppression des anciens plans d'abonnement
- Insertion des nouveaux plans selon la tarification exacte
- Mise à jour des règles d'accès aux services
- Amélioration de la fonction `check_service_access`

### 3. Application de la Migration

#### Option A : Via l'Interface Supabase
1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Copiez le contenu du fichier de migration
4. Exécutez le script

#### Option B : Via la CLI Supabase
```bash
# Installer la CLI Supabase si ce n'est pas déjà fait
npm install -g supabase

# Se connecter à votre projet
supabase login

# Lier le projet local
supabase link --project-ref YOUR_PROJECT_REF

# Appliquer la migration
supabase db push
```

#### Option C : Via l'API REST
```bash
curl -X POST "https://YOUR_PROJECT_REF.supabase.co/rest/v1/rpc/exec_sql" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CONTENU_DE_LA_MIGRATION"
  }'
```

### 4. Vérification de la Migration

#### Vérifier les plans d'abonnement
```sql
SELECT * FROM subscription_plans ORDER BY price;
```

#### Vérifier les règles d'accès
```sql
SELECT * FROM service_access;
```

#### Tester la fonction de vérification
```sql
SELECT check_service_access('Poster une offre', 'USER_ID_TEST');
```

### 5. Structure des Nouveaux Plans

#### Plans Étudiants
- **International** : 15€, 15€, 20€ (EUR)
- **Maliens** : 5 000 FCFA, 5 000 FCFA, 7 500 FCFA (XOF)

#### Plans Entreprises
- **Recrutement Complet** : 1.5M, 2M, 3M FCFA/an
- **Recrutement Partiel** : 700K, 1M, 1.5M FCFA/an  
- **Recrutement Autonomie** : 500K FCFA/an

#### Plans Mensuels
- Conversion automatique des tarifs annuels
- Économies de 2 mois par rapport au mensuel

### 6. Règles d'Accès Mises à Jour

#### Services Étudiants
- `student_coaching` requis pour tous les services étudiants

#### Services Entreprises
- `recruitment_complete` pour le recrutement complet
- `recruitment_partial` pour le recrutement partiel
- `recruitment_autonomy` pour le recrutement en autonomie

### 7. Tests Post-Migration

#### Test des Plans Étudiants
1. Créer un utilisateur test
2. S'abonner à un plan étudiant
3. Vérifier l'accès aux services étudiants

#### Test des Plans Entreprises
1. Créer un utilisateur entreprise
2. S'abonner à un plan de recrutement
3. Vérifier l'accès à la publication d'offres

#### Test de la Protection des Routes
1. Accéder à `/post-job` sans abonnement
2. Vérifier l'affichage du message de protection
3. S'abonner et vérifier l'accès

### 8. Rollback (si nécessaire)

Si vous devez annuler la migration :
```sql
-- Restaurer les anciens plans (à adapter selon vos besoins)
INSERT INTO subscription_plans (...) VALUES (...);

-- Restaurer les anciennes règles d'accès
INSERT INTO service_access (...) VALUES (...);
```

### 9. Monitoring Post-Migration

#### Vérifications à effectuer
- [ ] Les nouveaux plans s'affichent correctement
- [ ] Les tarifs sont corrects selon la devise
- [ ] Les règles d'accès fonctionnent
- [ ] Les routes protégées bloquent l'accès
- [ ] Le processus d'abonnement fonctionne

#### Logs à surveiller
- Erreurs de base de données
- Échecs de vérification d'accès
- Problèmes d'abonnement

### 10. Support et Dépannage

#### Problèmes courants
1. **Plans non visibles** : Vérifier `is_active = true`
2. **Erreurs d'accès** : Vérifier la fonction `check_service_access`
3. **Problèmes d'abonnement** : Vérifier les contraintes de base

#### Contacts
- Consultez les logs Supabase
- Vérifiez la console du navigateur
- Testez en environnement de développement

---

**Important** : Testez toujours en environnement de développement avant de déployer en production !
