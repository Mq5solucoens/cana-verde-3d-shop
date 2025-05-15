
import { useCategoryOperations } from "./categories/useCategoryOperations";
import { useCategoryActions } from "./categories/useCategoryActions";
import { Category } from "@/types/admin";

export const useCategories = () => {
  const {
    categories,
    loading,
    fetchCategories
  } = useCategoryOperations();

  const {
    selectedCategory,
    handleCategorySelect,
    handleCategoryFieldChange,
    handleCategoryImageUpload,
    handleSaveCategory
  } = useCategoryActions(fetchCategories);

  return {
    // Category data and loading state
    categories,
    selectedCategory,
    loading,
    
    // Operations
    fetchCategories,
    
    // Category actions
    handleCategorySelect,
    handleCategoryFieldChange,
    handleCategoryImageUpload,
    handleSaveCategory
  };
};
