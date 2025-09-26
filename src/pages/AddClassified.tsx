import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AddClassified = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    price: '',
    condition: '',
    location: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    images: [] as File[]
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    { 
      name: "Véhicules", 
      subcategories: ["Voitures", "Motos", "Camions", "Pièces détachées", "Autres véhicules"]
    },
    { 
      name: "Immobilier", 
      subcategories: ["Vente maisons", "Location maisons", "Terrains", "Commerces", "Bureaux"]
    },
    { 
      name: "Électronique", 
      subcategories: ["Téléphones", "Ordinateurs", "TV/Audio", "Électroménager", "Accessoires"]
    },
    { 
      name: "Mobilier", 
      subcategories: ["Salon", "Chambre", "Cuisine", "Bureau", "Décoration"]
    },
    { 
      name: "Mode", 
      subcategories: ["Vêtements homme", "Vêtements femme", "Chaussures", "Accessoires", "Bijoux"]
    },
    { 
      name: "Emploi", 
      subcategories: ["Offres d'emploi", "Recherche emploi", "Services", "Formations"]
    },
    { 
      name: "Services", 
      subcategories: ["Réparation", "Nettoyage", "Transport", "Événements", "Autres services"]
    },
    { 
      name: "Loisirs", 
      subcategories: ["Sports", "Livres", "Musique", "Jeux", "Événements"]
    }
  ];

  const conditions = ["Neuf", "Très bon état", "Bon état", "État moyen", "À réparer"];

  const selectedCategory = categories.find(cat => cat.name === formData.category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Le titre, la catégorie et la description sont obligatoires");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("classifieds").insert([
        {
          title: formData.title,
          category: formData.category,
          subcategory: formData.subcategory,
          description: formData.description,
          price: formData.price,
          condition: formData.condition,
          location: formData.location,
          contact_name: formData.contactName,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          // images: à gérer séparément si tu veux l'upload
        },
      ]);
      if (error) throw error;
      toast.success("Petite annonce ajoutée avec succès ! Elle sera publiée après modération.");
      setFormData({
        title: '', category: '', subcategory: '', description: '', price: '', condition: '', location: '', contactName: '', contactEmail: '', contactPhone: '', images: []
      });
    } catch (err: any) {
      toast.error("Erreur lors de l'ajout de l'annonce : " + (err.message || err));
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
              Ajouter une Petite Annonce
            </h1>
            <p className="text-muted-foreground">
              Vendez, achetez ou échangez facilement avec notre communauté
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Détails de votre annonce</CardTitle>
              <CardDescription>
                * Champs obligatoires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'annonce *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    placeholder="Ex: iPhone 12 Pro en excellent état"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, subcategory: '' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedCategory && (
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Sous-catégorie</Label>
                      <Select 
                        value={formData.subcategory} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory.subcategories.map((subcategory) => (
                            <SelectItem key={subcategory} value={subcategory}>
                              {subcategory}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    placeholder="Décrivez votre article en détail : état, caractéristiques, raison de la vente..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (FCFA)</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Ex: 150000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">État</Label>
                    <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez l'état" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Ex: Bamako"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Informations de contact</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Nom</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                        placeholder="votre@email.com"
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Photos (optionnel)</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setFormData(prev => ({ ...prev, images: files }));
                    }}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-muted-foreground">
                    Vous pouvez ajouter jusqu'à 5 photos pour votre annonce
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Envoi en cours..." : "Publier l'annonce"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddClassified;