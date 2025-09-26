import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminTeam {
  id: string;
  team_name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'moderator' | 'viewer';
  permissions: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  };
}

export interface AdminAction {
  id: string;
  user_id: string;
  action_type: string;
  target_type: string;
  target_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: {
    email: string;
  };
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: Record<string, any>;
  description: string;
  is_public: boolean;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  user_type: string;
  created_at: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  company?: {
    company_name: string;
  };
  candidate?: {
    first_name: string;
    last_name: string;
  };
}

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier les permissions d'administration
  const checkAdminPermission = async (requiredRole: string = 'admin', teamId?: string) => {
    try {
      const { data, error } = await supabase.rpc('check_admin_permission', {
        required_role: requiredRole,
        team_id: teamId
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error checking admin permission:', error);
      return false;
    }
  };

  // Logger une action d'administration
  const logAdminAction = async (
    actionType: string,
    targetType: string,
    targetId?: string,
    details: Record<string, any> = {}
  ) => {
    try {
      const { data, error } = await supabase.rpc('log_admin_action', {
        action_type: actionType,
        target_type: targetType,
        target_id: targetId,
        details: details
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error logging admin action:', error);
      return null;
    }
  };

  // Gestion des équipes d'administration
  const getAdminTeams = async (): Promise<AdminTeam[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_teams')
        .select('*')
        .eq('is_active', true)
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

  const createAdminTeam = async (teamData: Partial<AdminTeam>): Promise<AdminTeam | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_teams')
        .insert([teamData])
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('team_created', 'admin_team', data.id, teamData);
      return data;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAdminTeam = async (teamId: string, updates: Partial<AdminTeam>): Promise<AdminTeam | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_teams')
        .update(updates)
        .eq('id', teamId)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('team_updated', 'admin_team', teamId, updates);
      return data;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Gestion des membres d'équipe
  const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          user:user_id(email, user_metadata)
        `)
        .eq('team_id', teamId)
        .eq('is_active', true)
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

  const addTeamMember = async (memberData: Partial<TeamMember>): Promise<TeamMember | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_members')
        .insert([memberData])
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('member_added', 'team_member', data.id, memberData);
      return data;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTeamMember = async (memberId: string, updates: Partial<TeamMember>): Promise<TeamMember | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('member_updated', 'team_member', memberId, updates);
      return data;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeTeamMember = async (memberId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('team_members')
        .update({ is_active: false })
        .eq('id', memberId);

      if (error) throw error;

      await logAdminAction('member_removed', 'team_member', memberId);
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Gestion des utilisateurs
  const getUsers = async (): Promise<User[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          user_type,
          created_at,
          user:user_id(email),
          profile:candidates(user_id, first_name, last_name, phone),
          company:companies(user_id, company_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transformer les données pour un format plus simple
      return (data || []).map(profile => ({
        id: profile.user_id,
        email: profile.user?.email || '',
        user_type: profile.user_type,
        created_at: profile.created_at,
        profile: profile.profile?.[0] || {},
        company: profile.company?.[0] || {}
      }));
    } catch (error: any) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateUserType = async (userId: string, newUserType: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: newUserType })
        .eq('user_id', userId);

      if (error) throw error;

      await logAdminAction('user_type_updated', 'user', userId, { new_user_type: newUserType });
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (userId: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Désactiver l'utilisateur dans auth.users (nécessite une fonction RPC)
      const { error } = await supabase.rpc('deactivate_user', { user_id: userId });

      if (error) throw error;

      await logAdminAction('user_deactivated', 'user', userId);
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Gestion des paramètres du site
  const getSiteSettings = async (): Promise<SiteSetting[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateSiteSetting = async (settingKey: string, newValue: Record<string, any>): Promise<SiteSetting | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .update({ 
          setting_value: newValue,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('setting_key', settingKey)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction('setting_updated', 'site_setting', data.id, { setting_key: settingKey, new_value: newValue });
      return data;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer l'historique des actions d'administration
  const getAdminActions = async (limit: number = 100): Promise<AdminAction[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_actions')
        .select(`
          *,
          user:user_id(email)
        `)
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

  // Statistiques d'administration
  const getAdminStats = async () => {
    try {
      setLoading(true);
      
      // Compter les utilisateurs par type
      const { data: userStats, error: userError } = await supabase
        .from('profiles')
        .select('user_type');

      if (userError) throw userError;

      const userCounts = (userStats || []).reduce((acc: Record<string, number>, profile: any) => {
        acc[profile.user_type] = (acc[profile.user_type] || 0) + 1;
        return acc;
      }, {});

      // Compter les équipes d'administration
      const { count: teamCount, error: teamError } = await supabase
        .from('admin_teams')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (teamError) throw teamError;

      // Compter les actions récentes
      const { count: actionCount, error: actionError } = await supabase
        .from('admin_actions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (actionError) throw actionError;

      return {
        userCounts,
        teamCount: teamCount || 0,
        recentActions: actionCount || 0
      };
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    checkAdminPermission,
    logAdminAction,
    // Équipes
    getAdminTeams,
    createAdminTeam,
    updateAdminTeam,
    // Membres
    getTeamMembers,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    // Utilisateurs
    getUsers,
    updateUserType,
    deactivateUser,
    // Paramètres
    getSiteSettings,
    updateSiteSetting,
    // Actions et statistiques
    getAdminActions,
    getAdminStats
  };
};
