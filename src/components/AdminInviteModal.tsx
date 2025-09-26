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
    setLoading(true);

    try {
      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('user_id, email')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        // L'utilisateur existe, l'ajouter comme admin
        const { error: adminError } = await supabase
          .from('administrators')
          .insert({
            user_id: existingUser.user_id,
            role_id: formData.role,
            is_active: true
          });

        if (adminError) {
          throw adminError;
        }

        toast({
          title: "Administrateur ajouté",
          description: `${formData.email} a été ajouté comme administrateur.`,
        });
      } else {
        // L'utilisateur n'existe pas, créer une invitation
        const { error: inviteError } = await supabase
          .from('admin_invitations')
          .insert({
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            role_id: formData.role,
            message: formData.message,
            status: 'pending'
          });

        if (inviteError) {
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

    } catch (error) {
      console.error('Error creating admin invitation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'invitation.",
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