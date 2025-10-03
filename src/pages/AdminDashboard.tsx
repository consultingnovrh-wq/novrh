import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Building2, 
  Settings, 
  Shield, 
  Activity,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Crown,
  Star,
  User,
  Briefcase,
  GraduationCap,
  BarChart3,
  Bell,
  Globe,
  Database,
  History,
  UserCog,
  Key,
  Home,
  ShoppingCart,
  DollarSign,
  Truck,
  LogOut,
  ChevronDown,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Filter,
  Download,
  Upload,
  Search,
  MoreHorizontal
} from "lucide-react";
import { useAdminSystem, AdminRole, Administrator, AdminLog, SystemSetting } from "@/hooks/use-admin-system";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

// Types pour les données
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'candidate' | 'company' | 'admin' | 'student';
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: string;
  user_id: string;
  company_name: string;
  company_address: string;
  nif_matricule: string;
  is_verified: boolean;
  created_at: string;
  user?: User;
}

interface Candidate {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile_description: string;
  cv_url?: string;
  created_at: string;
  user?: User;
}

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  job_type: string;
  experience_level: string;
  education_level: string;
  contact_email: string;
  contact_phone: string;
  deadline: string;
  is_active: boolean;
  created_at: string;
  company?: Company;
}

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id?: string;
  created_at: string;
  user?: User;
}

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  created_at: string;
  user?: User;
  plan?: {
    id: string;
    name: string;
    price: number;
    features: string[];
  };
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    loading: adminLoading,
    error: adminError,
    checkIsAdmin,
    getCurrentAdminRole,
    hasPermission,
    logAction,
    getRoles,
    getAdministrators,
    createAdministrator,
    updateAdministratorRole,
    deactivateAdministrator,
    getSystemSettings,
    updateSystemSetting,
    getAdminLogs
  } = useAdminSystem();

  // États pour les données
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);

  // États pour les statistiques
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalCandidates: 0,
    totalPayments: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    activeAdmins: 0,
    recentLogs: 0,
    pendingApprovals: 0
  });

  // États pour les filtres et recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  // États pour les modales
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // États pour les permissions
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isInitialized) return;
    
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
          // Rediriger vers le dashboard approprié selon le type d'utilisateur
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('user_id', user.id)
          .single();

        if (profile) {
              switch (profile.user_type) {
                case 'company':
                  navigate('/company-dashboard');
                  break;
                case 'candidate':
                  navigate('/candidate-dashboard');
                  break;
                default:
                  navigate('/dashboard');
                  break;
              }
          } else {
            navigate('/dashboard');
          }
          return;
        }

        // Charger le rôle de l'admin
        const role = await getCurrentAdminRole();
        setCurrentRole(role);

        // Charger les permissions
        await loadPermissions();

        // Charger les données d'administration
        await loadAdminData();

        setIsInitialized(true);

      } catch (error) {
        console.error('Error checking user:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate, isInitialized]);

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

  const loadAdminData = async () => {
    try {
      // Charger les rôles
      const rolesData = await getRoles();
      setRoles(rolesData);

      // Charger les administrateurs
      const adminsData = await getAdministrators();
      setAdministrators(adminsData);

      // Charger les logs
      const logsData = await getAdminLogs(20);
      setAdminLogs(logsData);

      // Charger les paramètres système
      const settingsData = await getSystemSettings();
      setSystemSettings(settingsData);

      // Charger les données métier
      await loadBusinessData();

      // Charger les statistiques
      await loadStats();

    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const loadBusinessData = async () => {
    try {
      // Exécuter toutes les requêtes en parallèle pour améliorer les performances
      const [
        usersResult,
        companiesResult,
        candidatesResult,
        jobsResult,
        paymentsResult,
        subscriptionsResult
      ] = await Promise.all([
        // Charger les utilisateurs
        supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
        
        // Charger les entreprises
        supabase
          .from('companies')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
        
        // Charger les candidats
        supabase
          .from('candidates')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
        
        // Charger les offres d'emploi
        supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
        
        // Charger les paiements
        supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
        
        // Charger les abonnements
        supabase
          .from('user_subscriptions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100)
      ]);

      setUsers(usersResult.data || []);
      setCompanies(companiesResult.data || []);
      setCandidates(candidatesResult.data || []);
      setJobs(jobsResult.data || []);
      setPayments(paymentsResult.data || []);
      setSubscriptions(subscriptionsResult.data || []);

    } catch (error) {
      console.error('Error loading business data:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Exécuter toutes les requêtes en parallèle pour améliorer les performances
      const [
        usersResult,
        companiesResult,
        jobsResult,
        candidatesResult,
        paymentsResult,
        revenueResult,
        subscriptionsResult,
        adminsResult,
        pendingResult
      ] = await Promise.all([
        // Compter les utilisateurs
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true }),
        
        // Compter les entreprises
        supabase
          .from('companies')
          .select('*', { count: 'exact', head: true }),
        
        // Compter les offres d'emploi
        supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true }),
        
        // Compter les candidats
        supabase
          .from('candidates')
          .select('*', { count: 'exact', head: true }),
        
        // Compter les paiements
        supabase
          .from('payments')
          .select('*', { count: 'exact', head: true }),
        
        // Calculer le revenu total
        supabase
          .from('payments')
          .select('amount')
          .eq('status', 'completed'),
        
        // Compter les abonnements actifs
        supabase
          .from('user_subscriptions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active'),
        
        // Compter les administrateurs actifs
        supabase
          .from('administrators')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Compter les approbations en attente
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', false)
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

      setStats({
        totalUsers: usersResult.count || 0,
        totalCompanies: companiesResult.count || 0,
        totalJobs: jobsResult.count || 0,
        totalCandidates: candidatesResult.count || 0,
        totalPayments: paymentsResult.count || 0,
        totalRevenue,
        activeSubscriptions: subscriptionsResult.count || 0,
        activeAdmins: adminsResult.count || 0,
        recentLogs: adminLogs.length,
        pendingApprovals: pendingResult.count || 0
      });

    } catch (error) {
      console.error('Error loading stats:', error);
      // Valeurs par défaut en cas d'erreur
      setStats({
        totalUsers: 0,
        totalCompanies: 0,
        totalJobs: 0,
        totalCandidates: 0,
        totalPayments: 0,
        totalRevenue: 0,
        activeSubscriptions: 0,
        activeAdmins: 0,
        recentLogs: 0,
        pendingApprovals: 0
      });
    }
  };

  const handleRefresh = async () => {
    await loadPermissions();
    await loadAdminData();
    toast({
      title: "Données actualisées",
      description: "Les statistiques ont été mises à jour.",
    });
  };

  const handleLogout = async () => {
    await logAction('logout', 'session');
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      switch (action) {
        case 'activate':
          await supabase
            .from('profiles')
            .update({ is_active: true })
            .eq('user_id', userId);
          break;
        case 'deactivate':
          await supabase
            .from('profiles')
            .update({ is_active: false })
            .eq('user_id', userId);
          break;
        case 'verify':
          await supabase
            .from('profiles')
            .update({ email_verified: true })
            .eq('user_id', userId);
          break;
      }
      
      await loadBusinessData();
      await logAction(action, 'user', { user_id: userId });
      
      toast({
        title: "Action effectuée",
        description: `L'utilisateur a été ${action === 'activate' ? 'activé' : action === 'deactivate' ? 'désactivé' : 'vérifié'}.`,
      });
    } catch (error) {
      console.error('Error handling user action:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'action.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.last_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || user.user_type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du dashboard administrateur...</p>
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
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
                  <p className="text-gray-600 mt-2">
                    Bienvenue, {user.email} • Rôle: {currentRole?.display_name || 'Non défini'}
                  </p>
            </div>
                <div className="flex items-center space-x-3">
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                  {permissions.roles && (
                    <Button onClick={() => setShowCreateAdmin(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvel Admin
            </Button>
                  )}
                </div>
              </div>
          </div>

            {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                  +12% depuis ce mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Entreprises</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCompanies.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                  +8% depuis ce mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} FCFA</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                  +15% depuis ce mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Abonnements</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.activeSubscriptions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                  +5% depuis ce mois
                </p>
              </CardContent>
            </Card>
          </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                <TabsTrigger value="payments">Paiements</TabsTrigger>
                <TabsTrigger value="companies">Entreprises</TabsTrigger>
                <TabsTrigger value="jobs">Offres</TabsTrigger>
                <TabsTrigger value="reports">Rapports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                        {adminLogs.slice(0, 5).map((log) => (
                          <div key={log.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                              <p className="text-sm font-medium">{log.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(log.created_at).toLocaleString()}
                              </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                      <CardTitle>Administrateurs actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                        {administrators.slice(0, 5).map((admin) => (
                          <div key={admin.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                      <div>
                                <p className="text-sm font-medium">{admin.user?.email}</p>
                                <p className="text-xs text-muted-foreground">
                                  {admin.role?.display_name}
                                </p>
                              </div>
                            </div>
                            <Badge variant={admin.is_active ? "default" : "secondary"}>
                              {admin.is_active ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Offres d'emploi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">{stats.totalJobs}</div>
                      <p className="text-sm text-muted-foreground">Total des offres</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Candidats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">{stats.totalCandidates}</div>
                      <p className="text-sm text-muted-foreground">Profils candidats</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">En attente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-600">{stats.pendingApprovals}</div>
                      <p className="text-sm text-muted-foreground">Approbations</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Gestion des Utilisateurs</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <select
                          value={selectedFilter}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">Tous les types</option>
                          <option value="candidate">Candidats</option>
                          <option value="company">Entreprises</option>
                          <option value="student">Étudiants</option>
                          <option value="admin">Administrateurs</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{user.email}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.first_name} {user.last_name}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">{user.user_type}</Badge>
                                <Badge variant={user.is_active ? "default" : "secondary"}>
                                  {user.is_active ? "Actif" : "Inactif"}
                                </Badge>
                                {user.email_verified && (
                                  <Badge variant="outline" className="text-green-600">
                                    Vérifié
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserDetails(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {permissions.users && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleUserAction(user.id, user.is_active ? 'deactivate' : 'activate')}
                                >
                                  {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                </Button>
                                {!user.email_verified && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleUserAction(user.id, 'verify')}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des Paiements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{payment.user?.email}</p>
                              <p className="text-sm text-muted-foreground">
                                {payment.amount} {payment.currency}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(payment.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={
                                payment.status === 'completed' ? 'default' :
                                payment.status === 'pending' ? 'secondary' :
                                payment.status === 'failed' ? 'destructive' : 'outline'
                              }
                            >
                              {payment.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="companies" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des Entreprises</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {companies.map((company) => (
                        <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">{company.company_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {company.user?.email}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                NIF: {company.nif_matricule}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={company.is_verified ? "default" : "secondary"}>
                              {company.is_verified ? "Vérifié" : "En attente"}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                      </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jobs" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des Offres d'emploi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <Briefcase className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {job.company?.company_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {job.location} • {job.job_type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={job.is_active ? "default" : "secondary"}>
                              {job.is_active ? "Actif" : "Inactif"}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Rapport des Revenus</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Revenus totaux</span>
                          <span className="font-bold">{stats.totalRevenue.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Paiements réussis</span>
                          <span className="font-bold">{payments.filter(p => p.status === 'completed').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Paiements en attente</span>
                          <span className="font-bold">{payments.filter(p => p.status === 'pending').length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Statistiques Utilisateurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total utilisateurs</span>
                          <span className="font-bold">{stats.totalUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Utilisateurs actifs</span>
                          <span className="font-bold">{users.filter(u => u.is_active).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Emails vérifiés</span>
                          <span className="font-bold">{users.filter(u => u.email_verified).length}</span>
                        </div>
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

export default AdminDashboard;