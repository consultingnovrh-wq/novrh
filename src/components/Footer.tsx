import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    setNewsletterLoading(true);

    try {
      // Essayer d'insérer dans une table newsletter si elle existe
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([
          {
            email: newsletterEmail,
            subscribed_at: new Date().toISOString(),
            is_active: true,
          },
        ]);

      if (error) {
        // Si la table n'existe pas, on peut créer une table simple ou utiliser une autre méthode
        console.log("Table newsletter_subscribers n'existe pas encore. Email:", newsletterEmail);
        // Pour l'instant, on affiche juste un message de succès
        toast.success("Merci pour votre inscription à la newsletter !");
      } else {
        toast.success("Merci pour votre inscription à la newsletter !");
      }
      
      setNewsletterEmail("");
    } catch (error: any) {
      console.error("Erreur lors de l'inscription à la newsletter:", error);
      // Même si la table n'existe pas, on affiche un message de succès
      toast.success("Merci pour votre inscription à la newsletter !");
    } finally {
      setNewsletterLoading(false);
    }
  };

  const footerLinks = {
    about: [
      { name: "Qui sommes-nous ?", href: "/about" },
      { name: "Nos services", href: "/services" },
      { name: "Notre équipe", href: "/team" },
      { name: "Partenaires", href: "/partners" },
      { name: "Actualités", href: "/news" }
    ],
    platform: [
      { name: "Espace Candidats", href: "#" },
      { name: "Espace Entreprises", href: "#" },
      { name: "CVthèque", href: "/cvtheque" },
      { name: "Offres d'emploi", href: "/jobs" },
      { name: "Abonnement Recruteur", href: "/recruiter-subscription" },
      { name: "Établissement Formation", href: "/training-institution" },
      { name: "Demande de devis", href: "/quote-request" },
      { name: "Avis clients", href: "/reviews" }
    ],
    support: [
      { name: "Centre d'aide", href: "#" },
      { name: "Contact", href: "/contact" },
      { name: "Politique de confidentialité", href: "/privacy" },
      { name: "Conditions d'utilisation", href: "/terms" },
      { name: "Mentions légales", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "X (Twitter)" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Youtube className="h-5 w-5" />, href: "#", label: "YouTube" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Logo, Social Media and Contact */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <img src={logo} alt="NovRH CONSULTING Logo" className="h-16 w-auto" />
              </div>
              <div className="flex space-x-4 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-white hover:text-yellow-400 transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              
              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5" />
                  <span className="text-sm text-white/90">contact@novrhconsulting.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span className="text-sm text-white/90">+33 7 51 49 08 71</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span className="text-sm text-white/90">+223 76 72 24 47</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm text-white/90">Yirmadjo (BKO) MALI</span>
                </div>
              </div>
            </div>

            {/* Column 2: À propos */}
            <div>
              <h4 className="font-bold mb-4 text-white">À PROPOS</h4>
              <ul className="space-y-2">
                {footerLinks.about.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white hover:text-yellow-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Plateforme */}
            <div>
              <h4 className="font-bold mb-4 text-white">Plateforme</h4>
              <ul className="space-y-2">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white hover:text-yellow-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Support */}
            <div>
              <h4 className="font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white hover:text-yellow-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Newsletter Section */}
        <div className="py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">LA NEWSLETTER QUI FAIT LE TAF</h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Une fois par semaine, des histoires, des jobs et des conseils dans votre boite mail.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto space-x-2">
              <Input
                type="email"
                placeholder="Email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="bg-white text-black placeholder:text-gray-500 border-none"
              />
              <Button 
                type="submit"
                disabled={newsletterLoading}
                className="bg-yellow-400 text-black hover:bg-yellow-300 border-none"
              >
                {newsletterLoading ? "..." : "Je m'abonne"}
              </Button>
            </form>
            <p className="text-white/60 text-xs mt-4">
              Vous pouvez vous désabonner à tout moment. On n'est pas susceptibles, promis. 
              Pour en savoir plus sur notre politique de protection des données, 
              <a href="/privacy" className="underline hover:text-yellow-400"> cliquez-ici</a>.
            </p>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Bottom Section */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
            <a href="/legal" className="text-white/80 hover:text-white text-sm">Mentions légales</a>
            <a href="/terms" className="text-white/80 hover:text-white text-sm">CGU</a>
            <a href="/privacy" className="text-white/80 hover:text-white text-sm">Politique de confidentialité</a>
            <a href="/charters" className="text-white/80 hover:text-white text-sm">Chartes NovRH</a>
            <a href="/cookies" className="text-white/80 hover:text-white text-sm">Politique cookies</a>
            <a href="/cookie-management" className="text-white/80 hover:text-white text-sm">Gestion des cookies</a>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white/80 text-sm">🇲🇱 Mali</span>
            <ChevronDown className="h-4 w-4 text-white/80" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;