import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecruiterSubscriptionPlans from '@/components/RecruiterSubscriptionPlans';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Eye, Briefcase, Star, Shield, Zap } from 'lucide-react';

const RecruiterSubscription = () => {
  const [user, setUser] = useState<any>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et a un abonnement actif
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    // Ici vous pouvez vérifier le statut de l'utilisateur
    // setUser(currentUser);
    // setHasActiveSubscription(hasActive);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Plans d'Abonnement Recruteur
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Accédez aux CV des meilleurs candidats et publiez vos offres d'emploi avec nos plans d'abonnement flexibles.
          </p>
          
          {hasActiveSubscription && (
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg">
              <CheckCircle className="w-5 h-5 mr-2" />
              Abonnement actif
            </Badge>
          )}
        </div>

        {/* Avantages des abonnements */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
            Pourquoi s'abonner ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Accès aux CV</h3>
              <p className="text-sm text-muted-foreground">
                Consultez les CV des candidats qualifiés et trouvez les profils qui correspondent à vos besoins
              </p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Publier des Offres</h3>
              <p className="text-sm text-muted-foreground">
                Diffusez vos offres d'emploi et attirez les meilleurs candidats
              </p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Réseau étendu</h3>
              <p className="text-sm text-muted-foreground">
                Accédez à notre réseau de candidats dans toute l'Afrique de l'Ouest
              </p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Support Prioritaire</h3>
              <p className="text-sm text-muted-foreground">
                Bénéficiez d'un support client dédié pour optimiser vos recrutements
              </p>
            </Card>
          </div>
        </div>

        {/* Plans d'abonnement */}
        <RecruiterSubscriptionPlans />

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
            Questions Fréquentes
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment fonctionne l'accès aux CV ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Avec votre abonnement, vous pouvez consulter les CV des candidats inscrits sur notre plateforme. 
                  Le nombre de consultations dépend de votre plan d'abonnement.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je changer de plan à tout moment ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui, vous pouvez mettre à niveau votre plan à tout moment. 
                  Les frais seront calculés au prorata pour le reste de votre période d'abonnement.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Y a-t-il un essai gratuit ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nous offrons un essai gratuit de 7 jours pour tous nos nouveaux utilisateurs. 
                  Aucune carte de crédit n'est requise pour commencer.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment annuler mon abonnement ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. 
                  Votre accès restera actif jusqu'à la fin de votre période de facturation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-primary text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Prêt à commencer ?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Rejoignez des centaines d'entreprises qui font confiance à NovRH pour leurs recrutements.
              </p>
              <Button size="lg" variant="secondary" className="px-8">
                <Zap className="w-5 h-5 mr-2" />
                Commencer l'essai gratuit
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecruiterSubscription;
