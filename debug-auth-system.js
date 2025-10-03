// Script de diagnostic complet du système d'authentification
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dsxkfzqqgghwqiihierm.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeGtmenFxZ2dod3FpaWhpZXJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkwNzAyMSwiZXhwIjoyMDc0NDgzMDIxfQ.uPw8Jjnaj6QI25wlwQt9C0wPHj90W0nPcUNOvthC-RY";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function debugAuthSystem() {
  try {
    console.log('🔍 DIAGNOSTIC COMPLET DU SYSTÈME D\'AUTHENTIFICATION\n');
    
    // 1. Vérifier les utilisateurs auth.users
    console.log('📊 1. UTILISATEURS AUTH.USERS:');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Erreur auth.users:', usersError);
    } else {
      console.log(`   Total: ${users.users.length} utilisateurs`);
      users.users.forEach(user => {
        console.log(`   - ${user.email} (${user.id})`);
        console.log(`     Créé: ${user.created_at}`);
        console.log(`     Email confirmé: ${user.email_confirmed_at ? '✅' : '❌'}`);
        console.log(`     Métadonnées: ${JSON.stringify(user.user_metadata)}`);
        console.log('');
      });
    }
    
    // 2. Vérifier les profils
    console.log('📊 2. TABLE PROFILES:');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Erreur profiles:', profilesError);
    } else {
      console.log(`   Total: ${profiles.length} profils`);
      profiles.forEach(profile => {
        console.log(`   - ${profile.email} (${profile.user_id})`);
        console.log(`     Type: ${profile.user_type}`);
        console.log(`     Actif: ${profile.is_active}`);
        console.log(`     Email vérifié: ${profile.email_verified}`);
        console.log('');
      });
    }
    
    // 3. Vérifier les candidats
    console.log('📊 3. TABLE CANDIDATES:');
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('*');
    
    if (candidatesError) {
      console.error('❌ Erreur candidates:', candidatesError);
    } else {
      console.log(`   Total: ${candidates.length} candidats`);
      candidates.forEach(candidate => {
        console.log(`   - ${candidate.first_name} ${candidate.last_name} (${candidate.user_id})`);
        console.log('');
      });
    }
    
    // 4. Vérifier les entreprises
    console.log('📊 4. TABLE COMPANIES:');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*');
    
    if (companiesError) {
      console.error('❌ Erreur companies:', companiesError);
    } else {
      console.log(`   Total: ${companies.length} entreprises`);
      companies.forEach(company => {
        console.log(`   - ${company.company_name} (${company.user_id})`);
        console.log('');
      });
    }
    
    // 5. Diagnostiquer la synchronisation
    console.log('📊 5. DIAGNOSTIC SYNCHRONISATION:');
    const profilesUsersIds = profiles.map(p => p.user_id);
    const authUsersIds = users.users.map(u => u.id);
    
    const unsyncedProfiles = authUsersIds.filter(authId => !profilesUsersIds.includes(authId));
    const unsyncedAuth = profilesUsersIds.filter(profileId => !authUsersIds.includes(profileId));
    
    if (unsyncedProfiles.length > 0) {
      console.log(`❌ ${unsyncedProfiles.length} présents dans auth.users mais pas dans profiles:`);
      unsyncedProfiles.forEach(id => {
        const user = users.users.find(u => u.id === id);
        console.log(`   - ${user?.email || 'Unknown'} (${id})`);
      });
    }
    
    if (unsyncedAuth.length > 0) {
      console.log(`❌ ${unsyncedAuth.length} présents dans profiles mais pas dans auth.users:`);
      unsyncedAuth.forEach(id => {
        const profile = profiles.find(p => p.user_id === id);
        console.log(`   - ${profile?.email || 'Unknown'} (${id})`);
      });
    }
    
    if (unsyncedProfiles.length === 0 && unsyncedAuth.length === 0) {
      console.log('✅ Synchronisation auth.users ↔ profiles OK');
    }
    
    // 6. Vérifier que les candidats sont sync avec profiles
    const candidateInProfiles = profiles.filter(p => p.user_type === 'candidate');
    const candidateInAuth = users.users.filter(u => 
      u.user_metadata?.user_type === 'candidate' || 
      !u.user_metadata?.user_type && u.email !== 'admin@novrh.com'
    );
    
    console.log(`📊 Candidats dans profiles: ${candidateInProfiles.length}`);
    console.log(`📊 Candidats attendus: ${candidateInAuth.length}`);
    console.log(`📊 Candidats dans table candidates: ${candidates.length}`);
    
    if (candidates.length === 0 && candidateInProfiles.length > 0) {
      console.log('⚠️ Candidats manquants dans la table candidates');
    }
    
    // 7. Résumé des problèmes
    console.log('\n📋 RÉSUMÉ DES PROBLÈMES:');
    
    if (unsyncedProfiles.length > 0) {
      console.log(`❌ Synchronisation profiles manquante: ${unsyncedProfiles.length} utilisateurs`);
    }
    
    if (candidates.length === 0 && candidateInProfiles.length > 0) {
      console.log('❌ Table candidates vide malgré les profils candidats');
    }
    
    if (companies.length === 0) {
      console.log('ℹ️ Table companies vide (normal si aucune entreprise)');
    }
    
    // 8. Suggestions de corrections
    console.log('\n💡 CORRECTIONS SUGGÉRÉES:');
    
    if (unsyncedProfiles.length > 0) {
      console.log('1. Synchroniser les profils manquants');
    }
    
    if (candidates.length === 0 && candidateInProfiles.length > 0) {
      console.log('2. Créer les entrées candidates manquantes');
    }
    
    console.log('3. Vérifier les politiques RLS');
    console.log('4. Configurer les emails SMTP');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le diagnostic
debugAuthSystem();
