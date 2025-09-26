import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AdminTest = () => {
  const [status, setStatus] = useState<string>('Vérification...');
  const [details, setDetails] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const steps: string[] = [];
      
      try {
        // 1. Vérifier l'utilisateur connecté
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setStatus('❌ Non connecté');
          steps.push('❌ Aucun utilisateur connecté');
          setDetails(steps);
          return;
        }
        
        steps.push(`✅ Utilisateur connecté: ${user.email}`);
        
        // 2. Vérifier le profil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('user_id', user.id)
          .single();
        
        if (profileError) {
          steps.push(`❌ Erreur profil: ${profileError.message}`);
          setStatus('❌ Erreur profil');
          setDetails(steps);
          return;
        }
        
        if (!profile) {
          steps.push('❌ Aucun profil trouvé');
          setStatus('❌ Pas de profil');
          setDetails(steps);
          return;
        }
        
        steps.push(`✅ Profil trouvé: type = ${profile.user_type}`);
        
        // 3. Vérifier si admin
        if (profile.user_type !== 'admin') {
          steps.push(`⚠️ Type utilisateur: ${profile.user_type} (pas admin)`);
          setStatus('⚠️ Pas admin');
          setDetails(steps);
          return;
        }
        
        steps.push('✅ Type utilisateur: admin');
        
        // 4. Vérifier la table administrators
        const { data: admin, error: adminError } = await supabase
          .from('administrators')
          .select('id, is_active')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();
        
        if (adminError) {
          steps.push(`❌ Erreur table administrators: ${adminError.message}`);
          setStatus('❌ Table administrators manquante');
          setDetails(steps);
          return;
        }
        
        if (!admin) {
          steps.push('❌ Pas dans la table administrators');
          setStatus('❌ Pas configuré comme admin');
          setDetails(steps);
          return;
        }
        
        steps.push('✅ Trouvé dans la table administrators');
        steps.push('🎉 Tous les tests passés !');
        setStatus('✅ Admin configuré correctement');
        setDetails(steps);
        
        // Rediriger vers admin
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
        
      } catch (error: any) {
        steps.push(`❌ Erreur générale: ${error.message}`);
        setStatus('❌ Erreur');
        setDetails(steps);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">🔍 Test Admin</h1>
        
        <div className="text-center mb-4">
          <div className="text-lg font-semibold">{status}</div>
        </div>
        
        <div className="space-y-2">
          {details.map((detail, index) => (
            <div key={index} className="text-sm p-2 bg-gray-50 rounded">
              {detail}
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => window.location.href = '/admin'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🚀 Aller directement à /admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;
