
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/ui/image-upload";
import { Product, Category } from "@/types/admin";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  newProduct: Partial<Product>;
  onFieldChange: (field: keyof Product, value: any) => void;
  onImageUpload: (url: string) => void;
  onSave: () => void;
  categories?: Category[];
}

const ProductForm = ({
  isOpen,
  onOpenChange,
  editingProduct,
  newProduct,
  onFieldChange,
  onImageUpload,
  onSave,
  categories = []
}: ProductFormProps) => {
  const current = editingProduct ?? newProduct;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
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
            <Label htmlFor="product-name">Nome do Produto *</Label>
            <Input
              id="product-name"
              value={current.name || ""}
              onChange={(e) => onFieldChange("name", e.target.value)}
              placeholder="Nome do produto"
            />
          </div>

          {categories.length > 0 && (
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select
                value={String(current.category_id ?? "")}
                onValueChange={(val) => onFieldChange("category_id", parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="product-description">Descrição</Label>
            <Textarea
              id="product-description"
              value={current.description || ""}
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder="Descrição do produto"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-merchandise">Mercadoria</Label>
            <Input
              id="product-merchandise"
              value={current.merchandise || ""}
              onChange={(e) => onFieldChange("merchandise", e.target.value)}
              placeholder="Tipo de mercadoria"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-price">Preço (R$) *</Label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                value={current.price ?? 0}
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
                value={current.stock ?? 0}
                onChange={(e) => onFieldChange("stock", parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={current.status || "ativo"}
              onValueChange={(val) => onFieldChange("status", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo — visível no catálogo</SelectItem>
                <SelectItem value="inativo">Inativo — oculto do catálogo</SelectItem>
                <SelectItem value="rascunho">Rascunho — em preparação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Imagem do Produto</Label>
            {current.image_url && (
              <div className="mt-2 mb-3">
                <img
                  src={current.image_url}
                  alt="Preview do produto"
                  className="w-full max-h-48 object-cover rounded-md"
                />
              </div>
            )}
            <Input
              placeholder="Cole a URL da imagem aqui..."
              value={current.image_url || ""}
              onChange={(e) => onImageUpload(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">ou faça upload:</p>
            <ImageUpload
              onUploadComplete={onImageUpload}
              bucketName="BALDENEW"
              folderPath="products"
              client={supabaseAdmin}
            />
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave} className="bg-cana-verde hover:bg-cana-verde-600">
            {editingProduct ? "Atualizar Produto" : "Adicionar Produto"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProductForm;
