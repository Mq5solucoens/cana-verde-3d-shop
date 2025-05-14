
import { useEffect } from "react";
import { Category } from "@/types/admin";
import { useProductOperations } from "./products/useProductOperations";
import { useProductActions } from "./products/useProductActions";

export const useProducts = (selectedCategory: Category | null) => {
  const {
    products,
    productLoading,
    fetchProductsByCategory,
    handleDeleteProduct
  } = useProductOperations();

  const {
    editingProduct,
    newProduct,
    isProductSheetOpen,
    setIsProductSheetOpen,
    handleProductImageUpload,
    handleProductFieldChange,
    handleAddProduct,
    handleEditProduct,
    handleSaveProduct
  } = useProductActions(fetchProductsByCategory, selectedCategory?.id);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory.id);
    }
  }, [selectedCategory]);

  return {
    // Product data and loading state
    products,
    productLoading,
    
    // Product form state
    isProductSheetOpen,
    editingProduct,
    newProduct,
    
    // UI actions
    setIsProductSheetOpen,
    
    // Data manipulation handlers
    handleProductImageUpload,
    handleProductFieldChange,
    handleAddProduct,
    handleEditProduct,
    handleSaveProduct,
    handleDeleteProduct: (productId: number) => 
      handleDeleteProduct(productId, selectedCategory?.id)
  };
};
