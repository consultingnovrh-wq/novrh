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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Building2, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  MapPin,
  RefreshCw,
  ArrowUpDown
} from "lucide-react";
import { useAdminSystem } from "@/hooks/use-admin-system";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

// Types pour les données
interface Company {
  id: string;
  user_id: string;
  company_name: string;
  company_address: string;
  nif_matricule: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface CompanyProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
}

const AdminCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  
  // États pour les filtres et recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // États pour les statistiques
  const [stats, setStats] = useState({
    totalCompanies: 0,
    verifiedCompanies: 0,
    pendingCompanies: 0,
    activeCompanies: 0
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
    let isInitialized = false;
    
    const checkUser = async () => {
      if (isInitialized) return;
      
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
        await loadCompanies();

        isInitialized = true;

      } catch (error) {
        console.error('Error checking user:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const loadPermissions = async () => {
    try {
      const permissionKeys = ['companies', 'users', 'jobs', 'candidates', 'settings', 'reports', 'roles'];
      const permissionStates: Record<string, boolean> = {};
      
      for (const permission of permissionKeys) {
        permissionStates[permission] = await hasPermission(permission);
      }
      
      setPermissions(permissionStates);
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const loadCompanies = async () => {
    try {
      // Charger les entreprises
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (companiesError) {
        console.error('Error loading companies:', companiesError);
        throw companiesError;
      }

      setCompanies(companiesData || []);

      // Charger les profils des entreprises
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'company')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
      }

      setProfiles(profilesData || []);

      // Calculer les statistiques
      const totalCompanies = companiesData?.length || 0;
      const verifiedCompanies = companiesData?.filter(c => c.is_verified).length || 0;
      const pendingCompanies = companiesData?.filter(c => !c.is_verified).length || 0;
      const activeCompanies = profilesData?.filter(p => p.is_active).length || 0;

      setStats({
        totalCompanies,
        verifiedCompanies,
        pendingCompanies,
        activeCompanies
      });

    } catch (error: any) {
      console.error('Error loading companies:', error);
      
      let errorMessage = "Impossible de charger les entreprises.";
      if (error.message) {
        errorMessage = `Erreur: ${error.message}`;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      setCompanies([]);
      setProfiles([]);
      setStats({
        totalCompanies: 0,
        verifiedCompanies: 0,
        pendingCompanies: 0,
        activeCompanies: 0
      });
    }
  };

  const handleCompanyAction = async (companyId: string, action: string) => {
    try {
      switch (action) {
        case 'verify':
          await supabase
            .from('companies')
            .update({ is_verified: true })
            .eq('id', companyId);
          break;
        case 'unverify':
          await supabase
            .from('companies')
            .update({ is_verified: false })
            .eq('id', companyId);
          break;
        case 'activate':
          const company = companies.find(c => c.id === companyId);
          if (company) {
            await supabase
              .from('profiles')
              .update({ is_active: true })
              .eq('user_id', company.user_id);
          }
          break;
        case 'deactivate':
          const company2 = companies.find(c => c.id === companyId);
          if (company2) {
            await supabase
              .from('profiles')
              .update({ is_active: false })
              .eq('user_id', company2.user_id);
          }
          break;
      }
      
      await loadCompanies();
      await logAction(action, 'company', { company_id: companyId });
      
      toast({
        title: "Action effectuée",
        description: `L'entreprise a été ${action === 'verify' ? 'vérifiée' : action === 'unverify' ? 'non vérifiée' : action === 'activate' ? 'activée' : 'désactivée'}.`,
      });
    } catch (error) {
      console.error('Error handling company action:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'action.",
        variant: "destructive"
      });
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredCompanies = companies.filter(company => {
    const profile = profiles.find(p => p.user_id === company.user_id);
    const matchesSearch = company.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.nif_matricule?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile?.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatusFilter = statusFilter === 'all' || 
                               (statusFilter === 'verified' && company.is_verified) ||
                               (statusFilter === 'pending' && !company.is_verified) ||
                               (statusFilter === 'active' && profile?.is_active) ||
                               (statusFilter === 'inactive' && !profile?.is_active);
    
    return matchesSearch && matchesStatusFilter;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (sortBy) {
      case 'company_name':
        aValue = a.company_name;
        bValue = b.company_name;
        break;
      case 'created_at':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      default:
        aValue = a[sortBy as keyof Company];
        bValue = b[sortBy as keyof Company];
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
          <p className="text-muted-foreground">Chargement des entreprises...</p>
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
                  <h1 className="text-3xl font-bold text-gray-900">Gestion des Entreprises</h1>
                  <p className="text-gray-600 mt-2">
                    Gérez toutes les entreprises de la plateforme
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button onClick={loadCompanies} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle entreprise
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Entreprises</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCompanies.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Toutes les entreprises
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Entreprises Vérifiées</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.verifiedCompanies.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.verifiedCompanies / stats.totalCompanies) * 100).toFixed(1)}% du total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingCompanies.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Nécessitent une vérification
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Entreprises Actives</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.activeCompanies.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Comptes actifs
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filtres et Recherche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Rechercher</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="search"
                        placeholder="Nom, NIF, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="verified">Vérifiées</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="active">Actives</SelectItem>
                        <SelectItem value="inactive">Inactives</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sort">Trier par</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Trier par" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created_at">Date de création</SelectItem>
                        <SelectItem value="company_name">Nom de l'entreprise</SelectItem>
                        <SelectItem value="is_verified">Statut de vérification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Companies Table */}
            <Card>
              <CardHeader>
                <CardTitle>Entreprises ({sortedCompanies.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('company_name')}>
                          <div className="flex items-center space-x-1">
                            <span>Entreprise</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Adresse</TableHead>
                        <TableHead>NIF/Matricule</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                          <div className="flex items-center space-x-1">
                            <span>Créé le</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedCompanies.map((company) => {
                        const profile = profiles.find(p => p.user_id === company.user_id);
                        return (
                          <TableRow key={company.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <div>
                                  <div className="font-medium">{company.company_name}</div>
                                  {profile && (
                                    <div className="text-sm text-gray-500">{profile.email}</div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {profile && (
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-1 text-sm">
                                    <Mail className="w-3 h-3" />
                                    <span>{profile.email}</span>
                                  </div>
                                  {profile.phone && (
                                    <div className="flex items-center space-x-1 text-sm">
                                      <Phone className="w-3 h-3" />
                                      <span>{profile.phone}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 text-sm">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[200px]">{company.company_address}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-sm">{company.nif_matricule}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Badge variant={company.is_verified ? "default" : "secondary"}>
                                  {company.is_verified ? "Vérifiée" : "En attente"}
                                </Badge>
                                {profile && (
                                  <Badge variant={profile.is_active ? "outline" : "destructive"}>
                                    {profile.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {formatDate(company.created_at)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    // Ouvrir les détails de l'entreprise
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {permissions.companies && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => handleCompanyAction(company.id, company.is_verified ? 'unverify' : 'verify')}
                                      >
                                        {company.is_verified ? (
                                          <>
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Non vérifier
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Vérifier
                                          </>
                                        )}
                                      </DropdownMenuItem>
                                      {profile && (
                                        <DropdownMenuItem
                                          onClick={() => handleCompanyAction(company.id, profile.is_active ? 'deactivate' : 'activate')}
                                        >
                                          {profile.is_active ? (
                                            <>
                                              <XCircle className="w-4 h-4 mr-2" />
                                              Désactiver
                                            </>
                                          ) : (
                                            <>
                                              <CheckCircle className="w-4 h-4 mr-2" />
                                              Activer
                                            </>
                                          )}
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuItem>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Modifier
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Supprimer
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCompanies;