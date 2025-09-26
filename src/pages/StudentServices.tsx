import { useState } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, FileText, User, Globe, Mail, Star, Clock, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

const StudentServices = () => {
  const { plans, userSubscription, subscribeToPlan } = useSubscription();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const getStudentPlans = () => plans.filter(plan => 
    plan.name.includes('Étudiant') && plan.duration_days === 365
  );

  const getInternationalPlans = () => getStudentPlans().filter(plan => plan.currency === 'EUR');
  const getMalianPlans = () => getStudentPlans().filter(plan => plan.currency === 'XOF');

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

  return (
    <ProtectedRoute serviceName="Coaching CV Étudiant">
      <div className="min-h-screen">
        <Header />
        <main className="pt-16">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Services Étudiants
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Accélérez votre carrière avec nos services de coaching personnalisés. 
                CV, lettre de motivation et accompagnement expert pour réussir votre insertion professionnelle.
              </p>
            </div>
          </section>

          {/* Services Overview */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Nos Services Étudiants
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Des solutions adaptées à votre profil et à votre localisation, 
                  avec des tarifs transparents et un accompagnement de qualité.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <Card className="text-center p-6 border-2 border-blue-200">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Coaching CV
                  </h3>
                  <p className="text-gray-600">
                    CV personnalisé et optimisé pour maximiser vos chances d'être sélectionné
                  </p>
                </Card>

                <Card className="text-center p-6 border-2 border-purple-200">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Lettre de Motivation
                  </h3>
                  <p className="text-gray-600">
                    Lettre de motivation percutante qui vous démarque des autres candidats
                  </p>
                </Card>

                <Card className="text-center p-6 border-2 border-green-200">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Pack Complet
                  </h3>
                  <p className="text-gray-600">
                    CV + Lettre de motivation avec une réduction attractive
                  </p>
                </Card>
              </div>

              {/* Pricing Tabs */}
              <Tabs defaultValue="international" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-12">
                  <TabsTrigger value="international" className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Étudiants Internationaux
                  </TabsTrigger>
                  <TabsTrigger value="malian" className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Étudiants Maliens
                  </TabsTrigger>
                </TabsList>

                {/* Étudiants Internationaux */}
                <TabsContent value="international" className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      🌍 Tarifs Internationaux
                    </h3>
                    <p className="text-gray-600">
                      France ou à l'étranger – hors Mali
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {getInternationalPlans().map((plan) => (
                      <Card key={plan.id} className="relative hover:shadow-lg transition-shadow">
                        <CardHeader className="text-center pb-4">
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                          <div className="text-3xl font-bold text-blue-600 mt-2">
                            {formatPrice(plan.price, plan.currency)}
                          </div>
                          <Badge variant="secondary" className="mt-2">
                            International
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          <Separator />
                          
                          <div className="text-center">
                            <Button 
                              onClick={() => handleSubscribe(plan.id)} 
                              className="w-full"
                              disabled={!!userSubscription}
                            >
                              {userSubscription ? 'Déjà abonné' : 'Choisir ce service'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Étudiants Maliens */}
                <TabsContent value="malian" className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      🇲🇱 Tarifs Maliens
                    </h3>
                    <p className="text-gray-600">
                      Étudiants vivant au Mali
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {getMalianPlans().map((plan) => (
                      <Card key={plan.id} className="relative hover:shadow-lg transition-shadow">
                        <CardHeader className="text-center pb-4">
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                          <div className="text-3xl font-bold text-green-600 mt-2">
                            {formatPrice(plan.price, plan.currency)}
                          </div>
                          <Badge variant="secondary" className="mt-2">
                            Mali
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          <Separator />
                          
                          <div className="text-center">
                            <Button 
                              onClick={() => handleSubscribe(plan.id)} 
                              className="w-full"
                              disabled={!!userSubscription}
                            >
                              {userSubscription ? 'Déjà abonné' : 'Choisir ce service'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Comment ça marche ?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Un processus simple en 4 étapes pour obtenir votre CV et lettre de motivation optimisés
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Choisissez votre service
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Sélectionnez le service qui correspond à vos besoins
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Remplissez le formulaire
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Partagez vos informations et objectifs professionnels
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Travail collaboratif
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Nos experts travaillent avec vous pour personnaliser vos documents
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-600">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Recevez vos documents
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Obtenez vos documents optimisés et prêts à utiliser
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Pourquoi choisir nos services ?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Une expertise reconnue et des résultats prouvés pour votre réussite professionnelle
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="p-6 border-0 shadow-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Expertise reconnue
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Plus de 1000 étudiants accompagnés avec succès dans leur insertion professionnelle
                  </p>
                </Card>

                <Card className="p-6 border-0 shadow-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Accompagnement personnalisé
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Un suivi individualisé et des conseils adaptés à votre profil et vos objectifs
                  </p>
                </Card>

                <Card className="p-6 border-0 shadow-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Résultats garantis
                  </h3>
                  <p className="text-gray-600 text-sm">
                    95% de nos étudiants obtiennent des entretiens dans les 3 mois suivant nos services
                  </p>
                </Card>

                <Card className="p-6 border-0 shadow-lg">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Support international
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Services disponibles partout dans le monde avec des tarifs adaptés à chaque région
                  </p>
                </Card>

                <Card className="p-6 border-0 shadow-lg">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Documents optimisés
                  </h3>
                  <p className="text-gray-600 text-sm">
                    CV et lettres de motivation optimisés selon les standards internationaux
                  </p>
                </Card>

                <Card className="p-6 border-0 shadow-lg">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Suivi post-service
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Accompagnement continu et conseils pour optimiser vos candidatures
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à booster votre carrière ?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Rejoignez les milliers d'étudiants qui ont transformé leur avenir professionnel 
                grâce à nos services de coaching personnalisés.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <a href="/pricing">Voir nos tarifs</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
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

export default StudentServices;
