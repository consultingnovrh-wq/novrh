// Script pour créer un compte administrateur
// Utilisez ce script après avoir créé la base de données

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dsxkfzqqgghwqiihierm.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeGtmenFxZ2dod3FpaWhpZXJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkwNzAyMSwiZXhwIjoyMDc0NDgzMDIxfQ.uPw8Jjnaj6QI25wlwQt9C0wPHj90W0nPcUNOvthC-RY";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const generateSecurePassword = () => {
  const randomPart = Math.random().toString(36).slice(-8);
  return `NovRH-${Date.now().toString(36)}-${randomPart}!`;
};

const ADMIN_PASSWORD = (process.env.ADMIN_INITIAL_PASSWORD || "").trim() || generateSecurePassword();

async function createAdminAccount() {
  try {
    console.log('🚀 Création du compte administrateur...');
    
    // 1. Créer l'utilisateur dans Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@novrh.com',
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'NovRH'
      }
    });

    if (authError) {
      console.error('❌ Erreur lors de la création de l\'utilisateur:', authError);
      return;
    }

    console.log('✅ Utilisateur créé:', authData.user.email);

    // 2. Attendre que le trigger crée le profil
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Vérifier que le profil existe
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) {
      console.error('❌ Erreur lors de la récupération du profil:', profileError);
      return;
    }

    console.log('✅ Profil trouvé:', profile.email);

    // 4. Mettre à jour le profil pour le rendre admin
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
      return;
    }

    // 5. Récupérer le rôle super_admin
    const { data: role, error: roleError } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('name', 'super_admin')
      .single();

    if (roleError) {
      console.error('❌ Erreur lors de la récupération du rôle:', roleError);
      return;
    }

    // 6. Créer l'entrée dans la table administrators
    const { error: adminError } = await supabase
      .from('administrators')
      .insert({
        user_id: authData.user.id,
        role_id: role.id,
        is_active: true
      });

    if (adminError) {
      console.error('❌ Erreur lors de la création de l\'administrateur:', adminError);
      return;
    }

    console.log('🎉 Compte administrateur créé avec succès!');
    console.log('📧 Email: admin@novrh.com');
    console.log('🔑 Mot de passe:', ADMIN_PASSWORD);
    console.log('👑 Rôle: Super Administrateur');
    console.log('');
    console.log('🌐 Vous pouvez maintenant vous connecter au dashboard admin:');
    console.log('   http://localhost:8082/admin');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le script
createAdminAccount();