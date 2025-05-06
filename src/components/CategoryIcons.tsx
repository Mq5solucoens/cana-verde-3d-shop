
import { 
  Diamond, 
  Wrench, 
  Package, 
  PartyPopper, 
  ToyBrick,
  Gift,
  PackageOpen,
  icons
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string;
}

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

const CategoryIcons = () => {
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
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-12">
            Navegue por <span className="gradient-text">Categoria</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="w-20 h-20 rounded-2xl bg-card mb-3"></div>
                <div className="h-4 w-20 bg-card rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-12">
          Navegue por <span className="gradient-text">Categoria</span>
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {categories.map((category) => {
            const IconComponent = iconMapping[category.icon] || Package;
            
            return (
              <Link 
                key={category.id} 
                to={`/categorias/${category.slug}`} 
                className="flex flex-col items-center group"
              >
                <div className="w-20 h-20 rounded-2xl bg-card flex items-center justify-center 
                              mb-3 shadow-md border border-border group-hover:border-cana-verde 
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
                <span className="text-center text-foreground group-hover:text-cana-verde transition-colors">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryIcons;
