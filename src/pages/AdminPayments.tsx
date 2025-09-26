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
  CreditCard, 
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
  DollarSign,
  Calendar,
  User,
  RefreshCw,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  RotateCcw
} from "lucide-react";
import { useAdminSystem } from "@/hooks/use-admin-system";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

// Types pour les données
interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  created_at: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  plan?: {
    id: string;
    name: string;
    price: number;
    features: string[];
  };
}

const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
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
  const [dateRange, setDateRange] = useState('30d');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // États pour les statistiques
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalRevenue: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    refundedPayments: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    averageTransaction: 0
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
        await loadPayments();

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

  const loadPayments = async () => {
    try {
      // Charger les paiements
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      setPayments(paymentsData || []);

      // Charger les abonnements
      const { data: subscriptionsData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      setSubscriptions(subscriptionsData || []);

      // Calculer les statistiques
      const totalPayments = paymentsData?.length || 0;
      const completedPayments = paymentsData?.filter(p => p.status === 'completed').length || 0;
      const pendingPayments = paymentsData?.filter(p => p.status === 'pending').length || 0;
      const failedPayments = paymentsData?.filter(p => p.status === 'failed').length || 0;
      const refundedPayments = paymentsData?.filter(p => p.status === 'refunded').length || 0;
      const activeSubscriptions = subscriptionsData?.filter(s => s.status === 'active').length || 0;

      const totalRevenue = paymentsData?.filter(p => p.status === 'completed').reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
      const averageTransaction = completedPayments > 0 ? totalRevenue / completedPayments : 0;

      // Calculer le revenu mensuel
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = paymentsData?.filter(p => {
        const paymentDate = new Date(p.created_at);
        return p.status === 'completed' && 
               paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear;
      }).reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

      setStats({
        totalPayments,
        totalRevenue,
        completedPayments,
        pendingPayments,
        failedPayments,
        refundedPayments,
        activeSubscriptions,
        monthlyRevenue,
        averageTransaction
      });

    } catch (error) {
      console.error('Error loading payments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentAction = async (paymentId: string, action: string) => {
    try {
      switch (action) {
        case 'refund':
          await supabase
            .from('payments')
            .update({ status: 'refunded' })
            .eq('id', paymentId);
          break;
        case 'mark_completed':
          await supabase
            .from('payments')
            .update({ status: 'completed' })
            .eq('id', paymentId);
          break;
        case 'mark_failed':
          await supabase
            .from('payments')
            .update({ status: 'failed' })
            .eq('id', paymentId);
          break;
      }
      
      await loadPayments();
      await logAction(action, 'payment', { payment_id: paymentId });
      
      toast({
        title: "Action effectuée",
        description: `Le paiement a été ${action === 'refund' ? 'remboursé' : action === 'mark_completed' ? 'marqué comme complété' : 'marqué comme échoué'}.`,
      });
    } catch (error) {
      console.error('Error handling payment action:', error);
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

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatusFilter = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatusFilter;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    const aValue = a[sortBy as keyof Payment];
    const bValue = b[sortBy as keyof Payment];
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'refunded':
        return <RotateCcw className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Complété</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échoué</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Remboursé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + currency;
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
          <p className="text-muted-foreground">Chargement des paiements...</p>
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
                  <h1 className="text-3xl font-bold text-gray-900">Gestion des Paiements</h1>
                  <p className="text-gray-600 mt-2">
                    Gérez tous les paiements et abonnements
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button onClick={loadPayments} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                  <Button variant="outline" size="sm">
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
                  <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    Tous les paiements réussis
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.monthlyRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    Ce mois-ci
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Paiements Réussis</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.completedPayments.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.completedPayments / stats.totalPayments) * 100).toFixed(1)}% du total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Abonnements Actifs</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats.activeSubscriptions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Abonnements en cours
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Paiements en Attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{stats.pendingPayments}</div>
                  <p className="text-sm text-muted-foreground">Nécessitent une action</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Paiements Échoués</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{stats.failedPayments}</div>
                  <p className="text-sm text-muted-foreground">Échecs de paiement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Moyenne</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{formatCurrency(stats.averageTransaction)}</div>
                  <p className="text-sm text-muted-foreground">Par transaction</p>
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
                        placeholder="Email, transaction ID..."
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
                        <SelectItem value="completed">Complétés</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="failed">Échoués</SelectItem>
                        <SelectItem value="refunded">Remboursés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
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
                    <Label htmlFor="sort">Trier par</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Trier par" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created_at">Date de création</SelectItem>
                        <SelectItem value="amount">Montant</SelectItem>
                        <SelectItem value="status">Statut</SelectItem>
                        <SelectItem value="payment_method">Méthode de paiement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
              <CardHeader>
                <CardTitle>Paiements ({sortedPayments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                          <div className="flex items-center space-x-1">
                            <span>Date</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </TableHead>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                          <div className="flex items-center space-x-1">
                            <span>Montant</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </TableHead>
                        <TableHead>Méthode</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {formatDate(payment.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{payment.user?.email}</div>
                                <div className="text-sm text-muted-foreground">
                                  {payment.user?.first_name} {payment.user?.last_name}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{formatCurrency(payment.amount, payment.currency)}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.payment_method}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(payment.status)}
                              {getStatusBadge(payment.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-sm">
                              {payment.transaction_id || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Ouvrir les détails du paiement
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {permissions.payments && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {payment.status === 'completed' && (
                                      <DropdownMenuItem
                                        onClick={() => handlePaymentAction(payment.id, 'refund')}
                                      >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Rembourser
                                      </DropdownMenuItem>
                                    )}
                                    {payment.status === 'pending' && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() => handlePaymentAction(payment.id, 'mark_completed')}
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Marquer comme complété
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handlePaymentAction(payment.id, 'mark_failed')}
                                        >
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Marquer comme échoué
                                        </DropdownMenuItem>
                                      </>
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
                      ))}
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

export default AdminPayments;
