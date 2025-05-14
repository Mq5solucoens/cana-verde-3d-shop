
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types/admin";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    selectedCategory,
    loading,
    fetchCategories,
    handleCategorySelect,
    handleCategoryFieldChange,
    handleCategoryImageUpload,
    handleSaveCategory
  };
};
