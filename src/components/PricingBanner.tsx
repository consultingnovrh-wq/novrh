import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Zap, Building, Crown } from 'lucide-react';

interface PricingBannerProps {
  variant?: 'default' | 'compact';
  className?: string;
}

const PricingBanner = ({ variant = 'default', className = '' }: PricingBannerProps) => {
  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-primary to-primary-dark text-white p-4 rounded-lg ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Star className="h-5 w-5 text-yellow-300" />
            <span className="font-medium">Débloquez toutes les fonctionnalités</span>
          </div>
          <Button 
            size="sm" 
            variant="secondary"
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => window.location.href = '/pricing'}
          >
            Voir les tarifs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-xl ${className}`}>
      <div className="text-center max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">
          Prêt à passer au niveau supérieur ?
        </h3>
        <p className="text-lg text-blue-100 mb-6">
          Découvrez nos plans premium et accédez à toutes les fonctionnalités de NovRH Consulting
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 rounded-lg p-4">
            <Star className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Étudiants</h4>
            <p className="text-sm text-blue-100">15€ - 7 500 FCFA</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Zap className="h-8 w-8 text-blue-300 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Entreprises</h4>
            <p className="text-sm text-blue-100">45 000 - 300 000 FCFA/mois</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4 border-2 border-yellow-300">
            <Building className="h-8 w-8 text-green-300 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Recrutement</h4>
            <p className="text-sm text-blue-100">5% - 15% du salaire</p>
            <Badge className="bg-yellow-500 text-black text-xs mt-1">Populaire</Badge>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Crown className="h-8 w-8 text-purple-300 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Éducation</h4>
            <p className="text-sm text-blue-100">Sur devis</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => window.location.href = '/pricing'}
          >
            Comparer les plans
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary"
            onClick={() => window.location.href = '/contact'}
          >
            Contacter l'équipe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingBanner;
