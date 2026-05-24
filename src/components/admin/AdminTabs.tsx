
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/admin";
import CategoryManagement from "./CategoryManagement";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import { useProductOperations } from "@/hooks/products/useProductOperations";
import { useProductActions } from "@/hooks/products/useProductActions";

interface AdminTabsProps {
  selectedCategory: Category | null;
}

const AdminTabs = ({ selectedCategory }: AdminTabsProps) => {
  const { products, productLoading, fetchAllProducts, handleDeleteProduct } = useProductOperations();

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

  useEffect(() => {
    fetchAllProducts();
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
          onAddProduct={handleAddProduct}
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
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
