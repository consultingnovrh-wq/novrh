import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Users, Globe } from "lucide-react";

const Directory = () => {
  const companies = [
    {
      id: 1,
      name: "Mali Consulting Group",
      sector: "Conseil en RH",
      location: "Bamako, Mali",
      employees: "50-100",
      description: "Cabinet de conseil spécialisé en ressources humaines et formation professionnelle.",
      services: ["Recrutement", "Formation", "Audit RH", "Paie"],
      website: "www.maliconsulting.ml",
    },
    {
      id: 2,
      name: "Sécurité Plus SARL",
      sector: "QHSE",
      location: "Dakar, Sénégal",
      employees: "20-50",
      description: "Expert en sécurité, hygiène et environnement pour l'industrie minière.",
      services: ["Audit sécurité", "Formation SST", "Certification", "Consulting"],
      website: "www.securiteplus.sn",
    },
    {
      id: 3,
      name: "Formation Excellence",
      sector: "Formation",
      location: "Abidjan, Côte d'Ivoire",
      employees: "10-20",
      description: "Centre de formation professionnelle continue pour cadres et dirigeants.",
      services: ["Formation management", "Leadership", "Digital", "Langues"],
      website: "www.formation-excellence.ci",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">Annuaire des Entreprises</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Découvrez les entreprises partenaires et prestataires RH en Afrique
            </p>
          </div>
        </section>

        {/* Search Filters */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Nom de l'entreprise" className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Secteur d'activité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conseil">Conseil en RH</SelectItem>
                      <SelectItem value="qhse">QHSE</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                      <SelectItem value="industrie">Industrie</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mali">Mali</SelectItem>
                      <SelectItem value="senegal">Sénégal</SelectItem>
                      <SelectItem value="ci">Côte d'Ivoire</SelectItem>
                      <SelectItem value="burkina">Burkina Faso</SelectItem>
                      <SelectItem value="guinee">Guinée</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Rechercher
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Companies Listing */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {companies.length} entreprises trouvées
              </h2>
            </div>

            <div className="grid gap-6">
              {companies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{company.name}</CardTitle>
                        <CardDescription className="text-lg font-medium text-primary">
                          {company.sector}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{company.employees} employés</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{company.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {company.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {company.employees} employés
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          {company.website}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Services proposés :</p>
                        <div className="flex flex-wrap gap-2">
                          {company.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" size="sm">
                          Voir le profil
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

export default Directory;