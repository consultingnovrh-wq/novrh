import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Zainabou Chérif HAIDARA",
      domain: "Ressources Humaines",
      profession: "Ingénieure RH et Fondatrice",
      email: "zainabou-c.haidara@novrhconsulting.com",
      expertise: ["Direction RH", "Stratégie RH", "Management d'équipe", "Développement organisationnel"]
    },
    {
      name: "Dao Gniré Mah",
      domain: "Ressources Humaines",
      profession: "Chargée RH",
      email: "mah-g.dao@novrhconsulting.com",
      expertise: ["Recrutement", "Gestion administrative", "Sujets RH", "Administration du personnel"]
    },
    {
      name: "Aïssa DIN",
      domain: "Qualité, Hygiène, Sécurité, Environnement (QHSE) et RSE",
      profession: "Expert QHSE",
      email: "aissa.d@novrhconsulting.com",
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
      ]
    }
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
                À Propos de NovRH CONSULTING
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Votre partenaire RH de confiance pour l'Afrique
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Notre Mission</h2>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-primary">Une Vision Panafricaine</h3>
                  <p className="text-muted-foreground mb-6">
                    NovRH CONSULTING s'engage à transformer le paysage des ressources humaines en Afrique 
                    en connectant les talents, les entreprises et les experts RH à travers tout le continent.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Notre approche éthique et professionnelle nous permet d'accompagner nos clients 
                    dans leurs défis RH les plus complexes, tout en respectant les spécificités 
                    culturelles et économiques de chaque région.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-primary">Nos Valeurs</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                      <span className="text-muted-foreground">Excellence et professionnalisme</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                      <span className="text-muted-foreground">Éthique et transparence</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                      <span className="text-muted-foreground">Innovation et adaptation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                      <span className="text-muted-foreground">Respect de la diversité culturelle</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Notre Équipe d'Experts</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold mb-2 text-primary">{member.name}</h3>
                        <p className="text-base font-semibold mb-3 text-muted-foreground">{member.profession}</p>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{member.email}</span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2 text-sm">Domaine d'expertise:</h4>
                        <p className="text-xs text-muted-foreground">{member.domain}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 text-sm">Compétences:</h4>
                        <div className="flex flex-wrap gap-1">
                          {member.expertise.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t">
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
              
              {/* Contact général */}
              <div className="mt-12 text-center">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary">Contact Général</h3>
                    <p className="text-muted-foreground mb-4">
                      Pour toute question ou demande d'information, n'hésitez pas à nous contacter
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      <span className="font-semibold">contact@novrhconsulting.com</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Nos Résultats</h2>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <p className="text-muted-foreground">Candidats accompagnés</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">150+</div>
                  <p className="text-muted-foreground">Entreprises partenaires</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">12</div>
                  <p className="text-muted-foreground">Pays d'intervention</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;