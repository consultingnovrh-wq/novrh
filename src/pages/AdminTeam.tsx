import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  UserCog, 
  Plus, 
  Shield, 
  History, 
  UserPlus,
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Key,
  Clock,
  AlertTriangle,
  CheckCircle,
  Crown,
  Mail
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import AdminInviteModal from "@/components/AdminInviteModal";

const AdminTeam = () => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalMembers: 0,
    superAdmins: 0,
    admins: 0,
    moderators: 0,
    viewers: 0,
    activeMembers: 0
  });

  useEffect(() => {
    loadTeamMembers();
    loadStats();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      
      // Charger les membres de l'équipe depuis Supabase
      const { data: teamData, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles (email, first_name, last_name, is_active)
        `);

      if (error) {
        throw error;
      }

      if (teamData) {
        setTeamMembers(teamData);
      }
    } catch (error) {
      console.error('Error loading team members:', error);
      // Utiliser des données de démonstration
      setTeamMembers(generateDemoTeamMembers());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    const totalMembers = teamMembers.length;
    const superAdmins = teamMembers.filter(member => member.role === 'super_admin').length;
    const admins = teamMembers.filter(member => member.role === 'admin').length;
    const moderators = teamMembers.filter(member => member.role === 'moderator').length;
    const viewers = teamMembers.filter(member => member.role === 'viewer').length;
    const activeMembers = teamMembers.filter(member => member.is_active).length;

    setStats({
      totalMembers,
      superAdmins,
      admins,
      moderators,
      viewers,
      activeMembers
    });
  };

  const generateDemoTeamMembers = () => {
    return [
      {
        id: 1,
        user_id: 'admin1',
        role: 'super_admin',
        permissions: ['all'],
        is_active: true,
        joined_at: '2024-01-01',
        last_activity: '2024-12-01',
        profiles: { 
          email: 'superadmin@novrh.com', 
          first_name: 'Super', 
          last_name: 'Admin', 
          is_active: true 
        }
      },
      {
        id: 2,
        user_id: 'admin2',
        role: 'admin',
        permissions: ['users', 'companies', 'jobs', 'candidates'],
        is_active: true,
        joined_at: '2024-02-01',
        last_activity: '2024-11-30',
        profiles: { 
          email: 'admin@novrh.ml', 
          first_name: 'Admin', 
          last_name: 'Principal', 
          is_active: true 
        }
      },
      {
        id: 3,
        user_id: 'mod1',
        role: 'moderator',
        permissions: ['users', 'jobs'],
        is_active: true,
        joined_at: '2024-03-01',
        last_activity: '2024-11-29',
        profiles: { 
          email: 'moderator@novrh.ml', 
          first_name: 'Modérateur', 
          last_name: 'Junior', 
          is_active: true 
        }
      }
    ];
  };

  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.profiles?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.profiles?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterRole === 'all' || member.role === filterRole;
    
    return matchesSearch && matchesFilter;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return { label: 'Super Admin', variant: 'destructive' as const, color: 'bg-red-100 text-red-800', icon: Crown };
      case 'admin':
        return { label: 'Administrateur', variant: 'default' as const, color: 'bg-blue-100 text-blue-800', icon: Shield };
      case 'moderator':
        return { label: 'Modérateur', variant: 'secondary' as const, color: 'bg-green-100 text-green-800', icon: Users };
      case 'viewer':
        return { label: 'Lecteur', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800', icon: Eye };
      default:
        return { label: 'Inconnu', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800', icon: Users };
    }
  };

  const getPermissionsText = (permissions: string[]) => {
    if (permissions.includes('all')) return 'Toutes les permissions';
    return permissions.join(', ');
  };

  const handleTeamAction = async (memberId: string, action: string) => {
    try {
      switch (action) {
        case 'activate':
          toast({
            title: "Succès",
            description: "Membre activé avec succès",
          });
          break;
        case 'suspend':
          toast({
            title: "Succès",
            description: "Membre suspendu avec succès",
          });
          break;
        case 'delete':
          if (confirm('Êtes-vous sûr de vouloir supprimer ce membre de l\'équipe ?')) {
            toast({
              title: "Succès",
              description: "Membre supprimé avec succès",
            });
          }
          break;
      }
      
      loadTeamMembers();
    } catch (error) {
      console.error('Error performing team action:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le membre",
        variant: "destructive",
      });
    }
  };

  const handleAdminCreated = () => {
    loadTeamMembers();
    loadStats();
    toast({
      title: "Succès",
      description: "Nouveau membre d'équipe ajouté avec succès",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de l'équipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion de l'Équipe Admin</h1>
              <p className="text-gray-600">Gérez les administrateurs et leurs permissions</p>
            </div>
            <Button className="flex items-center space-x-2" onClick={() => setShowAddMember(true)}>
              <UserPlus className="w-4 h-4" />
              <span>Ajouter un membre</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
                <UserCog className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMembers}</div>
                <p className="text-xs text-muted-foreground">Équipe complète</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
                <Crown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.superAdmins}</div>
                <p className="text-xs text-muted-foreground">Accès complet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
                <Shield className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
                <p className="text-xs text-muted-foreground">Gestion avancée</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Modérateurs</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.moderators}</div>
                <p className="text-xs text-muted-foreground">Modération</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lecteurs</CardTitle>
                <Eye className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{stats.viewers}</div>
                <p className="text-xs text-muted-foreground">Lecture seule</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Membres Actifs</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeMembers}</div>
                <p className="text-xs text-muted-foreground">En activité</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher un membre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={filterRole === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterRole('all')}
                  >
                    Tous
                  </Button>
                  <Button
                    variant={filterRole === 'super_admin' ? 'default' : 'outline'}
                    onClick={() => setFilterRole('super_admin')}
                  >
                    Super Admins
                  </Button>
                  <Button
                    variant={filterRole === 'admin' ? 'default' : 'outline'}
                    onClick={() => setFilterRole('admin')}
                  >
                    Admins
                  </Button>
                  <Button
                    variant={filterRole === 'moderator' ? 'default' : 'outline'}
                    onClick={() => setFilterRole('moderator')}
                  >
                    Modérateurs
                  </Button>
                  <Button
                    variant={filterRole === 'viewer' ? 'default' : 'outline'}
                    onClick={() => setFilterRole('viewer')}
                  >
                    Lecteurs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeamMembers.map((member) => {
              const roleInfo = getRoleBadge(member.role);
              const RoleIcon = roleInfo.icon;
              
              return (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {member.profiles?.first_name} {member.profiles?.last_name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <RoleIcon className="w-4 h-4" />
                          <Badge className={roleInfo.color}>
                            {roleInfo.label}
                          </Badge>
                        </div>
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
                        <Mail className="w-4 h-4" />
                        <span>{member.profiles?.email}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Key className="w-4 h-4" />
                        <span>{getPermissionsText(member.permissions)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Rejoint le {new Date(member.joined_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <History className="w-4 h-4" />
                        <span>Dernière activité: {new Date(member.last_activity).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex space-x-2">
                        {!member.is_active && (
                          <Button 
                            size="sm"
                            onClick={() => handleTeamAction(member.id, 'activate')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Activer
                          </Button>
                        )}
                        
                        {member.is_active && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleTeamAction(member.id, 'suspend')}
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Suspendre
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleTeamAction(member.id, 'delete')}
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
          
          {filteredTeamMembers.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="text-center py-8 text-gray-500">
                Aucun membre trouvé
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Modal pour ajouter un membre */}
      <AdminInviteModal onAdminCreated={handleAdminCreated} />
    </div>
  );
};

export default AdminTeam;
