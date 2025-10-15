import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Conditions Générales d'Utilisation
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Les présentes conditions régissent l'utilisation de la plateforme NovRH CONSULTING
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-8">
                <CardContent className="p-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    <strong>Article 1 - Objet et acceptation</strong>
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Les présentes conditions générales d'utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions d'utilisation de la plateforme NovRH CONSULTING accessible à l'adresse www.novrhconsulting.com (ci-après « la Plateforme »).
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos services.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Article 2 - Définitions</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Plateforme :</strong> Le site web et les services NovRH CONSULTING</li>
                        <li><strong>Utilisateur :</strong> Toute personne utilisant la Plateforme</li>
                        <li><strong>Candidat :</strong> Utilisateur recherchant un emploi ou une formation</li>
                        <li><strong>Employeur :</strong> Entreprise ou organisation utilisant la Plateforme pour recruter</li>
                        <li><strong>Compte :</strong> Espace personnel de l'utilisateur sur la Plateforme</li>
                        <li><strong>Contenu :</strong> Toute information publiée sur la Plateforme</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Article 3 - Services Proposés</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>NovRH CONSULTING propose les services suivants :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Mise en relation entre candidats et employeurs</li>
                        <li>Publication et consultation d'offres d'emploi</li>
                        <li>Gestion de CV et profils candidats</li>
                        <li>Formations et conseils en ressources humaines</li>
                        <li>Services de recrutement et d'accompagnement RH</li>
                        <li>Outils de gestion de carrière</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Article 4 - Inscription et Compte Utilisateur</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p><strong>4.1 Conditions d'inscription</strong></p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Être âgé d'au moins 16 ans</li>
                        <li>Fournir des informations exactes et à jour</li>
                        <li>Accepter les présentes CGU</li>
                        <li>Respecter la législation en vigueur</li>
                      </ul>
                      
                      <p className="mt-6"><strong>4.2 Responsabilités de l'utilisateur</strong></p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Maintenir la confidentialité de ses identifiants</li>
                        <li>Informer NovRH CONSULTING de toute utilisation non autorisée</li>
                        <li>Mettre à jour ses informations personnelles</li>
                        <li>Respecter les droits des autres utilisateurs</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Article 5 - Obligations des Utilisateurs</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p><strong>5.1 Obligations générales</strong></p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Utiliser la Plateforme conformément à sa destination</li>
                        <li>Respecter les droits de propriété intellectuelle</li>
                        <li>Ne pas porter atteinte à l'image de NovRH CONSULTING</li>
                        <li>Respecter la vie privée des autres utilisateurs</li>
                      </ul>
                      
                      <p className="mt-6"><strong>5.2 Interdictions</strong></p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Publier des contenus illégaux, diffamatoires ou offensants</li>
                        <li>Utiliser la Plateforme à des fins commerciales non autorisées</li>
                        <li>Tenter de contourner les mesures de sécurité</li>
                        <li>Collecter des données d'autres utilisateurs</li>
                        <li>Envoyer des messages non sollicités (spam)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Article 6 - Propriété Intellectuelle</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p><strong>6.1 Droits de NovRH CONSULTING</strong></p>
                      <p>La Plateforme et tous ses éléments (design, textes, images, logos, etc.) sont protégés par le droit d'auteur et appartiennent à NovRH CONSULTING.</p>
                      
                      <p className="mt-6"><strong>6.2 Contenu des utilisateurs</strong></p>
                      <p>En publiant du contenu sur la Plateforme, l'utilisateur accorde à NovRH CONSULTING une licence non exclusive pour l'utiliser dans le cadre des services proposés.</p>
                      
                      <p className="mt-6"><strong>6.3 Respect des droits tiers</strong></p>
                      <p>L'utilisateur s'engage à ne pas publier de contenu portant atteinte aux droits de propriété intellectuelle de tiers.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Article 7 - Protection des Données Personnelles</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>Le traitement des données personnelles est régi par notre Politique de Confidentialité, conforme au RGPD et aux lois applicables au Mali et en Afrique de l'Ouest.</p>
                      <p>L'utilisateur dispose de droits sur ses données personnelles qu'il peut exercer en contactant privacy@novrhconsulting.com</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Article 8 - Responsabilité et Garanties</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p><strong>8.1 Limitation de responsabilité</strong></p>
                      <p>NovRH CONSULTING s'efforce d'assurer la disponibilité de la Plateforme mais ne peut garantir un fonctionnement sans interruption. La responsabilité de NovRH CONSULTING ne saurait être engagée en cas de :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Interruption temporaire de la Plateforme</li>
                        <li>Perte de données due à des circonstances indépendantes de sa volonté</li>
                        <li>Dommages indirects résultant de l'utilisation de la Plateforme</li>
                      </ul>
                      
                      <p className="mt-6"><strong>8.2 Responsabilité de l'utilisateur</strong></p>
                      <p>L'utilisateur est seul responsable de l'utilisation qu'il fait de la Plateforme et des conséquences qui en découlent.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Article 9 - Suspension et Résiliation</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p><strong>9.1 Suspension</strong></p>
                      <p>NovRH CONSULTING se réserve le droit de suspendre temporairement l'accès d'un utilisateur en cas de non-respect des présentes CGU.</p>
                      
                      <p className="mt-6"><strong>9.2 Résiliation</strong></p>
                      <p>L'utilisateur peut résilier son compte à tout moment. NovRH CONSULTING peut résilier le compte d'un utilisateur après mise en demeure restée sans effet.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Article 10 - Modification des CGU</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>NovRH CONSULTING se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prendront effet dès leur publication sur la Plateforme.</p>
                      <p>L'utilisateur sera informé des modifications importantes par email ou par notification sur la Plateforme.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Article 11 - Droit Applicable et Juridiction</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>Les présentes CGU sont régies par le droit malien. En cas de litige, les tribunaux de Bamako seront seuls compétents.</p>
                      <p>Avant tout recours judiciaire, les parties s'efforceront de résoudre leur différend à l'amiable.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Article 12 - Contact</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>Pour toute question relative aux présentes CGU, vous pouvez nous contacter :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Email : contact@novrhconsulting.com</li>
                        <li>Adresse : Bamako, Mali</li>
                        <li>Téléphone : +223 76 72 24 47</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Dernière mise à jour */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm text-muted-foreground">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
