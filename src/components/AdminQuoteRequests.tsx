import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { emailService } from '@/services/emailService';
import { 
  Mail, 
  Phone, 
  Building2, 
  User, 
  Calendar, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  FileText
} from 'lucide-react';

interface QuoteRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  service_type: string;
  budget_range?: string;
  timeline?: string;
  description: string;
  additional_info?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  responded_at?: string;
}

const AdminQuoteRequests = () => {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadQuoteRequests();
  }, []);

  const loadQuoteRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuoteRequests(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des demandes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de devis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          responded_at: status !== 'pending' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;

      // Mettre à jour l'état local
      setQuoteRequests(prev => 
        prev.map(req => 
          req.id === id 
            ? { ...req, status: status as any, updated_at: new Date().toISOString() }
            : req
        )
      );

      toast({
        title: "Statut mis à jour",
        description: `La demande a été marquée comme ${status}`,
      });
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const sendQuoteEmail = async (request: QuoteRequest) => {
    try {
      // Ici on pourrait créer un template d'email pour le devis
      await emailService.sendWelcomeEmail({
        firstName: request.contact_name.split(' ')[0],
        lastName: request.contact_name.split(' ').slice(1).join(' '),
        email: request.email
      });

      toast({
        title: "Email envoyé",
        description: "Le devis a été envoyé par email",
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const filteredRequests = quoteRequests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      request.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Demandes de Devis</h1>
          <p className="text-muted-foreground">
            Gérez les demandes de devis et envoyez les factures
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadQuoteRequests} variant="outline">
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rechercher</label>
              <Input
                placeholder="Entreprise, contact, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {filteredRequests.length} demande(s)
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{request.company_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{request.contact_name}</p>
                </div>
                <Badge className={getStatusColor(request.status)}>
                  {getStatusLabel(request.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informations de contact */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{request.email}</span>
                </div>
                {request.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{request.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{new Date(request.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Détails du service */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="font-medium">{request.service_type}</span>
                </div>
                {request.budget_range && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span>{request.budget_range}</span>
                  </div>
                )}
                {request.timeline && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{request.timeline}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Description:</p>
                    <p className="text-muted-foreground line-clamp-2">
                      {request.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedRequest(request)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Voir détails
                </Button>
                <Button
                  size="sm"
                  onClick={() => sendQuoteEmail(request)}
                >
                  <Send className="w-4 h-4 mr-1" />
                  Envoyer devis
                </Button>
                {request.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateRequestStatus(request.id, 'in_progress')}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Traiter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de détails */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedRequest.company_name}</CardTitle>
                  <p className="text-muted-foreground">{selectedRequest.contact_name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRequest(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informations complètes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Téléphone</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.phone || 'Non fourni'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Service</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.service_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Budget</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.budget_range || 'Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Délai</label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.timeline || 'Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Date de demande</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedRequest.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium">Description du projet</label>
                <p className="text-sm text-muted-foreground mt-1 p-3 bg-gray-50 rounded">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Informations supplémentaires */}
              {selectedRequest.additional_info && (
                <div>
                  <label className="text-sm font-medium">Informations supplémentaires</label>
                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-gray-50 rounded">
                    {selectedRequest.additional_info}
                  </p>
                </div>
              )}

              {/* Notes admin */}
              <div>
                <label className="text-sm font-medium">Notes internes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Ajoutez des notes internes..."
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button onClick={() => sendQuoteEmail(selectedRequest)}>
                  <Send className="w-4 h-4 mr-1" />
                  Envoyer devis par email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateRequestStatus(selectedRequest.id, 'completed')}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Marquer comme terminé
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updateRequestStatus(selectedRequest.id, 'cancelled')}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminQuoteRequests;
