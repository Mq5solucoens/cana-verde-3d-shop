
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ui/image-upload";
import { Product } from "@/types/admin";

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  newProduct: Partial<Product>;
  onFieldChange: (field: keyof Product, value: any) => void;
  onImageUpload: (url: string) => void;
  onSave: () => void;
}

const ProductForm = ({
  isOpen,
  onOpenChange,
  editingProduct,
  newProduct,
  onFieldChange,
  onImageUpload,
  onSave
}: ProductFormProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</SheetTitle>
          <SheetDescription>
            {editingProduct 
              ? "Atualize as informações do produto abaixo." 
              : "Preencha as informações do produto abaixo."}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Nome do Produto</Label>
            <Input 
              id="product-name" 
              value={editingProduct ? editingProduct.name : newProduct.name || ""} 
              onChange={(e) => onFieldChange("name", e.target.value)}
              placeholder="Nome do produto"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product-description">Descrição</Label>
            <Textarea 
              id="product-description" 
              value={editingProduct ? editingProduct.description || "" : newProduct.description || ""} 
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder="Descrição do produto"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product-merchandise">Mercadoria</Label>
            <Input 
              id="product-merchandise" 
              value={editingProduct ? editingProduct.merchandise || "" : newProduct.merchandise || ""} 
              onChange={(e) => onFieldChange("merchandise", e.target.value)}
              placeholder="Tipo de mercadoria"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-price">Preço (R$)</Label>
              <Input 
                id="product-price" 
                type="number"
                step="0.01"
                min="0"
                value={editingProduct ? editingProduct.price : newProduct.price || 0} 
                onChange={(e) => onFieldChange("price", parseFloat(e.target.value))}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-stock">Estoque</Label>
              <Input 
                id="product-stock" 
                type="number"
                min="0"
                value={editingProduct ? editingProduct.stock : newProduct.stock || 0} 
                onChange={(e) => onFieldChange("stock", parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Imagem do Produto</Label>
            {(editingProduct?.image_url || newProduct.image_url) && (
              <div className="mt-2 mb-4">
                <img 
                  src={editingProduct ? editingProduct.image_url || "" : newProduct.image_url || ""} 
                  alt="Preview do produto" 
                  className="w-full max-h-48 object-cover rounded-md"
                />
              </div>
            )}
            <ImageUpload 
              onUploadComplete={onImageUpload}
              bucketName="product_images"
              folderPath="products"
            />
          </div>
        </div>
        
        <SheetFooter className="mt-6">
          <Button onClick={onSave}>
            {editingProduct ? "Atualizar Produto" : "Adicionar Produto"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProductForm;
