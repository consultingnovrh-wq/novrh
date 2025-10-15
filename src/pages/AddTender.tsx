import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AddTender = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    type: '',
    organization: '',
    description: '',
    budget: '',
    deadline: '',
    location: '',
    contactEmail: '',
    contactPhone: '',
    requirements: ''
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    "Appel à Propositions",
    "Avis d'Appel d'Offres - Fournitures",
    "Avis d'Appel d'Offres - Services", 
    "Avis d'Appel d'Offres - Travaux",
    "Avis d'Appel d'Offres International",
    "Avis d'Attribution de Marché",
    "Avis de Concours",
    "Avis de Manifestation d'Intérêt",
    "Constitution de Liste de Fournisseurs",
    "Demande de Cotation",
    "Demande de Prix"
  ];

  const types = [
    "Ouvert",
    "Restreint", 
    "Sur invitation",
    "Négocié"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.organization) {
      toast.error("Le titre, la catégorie et l'organisation sont obligatoires");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("tenders").insert([
        {
          title: formData.title,
          category: formData.category,
          type: formData.type,
          organization: formData.organization,
          description: formData.description,
          budget: formData.budget,
          deadline: formData.deadline,
          location: formData.location,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          requirements: formData.requirements,
        },
      ]);
      if (error) throw error;
      toast.success("Appel d'offre ajouté avec succès ! Il sera publié après vérification.");
      setFormData({
        title: '', category: '', type: '', organization: '', description: '', budget: '', deadline: '', location: '', contactEmail: '', contactPhone: '', requirements: ''
      });
    } catch (err: any) {
      toast.error("Erreur lors de l'ajout de l'appel d'offre : " + (err.message || err));
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
              Ajouter un appel d'offre
            </h1>
            <p className="text-muted-foreground">
              Publiez votre appel d'offres pour toucher un large public
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Détails de l'appel d'offre</CardTitle>
              <CardDescription>
                * Champs obligatoires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'appel d'offre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    placeholder="Ex: Fourniture d'équipements informatiques"
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
                    <Label htmlFor="type">Type de procédure</Label>
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
                  <Label htmlFor="organization">Organisation/Entreprise *</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    required
                    placeholder="Nom de l'organisation émettrice"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description détaillée</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez en détail l'objet de l'appel d'offres..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget estimé (FCFA)</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="Ex: 10 000 000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Date limite de soumission</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Lieu d'exécution</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Ex: Bamako, Mali"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email de contact</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="contact@organisation.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Téléphone de contact</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="+223 76 72 24 47"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Conditions et exigences</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="Spécifiez les conditions de participation, documents requis, critères d'évaluation..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Envoi en cours..." : "Publier l'appel d'offre"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddTender;