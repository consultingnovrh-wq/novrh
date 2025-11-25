import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const CookieManagement = () => {
  const [cookies, setCookies] = useState({
    necessary: true, // Toujours activé
    functional: false,
    performance: false,
    targeting: false,
  });

  useEffect(() => {
    // Charger les préférences depuis localStorage
    const savedCookies = localStorage.getItem('cookiePreferences');
    if (savedCookies) {
      try {
        const parsed = JSON.parse(savedCookies);
        setCookies({
          necessary: true, // Toujours activé
          functional: parsed.functional || false,
          performance: parsed.performance || false,
          targeting: parsed.targeting || false,
        });
      } catch (e) {
        console.error('Error parsing cookie preferences', e);
      }
    }
  }, []);

  const handleSavePreferences = () => {
    // Sauvegarder les préférences
    localStorage.setItem('cookiePreferences', JSON.stringify({
      functional: cookies.functional,
      performance: cookies.performance,
      targeting: cookies.targeting,
    }));
    localStorage.setItem('cookieConsent', 'custom');
    // Ici, vous pouvez ajouter une logique pour appliquer les préférences
    // Par exemple, charger/décharger des scripts selon les préférences
    toast.success('Vos préférences de cookies ont été enregistrées avec succès !');
  };

  const handleAcceptAll = () => {
    setCookies({
      necessary: true,
      functional: true,
      performance: true,
      targeting: true,
    });
    localStorage.setItem('cookiePreferences', JSON.stringify({
      functional: true,
      performance: true,
      targeting: true,
    }));
    localStorage.setItem('cookieConsent', 'all');
    toast.success('Tous les cookies ont été acceptés !');
  };

  const handleRejectAll = () => {
    setCookies({
      necessary: true,
      functional: false,
      performance: false,
      targeting: false,
    });
    localStorage.setItem('cookiePreferences', JSON.stringify({
      functional: false,
      performance: false,
      targeting: false,
    }));
    localStorage.setItem('cookieConsent', 'none');
    toast.success('Tous les cookies optionnels ont été refusés !');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Gestion des cookies
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Gérez vos préférences de cookies
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Gestion détaillée des cookies */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    Paramétrer vos préférences de cookies
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Vous pouvez activer ou désactiver les différents types de cookies ci-dessous. Les cookies strictement nécessaires ne peuvent pas être désactivés car ils sont essentiels au fonctionnement du site.
                  </p>

                  <Separator className="my-6" />

                  {/* Cookies Strictement Nécessaires */}
                  <div className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <Label htmlFor="necessary" className="text-lg font-semibold">
                        Cookies Strictement Nécessaires
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés.
                      </p>
                    </div>
                    <Switch
                      id="necessary"
                      checked={cookies.necessary}
                      disabled
                      className="ml-4"
                    />
                  </div>

                  <Separator className="my-4" />

                  {/* Cookies Fonctionnels */}
                  <div className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <Label htmlFor="functional" className="text-lg font-semibold">
                        Cookies Fonctionnels
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ces cookies permettent d'améliorer les fonctionnalités et la personnalisation du site.
                      </p>
                    </div>
                    <Switch
                      id="functional"
                      checked={cookies.functional}
                      onCheckedChange={(checked) =>
                        setCookies({ ...cookies, functional: checked })
                      }
                      className="ml-4"
                    />
                  </div>

                  <Separator className="my-4" />

                  {/* Cookies de Performance */}
                  <div className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <Label htmlFor="performance" className="text-lg font-semibold">
                        Cookies de Performance
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ces cookies nous permettent d'analyser la fréquentation et les performances du site.
                      </p>
                    </div>
                    <Switch
                      id="performance"
                      checked={cookies.performance}
                      onCheckedChange={(checked) =>
                        setCookies({ ...cookies, performance: checked })
                      }
                      className="ml-4"
                    />
                  </div>

                  <Separator className="my-4" />

                  {/* Cookies de Ciblage */}
                  <div className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <Label htmlFor="targeting" className="text-lg font-semibold">
                        Cookies de Ciblage
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ces cookies permettent de vous proposer des annonces personnalisées.
                      </p>
                    </div>
                    <Switch
                      id="targeting"
                      checked={cookies.targeting}
                      onCheckedChange={(checked) =>
                        setCookies({ ...cookies, targeting: checked })
                      }
                      className="ml-4"
                    />
                  </div>

                  <Separator className="my-6" />

                  {/* Boutons d'action */}
                  <div className="flex gap-4 justify-end">
                    <Button
                      variant="outline"
                      onClick={handleRejectAll}
                    >
                      Tout refuser
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleAcceptAll}
                    >
                      Tout accepter
                    </Button>
                    <Button
                      onClick={handleSavePreferences}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Enregistrer mes préférences
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Information supplémentaire */}
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Plus d'informations
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Pour en savoir plus sur notre utilisation des cookies, consultez notre{" "}
                    <a href="/cookies" className="text-primary hover:underline">
                      Politique de gestion des cookies
                    </a>.
                  </p>
                  <p className="text-muted-foreground">
                    Vous pouvez également modifier vos préférences de cookies à tout moment via les paramètres de votre navigateur.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CookieManagement;

