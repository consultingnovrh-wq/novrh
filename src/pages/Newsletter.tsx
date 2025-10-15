import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";

const Newsletter = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    sectors: [] as string[]
  });

  const sectors = [
    "Administration et Ressources Humaines",
    "Agriculture, Elevage et Environnement", 
    "Assistance, Secrétariat",
    "Audit et Conseil",
    "Banque et Finance",
    "BTP et Architecture",
    "Commerce et Distribution",
    "Communication et Marketing",
    "Education et Formation",
    "Informatique et Télécommunications",
    "Industrie et Production",
    "Juridique",
    "Logistique et Transport",
    "Médical et Paramédical",
    "ONG et Organisations Internationales",
    "Restauration et Hôtellerie",
    "Sécurité",
    "Services aux Entreprises",
    "Sport et Loisirs",
    "Tourisme"
  ];

  const handleSectorChange = (sector: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        sectors: [...prev.sectors, sector]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sectors: prev.sectors.filter(s => s !== sector)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("L'adresse email est obligatoire");
      return;
    }
    toast.success("Inscription réussie ! Vous recevrez nos offres d'emploi par email.");
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Offres d'emploi Mali – Recevez nos offres par email
            </h1>
            <p className="text-muted-foreground">
              Restez informé des dernières opportunités d'emploi au Mali
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recevoir les Offres d'Emploi</CardTitle>
              <CardDescription>
                * Champ obligatoire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+223 76 72 24 47"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="birthDate">Date de naissance (jj/mm)</Label>
                    <Input
                      id="birthDate"
                      type="text"
                      value={formData.birthDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                      placeholder="01/01"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Secteurs d'intérêt :</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {sectors.map((sector) => (
                      <div key={sector} className="flex items-center space-x-2">
                        <Checkbox
                          id={sector}
                          checked={formData.sectors.includes(sector)}
                          onCheckedChange={(checked) => handleSectorChange(sector, checked as boolean)}
                        />
                        <Label 
                          htmlFor={sector} 
                          className="text-sm leading-tight cursor-pointer"
                        >
                          {sector}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  S'abonner aux offres d'emploi
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;