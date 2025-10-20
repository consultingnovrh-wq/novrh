import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Database,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Key,
  Lock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // États pour les paramètres généraux
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'NOVRH',
    siteDescription: 'Plateforme de recrutement et d\'emploi au Mali',
    siteUrl: 'https://novrh.ml',
    contactEmail: 'contact@novrh.ml',
    supportPhone: '+223 20 12 34 56',
    timezone: 'Africa/Bamako',
    language: 'fr',
    maintenanceMode: false
  });

  // États pour les paramètres de sécurité
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableTwoFactor: false,
    enableCaptcha: true
  });

  // États pour les paramètres de notifications
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    adminAlerts: true,
    userRegistrationAlert: true,
    jobPostingAlert: true,
    paymentAlert: true
  });

  // États pour les paramètres d'intégration
  const [integrationSettings, setIntegrationSettings] = useState({
    googleAnalytics: '',
    facebookPixel: '',
    stripeEnabled: true,
    paypalEnabled: false,
    smtpEnabled: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Charger les paramètres depuis la base de données
      const { data: settingsData, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) {
        console.error('Error loading settings:', error);
        // Utiliser les valeurs par défaut si erreur
        return;
      }

      if (settingsData && settingsData.length > 0) {
        // Convertir les données de la base en format utilisable
        const settings = settingsData.reduce((acc, setting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {});

        setGeneralSettings(prev => ({
          ...prev,
          siteName: settings.site_name || prev.siteName,
          siteDescription: settings.site_description || prev.siteDescription,
          siteUrl: settings.site_url || prev.siteUrl,
          contactEmail: settings.contact_email || prev.contactEmail,
          supportPhone: settings.support_phone || prev.supportPhone,
          timezone: settings.timezone || prev.timezone,
          language: settings.language || prev.language,
          maintenanceMode: settings.maintenance_mode || prev.maintenanceMode
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (tab: string) => {
    try {
      setLoading(true);
      
      if (tab === 'general') {
        // Sauvegarder les paramètres généraux
        const settingsToSave = [
          { setting_key: 'site_name', setting_value: generalSettings.siteName },
          { setting_key: 'site_description', setting_value: generalSettings.siteDescription },
          { setting_key: 'site_url', setting_value: generalSettings.siteUrl },
          { setting_key: 'contact_email', setting_value: generalSettings.contactEmail },
          { setting_key: 'support_phone', setting_value: generalSettings.supportPhone },
          { setting_key: 'timezone', setting_value: generalSettings.timezone },
          { setting_key: 'language', setting_value: generalSettings.language },
          { setting_key: 'maintenance_mode', setting_value: generalSettings.maintenanceMode }
        ];

        const { error } = await supabase
          .from('site_settings')
          .upsert(settingsToSave);

        if (error) throw error;
      }
      
      toast({
        title: "Succès",
        description: `Paramètres ${tab} sauvegardés avec succès`,
      });
      
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = (tab: string) => {
    if (confirm(`Êtes-vous sûr de vouloir réinitialiser tous les paramètres ${tab} ?`)) {
      loadSettings();
      toast({
        title: "Réinitialisation",
        description: `Paramètres ${tab} réinitialisés`,
      });
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Intégrations', icon: Globe },
    { id: 'database', label: 'Base de données', icon: Database }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="siteName">Nom du site</Label>
          <Input
            id="siteName"
            value={generalSettings.siteName}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="siteUrl">URL du site</Label>
          <Input
            id="siteUrl"
            value={generalSettings.siteUrl}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email de contact</Label>
          <Input
            id="contactEmail"
            type="email"
            value={generalSettings.contactEmail}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supportPhone">Téléphone support</Label>
          <Input
            id="supportPhone"
            value={generalSettings.supportPhone}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timezone">Fuseau horaire</Label>
          <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Africa/Bamako">Bamako (UTC+0)</SelectItem>
              <SelectItem value="Europe/Paris">Paris (UTC+1/+2)</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="language">Langue</Label>
          <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="bm">Bambara</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="siteDescription">Description du site</Label>
        <Textarea
          id="siteDescription"
          value={generalSettings.siteDescription}
          onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
          rows={3}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="maintenanceMode"
          checked={generalSettings.maintenanceMode}
          onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, maintenanceMode: checked }))}
        />
        <Label htmlFor="maintenanceMode">Mode maintenance</Label>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="passwordMinLength">Longueur minimale du mot de passe</Label>
          <Input
            id="passwordMinLength"
            type="number"
            min="6"
            max="20"
            value={securitySettings.passwordMinLength}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
          <Input
            id="sessionTimeout"
            type="number"
            min="5"
            max="1440"
            value={securitySettings.sessionTimeout}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
          <Input
            id="maxLoginAttempts"
            type="number"
            min="3"
            max="10"
            value={securitySettings.maxLoginAttempts}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="requireSpecialChars"
            checked={securitySettings.requireSpecialChars}
            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireSpecialChars: checked }))}
          />
          <Label htmlFor="requireSpecialChars">Exiger des caractères spéciaux</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="requireNumbers"
            checked={securitySettings.requireNumbers}
            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireNumbers: checked }))}
          />
          <Label htmlFor="requireNumbers">Exiger des chiffres</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="requireUppercase"
            checked={securitySettings.requireUppercase}
            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireUppercase: checked }))}
          />
          <Label htmlFor="requireUppercase">Exiger des majuscules</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="enableTwoFactor"
            checked={securitySettings.enableTwoFactor}
            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableTwoFactor: checked }))}
          />
          <Label htmlFor="enableTwoFactor">Activer l'authentification à deux facteurs</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="enableCaptcha"
            checked={securitySettings.enableCaptcha}
            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableCaptcha: checked }))}
          />
          <Label htmlFor="enableCaptcha">Activer le CAPTCHA</Label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="emailNotifications"
            checked={notificationSettings.emailNotifications}
            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
          />
          <Label htmlFor="emailNotifications">Notifications par email</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="smsNotifications"
            checked={notificationSettings.smsNotifications}
            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))}
          />
          <Label htmlFor="smsNotifications">Notifications par SMS</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="pushNotifications"
            checked={notificationSettings.pushNotifications}
            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
          />
          <Label htmlFor="pushNotifications">Notifications push</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="adminAlerts"
            checked={notificationSettings.adminAlerts}
            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, adminAlerts: checked }))}
          />
          <Label htmlFor="adminAlerts">Alertes administrateur</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="userRegistrationAlert"
            checked={notificationSettings.userRegistrationAlert}
            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, userRegistrationAlert: checked }))}
          />
          <Label htmlFor="userRegistrationAlert">Alerte nouvelle inscription</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="jobPostingAlert"
            checked={notificationSettings.jobPostingAlert}
            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, jobPostingAlert: checked }))}
          />
          <Label htmlFor="jobPostingAlert">Alerte nouvelle offre d'emploi</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="paymentAlert"
            checked={notificationSettings.paymentAlert}
            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, paymentAlert: checked }))}
          />
          <Label htmlFor="paymentAlert">Alerte paiement</Label>
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
          <Input
            id="googleAnalytics"
            placeholder="GA-XXXXXXXXX-X"
            value={integrationSettings.googleAnalytics}
            onChange={(e) => setIntegrationSettings(prev => ({ ...prev, googleAnalytics: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
          <Input
            id="facebookPixel"
            placeholder="XXXXXXXXXX"
            value={integrationSettings.facebookPixel}
            onChange={(e) => setIntegrationSettings(prev => ({ ...prev, facebookPixel: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="stripeEnabled"
            checked={integrationSettings.stripeEnabled}
            onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, stripeEnabled: checked }))}
          />
          <Label htmlFor="stripeEnabled">Activer Stripe</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="paypalEnabled"
            checked={integrationSettings.paypalEnabled}
            onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, paypalEnabled: checked }))}
          />
          <Label htmlFor="paypalEnabled">Activer PayPal</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="smtpEnabled"
            checked={integrationSettings.smtpEnabled}
            onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, smtpEnabled: checked }))}
          />
          <Label htmlFor="smtpEnabled">Activer SMTP</Label>
        </div>
      </div>
      
      {integrationSettings.smtpEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">Serveur SMTP</Label>
            <Input
              id="smtpHost"
              value={integrationSettings.smtpHost}
              onChange={(e) => setIntegrationSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtpPort">Port SMTP</Label>
            <Input
              id="smtpPort"
              type="number"
              value={integrationSettings.smtpPort}
              onChange={(e) => setIntegrationSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtpUser">Utilisateur SMTP</Label>
            <Input
              id="smtpUser"
              value={integrationSettings.smtpUser}
              onChange={(e) => setIntegrationSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
            <Input
              id="smtpPassword"
              type="password"
              value={integrationSettings.smtpPassword}
              onChange={(e) => setIntegrationSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Informations de la base de données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Type de base</Label>
                <p className="text-sm text-gray-600">PostgreSQL (Supabase)</p>
              </div>
              <div>
                <Label>Version</Label>
                <p className="text-sm text-gray-600">15.0</p>
              </div>
              <div>
                <Label>Statut</Label>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Connecté</span>
                </div>
              </div>
              <div>
                <Label>Dernière sauvegarde</Label>
                <p className="text-sm text-gray-600">Il y a 2 heures</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => toast({ title: "Sauvegarde", description: "Sauvegarde de la base de données lancée" })}>
          <Database className="w-4 h-4 mr-2" />
          Lancer une sauvegarde
        </Button>
        <Button variant="outline" onClick={() => toast({ title: "Optimisation", description: "Optimisation de la base de données lancée" })}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Optimiser la base
        </Button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'integrations':
        return renderIntegrationSettings();
      case 'database':
        return renderDatabaseSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Paramètres Système</h1>
            <p className="text-gray-600">Configurez tous les paramètres de la plateforme</p>
          </div>

          {/* Onglets */}
          <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Contenu de l'onglet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {tabs.find(t => t.id === activeTab)?.icon && (
                  (() => {
                    const Icon = tabs.find(t => t.id === activeTab)!.icon;
                    return <Icon className="w-5 h-5" />;
                  })()
                )}
                {tabs.find(t => t.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {renderTabContent()}
              
              {/* Actions */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <Button 
                  onClick={() => saveSettings(activeTab)}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => resetSettings(activeTab)}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
