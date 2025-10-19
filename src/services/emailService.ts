import { supabase } from '@/integrations/supabase/client';

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface QuoteRequestNotificationData {
  companyName: string;
  contactName: string;
  email: string;
  serviceType: string;
  budgetRange?: string;
  timeline?: string;
  description: string;
  additionalInfo?: string;
}

export interface AdminNotificationData {
  adminName: string;
  adminEmail: string;
  action: string;
  targetUser: string;
  details: string;
}

export interface ReviewNotificationData {
  userName: string;
  serviceType: string;
  rating: number;
  title: string;
  comment: string;
  isAnonymous: boolean;
}

class EmailService {
  private async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<boolean> {
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

  // Template pour les notifications de demande de devis
  generateQuoteRequestNotificationTemplate(data: QuoteRequestNotificationData): EmailTemplate {
    const subject = `Nouvelle demande de devis - ${data.companyName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouvelle demande de devis</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #00167a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #00167a; }
          .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .button { display: inline-block; background: #00167a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nouvelle demande de devis</h1>
            <p>NovRH CONSULTING</p>
          </div>
          
          <div class="content">
            <h2>Informations de la demande</h2>
            
            <div class="info-box">
              <strong>Entreprise:</strong> ${data.companyName}<br>
              <strong>Contact:</strong> ${data.contactName}<br>
              <strong>Email:</strong> ${data.email}<br>
              <strong>Service demandé:</strong> ${data.serviceType}
            </div>
            
            ${data.budgetRange ? `
            <div class="info-box">
              <strong>Budget estimé:</strong> ${data.budgetRange}
            </div>
            ` : ''}
            
            ${data.timeline ? `
            <div class="info-box">
              <strong>Délai souhaité:</strong> ${data.timeline}
            </div>
            ` : ''}
            
            <div class="info-box">
              <strong>Description du projet:</strong><br>
              ${data.description.replace(/\n/g, '<br>')}
            </div>
            
            ${data.additionalInfo ? `
            <div class="info-box">
              <strong>Informations supplémentaires:</strong><br>
              ${data.additionalInfo.replace(/\n/g, '<br>')}
            </div>
            ` : ''}
            
            <p>
              <a href="https://novrhconsulting.com/admin/quote-requests" class="button">
                Voir la demande dans l'admin
              </a>
            </p>
          </div>
          
          <div class="footer">
            <p>NovRH CONSULTING - Plateforme de recrutement et conseil RH</p>
            <p>Email automatique - Ne pas répondre</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Template pour les notifications d'avis clients
  generateReviewNotificationTemplate(data: ReviewNotificationData): EmailTemplate {
    const subject = `Nouvel avis client - ${data.serviceType}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouvel avis client</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #00167a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #00167a; }
          .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .rating { color: #ffc107; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nouvel avis client</h1>
            <p>NovRH CONSULTING</p>
          </div>
          
          <div class="content">
            <h2>Détails de l'avis</h2>
            
            <div class="info-box">
              <strong>Client:</strong> ${data.isAnonymous ? 'Utilisateur anonyme' : data.userName}<br>
              <strong>Service:</strong> ${data.serviceType}<br>
              <strong>Note:</strong> <span class="rating">${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</span> (${data.rating}/5)
            </div>
            
            <div class="info-box">
              <strong>Titre:</strong> ${data.title}
            </div>
            
            <div class="info-box">
              <strong>Commentaire:</strong><br>
              ${data.comment.replace(/\n/g, '<br>')}
            </div>
            
            <p>
              <a href="https://novrhconsulting.com/admin/reviews" class="button">
                Modérer l'avis
              </a>
            </p>
          </div>
          
          <div class="footer">
            <p>NovRH CONSULTING - Plateforme de recrutement et conseil RH</p>
            <p>Email automatique - Ne pas répondre</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Template pour les confirmations de demande de devis
  generateQuoteRequestConfirmationTemplate(data: QuoteRequestNotificationData): EmailTemplate {
    const subject = `Confirmation de votre demande de devis - NovRH`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de demande de devis</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #00167a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #00167a; }
          .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Demande de devis reçue</h1>
            <p>NovRH CONSULTING</p>
          </div>
          
          <div class="content">
            <p>Bonjour ${data.contactName},</p>
            
            <p>Nous avons bien reçu votre demande de devis pour le service <strong>${data.serviceType}</strong>.</p>
            
            <div class="info-box">
              <strong>Récapitulatif de votre demande:</strong><br>
              • Entreprise: ${data.companyName}<br>
              • Service: ${data.serviceType}<br>
              • Description: ${data.description.substring(0, 100)}...
            </div>
            
            <p><strong>Prochaines étapes:</strong></p>
            <ul>
              <li>Notre équipe analysera votre demande sous 24h</li>
              <li>Un expert vous contactera pour discuter de vos besoins</li>
              <li>Vous recevrez un devis personnalisé dans les 48h</li>
            </ul>
            
            <p>En attendant, n'hésitez pas à consulter nos autres services sur notre site web.</p>
            
            <p>Cordialement,<br>
            L'équipe NovRH CONSULTING</p>
          </div>
          
          <div class="footer">
            <p>NovRH CONSULTING - Plateforme de recrutement et conseil RH</p>
            <p>contact@novrhconsulting.com | +223 76 72 24 47</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Méthodes publiques pour envoyer les emails
  async sendQuoteRequestNotification(data: QuoteRequestNotificationData): Promise<boolean> {
    const template = this.generateQuoteRequestNotificationTemplate(data);

    return this.sendEmail({
      to: 'contact@novrhconsulting.com',
      subject: template.subject,
      html: template.html
    });
  }

  async sendQuoteRequestConfirmation(data: QuoteRequestNotificationData): Promise<boolean> {
    const template = this.generateQuoteRequestConfirmationTemplate(data);

    return this.sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html
    });
  }

  async sendReviewNotification(data: ReviewNotificationData): Promise<boolean> {
    const template = this.generateReviewNotificationTemplate(data);

    return this.sendEmail({
      to: 'contact@novrhconsulting.com',
      subject: template.subject,
      html: template.html
    });
  }

  async sendAdminNotification(data: AdminNotificationData): Promise<boolean> {
    const subject = `Notification Admin - ${data.action} - NovRH`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notification Admin</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #00167a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #00167a; }
          .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Notification Admin</h1>
            <p>NovRH CONSULTING</p>
          </div>
          
          <div class="content">
            <h2>${data.action}</h2>
            
            <div class="info-box">
              <strong>Utilisateur concerné:</strong> ${data.targetUser}<br>
              <strong>Action:</strong> ${data.action}<br>
              <strong>Détails:</strong><br>
              ${data.details}
            </div>
            
            <p>Cette notification a été générée automatiquement par le système.</p>
          </div>
          
          <div class="footer">
            <p>NovRH CONSULTING - Plateforme de recrutement et conseil RH</p>
            <p>Email automatique - Ne pas répondre</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: data.adminEmail,
      subject,
      html
    });
  }
}

export const emailService = new EmailService();