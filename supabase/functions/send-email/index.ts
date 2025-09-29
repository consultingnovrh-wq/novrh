import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { to, subject, html, from } = await req.json()

    // Configuration SMTP (à configurer selon votre fournisseur)
    const smtpConfig = {
      host: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
      port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
      secure: false, // true pour le port 465, false pour les autres ports
      auth: {
        user: Deno.env.get('SMTP_USER') || '',
        pass: Deno.env.get('SMTP_PASS') || '',
      },
    }

    // Envoi de l'email via Resend (recommandé pour la production)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (resendApiKey) {
      // Utiliser Resend pour l'envoi d'emails
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: from || 'NovRH Consulting <noreply@novrhconsulting.com>',
          to: [to],
          subject: subject,
          html: html,
        }),
      })

      if (!resendResponse.ok) {
        const error = await resendResponse.text()
        throw new Error(`Resend API error: ${error}`)
      }

      const result = await resendResponse.json()
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          messageId: result.id,
          message: 'Email sent successfully via Resend'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      // Fallback: utiliser un service d'email simple
      // Pour la démo, on simule l'envoi
      console.log('Email would be sent:', { to, subject, from })
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email queued for sending (demo mode)'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
