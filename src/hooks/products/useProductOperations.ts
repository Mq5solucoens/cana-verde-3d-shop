
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/admin";

export const useProductOperations = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(false);
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

  const handleDeleteProduct = async (productId: number, categoryId?: number) => {
    if (!categoryId) return;
    
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      
      if (error) throw error;
      
      // Atualizar a lista de produtos
      fetchProductsByCategory(categoryId);
      
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

  return {
    products,
    productLoading,
    fetchProductsByCategory,
    handleDeleteProduct
  };
};
