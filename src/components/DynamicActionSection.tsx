import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DynamicButton from "./DynamicButton";
import { useDynamicActions } from "@/hooks/use-dynamic-actions";
import { Users, Building2, Briefcase, FileText, Search, BookOpen, BarChart } from "lucide-react";

const DynamicActionSection = () => {
  const { isAuthenticated, userType } = useDynamicActions();

  const candidateFeatures = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Consulter les offres",
      description: "Parcourez les offres d'emploi correspondant à votre profil",
      action: "view-jobs" as const
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Déposer votre CV",
      description: "Uploadez votre CV et créez votre profil professionnel",
      action: "add-cv" as const
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Micro-formations",
      description: "Accédez à des formations courtes pour développer vos compétences",
      action: "view-services" as const
    }
  ];

  const companyFeatures = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Publier des offres",
      description: "Diffusez vos offres d'emploi auprès de candidats qualifiés",
      action: "post-job" as const
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Rechercher des profils",
      description: "Accédez à notre CVthèque pour trouver les bons candidats",
      action: "view-cvtheque" as const
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Services RH",
      description: "Réservez nos experts RH pour vos projets spécifiques",
      action: "view-services" as const
    }
  ];

  const getPersonalizedMessage = () => {
    if (!isAuthenticated) {
      return "Découvrez nos services et rejoignez notre communauté";
    }

    switch (userType) {
      case 'candidate':
        return "Trouvez votre prochain emploi et développez vos compétences";
      case 'company':
        return "Recrutez les meilleurs talents et optimisez vos RH";
      case 'student':
        return "Développez vos compétences et préparez votre avenir professionnel";
      default:
        return "Explorez nos services personnalisés";
    }
  };

  const getPersonalizedTitle = () => {
    if (!isAuthenticated) {
      return "Plateforme d'Intermédiation RH";
    }

    switch (userType) {
      case 'candidate':
        return "Espace Candidat";
      case 'company':
        return "Espace Entreprise";
      case 'student':
        return "Espace Étudiant";
      default:
        return "Votre Espace Personnel";
    }
  };

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {getPersonalizedTitle()}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {getPersonalizedMessage()}
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
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 space-y-2">
                <DynamicButton 
                  action="view-jobs"
                  variant="outline" 
                  className="w-full"
                />
                {isAuthenticated && (userType === 'candidate' || userType === 'student') && (
                  <DynamicButton 
                    action="add-cv"
                    className="w-full"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Espace Entreprises */}
          <Card className="shadow-elegant">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-primary" />
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
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 space-y-2">
                <DynamicButton 
                  action="view-services"
                  variant="outline" 
                  className="w-full"
                />
                {isAuthenticated && userType === 'company' && (
                  <>
                    <DynamicButton 
                      action="post-job"
                      className="w-full"
                    />
                    <DynamicButton 
                      action="view-cvtheque"
                      variant="secondary"
                      className="w-full"
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides pour utilisateurs non connectés */}
        {!isAuthenticated && (
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-6">Prêt à commencer ?</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté et accédez à tous nos services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <DynamicButton 
                action="register"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              />
              <DynamicButton 
                action="login"
                size="lg"
                variant="outline"
              />
            </div>
          </div>
        )}

        {/* Actions rapides pour utilisateurs connectés */}
        {isAuthenticated && (
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-6">Actions rapides</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Accédez rapidement à vos fonctionnalités principales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <DynamicButton 
                action="dashboard"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              />
              <DynamicButton 
                action="view-pricing"
                size="lg"
                variant="outline"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicActionSection;
