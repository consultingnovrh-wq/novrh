import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Politique de gestion des cookies de NovRH CONSULTING
              </h1>
              <p className="text-lg text-muted-foreground">
                Version en date du {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Introduction */}
              <Card>
                <CardContent className="p-8">
                  <p className="text-muted-foreground mb-4">
                    NovRH CONSULTING via son Site rend les entreprises plus attractives en faisant rayonner leur marque employeur et en permettant d'offrir une expérience de recrutement fluide aux candidats et aux recruteurs. NovRH CONSULTING met également à disposition de ses utilisateurs un média sur le travail reprenant des articles, interviews et des ebooks.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    La Politique de gestion des Cookies a pour objectif de définir les règles applicables au dépôt et l'utilisation de cookies via la navigation sur notre site (ci-après notre « Site NovRH ») et l'utilisation des Services mis en place par NovRH CONSULTING (ci-après, « Nous », « NovRH CONSULTING » ou « NovRH »).
                  </p>
                  <p className="text-muted-foreground mb-4">
                    La Politique de gestion des Cookies fait partie intégrante de notre Politique de Confidentialité et est soumise aux mêmes définitions, règles d'acceptation et de mise à jour. Vous pouvez consulter la dite Politique de Confidentialité via le lien suivant : <a href="/privacy" className="text-primary hover:underline">Politique de confidentialité</a>.
                  </p>
                  <p className="text-muted-foreground">
                    En poursuivant votre navigation sur notre Site ou votre utilisation de nos Services, vous acceptez l'utilisation de cookies et de technologies similaires dans les conditions décrites au sein de la présente politique.
                  </p>
                </CardContent>
              </Card>

              {/* Section 1 */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">1. Qu'est-ce qu'un cookie ?</h2>
                  <p className="text-muted-foreground mb-4">
                    Les cookies sont de petits fichiers texte enregistrés sur votre terminal, regroupant un certain nombre de données sur votre navigation (ex. date, heure et nombre de visites, source d'arrivée, préférences).
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-4">1.1 Cookies internes et cookies tiers :</h3>
                  <p className="text-muted-foreground mb-4">
                    Un <strong>cookie tiers</strong> est placé sur votre terminal par un serveur d'un domaine distinct de celui du Site. Ces tiers installent des cookies lorsque vous êtes connectés sur leurs pages ou que vous consultez notre Site. Ces cookies permettent de suivre un comportement sur un réseau de sites, en analysant l'historique de visites à des fins de ciblage.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    NovRH CONSULTING n'a pas accès à ces cookies à la différence des <strong>cookies internes</strong> qui sont directement géré par notre Site.
                  </p>

                  <h3 className="text-xl font-semibold mt-6 mb-4">1.2 Cookies permanents et cookies de session :</h3>
                  <p className="text-muted-foreground mb-4">
                    Les <strong>cookies permanents</strong> sont stockés sur votre terminal jusqu'à sa date d'expiration ou jusqu'à ce que vous le supprimiez.
                  </p>
                  <p className="text-muted-foreground">
                    Les <strong>cookies de session</strong> sont supprimés automatiquement lorsque vous quittez votre navigateur.
                  </p>
                </CardContent>
              </Card>

              {/* Section 2 */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">2. Comment gérer les cookies ?</h2>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-4">2.1 Accepter, refuser ou paramétrer les cookies lors de votre première visite</h3>
                  <p className="text-muted-foreground mb-4">
                    Le dépôt des cookies sur votre terminal suppose le recueil de votre consentement, ou de notre intérêt légitime lorsqu'il s'agit de cookies strictement nécessaires. Ainsi, dès votre arrivée sur notre Site, un bandeau d'information vous indique que nous utilisons cette technologie et qu'en poursuivant votre navigation, vous acceptez le dépôt de cookies sur votre terminal.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Vous pouvez néanmoins les paramétrer à tout moment en cliquant sur le lien suivant : <a href="/cookie-management" className="text-primary hover:underline">Paramétrer les cookies</a>.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    La suppression de cookies fonctionnels, qui sont nécessaires à la fourniture de contenus par NovRH CONSULTING, peut vous empêcher d'accéder à certains contenus du Site.
                  </p>
                  <p className="text-muted-foreground">
                    NovRH CONSULTING décline toute responsabilité relativement aux conséquences liées au fonctionnement dégradé de son Site résultant de l'impossibilité d'enregistrer ou de consulter les cookies nécessaires au fonctionnement du Site, et dont vous auriez refusé le dépôt ou requis la suppression.
                  </p>

                  <h3 className="text-xl font-semibold mt-6 mb-4">2.2 Accepter, refuser ou paramétrer les cookies via votre navigateur</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous avez également la possibilité de gérer le dépôt de cookies à l'aide du paramétrage de votre navigateur, par les moyens décrits ci-dessous.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>Choix offerts par votre logiciel de navigation :</strong> Vous pouvez configurer votre logiciel de navigation de manière que des cookies soient enregistrés sur votre terminal ou, au contraire, qu'ils soient rejetés, soit systématiquement, soit selon leur émetteur. Vous pouvez également configurer votre logiciel de navigation de manière que l'acceptation ou le refus des cookies vous soit proposé, avant qu'un cookie soit susceptible d'être enregistré sur votre terminal.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    La gestion des cookies diffère selon la configuration de chaque navigateur. Pour plus de détails, cliquez sur les liens ci-dessous.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                    <li>Pour Internet Explorer : <a href="https://support.microsoft.com/en-gb/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Gérer les cookies</a></li>
                    <li>Pour Safari : <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Gérer les cookies</a></li>
                    <li>Pour Google Chrome : <a href="https://support.google.com/chrome/answer/95647?hl=fr&hlrm=en" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Gérer les cookies</a></li>
                    <li>Pour Firefox : <a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Gérer les cookies</a></li>
                  </ul>
                  <p className="text-muted-foreground mb-4">
                    Ce paramétrage sera susceptible de modifier votre navigation sur Internet et vos conditions d'accès à certains services nécessitant l'utilisation de cookies.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Ce paramétrage n'empêchera pas l'affichage de publicités sur les sites Internet que vous visitez mais il bloquera les technologies permettant d'adapter des publicités à vos centres d'intérêts.
                  </p>
                  <p className="text-muted-foreground">
                    Pour plus d'information sur les cookies et leur utilisation, vous pouvez consulter le site de la Commission Nationale de l'Informatique et des Libertés (CNIL) à l'adresse suivante : <a href="https://www.cnil.fr/fr/site-web-cookies-et-autres-traceurs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>.
                  </p>

                  <h3 className="text-xl font-semibold mt-6 mb-4">2.3 Accepter, refuser ou paramétrer les cookies via votre smartphone</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous pouvez décider de modifier le paramétrage de confidentialité de votre smartphone.
                  </p>
                  <p className="text-muted-foreground">
                    Pour paramétrer vos réglages de confidentialité :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Système Apple : <a href="https://support.apple.com/fr-fr/HT201265" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Paramètres iOS</a></li>
                    <li>Système Android : <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Paramètres Android</a></li>
                  </ul>
                </CardContent>
              </Card>

              {/* Section 3 */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">3. Quel type de cookies utilisons-nous ?</h2>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-4">3.1 Cookies Strictement Nécessaires</h3>
                  <p className="text-muted-foreground mb-4">
                    Ces cookies assurent les fonctionnalités essentielles du Site et assurent le bon fonctionnement du Site. Ils ne peuvent pas être désactivés de nos systèmes. Vous pouvez cependant configurer votre navigateur pour bloquer ou être alerté de l'utilisation de ces cookies. Le cas échéant, certaines parties du site ne pourront pas fonctionner.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    L'utilisation de ces cookies par notre Site est fondée sur notre intérêt légitime afin d'assurer la sécurité, le fonctionnement technique et l'accessibilité du Site et de nos différents services.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Les cookies strictement nécessaires utilisés sur notre site incluent notamment :
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left">Domaine</th>
                          <th className="border border-gray-300 p-2 text-left">Nom du cookie</th>
                          <th className="border border-gray-300 p-2 text-left">Durée de conservation</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-2">NovRH CONSULTING</td>
                          <td className="border border-gray-300 p-2">session_token</td>
                          <td className="border border-gray-300 p-2">Fin de la session</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2">NovRH CONSULTING</td>
                          <td className="border border-gray-300 p-2">user_preferences</td>
                          <td className="border border-gray-300 p-2">1 an</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2">NovRH CONSULTING</td>
                          <td className="border border-gray-300 p-2">csrf_token</td>
                          <td className="border border-gray-300 p-2">Fin de la session</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-xl font-semibold mt-6 mb-4">3.2 Cookies Fonctionnels</h3>
                  <p className="text-muted-foreground mb-4">
                    Ces cookies permettent d'améliorer les fonctionnalités et la personnalisation du Site. Ils peuvent être activés par nos services ou par des services fournis par des tiers que nous avons ajoutés à nos pages. Si vous n'autorisez pas ces cookies, certains ou tous ces services peuvent ne pas fonctionner correctement.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    L'utilisation de ces cookies est fondée sur votre consentement.
                  </p>

                  <h3 className="text-xl font-semibold mt-6 mb-4">3.3 Cookies de performance</h3>
                  <p className="text-muted-foreground mb-4">
                    Ces cookies nous permettent d'analyser de manière anonyme la fréquentation des pages (nombre de visités, activité des visiteurs, fréquences de retour), comment vous naviguez sur notre Site et les performances du Site.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    L'utilisation de ces cookies est fondée sur votre consentement, si vous refusez ces cookies, nous ne pourrons pas savoir quand est-ce que vous avez visité notre Site, ni connaître le parcours de votre navigation sur notre Site.
                  </p>

                  <h3 className="text-xl font-semibold mt-6 mb-4">3.4 Cookies de ciblage</h3>
                  <p className="text-muted-foreground mb-4">
                    Ces cookies nous permettent de vous proposer des annonces personnalisées en fonction de votre navigation sur le site.
                    Ces cookies peuvent être activés sur notre Site par nos partenaires et servent ainsi à établir un profil sur vos intérêts et vous proposer des offres ciblées sur d'autres sites internet.
                  </p>
                  <p className="text-muted-foreground">
                    L'utilisation de ces cookies est fondée sur votre consentement, si vous refusez ces cookies aucune offre personnalisée ne vous sera proposée.
                  </p>
                </CardContent>
              </Card>

              {/* Section 4 */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">4. Respect de vos droits</h2>
                  <p className="text-muted-foreground mb-4">
                    Vous disposez d'un droit d'accès, de rectification, d'opposition, de suppression et de limitation pour les informations issues des cookies et autres traceurs.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Ces droits peuvent être exercés à tout moment en contactant NovRH CONSULTING à l'adresse <a href="mailto:contact@novrhconsulting" className="text-primary hover:underline">contact@novrhconsulting</a>.
                  </p>
                  <p className="text-muted-foreground">
                    Après nous avoir contacté, si vous estimez que vos droits ne sont pas respectés, vous disposez en outre du droit d'introduire une réclamation auprès d'une autorité de contrôle.
                    L'autorité de contrôle malienne est l'Autorité de Protection des Données Personnelles (APDP).
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;

