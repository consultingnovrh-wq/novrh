import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Building2, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const [candidateData, setCandidateData] = useState({ email: "", password: "" });
  const [companyData, setCompanyData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Rediriger vers le dashboard approprié
        redirectToDashboard(user);
      }
    };
    checkUser();
  }, []);

  const redirectToDashboard = async (user: any) => {
    try {
      console.log('🔄 Redirection en cours pour l\'utilisateur:', user.email);
      
      // Attendre un peu pour s'assurer que le profil est synchronisé
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Récupérer le type d'utilisateur depuis le profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type, email_verified')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('❌ Erreur récupération profil:', profileError);
        navigate('/dashboard');
        return;
      }

      if (profile) {
        console.log('👤 Profil trouvé:', profile);
        
        // Vérifier si l'email est vérifié
        if (!profile.email_verified) {
          console.log('⚠️ Email non vérifié');
          toast({
            title: "Email non vérifié",
            description: "Veuillez vérifier votre email avant de continuer.",
            variant: "destructive",
          });
          return;
        }

        // Rediriger selon le type d'utilisateur
        switch (profile.user_type) {
          case 'admin':
            console.log('🔑 Redirection vers admin');
            navigate('/admin');
            break;
          case 'company':
            console.log('🏢 Redirection vers dashboard entreprise');
            navigate('/dashboard/company');
            break;
          case 'candidate':
            console.log('👤 Redirection vers dashboard candidat');
            navigate('/candidate-dashboard');
            break;
          default:
            console.log('❓ Type utilisateur inconnu, redirection vers dashboard général');
            navigate('/dashboard');
            break;
        }
      } else {
        console.log('❌ Profil non trouvé, redirection vers dashboard général');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du profil:', error);
      navigate('/dashboard');
    }
  };

  const handleCandidateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateData.email || !candidateData.password) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: candidateData.email,
        password: candidateData.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Connexion réussie !",
          description: "Redirection vers votre tableau de bord...",
        });
        
        // Rediriger vers le dashboard approprié
        await redirectToDashboard(data.user);
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      let errorMessage = "Une erreur s'est produite lors de la connexion.";
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter.";
      } else if (error.message.includes('Too many requests')) {
        errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
      }

      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData.email || !companyData.password) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: companyData.email,
        password: companyData.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Connexion réussie !",
          description: "Redirection vers votre tableau de bord...",
        });
        
        // Rediriger vers le dashboard approprié
        await redirectToDashboard(data.user);
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      let errorMessage = "Une erreur s'est produite lors de la connexion.";
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter.";
      } else if (error.message.includes('Too many requests')) {
        errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
      }

      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        <section className="py-20 min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">Connexion</h1>
                <p className="text-muted-foreground">Accédez à votre espace personnel</p>
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
                    {/* Candidate Login */}
                    <TabsContent value="candidate">
                      <form onSubmit={handleCandidateLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="candidate-email">Email</Label>
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
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="candidate-password">Mot de passe</Label>
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
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input type="checkbox" id="remember-candidate" className="mr-2" />
                            <Label htmlFor="remember-candidate" className="text-sm">Se souvenir de moi</Label>
                          </div>
                          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                            Mot de passe oublié ?
                          </Link>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connexion...
                            </>
                          ) : (
                            "Se connecter"
                          )}
                        </Button>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Pas encore de compte ?{' '}
                            <Link to="/register" className="text-primary hover:underline">
                              Créer un compte candidat
                            </Link>
                          </p>
                        </div>
                      </form>
                    </TabsContent>

                    {/* Company Login */}
                    <TabsContent value="company">
                      <form onSubmit={handleCompanyLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="company-email">Email professionnel</Label>
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
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="company-password">Mot de passe</Label>
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
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input type="checkbox" id="remember-company" className="mr-2" />
                            <Label htmlFor="remember-company" className="text-sm">Se souvenir de moi</Label>
                          </div>
                          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                            Mot de passe oublié ?
                          </Link>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connexion...
                            </>
                          ) : (
                            "Se connecter"
                          )}
                        </Button>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Nouvelle entreprise ?{' '}
                            <Link to="/register-company" className="text-primary hover:underline">
                              Créer un compte entreprise
                            </Link>
                          </p>
                        </div>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Quick Access */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">Accès rapide</p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Demo Candidat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Building2 className="w-4 h-4 mr-2" />
                    Demo Entreprise
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
};

export default Login;