import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Clock, Users, Star, MapPin } from "lucide-react";

const Formation = () => {
  const formations = [
    {
      id: 1,
      title: "Gestion des Ressources Humaines",
      provider: "Institut de Formation RH",
      duration: "6 mois",
      participants: 25,
      rating: 4.8,
      location: "Bamako, Mali",
      price: "2,500,000 FCFA",
      description: "Formation complète en gestion RH avec certification professionnelle",
      category: "Management RH"
    },
    {
      id: 2,
      title: "Droit du Travail Africain",
      provider: "Centre Juridique Panafricain",
      duration: "3 mois",
      participants: 18,
      rating: 4.9,
      location: "En ligne",
      price: "1,800,000 FCFA",
      description: "Maîtrisez les aspects juridiques du travail en contexte africain",
      category: "Droit du Travail"
    },
    {
      id: 3,
      title: "Recrutement et Sélection",
      provider: "Académie du Recrutement",
      duration: "2 mois",
      participants: 30,
      rating: 4.7,
      location: "Dakar, Sénégal",
      price: "1,200,000 FCFA",
      description: "Techniques avancées de recrutement et de sélection de candidats",
      category: "Recrutement"
    },
    {
      id: 4,
      title: "Formation des Formateurs",
      provider: "Institut de Formation Continue",
      duration: "4 mois",
      participants: 15,
      rating: 4.6,
      location: "Abidjan, Côte d'Ivoire",
      price: "3,000,000 FCFA",
      description: "Devenez formateur certifié et développez vos compétences pédagogiques",
      category: "Formation"
    }
  ];

  const categories = [
    "Toutes les formations",
    "Management RH",
    "Droit du Travail",
    "Recrutement",
    "Formation",
    "Santé & Sécurité",
    "Audit RH"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Formations Professionnelles
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Développez vos compétences RH avec nos formations certifiantes 
              adaptées au contexte africain
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 flex items-center px-4">
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Rechercher une formation..."
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

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Formations List */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {formations.length} formations disponibles
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Trier par :</span>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Pertinence</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
                <option>Durée</option>
                <option>Note</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formations.map((formation) => (
              <Card key={formation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      {formation.category}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{formation.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{formation.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {formation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {formation.provider}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {formation.duration}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {formation.participants} participants
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {formation.location}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-lg font-bold text-blue-600">
                      {formation.price}
                    </span>
                    <Button size="sm">
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Voir plus de formations
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Proposez votre formation
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Vous êtes un organisme de formation ? Rejoignez notre réseau 
            et proposez vos formations à notre communauté RH.
          </p>
          <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
            Proposer une formation
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Formation; 