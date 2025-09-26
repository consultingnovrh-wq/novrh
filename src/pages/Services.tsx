import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  GraduationCap, 
  FileCheck, 
  Shield, 
  TrendingUp, 
  UserCheck,
  Briefcase,
  BookOpen,
  CheckCircle
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Audit RH",
      description: "Diagnostic complet de vos pratiques RH et recommandations d'amélioration",
      features: ["Audit des processus", "Évaluation des compétences", "Analyse organisationnelle", "Plan d'action personnalisé"],
      pricing: "À partir de 500€"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Formations RH",
      description: "Programmes de formation adaptés aux besoins de vos équipes",
      features: ["Formation en ligne", "Ateliers pratiques", "Certification", "Suivi personnalisé"],
      pricing: "À partir de 200€/personne"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Santé & Sécurité au Travail",
      description: "Mise en place de systèmes de management QSE et RSE",
      features: ["Évaluation des risques", "Formation SST", "Indicateurs de suivi", "Conformité réglementaire"],
      pricing: "Sur devis"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Recrutement & Sélection",
      description: "Processus de recrutement complet pour trouver les meilleurs talents",
      features: ["Sourcing candidats", "Entretiens structurés", "Tests psychotechniques", "Intégration"],
      pricing: "15% du salaire annuel"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Conseil Stratégique RH",
      description: "Accompagnement dans vos transformations RH et organisationnelles",
      features: ["Stratégie RH", "Change management", "Restructuration", "Optimisation des coûts"],
      pricing: "À partir de 1000€/jour"
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Mise à Disposition RH",
      description: "Experts RH temporaires pour vos projets spécifiques",
      features: ["DRH temporaire", "Chargé RH", "Spécialistes", "Missions courtes/longues"],
      pricing: "À partir de 400€/jour"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Analyse des Besoins",
      description: "Nous étudions vos défis RH et définissons ensemble vos objectifs"
    },
    {
      step: "2", 
      title: "Proposition Personnalisée",
      description: "Nous élaborons une solution sur-mesure adaptée à votre contexte"
    },
    {
      step: "3",
      title: "Mise en Œuvre",
      description: "Nos experts interviennent selon le planning défini ensemble"
    },
    {
      step: "4",
      title: "Suivi & Évaluation",
      description: "Nous mesurons les résultats et ajustons si nécessaire"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Nos Services RH
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Solutions complètes pour optimiser votre gestion des ressources humaines
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Demander un Devis Gratuit
              </Button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Nos Expertises</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <Card key={index} className="relative h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="text-primary mb-4">{service.icon}</div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{service.description}</p>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-primary mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-primary border-primary">
                          {service.pricing}
                        </Badge>
                        <Button variant="outline" size="sm">
                          En savoir plus
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Notre Processus</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Prêt à Transformer Votre Gestion RH ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Contactez nos experts pour une consultation gratuite et personnalisée
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Consultation Gratuite
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Télécharger Brochure
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;