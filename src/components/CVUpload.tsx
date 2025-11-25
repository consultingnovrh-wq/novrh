import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CV_BUCKET, getCvBucketHint } from '@/constants/storage';
import { Upload, FileText, X, CheckCircle, Download } from 'lucide-react';

interface CVUploadProps {
  onUploadSuccess?: (fileUrl: string, storagePath: string) => void;
  onUploadError?: (error: string) => void;
  existingCV?: string;
  userId?: string;
}

const CVUpload: React.FC<CVUploadProps> = ({ 
  onUploadSuccess, 
  onUploadError, 
  existingCV,
  userId 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const acceptedExtensions = ['.pdf', '.doc', '.docx', '.txt'];

  const validateFile = (file: File): boolean => {
    // Vérifier le type MIME
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Type de fichier non supporté",
        description: "Veuillez sélectionner un fichier PDF, DOC, DOCX ou TXT.",
        variant: "destructive"
      });
      return false;
    }

    // Vérifier la taille (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille du fichier ne doit pas dépasser 10MB.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Générer un nom de fichier unique
      const fileExtension = file.name.split('.').pop();
      const fileName = `cv_${user.id}_${Date.now()}.${fileExtension}`;
      const filePath = `${user.id}/${fileName}`;

      // Simuler le progrès d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload du fichier
      const { data, error } = await supabase.storage
        .from(CV_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        throw error;
      }

      // Obtenir l'URL publique du fichier
      const { data: urlData } = supabase.storage
        .from(CV_BUCKET)
        .getPublicUrl(filePath);

      await supabase
        .from('candidates')
        .upsert({
          user_id: user.id,
          cv_url: filePath
        });

      setUploadedFile(file);
      
      toast({
        title: "CV uploadé avec succès !",
        description: "Votre CV a été sauvegardé.",
      });

      onUploadSuccess?.(urlData.publicUrl, filePath);

    } catch (error) {
      console.error('Erreur upload:', error);
      const message = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
      const isBucketMissing = error instanceof Error && error.message.toLowerCase().includes('bucket');
      toast({
        title: "Erreur d'upload",
        description: isBucketMissing
          ? `Bucket Supabase introuvable (${CV_BUCKET}). ${getCvBucketHint()}`
          : message || "Une erreur est survenue lors de l'upload.",
        variant: "destructive"
      });
      onUploadError?.(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (file: File) => {
    uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const downloadExistingCV = async () => {
    if (!existingCV) return;
    
    try {
      const { data, error } = await supabase.storage
        .from(CV_BUCKET)
        .download(existingCV);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = existingCV.split('/').pop() || 'cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le CV existant.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {existingCV ? 'Mettre à jour votre CV' : 'Uploader votre CV'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CV existant */}
        {existingCV && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  CV actuel disponible
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadExistingCV}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </Button>
            </div>
          </div>
        )}

        {/* Zone d'upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedExtensions.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Upload en cours...</p>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-gray-500">{uploadProgress}%</p>
              </div>
            </div>
          ) : uploadedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">
                  CV uploadé avec succès !
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {uploadedFile.name}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setUploadedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Supprimer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Glissez-déposez votre CV ici
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ou cliquez pour sélectionner un fichier
                </p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Sélectionner un fichier
              </Button>
              <div className="text-xs text-gray-500">
                <p>Formats acceptés : PDF, DOC, DOCX, TXT</p>
                <p>Taille maximale : 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Conseils */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            💡 Conseils pour un bon CV
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Utilisez un format PDF pour une meilleure compatibilité</li>
            <li>• Vérifiez que toutes les informations sont à jour</li>
            <li>• Assurez-vous que le fichier est lisible et bien formaté</li>
            <li>• Évitez les fichiers protégés par mot de passe</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVUpload;
