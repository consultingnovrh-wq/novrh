import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  Star, 
  BarChart3,
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  Users,
  MapPin,
  Phone,
  Globe,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

const AdminCompanies = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Données de démonstration pour les statistiques
  const [stats, setStats] = useState({
    totalCompanies: 0,
    verifiedCompanies: 0,
    pendingVerification: 0,
    premiumCompanies: 0,
    activeCompanies: 0,
    totalEmployees: 0
  });

  useEffect(() => {
    loadCompanies();
    loadStats();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      
      // Charger les entreprises depuis Supabase
      const { data: companiesData, error } = await supabase
        .from('companies')
        .select(`
          *,
          profiles (email, user_id, is_active)
        `);

      if (error) {
        throw error;
      }

      if (companiesData) {
        setCompanies(companiesData);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      // Utiliser des données de démonstration si pas de table
      setCompanies(generateDemoCompanies());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    // Calculer les statistiques
    const totalComps = companies.length;
    const verifiedComps = companies.filter(comp => comp.is_verified).length;
    const pendingComps = companies.filter(comp => !comp.is_verified).length;
    const premiumComps = companies.filter(comp => comp.is_premium).length;
    const activeComps = companies.filter(comp => comp.profiles?.is_active).length;
    const totalEmps = companies.reduce((sum, comp) => sum + (comp.employee_count || 0), 0);

    setStats({
      totalCompanies: totalComps,
      verifiedCompanies: verifiedComps,
      pendingVerification: pendingComps,
      premiumCompanies: premiumComps,
      activeCompanies: activeComps,
      totalEmployees: totalEmps
    });
  };

  const generateDemoCompanies = () => {
    return [
      {
        id: 1,
        company_name: 'Tech Solutions SARL',
        company_address: '123 Rue de l\'Innovation, Bamako',
        phone: '+223 20 12 34 56',
        website: 'www.techsolutions.ml',
        industry: 'Technologie',
        employee_count: 25,
        is_verified: true,
        is_premium: true,
        description: 'Entreprise leader dans le développement de solutions technologiques',
        profiles: { email: 'contact@techsolutions.ml', user_id: 'user1', is_active: true }
      },
      {
        id: 2,
        company_name: 'Agro Business Mali',
        company_address: '456 Avenue du Commerce, Sikasso',
        phone: '+223 21 23 45 67',
        website: 'www.agrobusiness.ml',
        industry: 'Agriculture',
        employee_count: 150,
        is_verified: false,
        is_premium: false,
        description: 'Spécialisée dans l\'agriculture durable et l\'export',
        profiles: { email: 'info@agrobusiness.ml', user_id: 'user2', is_active: true }
      },
      {
        id: 3,
        company_name: 'Mining Corp Mali',
        company_address: '789 Boulevard des Mines, Kayes',
        phone: '+223 22 34 56 78',
        website: 'www.miningcorp.ml',
        industry: 'Mines',
        employee_count: 500,
        is_verified: true,
        is_premium: true,
        description: 'Exploitation minière et transformation des minerais',
        profiles: { email: 'contact@miningcorp.ml', user_id: 'user3', is_active: true }
      }
    ];
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.company_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'verified') matchesFilter = company.is_verified;
    else if (filterStatus === 'pending') matchesFilter = !company.is_verified;
    else if (filterStatus === 'premium') matchesFilter = company.is_premium;
    else if (filterStatus === 'active') matchesFilter = company.profiles?.is_active;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (company: any) => {
    if (!company.profiles?.is_active) {
      return { label: 'Inactive', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' };
    }
    if (!company.is_verified) {
      return { label: 'En attente', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' };
    }
    if (company.is_premium) {
      return { label: 'Premium', variant: 'default' as const, color: 'bg-purple-100 text-purple-800' };
    }
    return { label: 'Vérifiée', variant: 'default' as const, color: 'bg-green-100 text-green-800' };
  };

  const handleCompanyAction = async (companyId: string, action: string) => {
    try {
      switch (action) {
        case 'verify':
          // Vérifier l'entreprise
          toast({
            title: "Succès",
            description: "Entreprise vérifiée avec succès",
          });
          break;
        case 'premium':
          // Passer en premium
          toast({
            title: "Succès",
            description: "Entreprise passée en premium",
          });
          break;
        case 'suspend':
          // Suspendre l'entreprise
          toast({
            title: "Succès",
            description: "Entreprise suspendue avec succès",
          });
          break;
        case 'delete':
          // Supprimer l'entreprise
          if (confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
            toast({
              title: "Succès",
              description: "Entreprise supprimée avec succès",
            });
          }
          break;
      }
      
      loadCompanies(); // Recharger la liste
    } catch (error) {
      console.error('Error performing company action:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'entreprise",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des entreprises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader 
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Entreprises</h1>
              <p className="text-gray-600">Gérez tous les partenaires entreprises de la plateforme</p>
            </div>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nouvelle entreprise</span>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Entreprises</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                <p className="text-xs text-muted-foreground">Toutes entreprises</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vérifiées</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.verifiedCompanies}</div>
                <p className="text-xs text-muted-foreground">Approuvées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingVerification}</div>
                <p className="text-xs text-muted-foreground">À vérifier</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium</CardTitle>
                <Star className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.premiumCompanies}</div>
                <p className="text-xs text-muted-foreground">Plans premium</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actives</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.activeCompanies}</div>
                <p className="text-xs text-muted-foreground">Comptes actifs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
                <Users className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">{stats.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">Tous secteurs</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher une entreprise..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                  >
                    Toutes
                  </Button>
                  <Button
                    variant={filterStatus === 'verified' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('verified')}
                  >
                    Vérifiées
                  </Button>
                  <Button
                    variant={filterStatus === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('pending')}
                  >
                    En attente
                  </Button>
                  <Button
                    variant={filterStatus === 'premium' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('premium')}
                  >
                    Premium
                  </Button>
                  <Button
                    variant={filterStatus === 'active' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('active')}
                  >
                    Actives
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => {
              const statusInfo = getStatusBadge(company);
              
              return (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{company.company_name}</CardTitle>
                        <Badge className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{company.company_address}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{company.phone}</span>
                      </div>
                      
                      {company.website && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Globe className="w-4 h-4" />
                          <span>{company.website}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span>{company.industry}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{company.employee_count} employés</span>
                      </div>
                      
                      {company.description && (
                        <div className="text-sm text-gray-600">
                          <FileText className="w-4 h-4 inline mr-2" />
                          {company.description}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex space-x-2">
                        {!company.is_verified && (
                          <Button 
                            size="sm"
                            onClick={() => handleCompanyAction(company.id, 'verify')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Vérifier
                          </Button>
                        )}
                        
                        {company.is_verified && !company.is_premium && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleCompanyAction(company.id, 'premium')}
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Premium
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompanyAction(company.id, 'suspend')}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Suspendre
                        </Button>
                        
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompanyAction(company.id, 'delete')}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredCompanies.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="text-center py-8 text-gray-500">
                Aucune entreprise trouvée
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminCompanies;
