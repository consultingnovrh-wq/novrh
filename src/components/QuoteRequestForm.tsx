import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/services/emailService';
import { Mail, Phone, Building2, User, MessageSquare } from 'lucide-react';

interface QuoteRequestData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  serviceType: string;
  budget: string;
  timeline: string;
  description: string;
  additionalInfo: string;
}

const QuoteRequestForm = () => {
  const [formData, setFormData] = useState<QuoteRequestData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    serviceType: '',
    budget: '',
    timeline: '',
    description: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const serviceTypes = [
    'Recrutement',
    'Formation',
    'Audit RH',
    'Conseil en Management',
    'Développement Organisationnel',
    'QHSE',
    'RSE',
    'Autre'
  ];

  const budgetRanges = [
    'Moins de 500 000 FCFA',
    '500 000 - 1 000 000 FCFA',
    '1 000 000 - 2 500 000 FCFA',
    '2 500 000 - 5 000 000 FCFA',
    'Plus de 5 000 000 FCFA',
    'À définir'
  ];

  const timelines = [
    'Urgent (moins d\'1 mois)',
    'Court terme (1-3 mois)',
    'Moyen terme (3-6 mois)',
    'Long terme (plus de 6 mois)',
    'Flexible'
  ];

  const handleInputChange = (field: keyof QuoteRequestData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sauvegarder la demande de devis dans la base de données
      const { data, error } = await supabase
        .from('quote_requests')
        .insert([
          {
            company_name: formData.companyName,
            contact_name: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            service_type: formData.serviceType,
            budget_range: formData.budget,
            timeline: formData.timeline,
            description: formData.description,
            additional_info: formData.additionalInfo,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Envoyer les emails de notification
      try {
        await Promise.all([
          emailService.sendQuoteRequestNotification(formData),
          emailService.sendQuoteRequestConfirmation(formData)
        ]);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi des emails:', emailError);
        // Ne pas faire échouer la soumission si l'email échoue
      }

      toast({
        title: "Demande envoyée avec succès",
        description: "Votre demande de devis a été transmise à notre équipe. Nous vous contacterons dans les plus brefs délais.",
      });

      // Réinitialiser le formulaire
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        serviceType: '',
        budget: '',
        timeline: '',
        description: '',
        additionalInfo: ''
      });

    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Demande de Devis
        </CardTitle>
        <p className="text-muted-foreground">
          Remplissez ce formulaire pour recevoir un devis personnalisé pour nos services
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Nom de l'entreprise *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Nom de votre entreprise"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nom du contact *
              </Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                placeholder="Votre nom complet"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="votre.email@entreprise.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Téléphone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+223 XX XX XX XX"
              />
            </div>
          </div>

          {/* Détails du service */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Type de service *</Label>
              <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Budget estimé</Label>
              <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une fourchette" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeline">Délai souhaité</Label>
              <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un délai" />
                </SelectTrigger>
                <SelectContent>
                  {timelines.map((timeline) => (
                    <SelectItem key={timeline} value={timeline}>
                      {timeline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description du projet */}
          <div className="space-y-2">
            <Label htmlFor="description">Description du projet *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez votre projet en détail..."
              rows={4}
              required
            />
          </div>

          {/* Informations supplémentaires */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Informations supplémentaires</Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Toute information supplémentaire qui pourrait nous aider à mieux comprendre vos besoins..."
              rows={3}
            />
          </div>

          {/* Bouton de soumission */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto px-8"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuoteRequestForm;
