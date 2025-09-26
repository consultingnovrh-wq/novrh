import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About = () => {
  const teamMembers = [
    {
      name: "Dao Gniré Mah",
      domain: "Ressources Humaines",
      profession: "Chargée RH",
      expertise: ["Recrutement", "Gestion administrative", "Sujets RH"]
    },
    {
      name: "Aïssa DIN",
      domain: "Qualité, Hygiène, Sécurité, Environnement (QHSE) et RSE",
      profession: "Expert QHSE",
      expertise: ["Mise en place de systèmes QSE", "Santé et sécurité au travail", "Suivi des indicateurs", "RSE et développement durable"]
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
              <div className="grid md:grid-cols-2 gap-8">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="bg-white">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold mb-2 text-primary">{member.name}</h3>
                      <p className="text-lg font-semibold mb-4 text-muted-foreground">{member.profession}</p>
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">Domaine d'expertise:</h4>
                        <p className="text-sm text-muted-foreground">{member.domain}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Compétences:</h4>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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