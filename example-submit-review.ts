/**
 * Exemple d'utilisation : Soumettre un avis (service_reviews)
 * 
 * Après la migration, toutes les références utilisateur pointent vers auth.users(id)
 * Le profil est créé automatiquement via le trigger handle_new_user()
 */

import { supabase } from '@/integrations/supabase/client';

interface ReviewFormData {
  service_type: 'recruitment' | 'training' | 'consulting' | 'audit' | 'general';
  rating: number; // 1-5
  title: string;
  comment: string;
  is_anonymous?: boolean;
}

/**
 * Soumettre un avis - Version simplifiée après migration
 * Plus besoin de vérifier/créer le profil manuellement, le trigger s'en charge
 */
export async function submitReview(reviewData: ReviewFormData) {
  try {
    // 1. Vérifier que l'utilisateur est authentifié
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Vous devez être connecté pour soumettre un avis');
    }

    // 2. Vérifier que le profil existe (devrait exister grâce au trigger)
    // Si le profil n'existe pas, le trigger le créera automatiquement
    // Mais on peut vérifier pour afficher un message d'erreur plus clair
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Erreur lors de la vérification du profil:', profileError);
      // Le profil devrait être créé automatiquement, mais si ce n'est pas le cas,
      // on peut essayer de le créer manuellement
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.first_name || 'Utilisateur',
          last_name: user.user_metadata?.last_name || '',
          user_type: user.user_metadata?.user_type || 'candidate',
          is_active: true,
          email_verified: !!user.email_confirmed_at,
        });

      if (createError) {
        throw new Error(`Impossible de créer votre profil: ${createError.message}`);
      }
    }

    // 3. Insérer l'avis directement avec auth.uid()
    // La FK pointe maintenant vers auth.users(id), donc on utilise directement user.id
    const { data: insertedReview, error: insertError } = await supabase
      .from('service_reviews')
      .insert({
        user_id: user.id, // Directement auth.users.id, plus besoin de profiles.id
        service_type: reviewData.service_type,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        is_anonymous: reviewData.is_anonymous || false,
        is_approved: false, // Nécessite approbation admin
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erreur lors de l\'insertion de l\'avis:', insertError);
      throw new Error(`Impossible de soumettre l'avis: ${insertError.message}`);
    }

    return {
      success: true,
      review: insertedReview,
      message: 'Votre avis a été soumis avec succès. Il sera publié après approbation.',
    };
  } catch (error) {
    console.error('Erreur lors de la soumission de l\'avis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
    };
  }
}

/**
 * Exemple d'utilisation dans un composant React
 */
export async function exampleUsage() {
  const reviewData: ReviewFormData = {
    service_type: 'recruitment',
    rating: 5,
    title: 'Excellent service',
    comment: 'Très satisfait du service de recrutement.',
    is_anonymous: false,
  };

  const result = await submitReview(reviewData);
  
  if (result.success) {
    console.log('Avis soumis avec succès:', result.review);
  } else {
    console.error('Erreur:', result.error);
  }
}

/**
 * Version avec transaction (si nécessaire pour des opérations complexes)
 */
export async function submitReviewWithTransaction(reviewData: ReviewFormData) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Vous devez être connecté');
  }

  // Note: Supabase ne supporte pas les transactions explicites via le client JS
  // Mais on peut utiliser des fonctions RPC pour encapsuler la logique
  const { data, error } = await supabase.rpc('submit_review_with_validation', {
    p_service_type: reviewData.service_type,
    p_rating: reviewData.rating,
    p_title: reviewData.title,
    p_comment: reviewData.comment,
    p_is_anonymous: reviewData.is_anonymous || false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

