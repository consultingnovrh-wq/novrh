import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search, 
  Users,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  BookOpen,
  Star,
  Filter
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

const AdminFormations = () => {
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalFormations: 0,
    activeFormations: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    popularFormations: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    loadFormations();
    loadStats();
  }, []);

  const loadFormations = async () => {
    try {
      setLoading(true);
      
      // Charger les formations depuis Supabase
      const { data: formationsData, error } = await supabase
        .from('training_courses')
        .select(`
          *,
          training_institutions (company_name, email),
          course_enrollments (id, user_id, status)
        `);

      if (error) {
        throw error;
      }

      if (formationsData) {
        setFormations(formationsData);
      }
    } catch (error) {
      console.error('Error loading formations:', error);
      // Utiliser des données de démonstration
      setFormations(generateDemoFormations());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    const totalFormations = formations.length;
    const activeFormations = formations.filter(f => f.status === 'active').length;
    const totalEnrollments = formations.reduce((sum, f) => sum + (f.enrollments?.length || 0), 0);
    const totalRevenue = formations.reduce((sum, f) => sum + (f.price || 0) * (f.enrollments?.length || 0), 0);
    const popularFormations = formations.filter(f => (f.enrollments?.length || 0) > 10).length;
    const pendingApprovals = formations.filter(f => f.status === 'pending').length;

    setStats({
      totalFormations,
      activeFormations,
      totalEnrollments,
      totalRevenue,
      popularFormations,
      pendingApprovals
    });
  };

  const generateDemoFormations = () => [
    {
      id: '1',
      title: 'Formation en Développement Web',
      description: 'Apprenez les bases du développement web avec HTML, CSS et JavaScript',
      institution: 'Institut Supérieur de Technologie',
      price: 150000,
      duration: 3,
      status: 'active',
      enrollments: [{ id: '1' }, { id: '2' }, { id: '3' }],
      created_at: '2024-01-15',
      category: 'Informatique'
    },
    {
      id: '2',
      title: 'Formation en Marketing Digital',
      description: 'Maîtrisez les outils du marketing digital et les réseaux sociaux',
      institution: 'École de Commerce',
      price: 200000,
      duration: 2,
      status: 'active',
      enrollments: [{ id: '4' }, { id: '5' }],
      created_at: '2024-02-01',
      category: 'Marketing'
    },
    {
      id: '3',
      title: 'Formation en Gestion de Projet',
      description: 'Apprenez à gérer efficacement vos projets professionnels',
      institution: 'Centre de Formation Professionnelle',
      price: 180000,
      duration: 4,
      status: 'pending',
      enrollments: [],
      created_at: '2024-02-15',
      category: 'Management'
    }
  ];

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         formation.institution?.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || formation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Formations</h1>
                <p className="text-gray-600">Gérez toutes les formations et inscriptions de la plateforme</p>
              </div>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Nouvelle formation</span>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Formations</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalFormations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Formations Actives</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeFormations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Inscriptions</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Formations Populaires</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.popularFormations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">En Attente</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Revenus</p>
                      <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher une formation..."
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
                      variant={filterStatus === 'active' ? 'default' : 'outline'}
                      onClick={() => setFilterStatus('active')}
                    >
                      Actives
                    </Button>
                    <Button
                      variant={filterStatus === 'pending' ? 'default' : 'outline'}
                      onClick={() => setFilterStatus('pending')}
                    >
                      En attente
                    </Button>
                    <Button
                      variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                      onClick={() => setFilterStatus('inactive')}
                    >
                      Inactives
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formations List */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des Formations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Formation</th>
                        <th className="text-left p-4">Institution</th>
                        <th className="text-left p-4">Prix</th>
                        <th className="text-left p-4">Durée</th>
                        <th className="text-left p-4">Inscriptions</th>
                        <th className="text-left p-4">Statut</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFormations.map((formation) => (
                        <tr key={formation.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <h3 className="font-medium text-gray-900">{formation.title}</h3>
                              <p className="text-sm text-gray-500">{formation.description}</p>
                              <Badge variant="outline" className="mt-1">{formation.category}</Badge>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <p className="font-medium">{formation.institution?.company_name || 'N/A'}</p>
                              <p className="text-gray-500">{formation.institution?.email || ''}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-medium">{formatPrice(formation.price)}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-gray-400 mr-1" />
                              <span>{formation.duration} mois</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-gray-400 mr-1" />
                              <span>{formation.enrollments?.length || 0}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(formation.status)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredFormations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Aucune formation trouvée
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminFormations;
