import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Eye } from "lucide-react";

const CVTheque = () => {
  const profiles = [
    {
      id: 1,
      name: "Aminata Traoré",
      title: "Responsable RH Senior",
      experience: "8 ans",
      location: "Bamako, Mali",
      skills: ["Recrutement", "Formation", "Paie", "Droit du travail"],
      education: "Master en GRH",
      availability: "Disponible",
    },
    {
      id: 2,
      name: "Moussa Diallo",
      title: "Consultant QHSE",
      experience: "5 ans",
      location: "Dakar, Sénégal",
      skills: ["Sécurité", "Audit", "Formation SST", "Certification ISO"],
      education: "Ingénieur Sécurité",
      availability: "En poste",
    },
    {
      id: 3,
      name: "Fatou Ndiaye",
      title: "Formatrice Professionnelle",
      experience: "6 ans",
      location: "Abidjan, Côte d'Ivoire",
      skills: ["Formation adulte", "E-learning", "Évaluation", "Pédagogie"],
      education: "Master en Ingénierie Pédagogique",
      availability: "Disponible",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">CVthèque</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Trouvez les meilleurs profils RH et consultants en Afrique
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
                    <Input placeholder="Rechercher par nom ou compétence" className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rh">Ressources Humaines</SelectItem>
                      <SelectItem value="qhse">QHSE</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
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

        {/* Profiles Listing */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {profiles.length} profils trouvés
              </h2>
            </div>

            <div className="grid gap-6">
              {profiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{profile.name}</CardTitle>
                        <CardDescription className="text-lg font-medium text-primary">
                          {profile.title}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-1">
                          {profile.experience} d'expérience • {profile.location}
                        </p>
                      </div>
                      <Badge 
                        variant={profile.availability === "Disponible" ? "default" : "secondary"}
                      >
                        {profile.availability}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Formation :</p>
                        <p className="text-sm text-muted-foreground">{profile.education}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Compétences :</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Voir le profil
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger CV
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

export default CVTheque;