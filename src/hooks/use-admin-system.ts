import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface AdminRole {
  id: string;
  name: string;
  display_name: string;
  description: string;
  permissions: Record<string, boolean>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Administrator {
  id: string;
  user_id: string;
  role_id: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  role?: AdminRole;
  user?: {
    email: string;
    created_at: string;
  };
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description: string;
  is_public: boolean;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useAdminSystem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Vérifier si l'utilisateur actuel est admin
  const checkIsAdmin = async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', user.id)
        .single();

      if (!profile || profile.user_type !== 'admin') return false;

      // Vérifier si l'utilisateur est dans la table administrators
      const { data: admin } = await supabase
        .from('administrators')
        .select('id, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      return !!admin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Obtenir le rôle de l'administrateur actuel
  const getCurrentAdminRole = async (): Promise<AdminRole | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: admin } = await supabase
        .from('administrators')
        .select(`
          *,
          role:admin_roles(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      return admin?.role || null;
    } catch (error) {
      console.error('Error getting current admin role:', error);
      return null;
    }
  };

  // Vérifier les permissions
  const hasPermission = async (permission: string): Promise<boolean> => {
    try {
      const role = await getCurrentAdminRole();
      if (!role) return false;

      return role.permissions[permission] === true;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  };

  // Logger une action d'administration
  const logAction = async (
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>
  ): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: admin } = await supabase
        .from('administrators')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (!admin) return;

      await supabase
        .from('admin_logs')
        .insert({
          admin_id: admin.id,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: details || {},
          ip_address: null, // Peut être ajouté côté serveur
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  // Gestion des rôles
  const getRoles = async (): Promise<AdminRole[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Gestion des administrateurs
  const getAdministrators = async (): Promise<Administrator[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('administrators')
        .select(`
          *,
          role:admin_roles(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Créer un administrateur
  const createAdministrator = async (
    email: string,
    password: string,
    roleId: string,
    firstName: string = 'Admin',
    lastName: string = 'User'
  ): Promise<boolean> => {
    try {
      setLoading(true);

      // Créer l'utilisateur
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (userError) throw userError;

      // Créer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userData.user.id,
          user_type: 'admin',
          email: email,
          first_name: firstName,
          last_name: lastName,
          is_active: true,
          email_verified: true
        });

      if (profileError) throw profileError;

      // Créer l'administrateur
      const { error: adminError } = await supabase
        .from('administrators')
        .insert({
          user_id: userData.user.id,
          role_id: roleId,
          is_active: true
        });

      if (adminError) throw adminError;

      await logAction('create_administrator', 'administrator', userData.user.id, {
        email,
        role_id: roleId
      });

      toast({
        title: "Succès",
        description: "Administrateur créé avec succès",
      });

      return true;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le rôle d'un administrateur
  const updateAdministratorRole = async (adminId: string, roleId: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('administrators')
        .update({ role_id: roleId })
        .eq('id', adminId);

      if (error) throw error;

      await logAction('update_administrator_role', 'administrator', adminId, {
        new_role_id: roleId
      });

      toast({
        title: "Succès",
        description: "Rôle mis à jour avec succès",
      });

      return true;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Désactiver un administrateur
  const deactivateAdministrator = async (adminId: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('administrators')
        .update({ is_active: false })
        .eq('id', adminId);

      if (error) throw error;

      await logAction('deactivate_administrator', 'administrator', adminId);

      toast({
        title: "Succès",
        description: "Administrateur désactivé avec succès",
      });

      return true;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Gestion des paramètres système
  const getSystemSettings = async (): Promise<SystemSetting[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateSystemSetting = async (key: string, value: any): Promise<boolean> => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('system_settings')
        .update({ value })
        .eq('key', key);

      if (error) throw error;

      await logAction('update_system_setting', 'system_setting', key, {
        new_value: value
      });

      toast({
        title: "Succès",
        description: "Paramètre mis à jour avec succès",
      });

      return true;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Obtenir les logs d'administration
  const getAdminLogs = async (limit: number = 50): Promise<AdminLog[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    checkIsAdmin,
    getCurrentAdminRole,
    hasPermission,
    logAction,
    getRoles,
    getAdministrators,
    createAdministrator,
    updateAdministratorRole,
    deactivateAdministrator,
    getSystemSettings,
    updateSystemSetting,
    getAdminLogs
  };
};
