
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  bucketName: string;
  folderPath?: string;
  className?: string;
}

const ImageUpload = ({ onUploadComplete, bucketName, folderPath = "", className }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo do arquivo é 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      // Return the URL
      onUploadComplete(publicUrlData.publicUrl);
      
      toast({
        title: "Upload concluído",
        description: "A imagem foi carregada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível carregar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      <label htmlFor="image-upload" className="cursor-pointer">
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg hover:border-cana-verde transition-colors">
          <Upload size={24} className="text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            {isUploading ? "Enviando..." : "Clique para enviar imagem"}
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (max. 5MB)</p>
          
          {isUploading && (
            <div className="w-full mt-4 bg-secondary rounded-full h-2.5">
              <div className="bg-cana-verde h-2.5 rounded-full w-full animate-pulse"></div>
            </div>
          )}
        </div>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default ImageUpload;
