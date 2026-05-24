
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/admin";
import CategoryManagement from "./CategoryManagement";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import { useProductOperations } from "@/hooks/products/useProductOperations";
import { useProductActions } from "@/hooks/products/useProductActions";
import { supabase } from "@/integrations/supabase/client";

interface AdminTabsProps {
  selectedCategory: Category | null;
}

const AdminTabs = ({ selectedCategory }: AdminTabsProps) => {
  const { products, productLoading, fetchAllProducts, handleDeleteProduct } = useProductOperations();
  const [categories, setCategories] = useState<Category[]>([]);

  const refreshAll = async (_?: number) => { await fetchAllProducts(); };

  const {
    editingProduct,
    newProduct,
    isProductSheetOpen,
    setIsProductSheetOpen,
    handleProductImageUpload,
    handleProductFieldChange,
    handleAddProduct,
    handleEditProduct,
    handleSaveProduct,
  } = useProductActions(refreshAll, undefined);

  const openNewProduct = () => {
    setIsProductSheetOpen(true);
  };

  useEffect(() => {
    fetchAllProducts();
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  return (
    <Tabs defaultValue="categories">
      <TabsList>
        <TabsTrigger value="categories">Categorias</TabsTrigger>
        <TabsTrigger value="products">Produtos</TabsTrigger>
      </TabsList>

      <TabsContent value="categories" className="mt-6">
        <CategoryManagement selectedCategory={selectedCategory} />
      </TabsContent>

      <TabsContent value="products" className="mt-6">
        <ProductList
          products={products}
          productLoading={productLoading}
          onAddProduct={openNewProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={(id) => handleDeleteProduct(id, undefined)}
        />
        <ProductForm
          isOpen={isProductSheetOpen}
          onOpenChange={setIsProductSheetOpen}
          editingProduct={editingProduct}
          newProduct={newProduct}
          onFieldChange={handleProductFieldChange}
          onImageUpload={handleProductImageUpload}
          onSave={handleSaveProduct}
          categories={categories}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
