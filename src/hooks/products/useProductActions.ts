
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/admin";

export const useProductActions = (
  fetchProductsByCategory: (categoryId: number) => Promise<void>,
  selectedCategoryId?: number
) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
  });
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const { toast } = useToast();

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
    if (!selectedCategoryId) return;
    
    setEditingProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      merchandise: "",
      category_id: selectedCategoryId,
    });
    setIsProductSheetOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({...product});
    setNewProduct({});
    setIsProductSheetOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!selectedCategoryId) return;
    
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
            category_id: selectedCategoryId,
          });
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Produto adicionado com sucesso!",
        });
      }
      
      // Fechar o sheet e atualizar a lista
      setIsProductSheetOpen(false);
      if (selectedCategoryId) {
        fetchProductsByCategory(selectedCategoryId);
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto",
        variant: "destructive",
      });
    }
  };

  return {
    editingProduct,
    newProduct,
    isProductSheetOpen,
    setIsProductSheetOpen,
    handleProductImageUpload,
    handleProductFieldChange,
    handleAddProduct,
    handleEditProduct,
    handleSaveProduct
  };
};
