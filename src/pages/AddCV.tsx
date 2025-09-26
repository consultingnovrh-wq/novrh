import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Upload, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  Save
} from "lucide-react";

interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrent: boolean;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  languages: Array<{
    id: string;
    language: string;
    level: string;
  }>;
}

const AddCV = () => {
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      website: ""
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    languages: []
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadExistingCV();
  }, []);

  const loadExistingCV = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Charger les données du candidat
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (candidateData && !candidateError) {
        // Charger le CV existant depuis le stockage Supabase
        if (candidateData.cv_url) {
          const { data: cvFile } = await supabase.storage
            .from('cvs')
            .download(candidateData.cv_url);
          
          if (cvFile) {
            // Ici vous pourriez parser le fichier CV si c'est un format structuré
            // Pour l'instant, on charge juste les données de base
            setCvData(prev => ({
              ...prev,
              personalInfo: {
                firstName: candidateData.first_name || "",
                lastName: candidateData.last_name || "",
                email: user.email || "",
                phone: candidateData.phone || "",
                address: "",
                linkedin: "",
                website: ""
              },
              summary: candidateData.profile_description || ""
            }));
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du CV:', error);
    }
  };

  const handlePersonalInfoChange = (field: keyof CVData['personalInfo'], value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false
    };
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !cvData.skills.includes(newSkill.trim())) {
      setCvData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addLanguage = () => {
    const newLanguage = {
      id: Date.now().toString(),
      language: "",
      level: ""
    };
    setCvData(prev => ({
      ...prev,
      languages: [...prev.languages, newLanguage]
    }));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.map(lang => 
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (id: string) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  const saveCV = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Mettre à jour les informations du candidat
      const { error: candidateError } = await supabase
        .from('candidates')
        .upsert({
          user_id: user.id,
          first_name: cvData.personalInfo.firstName,
          last_name: cvData.personalInfo.lastName,
          phone: cvData.personalInfo.phone,
          profile_description: cvData.summary
        });

      if (candidateError) {
        throw candidateError;
      }

      // Créer un fichier CV structuré (JSON pour l'instant)
      const cvContent = JSON.stringify(cvData, null, 2);
      const fileName = `cv_${user.id}_${Date.now()}.json`;
      
      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, new Blob([cvContent], { type: 'application/json' }));

      if (uploadError) {
        throw uploadError;
      }

      // Mettre à jour l'URL du CV dans la base de données
      const { error: updateError } = await supabase
        .from('candidates')
        .update({ cv_url: fileName })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "CV sauvegardé !",
        description: "Votre CV a été sauvegardé avec succès.",
      });

      setEditing(false);
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la sauvegarde du CV",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportCV = () => {
    const cvContent = JSON.stringify(cvData, null, 2);
    const blob = new Blob([cvContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {editing ? "Modifier mon CV" : "Mon CV"}
              </h1>
              <p className="text-gray-600">
                {editing 
                  ? "Modifiez votre CV pour le rendre plus attractif" 
                  : "Gérez votre CV et vos informations professionnelles"
                }
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? "Annuler" : "Modifier"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={cvData.personalInfo.firstName}
                      onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                      disabled={!editing}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={cvData.personalInfo.lastName}
                      onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                      disabled={!editing}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={cvData.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      disabled={!editing}
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={cvData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      disabled={!editing}
                      placeholder="+223 XX XX XX XX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={cvData.personalInfo.address}
                      onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                      disabled={!editing}
                      placeholder="Votre adresse complète"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Résumé professionnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={cvData.summary}
                  onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
                  disabled={!editing}
                  placeholder="Décrivez votre profil professionnel en quelques lignes..."
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Expérience professionnelle
                </CardTitle>
                {editing && (
                  <Button onClick={addExperience} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {cvData.experience.map((exp, index) => (
                  <div key={exp.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Expérience {index + 1}</h4>
                      {editing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(exp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Entreprise</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          disabled={!editing}
                          placeholder="Nom de l'entreprise"
                        />
                      </div>
                      <div>
                        <Label>Poste</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          disabled={!editing}
                          placeholder="Votre poste"
                        />
                      </div>
                      <div>
                        <Label>Date de début</Label>
                        <Input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div>
                        <Label>Date de fin</Label>
                        <Input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        disabled={!editing}
                        placeholder="Décrivez vos responsabilités et réalisations..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                {cvData.experience.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Aucune expérience ajoutée
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Formation
                </CardTitle>
                {editing && (
                  <Button onClick={addEducation} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {cvData.education.map((edu, index) => (
                  <div key={edu.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Formation {index + 1}</h4>
                      {editing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(edu.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Établissement</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          disabled={!editing}
                          placeholder="Nom de l'établissement"
                        />
                      </div>
                      <div>
                        <Label>Diplôme</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          disabled={!editing}
                          placeholder="Ex: Master, Licence, etc."
                        />
                      </div>
                      <div>
                        <Label>Domaine</Label>
                        <Input
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          disabled={!editing}
                          placeholder="Ex: Informatique, Marketing, etc."
                        />
                      </div>
                      <div>
                        <Label>Date de début</Label>
                        <Input
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div>
                        <Label>Date de fin</Label>
                        <Input
                          type="date"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={edu.description}
                        onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                        disabled={!editing}
                        placeholder="Décrivez votre formation..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                {cvData.education.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Aucune formation ajoutée
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Compétences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Ajouter une compétence"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {skill}
                      {editing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {cvData.skills.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Aucune compétence ajoutée
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Langues</CardTitle>
                {editing && (
                  <Button onClick={addLanguage} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {cvData.languages.map((lang, index) => (
                  <div key={lang.id} className="flex items-center gap-3">
                    <Input
                      value={lang.language}
                      onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                      disabled={!editing}
                      placeholder="Langue"
                      className="flex-1"
                    />
                    <select
                      value={lang.level}
                      onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                      disabled={!editing}
                      className="border rounded px-3 py-2"
                    >
                      <option value="">Niveau</option>
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                      <option value="Natif">Natif</option>
                    </select>
                    {editing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLanguage(lang.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {cvData.languages.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Aucune langue ajoutée
                  </p>
                )}
              </CardContent>
            </Card>

            {editing && (
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Annuler
                </Button>
                <Button onClick={saveCV} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            )}

            {!editing && (
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={exportCV}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <Button onClick={() => setEditing(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddCV;