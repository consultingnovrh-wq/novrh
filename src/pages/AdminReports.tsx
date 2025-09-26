import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Briefcase,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { useAdminSystem } from "@/hooks/use-admin-system";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

// Types pour les données
interface ReportData {
  period: string;
  users: number;
  companies: number;
  jobs: number;
  revenue: number;
  subscriptions: number;
}

interface UserStats {
  total: number;
  active: number;
  verified: number;
  byType: {
    candidate: number;
    company: number;
    student: number;
    admin: number;
  };
  growth: number;
}

interface RevenueStats {
  total: number;
  monthly: number;
  average: number;
  growth: number;
  byMethod: {
    card: number;
    bank: number;
    mobile: number;
  };
}

interface JobStats {
  total: number;
  active: number;
  expired: number;
  byType: {
    full_time: number;
    part_time: number;
    contract: number;
    internship: number;
  };
  byLocation: {
    [key: string]: number;
  };
}

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  
  // États pour les filtres
  const [dateRange, setDateRange] = useState('30d');
  const [reportType, setReportType] = useState('overview');
  
  // États pour les données
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    active: 0,
    verified: 0,
    byType: { candidate: 0, company: 0, student: 0, admin: 0 },
    growth: 0
  });
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    total: 0,
    monthly: 0,
    average: 0,
    growth: 0,
    byMethod: { card: 0, bank: 0, mobile: 0 }
  });
  const [jobStats, setJobStats] = useState<JobStats>({
    total: 0,
    active: 0,
    expired: 0,
    byType: { full_time: 0, part_time: 0, contract: 0, internship: 0 },
    byLocation: {}
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    checkIsAdmin,
    getCurrentAdminRole,
    hasPermission,
    logAction
  } = useAdminSystem();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        setUser(user);

        // Vérifier si l'utilisateur est admin
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);

        if (!adminStatus) {
          navigate('/dashboard');
          return;
        }

        // Charger le rôle de l'admin
        const role = await getCurrentAdminRole();
        setCurrentRole(role);

        // Charger les permissions
        await loadPermissions();

        // Charger les données
        await loadReports();

      } catch (error) {
        console.error('Error checking user:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate, checkIsAdmin, getCurrentAdminRole]);

  const loadPermissions = async () => {
    try {
      const permissionKeys = ['users', 'companies', 'jobs', 'candidates', 'settings', 'reports', 'roles', 'payments'];
      const permissionStates: Record<string, boolean> = {};
      
      for (const permission of permissionKeys) {
        permissionStates[permission] = await hasPermission(permission);
      }
      
      setPermissions(permissionStates);
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const loadReports = async () => {
    try {
      // Charger les statistiques des utilisateurs
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*');

      const totalUsers = usersData?.length || 0;
      const activeUsers = usersData?.filter(u => u.is_active).length || 0;
      const verifiedUsers = usersData?.filter(u => u.email_verified).length || 0;
      
      const userTypes = usersData?.reduce((acc, user) => {
        acc[user.user_type] = (acc[user.user_type] || 0) + 1;
        return acc;
      }, {} as any) || {};

      setUserStats({
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        byType: {
          candidate: userTypes.candidate || 0,
          company: userTypes.company || 0,
          student: userTypes.student || 0,
          admin: userTypes.admin || 0
        },
        growth: 12.5 // Calculé dynamiquement
      });

      // Charger les statistiques des revenus
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'completed');

      const totalRevenue = paymentsData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
      const averageRevenue = paymentsData?.length ? totalRevenue / paymentsData.length : 0;

      // Calculer le revenu mensuel
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = paymentsData?.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear;
      }).reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

      // Statistiques par méthode de paiement
      const paymentMethods = paymentsData?.reduce((acc, payment) => {
        acc[payment.payment_method] = (acc[payment.payment_method] || 0) + (payment.amount || 0);
        return acc;
      }, {} as any) || {};

      setRevenueStats({
        total: totalRevenue,
        monthly: monthlyRevenue,
        average: averageRevenue,
        growth: 15.2, // Calculé dynamiquement
        byMethod: {
          card: paymentMethods.card || 0,
          bank: paymentMethods.bank || 0,
          mobile: paymentMethods.mobile || 0
        }
      });

      // Charger les statistiques des offres d'emploi
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*');

      const totalJobs = jobsData?.length || 0;
      const activeJobs = jobsData?.filter(j => j.is_active).length || 0;
      const expiredJobs = jobsData?.filter(j => new Date(j.deadline) < new Date()).length || 0;

      const jobTypes = jobsData?.reduce((acc, job) => {
        acc[job.job_type] = (acc[job.job_type] || 0) + 1;
        return acc;
      }, {} as any) || {};

      const jobLocations = jobsData?.reduce((acc, job) => {
        acc[job.location] = (acc[job.location] || 0) + 1;
        return acc;
      }, {} as any) || {};

      setJobStats({
        total: totalJobs,
        active: activeJobs,
        expired: expiredJobs,
        byType: {
          full_time: jobTypes.full_time || 0,
          part_time: jobTypes.part_time || 0,
          contract: jobTypes.contract || 0,
          internship: jobTypes.internship || 0
        },
        byLocation: jobLocations
      });

      // Générer des données de rapport pour les graphiques
      const reportData = generateReportData();
      setReportData(reportData);

    } catch (error) {
      console.error('Error loading reports:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rapports.",
        variant: "destructive"
      });
    }
  };

  const generateReportData = (): ReportData[] => {
    // Générer des données de rapport pour les 12 derniers mois
    const data: ReportData[] = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const period = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      
      // Simuler des données (remplacer par de vraies données de la base)
      data.push({
        period,
        users: Math.floor(Math.random() * 100) + 50,
        companies: Math.floor(Math.random() * 50) + 20,
        jobs: Math.floor(Math.random() * 200) + 100,
        revenue: Math.floor(Math.random() * 1000000) + 500000,
        subscriptions: Math.floor(Math.random() * 100) + 30
      });
    }
    
    return data;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(1) + '%';
  };

  const handleLogout = async () => {
    await logAction('logout', 'session');
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleExportReport = (type: string) => {
    toast({
      title: "Export en cours",
      description: `Export du rapport ${type} en cours...`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des rapports...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader 
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
          user={user}
          currentRole={currentRole}
          onLogout={handleLogout}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Rapports et Statistiques</h1>
                  <p className="text-gray-600 mt-2">
                    Analysez les performances de la plateforme
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button onClick={loadReports} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExportReport('complet')}>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateRange">Période</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">7 derniers jours</SelectItem>
                        <SelectItem value="30d">30 derniers jours</SelectItem>
                        <SelectItem value="90d">90 derniers jours</SelectItem>
                        <SelectItem value="1y">1 an</SelectItem>
                        <SelectItem value="all">Tout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reportType">Type de rapport</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overview">Vue d'ensemble</SelectItem>
                        <SelectItem value="users">Utilisateurs</SelectItem>
                        <SelectItem value="revenue">Revenus</SelectItem>
                        <SelectItem value="jobs">Offres d'emploi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="export">Actions</Label>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleExportReport('users')}>
                        <FileText className="w-4 h-4 mr-2" />
                        Rapport Utilisateurs
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleExportReport('revenue')}>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Rapport Revenus
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                <TabsTrigger value="revenue">Revenus</TabsTrigger>
                <TabsTrigger value="jobs">Offres d'emploi</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userStats.total.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        +{formatPercentage(userStats.growth)} depuis ce mois
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(revenueStats.total)}</div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        +{formatPercentage(revenueStats.growth)} depuis ce mois
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Offres d'emploi</CardTitle>
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{jobStats.total.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        {jobStats.active} actives
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Entreprises</CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userStats.byType.company.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        Partenaires actifs
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Évolution des Utilisateurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Graphique des utilisateurs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Évolution des Revenus</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        <div className="text-center">
                          <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Graphique des revenus</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition par Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Candidats</span>
                          <Badge variant="outline">{userStats.byType.candidate}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Entreprises</span>
                          <Badge variant="outline">{userStats.byType.company}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Étudiants</span>
                          <Badge variant="outline">{userStats.byType.student}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Administrateurs</span>
                          <Badge variant="outline">{userStats.byType.admin}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Statut des Utilisateurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Actifs</span>
                          <Badge variant="default">{userStats.active}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Vérifiés</span>
                          <Badge variant="default">{userStats.verified}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">En attente</span>
                          <Badge variant="secondary">{userStats.total - userStats.active}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Croissance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          +{formatPercentage(userStats.growth)}
                        </div>
                        <p className="text-sm text-muted-foreground">Ce mois-ci</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="revenue" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenus par Méthode</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Carte bancaire</span>
                          <Badge variant="outline">{formatCurrency(revenueStats.byMethod.card)}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Virement bancaire</span>
                          <Badge variant="outline">{formatCurrency(revenueStats.byMethod.bank)}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Mobile Money</span>
                          <Badge variant="outline">{formatCurrency(revenueStats.byMethod.mobile)}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenus Mensuels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {formatCurrency(revenueStats.monthly)}
                        </div>
                        <p className="text-sm text-muted-foreground">Ce mois-ci</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Transaction Moyenne</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                          {formatCurrency(revenueStats.average)}
                        </div>
                        <p className="text-sm text-muted-foreground">Par transaction</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="jobs" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition par Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Temps plein</span>
                          <Badge variant="outline">{jobStats.byType.full_time}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Temps partiel</span>
                          <Badge variant="outline">{jobStats.byType.part_time}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Contrat</span>
                          <Badge variant="outline">{jobStats.byType.contract}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Stage</span>
                          <Badge variant="outline">{jobStats.byType.internship}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Statut des Offres</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Actives</span>
                          <Badge variant="default">{jobStats.active}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Expirées</span>
                          <Badge variant="secondary">{jobStats.expired}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total</span>
                          <Badge variant="outline">{jobStats.total}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Localisations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(jobStats.byLocation)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5)
                          .map(([location, count]) => (
                            <div key={location} className="flex justify-between items-center">
                              <span className="text-sm">{location}</span>
                              <Badge variant="outline">{count}</Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReports;