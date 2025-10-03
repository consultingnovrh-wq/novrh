import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserDashboard from "@/components/UserDashboard";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Building2, 
  Briefcase, 
  FileText, 
  GraduationCap,
  Settings,
  CreditCard
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        setUser(user);

        // Get user type from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          setUserType(profile.user_type);
          
          // Si l'utilisateur est admin, vérifier s'il est dans la table administrators
          if (profile.user_type === 'admin') {
            console.log('🔍 Utilisateur admin détecté, vérification de la table administrators...');
            try {
              const { data: admin, error: adminError } = await supabase
                .from('administrators')
                .select('id, is_active')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .single();
              
              console.log('📊 Résultat vérification admin:', { admin, adminError });
              
              if (admin) {
                console.log('✅ Admin trouvé, redirection vers /admin');
                navigate('/admin');
                return;
              } else {
                console.log('⚠️ Admin non trouvé dans la table administrators');
              }
            } catch (error) {
              console.error('❌ Erreur lors de la vérification admin:', error);
              // En cas d'erreur, rediriger quand même vers admin si le profil est admin
              console.log('🔄 Redirection forcée vers /admin');
              navigate('/admin');
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getDashboardTitle = () => {
    switch (userType) {
      case 'candidate':
        return 'Tableau de bord Candidat';
      case 'company':
        return 'Tableau de bord Entreprise';
      default:
        return 'Tableau de bord';
    }
  };

  const getDashboardIcon = () => {
    switch (userType) {
      case 'candidate':
        return <User className="w-6 h-6" />;
      case 'company':
        return <Building2 className="w-6 h-6" />;
      default:
        return <User className="w-6 h-6" />;
    }
  };

  const getQuickActions = () => {
    const baseActions = [
      {
        title: 'Mon Profil',
        description: 'Gérer mes informations personnelles',
        icon: <User className="w-5 h-5" />,
        href: userType === 'candidate' ? '/candidate-dashboard' : '/dashboard/company',
        color: 'bg-blue-100 text-blue-600'
      },
      {
        title: 'Abonnements',
        description: 'Gérer mes abonnements et paiements',
        icon: <CreditCard className="w-5 h-5" />,
        href: '/pricing',
        color: 'bg-green-100 text-green-600'
      }
    ];

    if (userType === 'candidate') {
      baseActions.push(
        {
          title: 'Mon CV',
          description: 'Créer ou modifier mon CV',
          icon: <FileText className="w-5 h-5" />,
          href: '/add-cv',
          color: 'bg-purple-100 text-purple-600'
        },
        {
          title: 'Formations',
          description: 'Consulter les formations disponibles',
          icon: <GraduationCap className="w-5 h-5" />,
          href: '/formation',
          color: 'bg-orange-100 text-orange-600'
        }
      );
    } else if (userType === 'company') {
      baseActions.push(
        {
          title: 'Publier une offre',
          description: 'Créer une nouvelle offre d\'emploi',
          icon: <Briefcase className="w-5 h-5" />,
          href: '/post-job',
          color: 'bg-purple-100 text-purple-600'
        },
        {
          title: 'CV Thèque',
          description: 'Consulter les CV des candidats',
          icon: <FileText className="w-5 h-5" />,
          href: '/cvtheque',
          color: 'bg-orange-100 text-orange-600'
        }
      );
    }

    return baseActions;
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getDashboardIcon()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {getDashboardTitle()}
                </h1>
                <p className="text-gray-600">
                  Bienvenue, {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getQuickActions().map((action, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {action.description}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            console.log(`🔗 Navigation vers: ${action.href}, userType: ${userType}, user:`, user);
                            navigate(action.href);
                          }}
                        >
                          Accéder
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Dashboard Content */}
          <Tabs defaultValue="subscription" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="subscription">Abonnements</TabsTrigger>
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="subscription" className="space-y-6">
              <UserDashboard />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du profil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type de compte</label>
                      <p className="text-gray-900 capitalize">{userType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date de création</label>
                      <p className="text-gray-900">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres du compte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      Changer le mot de passe
                    </Button>
                    <Button variant="outline" className="w-full">
                      Notifications
                    </Button>
                    <Button variant="outline" className="w-full">
                      Confidentialité
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
