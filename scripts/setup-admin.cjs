#!/usr/bin/env node

/**
 * Script de configuration du premier administrateur NovRH
 * Usage: node scripts/setup-admin.js <email> <password>
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(' Variables d\'environnement manquantes:');
  console.error('   VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error(' Usage: node scripts/setup-admin.js <email> <password>');
    console.error('   Exemple: node scripts/setup-admin.js admin@novrh.com MonMotDePasse123!');
    process.exit(1);
  }

  const [email, password] = args;

  console.log('🚀 Configuration du premier administrateur NovRH...\n');

  try {
    // 1. Vérifier si l'utilisateur existe déjà
    console.log('📋 Vérification de l\'utilisateur existant...');
    const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserByEmail(email);
    
    let userId;
    
    if (existingUser.user) {
      console.log('✅ Utilisateur existant trouvé');
      userId = existingUser.user.id;
    } else {
      // 2. Créer un nouvel utilisateur
      console.log('👤 Création d\'un nouvel utilisateur...');
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: 'Administrateur NovRH'
        }
      });

      if (createError) {
        throw new Error(`Erreur lors de la création de l'utilisateur: ${createError.message}`);
      }

      console.log('✅ Utilisateur créé avec succès');
      userId = newUser.user.id;
    }

    // 3. Vérifier si le profil existe
    console.log('📊 Vérification du profil...');
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      // Mettre à jour le profil existant
      console.log('🔄 Mise à jour du profil existant...');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_type: 'admin' })
        .eq('user_id', userId);

      if (updateError) {
        throw new Error(`Erreur lors de la mise à jour du profil: ${updateError.message}`);
      }
    } else {
      // Créer un nouveau profil
      console.log('📝 Création d\'un nouveau profil...');
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{
          user_id: userId,
          user_type: 'admin'
        }]);

      if (insertError) {
        throw new Error(`Erreur lors de la création du profil: ${insertError.message}`);
      }
    }

    // 4. Créer l'équipe d'administration par défaut
    console.log('👥 Création de l\'équipe d\'administration...');
    const { data: team, error: teamError } = await supabase
      .from('admin_teams')
      .insert([{
        team_name: 'Équipe Principale NovRH',
        description: 'Équipe d\'administration principale de la plateforme NovRH'
      }])
      .select()
      .single();

    if (teamError) {
      if (teamError.code === '23505') { // Violation de contrainte unique
        console.log('ℹ️  Équipe d\'administration déjà existante');
      } else {
        throw new Error(`Erreur lors de la création de l'équipe: ${teamError.message}`);
      }
    } else {
      console.log('✅ Équipe d\'administration créée');
    }

    // 5. Ajouter l'utilisateur à l'équipe d'administration
    console.log('🔗 Ajout de l\'utilisateur à l\'équipe...');
    const { error: memberError } = await supabase
      .from('team_members')
      .insert([{
        team_id: team?.id || '550e8400-e29b-41d4-a716-446655440031', // ID de l'équipe par défaut
        user_id: userId,
        role: 'owner',
        permissions: {},
        is_active: true
      }]);

    if (memberError) {
      if (memberError.code === '23505') { // Violation de contrainte unique
        console.log('ℹ️  Utilisateur déjà membre de l\'équipe');
      } else {
        throw new Error(`Erreur lors de l'ajout à l'équipe: ${memberError.message}`);
      }
    } else {
      console.log('✅ Utilisateur ajouté à l\'équipe avec le rôle Owner');
    }

    // 6. Logger l'action d'administration
    console.log('📝 Journalisation de l\'action...');
    await supabase.rpc('log_admin_action', {
      action_type: 'admin_setup',
      target_type: 'user',
      target_id: userId,
      details: { email: email, role: 'owner' }
    });

    console.log('\n🎉 Configuration terminée avec succès !');
    console.log('\n📋 Récapitulatif:');
    console.log(`   👤 Email: ${email}`);
    console.log(`   🔑 Mot de passe: ${password}`);
    console.log(`   🛡️  Rôle: Administrateur Global (Owner)`);
    console.log(`   👥 Équipe: Équipe Principale NovRH`);
    console.log('\n🌐 Accès au dashboard:');
    console.log(`   URL: ${process.env.VITE_APP_URL || 'http://localhost:3000'}/admin`);
    console.log('\n⚠️  IMPORTANT:');
    console.log('   - Changez votre mot de passe après la première connexion');
    console.log('   - Activez l\'authentification à deux facteurs si possible');
    console.log('   - Sauvegardez vos identifiants dans un gestionnaire de mots de passe');

  } catch (error) {
    console.error('\n❌ Erreur lors de la configuration:');
    console.error(error.message);
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée non gérée:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  process.exit(1);
});

// Exécuter le script
setupAdmin();
