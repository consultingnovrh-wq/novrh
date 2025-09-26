import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Briefcase, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

const AdminJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingJobs: 0,
    expiredJobs: 0,
    premiumJobs: 0,
    totalApplications: 0
  });

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    contract_type: '',
    salary_min: '',
    salary_max: '',
    description: '',
    requirements: '',
    missions: '',
    advantages: '',
    application_deadline: '',
    contact_email: '',
    status: 'pending'
  });

  useEffect(() => {
    loadJobs();
    loadStats();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      
      // Charger les offres d'emploi depuis Supabase
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (name, logo_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (jobsData) {
        setJobs(jobsData);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      // Utiliser des données de démonstration basées sur le rapport réel
      setJobs(generateDemoJobs());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.status === 'active').length;
    const pendingJobs = jobs.filter(job => job.status === 'pending').length;
    const expiredJobs = jobs.filter(job => job.status === 'expired').length;
    const premiumJobs = jobs.filter(job => job.is_premium).length;
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applications_count || 0), 0);

    setStats({
      totalJobs,
      activeJobs,
      pendingJobs,
      expiredJobs,
      premiumJobs,
      totalApplications
    });
  };

  const generateDemoJobs = () => {
    return [
      {
        id: 1,
        title: 'Stagiaire Comptable',
        company: 'FONCIERE ELA',
        location: 'L\'ile-Saint-Denis, île de France 93450',
        contract_type: 'Stage',
        duration: '6 mois',
        salary_min: 615,
        salary_max: 615,
        description: 'Nous recherchons un(e) stagiaire en comptabilité pour une durée de 6 mois. Sous la supervision de l\'équipe comptable, vous serez chargé(e) de contribuer à la gestion quotidienne des opérations comptables et administratives de l\'entreprise.',
        requirements: 'Niveau : Bac + (BTS, DUT, DEUG) optionnel\nFormation en lien avec la comptabilité\nExcellentes capacités d\'organisation et de gestion du temps\nBonne maîtrise des outils bureautique (Excel, Word, PPT)\nCapacité de travaillé en équipe et discrétion professionnelle',
        missions: 'Saisie comptable :\n• Saisie de toutes les factures.\n• Saisie des relevés bancaires.\n• Saisie des recettes mensuelles.\n\nGestion bancaire des comptes :\n• Faire des états de rapprochement bancaire.\n\nFiscalité :\n• Participation à la déclaration de TVA.\n\nGestion des comptes :\n• Lettrage des comptes.\n\nArchivage :\n• Organisation et archivage des factures, relevés bancaires et recettes.\n\nGestion de la paie :\n• Établissement des éléments variables de paie.\n• Saisie des variables de paie.\n• Saisie des écritures de paie.\n• Révision des dossiers sociaux des salariés.',
        advantages: 'Prise en charge du transport quotidien.',
        application_deadline: '2024-12-05',
        contact_email: 'consultingnovrh@gmail.com',
        status: 'active',
        is_premium: true,
        applications_count: 12,
        created_at: '2024-11-20',
        companies: { name: 'FONCIERE ELA', logo_url: null }
      },
      {
        id: 2,
        title: 'Développeur Full Stack',
        company: 'Tech Solutions',
        location: 'Paris, France',
        contract_type: 'CDI',
        salary_min: 45000,
        salary_max: 65000,
        description: 'Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe de développement.',
        requirements: 'Bac+5 en informatique\n3+ années d\'expérience\nReact, Node.js, PostgreSQL',
        missions: 'Développement d\'applications web\nMaintenance et optimisation\nCollaboration avec l\'équipe',
        advantages: 'Télétravail possible\nMutuelle\nTickets restaurant',
        application_deadline: '2024-12-31',
        contact_email: 'hr@techsolutions.com',
        status: 'active',
        is_premium: false,
        applications_count: 8,
        created_at: '2024-11-15',
        companies: { name: 'Tech Solutions', logo_url: null }
      }
    ];
  };

  const handleAddJob = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('jobs')
        .insert([newJob])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "Offre d'emploi créée avec succès",
      });

      setShowAddJob(false);
      setNewJob({
        title: '',
        company: '',
        location: '',
        contract_type: '',
        salary_min: '',
        salary_max: '',
        description: '',
        requirements: '',
        missions: '',
        advantages: '',
        application_deadline: '',
        contact_email: '',
        status: 'pending'
      });

      loadJobs();
    } catch (error) {
      console.error('Error adding job:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'offre d'emploi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', variant: 'default' as const, color: 'bg-green-100 text-green-800' };
      case 'pending':
        return { label: 'En attente', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' };
      case 'expired':
        return { label: 'Expirée', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Inconnu', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des offres d'emploi...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Offres d'Emploi</h1>
              <p className="text-gray-600">Gérez les offres d'emploi et les candidatures</p>
            </div>
            <Button className="flex items-center space-x-2" onClick={() => setShowAddJob(true)}>
              <Plus className="w-4 h-4" />
              <span>Ajouter une offre</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Offres</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalJobs}</div>
                <p className="text-xs text-muted-foreground">Toutes les offres</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offres Actives</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeJobs}</div>
                <p className="text-xs text-muted-foreground">En cours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingJobs}</div>
                <p className="text-xs text-muted-foreground">À valider</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expirées</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.expiredJobs}</div>
                <p className="text-xs text-muted-foreground">À renouveler</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium</CardTitle>
                <Star className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.premiumJobs}</div>
                <p className="text-xs text-muted-foreground">Offres premium</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">Total candidatures</p>
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
                      placeholder="Rechercher une offre..."
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
                    variant={filterStatus === 'expired' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('expired')}
                  >
                    Expirées
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => {
              const statusInfo = getStatusBadge(job.status);
              
              return (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{job.company}</span>
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                          {job.is_premium && (
                            <Badge className="bg-purple-100 text-purple-800">
                              Premium
                            </Badge>
                          )}
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
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{job.contract_type} • {job.duration}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary_min}€ - {job.salary_max}€</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{job.applications_count || 0} candidatures</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>Date limite: {new Date(job.application_deadline).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/admin/jobs/${job.id}`)}
                        >
                          Voir détails
                        </Button>
                        
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/jobs/${job.id}/applications`)}
                        >
                          Candidatures
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredJobs.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="text-center py-8 text-gray-500">
                Aucune offre d'emploi trouvée
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Modal pour ajouter une offre d'emploi */}
      {showAddJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Ajouter une offre d'emploi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titre du poste</Label>
                <Input
                  id="title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  placeholder="Ex: Stagiaire Comptable"
                />
              </div>
              
              <div>
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  value={newJob.company}
                  onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                  placeholder="Ex: FONCIERE ELA"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  placeholder="Ex: L'ile-Saint-Denis, île de France 93450"
                />
              </div>
              
              <div>
                <Label htmlFor="contract_type">Type de contrat</Label>
                <Select value={newJob.contract_type} onValueChange={(value) => setNewJob({...newJob, contract_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Alternance">Alternance</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="salary_min">Salaire minimum (€)</Label>
                <Input
                  id="salary_min"
                  type="number"
                  value={newJob.salary_min}
                  onChange={(e) => setNewJob({...newJob, salary_min: e.target.value})}
                  placeholder="Ex: 615"
                />
              </div>
              
              <div>
                <Label htmlFor="salary_max">Salaire maximum (€)</Label>
                <Input
                  id="salary_max"
                  type="number"
                  value={newJob.salary_max}
                  onChange={(e) => setNewJob({...newJob, salary_max: e.target.value})}
                  placeholder="Ex: 615"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="description">Description du poste</Label>
                <Textarea
                  id="description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  placeholder="Description détaillée du poste..."
                  rows={3}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="requirements">Profil recherché</Label>
                <Textarea
                  id="requirements"
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                  placeholder="Compétences et qualifications requises..."
                  rows={3}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="missions">Missions principales</Label>
                <Textarea
                  id="missions"
                  value={newJob.missions}
                  onChange={(e) => setNewJob({...newJob, missions: e.target.value})}
                  placeholder="Missions et responsabilités..."
                  rows={4}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="advantages">Avantages</Label>
                <Textarea
                  id="advantages"
                  value={newJob.advantages}
                  onChange={(e) => setNewJob({...newJob, advantages: e.target.value})}
                  placeholder="Avantages et bénéfices..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="application_deadline">Date limite de candidature</Label>
                <Input
                  id="application_deadline"
                  type="date"
                  value={newJob.application_deadline}
                  onChange={(e) => setNewJob({...newJob, application_deadline: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="contact_email">Email de contact</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={newJob.contact_email}
                  onChange={(e) => setNewJob({...newJob, contact_email: e.target.value})}
                  placeholder="Ex: consultingnovrh@gmail.com"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddJob(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddJob} disabled={loading}>
                {loading ? 'Création...' : 'Créer l\'offre'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
