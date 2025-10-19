import { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import AdminQuoteRequests from '@/components/AdminQuoteRequests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, CheckCircle, DollarSign, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminQuoteRequestsPage = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Charger les statistiques des demandes de devis
      const [
        totalResult,
        pendingResult,
        completedResult
      ] = await Promise.all([
        supabase
          .from('quote_requests')
          .select('*', { count: 'exact', head: true }),
        
        supabase
          .from('quote_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending'),
        
        supabase
          .from('quote_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed')
      ]);

      setStats({
        totalRequests: totalResult.count || 0,
        pendingRequests: pendingResult.count || 0,
        completedRequests: completedResult.count || 0,
        totalRevenue: 0 // Calculer le revenu total si nécessaire
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header avec statistiques */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Gestion des Demandes de Devis
          </h1>
          <p className="text-muted-foreground">
            Gérez les demandes de devis et envoyez les factures aux clients
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total des demandes</p>
                  <p className="text-2xl font-bold text-primary">
                    {loading ? '...' : stats.totalRequests}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {loading ? '...' : stats.pendingRequests}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Terminées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {loading ? '...' : stats.completedRequests}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenus générés</p>
                  <p className="text-2xl font-bold text-primary">
                    {loading ? '...' : new Intl.NumberFormat('fr-FR').format(stats.totalRevenue)} FCFA
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={loadStats} variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Actualiser les statistiques
                </Button>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Exporter les données
                </Button>
                <Button variant="outline">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Générer rapport financier
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gestion des demandes */}
        <AdminQuoteRequests />
      </main>
    </div>
  );
};

export default AdminQuoteRequestsPage;
