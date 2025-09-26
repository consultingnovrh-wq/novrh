import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar,
  FileText,
  Save,
  Plus,
  Trash2
} from "lucide-react";

interface JobData {
  title: string;
  description: string;
  requirements: string;
  salaryMin: string;
  salaryMax: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  educationLevel: string;
  benefits: string[];
  contactEmail: string;
  contactPhone: string;
  deadline: string;
}

const PostJob = () => {
  const [jobData, setJobData] = useState<JobData>({
    title: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    educationLevel: "",
    benefits: [],
    contactEmail: "",
    contactPhone: "",
    deadline: ""
  });
  const [loading, setLoading] = useState(false);
  const [newBenefit, setNewBenefit] = useState("");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUserAccess();
  }, []);

  const checkUserAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      setUser(user);

      // Vérifier si l'utilisateur a accès au service de publication d'offres
      const { data: hasAccess } = await supabase.rpc('check_service_access', {
        service_name: 'Poster une offre',
        user_id: user.id
      });

      if (!hasAccess) {
        toast({
          title: "Accès refusé",
          description: "Vous devez avoir un abonnement actif pour poster des offres d'emploi.",
          variant: "destructive"
        });
        navigate('/pricing');
        return;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification d\'accès:', error);
      navigate('/login');
    }
  };

  const handleInputChange = (field: keyof JobData, value: string) => {
    setJobData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !jobData.benefits.includes(newBenefit.trim())) {
      setJobData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (benefit: string) => {
    setJobData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(b => b !== benefit)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Validation des données
      if (!jobData.title || !jobData.description || !jobData.location) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Créer l'offre d'emploi
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
          employer_id: user.id,
          title: jobData.title,
          description: jobData.description,
          requirements: jobData.requirements,
          salary_min: jobData.salaryMin ? parseFloat(jobData.salaryMin) : null,
          salary_max: jobData.salaryMax ? parseFloat(jobData.salaryMax) : null,
          location: jobData.location,
          job_type: jobData.jobType,
          is_active: true
        })
        .select()
        .single();

      if (jobError) {
        throw jobError;
      }

      toast({
        title: "Offre publiée !",
        description: "Votre offre d'emploi a été publiée avec succès.",
      });

      // Rediriger vers le tableau de bord employeur
      navigate('/employer-dashboard');
    } catch (error: any) {
      console.error('Erreur lors de la publication:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la publication de l'offre",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Publier une offre d'emploi
              </h1>
              <p className="text-gray-600">
                Créez une offre d'emploi attractive pour attirer les meilleurs candidats
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre du poste *</Label>
                    <Input
                      id="title"
                      value={jobData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Développeur Full Stack React"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Localisation *</Label>
                      <Input
                        id="location"
                        value={jobData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Ex: Bamako, Mali"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobType">Type de contrat</Label>
                      <Select value={jobData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Temps plein</SelectItem>
                          <SelectItem value="part-time">Temps partiel</SelectItem>
                          <SelectItem value="contract">Contrat</SelectItem>
                          <SelectItem value="internship">Stage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experienceLevel">Niveau d'expérience</Label>
                      <Select value={jobData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Débutant (0-2 ans)</SelectItem>
                          <SelectItem value="mid">Intermédiaire (3-5 ans)</SelectItem>
                          <SelectItem value="senior">Senior (5+ ans)</SelectItem>
                          <SelectItem value="expert">Expert (8+ ans)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="educationLevel">Niveau d'éducation</Label>
                      <Select value={jobData.educationLevel} onValueChange={(value) => handleInputChange('educationLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bac">Bac</SelectItem>
                          <SelectItem value="bac+2">Bac+2</SelectItem>
                          <SelectItem value="bac+3">Bac+3</SelectItem>
                          <SelectItem value="bac+4">Bac+4</SelectItem>
                          <SelectItem value="bac+5">Bac+5</SelectItem>
                          <SelectItem value="doctorat">Doctorat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Description et exigences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description du poste *</Label>
                    <Textarea
                      id="description"
                      value={jobData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Décrivez le poste, les responsabilités principales, l'environnement de travail..."
                      rows={6}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Exigences et compétences</Label>
                    <Textarea
                      id="requirements"
                      value={jobData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      placeholder="Listez les compétences techniques, soft skills, certifications requises..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Rémunération et avantages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salaryMin">Salaire minimum (FCFA)</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={jobData.salaryMin}
                        onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                        placeholder="Ex: 150000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salaryMax">Salaire maximum (FCFA)</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        value={jobData.salaryMax}
                        onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                        placeholder="Ex: 250000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Avantages et bénéfices</Label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        placeholder="Ajouter un avantage"
                        onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
                      />
                      <Button type="button" onClick={addBenefit} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {jobData.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
                        >
                          {benefit}
                          <button
                            type="button"
                            onClick={() => removeBenefit(benefit)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informations de contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactEmail">Email de contact</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={jobData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="contact@entreprise.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone">Téléphone de contact</Label>
                      <Input
                        id="contactPhone"
                        value={jobData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        placeholder="+223 XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deadline">Date limite de candidature</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={jobData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/employer-dashboard')}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Publication..." : "Publier l'offre"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostJob;