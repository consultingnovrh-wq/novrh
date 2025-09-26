import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, Phone, Mail } from "lucide-react";

const ClassifiedAds = () => {
  const ads = [
    {
      id: 1,
      title: "Vente logiciel de gestion RH complet",
      category: "Logiciels",
      price: "2,500,000 FCFA",
      location: "Bamako, Mali",
      posted: "Il y a 1 jour",
      description: "Logiciel de paie et gestion RH avec formations incluses. Licence pour 100 employés.",
      contact: "77 XX XX XX XX",
      seller: "TechSoft Mali",
    },
    {
      id: 2,
      title: "Formation certifiante SST - Sessions de groupe",
      category: "Services",
      price: "150,000 FCFA/personne",
      location: "Dakar, Sénégal",
      posted: "Il y a 3 jours",
      description: "Formation sauveteur secouriste du travail avec certification officielle. Groupes de 10-15 personnes.",
      contact: "contact@sst-dakar.sn",
      seller: "Centre SST Dakar",
    },
    {
      id: 3,
      title: "Matériel de formation (vidéoprojecteur, tableaux)",
      category: "Équipements",
      price: "800,000 FCFA",
      location: "Abidjan, Côte d'Ivoire",
      posted: "Il y a 5 jours",
      description: "Lot complet d'équipements de formation : vidéoprojecteur HD, tableaux mobiles, chaises.",
      contact: "21 XX XX XX XX",
      seller: "Formation Plus CI",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">Petites Annonces</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Achetez, vendez ou échangez vos services et équipements RH
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
                    <Input placeholder="Rechercher une annonce" className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logiciels">Logiciels</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="equipements">Équipements</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                      <SelectItem value="immobilier">Immobilier</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Localisation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mali">Mali</SelectItem>
                      <SelectItem value="senegal">Sénégal</SelectItem>
                      <SelectItem value="ci">Côte d'Ivoire</SelectItem>
                      <SelectItem value="burkina">Burkina Faso</SelectItem>
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

        {/* Ads Listing */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {ads.length} annonces trouvées
              </h2>
              <Button>
                Poster une annonce
              </Button>
            </div>

            <div className="space-y-6">
              {ads.map((ad) => (
                <Card key={ad.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{ad.title}</CardTitle>
                        <CardDescription className="text-lg font-medium text-primary">
                          {ad.price}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{ad.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{ad.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {ad.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {ad.posted}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Vendeur:</span>
                          {ad.seller}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button variant="default" size="sm">
                          <Phone className="mr-2 h-4 w-4" />
                          Contacter
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="mr-2 h-4 w-4" />
                          Envoyer message
                        </Button>
                        <Button variant="outline" size="sm">
                          Voir détails
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

export default ClassifiedAds;