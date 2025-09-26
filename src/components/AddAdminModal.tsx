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
import { Shield, Mail, Lock, User, Crown } from "lucide-react";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminAdded: () => void;
}

const AddAdminModal = ({ isOpen, onClose, onAdminAdded }: AddAdminModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roleId: '',
    permissions: [] as string[]
  });
  
  const [roles, setRoles] = useState<any[]>([]);
  const { toast } = useToast();

  // Charger les rôles disponibles
  useState(() => {
    const loadRoles = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_roles')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;
        setRoles(data || []);
      } catch (error) {
        console.error('Error loading roles:', error);
      }
    };

    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

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
            user_type: 'admin'
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
            user_type: 'admin',
            is_active: true,
            email_verified: true
          });

        if (profileError) throw profileError;

        // Créer l'administrateur
        const { error: adminError } = await supabase
          .from('administrators')
          .insert({
            user_id: authData.user.id,
            role_id: formData.roleId,
            is_active: true,
            created_by: (await supabase.auth.getUser()).data.user?.id
          });

        if (adminError) throw adminError;

        toast({
          title: "Succès",
          description: "Administrateur créé avec succès.",
        });

        onAdminAdded();
        onClose();
        resetForm();
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'administrateur.",
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
      roleId: '',
      permissions: []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Ajouter un nouvel administrateur
          </DialogTitle>
          <DialogDescription>
            Créez un nouveau compte administrateur avec des permissions spécifiques.
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
                    placeholder="admin@exemple.com"
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
                    minLength={8}
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
              <Label htmlFor="roleId">Rôle administrateur *</Label>
              <Select
                value={formData.roleId}
                onValueChange={(value) => setFormData({ ...formData, roleId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        {role.display_name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Informations sur le rôle */}
          {formData.roleId && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Permissions du rôle</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                {roles.find(r => r.id === formData.roleId) && (
                  <div>
                    <p className="font-medium">
                      {roles.find(r => r.id === formData.roleId)?.display_name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {roles.find(r => r.id === formData.roleId)?.description}
                    </p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Permissions :</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(roles.find(r => r.id === formData.roleId)?.permissions || {})
                          .filter(([_, value]) => value)
                          .map(([key, _]) => (
                            <span key={key} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {key}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !formData.roleId}>
              {loading ? "Création..." : "Créer l'administrateur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdminModal;
