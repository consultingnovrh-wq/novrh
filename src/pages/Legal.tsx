import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Legal = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Mentions Légales
              </h1>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Éditeur */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">Éditeur</h2>
                  <p className="text-muted-foreground mb-4">
                    Le site est édité par NovRH CONSULTING.
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong className="text-foreground">Nom commercial :</strong> NovRH CONSULTING</p>
                    <p><strong className="text-foreground">Adresse :</strong> Yirimadjo, Bamako, MALI</p>
                    <p><strong className="text-foreground">Téléphone :</strong> +33 7 51 49 08 71 / +223 76 72 24 47</p>
                    <p><strong className="text-foreground">Email :</strong> contact@novrhconsulting</p>
                    <p><strong className="text-foreground">N° NINA :</strong> 32509196892259Z</p>
                    <p><strong className="text-foreground">RCCM :</strong> MA.BKO.2025.A.5747</p>
                  </div>
                </CardContent>
              </Card>

              {/* Directeur de la publication */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">Directeur de la publication</h2>
                  <p className="text-muted-foreground">
                    Madame HAIDARA Zainabou cherif, fondatrice et RH
                  </p>
                </CardContent>
              </Card>

              {/* Hébergeur */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">Hébergeur</h2>
                  <p className="text-muted-foreground mb-4">
                    Le site est hébergé par :
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong className="text-foreground">Blueshoot</strong></p>
                    <p><strong className="text-foreground">Netlify</strong></p>
                    <p className="text-sm mt-4">
                      Pour plus d'informations sur l'hébergement, veuillez consulter les sites respectifs des hébergeurs.
                    </p>
                  </div>
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

export default Legal;

