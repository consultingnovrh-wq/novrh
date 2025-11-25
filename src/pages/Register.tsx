import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { emailService } from "@/services/emailService";
import { 
  User, 
  Building2, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  Phone,
  FileText,
  MapPin,
  Hash,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [candidateData, setCandidateData] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    profile: string;
    password: string;
  }>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    profile: "",
    password: ""
  });

  const [companyData, setCompanyData] = useState<{
    companyName: string;
    companyAddress: string;
    email: string;
    password: string;
    nifMatricule: string;
  }>({
    companyName: "",
    companyAddress: "",
    email: "",
    password: "",
    nifMatricule: ""
  });

  // Validation des données candidat
  const validateCandidateData = () => {
    if (!candidateData.firstName.trim()) {
      toast({
        title: "Champ manquant",
        description: "Le prénom est obligatoire.",
        variant: "destructive",
      });
      return false;
    }
    if (!candidateData.lastName.trim()) {
      toast({
        title: "Champ manquant",
        description: "Le nom est obligatoire.",
        variant: "destructive",
      });
      return false;
    }
    if (!candidateData.phone.trim()) {
      toast({
        title: "Champ manquant",
        description: "Le téléphone est obligatoire.",
        variant: "destructive",
      });
      return false;
    }
    if (!candidateData.email.trim()) {
      toast({
        title: "Champ manquant",
        description: "L'email est obligatoire.",
        variant: "destructive",
      });
      return false;
    }
    if (!candidateData.password.trim()) {
      toast({
        title: "Champ manquant",
        description: "Le mot de passe est obligatoire.",
        variant: "destructive",
      });
      return false;
    }
    if (candidateData.password.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Validation des données entreprise
  const validateCompanyData = () => {
    if (!companyData.companyName.trim()) {
      toast({
        title: "Champ manquant",
        description: "Le nom de l'entreprise est obligatoire.",
        variant: "destructive",
      });
      return false;
    }
    if (!companyData.companyAddress.trim()) {
      toast({
        title: "Champ manquant",
        description: "L'adresse de l'entreprise est obligatoire.",
        variant: "destructive",
      });
      return false;
    }
    if (!companyData.email.trim()) {
      toast({
        title: "Champ manquant",
        description: "L'email est obligatoire.",
        variant: "destructive",
      });
      return false;
    }
    if (!companyData.password.trim()) {
      toast({
        title: "Champ manquant",
        description: "Le mot de passe est obligatoire.",
        variant: "destructive",
      });
      return false;
    }
    if (companyData.password.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleCandidateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCandidateData()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: candidateData.email,
        password: candidateData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: candidateData.firstName,
            last_name: candidateData.lastName,
            phone: candidateData.phone,
            user_type: 'candidate'
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Créer le profil utilisateur directement (sans attendre le trigger)
        console.log('✅ Utilisateur créé, création du profil...');
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            user_id: authData.user.id,
            email: candidateData.email,
            first_name: candidateData.firstName,
            last_name: candidateData.lastName,
            user_type: 'candidate',
            phone: candidateData.phone,
            is_active: true,
            email_verified: false
          }]);

        if (profileError) {
          // Si l'erreur indique que le profil existe déjà (créé par le trigger), c'est OK
          if (profileError.message?.includes('duplicate key') || 
              profileError.code === '23505') {
            console.log('✅ Profil déjà créé par le trigger');
          } else {
            console.error('Erreur création profil:', profileError);
            throw new Error(`Erreur lors de la création du profil: ${profileError.message}`);
          }
        } else {
          console.log('✅ Profil créé avec succès');
        }

        // Créer le profil candidat
        try {
          const { error: candidateError } = await supabase
            .from('candidates')
            .insert([{
              user_id: authData.user.id,
              first_name: candidateData.firstName,
              last_name: candidateData.lastName,
              phone: candidateData.phone,
              profile_description: candidateData.profile || null
            }]);

          if (candidateError) {
            console.error('Erreur profil candidat:', candidateError);
            // Si l'erreur est liée à RLS, on continue quand même car le compte est créé
            // Mais on affiche un avertissement
            if (candidateError.message?.includes('row-level security') || 
                candidateError.message?.includes('permission denied') ||
                candidateError.code === '42501') {
              console.warn('⚠️ Le profil candidat n\'a pas pu être créé à cause des permissions, mais le compte est actif.');
            } else if (candidateError.message?.includes('foreign key') ||
                       candidateError.message?.includes('violates foreign key constraint')) {
              // Erreur de clé étrangère - le profil n'existe toujours pas
              throw new Error('Le profil utilisateur n\'a pas pu être créé. Veuillez réessayer ou contacter le support.');
            } else {
              // Pour les autres erreurs, on les propage
              throw new Error(`Erreur lors de la création du profil candidat: ${candidateError.message}`);
            }
          } else {
            console.log('✅ Profil candidat créé avec succès');
          }
        } catch (candidateError: any) {
          console.error('Erreur lors de la création du profil candidat:', candidateError);
          // Si c'est une erreur RLS, on continue quand même
          if (!candidateError.message?.includes('row-level security') && 
              !candidateError.message?.includes('permission denied') &&
              candidateError.code !== '42501' &&
              !candidateError.message?.includes('foreign key')) {
            throw candidateError;
          }
        }

        // Envoyer l'email de bienvenue (désactivé temporairement pour éviter CORS)
        try {
          console.log('📧 Email de bienvenue désactivé temporairement (problème CORS)');
          // await emailService.sendWelcomeEmail({
          //   firstName: candidateData.firstName,
          //   lastName: candidateData.lastName,
          //   userType: 'candidate',
          //   email: candidateData.email
          // });
        } catch (emailError) {
          console.error('Erreur envoi email:', emailError);
          // Continuer même si l'email échoue
        }

        // Déconnecter l'utilisateur après l'inscription
        await supabase.auth.signOut();
        
        setSuccess(true);
        toast({
          title: "Inscription réussie ! 🎉",
          description: "Votre compte candidat a été créé avec succès. Veuillez vérifier votre email et vous connecter.",
        });

        // Rediriger vers la page de login après 2 secondes
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription candidat:', error);
      
      let errorMessage = "Une erreur s'est produite lors de l'inscription.";
      
      // Messages d'erreur plus spécifiques
      if (error.message) {
        if (error.message.includes('already registered') || 
            error.message.includes('already exists') ||
            error.message.includes('User already registered')) {
          errorMessage = "Cet email est déjà associé à un compte. Essayez de vous connecter.";
        } else if (error.message.includes('Invalid email') || 
                   error.message.includes('invalid email')) {
          errorMessage = "Format d'email invalide. Veuillez vérifier votre adresse email.";
        } else if (error.message.includes('Password should be at least') ||
                   error.message.includes('Password is too short')) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
        } else if (error.message.includes('Unable to validate email')) {
          errorMessage = "Impossible de valider l'email. Vérifiez le format de votre adresse.";
        } else if (error.message.includes('row-level security') ||
                   error.message.includes('permission denied') ||
                   error.message.includes('RLS policy') ||
                   error.code === '42501') {
          errorMessage = "Erreur de permissions. Veuillez contacter le support technique.";
        } else if (error.message.includes('foreign key') ||
                   error.message.includes('violates foreign key constraint') ||
                   error.code === '23503') {
          errorMessage = "Erreur lors de la création du profil. Le compte a été créé mais le profil n'a pas pu être initialisé. Veuillez vous connecter et compléter votre profil.";
        } else if (error.message.includes('network') ||
                   error.message.includes('fetch')) {
          errorMessage = "Erreur de connexion. Vérifiez votre connexion internet et réessayez.";
        } else {
          // Afficher le message d'erreur original si disponible
          errorMessage = error.message || errorMessage;
        }
      } else if (error.error_description) {
        errorMessage = error.error_description;
      }

      toast({
        title: "Erreur lors de l'inscription",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCompanyData()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: companyData.email,
        password: companyData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: companyData.companyName,
            last_name: 'Entreprise',
            user_type: 'company'
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Créer le profil utilisateur directement (sans attendre le trigger)
        console.log('✅ Utilisateur créé, création du profil...');
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            user_id: authData.user.id,
            email: companyData.email,
            first_name: companyData.companyName,
            last_name: 'Entreprise',
            user_type: 'company',
            is_active: true,
            email_verified: false
          }]);

        if (profileError) {
          // Si l'erreur indique que le profil existe déjà (créé par le trigger), c'est OK
          if (profileError.message?.includes('duplicate key') || 
              profileError.code === '23505') {
            console.log('✅ Profil déjà créé par le trigger');
          } else {
            console.error('Erreur création profil:', profileError);
            throw new Error(`Erreur lors de la création du profil: ${profileError.message}`);
          }
        } else {
          console.log('✅ Profil créé avec succès');
        }

        // Créer le profil entreprise
        try {
          const { error: companyError } = await supabase
            .from('companies')
            .insert([{
              user_id: authData.user.id,
              company_name: companyData.companyName,
              company_address: companyData.companyAddress,
              nif_matricule: companyData.nifMatricule || null
            }]);

          if (companyError) {
            console.error('Erreur profil entreprise:', companyError);
            // Si l'erreur est liée à RLS, on continue quand même
            if (companyError.message?.includes('row-level security') || 
                companyError.message?.includes('permission denied') ||
                companyError.code === '42501') {
              console.warn('⚠️ Le profil entreprise n\'a pas pu être créé à cause des permissions, mais le compte est actif.');
            } else if (companyError.message?.includes('foreign key') ||
                       companyError.message?.includes('violates foreign key constraint')) {
              // Erreur de clé étrangère - le profil n'existe toujours pas
              throw new Error('Le profil utilisateur n\'a pas pu être créé. Veuillez réessayer ou contacter le support.');
            } else {
              throw new Error(`Erreur lors de la création du profil entreprise: ${companyError.message}`);
            }
          } else {
            console.log('✅ Profil entreprise créé avec succès');
          }
        } catch (companyError: any) {
          console.error('Erreur lors de la création du profil entreprise:', companyError);
          // Si c'est une erreur RLS, on continue quand même
          if (!companyError.message?.includes('row-level security') && 
              !companyError.message?.includes('permission denied') &&
              companyError.code !== '42501' &&
              !companyError.message?.includes('foreign key')) {
            throw companyError;
          }
        }

        // Envoyer l'email de bienvenue (désactivé temporairement pour éviter CORS)
        try {
          console.log('📧 Email de bienvenue désactivé temporairement (problème CORS)');
          // await emailService.sendWelcomeEmail({
          //   firstName: companyData.companyName,
          //   lastName: 'Entreprise',
          //   userType: 'company',
          //   email: companyData.email
          // });
        } catch (emailError) {
          console.error('Erreur envoi email:', emailError);
          // Continuer même si l'email échoue
        }

        // Déconnecter l'utilisateur après l'inscription
        await supabase.auth.signOut();
        
        setSuccess(true);
        toast({
          title: "Inscription réussie ! 🎉",
          description: "Votre compte entreprise a été créé avec succès. Veuillez vérifier votre email et vous connecter.",
        });

        // Rediriger vers la page de login après 2 secondes
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription entreprise:', error);
      
      let errorMessage = "Une erreur s'est produite lors de l'inscription.";
      
      // Messages d'erreur plus spécifiques
      if (error.message) {
        if (error.message.includes('already registered') || 
            error.message.includes('already exists') ||
            error.message.includes('User already registered')) {
          errorMessage = "Cet email est déjà associé à un compte. Essayez de vous connecter.";
        } else if (error.message.includes('Invalid email') || 
                   error.message.includes('invalid email')) {
          errorMessage = "Format d'email invalide. Veuillez vérifier votre adresse email.";
        } else if (error.message.includes('Password should be at least') ||
                   error.message.includes('Password is too short')) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
        } else if (error.message.includes('Unable to validate email')) {
          errorMessage = "Impossible de valider l'email. Vérifiez le format de votre adresse.";
        } else if (error.message.includes('row-level security') ||
                   error.message.includes('permission denied') ||
                   error.message.includes('RLS policy') ||
                   error.code === '42501') {
          errorMessage = "Erreur de permissions. Veuillez contacter le support technique.";
        } else if (error.message.includes('foreign key') ||
                   error.message.includes('violates foreign key constraint') ||
                   error.code === '23503') {
          errorMessage = "Erreur lors de la création du profil. Le compte a été créé mais le profil n'a pas pu être initialisé. Veuillez vous connecter et compléter votre profil.";
        } else if (error.message.includes('network') ||
                   error.message.includes('fetch')) {
          errorMessage = "Erreur de connexion. Vérifiez votre connexion internet et réessayez.";
        } else {
          // Afficher le message d'erreur original si disponible
          errorMessage = error.message || errorMessage;
        }
      } else if (error.error_description) {
        errorMessage = error.error_description;
      }

      toast({
        title: "Erreur lors de l'inscription",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser le formulaire après changement d'onglet
  useEffect(() => {
    setSuccess(false);
    setLoading(false);
  }, [activeTab]);

  if (success) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-16">
          <section className="py-20 min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-md mx-auto text-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Inscription réussie ! 🎉
                  </h1>
                  <p className="text-gray-600 mb-6">
                    Votre compte a été créé avec succès. Veuillez vérifier votre email pour confirmer votre compte avant de vous connecter.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => navigate("/login")}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Aller à la page de connexion
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSuccess(false);
                        setActiveTab(activeTab);
                      }}
                      className="w-full"
                    >
                      Créer un autre compte
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        <section className="py-20 min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">Inscription</h1>
                <p className="text-muted-foreground">Créez votre compte pour accéder à nos services</p>
              </div>

              <Card>
                <CardHeader>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="candidate" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Candidat
                      </TabsTrigger>
                      <TabsTrigger value="company" className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        Entreprise
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>

                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    {/* Candidate Registration */}
                    <TabsContent value="candidate">
                      <form onSubmit={handleCandidateRegister} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">Prénom *</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                id="firstName"
                                type="text"
                                placeholder="Votre prénom"
                                className="pl-10"
                                value={candidateData.firstName}
                                onChange={(e) => setCandidateData({...candidateData, firstName: e.target.value})}
                                required
                                disabled={loading}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="lastName">Nom *</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                id="lastName"
                                type="text"
                                placeholder="Votre nom"
                                className="pl-10"
                                value={candidateData.lastName}
                                onChange={(e) => setCandidateData({...candidateData, lastName: e.target.value})}
                                required
                                disabled={loading}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="phone">Téléphone *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="phone"
                              type="tel"
                              placeholder="+xxx xx xx xx xx"
                              className="pl-10"
                              value={candidateData.phone}
                              onChange={(e) => setCandidateData({...candidateData, phone: e.target.value})}
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="candidate-email">Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="candidate-email"
                              type="email"
                              placeholder="votre@email.com"
                              className="pl-10"
                              value={candidateData.email}
                              onChange={(e) => setCandidateData({...candidateData, email: e.target.value})}
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="profile">Profil (optionnel)</Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea 
                              id="profile"
                              placeholder="Décrivez votre profil professionnel..."
                              className="pl-10 min-h-[80px]"
                              value={candidateData.profile}
                              onChange={(e) => setCandidateData({...candidateData, profile: e.target.value})}
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="candidate-password">Mot de passe *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="candidate-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Votre mot de passe"
                              className="pl-10 pr-10"
                              value={candidateData.password}
                              onChange={(e) => setCandidateData({...candidateData, password: e.target.value})}
                              required
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                              disabled={loading}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Le mot de passe doit contenir au moins 6 caractères
                          </p>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Création du compte...
                            </>
                          ) : (
                            "S'inscrire comme candidat"
                          )}
                        </Button>

                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="text-primary hover:underline">
                              Se connecter
                            </Link>
                          </p>
                        </div>
                      </form>
                    </TabsContent>

                    {/* Company Registration */}
                    <TabsContent value="company">
                      <form onSubmit={handleCompanyRegister} className="space-y-4">
                        <div>
                          <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="companyName"
                              type="text"
                              placeholder="Nom de votre entreprise"
                              className="pl-10"
                              value={companyData.companyName}
                              onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="companyAddress">Adresse de l'entreprise *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="companyAddress"
                              type="text"
                              placeholder="Adresse complète de l'entreprise"
                              className="pl-10"
                              value={companyData.companyAddress}
                              onChange={(e) => setCompanyData({...companyData, companyAddress: e.target.value})}
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="company-email">Email professionnel *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="company-email"
                              type="email"
                              placeholder="contact@entreprise.com"
                              className="pl-10"
                              value={companyData.email}
                              onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="nifMatricule">NIF ou Matricule (optionnel)</Label>
                          <div className="relative">
                            <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="nifMatricule"
                              type="text"
                              placeholder="Numéro d'identification fiscal"
                              className="pl-10"
                              value={companyData.nifMatricule}
                              onChange={(e) => setCompanyData({...companyData, nifMatricule: e.target.value})}
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="company-password">Mot de passe *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="company-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Votre mot de passe"
                              className="pl-10 pr-10"
                              value={companyData.password}
                              onChange={(e) => setCompanyData({...companyData, password: e.target.value})}
                              required
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                              disabled={loading}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Le mot de passe doit contenir au moins 6 caractères
                          </p>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Création du compte...
                            </>
                          ) : (
                            "S'inscrire comme entreprise"
                          )}
                        </Button>

                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="text-primary hover:underline">
                              Se connecter
                            </Link>
                          </p>
                        </div>
                      </form>
                    </TabsContent>
                  </Tabs>
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

export default Register;