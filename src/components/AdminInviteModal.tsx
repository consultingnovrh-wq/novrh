import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, User, Shield, X } from 'lucide-react';

interface AdminInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AdminInviteModal = ({ isOpen, onClose, onSuccess }: AdminInviteModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    message: ''
  });
  const { toast } = useToast();

  const roles = [
    { value: 'super_admin', label: 'Super Administrateur', description: 'Accès complet au système' },
    { value: 'admin', label: 'Administrateur', description: 'Gestion des utilisateurs et contenu' },
    { value: 'moderator', label: 'Modérateur', description: 'Modération du contenu' },
    { value: 'support', label: 'Support', description: 'Support client' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un rôle.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Récupérer l'ID du rôle depuis admin_roles
      const { data: roleData, error: roleError } = await supabase
        .from('admin_roles')
        .select('id')
        .eq('name', formData.role)
        .single();

      if (roleError || !roleData) {
        console.error('Error fetching role:', roleError);
        // Si la table admin_roles n'existe pas, on continue avec le nom du rôle
      }

      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser, error: userCheckError } = await supabase
        .from('profiles')
        .select('user_id, email')
        .eq('email', formData.email)
        .maybeSingle();

      if (userCheckError && userCheckError.code !== 'PGRST116') {
        throw userCheckError;
      }

      if (existingUser) {
        // L'utilisateur existe, l'ajouter comme admin
        // D'abord, mettre à jour le profil pour être admin
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ user_type: 'admin' })
          .eq('user_id', existingUser.user_id);

        if (profileUpdateError) {
          console.error('Error updating profile:', profileUpdateError);
        }

        // Ensuite, ajouter dans administrators si la table existe
        if (roleData) {
          const { error: adminError } = await supabase
            .from('administrators')
            .insert({
              user_id: existingUser.user_id,
              role_id: roleData.id,
              is_active: true
            });

          if (adminError) {
            // Si la table n'existe pas, on continue quand même
            console.log('Table administrators might not exist:', adminError.message);
          }
        }

        toast({
          title: "Administrateur ajouté",
          description: `${formData.email} a été ajouté comme administrateur.`,
        });
      } else {
        // L'utilisateur n'existe pas, créer une invitation
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        const { error: inviteError } = await supabase
          .from('admin_invitations')
          .insert({
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            role_id: formData.role, // On stocke le nom du rôle pour l'instant
            message: formData.message || null,
            status: 'pending',
            invited_by: currentUser?.id || null,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Expire dans 7 jours
          });

        if (inviteError) {
          // Si la table n'existe pas, on affiche un message d'erreur plus clair
          if (inviteError.code === '42P01' || inviteError.message.includes('does not exist')) {
            throw new Error('La table admin_invitations n\'existe pas. Veuillez exécuter la migration SQL correspondante.');
          }
          throw inviteError;
        }

        toast({
          title: "Invitation envoyée",
          description: `Une invitation a été envoyée à ${formData.email}.`,
        });
      }

      // Réinitialiser le formulaire
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: '',
        message: ''
      });

      onClose();
      onSuccess?.();

    } catch (error: any) {
      console.error('Error creating admin invitation:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de l'invitation. Veuillez vérifier que la table admin_invitations existe dans la base de données.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Inviter un Administrateur</span>
          </DialogTitle>
          <DialogDescription>
            Invitez un nouvel administrateur en envoyant une invitation par email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Prénom"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Nom"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{role.label}</span>
                      <span className="text-sm text-muted-foreground">{role.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optionnel)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Message personnalisé pour l'invitation..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer l'invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminInviteModal;