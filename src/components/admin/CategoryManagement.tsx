
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/types/admin";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

interface CategoryManagementProps {
  selectedCategory: Category | null;
}

const CategoryManagement = ({ selectedCategory: initialSelectedCategory }: CategoryManagementProps) => {
  const {
    categories,
    selectedCategory,
    loading,
    handleCategorySelect,
    handleCategoryFieldChange,
    handleCategoryImageUpload,
    handleSaveCategory
  } = useCategories();

  const {
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
  } = useProducts(selectedCategory);

  return (
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

      <ProductForm
        isOpen={isProductSheetOpen}
        onOpenChange={setIsProductSheetOpen}
        editingProduct={editingProduct}
        newProduct={newProduct}
        onFieldChange={handleProductFieldChange}
        onImageUpload={handleProductImageUpload}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default CategoryManagement;
