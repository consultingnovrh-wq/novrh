// Script pour créer un compte administrateur fonctionnel
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dsxkfzqqgghwqiihierm.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeGtmenFxZ2dod3FpaWhpZXJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkwNzAyMSwiZXhwIjoyMDc0NDgzMDIxfQ.uPw8Jjnaj6QI25wlwQt9C0wPHj90W0nPcUNOvthC-RY";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createAdminAccount() {
  try {
    console.log('🚀 Création du compte administrateur...');
    
    // 1. Créer l'utilisateur dans Auth avec la clé service
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@novrh.com',
      password: 'admin123456',
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'NovRH',
        user_type: 'admin'
      }
    });

    if (authError) {
      console.error('❌ Erreur lors de la création de l\'utilisateur:', authError);
      return;
    }

    console.log('✅ Utilisateur créé:', authData.user.email);
    console.log('🆔 ID utilisateur:', authData.user.id);

    // 2. Attendre que le trigger crée le profil
    console.log('⏳ Attente de la synchronisation automatique...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 3. Vérifier que le profil existe
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) {
      console.error('❌ Erreur lors de la récupération du profil:', profileError);
      console.log('🔧 Tentative de création manuelle du profil...');
      
      // Créer le profil manuellement
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          email: 'admin@novrh.com',
          first_name: 'Admin',
          last_name: 'NovRH',
          user_type: 'admin',
          is_active: true,
          email_verified: true
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Erreur lors de la création manuelle du profil:', createError);
        return;
      }
      
      console.log('✅ Profil créé manuellement:', newProfile.email);
    } else {
      console.log('✅ Profil trouvé:', profile.email);
      
      // Mettre à jour le profil pour le rendre admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          user_type: 'admin',
          is_active: true,
          email_verified: true
        })
        .eq('user_id', authData.user.id);

      if (updateError) {
        console.error('❌ Erreur lors de la mise à jour du profil:', updateError);
      } else {
        console.log('✅ Profil mis à jour en admin');
      }
    }

    // 4. Vérifier les rôles admin
    const { data: roles, error: rolesError } = await supabase
      .from('admin_roles')
      .select('*');

    if (rolesError) {
      console.warn('⚠️ Erreur lors de la récupération des rôles:', rolesError);
    } else {
      console.log('📋 Rôles disponibles:', roles.map(r => r.name));
    }

    // 5. Créer l'entrée dans la table administrators
    const { data: adminRole, error: roleError } = await supabase
      .from('admin_roles')
      .select('id')
      .eq('name', 'super_admin')
      .single();

    if (roleError || !adminRole) {
      console.warn('⚠️ Rôle super_admin non trouvé, création...');
      
      const { data: newRole, error: createRoleError } = await supabase
        .from('admin_roles')
        .insert({
          name: 'super_admin',
          description: 'Super administrateur avec tous les privilèges',
          permissions: {
            users: ['read', 'write', 'delete'],
            companies: ['read', 'write', 'delete'],
            jobs: ['read', 'write', 'delete'],
            candidates: ['read', 'write', 'delete'],
            settings: ['read', 'write'],
            reports: ['read', 'write'],
            roles: ['read', 'write', 'delete']
          }
        })
        .select()
        .single();

      if (createRoleError) {
        console.error('❌ Erreur lors de la création du rôle:', createRoleError);
        return;
      }
      
      console.log('✅ Rôle super_admin créé');
      adminRole = newRole;
    }

    // 6. Ajouter l'utilisateur à la table administrators
    const { data: adminEntry, error: adminError } = await supabase
      .from('administrators')
      .insert({
        user_id: authData.user.id,
        role_id: adminRole.id,
        is_active: true
      })
      .select()
      .single();

    if (adminError) {
      console.error('❌ Erreur lors de la création de l\'entrée admin:', adminError);
    } else {
      console.log('✅ Entrée administrateur créée');
    }

    console.log('\n🎉 COMPTE ADMINISTRATEUR CRÉÉ AVEC SUCCÈS !');
    console.log('📧 Email:', 'admin@novrh.com');
    console.log('🔑 Mot de passe:', 'admin123456');
    console.log('🆔 ID utilisateur:', authData.user.id);
    console.log('👑 Rôle: Super Administrateur');
    console.log('\n🌐 Accès au dashboard: http://localhost:8081/admin');
    console.log('\n⚠️  IMPORTANT: Gardez ces informations en sécurité !');

  } catch (error) {
    console.error('❌ Erreur lors de la création du compte administrateur:', error);
  }
}

// Exécuter le script
createAdminAccount();
