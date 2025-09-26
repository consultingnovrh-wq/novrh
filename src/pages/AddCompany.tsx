import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AddCompany = () => {
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    contactPerson: '',
    employeeCount: ''
  });
  const [loading, setLoading] = useState(false);

  const sectors = [
    "Agriculture, Élevage et Environnement",
    "Banque et Finance", 
    "BTP et Architecture",
    "Commerce et Distribution",
    "Communication et Marketing",
    "Conseil et Audit",
    "Education et Formation",
    "Energie et Mines",
    "Industrie et Production",
    "Informatique et Télécommunications",
    "Logistique et Transport",
    "ONG et Organisations Internationales",
    "Restauration et Hôtellerie",
    "Santé et Médical",
    "Services aux Entreprises",
    "Tourisme et Loisirs"
  ];

  const employeeCounts = [
    "1-10 employés",
    "11-50 employés", 
    "51-200 employés",
    "201-500 employés",
    "Plus de 500 employés"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sector) {
      toast.error("Le nom de l'entreprise et le secteur sont obligatoires");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("companies").insert([
        {
          company_name: formData.name,
          company_address: formData.address,
          user_id: "anonymous", // Remplacer par l'ID utilisateur réel si connecté
          // Ajoute d'autres champs si la table est adaptée
          // email, phone, website, description, etc.
        },
      ]);
      if (error) throw error;
      toast.success("Entreprise proposée avec succès ! Elle sera examinée avant publication.");
      setFormData({
        name: '', sector: '', description: '', address: '', phone: '', email: '', website: '', contactPerson: '', employeeCount: ''
      });
    } catch (err: any) {
      toast.error("Erreur lors de l'ajout de l'entreprise : " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Proposer une entreprise
              </h1>
              <p className="text-muted-foreground">
                Ajoutez votre entreprise à notre annuaire professionnel
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informations de l'entreprise</CardTitle>
                <CardDescription>
                  * Champs obligatoires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de l'entreprise *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Nom de votre entreprise"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector">Secteur d'activité *</Label>
                    <Select value={formData.sector} onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description de l'entreprise</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez les activités principales de votre entreprise..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+223 XX XX XX XX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="contact@entreprise.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://www.votre-site.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Adresse complète de l'entreprise"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Personne de contact</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                        placeholder="Nom du responsable"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeCount">Nombre d'employés</Label>
                      <Select value={formData.employeeCount} onValueChange={(value) => setFormData(prev => ({ ...prev, employeeCount: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          {employeeCounts.map((count) => (
                            <SelectItem key={count} value={count}>
                              {count}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Envoi en cours..." : "Proposer l'entreprise"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddCompany;