import { Button } from "@/components/ui/button";
import { useDynamicActions } from "@/hooks/use-dynamic-actions";
import heroImage from "@/assets/off.png";

const HeroSection = () => {
  const { handleViewPricing, handleRegister, isAuthenticated, userType } = useDynamicActions();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with dark blue color */}
      <div className="absolute inset-0 bg-[#00167a]"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Text content */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Bienvenue chez{" "}
              <span className="block text-white">NovRH CONSULTING</span>
            </h1>
            
            <div className="space-y-4 text-lg sm:text-xl">
              <p className="flex items-center">
                <span className="mr-3">•</span>
                Recruter autrement
              </p>
              <p className="flex items-center">
                <span className="mr-3">•</span>
                Structurer durablement
              </p>
              <p className="flex items-center">
                <span className="mr-3">•</span>
                Former efficacement
              </p>
            </div>

            <div className="pt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
                  Innovons ensemble pour être les leaders de demain
                </h2>
                <p className="text-lg text-center text-white/90 mb-6">
                  Rejoignez notre écosystème innovant et contribuez à façonner l'avenir du travail en Afrique.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleViewPricing}
                    size="lg" 
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    Voir nos plans d'abonnement
                  </Button>
                  <Button 
                    onClick={handleRegister}
                    size="lg" 
                    variant="outline" 
                    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    {isAuthenticated ? `Bonjour ${userType === 'company' ? 'Entreprise' : userType === 'candidate' ? 'Candidat' : 'Utilisateur'} !` : 'Commencer gratuitement'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Professional image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src={heroImage}
                alt="Professionnelle NovRH Consulting"
                className="w-full max-w-md lg:max-w-lg xl:max-w-xl rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
    </section>
  );
};

export default HeroSection;