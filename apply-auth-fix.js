// Script pour appliquer la correction d'authentification
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dsxkfzqqgghwqiihierm.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeGtmenFxZ2dod3FpaWhpZXJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkwNzAyMSwiZXhwIjoyMDc0NDgzMDIxfQ.uPw8Jjnaj6QI25wlwQt9C0wPHj90W0nPcUNOvthC-RY";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD_TO_TEST || process.env.ADMIN_INITIAL_PASSWORD || "").trim();

async function applyAuthFix() {
  try {
    console.log('🔧 Application de la correction d\'authentification...\n');
    
    // 1. Supprimer les politiques RLS problématiques
    console.log('🗑️ Suppression des politiques RLS problématiques...');
    
    const policiesToDrop = [
      'Admins can view all profiles',
      'Admins can update all profiles', 
      'Users can view their own profile',
      'Users can update their own profile',
      'Allow profile creation during registration'
    ];
    
    for (const policy of policiesToDrop) {
      try {
        await supabase.rpc('exec_sql', { 
          sql: `DROP POLICY IF EXISTS "${policy}" ON public.profiles;` 
        });
        console.log(`✅ Politique "${policy}" supprimée`);
      } catch (error) {
        console.log(`⚠️ Politique "${policy}" non trouvée ou déjà supprimée`);
      }
    }
    
    // 2. Désactiver temporairement RLS
    console.log('\n🔓 Désactivation temporaire de RLS...');
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;' 
    });
    console.log('✅ RLS désactivé sur profiles');
    
    // 3. Réactiver RLS avec des politiques permissives
    console.log('\n🔒 Réactivation de RLS avec des politiques permissives...');
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;' 
    });
    
    // 4. Créer des politiques permissives
    const newPolicies = [
      {
        name: 'Anyone can view profiles',
        sql: `CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);`
      },
      {
        name: 'Users can update their own profile',
        sql: `CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);`
      },
      {
        name: 'Allow profile creation',
        sql: `CREATE POLICY "Allow profile creation" ON public.profiles FOR INSERT WITH CHECK (true);`
      }
    ];
    
    for (const policy of newPolicies) {
      try {
        await supabase.rpc('exec_sql', { sql: policy.sql });
        console.log(`✅ Politique "${policy.name}" créée`);
      } catch (error) {
        console.error(`❌ Erreur création politique "${policy.name}":`, error.message);
      }
    }
    
    // 5. Vérifier l'état du compte admin
    console.log('\n🔍 Vérification du compte admin...');
    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', '646e81ca-b467-41c3-a376-ab57347131d9')
      .single();
    
    if (profileError) {
      console.error('❌ Erreur lors de la récupération du profil admin:', profileError);
    } else {
      console.log('✅ Profil admin trouvé:');
      console.log(`   Email: ${adminProfile.email}`);
      console.log(`   Type: ${adminProfile.user_type}`);
      console.log(`   Actif: ${adminProfile.is_active}`);
    }
    
    // 6. Test de connexion
    if (!ADMIN_PASSWORD) {
      console.warn('\n⚠️ ADMIN_PASSWORD_TO_TEST non défini. Test de connexion ignoré.');
    } else {
      console.log('\n🧪 Test de connexion...');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@novrh.com',
        password: ADMIN_PASSWORD
      });

      if (authError) {
        console.error('❌ Erreur de connexion:', authError.message);
        console.log('\n🔧 La correction n\'a pas résolu le problème.');
        console.log('💡 Essayez de redémarrer le serveur de développement.');
      } else {
        console.log('✅ Connexion réussie!');
        console.log(`   Utilisateur: ${authData.user.email}`);
        console.log(`   ID: ${authData.user.id}`);
        console.log('\n🎉 CORRECTION APPLIQUÉE AVEC SUCCÈS !');
        console.log('🌐 Vous pouvez maintenant accéder à: http://localhost:8081/admin');
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'application de la correction:', error);
    console.log('\n💡 Solution alternative:');
    console.log('1. Ouvrez Supabase Dashboard → SQL Editor');
    console.log('2. Copiez le contenu de supabase/migrations/20250117000009-fix-auth-rls.sql');
    console.log('3. Exécutez le script manuellement');
  }
}

// Exécuter le script
applyAuthFix();
