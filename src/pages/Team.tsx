import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Award, Users, Target } from "lucide-react";

const Team = () => {
  const teamMembers = [
    {
      name: "Zainabou Chérif HAIDARA",
      role: "Ingénieure RH et Fondatrice",
      email: "zainabou-c.haidara@novrhconsulting.com",
      domain: "Ressources Humaines",
      expertise: ["Direction RH", "Stratégie RH", "Management d'équipe", "Développement organisationnel"],
      description: "Fondatrice de NovRH CONSULTING, experte en ressources humaines avec une vision panafricaine du développement des talents.",
      achievements: ["15+ années d'expérience", "Expertise panafricaine", "Formation en RH"]
    },
    {
      name: "Dao Gniré Mah",
      role: "Chargée RH",
      email: "mah-g.dao@novrhconsulting.com",
      domain: "Ressources Humaines",
      expertise: ["Recrutement", "Gestion administrative", "Sujets RH", "Administration du personnel"],
      description: "Spécialiste en recrutement et gestion administrative, elle accompagne les entreprises dans leurs processus RH.",
      achievements: ["Expert en recrutement", "Gestion administrative", "Accompagnement RH"]
    },
    {
      name: "Aïssa DIN",
      role: "Expert QHSE",
      email: "aissa.d@novrhconsulting.com",
      domain: "Qualité, Hygiène, Sécurité, Environnement (QHSE) et RSE",
      expertise: [
        "Mise en place de systèmes de management QSE",
        "Santé et sécurité au travail (SST)",
        "Suivi des indicateurs",
        "RSE et développement durable",
        "Audits internes et conformité réglementaire",
        "Gestion des risques et plan de continuité d'activité (PCA)",
        "Sensibilisation et formation du personnel aux bonnes pratiques QHSE",
        "Sensibilisation SST",
        "Évaluation des risques professionnels",
        "Gestion de crise"
      ],
      description: "Expert en QHSE et RSE, il accompagne les organisations dans la mise en place de systèmes de management intégrés.",
      achievements: ["Certification QHSE", "Expert RSE", "Formation sécurité"]
    }
  ];

  const stats = [
    { icon: Users, label: "Membres de l'équipe", value: "3" },
    { icon: Award, label: "Années d'expérience", value: "50+" },
    { icon: Target, label: "Pays d'intervention", value: "12" },
    { icon: Users, label: "Clients accompagnés", value: "500+" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Notre Équipe d'Experts
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Des professionnels passionnés au service de votre réussite RH
              </p>
              <div className="flex justify-center">
                <Badge variant="outline" className="text-lg px-6 py-2">
                  NovRH CONSULTING
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <Icon className="w-8 h-8 text-primary mx-auto mb-4" />
                        <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Rencontrez Notre Équipe</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <CardContent className="p-8">
                      {/* Header */}
                      <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-primary">{member.name}</h3>
                        <p className="text-base font-semibold mb-3 text-muted-foreground">{member.role}</p>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                          <Mail className="w-4 h-4" />
                          <span>{member.email}</span>
                        </div>
                      </div>
                      
                      {/* Domain */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Domaine d'expertise
                        </h4>
                        <p className="text-xs text-muted-foreground">{member.domain}</p>
                      </div>
                      
                      {/* Description */}
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {member.description}
                        </p>
                      </div>
                      
                      {/* Expertise */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Compétences clés
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {member.expertise.slice(0, 4).map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {member.expertise.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.expertise.length - 4} autres
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Achievements */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2 text-sm">Réalisations</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {member.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Contact Button */}
                      <div className="pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.location.href = `mailto:${member.email}`}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Contacter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-8 text-center">
                  <h2 className="text-3xl font-bold mb-6 text-primary">Notre Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Chez NovRH CONSULTING, nous croyons que chaque talent mérite d'être découvert et chaque entreprise mérite de trouver les bonnes personnes. Notre équipe d'experts s'engage à transformer le paysage des ressources humaines en Afrique.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="default" onClick={() => window.location.href = '/contact'}>
                      Nous Contacter
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/about'}>
                      En Savoir Plus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Contactez Notre Équipe</h2>
              <p className="text-muted-foreground mb-8">
                Notre équipe est à votre disposition pour vous accompagner dans vos projets RH
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Email Général</h3>
                    <p className="text-sm text-muted-foreground">contact@novrhconsulting.com</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Téléphone</h3>
                    <p className="text-sm text-muted-foreground">+223 76 72 24 47</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Adresse</h3>
                    <p className="text-sm text-muted-foreground">Bamako, Mali</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Team;
