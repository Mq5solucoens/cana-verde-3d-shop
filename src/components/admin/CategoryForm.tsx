
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ui/image-upload";
import { Category } from "@/types/admin";

interface CategoryFormProps {
  category: Category;
  onFieldChange: (field: keyof Category, value: string) => void;
  onImageUpload: (url: string) => void;
  onSave: () => void;
}

const CategoryForm = ({ category, onFieldChange, onImageUpload, onSave }: CategoryFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Categoria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input 
            id="name" 
            value={category.name} 
            onChange={(e) => onFieldChange("name", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Input 
            id="description" 
            value={category.description || ""} 
            onChange={(e) => onFieldChange("description", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="icon">Ícone</Label>
          <Input 
            id="icon" 
            value={category.icon} 
            readOnly
          />
          <p className="text-xs text-muted-foreground">
            O ícone não pode ser alterado diretamente.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Imagem da Categoria</Label>
          {category.image_url && (
            <div className="mt-2 mb-4">
              <img 
                src={category.image_url} 
                alt={category.name} 
                className="w-full max-h-48 object-cover rounded-md"
              />
            </div>
          )}
          <ImageUpload 
            onUploadComplete={onImageUpload}
            bucketName="category_images"
            folderPath="thumbnails"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onSave}>Salvar Categoria</Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryForm;
