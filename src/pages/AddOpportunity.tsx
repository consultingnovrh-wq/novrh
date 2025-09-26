import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AddOpportunity = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    type: '',
    description: '',
    budget: '',
    location: '',
    deadline: '',
    requirements: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    "Partenariat Commercial",
    "Joint-venture",
    "Franchise",
    "Distribution",
    "Sous-traitance",
    "Investissement",
    "Financement",
    "Export/Import",
    "Technologie",
    "Représentation Commerciale",
    "Consulting",
    "Formation"
  ];

  const types = [
    "Recherche de partenaire",
    "Offre de partenariat",
    "Recherche d'investisseur",
    "Offre d'investissement",
    "Recherche de financement",
    "Mission commerciale",
    "Opportunité d'export",
    "Opportunité d'import"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Le titre, la catégorie et la description sont obligatoires");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("opportunities").insert([
        {
          title: formData.title,
          category: formData.category,
          type: formData.type,
          description: formData.description,
          budget: formData.budget,
          location: formData.location,
          deadline: formData.deadline,
          requirements: formData.requirements,
          contact_name: formData.contactName,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          company: formData.company,
        },
      ]);
      if (error) throw error;
      toast.success("Opportunité d'affaire proposée avec succès ! Elle sera publiée après vérification.");
      setFormData({
        title: '', category: '', type: '', description: '', budget: '', location: '', deadline: '', requirements: '', contactName: '', contactEmail: '', contactPhone: '', company: ''
      });
    } catch (err: any) {
      toast.error("Erreur lors de l'ajout de l'opportunité : " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Proposer une opportunité d'affaire
            </h1>
            <p className="text-muted-foreground">
              Partagez une opportunité d'affaire avec notre communauté d'entrepreneurs
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Quelques conseils :</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Choisissez un titre accrocheur</p>
              <p>• Décrivez clairement l'opportunité et les bénéfices attendus</p>
              <p>• Précisez le type de partenaire recherché</p>
              <p>• Indiquez les conditions et exigences</p>
              <p>• Mentionnez votre secteur d'activité</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ajouter une Opportunité d'Affaire</CardTitle>
              <CardDescription>
                * Champs obligatoires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'opportunité *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    placeholder="Ex: Recherche partenaire pour distribution produits bio"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'opportunité</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description de l'opportunité *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    placeholder="Décrivez en détail l'opportunité d'affaire, les objectifs, les bénéfices attendus..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget/Investissement (FCFA)</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="Ex: 5 000 000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Ex: Bamako, Mali"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Date limite d'intérêt</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Profil recherché et exigences</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="Décrivez le profil du partenaire recherché, les compétences requises, l'expérience souhaitée..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise/Organisation</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Nom du contact</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email de contact</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="contact@entreprise.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Téléphone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="+223 XX XX XX XX"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Envoi en cours..." : "Proposer l'opportunité d'affaire"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddOpportunity;