import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Download,
  FileText,
  Building2,
  GraduationCap,
  Briefcase
} from 'lucide-react';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  user?: any;
}

const UserDetailsModal = ({ isOpen, onClose, userId, user }: UserDetailsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && (userId || user)) {
      loadUserDetails();
    }
  }, [isOpen, userId, user]);

  const loadUserDetails = async () => {
    setLoading(true);
    try {
      const targetUserId = userId || user?.id;
      
      // Charger les données de base de l'utilisateur
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      setUserProfile(profileData);

      // Charger les données spécifiques selon le type d'utilisateur
      if (profileData?.user_type === 'company') {
        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', targetUserId)
          .single();
        setUserData(companyData);
      } else if (profileData?.user_type === 'candidate') {
        const { data: candidateData } = await supabase
          .from('candidates')
          .select('*')
          .eq('user_id', targetUserId)
          .single();
        setUserData(candidateData);
      }

      // Charger l'activité récente
      const { data: activityData } = await supabase
        .from('admin_logs')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(10);

      setUserActivity(activityData || []);

    } catch (error) {
      console.error('Error loading user details:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de l'utilisateur.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action: string) => {
    try {
      const targetUserId = userId || user?.id;
      
      switch (action) {
        case 'activate':
          await supabase
            .from('profiles')
            .update({ is_active: true })
            .eq('user_id', targetUserId);
          break;
        case 'deactivate':
          await supabase
            .from('profiles')
            .update({ is_active: false })
            .eq('user_id', targetUserId);
          break;
        case 'verify':
          await supabase
            .from('profiles')
            .update({ email_verified: true })
            .eq('user_id', targetUserId);
          break;
        case 'unverify':
          await supabase
            .from('profiles')
            .update({ email_verified: false })
            .eq('user_id', targetUserId);
          break;
      }

      await loadUserDetails();
      
      toast({
        title: "Action effectuée",
        description: `L'utilisateur a été ${action === 'activate' ? 'activé' : action === 'deactivate' ? 'désactivé' : action === 'verify' ? 'vérifié' : 'non vérifié'}.`,
      });
    } catch (error) {
      console.error('Error handling user action:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'action.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'company':
        return <Building2 className="w-5 h-5" />;
      case 'candidate':
        return <User className="w-5 h-5" />;
      case 'student':
        return <GraduationCap className="w-5 h-5" />;
      case 'admin':
        return <Shield className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'company':
        return 'Entreprise';
      case 'candidate':
        return 'Candidat';
      case 'student':
        return 'Étudiant';
      case 'admin':
        return 'Administrateur';
      default:
        return 'Utilisateur';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getUserTypeIcon(userProfile?.user_type)}
            <span>Détails de l'utilisateur</span>
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur {userProfile?.email}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations de base</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span>{userProfile?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Nom:</span>
                      <span>{userProfile?.first_name} {userProfile?.last_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Type:</span>
                      <Badge variant="outline">{getUserTypeLabel(userProfile?.user_type)}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Créé le:</span>
                      <span>{formatDate(userProfile?.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statut</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Actif:</span>
                      <Badge variant={userProfile?.is_active ? "default" : "secondary"}>
                        {userProfile?.is_active ? "Oui" : "Non"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email vérifié:</span>
                      <Badge variant={userProfile?.email_verified ? "default" : "secondary"}>
                        {userProfile?.email_verified ? "Oui" : "Non"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Dernière connexion:</span>
                      <span className="text-sm text-muted-foreground">
                        {userProfile?.last_sign_in_at ? formatDate(userProfile.last_sign_in_at) : 'Jamais'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUserAction(userProfile?.is_active ? 'deactivate' : 'activate')}
                    >
                      {userProfile?.is_active ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Activer
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUserAction(userProfile?.email_verified ? 'unverify' : 'verify')}
                    >
                      {userProfile?.email_verified ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Non vérifier
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Vérifier
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {userData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Détails {userProfile?.user_type === 'company' ? 'de l\'entreprise' : 'du candidat'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {userProfile?.user_type === 'company' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Nom de l'entreprise:</span>
                          <span>{userData.company_name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Adresse:</span>
                          <span>{userData.company_address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">NIF/Matricule:</span>
                          <span>{userData.nif_matricule}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Vérifié:</span>
                          <Badge variant={userData.is_verified ? "default" : "secondary"}>
                            {userData.is_verified ? "Oui" : "Non"}
                          </Badge>
                        </div>
                      </>
                    )}
                    {userProfile?.user_type === 'candidate' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Nom complet:</span>
                          <span>{userData.first_name} {userData.last_name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Téléphone:</span>
                          <span>{userData.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">CV:</span>
                          {userData.cv_url ? (
                            <Button size="sm" variant="link" asChild>
                              <a href={userData.cv_url} target="_blank" rel="noopener noreferrer">
                                Voir le CV
                              </a>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">Aucun CV</span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <span className="font-medium">Description du profil:</span>
                          <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                            {userData.profile_description || 'Aucune description'}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  {userActivity.length > 0 ? (
                    <div className="space-y-3">
                      {userActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(activity.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Aucune activité récente
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
