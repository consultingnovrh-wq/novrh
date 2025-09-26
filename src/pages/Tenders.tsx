import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Clock, FileText } from "lucide-react";

const Tenders = () => {
  const tenders = [
    {
      id: 1,
      title: "Audit organisationnel et RH - Société Minière XYZ",
      organization: "Mines d'Or du Mali SA",
      location: "Bamako, Mali",
      budget: "50,000,000 - 75,000,000 FCFA",
      deadline: "15 février 2024",
      published: "Il y a 3 jours",
      category: "Audit RH",
      status: "Ouvert",
      description: "Recherche cabinet pour audit complet des ressources humaines et recommandations d'amélioration.",
    },
    {
      id: 2,
      title: "Formation en sécurité industrielle - 200 employés",
      organization: "Groupe Industriel Sahel",
      location: "Ouagadougou, Burkina Faso",
      budget: "25,000,000 - 35,000,000 FCFA",
      deadline: "28 février 2024",
      published: "Il y a 1 semaine",
      category: "Formation",
      status: "Ouvert",
      description: "Formation complète en sécurité industrielle pour l'ensemble du personnel technique.",
    },
    {
      id: 3,
      title: "Mise en place système QHSE conforme ISO 45001",
      organization: "Construction BTP Afrique",
      location: "Abidjan, Côte d'Ivoire",
      budget: "40,000,000 - 60,000,000 FCFA",
      deadline: "10 mars 2024",
      published: "Il y a 5 jours",
      category: "QHSE",
      status: "Ouvert",
      description: "Accompagnement pour la mise en place d'un système de management QHSE certifié ISO 45001.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">Appels d'Offres</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Découvrez les opportunités de missions et projets RH en cours
            </p>
          </div>
        </section>

        {/* Tenders Listing */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {tenders.length} appels d'offres actifs
              </h2>
              <Button>
                Ajouter un appel d'offre
              </Button>
            </div>

            <div className="space-y-6">
              {tenders.map((tender) => (
                <Card key={tender.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{tender.title}</CardTitle>
                        <CardDescription className="text-lg font-medium text-primary">
                          {tender.organization}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{tender.category}</Badge>
                        <Badge 
                          variant={tender.status === "Ouvert" ? "default" : "destructive"}
                        >
                          {tender.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{tender.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{tender.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{tender.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span>Échéance: {tender.deadline}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Publié {tender.published}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button variant="default" size="sm">
                          Voir les détails
                        </Button>
                        <Button variant="outline" size="sm">
                          Télécharger le cahier des charges
                        </Button>
                        <Button variant="outline" size="sm">
                          Postuler
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

export default Tenders;