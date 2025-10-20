import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Clock, CheckCircle, XCircle, Plus, Search, BookOpen } from "lucide-react";

const CandidateDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const stats = [
    { title: "CV déposé", value: "1", icon: <FileText className="h-6 w-6" /> },
    { title: "Candidatures", value: "8", icon: <Eye className="h-6 w-6" /> },
    { title: "Offres consultées", value: "24", icon: <Search className="h-6 w-6" /> },
    { title: "Formations suivies", value: "3", icon: <BookOpen className="h-6 w-6" /> }
  ];

  const recentApplications = [
    {
      id: 1,
      position: "Développeur Full Stack",
      company: "TechSolutions Mali",
      status: "En attente",
      date: "2024-01-20",
      viewed: true
    },
    {
      id: 2,
      position: "Chef de Projet RH",
      company: "AgroFinance Sénégal",
      status: "En cours",
      date: "2024-01-18",
      viewed: true
    },
    {
      id: 3,
      position: "Comptable Senior",
      company: "GreenEnergy Côte d'Ivoire",
      status: "Refusée",
      date: "2024-01-15",
      viewed: false
    },
    {
      id: 4,
      position: "Analyste RH",
      company: "HealthCare Burkina",
      status: "Acceptée",
      date: "2024-01-12",
      viewed: true
    }
  ];

  // Vérifier l'authentification et le type d'utilisateur
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        setLoading(true);
        
        // Récupérer l'utilisateur actuel
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          navigate('/login');
          return;
        }

        // Vérifier le type d'utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('user_id', user.id)
          .single();

        if (profileError || !profile) {
          console.error('Erreur récupération profil:', profileError);
          navigate('/login');
          return;
        }

        // Rediriger si ce n'est pas un candidat
        if (profile.user_type !== 'candidate') {
          console.log('Utilisateur non-candidat détecté, redirection...');
          switch (profile.user_type) {
            case 'admin':
              navigate('/admin');
              break;
            case 'company':
              navigate('/dashboard/company');
              break;
            default:
              navigate('/dashboard');
              break;
          }
          return;
        }
      } catch (error) {
        console.error('Erreur vérification utilisateur:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [navigate]);

  const recommendedJobs = [
    {
      id: 1,
      title: "Développeur React",
      company: "TechSolutions Mali",
      location: "Bamako, Mali",
      salary: "800,000 - 1,200,000 FCFA",
      type: "CDI",
      match: "95%"
    },
    {
      id: 2,
      title: "Chef de Projet Digital",
      company: "AgroFinance Sénégal",
      location: "Dakar, Sénégal",
      salary: "1,500,000 - 2,000,000 FCFA",
      type: "CDI",
      match: "87%"
    },
    {
      id: 3,
      title: "Analyste Financier",
      company: "GreenEnergy Côte d'Ivoire",
      location: "Abidjan, Côte d'Ivoire",
      salary: "1,200,000 - 1,800,000 FCFA",
      type: "CDD",
      match: "82%"
    }
  ];

  const recentFormations = [
    {
      id: 1,
      title: "Gestion des Ressources Humaines",
      provider: "Institut de Formation RH",
      progress: 75,
      status: "En cours"
    },
    {
      id: 2,
      title: "Droit du Travail Africain",
      provider: "Centre Juridique Panafricain",
      progress: 100,
      status: "Terminée"
    },
    {
      id: 3,
      title: "Recrutement et Sélection",
      provider: "Académie du Recrutement",
      progress: 30,
      status: "En cours"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Dashboard Header */}
      <section className="pt-24 pb-8 bg-gradient-to-r from-green-900 to-green-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Espace Candidat</h1>
              <p className="text-green-100">Gérez vos candidatures et développez vos compétences</p>
            </div>
            <Button className="bg-white text-green-900 hover:bg-gray-100">
              <Plus className="h-4 w-4 mr-2" />
              Mettre à jour mon CV
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="text-green-600">
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Mes candidatures récentes</CardTitle>
                  <Button variant="outline" size="sm">
                    Voir toutes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{application.position}</h4>
                        <p className="text-sm text-gray-600">{application.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            application.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                            application.status === 'Acceptée' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {application.status}
                          </span>
                          <span>{application.date}</span>
                          {application.viewed && (
                            <span className="text-green-600">✓ Vue</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Jobs */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Offres recommandées</CardTitle>
                  <Button variant="outline" size="sm">
                    Voir toutes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{job.title}</h4>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                          {job.match} match
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>{job.location}</span>
                        <span>{job.salary}</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {job.type}
                        </span>
                      </div>
                      <Button size="sm" className="w-full">
                        Postuler
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Formations */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Mes formations</h2>
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Découvrir des formations
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentFormations.map((formation) => (
              <Card key={formation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{formation.title}</CardTitle>
                  <CardDescription>{formation.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progression</span>
                        <span>{formation.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${formation.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        formation.status === 'Terminée' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {formation.status}
                      </span>
                      <Button size="sm" variant="outline">
                        Continuer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Rechercher des offres</h3>
                <p className="text-gray-600 text-sm">Trouvez des opportunités qui correspondent à votre profil</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Mettre à jour mon CV</h3>
                <p className="text-gray-600 text-sm">Gardez votre profil à jour pour plus de visibilité</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Formations</h3>
                <p className="text-gray-600 text-sm">Développez vos compétences avec nos formations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CandidateDashboard;