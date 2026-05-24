
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/admin";
import CategoryManagement from "./CategoryManagement";
import AdminProducts from "./AdminProducts";

interface AdminTabsProps {
  selectedCategory: Category | null;
}

const AdminTabs = ({ selectedCategory }: AdminTabsProps) => {
  return (
    <Tabs defaultValue="products">
      <TabsList>
        <TabsTrigger value="products">Produtos</TabsTrigger>
        <TabsTrigger value="categories">Categorias</TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="mt-6">
        <AdminProducts />
      </TabsContent>

      <TabsContent value="categories" className="mt-6">
        <CategoryManagement selectedCategory={selectedCategory} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
