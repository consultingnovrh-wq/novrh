import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Politique de Confidentialité
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                NovRH CONSULTING attache une grande importance à la protection de votre vie privée
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
                    <em>
                      À travers nos services NovRH CONSULTING, nous aidons les candidats à rejoindre l'entreprise qui correspond à leurs aspirations. Nous mettons à disposition des entreprises une vitrine pour présenter leur activité, leur culture d'entreprise, valoriser leur marque employeur et leur singularité sur le marché du travail. Notre plateforme ainsi que nos ressources, formations et conseils décryptent en permanence le monde du travail d'aujourd'hui et de demain en Afrique.
                    </em>
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <p className="text-muted-foreground leading-relaxed">
                  NovRH CONSULTING attache une grande importance à la protection de votre vie privée et est soucieux de préserver la confidentialité de vos informations personnelles, que vous soyez un candidat ou un utilisateur individuel (BtoC) ou un recruteur, prospect ou client (BtoB).
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Conscients des spécificités liées à chaque contexte, nous avons élaboré deux politiques distinctes de confidentialité, une dédiée aux candidats et aux particuliers et l'autre aux professionnels du recrutement. Ces politiques reflètent nos engagements envers la protection de vos données personnelles.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Nous vous invitons donc à lire avec attention les présents documents (ci-après, « <strong>Politique de Confidentialité</strong> »). Pour toute question concernant ces documents et, d'une manière générale, sur la collecte et le traitement de vos informations personnelles par NovRH CONSULTING, n'hésitez pas à nous contacter via l'adresse e-mail suivante : <strong>contact@novrhconsulting.com</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation des politiques */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Nos Politiques de Confidentialité</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4 text-primary">Politique de Confidentialité pour les Candidats</h3>
                    <p className="text-muted-foreground mb-6">
                      Découvrez comment nous protégeons vos données personnelles en tant que candidat ou utilisateur individuel.
                    </p>
                    <Badge variant="outline" className="text-sm">
                      BtoC - Particuliers
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4 text-primary">Politique de Confidentialité pour les Recruteurs</h3>
                    <p className="text-muted-foreground mb-6">
                      Informations sur la protection des données pour les professionnels du recrutement et les entreprises.
                    </p>
                    <Badge variant="outline" className="text-sm">
                      BtoB - Professionnels
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Politique pour les Candidats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Politique de Confidentialité pour les Candidats</h2>
              
              <div className="space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">1. Collecte des Données Personnelles</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>Nous collectons les informations suivantes lorsque vous utilisez notre plateforme :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Informations d'identification (nom, prénom, email, téléphone)</li>
                        <li>Informations professionnelles (CV, expérience, compétences)</li>
                        <li>Données de navigation et d'utilisation de la plateforme</li>
                        <li>Informations de localisation (avec votre consentement)</li>
                        <li>Préférences et centres d'intérêt professionnels</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">2. Utilisation des Données</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>Vos données personnelles sont utilisées pour :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Créer et gérer votre compte candidat</li>
                        <li>Vous proposer des offres d'emploi personnalisées</li>
                        <li>Faciliter la mise en relation avec les employeurs</li>
                        <li>Améliorer nos services et votre expérience utilisateur</li>
                        <li>Vous envoyer des informations pertinentes (avec votre consentement)</li>
                        <li>Respecter nos obligations légales</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">3. Partage des Données</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>Nous ne partageons vos données personnelles qu'avec :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Les employeurs que vous avez autorisés à consulter votre profil</li>
                        <li>Nos partenaires de confiance (avec votre consentement explicite)</li>
                        <li>Les autorités compétentes si requis par la loi</li>
                        <li>Nos prestataires techniques (sous contrat de confidentialité)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">4. Vos Droits</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>Conformément au RGPD et aux lois applicables, vous disposez des droits suivants :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Droit d'accès :</strong> Consulter vos données personnelles</li>
                        <li><strong>Droit de rectification :</strong> Corriger vos informations</li>
                        <li><strong>Droit d'effacement :</strong> Supprimer vos données</li>
                        <li><strong>Droit à la portabilité :</strong> Récupérer vos données</li>
                        <li><strong>Droit d'opposition :</strong> Vous opposer au traitement</li>
                        <li><strong>Droit de limitation :</strong> Limiter l'utilisation de vos données</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">5. Sécurité des Données</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Chiffrement des données sensibles</li>
                        <li>Accès restreint aux données personnelles</li>
                        <li>Surveillance continue de la sécurité</li>
                        <li>Formation du personnel à la protection des données</li>
                        <li>Sauvegardes régulières et sécurisées</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Politique pour les Recruteurs */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Politique de Confidentialité pour les Recruteurs</h2>
              
              <div className="space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">1. Collecte des Données Entreprise</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>En tant qu'employeur ou recruteur, nous collectons :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Informations de l'entreprise (raison sociale, secteur d'activité)</li>
                        <li>Données de contact des responsables RH</li>
                        <li>Informations sur les postes à pourvoir</li>
                        <li>Données de facturation et paiement</li>
                        <li>Statistiques d'utilisation de la plateforme</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">2. Utilisation des Données Entreprise</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>Vos données sont utilisées pour :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Gérer votre compte employeur</li>
                        <li>Publier et promouvoir vos offres d'emploi</li>
                        <li>Vous mettre en relation avec des candidats qualifiés</li>
                        <li>Fournir des statistiques et analyses de recrutement</li>
                        <li>Gérer la facturation et les paiements</li>
                        <li>Améliorer nos services de recrutement</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">3. Partage avec les Candidats</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>Nous partageons avec les candidats :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Les informations de l'entreprise que vous choisissez de rendre publiques</li>
                        <li>Les offres d'emploi que vous publiez</li>
                        <li>Votre profil employeur (si vous l'activez)</li>
                        <li>Les informations de contact que vous autorisez</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">4. Conservation des Données</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>Nous conservons vos données :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Pendant la durée de votre abonnement</li>
                        <li>3 ans après la fin du contrat (données de facturation)</li>
                        <li>Selon les obligations légales applicables</li>
                        <li>Jusqu'à votre demande de suppression</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact et Informations */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-center">Contact et Informations</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4">Responsable de la Protection des Données</h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p><strong>NovRH CONSULTING</strong></p>
                        <p>Email : contact@novrhconsulting.com</p>
                        <p>Téléphone : +223 76 72 24 47</p>
                        <p>Adresse : Bamako, Mali</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-4">Délégué à la Protection des Données</h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p>Pour toute question relative à la protection de vos données personnelles, vous pouvez contacter notre DPO :</p>
                        <p>Email : contact@novrhconsulting.com</p>
                        <p>Vous avez également le droit de saisir l'autorité de contrôle compétente.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

export default PrivacyPolicy;
