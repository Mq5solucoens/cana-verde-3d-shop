
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryList from "@/components/admin/CategoryList";
import CategoryForm from "@/components/admin/CategoryForm";
import ProductList from "@/components/admin/ProductList";
import ProductForm from "@/components/admin/ProductForm";
import { Category, Product } from "@/types/admin";

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

  const handleCategoryFieldChange = (field: keyof Category, value: string) => {
    if (!selectedCategory) return;
    
    setSelectedCategory({
      ...selectedCategory,
      [field]: value,
    });
  };

  const handleCategoryImageUpload = (url: string) => {
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

  const handleSaveCategory = async () => {
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
                <CategoryList
                  categories={categories}
                  selectedCategory={selectedCategory}
                  loading={loading}
                  onSelectCategory={handleCategorySelect}
                />
              </div>
              
              <div className="md:col-span-2">
                {selectedCategory ? (
                  <div className="space-y-6">
                    <CategoryForm
                      category={selectedCategory}
                      onFieldChange={handleCategoryFieldChange}
                      onImageUpload={handleCategoryImageUpload}
                      onSave={handleSaveCategory}
                    />
                    
                    <ProductList
                      products={products}
                      productLoading={productLoading}
                      onAddProduct={handleAddProduct}
                      onEditProduct={handleEditProduct}
                      onDeleteProduct={handleDeleteProduct}
                    />
                  </div>
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
              <CardContent>
                <p className="text-muted-foreground">
                  Por favor, selecione uma categoria na aba "Categorias" para gerenciar seus produtos.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <ProductForm
        isOpen={isProductSheetOpen}
        onOpenChange={setIsProductSheetOpen}
        editingProduct={editingProduct}
        newProduct={newProduct}
        onFieldChange={handleProductFieldChange}
        onImageUpload={handleProductImageUpload}
        onSave={handleSaveProduct}
      />
      
      <Footer />
    </div>
  );
};

export default AdminPage;
