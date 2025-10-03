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
  Users, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Building2,
  GraduationCap,
  Shield,
  User,
  RefreshCw,
  ArrowUpDown
} from "lucide-react";
import { useAdminSystem } from "@/hooks/use-admin-system";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import UserDetailsModal from "@/components/UserDetailsModal";
import AddUserModal from "@/components/AddUserModal";

// Types pour les données
interface User {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'candidate' | 'company' | 'admin' | 'student';
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
}

interface Company {
  id: string;
  user_id: string;
  company_name: string;
  company_address: string;
  nif_matricule: string;
  is_verified: boolean;
  created_at: string;
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
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  
  // États pour les filtres et recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // États pour les modales
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  
  // États pour les statistiques
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    pendingUsers: 0
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
        await loadUsers();

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

  const exportUsers = () => {
    try {
      // Préparer les données pour l'export CSV
      const csvData = users.map(user => ({
        'Nom': user.first_name || '',
        'Prénom': user.last_name || '',
        'Email': user.email,
        'Type': user.user_type,
        'Statut': user.is_active ? 'Actif' : 'Inactif',
        'Email vérifié': user.email_verified ? 'Oui' : 'Non',
        'Date création': new Date(user.created_at).toLocaleDateString('fr-FR'),
        'Dernière connexion': user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('fr-FR') : 'Jamais'
      }));

      // Créer le CSV
      const headers = Object.keys(csvData[0]).join(',');
      const rows = csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','));
      const csvContent = [headers, ...rows].join('\n');

