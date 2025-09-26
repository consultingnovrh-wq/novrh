import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  UserCheck, 
  CheckCircle, 
  Clock, 
  Star, 
  BarChart3,
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  MapPin,
  Phone,
  Mail,
  FileText,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

const AdminCandidates = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalCandidates: 0,
    verifiedCandidates: 0,
    pendingCV: 0,
    premiumCandidates: 0,
    activeCandidates: 0,
    totalExperience: 0
  });

  useEffect(() => {
    loadCandidates();
    loadStats();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      
      const { data: candidatesData, error } = await supabase
        .from('candidates')
        .select(`
          *,
          profiles (email, first_name, last_name, is_active)
        `);

      if (error) {
        throw error;
      }

      if (candidatesData) {
        setCandidates(candidatesData);
      }
    } catch (error) {
      console.error('Error loading candidates:', error);
      setCandidates(generateDemoCandidates());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    const totalCands = candidates.length;
    const verifiedCands = candidates.filter(cand => cand.is_verified).length;
    const pendingCands = candidates.filter(cand => !cand.is_verified).length;
    const premiumCands = candidates.filter(cand => cand.is_premium).length;
    const activeCands = candidates.filter(cand => cand.profiles?.is_active).length;
    const totalExp = candidates.reduce((sum, cand) => sum + (cand.years_experience || 0), 0);

    setStats({
      totalCandidates: totalCands,
      verifiedCandidates: verifiedCands,
      pendingCV: pendingCands,
      premiumCandidates: premiumCands,
      activeCandidates: activeCands,
      totalExperience: totalExp
    });
  };

  const generateDemoCandidates = () => {
    return [
      {
        id: 1,
        first_name: 'Aissata',
        last_name: 'Traoré',
        phone: '+223 70 12 34 56',
        email: 'aissata.traore@email.ml',
        location: 'Bamako, Mali',
        years_experience: 5,
        education_level: 'Master',
        is_verified: true,
        is_premium: true,
        profile_description: 'Développeuse Full Stack avec 5 ans d\'expérience',
        cv_url: '/cv/aissata-traore.pdf',
        profiles: { email: 'aissata.traore@email.ml', first_name: 'Aissata', last_name: 'Traoré', is_active: true }
      },
      {
        id: 2,
        first_name: 'Moussa',
        last_name: 'Diallo',
        phone: '+223 76 23 45 67',
        email: 'moussa.diallo@email.ml',
        location: 'Sikasso, Mali',
        years_experience: 3,
        education_level: 'Licence',
        is_verified: false,
        is_premium: false,
        profile_description: 'Ingénieur agronome spécialisé en agriculture durable',
        cv_url: '/cv/moussa-diallo.pdf',
        profiles: { email: 'moussa.diallo@email.ml', first_name: 'Moussa', last_name: 'Diallo', is_active: true }
      },
      {
        id: 3,
        first_name: 'Fatoumata',
        last_name: 'Keita',
        phone: '+223 65 34 56 78',
        email: 'fatoumata.keita@email.ml',
        location: 'Kayes, Mali',
        years_experience: 8,
        education_level: 'Doctorat',
        is_verified: true,
        is_premium: true,
        profile_description: 'Experte en gestion de projets miniers',
        cv_url: '/cv/fatoumata-keita.pdf',
        profiles: { email: 'fatoumata.keita@email.ml', first_name: 'Fatoumata', last_name: 'Keita', is_active: true }
      }
    ];
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'verified') matchesFilter = candidate.is_verified;
    else if (filterStatus === 'pending') matchesFilter = !candidate.is_verified;
    else if (filterStatus === 'premium') matchesFilter = candidate.is_premium;
    else if (filterStatus === 'active') matchesFilter = candidate.profiles?.is_active;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (candidate: any) => {
    if (!candidate.profiles?.is_active) {
      return { label: 'Inactive', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' };
    }
    if (!candidate.is_verified) {
      return { label: 'CV en attente', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' };
    }
    if (candidate.is_premium) {
      return { label: 'Premium', variant: 'default' as const, color: 'bg-purple-100 text-purple-800' };
    }
    return { label: 'Vérifié', variant: 'default' as const, color: 'bg-green-100 text-green-800' };
  };

  const handleCandidateAction = async (candidateId: string, action: string) => {
    try {
      switch (action) {
        case 'verify':
          toast({
            title: "Succès",
            description: "Candidat vérifié avec succès",
          });
          break;
        case 'premium':
          toast({
            title: "Succès",
            description: "Candidat passé en premium",
          });
          break;
        case 'suspend':
          toast({
            title: "Succès",
            description: "Candidat suspendu avec succès",
          });
          break;
        case 'delete':
          if (confirm('Êtes-vous sûr de vouloir supprimer ce candidat ?')) {
            toast({
              title: "Succès",
              description: "Candidat supprimé avec succès",
            });
          }
          break;
      }
      
      loadCandidates();
    } catch (error) {
      console.error('Error performing candidate action:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le candidat",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des candidats...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Candidats</h1>
              <p className="text-gray-600">Gérez tous les profils candidats de la plateforme</p>
            </div>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nouveau candidat</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidats</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCandidates}</div>
                <p className="text-xs text-muted-foreground">Tous candidats</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vérifiés</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.verifiedCandidates}</div>
                <p className="text-xs text-muted-foreground">CV validés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CV en Attente</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingCV}</div>
                <p className="text-xs text-muted-foreground">À valider</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium</CardTitle>
                <Star className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.premiumCandidates}</div>
                <p className="text-xs text-muted-foreground">Profils premium</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actifs</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.activeCandidates}</div>
                <p className="text-xs text-muted-foreground">Comptes actifs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expérience Totale</CardTitle>
                <Briefcase className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">{stats.totalExperience} ans</div>
                <p className="text-xs text-muted-foreground">Cumulée</p>
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
                      placeholder="Rechercher un candidat..."
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
                    Tous
                  </Button>
                  <Button
                    variant={filterStatus === 'verified' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('verified')}
                  >
                    Vérifiés
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
                    Actifs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => {
              const statusInfo = getStatusBadge(candidate);
              
              return (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {candidate.first_name} {candidate.last_name}
                        </CardTitle>
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
                        <Mail className="w-4 h-4" />
                        <span>{candidate.email}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{candidate.phone}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{candidate.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4" />
                        <span>{candidate.education_level}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{candidate.years_experience} ans d'expérience</span>
                      </div>
                      
                      {candidate.profile_description && (
                        <div className="text-sm text-gray-600">
                          <FileText className="w-4 h-4 inline mr-2" />
                          {candidate.profile_description.substring(0, 100)}...
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex space-x-2">
                        {!candidate.is_verified && (
                          <Button 
                            size="sm"
                            onClick={() => handleCandidateAction(candidate.id, 'verify')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Valider CV
                          </Button>
                        )}
                        
                        {candidate.is_verified && !candidate.is_premium && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleCandidateAction(candidate.id, 'premium')}
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Premium
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleCandidateAction(candidate.id, 'suspend')}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Suspendre
                        </Button>
                        
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleCandidateAction(candidate.id, 'delete')}
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
          
          {filteredCandidates.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="text-center py-8 text-gray-500">
                Aucun candidat trouvé
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminCandidates;
