import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building2, 
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Star
} from 'lucide-react';

interface TrainingInstitution {
  id: string;
  institution_name: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  accreditation_number?: string;
  is_verified: boolean;
  subscription_status: 'inactive' | 'standard' | 'premium';
  subscription_start_date?: string;
  subscription_end_date?: string;
}

interface TrainingOffer {
  id: string;
  title: string;
  description: string;
  category?: string;
  duration_hours?: number;
  duration_weeks?: number;
  price?: number;
  currency: string;
  start_date?: string;
  end_date?: string;
  max_participants?: number;
  current_participants: number;
  requirements?: string;
  objectives?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  is_featured: boolean;
  created_at: string;
}

const TrainingInstitutionDashboard = () => {
  const [institution, setInstitution] = useState<TrainingInstitution | null>(null);
  const [trainingOffers, setTrainingOffers] = useState<TrainingOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<TrainingOffer | null>(null);
  const { toast } = useToast();

  const [institutionForm, setInstitutionForm] = useState({
    institution_name: '',
    description: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: '',
    accreditation_number: ''
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    category: '',
    duration_hours: '',
    duration_weeks: '',
    price: '',
    currency: 'XOF',
    start_date: '',
    end_date: '',
    max_participants: '',
    requirements: '',
    objectives: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Charger l'institution
        const { data: institutionData, error: institutionError } = await supabase
          .from('training_institutions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (institutionError && institutionError.code !== 'PGRST116') {
          throw institutionError;
        }

        setInstitution(institutionData);
        if (institutionData) {
          setInstitutionForm({
            institution_name: institutionData.institution_name || '',
            description: institutionData.description || '',
            website: institutionData.website || '',
            phone: institutionData.phone || '',
            email: institutionData.email || '',
            address: institutionData.address || '',
            city: institutionData.city || '',
            country: institutionData.country || '',
            accreditation_number: institutionData.accreditation_number || ''
          });
        }

        // Charger les offres de formation
        if (institutionData) {
          const { data: offersData, error: offersError } = await supabase
            .from('training_offers')
            .select('*')
            .eq('institution_id', institutionData.id)
            .order('created_at', { ascending: false });

          if (offersError) throw offersError;
          setTrainingOffers(offersData || []);
        }
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveInstitution = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const institutionData = {
        user_id: user.id,
        ...institutionForm,
        is_verified: false,
        subscription_status: 'inactive' as const
      };

      if (institution) {
        // Mettre à jour
        const { error } = await supabase
          .from('training_institutions')
          .update(institutionData)
          .eq('id', institution.id);

        if (error) throw error;
      } else {
        // Créer
        const { data, error } = await supabase
          .from('training_institutions')
          .insert([institutionData])
          .select()
          .single();

        if (error) throw error;
        setInstitution(data);
      }

      toast({
        title: "Succès",
        description: "Profil de l'institution sauvegardé",
      });
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le profil",
        variant: "destructive",
      });
    }
  };

  const activateSubscription = async (plan: 'standard' | 'premium') => {
    try {
      if (!institution) return;

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 12); // 1 an

      const { error } = await supabase
        .from('training_institutions')
        .update({
          subscription_status: plan,
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: endDate.toISOString()
        })
        .eq('id', institution.id);

      if (error) throw error;

      toast({
        title: "Abonnement activé",
        description: `Votre abonnement ${plan} a été activé avec succès !`,
      });

      await loadData();
    } catch (error: any) {
      console.error('Erreur lors de l\'activation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer l'abonnement",
        variant: "destructive",
      });
    }
  };

  const saveOffer = async () => {
    try {
      if (!institution) return;

      const offerData = {
        institution_id: institution.id,
        title: offerForm.title,
        description: offerForm.description,
        category: offerForm.category,
        duration_hours: offerForm.duration_hours ? parseInt(offerForm.duration_hours) : null,
        duration_weeks: offerForm.duration_weeks ? parseInt(offerForm.duration_weeks) : null,
        price: offerForm.price ? parseFloat(offerForm.price) : null,
        currency: offerForm.currency,
        start_date: offerForm.start_date || null,
        end_date: offerForm.end_date || null,
        max_participants: offerForm.max_participants ? parseInt(offerForm.max_participants) : null,
        requirements: offerForm.requirements,
        objectives: offerForm.objectives,
        status: 'draft' as const,
        current_participants: 0
      };

      if (editingOffer) {
        // Mettre à jour
        const { error } = await supabase
          .from('training_offers')
          .update(offerData)
          .eq('id', editingOffer.id);

        if (error) throw error;
      } else {
        // Créer
        const { error } = await supabase
          .from('training_offers')
          .insert([offerData]);

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: editingOffer ? "Offre mise à jour" : "Offre créée",
      });

      setShowOfferForm(false);
      setEditingOffer(null);
      resetOfferForm();
      await loadData();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'offre",
        variant: "destructive",
      });
    }
  };

  const publishOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('training_offers')
        .update({ status: 'published' })
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: "Offre publiée",
        description: "Votre offre de formation est maintenant visible",
      });

      await loadData();
    } catch (error: any) {
      console.error('Erreur lors de la publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier l'offre",
        variant: "destructive",
      });
    }
  };

  const deleteOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('training_offers')
        .delete()
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: "Offre supprimée",
        description: "L'offre de formation a été supprimée",
      });

      await loadData();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'offre",
        variant: "destructive",
      });
    }
  };

  const resetOfferForm = () => {
    setOfferForm({
      title: '',
      description: '',
      category: '',
      duration_hours: '',
      duration_weeks: '',
      price: '',
      currency: 'XOF',
      start_date: '',
      end_date: '',
      max_participants: '',
      requirements: '',
      objectives: ''
    });
  };

  const editOffer = (offer: TrainingOffer) => {
    setEditingOffer(offer);
    setOfferForm({
      title: offer.title,
      description: offer.description,
      category: offer.category || '',
      duration_hours: offer.duration_hours?.toString() || '',
      duration_weeks: offer.duration_weeks?.toString() || '',
      price: offer.price?.toString() || '',
      currency: offer.currency,
      start_date: offer.start_date || '',
      end_date: offer.end_date || '',
      max_participants: offer.max_participants?.toString() || '',
      requirements: offer.requirements || '',
      objectives: offer.objectives || ''
    });
    setShowOfferForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Établissement de Formation</h1>
          <p className="text-muted-foreground">
            Gérez votre établissement et publiez vos offres de formation
          </p>
        </div>
        {institution && (
          <Badge 
            className={
              institution.subscription_status === 'premium' 
                ? 'bg-yellow-100 text-yellow-800' 
                : institution.subscription_status === 'standard'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }
          >
            {institution.subscription_status === 'premium' ? 'Premium' :
             institution.subscription_status === 'standard' ? 'Standard' : 'Inactif'}
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="offers">Offres de Formation</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
        </TabsList>

        {/* Profil de l'institution */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Informations de l'Établissement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="institution_name">Nom de l'établissement *</Label>
                  <Input
                    id="institution_name"
                    value={institutionForm.institution_name}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, institution_name: e.target.value }))}
                    placeholder="Nom de votre établissement"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accreditation_number">Numéro d'accréditation</Label>
                  <Input
                    id="accreditation_number"
                    value={institutionForm.accreditation_number}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, accreditation_number: e.target.value }))}
                    placeholder="Numéro d'accréditation officiel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={institutionForm.website}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://www.votre-site.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={institutionForm.phone}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+223 XX XX XX XX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={institutionForm.email}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@etablissement.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={institutionForm.city}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Bamako"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={institutionForm.description}
                  onChange={(e) => setInstitutionForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez votre établissement, ses spécialités et ses valeurs..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète</Label>
                <Textarea
                  id="address"
                  value={institutionForm.address}
                  onChange={(e) => setInstitutionForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Adresse complète de votre établissement"
                  rows={2}
                />
              </div>

              <Button onClick={saveInstitution} className="w-full md:w-auto">
                Sauvegarder le profil
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offres de formation */}
        <TabsContent value="offers">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Offres de Formation</h2>
              <Button 
                onClick={() => {
                  setShowOfferForm(true);
                  setEditingOffer(null);
                  resetOfferForm();
                }}
                disabled={!institution || institution.subscription_status === 'inactive'}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Offre
              </Button>
            </div>

            {!institution || institution.subscription_status === 'inactive' ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Abonnement requis</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous devez avoir un abonnement actif pour publier des offres de formation
                  </p>
                  <Button onClick={() => setActiveTab('subscription')}>
                    Voir les abonnements
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainingOffers.map((offer) => (
                  <Card key={offer.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2">{offer.title}</CardTitle>
                        <Badge className={getStatusColor(offer.status)}>
                          {getStatusLabel(offer.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {offer.description}
                      </p>
                      
                      <div className="space-y-2">
                        {offer.price && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span>{new Intl.NumberFormat('fr-FR').format(offer.price)} {offer.currency}</span>
                          </div>
                        )}
                        {offer.duration_hours && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{offer.duration_hours}h</span>
                          </div>
                        )}
                        {offer.max_participants && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-primary" />
                            <span>{offer.current_participants}/{offer.max_participants} participants</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editOffer(offer)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        {offer.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => publishOffer(offer.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Publier
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteOffer(offer.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Abonnement */}
        <TabsContent value="subscription">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Plans d'Abonnement</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan Standard */}
              <Card className="border-blue-500">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 text-blue-500" />
                    Plan Standard
                  </CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    150 000 XOF
                  </div>
                  <p className="text-sm text-muted-foreground">par an</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Publier jusqu'à 10 offres de formation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Gestion des participants</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Support email</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Statistiques de base</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => activateSubscription('standard')}
                    disabled={institution?.subscription_status === 'standard'}
                  >
                    {institution?.subscription_status === 'standard' ? 'Actif' : 'Activer'}
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Premium */}
              <Card className="border-yellow-500 bg-yellow-50">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Plan Premium
                  </CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    300 000 XOF
                  </div>
                  <p className="text-sm text-muted-foreground">par an</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Publications illimitées</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Mise en avant des offres</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Support prioritaire</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Statistiques avancées</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Certificats personnalisés</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => activateSubscription('premium')}
                    disabled={institution?.subscription_status === 'premium'}
                  >
                    {institution?.subscription_status === 'premium' ? 'Actif' : 'Activer'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Statut actuel */}
            {institution && institution.subscription_status !== 'inactive' && (
              <Card>
                <CardHeader>
                  <CardTitle>Abonnement Actuel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Plan</p>
                      <p className="font-semibold capitalize">{institution.subscription_status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Début</p>
                      <p className="font-semibold">
                        {institution.subscription_start_date 
                          ? new Date(institution.subscription_start_date).toLocaleDateString('fr-FR')
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expire le</p>
                      <p className="font-semibold">
                        {institution.subscription_end_date 
                          ? new Date(institution.subscription_end_date).toLocaleDateString('fr-FR')
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal pour créer/modifier une offre */}
      {showOfferForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingOffer ? 'Modifier l\'offre' : 'Nouvelle offre de formation'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de la formation *</Label>
                  <Input
                    id="title"
                    value={offerForm.title}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de votre formation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Input
                    id="category"
                    value={offerForm.category}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Ex: Management, Informatique, RH"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_hours">Durée (heures)</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    value={offerForm.duration_hours}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, duration_hours: e.target.value }))}
                    placeholder="40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_weeks">Durée (semaines)</Label>
                  <Input
                    id="duration_weeks"
                    type="number"
                    value={offerForm.duration_weeks}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, duration_weeks: e.target.value }))}
                    placeholder="4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Prix</Label>
                  <Input
                    id="price"
                    type="number"
                    value={offerForm.price}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_participants">Nombre max de participants</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={offerForm.max_participants}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, max_participants: e.target.value }))}
                    placeholder="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Date de début</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={offerForm.start_date}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Date de fin</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={offerForm.end_date}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={offerForm.description}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez votre formation en détail..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives">Objectifs</Label>
                <Textarea
                  id="objectives"
                  value={offerForm.objectives}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, objectives: e.target.value }))}
                  placeholder="Quels sont les objectifs de cette formation ?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Prérequis</Label>
                <Textarea
                  id="requirements"
                  value={offerForm.requirements}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="Quels sont les prérequis pour suivre cette formation ?"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={saveOffer} className="flex-1">
                  {editingOffer ? 'Mettre à jour' : 'Créer l\'offre'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowOfferForm(false);
                    setEditingOffer(null);
                    resetOfferForm();
                  }}
                >
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

export default TrainingInstitutionDashboard;
