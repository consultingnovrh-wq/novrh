import { supabase } from '@/integrations/supabase/client';
import { WelcomeEmailTemplate, AdminNotificationTemplate, AdminInvitationTemplate } from '@/components/EmailTemplates';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface WelcomeEmailData {
  firstName: string;
  lastName: string;
  userType: string;
  email: string;
}

export interface AdminNotificationData {
  adminName: string;
  action: string;
  targetUser: string;
  details: string;
  adminEmail: string;
}

export interface AdminInvitationData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  invitationUrl: string;
  message?: string;
}

class EmailService {
  private async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // Utiliser Supabase Edge Functions pour envoyer l'email
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          from: emailData.from || 'noreply@novrhconsulting.com'
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in email service:', error);
      return false;
    }
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    const loginUrl = `${window.location.origin}/login`;
    const html = WelcomeEmailTemplate({
      firstName: data.firstName,
      lastName: data.lastName,
      userType: data.userType,
      loginUrl
    });

    return this.sendEmail({
      to: data.email,
      subject: `Bienvenue sur NovRH Consulting - ${data.firstName} ${data.lastName}`,
      html
    });
  }

  async sendAdminNotification(data: AdminNotificationData): Promise<boolean> {
    const html = AdminNotificationTemplate({
      adminName: data.adminName,
      action: data.action,
      targetUser: data.targetUser,
      details: data.details
    });

    return this.sendEmail({
      to: data.adminEmail,
      subject: `Notification Admin - ${data.action} - NovRH`,
      html
    });
  }

  async sendAdminInvitation(data: AdminInvitationData): Promise<boolean> {
    const html = AdminInvitationTemplate({
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      invitationUrl: data.invitationUrl,
      message: data.message
    });

    return this.sendEmail({
      to: data.email,
      subject: `Invitation Administrateur - NovRH Consulting`,
      html
    });
  }

  // Méthode pour envoyer un email personnalisé
  async sendCustomEmail(to: string, subject: string, html: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject,
      html
    });
  }

  // Méthode pour envoyer des emails en lot
  async sendBulkEmails(emails: EmailData[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const email of emails) {
      const result = await this.sendEmail(email);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }
}

export const emailService = new EmailService();
