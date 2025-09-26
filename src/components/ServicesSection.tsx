import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Shield, FileText, Search, UserCheck } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Audit RH",
      description: "Évaluation complète de vos processus RH pour optimiser votre performance organisationnelle.",
      features: ["Diagnostic organisationnel", "Analyse des processus", "Recommandations stratégiques"]
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Formation",
      description: "Programmes de formation adaptés aux besoins spécifiques de votre entreprise et vos collaborateurs.",
      features: ["Formations sur-mesure", "Micro-learning", "Certificats professionnels"]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Santé & Sécurité au Travail",
      description: "Accompagnement pour la mise en place de politiques SST conformes aux réglementations.",
      features: ["Évaluation des risques", "Plans de prévention", "Formation sécurité"]
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Droit du Travail",
      description: "Conseil juridique en droit du travail et accompagnement dans vos relations sociales.",
      features: ["Conseil juridique", "Gestion des conflits", "Conformité réglementaire"]
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Recrutement",
      description: "Service de recrutement pour identifier et attirer les meilleurs talents pour votre entreprise.",
      features: ["Sourcing de talents", "Évaluation des candidats", "Processus de sélection"]
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: "Mise à disposition RH",
      description: "Mise à disposition d'experts RH pour renforcer temporairement vos équipes.",
      features: ["Experts qualifiés", "Missions temporaires", "Accompagnement projet"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Nos Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre gamme complète de services RH conçus pour accompagner votre entreprise 
            dans sa croissance et l'optimisation de ses ressources humaines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-elegant transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                  En savoir plus
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;