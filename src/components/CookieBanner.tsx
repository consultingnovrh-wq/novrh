import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Check } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Afficher le banner après un court délai pour une meilleure UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      functional: true,
      performance: true,
      targeting: true,
    }));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookieConsent', 'none');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      functional: false,
      performance: false,
      targeting: false,
    }));
    setShowBanner(false);
  };

  const handleCustomize = () => {
    navigate('/cookie-management');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto max-w-4xl">
        <Card className="relative">
          <CardContent className="p-6">
            {/* Logo en haut à droite */}
            <div className="absolute top-4 right-4">
              <div className="w-12 h-12 bg-[#00167a] rounded flex items-center justify-center shadow-lg">
                <Cookie className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Titre */}
            <h2 className="text-2xl md:text-3xl font-bold mb-3 pr-16">
              Blah blah blah Cookie !
            </h2>

            {/* Texte principal */}
            <p className="text-base md:text-lg text-muted-foreground mb-4">
              Bon ok, ces cookies ne sont ni sucrés, ni chocolatés, ni moelleux. Mais ils nous permettent de mieux vous connaître et de vous proposer les contenus que vous allez adorer dévorer. Et ça, ça vaut tous les cookies du monde.
            </p>

            {/* Instructions */}
            <p className="text-sm text-muted-foreground mb-4">
              Pour modifier vos préférences par la suite, cliquez sur le lien "Préférences de cookies" situé dans le pied de page.
            </p>

            {/* Certification */}
            <p className="text-xs text-muted-foreground mb-4 flex items-center gap-2">
              <Check className="h-4 w-4" />
              Consentements certifiés par ✓ axeptio
            </p>

            {/* Boutons */}
            <div className="flex flex-wrap gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="bg-white hover:bg-gray-50"
              >
                Non merci
              </Button>
              <Button
                variant="outline"
                onClick={handleCustomize}
                className="bg-white hover:bg-gray-50"
              >
                Je choisis
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="bg-[#00167a] hover:bg-[#00167a]/90 text-white border-none shadow-md"
              >
                OK pour moi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookieBanner;

