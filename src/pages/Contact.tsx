import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  MessageSquare
} from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-[#00167a]/5 to-[#00167a]/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[#00167a] mb-6">
                Contactez-Nous
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Nos experts RH sont à votre écoute pour répondre à vos besoins
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-6 h-6 mr-2 text-[#00167a]" />
                      Envoyez-nous un Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Prénom *</Label>
                          <Input id="firstName" placeholder="Votre prénom" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Nom *</Label>
                          <Input id="lastName" placeholder="Votre nom" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="votre@email.com" />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" placeholder="+xxx xx xx xx xx" />
                      </div>
                      
                      <div>
                        <Label htmlFor="company">Entreprise</Label>
                        <Input id="company" placeholder="Nom de votre entreprise" />
                      </div>
                      
                      <div>
                        <Label htmlFor="subject">Sujet *</Label>
                        <select 
                          id="subject" 
                          className="w-full p-3 border border-input rounded-md bg-background"
                        >
                          <option value="">Sélectionnez un sujet</option>
                          <option value="audit">Audit RH</option>
                          <option value="formation">Formation</option>
                          <option value="recrutement">Recrutement</option>
                          <option value="conseil">Conseil Stratégique</option>
                          <option value="mise-disposition">Mise à Disposition</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Décrivez votre besoin..."
                          className="min-h-[120px]"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-[#00167a] hover:bg-[#00167a]/90">
                        <Send className="w-5 h-5 mr-2" />
                        Envoyer le Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <div className="space-y-8">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-6 text-[#00167a]">Informations de Contact</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <MapPin className="w-6 h-6 text-[#00167a] mr-3 mt-1" />
                          <div>
                            <p className="font-semibold">Adresse</p>
                            <p className="text-muted-foreground">
                              Yirmadjo (BKO)<br />
                              Mali
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Phone className="w-6 h-6 text-[#00167a] mr-3 mt-1" />
                          <div>
                            <p className="font-semibold">Téléphone</p>
                            <p className="text-muted-foreground">+33 7 51 49 08 71</p>
                            <p className="text-muted-foreground">+223 76 72 24 47</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Mail className="w-6 h-6 text-[#00167a] mr-3 mt-1" />
                          <div>
                            <p className="font-semibold">Email</p>
                            <p className="text-muted-foreground">consultingnovrh@gmail.com</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Clock className="w-6 h-6 text-[#00167a] mr-3 mt-1" />
                          <div>
                            <p className="font-semibold">Horaires d'ouverture</p>
                            <p className="text-muted-foreground">Lundi - Vendredi: 8h00 - 18h00</p>
                            <p className="text-muted-foreground">Samedi: 9h00 - 13h00</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Appointment Booking */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 text-[#00167a]">Réserver un Rendez-vous</h3>
                      <p className="text-muted-foreground mb-4">
                        Planifiez une consultation gratuite avec nos experts RH
                      </p>
                      <Button className="w-full bg-[#00167a] hover:bg-[#00167a]/90">
                        Réserver un Rendez-vous
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Emergency Contact */}
                  <Card className="bg-[#00167a] text-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Contact d'Urgence</h3>
                      <p className="mb-4 opacity-90">
                        Pour les situations urgentes en dehors des heures d'ouverture
                      </p>
                      <p className="font-semibold text-lg">+33 7 51 49 08 71</p>
                      <p className="text-sm opacity-90">Disponible 24h/7j</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-[#00167a]/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#00167a]">Notre Localisation</h2>
              <div className="bg-[#00167a]/10 h-96 rounded-lg flex items-center justify-center border border-[#00167a]/20">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-[#00167a]" />
                  <p className="text-lg font-semibold text-[#00167a]">Carte Interactive</p>
                  <p className="text-muted-foreground">Intégration Google Maps à venir</p>
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

export default Contact;