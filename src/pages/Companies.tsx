import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Building, Globe, Users, Star, ExternalLink, Play } from "lucide-react";

const Companies = () => {
  const companies = [
    {
      id: 1,
      name: "TechSolutions Mali",
      logo: "/placeholder.svg",
      description: "Entreprise leader dans les solutions technologiques innovantes pour les PME africaines",
      sector: "Technologie",
      employees: "50-100",
      location: "Bamako, Mali",
      rating: 4.8,
      website: "https://techsolutions-mali.com",
      hasVideo: true,
      hasPub: true,
      featured: true
    },
    {
      id: 2,
      name: "AgroFinance Sénégal",
      logo: "/placeholder.svg",
      description: "Spécialiste du financement agricole et de l'accompagnement des agriculteurs",
      sector: "Agriculture & Finance",
      employees: "100-250",
      location: "Dakar, Sénégal",
      rating: 4.6,
      website: "https://agrofinance-senegal.com",
      hasVideo: false,
      hasPub: true,
      featured: false
    },
    {
      id: 3,
      name: "GreenEnergy Côte d'Ivoire",
      logo: "/placeholder.svg",
      description: "Pionnier des énergies renouvelables en Afrique de l'Ouest",
      sector: "Énergie",
      employees: "25-50",
      location: "Abidjan, Côte d'Ivoire",
      rating: 4.9,
      website: "https://greenenergy-ci.com",
      hasVideo: true,
      hasPub: false,
      featured: true
    },
    {
      id: 4,
      name: "HealthCare Burkina",
      logo: "/placeholder.svg",
      description: "Solutions de santé innovantes pour améliorer l'accès aux soins",
      sector: "Santé",
      employees: "75-150",
      location: "Ouagadougou, Burkina Faso",
      rating: 4.7,
      website: "https://healthcare-bf.com",
      hasVideo: false,
      hasPub: true,
      featured: false
    },
    {
      id: 5,
      name: "EduTech Ghana",
      logo: "/placeholder.svg",
      description: "Plateforme d'éducation numérique pour démocratiser l'apprentissage",
      sector: "Éducation",
      employees: "30-60",
      location: "Accra, Ghana",
      rating: 4.5,
      website: "https://edutech-ghana.com",
      hasVideo: true,
      hasPub: true,
      featured: false
    },
    {
      id: 6,
      name: "Logistics Niger",
      logo: "/placeholder.svg",
      description: "Solutions logistiques intégrées pour le commerce transfrontalier",
      sector: "Logistique",
      employees: "100-200",
      location: "Niamey, Niger",
      rating: 4.4,
      website: "https://logistics-niger.com",
      hasVideo: false,
      hasPub: false,
      featured: false
    }
  ];

  const sectors = [
    "Tous les secteurs",
    "Technologie",
    "Agriculture & Finance",
    "Énergie",
    "Santé",
    "Éducation",
    "Logistique",
    "Construction",
    "Tourisme"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              À propos de nos entreprises
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Découvrez nos entreprises partenaires qui innovent et créent de la valeur 
              dans leurs secteurs d'activité
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 flex items-center px-4">
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Rechercher une entreprise..."
                    className="flex-1 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-none">
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Entreprises en vedette</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {companies.filter(c => c.featured).map((company) => (
              <Card key={company.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <img src={company.logo} alt={company.name} className="h-24 w-auto" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                      VEDETTE
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{company.name}</CardTitle>
                      <CardDescription className="text-sm">{company.sector}</CardDescription>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{company.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{company.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {company.employees} employés
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      {company.location}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Globe className="h-4 w-4 mr-2" />
                      Visiter le site
                    </Button>
                    {company.hasVideo && (
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {sectors.map((sector, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className="rounded-full"
              >
                {sector}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* All Companies */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {companies.length} entreprises partenaires
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Trier par :</span>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Pertinence</option>
                <option>Note</option>
                <option>Nom A-Z</option>
                <option>Secteur</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      {company.sector}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{company.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {company.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {company.employees}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      {company.location}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Site web
                    </Button>
                    {company.hasVideo && (
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    {company.hasPub && (
                      <Button size="sm" variant="outline">
                        Info
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Voir plus d'entreprises
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Rejoignez notre réseau d'entreprises
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Votre entreprise innove dans son secteur ? Présentez-la à notre communauté 
            et bénéficiez de notre réseau de partenaires.
          </p>
          <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
            Présenter mon entreprise
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Companies; 