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
  ArrowDownRight
} from "lucide-react";
import { useAdminSystem, AdminRole, Administrator, AdminLog, SystemSetting } from "@/hooks/use-admin-system";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
    activeAdmins: 0,
    recentLogs: 0
  });

  // États pour les modales
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);

  // États pour les permissions
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

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
      const permissionKeys = ['users', 'companies', 'jobs', 'candidates', 'settings', 'reports', 'roles'];
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

      // Charger les statistiques
      await loadStats();

    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Compter les utilisateurs
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Compter les entreprises
      const { count: companiesCount } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });

      // Compter les offres d'emploi
      const { count: jobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true });

      // Compter les candidats
      const { count: candidatesCount } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true });

      // Compter les administrateurs actifs
      const { count: adminsCount } = await supabase
        .from('administrators')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats({
        totalUsers: usersCount || 0,
        totalCompanies: companiesCount || 0,
        totalJobs: jobsCount || 0,
        totalCandidates: candidatesCount || 0,
        activeAdmins: adminsCount || 0,
        recentLogs: adminLogs.length
      });

    } catch (error) {
      console.error('Error loading stats:', error);
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
                  <CardTitle className="text-sm font-medium">Offres d'emploi</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalJobs.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                    +15% depuis ce mois
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Candidats</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCandidates.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                    +5% depuis ce mois
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="administrators">Administrateurs</TabsTrigger>
                <TabsTrigger value="roles">Rôles</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
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
              </TabsContent>

              <TabsContent value="administrators" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Gestion des Administrateurs</CardTitle>
                      {permissions.roles && (
                        <Button onClick={() => setShowCreateAdmin(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Nouvel Administrateur
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {administrators.map((admin) => (
                        <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{admin.user?.email}</p>
                              <p className="text-sm text-muted-foreground">
                                Rôle: {admin.role?.display_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Créé le: {new Date(admin.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={admin.is_active ? "default" : "secondary"}>
                              {admin.is_active ? "Actif" : "Inactif"}
                            </Badge>
                            {permissions.roles && (
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => deactivateAdministrator(admin.id)}
                                >
                                  <UserX className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roles" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rôles d'Administration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roles.map((role) => (
                        <div key={role.id} className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Shield className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{role.display_name}</h3>
                              <p className="text-sm text-muted-foreground">{role.description}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {Object.entries(role.permissions).map(([permission, enabled]) => (
                              <div key={permission} className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-sm capitalize">{permission}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logs" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Logs d'Administration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {adminLogs.map((log) => (
                        <div key={log.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{log.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {log.resource_type} • {new Date(log.created_at).toLocaleString()}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
