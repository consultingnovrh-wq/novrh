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
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
  // États pour les données dynamiques
  const [stats, setStats] = useState({
    cvCount: 0,
    applicationsCount: 0,
    jobsViewed: 0,
    formationsCount: 0
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [recentFormations, setRecentFormations] = useState<any[]>([]);

  // Charger les données depuis Supabase
  const loadDashboardData = async (userId: string) => {
    try {
      // Charger les stats
      const [cvResult, applicationsResult, jobsResult, formationsResult] = await Promise.all([
        // Compter les CV
        supabase
          .from('cv_uploads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // Compter les candidatures
        supabase
          .from('job_applications')
          .select('*', { count: 'exact', head: true })
          .eq('candidate_id', userId),
        
        // Compter les offres consultées (approximation - peut être amélioré avec une table de vues)
        supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active'),
        
        // Compter les formations (si table existe)
        supabase
          .from('training_enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .catch(() => ({ count: 0 })) // Si la table n'existe pas
      ]);

      setStats({
        cvCount: cvResult.count || 0,
        applicationsCount: applicationsResult.count || 0,
        jobsViewed: jobsResult.count || 0,
        formationsCount: formationsResult.count || 0
      });

      // Charger les candidatures récentes
      const { data: applicationsData } = await supabase
        .from('job_applications')
        .select(`
          *,
          job:jobs (
            id,
            title,
            company_id,
            company:companies (
              company_name
            )
          )
        `)
        .eq('candidate_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (applicationsData) {
        setRecentApplications(applicationsData.map((app: any) => ({
          id: app.id,
          position: app.job?.title || 'Offre supprimée',
          company: app.job?.company?.company_name || 'Entreprise inconnue',
          status: app.status === 'pending' ? 'En attente' : 
                  app.status === 'accepted' ? 'Acceptée' :
                  app.status === 'rejected' ? 'Refusée' : 'En cours',
          date: new Date(app.created_at).toLocaleDateString('fr-FR'),
          viewed: app.viewed_by_employer || false
        })));
      }

      // Charger les offres recommandées (offres actives récentes)
      const { data: jobsData } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies (
            company_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

      if (jobsData) {
        setRecommendedJobs(jobsData.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company?.company_name || 'Entreprise',
          location: job.location || 'Non spécifié',
          salary: job.salary_range || 'Non spécifié',
          type: job.contract_type || 'CDI',
          match: '85%' // Peut être calculé selon les compétences
        })));
      }

      // Charger les formations (si table existe)
      const { data: formationsData } = await supabase
        .from('training_enrollments')
        .select(`
          *,
          training:training_offers (
            title,
            institution:training_institutions (
              institution_name
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3)
        .catch(() => ({ data: null }));

      if (formationsData) {
        setRecentFormations(formationsData.map((enrollment: any) => ({
          id: enrollment.id,
          title: enrollment.training?.title || 'Formation',
          provider: enrollment.training?.institution?.institution_name || 'Établissement',
          progress: enrollment.progress || 0,
          status: enrollment.status === 'completed' ? 'Terminée' : 'En cours'
        })));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

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

        setUser(user);

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

        // Charger les données du dashboard
        await loadDashboardData(user.id);
      } catch (error) {
        console.error('Erreur vérification utilisateur:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [navigate]);

  // Stats dynamiques avec icônes
  const statsData = [
    { title: "CV déposé", value: stats.cvCount.toString(), icon: <FileText className="h-6 w-6" /> },
    { title: "Candidatures", value: stats.applicationsCount.toString(), icon: <Eye className="h-6 w-6" /> },
    { title: "Offres consultées", value: stats.jobsViewed.toString(), icon: <Search className="h-6 w-6" /> },
    { title: "Formations suivies", value: stats.formationsCount.toString(), icon: <BookOpen className="h-6 w-6" /> }
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
            <Button 
              className="bg-white text-green-900 hover:bg-gray-100"
              onClick={() => navigate('/add-cv')}
            >
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
            {statsData.map((stat, index) => (
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/jobs')}
                  >
                    Voir toutes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune candidature pour le moment
                    </p>
                  ) : (
                    recentApplications.map((application) => (
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
                  ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Jobs */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Offres recommandées</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/jobs')}
                  >
                    Voir toutes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedJobs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune offre recommandée pour le moment
                    </p>
                  ) : (
                    recommendedJobs.map((job) => (
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
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        Postuler
                      </Button>
                    </div>
                  ))
                  )}
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
            <Button 
              variant="outline"
              onClick={() => navigate('/formation')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Découvrir des formations
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentFormations.length === 0 ? (
              <div className="col-span-3 text-center text-muted-foreground py-8">
                Aucune formation en cours pour le moment
              </div>
            ) : (
              recentFormations.map((formation) => (
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
              ))
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/jobs')}
            >
              <CardContent className="p-6 text-center">
                <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Rechercher des offres</h3>
                <p className="text-gray-600 text-sm">Trouvez des opportunités qui correspondent à votre profil</p>
              </CardContent>
            </Card>
            
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/add-cv')}
            >
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Mettre à jour mon CV</h3>
                <p className="text-gray-600 text-sm">Gardez votre profil à jour pour plus de visibilité</p>
              </CardContent>
            </Card>
            
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/formation')}
            >
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