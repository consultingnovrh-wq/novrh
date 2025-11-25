import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDynamicActions } from "@/hooks/use-dynamic-actions";
import { Users, Building, FileText, Search, BookOpen, BarChart } from "lucide-react";
import companyLogo from "@/assets/logo.png";

const PlatformSection = () => {
  const { handleViewJobs, handleAddCV, handlePostJob, handleViewCVTheque, handleViewServices, isAuthenticated, userType } = useDynamicActions();

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
    { name: "TechSolutions Mali", logo: companyLogo, website: "https://techsolutions.ml" },
    { name: "AgroFinance Sénégal", logo: "", website: "https://agrofinance.sn" },
    { name: "GreenEnergy Côte d'Ivoire", logo: "", website: "https://greenenergy.ci" },
    { name: "HealthCare Burkina", logo: "", website: "https://healthcare.bf" },
    { name: "EduTech Ghana", logo: "", website: "https://edutech.gh" },
    { name: "Logistics Niger", logo: "", website: "https://logistics.ne" }
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
              <div className="pt-4 space-y-2">
                <Button 
                  onClick={handleViewJobs}
                  variant="outline" 
                  className="w-full"
                >
                  Consulter les offres
                </Button>
                {isAuthenticated && (userType === 'candidate' || userType === 'student') && (
                  <Button 
                    onClick={handleAddCV}
                    className="w-full"
                  >
                    Ajouter mon CV
                  </Button>
                )}
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
              <div className="pt-4 space-y-2">
                <Button 
                  onClick={handleViewServices}
                  variant="outline" 
                  className="w-full"
                >
                  Consulter les services
                </Button>
                {isAuthenticated && userType === 'company' && (
                  <>
                    <Button 
                      onClick={handlePostJob}
                      className="w-full"
                    >
                      Publier une offre
                    </Button>
                    <Button 
                      onClick={handleViewCVTheque}
                      variant="secondary"
                      className="w-full"
                    >
                      Accéder à la CVthèque
                    </Button>
                  </>
                )}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map((partner, index) => (
              <a
                key={index}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary/40"
                aria-label={`Visiter le site de ${partner.name}`}
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span className="text-sm font-semibold text-primary text-center">
                    {partner.name}
                  </span>
                )}
                <span className="text-xs text-muted-foreground mt-2">Voir le site</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;