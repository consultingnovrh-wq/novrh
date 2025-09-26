import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  ShoppingCart, 
  Settings, 
  Shield, 
  BarChart3, 
  FileText,
  Briefcase,
  CreditCard,
  UserCheck,
  UserX,
  Globe,
  Database,
  History,
  UserCog,
  Key,
  Home,
  LogOut,
  ChevronDown,
  X,
  Menu,
  Clock,
  CheckCircle,
  DollarSign,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  Star,
  Activity,
  Download,
  Plus,
  Bell
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const AdminSidebar = ({ isCollapsed, onToggleCollapse }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);

  const navigationItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      subtitle: 'Vue d\'ensemble',
      icon: Home,
      path: '/admin',
      hasSubmenu: false
    },
    {
      id: 'users',
      title: 'Utilisateurs',
      subtitle: 'Gestion des comptes',
      icon: Users,
      path: '/admin/users',
      hasSubmenu: true,
      submenu: [
        { title: 'Tous les utilisateurs', path: '/admin/users/all', icon: Users },
        { title: 'Candidats', path: '/admin/users/candidates', icon: UserCheck },
        { title: 'Entreprises', path: '/admin/users/companies', icon: Building2 },
        { title: 'Étudiants', path: '/admin/users/students', icon: GraduationCap },
        { title: 'En attente d\'approbation', path: '/admin/users/pending', icon: Clock },
        { title: 'Utilisateurs désactivés', path: '/admin/users/disabled', icon: UserX }
      ]
    },
    {
      id: 'subscriptions',
      title: 'Abonnements',
      subtitle: 'Gestion des paiements',
      icon: CreditCard,
      path: '/admin/subscriptions',
      hasSubmenu: true,
      submenu: [
        { title: 'Tous les abonnements', path: '/admin/subscriptions/all', icon: CreditCard },
        { title: 'Plans actifs', path: '/admin/subscriptions/active', icon: CheckCircle },
        { title: 'Paiements', path: '/admin/subscriptions/payments', icon: DollarSign },
        { title: 'Factures', path: '/admin/subscriptions/invoices', icon: FileText },
        { title: 'Remboursements', path: '/admin/subscriptions/refunds', icon: RotateCcw }
      ]
    },
    {
      id: 'companies',
      title: 'Entreprises',
      subtitle: 'Gestion des partenaires',
      icon: Building2,
      path: '/admin/companies',
      hasSubmenu: true,
      submenu: [
        { title: 'Toutes les entreprises', path: '/admin/companies/all', icon: Building2 },
        { title: 'Entreprises vérifiées', path: '/admin/companies/verified', icon: CheckCircle },
        { title: 'En attente de vérification', path: '/admin/companies/pending', icon: Clock },
        { title: 'Entreprises premium', path: '/admin/companies/premium', icon: Star },
        { title: 'Statistiques', path: '/admin/companies/stats', icon: BarChart3 }
      ]
    },
    {
      id: 'jobs',
      title: 'Offres d\'emploi',
      subtitle: 'Gestion des opportunités',
      icon: Briefcase,
      path: '/admin/jobs',
      hasSubmenu: true,
      submenu: [
        { title: 'Toutes les offres', path: '/admin/jobs/all', icon: Briefcase },
        { title: 'Offres actives', path: '/admin/jobs/active', icon: CheckCircle },
        { title: 'Offres expirées', path: '/admin/jobs/expired', icon: Clock },
        { title: 'En attente d\'approbation', path: '/admin/jobs/pending', icon: AlertTriangle },
        { title: 'Statistiques', path: '/admin/jobs/stats', icon: BarChart3 }
      ]
    },
    {
      id: 'candidates',
      title: 'Candidats',
      subtitle: 'Gestion des profils',
      icon: UserCheck,
      path: '/admin/candidates',
      hasSubmenu: true,
      submenu: [
        { title: 'Tous les candidats', path: '/admin/candidates/all', icon: UserCheck },
        { title: 'CV en attente', path: '/admin/candidates/cv-pending', icon: Clock },
        { title: 'Candidats vérifiés', path: '/admin/candidates/verified', icon: CheckCircle },
        { title: 'Candidats premium', path: '/admin/candidates/premium', icon: Star },
        { title: 'Statistiques', path: '/admin/candidates/stats', icon: BarChart3 }
      ]
    },
    {
      id: 'formations',
      title: 'Formations',
      subtitle: 'Gestion des cours',
      icon: GraduationCap,
      path: '/admin/formations',
      hasSubmenu: true,
      submenu: [
        { title: 'Toutes les formations', path: '/admin/formations/all', icon: GraduationCap },
        { title: 'Formations actives', path: '/admin/formations/active', icon: CheckCircle },
        { title: 'Formations populaires', path: '/admin/formations/popular', icon: TrendingUp },
        { title: 'Inscriptions', path: '/admin/formations/enrollments', icon: Users },
        { title: 'Statistiques', path: '/admin/formations/stats', icon: BarChart3 }
      ]
    },
    {
      id: 'admin-team',
      title: 'Équipe Admin',
      subtitle: 'Gestion des administrateurs',
      icon: UserCog,
      path: '/admin/team',
      hasSubmenu: true,
      submenu: [
        { title: 'Tous les admins', path: '/admin/team/all', icon: UserCog },
        { title: 'Ajouter un admin', path: '/admin/team/add', icon: Plus },
        { title: 'Rôles et permissions', path: '/admin/team/roles', icon: Shield },
        { title: 'Logs d\'activité', path: '/admin/team/logs', icon: History }
      ]
    },
    {
      id: 'reports',
      title: 'Rapports',
      subtitle: 'Analyses et statistiques',
      icon: BarChart3,
      path: '/admin/reports',
      hasSubmenu: true,
      submenu: [
        { title: 'Tableau de bord', path: '/admin/reports/dashboard', icon: BarChart3 },
        { title: 'Rapport utilisateurs', path: '/admin/reports/users', icon: Users },
        { title: 'Rapport revenus', path: '/admin/reports/revenue', icon: DollarSign },
        { title: 'Rapport activités', path: '/admin/reports/activity', icon: Activity },
        { title: 'Exports', path: '/admin/reports/exports', icon: Download }
      ]
    },
    {
      id: 'settings',
      title: 'Paramètres',
      subtitle: 'Configuration système',
      icon: Settings,
      path: '/admin/settings',
      hasSubmenu: true,
      submenu: [
        { title: 'Général', path: '/admin/settings/general', icon: Settings },
        { title: 'Sécurité', path: '/admin/settings/security', icon: Shield },
        { title: 'Notifications', path: '/admin/settings/notifications', icon: Bell },
        { title: 'Intégrations', path: '/admin/settings/integrations', icon: Globe },
        { title: 'Base de données', path: '/admin/settings/database', icon: Database }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const isSubmenuActive = (submenu: any[]) => submenu.some(item => isActive(item.path));

  return (
    <div className={`bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <div>
                <div className="font-bold text-white">NOVRH</div>
                <div className="text-xs text-gray-400">Super Admin</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedSections.includes(item.id);
            const isCurrentActive = isActive(item.path) || isSubmenuActive(item.submenu || []);

            return (
              <div key={item.id}>
                {/* Item principal */}
                <Button
                  variant={isCurrentActive ? "secondary" : "ghost"}
                  className={`w-full justify-start h-12 px-3 ${
                    isCurrentActive 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleSection(item.id);
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {!isCollapsed && (
                    <>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs opacity-75">{item.subtitle}</div>
                      </div>
                      {item.hasSubmenu && (
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`} 
                        />
                      )}
                    </>
                  )}
                </Button>

                {/* Sous-menu */}
                {item.hasSubmenu && !isCollapsed && isExpanded && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.submenu.map((subItem, index) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = isActive(subItem.path);
                      
                      return (
                        <Button
                          key={index}
                          variant={isSubActive ? "secondary" : "ghost"}
                          size="sm"
                          className={`w-full justify-start h-10 px-3 ${
                            isSubActive 
                              ? 'bg-blue-500 text-white hover:bg-blue-600' 
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                          onClick={() => navigate(subItem.path)}
                        >
                          <SubIcon className="w-4 h-4 mr-2" />
                          {subItem.title}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <div className="text-center text-xs text-gray-400 mb-3">
            Version 1.0.0
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full text-gray-300 hover:text-white hover:bg-gray-800"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          {!isCollapsed && "Se déconnecter"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