      // Créer et télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `utilisateurs-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export réussi ✅",
        description: `Liste de ${csvData.length} utilisateurs exportée avec succès.`,
      });
    } catch (error) {
      console.error('Erreur export:', error);
      toast({
        title: "Erreur d'export ❌",
        description: "Impossible d'exporter la liste des utilisateurs.",
        variant: "destructive"
      });
    }
  };

  const loadUsers = async () => {
    try {
      // Exécuter toutes les requêtes en parallèle pour améliorer les performances
      const [
        usersResult,
        companiesResult,
        candidatesResult
      ] = await Promise.all([
        // Charger les utilisateurs
        supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false }),
        
        // Charger les entreprises
        supabase
          .from('companies')
          .select('*')
          .order('created_at', { ascending: false }),
        
        // Charger les candidats
        supabase
          .from('candidates')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      if (usersResult.error) {
        console.error('Error loading users:', usersResult.error);
        throw usersResult.error;
      }

      if (companiesResult.error) {
        console.error('Error loading companies:', companiesResult.error);
      }

      if (candidatesResult.error) {
        console.error('Error loading candidates:', candidatesResult.error);
      }

      const usersData = usersResult.data || [];
      const companiesData = companiesResult.data || [];
      const candidatesData = candidatesResult.data || [];

      setUsers(usersData);
      setCompanies(companiesData);
      setCandidates(candidatesData);

      // Calculer les statistiques
      const totalUsers = usersData.length;
      const activeUsers = usersData.filter(u => u.is_active).length;
      const verifiedUsers = usersData.filter(u => u.email_verified).length;
      const pendingUsers = usersData.filter(u => !u.is_active).length;

      setStats({
        totalUsers,
        activeUsers,
        verifiedUsers,
        pendingUsers
      });

    } catch (error: any) {
      console.error('Error loading users:', error);
      
      // Afficher un message d'erreur plus spécifique
      let errorMessage = "Impossible de charger les utilisateurs.";
      if (error.message) {
        errorMessage = `Erreur: ${error.message}`;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Définir des données vides en cas d'erreur
      setUsers([]);
      setCompanies([]);
      setCandidates([]);
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        verifiedUsers: 0,
        pendingUsers: 0
      });
    }
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
        case 'unverify':
          await supabase
            .from('profiles')
            .update({ email_verified: false })
            .eq('user_id', userId);
          break;
      }
      
      await loadUsers();
      await logAction(action, 'user', { user_id: userId });
      
      toast({
        title: "Action effectuée",
        description: `L'utilisateur a été ${action === 'activate' ? 'activé' : action === 'deactivate' ? 'désactivé' : action === 'verify' ? 'vérifié' : 'non vérifié'}.`,
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

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.last_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTypeFilter = selectedFilter === 'all' || user.user_type === selectedFilter;
    
    const matchesStatusFilter = statusFilter === 'all' || 
                               (statusFilter === 'active' && user.is_active) ||
                               (statusFilter === 'inactive' && !user.is_active) ||
                               (statusFilter === 'verified' && user.email_verified) ||
                               (statusFilter === 'unverified' && !user.email_verified);
    
    return matchesSearch && matchesTypeFilter && matchesStatusFilter;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    // Gestion spéciale pour les champs de tri
    switch (sortBy) {
      case 'name':
        aValue = `${a.first_name || ''} ${a.last_name || ''}`.trim();
        bValue = `${b.first_name || ''} ${b.last_name || ''}`.trim();
        break;
      case 'created_at':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      default:
        aValue = a[sortBy as keyof User];
        bValue = b[sortBy as keyof User];
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'company':
        return <Building2 className="w-4 h-4" />;
      case 'candidate':
        return <User className="w-4 h-4" />;
      case 'student':
        return <GraduationCap className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'company':
        return 'Entreprise';
      case 'candidate':
        return 'Candidat';
      case 'student':
        return 'Étudiant';
      case 'admin':
        return 'Administrateur';
      default:
        return 'Utilisateur';
    }
  };

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
          <p className="text-muted-foreground">Chargement des utilisateurs...</p>
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
                  <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                  <p className="text-gray-600 mt-2">
                    Gérez tous les utilisateurs de la plateforme
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button onClick={loadUsers} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                  <Button 
                    onClick={() => setShowAddUser(true)} 
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel utilisateur
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportUsers}>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Importer
                  </Button>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Tous les utilisateurs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.activeUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% du total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emails Vérifiés</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.verifiedUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1)}% du total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Nécessitent une action
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Rechercher</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="search"
                        placeholder="Email, nom..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'utilisateur</Label>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="candidate">Candidats</SelectItem>
                        <SelectItem value="company">Entreprises</SelectItem>
                        <SelectItem value="student">Étudiants</SelectItem>
                        <SelectItem value="admin">Administrateurs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="active">Actifs</SelectItem>
                        <SelectItem value="inactive">Inactifs</SelectItem>
                        <SelectItem value="verified">Vérifiés</SelectItem>
                        <SelectItem value="unverified">Non vérifiés</SelectItem>
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
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="name">Nom complet</SelectItem>
                        <SelectItem value="user_type">Type</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs ({sortedUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                          <div className="flex items-center space-x-1">
                            <span>Email</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                          <div className="flex items-center space-x-1">
                            <span>Nom</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('user_type')}>
                          <div className="flex items-center space-x-1">
                            <span>Type</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </TableHead>
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
                      {sortedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getUserTypeIcon(user.user_type)}
                              <span className="font-medium">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getUserTypeLabel(user.user_type)}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge variant={user.is_active ? "default" : "secondary"}>
                                {user.is_active ? "Actif" : "Inactif"}
                              </Badge>
                              {user.email_verified && (
                                <Badge variant="outline" className="text-green-600">
                                  Vérifié
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(user.created_at)}
                          </TableCell>
                          <TableCell>
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
                                      onClick={() => handleUserAction(user.user_id, user.is_active ? 'deactivate' : 'activate')}
                                    >
                                      {user.is_active ? (
                                        <>
                                          <UserX className="w-4 h-4 mr-2" />
                                          Désactiver
                                        </>
                                      ) : (
                                        <>
                                          <UserCheck className="w-4 h-4 mr-2" />
                                          Activer
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUserAction(user.user_id, user.email_verified ? 'unverify' : 'verify')}
                                    >
                                      {user.email_verified ? (
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={showUserDetails}
        onClose={() => setShowUserDetails(false)}
        user={selectedUser}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
        onUserAdded={loadUsers}
      />
    </div>
  );
};

export default AdminUsers;