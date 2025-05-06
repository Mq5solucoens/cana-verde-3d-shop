
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "@/components/ui/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string;
}

const AdminPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleFieldChange = (field: keyof Category, value: string) => {
    if (!selectedCategory) return;
    
    setSelectedCategory({
      ...selectedCategory,
      [field]: value,
    });
  };

  const handleImageUpload = (url: string) => {
    if (!selectedCategory) return;
    
    setSelectedCategory({
      ...selectedCategory,
      image_url: url,
    });
  };

  const handleSave = async () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Administração de Categorias</h1>
        
        <Tabs defaultValue="categories">
          <TabsList>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="products" disabled>Produtos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Categorias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p>Carregando categorias...</p>
                    ) : (
                      <ul className="space-y-2">
                        {categories.map((category) => (
                          <li 
                            key={category.id}
                            className={`p-2 rounded-md cursor-pointer hover:bg-secondary ${
                              selectedCategory?.id === category.id ? "bg-secondary" : ""
                            }`}
                            onClick={() => handleCategorySelect(category)}
                          >
                            {category.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                {selectedCategory ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Editar Categoria</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input 
                          id="name" 
                          value={selectedCategory.name} 
                          onChange={(e) => handleFieldChange("name", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input 
                          id="description" 
                          value={selectedCategory.description || ""} 
                          onChange={(e) => handleFieldChange("description", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="icon">Ícone</Label>
                        <Input 
                          id="icon" 
                          value={selectedCategory.icon} 
                          readOnly
                        />
                        <p className="text-xs text-muted-foreground">
                          O ícone não pode ser alterado diretamente.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Imagem da Categoria</Label>
                        {selectedCategory.image_url && (
                          <div className="mt-2 mb-4">
                            <img 
                              src={selectedCategory.image_url} 
                              alt={selectedCategory.name} 
                              className="w-full max-h-48 object-cover rounded-md"
                            />
                          </div>
                        )}
                        <ImageUpload 
                          onUploadComplete={handleImageUpload}
                          bucketName="category_images"
                          folderPath="thumbnails"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button onClick={handleSave}>Salvar Alterações</Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      Selecione uma categoria para editar
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
