import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp,
  Bell,
  Settings,
  Plus,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  UserCheck,
  FileText,
  BarChart3
} from "lucide-react";

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [companyName, setCompanyName] = useState("TechCorp");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const jobOffers = [
    { id: 1, title: "Développeur Frontend", status: "Active", applications: 25, views: 120, published: "2024-01-15" },
    { id: 2, title: "Chef de Projet Marketing", status: "Active", applications: 18, views: 89, published: "2024-01-12" },
    { id: 3, title: "Comptable Senior", status: "Fermée", applications: 42, views: 156, published: "2024-01-08" }
  ];

  const candidates = [
    { id: 1, name: "Marie Diallo", position: "Développeur Frontend", status: "En attente", rating: 4.5, experience: "5 ans" },
    { id: 2, name: "Amadou Ba", position: "Chef de Projet", status: "Entretien", rating: 4.2, experience: "7 ans" },
    { id: 3, name: "Fatou Seck", position: "Comptable", status: "Accepté", rating: 4.8, experience: "10 ans" }
  ];

  const services = [
    { id: 1, service: "Audit RH", consultant: "Dao Gniré Mah", status: "En cours", budget: 2500 },
    { id: 2, service: "Formation Management", specialist: "Aïssa DIN", status: "Planifié", budget: 1800 },
    { id: 3, service: "Recrutement", specialist: "NovRH Team", status: "Terminé", budget: 3200 }
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

        // Rediriger si ce n'est pas une entreprise
        if (profile.user_type !== 'company') {
          console.log('Utilisateur non-entreprise détecté, redirection...');
          switch (profile.user_type) {
            case 'admin':
              navigate('/admin');
              break;
            case 'candidate':
              navigate('/candidate-dashboard');
              break;
            default:
              navigate('/dashboard');
              break;
          }
          return;
        }

        // Récupérer les infos de l'entreprise
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('company_name')
          .eq('user_id', user.id)
          .single();

        if (!companyError && companyData) {
          setCompanyName(companyData.company_name);
        } else {
          // Fallback au profil si pas de données entreprise
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('user_id', user.id)
            .single();

          if (profileData?.first_name) {
            setCompanyName(profileData.first_name);
          }
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
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">Tableau de Bord Entreprise</h1>
              <p className="text-muted-foreground">Bonjour {companyName}, gérez vos recrutements et services RH</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications (5)
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Offre
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="jobs">Offres d'emploi</TabsTrigger>
              <TabsTrigger value="candidates">Candidats</TabsTrigger>
              <TabsTrigger value="services">Services RH</TabsTrigger>
              <TabsTrigger value="analytics">Analyses</TabsTrigger>
              <TabsTrigger value="billing">Facturation</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Offres Actives</p>
                        <p className="text-2xl font-bold">8</p>
                      </div>
                      <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Candidatures</p>
                        <p className="text-2xl font-bold">156</p>
                      </div>
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Entretiens</p>
                        <p className="text-2xl font-bold">23</p>
                      </div>
                      <Calendar className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Taux de conversion</p>
                        <p className="text-2xl font-bold">15%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Offres Récentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {jobOffers.slice(0, 3).map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">{job.title}</p>
                            <p className="text-sm text-muted-foreground">{job.applications} candidatures • {job.views} vues</p>
                          </div>
                          <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Candidats à Examiner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {candidates.filter(c => c.status === 'En attente').map((candidate) => (
                        <div key={candidate.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">{candidate.name}</p>
                              <p className="text-sm text-muted-foreground">{candidate.position}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center">
                                <span className="text-sm text-yellow-600">★</span>
                                <span className="text-sm ml-1">{candidate.rating}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{candidate.experience}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="w-3 h-3 mr-1" />
                              Voir
                            </Button>
                            <Button size="sm" className="flex-1">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Évaluer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion des Offres d'Emploi</h2>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Publier une Offre
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {jobOffers.map((job) => (
                      <div key={job.id} className="border-b last:border-b-0 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">Publié le {job.published}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                              {job.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium">Candidatures</p>
                            <p className="text-2xl font-bold text-primary">{job.applications}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Vues</p>
                            <p className="text-2xl font-bold text-muted-foreground">{job.views}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Taux</p>
                            <p className="text-2xl font-bold text-green-600">{Math.round((job.applications / job.views) * 100)}%</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir Candidatures
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Statistiques
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Candidates Tab */}
            <TabsContent value="candidates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Candidats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidates.map((candidate) => (
                      <div key={candidate.id} className="border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{candidate.name}</h3>
                            <p className="text-muted-foreground">{candidate.position}</p>
                            <p className="text-sm text-muted-foreground">Expérience: {candidate.experience}</p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={
                                candidate.status === 'Accepté' ? 'default' : 
                                candidate.status === 'Entretien' ? 'secondary' : 
                                'outline'
                              }
                            >
                              {candidate.status}
                            </Badge>
                            <div className="flex items-center mt-2">
                              <span className="text-sm text-yellow-600">★</span>
                              <span className="text-sm ml-1">{candidate.rating}/5</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir CV
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            Planifier Entretien
                          </Button>
                          <Button size="sm">
                            <UserCheck className="w-4 h-4 mr-2" />
                            Évaluer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Services RH</h2>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Demander un Service
                </Button>
              </div>
              
              <Card>
                <CardContent>
                  <div className="space-y-6">
                    {services.map((service) => (
                      <div key={service.id} className="border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{service.service}</h3>
                            <p className="text-muted-foreground">Consultant: {service.consultant}</p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={
                                service.status === 'Terminé' ? 'default' : 
                                service.status === 'En cours' ? 'secondary' : 
                                'outline'
                              }
                            >
                              {service.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-2">Budget: {service.budget}€</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            Planning
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Analyses et Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Performance des Offres</h3>
                      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Graphique des performances à venir</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Sources de Candidatures</h3>
                      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Graphique des sources à venir</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Facturation et Paiements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Factures en attente</p>
                        <p className="text-2xl font-bold text-orange-600">2,450€</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Payé ce mois</p>
                        <p className="text-2xl font-bold text-green-600">5,800€</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Total annuel</p>
                        <p className="text-2xl font-bold text-primary">45,600€</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Factures Récentes</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">Facture #2024-001</p>
                          <p className="text-sm text-muted-foreground">Service de recrutement - Janvier 2024</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">2,450€</p>
                          <Badge variant="outline" className="text-orange-600 border-orange-600">En attente</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">Facture #2023-012</p>
                          <p className="text-sm text-muted-foreground">Audit RH - Décembre 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">1,800€</p>
                          <Badge variant="default" className="bg-green-600">Payé</Badge>
                        </div>
                      </div>
                    </div>
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

export default CompanyDashboard;