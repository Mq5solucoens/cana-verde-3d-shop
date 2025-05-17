
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const ProductFormPage = ({ categoryId }: { categoryId: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    merchandise: "",
    image_url: null as string | null
  });

  const handleFieldChange = (field: string, value: any) => {
    setProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (url: string) => {
    setProduct(prev => ({
      ...prev,
      image_url: url
    }));
  };

  const handleSave = async () => {
    if (!product.name || product.price === undefined) {
      toast({
        title: "Erro",
        description: "Nome e preço são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Verificar se o usuário está autenticado
      const { data: session } = await supabase.auth.getSession();
      
      if (!session || !session.session) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para salvar produtos",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const { error } = await supabase
        .from("products")
        .insert({
          name: product.name,
          description: product.description || null,
          price: product.price,
          stock: product.stock || 0,
          merchandise: product.merchandise || null,
          image_url: product.image_url || null,
          category_id: categoryId,
        });
      
      if (error) {
        console.error("Erro ao criar produto:", error);
        throw error;
      }
      
      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso!",
      });

      // Redirecionar para a página admin
      navigate("/admin");
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o produto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Produto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto</Label>
          <Input 
            id="name" 
            value={product.name} 
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="Nome do produto"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea 
            id="description" 
            value={product.description} 
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="Descrição do produto"
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="merchandise">Mercadoria</Label>
          <Input 
            id="merchandise" 
            value={product.merchandise} 
            onChange={(e) => handleFieldChange("merchandise", e.target.value)}
            placeholder="Tipo de mercadoria"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input 
              id="price" 
              type="number"
              step="0.01"
              min="0"
              value={product.price} 
              onChange={(e) => handleFieldChange("price", parseFloat(e.target.value))}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Estoque</Label>
            <Input 
              id="stock" 
              type="number"
              min="0"
              value={product.stock} 
              onChange={(e) => handleFieldChange("stock", parseInt(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Imagem do Produto</Label>
          {product.image_url && (
            <div className="mt-2 mb-4">
              <img 
                src={product.image_url} 
                alt="Preview do produto" 
                className="w-full max-h-48 object-cover rounded-md"
              />
            </div>
          )}
          <ImageUpload 
            onUploadComplete={handleImageUpload}
            bucketName="product_images"
            folderPath="products"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/admin")}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Produto"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductFormPage;
