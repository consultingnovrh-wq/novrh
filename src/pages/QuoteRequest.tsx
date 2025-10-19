import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuoteRequestForm from '@/components/QuoteRequestForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, CheckCircle, Users, Star } from 'lucide-react';

const QuoteRequest = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    averageResponseTime: '24h'
  });

  useEffect(() => {
    // Charger les statistiques des demandes de devis
    loadStats();
  }, []);

  const loadStats = async () => {
    // Ici vous pouvez charger les vraies statistiques depuis votre API
    setStats({
      totalRequests: 156,
      pendingRequests: 12,
      completedRequests: 144,
      averageResponseTime: '24h'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Demande de Devis
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Obtenez un devis personnalisé pour nos services RH. Notre équipe d'experts vous accompagnera dans vos projets de recrutement, formation et conseil.
          </p>
          
          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12">
            <Card className="text-center p-4 md:p-6">
              <div className="flex justify-center mb-2">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stats.totalRequests}
              </div>
              <div className="text-sm text-muted-foreground">Demandes traitées</div>
            </Card>
            
            <Card className="text-center p-4 md:p-6">
              <div className="flex justify-center mb-2">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stats.pendingRequests}
              </div>
              <div className="text-sm text-muted-foreground">En cours</div>
            </Card>
            
            <Card className="text-center p-4 md:p-6">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stats.completedRequests}
              </div>
              <div className="text-sm text-muted-foreground">Terminées</div>
            </Card>
            
            <Card className="text-center p-4 md:p-6">
              <div className="flex justify-center mb-2">
                <Star className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stats.averageResponseTime}
              </div>
              <div className="text-sm text-muted-foreground">Temps de réponse</div>
            </Card>
          </div>
        </div>

        {/* Services proposés */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
            Nos Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Recrutement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Trouvez les meilleurs candidats pour vos postes avec notre expertise en recrutement.
                </p>
                <Badge variant="outline">À partir de 500 000 FCFA</Badge>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Formation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Développez les compétences de vos équipes avec nos programmes de formation sur mesure.
                </p>
                <Badge variant="outline">À partir de 300 000 FCFA</Badge>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Conseil RH
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Optimisez votre gestion RH avec nos conseils d'experts en ressources humaines.
                </p>
                <Badge variant="outline">À partir de 1 000 000 FCFA</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Formulaire de demande */}
        <div className="max-w-4xl mx-auto">
          <QuoteRequestForm />
        </div>

        {/* Pourquoi choisir NovRH */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
            Pourquoi choisir NovRH ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Expertise reconnue</h3>
              <p className="text-sm text-muted-foreground">
                15+ années d'expérience en RH en Afrique de l'Ouest
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Réactivité</h3>
              <p className="text-sm text-muted-foreground">
                Réponse sous 24h pour toutes vos demandes
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
              <h3 className="font-semibold mb-2">Satisfaction garantie</h3>
              <p className="text-sm text-muted-foreground">
                98% de nos clients recommandent nos services
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuoteRequest;
