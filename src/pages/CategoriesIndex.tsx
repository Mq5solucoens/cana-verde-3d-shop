
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Diamond, 
  Wrench, 
  Package, 
  PartyPopper, 
  ToyBrick,
  Gift,
  PackageOpen,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Mapping for icon names to components
const iconMapping: Record<string, any> = {
  Diamond,
  Wrench,
  Package,
  PartyPopper,
  ToyBrick,
  Gift,
  PackageOpen
};

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string;
}

const CategoriesIndex = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-2">
          Nossas <span className="gradient-text">Categorias</span>
        </h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Navegue por nossa seleção de modelos 3D divididos por categorias para encontrar exatamente o que você precisa
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(7)].map((_, i) => (
            <Card key={i} className="h-full card-3d animate-pulse">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-secondary mb-4"></div>
                <div className="h-6 w-32 bg-secondary rounded mb-2"></div>
                <div className="h-4 w-48 bg-secondary rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">
        Nossas <span className="gradient-text">Categorias</span>
      </h1>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        Navegue por nossa seleção de impressões 3D divididas por categorias para encontrar exatamente o que você precisa
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = iconMapping[category.icon] || Package;
          
          return (
            <Link 
              key={category.id}
              to={`/categorias/${category.slug}`}
              className="group"
            >
              <Card className="h-full card-3d transform transition-all duration-200 hover:translate-y-[-5px]">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center 
                                mb-4 shadow-md border border-border group-hover:border-cana-verde 
                                transition-all duration-300 group-hover:shadow-cana-verde/30
                                overflow-hidden relative">
                    {category.image_url ? (
                      <img 
                        src={category.image_url} 
                        alt={category.name}
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    ) : (
                      <IconComponent 
                        size={32} 
                        className="text-cana-verde group-hover:scale-110 transition-transform" 
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cana-verde transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesIndex;
