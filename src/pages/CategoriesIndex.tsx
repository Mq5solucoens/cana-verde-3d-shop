
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Diamond, 
  Wrench, 
  Package, 
  PartyPopper, 
  ToyBrick,
  Gift,  // Added for Brindes
  PackageOpen  // Added for Kits
} from "lucide-react";

const categories = [
  {
    name: "Decoração",
    icon: Diamond,
    slug: "decoracao",
    description: "Itens decorativos para sua casa e escritório"
  },
  {
    name: "Peças Mecânicas",
    icon: Wrench,
    slug: "pecas-mecanicas",
    description: "Peças de precisão para projetos técnicos"
  },
  {
    name: "Itens Táticos",
    icon: Package,
    slug: "taticos",
    description: "Equipamentos táticos para uso em simulações"
  },
  {
    name: "Festas",
    icon: PartyPopper,
    slug: "festas",
    description: "Acessórios e decorações para suas celebrações"
  },
  {
    name: "Brindes",  // New category
    icon: Gift,
    slug: "brindes",
    description: "Itens personalizáveis para presentes e eventos corporativos"
  },
  {
    name: "Kits",  // New category
    icon: PackageOpen,
    slug: "kits",
    description: "Conjuntos completos para diversos tipos de projetos"
  },
  {
    name: "Brinquedos",
    icon: ToyBrick,
    slug: "brinquedos",
    description: "Modelos divertidos para impressão"
  }
];

const CategoriesIndex = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">
        Nossas <span className="gradient-text">Categorias</span>
      </h1>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        Navegue por nossa seleção de modelos 3D divididos por categorias para encontrar exatamente o que você precisa
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.name}
            to={`/categorias/${category.slug}`}
            className="group"
          >
            <Card className="h-full card-3d transform transition-all duration-200 hover:translate-y-[-5px]">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center 
                              mb-4 shadow-md border border-border group-hover:border-cana-verde 
                              transition-all duration-300 group-hover:shadow-cana-verde/30">
                  <category.icon 
                    size={32} 
                    className="text-cana-verde group-hover:scale-110 transition-transform" 
                  />
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
        ))}
      </div>
    </div>
  );
};

export default CategoriesIndex;
