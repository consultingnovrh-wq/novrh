import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrainingInstitutionDashboard from '@/components/TrainingInstitutionDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, Star, Shield, BookOpen, Award } from 'lucide-react';

const TrainingInstitution = () => {
  const [user, setUser] = useState<any>(null);
  const [hasInstitution, setHasInstitution] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà un établissement
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    // Ici vous pouvez vérifier le statut de l'utilisateur
    // setUser(currentUser);
    // setHasInstitution(hasInstitution);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Établissements de Formation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Publiez vos offres de formation et développez votre activité avec notre plateforme dédiée aux établissements de formation.
          </p>
          
          {hasInstitution && (
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg">
              <GraduationCap className="w-5 h-5 mr-2" />
              Établissement vérifié
            </Badge>
          )}
        </div>

        {/* Avantages pour les établissements */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
            Pourquoi rejoindre NovRH ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Publiez vos formations</h3>
              <p className="text-sm text-muted-foreground">
                Créez et gérez vos offres de formation avec notre interface intuitive
              </p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Gérez vos participants</h3>
              <p className="text-sm text-muted-foreground">
                Suivez les inscriptions et gérez vos participants efficacement
              </p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Visibilité accrue</h3>
              <p className="text-sm text-muted-foreground">
                Augmentez votre visibilité auprès des entreprises et particuliers
              </p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Certification</h3>
              <p className="text-sm text-muted-foreground">
                Développez votre crédibilité avec notre système de certification
              </p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Support dédié</h3>
              <p className="text-sm text-muted-foreground">
                Bénéficiez d'un support technique et commercial personnalisé
              </p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">Réseau professionnel</h3>
              <p className="text-sm text-muted-foreground">
                Intégrez notre réseau d'établissements de formation reconnus
              </p>
            </Card>
          </div>
        </div>

        {/* Dashboard des établissements */}
        <TrainingInstitutionDashboard />

        {/* Plans d'abonnement */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
            Plans d'Abonnement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-blue-500">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-blue-500" />
                  Plan Standard
                </CardTitle>
                <div className="text-3xl font-bold text-primary">
                  150 000 XOF
                </div>
                <p className="text-sm text-muted-foreground">par an</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Publier jusqu'à 10 offres de formation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Gestion des participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Support email</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Statistiques de base</span>
                  </div>
                </div>
                
                <Button className="w-full">
                  Choisir ce plan
                </Button>
              </CardContent>
            </Card>

            <Card className="border-yellow-500 bg-yellow-50">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Plan Premium
                </CardTitle>
                <div className="text-3xl font-bold text-primary">
                  300 000 XOF
                </div>
                <p className="text-sm text-muted-foreground">par an</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Publications illimitées</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Mise en avant des offres</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Support prioritaire</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Statistiques avancées</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Certificats personnalisés</span>
                  </div>
                </div>
                
                <Button className="w-full">
                  Choisir ce plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-primary text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Prêt à développer votre activité ?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Rejoignez notre réseau d'établissements de formation et développez votre activité.
              </p>
              <Button size="lg" variant="secondary" className="px-8">
                <GraduationCap className="w-5 h-5 mr-2" />
                Créer mon établissement
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TrainingInstitution;
