import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceReviews from '@/components/ServiceReviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, Users, Award, ThumbsUp } from 'lucide-react';

const Reviews = () => {
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    satisfiedClients: 0,
    responseRate: 0
  });

  useEffect(() => {
    // Charger les statistiques des avis
    loadStats();
  }, []);

  const loadStats = async () => {
    // Ici vous pouvez charger les vraies statistiques depuis votre API
    setStats({
      totalReviews: 247,
      averageRating: 4.8,
      satisfiedClients: 98,
      responseRate: 100
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Avis Clients
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Découvrez ce que nos clients pensent de nos services et partagez votre expérience avec NovRH.
          </p>
          
          {/* Statistiques globales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12">
            <Card className="text-center p-4 md:p-6">
              <div className="flex justify-center mb-2">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stats.averageRating}
              </div>
              <div className="text-sm text-muted-foreground">Note moyenne</div>
            </Card>
            
            <Card className="text-center p-4 md:p-6">
              <div className="flex justify-center mb-2">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stats.totalReviews}
              </div>
              <div className="text-sm text-muted-foreground">Avis clients</div>
            </Card>
            
            <Card className="text-center p-4 md:p-6">
              <div className="flex justify-center mb-2">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stats.satisfiedClients}%
              </div>
              <div className="text-sm text-muted-foreground">Clients satisfaits</div>
            </Card>
            
            <Card className="text-center p-4 md:p-6">
              <div className="flex justify-center mb-2">
                <ThumbsUp className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stats.responseRate}%
              </div>
              <div className="text-sm text-muted-foreground">Taux de réponse</div>
            </Card>
          </div>
        </div>

        {/* Système d'avis */}
        <ServiceReviews />

        {/* Témoignages clients */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
            Témoignages Clients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <Award className="w-3 h-3 mr-1" />
                    Vérifié
                  </Badge>
                </div>
                <CardTitle className="text-lg">Service exceptionnel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  "NovRH nous a aidés à trouver les meilleurs candidats pour notre équipe. 
                  Leur expertise en recrutement est remarquable."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Marie Diallo</p>
                    <p className="text-xs text-muted-foreground">Directrice RH, TechCorp</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <Award className="w-3 h-3 mr-1" />
                    Vérifié
                  </Badge>
                </div>
                <CardTitle className="text-lg">Formation de qualité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  "Les formations proposées par NovRH sont très pertinentes et bien structurées. 
                  Je recommande vivement leurs services."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Amadou Ba</p>
                    <p className="text-xs text-muted-foreground">Manager, AgroFinance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <Award className="w-3 h-3 mr-1" />
                    Vérifié
                  </Badge>
                </div>
                <CardTitle className="text-lg">Conseil RH excellent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  "L'équipe de NovRH nous a accompagnés dans la restructuration de notre département RH. 
                  Résultats excellents et équipe très professionnelle."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Fatou Seck</p>
                    <p className="text-xs text-muted-foreground">CEO, GreenEnergy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pourquoi nos clients nous font confiance */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
            Pourquoi nos clients nous font confiance ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Expertise reconnue</h3>
              <p className="text-sm text-muted-foreground">
                15+ années d'expérience en RH en Afrique de l'Ouest
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Approche personnalisée</h3>
              <p className="text-sm text-muted-foreground">
                Solutions adaptées à vos besoins spécifiques
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Qualité garantie</h3>
              <p className="text-sm text-muted-foreground">
                98% de nos clients recommandent nos services
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Support continu</h3>
              <p className="text-sm text-muted-foreground">
                Accompagnement tout au long de votre projet
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-primary text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Partagez votre expérience
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Votre avis compte ! Aidez d'autres entreprises à découvrir nos services.
              </p>
              <Button size="lg" variant="secondary" className="px-8">
                <MessageSquare className="w-5 h-5 mr-2" />
                Laisser un avis
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reviews;
