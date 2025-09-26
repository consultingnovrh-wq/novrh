import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Mail, Lock, User, Building2, GraduationCap, Shield } from "lucide-react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserModal = ({ isOpen, onClose, onUserAdded }: AddUserModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userType: 'candidate' as 'candidate' | 'company' | 'student' | 'admin',
    phone: '',
    companyName: '',
    nifMatricule: '',
    profileDescription: ''
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            user_type: formData.userType
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Créer le profil utilisateur
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            user_type: formData.userType,
            phone: formData.phone,
            is_active: true,
            email_verified: true
          });

        if (profileError) throw profileError;

        // Si c'est une entreprise, créer l'entrée company
        if (formData.userType === 'company') {
          const { error: companyError } = await supabase
            .from('companies')
            .insert({
              user_id: authData.user.id,
              company_name: formData.companyName,
              nif_matricule: formData.nifMatricule,
              is_verified: false
            });

          if (companyError) throw companyError;
        }

        // Si c'est un candidat, créer l'entrée candidate
        if (formData.userType === 'candidate') {
          const { error: candidateError } = await supabase
            .from('candidates')
            .insert({
              user_id: authData.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone,
              profile_description: formData.profileDescription
            });

          if (candidateError) throw candidateError;
        }

        toast({
          title: "Succès",
          description: "Utilisateur créé avec succès.",
        });

        onUserAdded();
        onClose();
        resetForm();
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'utilisateur.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      userType: 'candidate',
      phone: '',
      companyName: '',
      nifMatricule: '',
      profileDescription: ''
    });
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'company':
        return <Building2 className="w-4 h-4" />;
      case 'candidate':
        return <User className="w-4 h-4" />;
      case 'student':
        return <GraduationCap className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Ajouter un nouvel utilisateur
          </DialogTitle>
          <DialogDescription>
            Créez un nouveau compte utilisateur sur la plateforme.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations de base</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mot de passe sécurisé"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  placeholder="Nom de famille"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType">Type d'utilisateur *</Label>
              <Select
                value={formData.userType}
                onValueChange={(value: 'candidate' | 'company' | 'student' | 'admin') => 
                  setFormData({ ...formData, userType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">
                    <div className="flex items-center gap-2">
                      {getUserTypeIcon('candidate')}
                      Candidat
                    </div>
                  </SelectItem>
                  <SelectItem value="company">
                    <div className="flex items-center gap-2">
                      {getUserTypeIcon('company')}
                      Entreprise
                    </div>
                  </SelectItem>
                  <SelectItem value="student">
                    <div className="flex items-center gap-2">
                      {getUserTypeIcon('student')}
                      Étudiant
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      {getUserTypeIcon('admin')}
                      Administrateur
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                placeholder="+237 6XX XX XX XX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Informations spécifiques à l'entreprise */}
          {formData.userType === 'company' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations entreprise</h3>
              
              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input
                  id="companyName"
                  placeholder="Nom de l'entreprise"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required={formData.userType === 'company'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nifMatricule">NIF/Matricule</Label>
                <Input
                  id="nifMatricule"
                  placeholder="NIF ou Matricule"
                  value={formData.nifMatricule}
                  onChange={(e) => setFormData({ ...formData, nifMatricule: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Informations spécifiques au candidat */}
          {formData.userType === 'candidate' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Profil candidat</h3>
              
              <div className="space-y-2">
                <Label htmlFor="profileDescription">Description du profil</Label>
                <textarea
                  id="profileDescription"
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={4}
                  placeholder="Décrivez votre profil professionnel..."
                  value={formData.profileDescription}
                  onChange={(e) => setFormData({ ...formData, profileDescription: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer l'utilisateur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
