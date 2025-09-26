import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, TrendingUp, Users } from "lucide-react";

const Opportunities = () => {
  const opportunities = [
    {
      id: 1,
      title: "Partenariat Cabinet RH - Expansion Afrique de l'Ouest",
      company: "RH Solutions International",
      location: "Multi-pays",
      type: "Partenariat",
      investment: "Selon discussion",
      posted: "Il y a 2 jours",
      category: "Expansion",
      description: "Recherche partenaires locaux pour développer nos services RH dans 5 pays d'Afrique de l'Ouest.",
      requirements: ["Expérience RH locale", "Réseau établi", "Capacité d'investissement"],
    },
    {
      id: 2,
      title: "Joint-venture Formation Digitale RH",
      company: "TechForm Africa",
      location: "Dakar, Sénégal",
      type: "Joint-venture",
      investment: "100,000,000 - 200,000,000 FCFA",
      posted: "Il y a 5 jours",
      category: "Technologie",
      description: "Création d'une plateforme de formation RH digitale pour l'Afrique francophone.",
      requirements: ["Expertise tech", "Connaissance RH", "Capital minimum"],
    },
    {
      id: 3,
      title: "Franchise Centre de Formation QHSE",
      company: "QHSE Academy",
      location: "Bamako, Mali",
      type: "Franchise",
      investment: "50,000,000 - 80,000,000 FCFA",
      posted: "Il y a 1 semaine",
      category: "Formation",
      description: "Opportunité de franchise pour centre de formation spécialisé en QHSE.",
      requirements: ["Local commercial", "Équipe formée", "Licence d'exploitation"],
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">Opportunités d'Affaires</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Découvrez les opportunités de partenariat et d'investissement dans le secteur RH
            </p>
          </div>
        </section>

        {/* Opportunities Listing */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {opportunities.length} opportunités disponibles
              </h2>
              <Button>
                Proposer une opportunité
              </Button>
            </div>

            <div className="space-y-6">
              {opportunities.map((opportunity) => (
                <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{opportunity.title}</CardTitle>
                        <CardDescription className="text-lg font-medium text-primary">
                          {opportunity.company}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{opportunity.type}</Badge>
                        <Badge variant="outline">{opportunity.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{opportunity.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{opportunity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span>Investissement: {opportunity.investment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Publié {opportunity.posted}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Prérequis :</p>
                        <div className="flex flex-wrap gap-2">
                          {opportunity.requirements.map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button variant="default" size="sm">
                          <Users className="mr-2 h-4 w-4" />
                          Exprimer mon intérêt
                        </Button>
                        <Button variant="outline" size="sm">
                          En savoir plus
                        </Button>
                        <Button variant="outline" size="sm">
                          Contacter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Opportunities;