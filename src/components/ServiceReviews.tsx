import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/services/emailService';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Send, 
  Plus,
  Filter,
  StarIcon,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface ServiceReview {
  id: string;
  user_id: string;
  service_type: string;
  rating: number;
  title: string;
  comment: string;
  is_anonymous: boolean;
  is_verified: boolean;
  is_approved: boolean;
  admin_notes?: string;
  created_at: string;
  user_name?: string;
  responses?: ReviewResponse[];
  reactions?: ReviewReaction[];
}

interface ReviewResponse {
  id: string;
  review_id: string;
  responder_id: string;
  response_text: string;
  is_admin_response: boolean;
  created_at: string;
  responder_name?: string;
}

interface ReviewReaction {
  id: string;
  review_id: string;
  user_id: string;
  reaction_type: string;
}

interface RatingStats {
  total_reviews: number;
  average_rating: number;
  rating_1_count: number;
  rating_2_count: number;
  rating_3_count: number;
  rating_4_count: number;
  rating_5_count: number;
}

const ServiceReviews = () => {
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const [reviewForm, setReviewForm] = useState({
    service_type: '',
    rating: 5,
    title: '',
    comment: '',
    is_anonymous: false
  });

  const serviceTypes = [
    { value: 'recruitment', label: 'Recrutement' },
    { value: 'training', label: 'Formation' },
    { value: 'consulting', label: 'Conseil RH' },
    { value: 'audit', label: 'Audit RH' },
    { value: 'general', label: 'Service général' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger l'utilisateur connecté
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      // Charger les statistiques globales
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_service_rating_stats', { service_type_param: 'general' });

      if (statsError) throw statsError;
      setRatingStats(statsData?.[0] || null);

      // Charger les avis récents
      const { data: reviewsData, error: reviewsError } = await supabase
        .rpc('get_recent_reviews', { limit_count: 50 });

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);

    } catch (error: any) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les avis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    try {
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour laisser un avis",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('service_reviews')
        .insert([
          {
            user_id: user.id,
            service_type: reviewForm.service_type,
            rating: reviewForm.rating,
            title: reviewForm.title,
            comment: reviewForm.comment,
            is_anonymous: reviewForm.is_anonymous,
            is_approved: false // Nécessite approbation admin
          }
        ]);

      if (error) throw error;

      // Envoyer une notification email à l'admin
      try {
        await emailService.sendReviewNotification({
          userName: user.user_metadata?.full_name || 'Utilisateur',
          serviceType: reviewForm.service_type,
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
          isAnonymous: reviewForm.is_anonymous
        });
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de la notification:', emailError);
        // Ne pas faire échouer la soumission si l'email échoue
      }

      toast({
        title: "Avis soumis",
        description: "Votre avis a été soumis et sera publié après validation",
      });

      setShowReviewForm(false);
      setReviewForm({
        service_type: '',
        rating: 5,
        title: '',
        comment: '',
        is_anonymous: false
      });

      await loadData();
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre l'avis",
        variant: "destructive",
      });
    }
  };

  const addReaction = async (reviewId: string, reactionType: string) => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('review_reactions')
        .upsert([
          {
            review_id: reviewId,
            user_id: user.id,
            reaction_type: reactionType
          }
        ], {
          onConflict: 'review_id,user_id,reaction_type'
        });

      if (error) throw error;

      await loadData();
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de réaction:', error);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  const getServiceTypeLabel = (type: string) => {
    return serviceTypes.find(s => s.value === type)?.label || type;
  };

  const getServiceTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      recruitment: 'bg-blue-100 text-blue-800',
      training: 'bg-green-100 text-green-800',
      consulting: 'bg-purple-100 text-purple-800',
      audit: 'bg-orange-100 text-orange-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredReviews = reviews.filter(review => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'approved' && review.is_approved) ||
      (activeTab === 'pending' && !review.is_approved);
    
    const matchesService = serviceFilter === 'all' || review.service_type === serviceFilter;
    
    return matchesTab && matchesService;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des avis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Avis Clients
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez ce que nos clients pensent de nos services et partagez votre expérience
        </p>
      </div>

      {/* Statistiques globales */}
      {ratingStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Aperçu des Avis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {ratingStats.average_rating?.toFixed(1) || '0.0'}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(ratingStats.average_rating || 0))}
                </div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {ratingStats.total_reviews || 0}
                </div>
                <p className="text-sm text-muted-foreground">Total des avis</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {ratingStats.rating_5_count || 0}
                </div>
                <p className="text-sm text-muted-foreground">5 étoiles</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {Math.round(((ratingStats.rating_4_count || 0) + (ratingStats.rating_5_count || 0)) / (ratingStats.total_reviews || 1) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Clients satisfaits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bouton pour laisser un avis */}
      <div className="text-center">
        <Button 
          onClick={() => setShowReviewForm(true)}
          size="lg"
          className="px-8"
        >
          <Plus className="w-5 h-5 mr-2" />
          Laisser un avis
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Filtrer par service</Label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les services</SelectItem>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {filteredReviews.length} avis
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des avis */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getServiceTypeColor(review.service_type)}>
                      {getServiceTypeLabel(review.service_type)}
                    </Badge>
                    {review.is_verified && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                    {!review.is_approved && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        En attente
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{review.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{review.is_anonymous ? 'Utilisateur anonyme' : review.user_name || 'Utilisateur'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(review.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{review.comment}</p>
              
              {/* Réactions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addReaction(review.id, 'like')}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Utile
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addReaction(review.id, 'helpful')}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Recommande
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal pour laisser un avis */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Laisser un avis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="service_type">Type de service *</Label>
                <Select 
                  value={reviewForm.service_type} 
                  onValueChange={(value) => setReviewForm(prev => ({ ...prev, service_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Note *</Label>
                <div className="flex items-center gap-2">
                  {renderStars(reviewForm.rating, true, (rating) => 
                    setReviewForm(prev => ({ ...prev, rating }))
                  )}
                  <span className="text-sm text-muted-foreground ml-2">
                    {reviewForm.rating} étoile{reviewForm.rating > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre de votre avis *</Label>
                <Input
                  id="title"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Résumez votre expérience en quelques mots"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Votre avis détaillé *</Label>
                <Textarea
                  id="comment"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Décrivez votre expérience avec nos services..."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_anonymous"
                  checked={reviewForm.is_anonymous}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, is_anonymous: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="is_anonymous" className="text-sm">
                  Publier de manière anonyme
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={submitReview} 
                  className="flex-1"
                  disabled={!reviewForm.service_type || !reviewForm.title || !reviewForm.comment}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Publier l'avis
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowReviewForm(false)}
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

export default ServiceReviews;
