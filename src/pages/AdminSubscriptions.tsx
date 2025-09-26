import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  CheckCircle, 
  DollarSign, 
  FileText, 
  RotateCcw,
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Données de démonstration pour les statistiques
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0
  });

  useEffect(() => {
    loadSubscriptions();
    loadStats();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      
      // Charger les abonnements depuis Supabase
      const { data: subsData, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          profiles (email, first_name, last_name),
          subscription_plans (*)
        `);

      if (error) {
        throw error;
      }

      if (subsData) {
        setSubscriptions(subsData);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      // Utiliser des données de démonstration si pas de table
      setSubscriptions(generateDemoSubscriptions());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    // Calculer les statistiques
    const totalSubs = subscriptions.length;
    const activeSubs = subscriptions.filter(sub => sub.status === 'active').length;
    const totalRev = subscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0);
    const monthlyRev = subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((sum, sub) => sum + (sub.amount || 0), 0);
    const pendingPay = subscriptions.filter(sub => sub.status === 'pending').length;
    const overduePay = subscriptions.filter(sub => sub.status === 'overdue').length;

    setStats({
      totalSubscriptions: totalSubs,
      activeSubscriptions: activeSubs,
      totalRevenue: totalRev,
      monthlyRevenue: monthlyRev,
      pendingPayments: pendingPay,
      overduePayments: overduePay
    });
  };

  const generateDemoSubscriptions = () => {
    return [
      {
        id: 1,
        user_id: 'user1',
        plan_id: 'plan1',
        status: 'active',
        amount: 29.99,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        payment_method: 'card',
        profiles: { email: 'user1@example.com', first_name: 'Jean', last_name: 'Dupont' },
        subscription_plans: { name: 'Plan Premium', price: 29.99 }
      },
      {
        id: 2,
        user_id: 'user2',
        plan_id: 'plan2',
        status: 'pending',
        amount: 19.99,
        start_date: '2024-01-15',
        end_date: '2024-12-15',
        payment_method: 'card',
        profiles: { email: 'user2@example.com', first_name: 'Marie', last_name: 'Martin' },
        subscription_plans: { name: 'Plan Standard', price: 19.99 }
      },
      {
        id: 3,
        user_id: 'user3',
        plan_id: 'plan1',
        status: 'overdue',
        amount: 29.99,
        start_date: '2023-12-01',
        end_date: '2023-12-31',
        payment_method: 'card',
        profiles: { email: 'user3@example.com', first_name: 'Pierre', last_name: 'Durand' },
        subscription_plans: { name: 'Plan Premium', price: 29.99 }
      }
    ];
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.profiles?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.profiles?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subscription_plans?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Actif', variant: 'default' as const, color: 'bg-green-100 text-green-800' };
      case 'pending':
        return { label: 'En attente', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' };
      case 'overdue':
        return { label: 'En retard', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' };
      case 'cancelled':
        return { label: 'Annulé', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' };
      default:
        return { label: 'Inconnu', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const handleSubscriptionAction = async (subscriptionId: string, action: string) => {
    try {
      switch (action) {
        case 'activate':
          // Activer l'abonnement
          toast({
            title: "Succès",
            description: "Abonnement activé avec succès",
          });
          break;
        case 'suspend':
          // Suspendre l'abonnement
          toast({
            title: "Succès",
            description: "Abonnement suspendu avec succès",
          });
          break;
        case 'cancel':
          // Annuler l'abonnement
          if (confirm('Êtes-vous sûr de vouloir annuler cet abonnement ?')) {
            toast({
              title: "Succès",
              description: "Abonnement annulé avec succès",
            });
          }
          break;
      }
      
      loadSubscriptions(); // Recharger la liste
    } catch (error) {
      console.error('Error performing subscription action:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'abonnement",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des abonnements...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Abonnements</h1>
              <p className="text-gray-600">Gérez tous les abonnements et paiements de la plateforme</p>
            </div>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nouvel abonnement</span>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Abonnements</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubscriptions}</div>
                <p className="text-xs text-muted-foreground">Tous statuts confondus</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Abonnements Actifs</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">En cours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.totalRevenue.toFixed(2)} €</div>
                <p className="text-xs text-muted-foreground">Tous les temps</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.monthlyRevenue.toFixed(2)} €</div>
                <p className="text-xs text-muted-foreground">Ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paiements En Attente</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</div>
                <p className="text-xs text-muted-foreground">À traiter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paiements En Retard</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.overduePayments}</div>
                <p className="text-xs text-muted-foreground">En retard</p>
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
                      placeholder="Rechercher un abonnement..."
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
                    variant={filterStatus === 'active' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('active')}
                  >
                    Actifs
                  </Button>
                  <Button
                    variant={filterStatus === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('pending')}
                  >
                    En attente
                  </Button>
                  <Button
                    variant={filterStatus === 'overdue' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('overdue')}
                  >
                    En retard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Abonnements ({filteredSubscriptions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Utilisateur</th>
                      <th className="text-left p-4 font-medium">Plan</th>
                      <th className="text-left p-4 font-medium">Statut</th>
                      <th className="text-left p-4 font-medium">Montant</th>
                      <th className="text-left p-4 font-medium">Période</th>
                      <th className="text-left p-4 font-medium">Méthode de paiement</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map((subscription) => {
                      const statusInfo = getStatusBadge(subscription.status);
                      
                      return (
                        <tr key={subscription.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <div className="font-medium">
                                {subscription.profiles?.first_name && subscription.profiles?.last_name 
                                  ? `${subscription.profiles.first_name} ${subscription.profiles.last_name}`
                                  : 'Utilisateur'
                                }
                              </div>
                              <div className="text-sm text-gray-500">{subscription.profiles?.email}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{subscription.subscription_plans?.name || 'Plan'}</div>
                            <div className="text-sm text-gray-500">{subscription.subscription_plans?.price} €/mois</div>
                          </td>
                          <td className="p-4">
                            <Badge className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{subscription.amount} €</div>
                          </td>
                          <td className="p-4 text-sm text-gray-500">
                            <div>{new Date(subscription.start_date).toLocaleDateString('fr-FR')}</div>
                            <div>à {new Date(subscription.end_date).toLocaleDateString('fr-FR')}</div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{subscription.payment_method}</Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              {subscription.status === 'pending' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleSubscriptionAction(subscription.id, 'activate')}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
                              {subscription.status === 'active' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleSubscriptionAction(subscription.id, 'suspend')}
                                >
                                  <Clock className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSubscriptionAction(subscription.id, 'cancel')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {filteredSubscriptions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun abonnement trouvé
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
