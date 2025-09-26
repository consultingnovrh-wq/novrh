import { useState } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, Building2, Users, Target, Star, Crown, Clock, Shield, TrendingUp, Headphones } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

const CompanyServices = () => {
  const { plans, userSubscription, subscribeToPlan } = useSubscription();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('yearly');

  const getCompanyPlans = () => plans.filter(plan => 
    plan.name.includes('Recrutement') && plan.duration_days === (selectedPeriod === 'monthly' ? 30 : 365)
  );

  const getCompleteRecruitmentPlans = () => getCompanyPlans().filter(plan => 
    plan.name.includes('Recrutement Complet')
  );

  const getPartialRecruitmentPlans = () => getCompanyPlans().filter(plan => 
    plan.name.includes('Recrutement Partiel')
  );

  const getAutonomyPlans = () => getCompanyPlans().filter(plan => 
    plan.name.includes('Recrutement Autonomie')
  );

  const handleSubscribe = async (planId: string) => {
    try {
      await subscribeToPlan(planId);
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'EUR') {
      return `${price}€`;
    } else if (currency === 'XOF') {
      return `${price.toLocaleString('fr-FR')} FCFA`;
    }
    return `${price} ${currency}`;
  };

  const formatPricePerPeriod = (price: number, currency: string, durationDays: number) => {
    if (durationDays === 30) {
      return `${formatPrice(price, currency)}/mois`;
    } else if (durationDays === 365) {
      return `${formatPrice(price, currency)}/an`;
    }
    return formatPrice(price, currency);
  };

  return (
    <ProtectedRoute serviceName="Poster une offre">
      <div className="min-h-screen">
        <Header />
        <main className="pt-16">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-green-600 to-blue-700 text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Solutions de Recrutement pour Entreprises
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Trois niveaux de service adaptés à vos besoins de recrutement, 
                avec des tarifs transparents basés sur la taille de votre entreprise.
              </p>
            </div>
          </section>

          {/* Services Overview */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Nos Services de Recrutement
                </h2>
                <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                  Choisissez le niveau de service qui correspond à vos besoins et à votre budget. 
                  Tous nos services incluent l'accès à notre plateforme et notre expertise.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <Card className="text-center p-6 border-2 border-green-200">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Recrutement Complet
                  </h3>
                  <p className="text-gray-600">
                    Service de A à Z avec accompagnement à l'intégration
                  </p>
                </Card>

                <Card className="text-center p-6 border-2 border-blue-200">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Recrutement Partiel
                  </h3>
                  <p className="text-gray-600">
                    Suivi depuis l'espace employeur avec support technique
                  </p>
                </Card>

                <Card className="text-center p-6 border-2 border-orange-200">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Recrutement Autonomie
                  </h3>
                  <p className="text-gray-600">
                    Accès à la plateforme avec accompagnement léger
                  </p>
                </Card>
              </div>

              {/* Toggle Mensuel/Annuel */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className={`text-lg ${selectedPeriod === 'yearly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                  Annuel
                </span>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setSelectedPeriod(selectedPeriod === 'monthly' ? 'yearly' : 'monthly')}
                  className="relative px-8"
                >
                  <div className={`w-6 h-6 bg-primary rounded-full transition-transform duration-200 ${
                    selectedPeriod === 'monthly' ? 'translate-x-2' : '-translate-x-2'
                  }`} />
                </Button>
                <span className={`text-lg ${selectedPeriod === 'monthly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                  Mensuel
                </span>
                {selectedPeriod === 'yearly' && (
                  <Badge variant="secondary" className="ml-2">
                    Économies de 2 mois
                  </Badge>
                )}
              </div>

              {/* Pricing Cards */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recrutement Complet */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                      <Crown className="w-6 h-6 text-yellow-500" />
                      Recrutement Complet
                    </h3>
                    <p className="text-gray-600">
                      De la publication à l'intégration
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      Service Premium
                    </Badge>
                  </div>
                  
                  {getCompleteRecruitmentPlans().map((plan) => (
                    <Card key={plan.id} className="relative border-2 border-yellow-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <div className="text-2xl font-bold text-primary mt-2">
                          {formatPricePerPeriod(plan.price, plan.currency, plan.duration_days)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        <Button 
                          onClick={() => handleSubscribe(plan.id)} 
                          className="w-full mt-4"
                          disabled={!!userSubscription}
                        >
                          {userSubscription ? 'Abonné' : 'Choisir ce plan'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recrutement Partiel */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                      <Star className="w-6 h-6 text-blue-500" />
                      Recrutement Partiel
                    </h3>
                    <p className="text-gray-600">
                      Suivi depuis l'espace employeur
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      Service Intermédiaire
                    </Badge>
                  </div>
                  
                  {getPartialRecruitmentPlans().map((plan) => (
                    <Card key={plan.id} className="relative border-2 border-blue-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <div className="text-2xl font-bold text-primary mt-2">
                          {formatPricePerPeriod(plan.price, plan.currency, plan.duration_days)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        <Button 
                          onClick={() => handleSubscribe(plan.id)} 
                          className="w-full mt-4"
                          disabled={!!userSubscription}
                        >
                          {userSubscription ? 'Abonné' : 'Choisir ce plan'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recrutement en Autonomie */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                      <Building2 className="w-6 h-6 text-green-500" />
                      Recrutement Autonomie
                    </h3>
                    <p className="text-gray-600">
                      Accompagnement léger
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      Service de Base
                    </Badge>
                  </div>
                  
                  {getAutonomyPlans().map((plan) => (
                    <Card key={plan.id} className="relative border-2 border-green-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <div className="text-2xl font-bold text-primary mt-2">
                          {formatPricePerPeriod(plan.price, plan.currency, plan.duration_days)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        <Button 
                          onClick={() => handleSubscribe(plan.id)} 
                          className="w-full mt-4"
                          disabled={!!userSubscription}
                        >
                          {userSubscription ? 'Abonné' : 'Choisir ce plan'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="mt-16 p-8 bg-blue-50 rounded-lg">
                <h4 className="text-xl font-semibold text-blue-900 mb-4">
                  💡 Informations importantes
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-blue-800 mb-2">Recrutement complet :</h5>
                    <ul className="text-blue-700 space-y-1 text-sm">
                      <li>• Service de A à Z avec accompagnement à l'intégration</li>
                      <li>• Support dédié et personnalisé</li>
                      <li>• Gestion des volumes pour grandes entreprises</li>
                      <li>• Accompagnement stratégique inclus</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-800 mb-2">Recrutement partiel :</h5>
                    <ul className="text-blue-700 space-y-1 text-sm">
                      <li>• Suivi depuis votre espace employeur</li>
                      <li>• Support technique et accompagnement léger</li>
                      <li>• Gestion des volumes selon la taille</li>
                      <li>• Support avancé pour grandes entreprises</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Note :</strong> Les tarifs annuels vous font économiser l'équivalent de 2 mois 
                    par rapport aux tarifs mensuels. Nous recommandons l'abonnement annuel pour 
                    une meilleure planification et des économies significatives.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Comparison */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Comparaison des Services
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Découvrez ce qui est inclus dans chaque niveau de service
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 p-4 text-left font-semibold text-gray-900">Fonctionnalités</th>
                      <th className="border border-gray-200 p-4 text-center font-semibold text-gray-900">Recrutement Autonomie</th>
                      <th className="border border-gray-200 p-4 text-center font-semibold text-gray-900">Recrutement Partiel</th>
                      <th className="border border-gray-200 p-4 text-center font-semibold text-gray-900">Recrutement Complet</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-4 font-medium">Accès à la plateforme</td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 p-4 font-medium">Publication d'annonces</td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-4 font-medium">Suivi des candidatures</td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 p-4 font-medium">Espace employeur</td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-4 font-medium">Accompagnement léger</td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 p-4 font-medium">Support technique</td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-4 font-medium">Gestion des volumes</td>
                      <td className="border border-gray-200 p-4 text-center">-</td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 p-4 font-medium">Accompagnement à l'intégration</td>
                      <td className="border border-gray-200 p-4 text-center">-</td>
                      <td className="border border-gray-200 p-4 text-center">-</td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-4 font-medium">Support dédié</td>
                      <td className="border border-gray-200 p-4 text-center">-</td>
                      <td className="border border-gray-200 p-4 text-center">-</td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 p-4 font-medium">Accompagnement stratégique</td>
                      <td className="border border-gray-200 p-4 text-center">-</td>
                      <td className="border border-gray-200 p-4 text-center">-</td>
                      <td className="border border-gray-200 p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-green-600 to-blue-700 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à optimiser votre recrutement ?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Choisissez le service qui correspond à vos besoins et commencez 
                à recruter les meilleurs talents dès aujourd'hui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <a href="/pricing">Voir tous nos tarifs</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <a href="/contact">Nous contacter</a>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default CompanyServices;
