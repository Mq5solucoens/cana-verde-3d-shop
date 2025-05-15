
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types/admin";

export const useCategoryActions = (fetchCategories: () => Promise<void>) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { toast } = useToast();

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

  return {
    selectedCategory,
    handleCategorySelect,
    handleCategoryFieldChange,
    handleCategoryImageUpload,
    handleSaveCategory
  };
};
