
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "@/components/ui/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash, PackageOpen } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  category_id: number;
}

const AdminPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory.id);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      
      setCategories(data || []);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryId: number) => {
    setProductLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryId)
        .order("name");

      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos desta categoria",
        variant: "destructive",
      });
    } finally {
      setProductLoading(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory({...category});
  };

  const handleFieldChange = (field: keyof Category, value: string) => {
    if (!selectedCategory) return;
    
    setSelectedCategory({
      ...selectedCategory,
      [field]: value,
    });
  };

  const handleImageUpload = (url: string) => {
    if (!selectedCategory) return;
    
    setSelectedCategory({
      ...selectedCategory,
      image_url: url,
    });
  };

  const handleProductImageUpload = (url: string) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        image_url: url,
      });
    } else {
      setNewProduct({
        ...newProduct,
        image_url: url,
      });
    }
  };

  const handleProductFieldChange = (field: keyof Product, value: any) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [field]: value,
      });
    } else {
      setNewProduct({
        ...newProduct,
        [field]: value,
      });
    }
  };

  const handleSave = async () => {
    if (!selectedCategory) return;
    
    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: selectedCategory.name,
          description: selectedCategory.description,
          image_url: selectedCategory.image_url,
        })
        .eq("id", selectedCategory.id);

      if (error) throw error;
      
      fetchCategories();
      
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a categoria",
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = () => {
    if (!selectedCategory) return;
    
    setEditingProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category_id: selectedCategory.id,
    });
    setIsProductSheetOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({...product});
    setNewProduct({});
    setIsProductSheetOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!selectedCategory) return;
    
    try {
      if (editingProduct) {
        // Atualizar produto existente
        const { error } = await supabase
          .from("products")
          .update({
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price,
            stock: editingProduct.stock,
            image_url: editingProduct.image_url,
          })
          .eq("id", editingProduct.id);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        });
      } else {
        // Criar novo produto
        const { error } = await supabase
          .from("products")
          .insert({
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            stock: newProduct.stock,
            image_url: newProduct.image_url,
            category_id: selectedCategory.id,
          });
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Produto adicionado com sucesso!",
        });
      }
      
      // Fechar o sheet e atualizar a lista
      setIsProductSheetOpen(false);
      fetchProductsByCategory(selectedCategory.id);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!selectedCategory) return;
    
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      
      if (error) throw error;
      
      // Atualizar a lista de produtos
      fetchProductsByCategory(selectedCategory.id);
      
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Administração</h1>
        
        <Tabs defaultValue="categories">
          <TabsList>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Categorias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p>Carregando categorias...</p>
                    ) : (
                      <ul className="space-y-2">
                        {categories.map((category) => (
                          <li 
                            key={category.id}
                            className={`p-2 rounded-md cursor-pointer hover:bg-secondary ${
                              selectedCategory?.id === category.id ? "bg-secondary" : ""
                            }`}
                            onClick={() => handleCategorySelect(category)}
                          >
                            {category.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                {selectedCategory ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Editar Categoria</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input 
                          id="name" 
                          value={selectedCategory.name} 
                          onChange={(e) => handleFieldChange("name", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input 
                          id="description" 
                          value={selectedCategory.description || ""} 
                          onChange={(e) => handleFieldChange("description", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="icon">Ícone</Label>
                        <Input 
                          id="icon" 
                          value={selectedCategory.icon} 
                          readOnly
                        />
                        <p className="text-xs text-muted-foreground">
                          O ícone não pode ser alterado diretamente.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Imagem da Categoria</Label>
                        {selectedCategory.image_url && (
                          <div className="mt-2 mb-4">
                            <img 
                              src={selectedCategory.image_url} 
                              alt={selectedCategory.name} 
                              className="w-full max-h-48 object-cover rounded-md"
                            />
                          </div>
                        )}
                        <ImageUpload 
                          onUploadComplete={handleImageUpload}
                          bucketName="category_images"
                          folderPath="thumbnails"
                        />
                      </div>

                      <div className="space-y-2 mt-8">
                        <div className="flex items-center justify-between">
                          <Label>Produtos</Label>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleAddProduct}
                            className="flex items-center gap-1"
                          >
                            <Plus size={16} /> Novo Produto
                          </Button>
                        </div>
                        
                        {productLoading ? (
                          <p>Carregando produtos...</p>
                        ) : products.length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nome</TableHead>
                                  <TableHead>Preço</TableHead>
                                  <TableHead>Estoque</TableHead>
                                  <TableHead className="w-[100px]">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {products.map((product) => (
                                  <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => handleEditProduct(product)}
                                        >
                                          <Pencil size={16} />
                                        </Button>
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                              <Trash size={16} />
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Confirmar exclusão</DialogTitle>
                                              <DialogDescription>
                                                Tem certeza que deseja excluir o produto "{product.name}"?
                                                Esta ação não pode ser desfeita.
                                              </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                              <Button 
                                                variant="destructive" 
                                                onClick={() => handleDeleteProduct(product.id)}
                                              >
                                                Excluir
                                              </Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            Nenhum produto cadastrado nesta categoria.
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button onClick={handleSave}>Salvar Categoria</Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      Selecione uma categoria para editar
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Por favor, selecione uma categoria na aba "Categorias" para gerenciar seus produtos.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Sheet open={isProductSheetOpen} onOpenChange={setIsProductSheetOpen}>
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
                onChange={(e) => handleProductFieldChange("name", e.target.value)}
                placeholder="Nome do produto"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-description">Descrição</Label>
              <Textarea 
                id="product-description" 
                value={editingProduct ? editingProduct.description || "" : newProduct.description || ""} 
                onChange={(e) => handleProductFieldChange("description", e.target.value)}
                placeholder="Descrição do produto"
                rows={4}
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
                  onChange={(e) => handleProductFieldChange("price", parseFloat(e.target.value))}
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
                  onChange={(e) => handleProductFieldChange("stock", parseInt(e.target.value))}
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
                onUploadComplete={handleProductImageUpload}
                bucketName="product_images"
                folderPath="products"
              />
            </div>
          </div>
          
          <SheetFooter className="mt-6">
            <Button onClick={handleSaveProduct}>
              {editingProduct ? "Atualizar Produto" : "Adicionar Produto"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
