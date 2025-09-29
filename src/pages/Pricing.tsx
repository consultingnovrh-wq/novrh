import { useState } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, Crown, GraduationCap, Building2, Users, Star, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Pricing = () => {
  const { plans, userSubscription, loading, subscribeToPlan } = useSubscription();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('yearly');

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

  const getStudentPlans = () => plans.filter(plan => 
    plan.name.includes('Étudiant') && plan.duration_days === 365
  );

  const getCompanyPlans = () => plans.filter(plan => 
    plan.name.includes('Recrutement') && plan.duration_days === (selectedPeriod === 'monthly' ? 30 : 365)
  );

  const getAuditRHPlans = () => [
    {
      id: 'audit-1',
      name: 'Audit RH & Organisationnel',
      description: 'Diagnostic complet des dysfonctionnements RH, juridiques et santé au travail',
      price: null,
      currency: 'FCFA',
      features: [
        'Questionnaire aux collaborateurs & dirigeants',
        'Observation du site',
        'Analyse des procédures internes RH',
        'Étude documentaire complète',
        'Diagnostic global + schématisation',
        'Proposition d\'actions correctives',
        'Suivi de mise en œuvre (optionnel)'
      ],
      pricing: 'Sur devis'
    }
  ];

  const getFormationPlans = () => [
    {
      id: 'formation-1',
      name: 'Recrutement efficace et sans biais',
      description: 'Formation sur les techniques de recrutement efficaces',
      price: null,
      currency: 'FCFA',
      features: ['Techniques de recrutement', 'Prévention des biais', 'Présentiel ou à distance'],
      pricing: 'Sur devis'
    },
    {
      id: 'formation-2',
      name: 'Règles SST et obligations légales',
      description: 'Formation sur la sécurité et santé au travail',
      price: null,
      currency: 'FCFA',
      features: ['Sécurité au travail', 'Obligations légales', 'Présentiel ou à distance'],
      pricing: 'Sur devis'
    },
    {
      id: 'formation-3',
      name: 'Dialogue social et droit du travail',
      description: 'Formation sur le dialogue social et aspects juridiques',
      price: null,
      currency: 'FCFA',
      features: ['Dialogue social', 'Droit du travail', 'Relations sociales', 'Présentiel ou à distance'],
      pricing: 'Sur devis'
    },
    {
      id: 'formation-4',
      name: 'Leadership et communication',
      description: 'Formation sur le leadership et communication interne',
      price: null,
      currency: 'FCFA',
      features: ['Leadership', 'Communication interne', 'Gestion du stress', 'Présentiel ou à distance'],
      pricing: 'Sur devis'
    },
    {
      id: 'formation-5',
      name: 'Prévention des risques professionnels',
      description: 'Formation sur la prévention et gestion des risques',
      price: null,
      currency: 'FCFA',
      features: ['Prévention des risques', 'Gestion des risques', 'Présentiel ou à distance'],
      pricing: 'Sur devis'
    },
    {
      id: 'formation-6',
      name: 'Gestion de conflits et motivation',
      description: 'Formation sur la gestion des conflits et motivation des équipes',
      price: null,
      currency: 'FCFA',
      features: ['Gestion des conflits', 'Motivation des équipes', 'Présentiel ou à distance'],
      pricing: 'Sur devis'
    },
    {
      id: 'formation-7',
      name: 'Guide file/Serre file',
      description: 'Formation théorique et pratique sur les techniques de guide file',
      price: null,
      currency: 'FCFA',
      features: ['Formation théorique', 'Formation pratique', 'Présentiel ou à distance'],
      pricing: 'Sur devis'
    }
  ];

  const getStudentServicePlans = () => [
    {
      id: 'student-1',
      name: 'Définir un projet professionnel',
      description: 'Accompagnement pour définir un projet professionnel réaliste',
      price: null,
      currency: 'FCFA',
      features: ['Orientation carrière', 'Planification carrière', 'Accompagnement personnalisé'],
      pricing: 'Sur devis'
    },
    {
      id: 'student-2',
      name: 'Apprendre à chercher un emploi',
      description: 'Formation sur les techniques de recherche d\'emploi efficaces',
      price: null,
      currency: 'FCFA',
      features: ['Techniques de recherche', 'Stratégies de candidature', 'Accompagnement personnalisé'],
      pricing: 'Sur devis'
    },
    {
      id: 'student-3',
      name: 'Créer un réseau professionnel',
      description: 'Formation et accompagnement pour développer un réseau professionnel',
      price: null,
      currency: 'FCFA',
      features: ['Networking', 'Développement réseau', 'Stratégies networking', 'Accompagnement personnalisé'],
      pricing: 'Sur devis'
    },
    {
      id: 'student-4',
      name: 'Trouver des financements',
      description: 'Accompagnement pour identifier et obtenir des financements',
      price: null,
      currency: 'FCFA',
      features: ['Financements', 'Subventions', 'Aides projets', 'Accompagnement démarches'],
      pricing: 'Sur devis'
    },
    {
      id: 'student-5',
      name: 'Développer une posture professionnelle',
      description: 'Formation sur le développement d\'une posture professionnelle adaptée',
      price: null,
      currency: 'FCFA',
      features: ['Posture professionnelle', 'Développement personnel', 'Soft skills', 'Accompagnement personnalisé'],
      pricing: 'Sur devis'
    }
  ];

  const getEducationalPlans = () => [
    {
      id: 'edu-1',
      name: 'Modules de cours',
      description: 'Modules de cours personnalisés pour établissements',
      price: null,
      currency: 'XOF',
      features: ['Modules sur mesure', 'Contenu adapté', 'Support pédagogique', 'Suivi des progrès'],
      pricing: 'Sur devis'
    },
    {
      id: 'edu-2',
      name: 'Séance CV & Lettre de motivation',
      description: 'Séance de formation pour une classe',
      price: 100000,
      currency: 'XOF',
      features: ['Formation en classe', 'Support pédagogique', 'Matériel inclus', 'Suivi post-formation'],
      pricing: '100 000 FCFA par classe'
    },
    {
      id: 'edu-3',
      name: 'Accompagnement CDI/Contrat',
      description: 'Accompagnement jusqu\'au premier CDI ou contrat',
      price: null,
      currency: 'XOF',
      features: ['Accompagnement personnalisé', 'Suivi individualisé', 'Support post-placement', 'Évaluation continue'],
      pricing: 'Sur devis (selon le nombre d\'étudiants)'
    }
  ];

  const handleSubscribe = async (planId: string) => {
    try {
      await subscribeToPlan(planId);
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Chargement des plans d'abonnement...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tarification Transparente
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Des solutions adaptées à chaque profil : étudiants, entreprises et établissements éducatifs. 
              Choisissez le plan qui correspond à vos besoins.
            </p>
          </div>
        </section>

        {/* Pricing Tabs */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="students" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-12">
                <TabsTrigger value="students" className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Étudiants
                </TabsTrigger>
                <TabsTrigger value="companies" className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Entreprises
                </TabsTrigger>
                <TabsTrigger value="educational" className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Établissements
                </TabsTrigger>
              </TabsList>

              {/* Étudiants */}
              <TabsContent value="students" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Services pour Étudiants
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Des services personnalisés pour vous accompagner dans votre parcours professionnel, 
                    que vous soyez au Mali ou à l'international.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Étudiants Internationaux */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        🌍 Étudiants Internationaux
                      </h3>
                      <p className="text-gray-600">
                        France ou à l'étranger – hors Mali
                      </p>
                    </div>
                    
                    {getStudentPlans()
                      .filter(plan => plan.currency === 'EUR')
                      .map((plan) => (
                        <Card key={plan.id} className="relative">
                          <CardHeader className="text-center pb-4">
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="text-3xl font-bold text-primary mt-2">
                              {formatPrice(plan.price, plan.currency)}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {plan.features.map((feature, index) => (
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

                  {/* Étudiants Maliens */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        🇲🇱 Étudiants Maliens
                      </h3>
                      <p className="text-gray-600">
                        Vivant au Mali
                      </p>
                    </div>
                    
                    {getStudentPlans()
                      .filter(plan => plan.currency === 'XOF')
                      .map((plan) => (
                        <Card key={plan.id} className="relative">
                          <CardHeader className="text-center pb-4">
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="text-3xl font-bold text-primary mt-2">
                              {formatPrice(plan.price, plan.currency)}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {plan.features.map((feature, index) => (
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

                {/* Services d'Accompagnement pour Étudiants */}
                <div className="mt-16">
                  <div className="text-center mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Services d'Accompagnement Professionnel
                    </h3>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      Des services personnalisés pour vous accompagner dans votre parcours professionnel 
                      et votre insertion dans le monde du travail.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {getStudentServicePlans().map((plan) => (
                      <Card key={plan.id} className="relative">
                        <CardHeader className="text-center pb-4">
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                          <div className="text-2xl font-bold text-primary mt-2">
                            {plan.pricing}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                          <Button 
                            className="w-full mt-4"
                            variant="outline"
                          >
                            Demander un devis
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Entreprises */}
              <TabsContent value="companies" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Solutions de Recrutement pour Entreprises
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Trois niveaux de service adaptés à vos besoins de recrutement, 
                    avec des tarifs transparents basés sur la taille de votre entreprise.
                  </p>
                  
                  {/* Toggle Mensuel/Annuel */}
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <span className={`text-sm ${selectedPeriod === 'monthly' ? 'text-gray-500' : 'text-gray-900'}`}>
                      Annuel
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPeriod(selectedPeriod === 'monthly' ? 'yearly' : 'monthly')}
                      className="relative"
                    >
                      <div className={`w-4 h-4 bg-primary rounded-full transition-transform duration-200 ${
                        selectedPeriod === 'monthly' ? 'translate-x-2' : '-translate-x-2'
                      }`} />
                    </Button>
                    <span className={`text-sm ${selectedPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                      Mensuel
                    </span>
                  </div>
                </div>

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
                    
                    {getCompanyPlans()
                      .filter(plan => plan.name.includes('Recrutement Complet'))
                      .map((plan) => (
                        <Card key={plan.id} className="relative border-2 border-yellow-200">
                          <CardHeader className="text-center pb-4">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <div className="text-2xl font-bold text-primary mt-2">
                              {formatPricePerPeriod(plan.price, plan.currency, plan.duration_days)}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {plan.features.map((feature, index) => (
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
                    
                    {getCompanyPlans()
                      .filter(plan => plan.name.includes('Recrutement Partiel'))
                      .map((plan) => (
                        <Card key={plan.id} className="relative border-2 border-blue-200">
                          <CardHeader className="text-center pb-4">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <div className="text-2xl font-bold text-primary mt-2">
                              {formatPricePerPeriod(plan.price, plan.currency, plan.duration_days)}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {plan.features.map((feature, index) => (
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
                    
                    {getCompanyPlans()
                      .filter(plan => plan.name.includes('Recrutement Autonomie'))
                      .map((plan) => (
                        <Card key={plan.id} className="relative border-2 border-green-200">
                          <CardHeader className="text-center pb-4">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <div className="text-2xl font-bold text-primary mt-2">
                              {formatPricePerPeriod(plan.price, plan.currency, plan.duration_days)}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {plan.features.map((feature, index) => (
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
                <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">
                    💡 Informations importantes
                  </h4>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• <strong>Recrutement complet :</strong> Service de A à Z avec accompagnement à l'intégration</li>
                    <li>• <strong>Recrutement partiel :</strong> Suivi depuis votre espace employeur avec support technique</li>
                    <li>• <strong>Recrutement autonomie :</strong> Accès à la plateforme avec accompagnement léger</li>
                    <li>• <strong>Tarifs annuels :</strong> Économies de 2 mois par rapport aux tarifs mensuels</li>
                  </ul>
                </div>

                {/* Audit RH & Formations pour Entreprises */}
                <div className="mt-16">
                  <div className="text-center mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      🔍 Audit RH & Formations Professionnelles
                    </h3>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      Des services d'audit et de formation sur mesure pour développer les compétences 
                      de vos équipes et optimiser votre organisation RH.
                    </p>
                  </div>

                  {/* Audit RH */}
                  <div className="mb-12">
                    <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      Audit RH & Organisationnel
                    </h4>
                    <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
                      {getAuditRHPlans().map((plan) => (
                        <Card key={plan.id} className="relative border-2 border-blue-200">
                          <CardHeader className="text-center pb-4">
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="text-2xl font-bold text-primary mt-2">
                              {plan.pricing}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                            <Button 
                              className="w-full mt-4"
                              variant="outline"
                            >
                              Demander un devis
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Formations */}
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      📚 Formations Professionnelles
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                      {getFormationPlans().map((plan) => (
                        <Card key={plan.id} className="relative">
                          <CardHeader className="text-center pb-4">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="text-xl font-bold text-primary mt-2">
                              {plan.pricing}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                            <Button 
                              className="w-full mt-4"
                              variant="outline"
                            >
                              Demander un devis
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Établissements Éducatifs */}
              <TabsContent value="educational" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Services pour Établissements Scolaires & Universitaires
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Des solutions éducatives sur mesure pour accompagner vos étudiants 
                    dans leur insertion professionnelle.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {getEducationalPlans().map((plan) => (
                    <Card key={plan.id} className="relative">
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="text-2xl font-bold text-primary mt-2">
                          {plan.pricing}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        <Button 
                          className="w-full mt-4"
                          variant="outline"
                        >
                          Demander un devis
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Contact pour devis */}
                <div className="mt-12 text-center">
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-8 rounded-lg">
                    <h3 className="text-2xl font-bold mb-4">
                      Besoin d'un devis personnalisé ?
                    </h3>
                    <p className="text-white/90 mb-6">
                      Nos équipes sont là pour vous accompagner et créer une solution 
                      adaptée à vos besoins spécifiques.
                    </p>
                    <Button asChild size="lg" variant="secondary">
                      <a href="/contact">Nous contacter</a>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions Fréquentes
              </h2>
              <p className="text-lg text-gray-600">
                Tout ce que vous devez savoir sur nos services et tarifs
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Comment fonctionne l'abonnement annuel vs mensuel ?
                </h3>
                <p className="text-gray-600">
                  L'abonnement annuel vous fait économiser l'équivalent de 2 mois par rapport 
                  aux tarifs mensuels. Vous pouvez choisir selon vos besoins et votre budget.
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Puis-je changer de plan en cours d'abonnement ?
                </h3>
                <p className="text-gray-600">
                  Oui, vous pouvez mettre à niveau votre plan à tout moment. Le montant sera 
                  calculé au prorata de votre période d'abonnement restante.
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Les services étudiants sont-ils disponibles partout ?
                </h3>
                <p className="text-gray-600">
                  Oui, nos services sont disponibles partout dans le monde. Les tarifs sont 
                  adaptés selon votre localisation (EUR pour l'international, XOF pour le Mali).
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Comment sont calculés les tarifs de recrutement pour entreprises ?
                </h3>
                <p className="text-gray-600">
                  Les tarifs sont basés sur la taille de votre entreprise (nombre de salariés) 
                  et le niveau de service choisi. Plus votre entreprise est grande, plus nous 
                  pouvons vous accompagner avec des services adaptés.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
