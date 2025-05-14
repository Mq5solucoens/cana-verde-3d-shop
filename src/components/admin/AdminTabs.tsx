
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/types/admin";
import CategoryManagement from "./CategoryManagement";

interface AdminTabsProps {
  selectedCategory: Category | null;
}

const AdminTabs = ({ selectedCategory }: AdminTabsProps) => {
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
        <Card>
          <CardContent>
            <p className="text-muted-foreground">
              Por favor, selecione uma categoria na aba "Categorias" para gerenciar seus produtos.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
