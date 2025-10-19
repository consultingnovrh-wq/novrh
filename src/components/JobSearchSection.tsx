import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Clock, Users, TrendingUp } from "lucide-react";
import { useRealStats } from "@/hooks/use-real-stats";

const JobSearchSection = () => {
  const [searchKeywords, setSearchKeywords] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const { stats, loading: statsLoading, formatNumber } = useRealStats();

  const jobCategories = [
    "Toutes spécialités",
    "Ressources Humaines",
    "Finances & Comptabilité", 
    "Marketing & Communication",
    "Informatique & Tech",
    "Santé & Sécurité",
    "Management",
    "Commercial & Ventes"
  ];

  const locations = [
    "Tous les pays",
    "Côte d'Ivoire - Abidjan",
    "Sénégal - Dakar", 
    "Mali - Bamako",
    "Burkina Faso - Ouagadougou",
    "Ghana - Accra",
    "Nigeria - Lagos",
    "Cameroun - Douala"
  ];

  const featuredJobs = [
    {
      title: "Directeur des Ressources Humaines",
      company: "TechCorp Africa",
      location: "Abidjan, Côte d'Ivoire",
      type: "CDI",
      salary: "2 500 000 - 3 500 000 FCFA",
      tags: ["Management", "RH", "Leadership"],
      posted: "il y a 2 jours"
    },
    {
      title: "Responsable Formation",
      company: "Banque Atlantique",
      location: "Dakar, Sénégal", 
      type: "CDI",
      salary: "1 800 000 - 2 200 000 FCFA",
      tags: ["Formation", "RH", "Développement"],
      posted: "il y a 1 semaine"
    },
    {
      title: "Consultant RH Senior",
      company: "NovRH Consulting",
      location: "Bamako, Mali",
      type: "Mission",
      salary: "À négocier",
      tags: ["Conseil", "Audit", "RH"],
      posted: "il y a 3 jours"
    }
  ];

  const statsData = [
    { icon: <Briefcase className="w-6 h-6" />, value: formatNumber(stats.totalJobs), label: "Offres d'emploi" },
    { icon: <Users className="w-6 h-6" />, value: formatNumber(stats.totalCandidates), label: "Candidats inscrits" },
    { icon: <TrendingUp className="w-6 h-6" />, value: formatNumber(stats.successfulRecruitments), label: "Recrutements réussis" },
    { icon: <Clock className="w-6 h-6" />, value: stats.averageResponseTime, label: "Temps moyen de réponse" }
  ];

  return (
    <section id="job-search" className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Trouvez votre emploi idéal
          </h2>
          <p className="text-lg text-primary/80 max-w-2xl mx-auto">
            Découvrez des milliers d'opportunités d'emploi en Afrique de l'Ouest avec notre plateforme de recrutement moderne
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-5xl mx-auto mb-8 md:mb-12">
          <Card className="p-4 md:p-6 shadow-elegant">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="sm:col-span-2 md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Rechercher par mots-clés (ex: développeur, manager, comptable)"
                    value={searchKeywords}
                    onChange={(e) => setSearchKeywords(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Mots-clés : poste, compétences, entreprise
                </p>
              </div>
              
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes spécialités" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Ou saisissez votre spécialité
                </p>
                <Input
                  placeholder="Votre spécialité (ex: RH, Finance, IT)"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Ou saisissez votre pays
                </p>
                <Input
                  placeholder="Votre pays (ex: Mali, Sénégal, Côte d'Ivoire)"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

                                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <Button size="lg" className="bg-[#00167a] hover:bg-[#00167a]/90 flex-1 sm:flex-none">
                          <Search className="w-4 h-4 mr-2" />
                          RECHERCHER
                        </Button>
                        <Button variant="outline" size="lg" className="border-[#00167a] text-[#00167a] hover:bg-[#00167a] hover:text-white">
                          Recherche Avancée
                        </Button>
                      </div>
          </Card>
        </div>

                          {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
                    {statsData.map((stat, index) => (
                      <Card key={index} className="text-center p-3 md:p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-center mb-3 text-primary">
                          {stat.icon}
                        </div>
                        <div className="text-lg md:text-2xl font-bold text-primary mb-1">{stat.value}</div>
                        <div className="text-xs md:text-sm text-primary/80">{stat.label}</div>
                      </Card>
                    ))}
                  </div>

        {/* Featured Jobs */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 text-primary">Offres à la Une</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {featuredJobs.map((job, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xl font-semibold text-foreground">{job.title}</h4>
                        <Badge variant="outline" className="ml-2">{job.type}</Badge>
                      </div>
                      <p className="text-primary font-medium mb-2">{job.company}</p>
                      <div className="flex items-center text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{job.location}</span>
                        <span className="mx-2">•</span>
                        <span className="text-sm">{job.posted}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm font-medium text-foreground">{job.salary}</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <Button variant="outline" className="w-full md:w-auto">
                        Voir l'offre
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="border-[#00167a] text-[#00167a] hover:bg-[#00167a] hover:text-white">
              Voir toutes les offres
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSearchSection;