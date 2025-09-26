import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, FileText, Search, BookOpen, BarChart } from "lucide-react";

const PlatformSection = () => {
  const candidateFeatures = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Consulter les offres",
      description: "Parcourez les offres d'emploi correspondant à votre profil"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Déposer votre CV",
      description: "Uploadez votre CV et créez votre profil professionnel"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Micro-formations",
      description: "Accédez à des formations courtes pour développer vos compétences"
    }
  ];

  const companyFeatures = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Publier des offres",
      description: "Diffusez vos offres d'emploi auprès de candidats qualifiés"
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Rechercher des profils",
      description: "Accédez à notre CVthèque pour trouver les bons candidats"
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Services RH",
      description: "Réservez nos experts RH pour vos projets spécifiques"
    }
  ];

  const partners = [
    { name: "TechSolutions Mali", logo: "/placeholder.svg" },
    { name: "AgroFinance Sénégal", logo: "/placeholder.svg" },
    { name: "GreenEnergy Côte d'Ivoire", logo: "/placeholder.svg" },
    { name: "HealthCare Burkina", logo: "/placeholder.svg" },
    { name: "EduTech Ghana", logo: "/placeholder.svg" },
    { name: "Logistics Niger", logo: "/placeholder.svg" }
  ];

  return (
    <section id="platform" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Plateforme d'Intermédiation RH
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Une plateforme unique qui connecte les talents, les entreprises et les consultants RH 
            pour créer un écosystème collaboratif et efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Espace Candidats */}
          <Card className="shadow-elegant">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Espace Candidats</CardTitle>
              <CardDescription>
                Trouvez votre prochain emploi et développez vos compétences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidateFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Consulter les offres
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Espace Entreprises */}
          <Card className="shadow-elegant">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Espace Entreprises</CardTitle>
              <CardDescription>
                Recrutez les meilleurs talents et optimisez vos RH
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {companyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Consulter les services
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partners Section */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold mb-6">NOS PARTENAIRES</h3>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Ils nous ont fait confiance et contribuent à notre écosystème d'innovation
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img src={partner.logo} alt={partner.name} className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;