export const CV_BUCKET =
  import.meta.env.VITE_SUPABASE_CV_BUCKET?.trim() || "cv_uploads";

export const getCvBucketHint = () =>
  `Assurez-vous que le bucket Supabase "${CV_BUCKET}" existe et est public.`;

