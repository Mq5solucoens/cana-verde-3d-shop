
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductFormPage from "@/components/admin/ProductFormPage";
import { useCategories } from "@/hooks/useCategories";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const { selectedCategory, categories } = useCategories();
  const navigate = useNavigate();

  // Se não houver categoria selecionada, redirecionar para página de admin
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      navigate("/admin");
    }
  }, [selectedCategory, categories, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Novo Produto</h1>
        
        {selectedCategory ? (
          <div className="mb-6">
            <h2 className="text-xl mb-2">
              Categoria: <span className="font-semibold">{selectedCategory.name}</span>
            </h2>
            <ProductFormPage categoryId={selectedCategory.id} />
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Selecione uma categoria na página de administração primeiro
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default NewProduct;
