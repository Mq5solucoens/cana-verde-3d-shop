
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product, Category } from "@/types/admin";

export const useProducts = (selectedCategory: Category | null) => {
  const [products, setProducts] = useState<Product[]>([]);
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

  const handleAddProduct = () => {
    if (!selectedCategory) return;
    
    setEditingProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      merchandise: "",
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
            merchandise: editingProduct.merchandise,
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
            merchandise: newProduct.merchandise,
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

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory.id);
    }
  }, [selectedCategory]);

  return {
    products,
    productLoading,
    isProductSheetOpen,
    editingProduct,
    newProduct,
    setIsProductSheetOpen,
    handleProductImageUpload,
    handleProductFieldChange,
    handleAddProduct,
    handleEditProduct,
    handleSaveProduct,
    handleDeleteProduct
  };
};
