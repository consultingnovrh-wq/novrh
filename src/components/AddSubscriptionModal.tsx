import { useState, useEffect } from 'react';
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
import { CreditCard, User, Calendar, DollarSign } from "lucide-react";

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionAdded: () => void;
}

const AddSubscriptionModal = ({ isOpen, onClose, onSubscriptionAdded }: AddSubscriptionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    planId: '',
    status: 'active' as 'active' | 'inactive' | 'cancelled' | 'expired',
    startDate: '',
    endDate: '',
    paymentMethod: 'manual',
    amount: 0
  });
  
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const { toast } = useToast();

  // Charger les utilisateurs et plans
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les utilisateurs
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_active', true)
          .order('email');

        if (usersError) throw usersError;

        // Charger les plans d'abonnement
        const { data: plansData, error: plansError } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (plansError) throw plansError;

        setUsers(usersData || []);
        setPlans(plansData || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Créer l'abonnement
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: formData.userId,
          plan_id: formData.planId,
          status: formData.status,
          start_date: formData.startDate,
          end_date: formData.endDate,
          created_at: new Date().toISOString()
        });

      if (subscriptionError) throw subscriptionError;

      // Si un montant est spécifié, créer un paiement
      if (formData.amount > 0) {
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: formData.userId,
            amount: formData.amount,
            status: 'completed',
            payment_method: formData.paymentMethod,
            description: `Abonnement créé manuellement`,
            created_at: new Date().toISOString()
          });

        if (paymentError) throw paymentError;
      }

      toast({
        title: "Succès",
        description: "Abonnement créé avec succès.",
      });

      onSubscriptionAdded();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'abonnement.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      planId: '',
      status: 'active',
      startDate: '',
      endDate: '',
      paymentMethod: 'manual',
      amount: 0
    });
  };

  const selectedPlan = plans.find(plan => plan.id === formData.planId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Ajouter un abonnement
          </DialogTitle>
          <DialogDescription>
            Créez un nouvel abonnement pour un utilisateur.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection utilisateur */}
          <div className="space-y-2">
            <Label htmlFor="userId">Utilisateur *</Label>
            <Select
              value={formData.userId}
              onValueChange={(value) => setFormData({ ...formData, userId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un utilisateur" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.user_id}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm text-gray-500">
                          {user.first_name} {user.last_name} - {user.user_type}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sélection du plan */}
          <div className="space-y-2">
            <Label htmlFor="planId">Plan d'abonnement *</Label>
            <Select
              value={formData.planId}
              onValueChange={(value) => {
                const plan = plans.find(p => p.id === value);
                setFormData({ 
                  ...formData, 
                  planId: value,
                  amount: plan?.price || 0
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-sm text-gray-500">{plan.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{plan.price} FCFA</div>
                        <div className="text-sm text-gray-500">{plan.duration} jours</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Informations du plan sélectionné */}
          {selectedPlan && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">{selectedPlan.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{selectedPlan.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Prix :</span> {selectedPlan.price} FCFA
                </div>
                <div>
                  <span className="font-medium">Durée :</span> {selectedPlan.duration} jours
                </div>
                <div>
                  <span className="font-medium">Type :</span> {selectedPlan.type}
                </div>
                <div>
                  <span className="font-medium">Fonctionnalités :</span> {selectedPlan.features?.length || 0}
                </div>
              </div>
            </div>
          )}

          {/* Statut et dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive' | 'cancelled' | 'expired') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                  <SelectItem value="expired">Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Paiement */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations de paiement</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant (FCFA)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="pl-10"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manuel</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                    <SelectItem value="cash">Espèces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !formData.userId || !formData.planId}>
              {loading ? "Création..." : "Créer l'abonnement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionModal;
