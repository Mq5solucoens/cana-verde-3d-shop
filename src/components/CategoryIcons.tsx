
import { 
  Diamond, 
  Wrench, 
  Package, 
  PartyPopper, 
  ToyBrick
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Decoração",
    icon: Diamond,
    href: "/categorias/decoracao"
  },
  {
    name: "Peças Mecânicas",
    icon: Wrench,
    href: "/categorias/pecas-mecanicas"
  },
  {
    name: "Itens Táticos",
    icon: Package,
    href: "/categorias/taticos"
  },
  {
    name: "Festas",
    icon: PartyPopper,
    href: "/categorias/festas"
  },
  {
    name: "Brinquedos",
    icon: ToyBrick,
    href: "/categorias/brinquedos"
  }
];

const CategoryIcons = () => {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-12">
          Navegue por <span className="gradient-text">Categoria</span>
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              to={category.href} 
              className="flex flex-col items-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-card flex items-center justify-center 
                            mb-3 shadow-md border border-border group-hover:border-cana-verde 
                            transition-all duration-300 group-hover:shadow-cana-verde/30">
                <category.icon 
                  size={32} 
                  className="text-cana-verde group-hover:scale-110 transition-transform" 
                />
              </div>
              <span className="text-center text-foreground group-hover:text-cana-verde transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryIcons;
