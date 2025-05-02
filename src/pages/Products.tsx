import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Heart, Package, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ProductViewer from "@/components/ProductViewer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Sample product data (expanded with more products and images)
const products = [
  {
    id: 1,
    name: "Vaso Decorativo Moderno",
    category: "Decoração",
    price: 79.90,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    modelType: "cube"
  },
  {
    id: 2,
    name: "Engrenagem Mecânica",
    category: "Peças Mecânicas",
    price: 129.90,
    image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
    modelType: "cube"
  },
  {
    id: 3,
    name: "Colete Tático Modelado",
    category: "Itens Táticos",
    price: 249.90,
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    modelType: "cube"
  },
  {
    id: 4,
    name: "Kit de Decoração para Festa",
    category: "Festas",
    price: 99.90,
    image: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
    modelType: "cube"
  },
  {
    id: 5,
    name: "Boneco Articulado",
    category: "Brinquedos",
    price: 69.90,
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2",
    modelType: "cube"
  },
  {
    id: 7,
    name: "Vaso Estilo Rústico",
    category: "Decoração",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    modelType: "cube"
  },
  {
    id: 8,
    name: "Peça Industrial",
    category: "Peças Mecânicas",
    price: 149.90,
    image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
    modelType: "cube"
  },
  {
    id: 9,
    name: "Equipamento Militar",
    category: "Itens Táticos",
    price: 199.90,
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    modelType: "cube"
  },
  {
    id: 10,
    name: "Pacote de Decorações Festivas",
    category: "Festas",
    price: 79.90,
    image: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
    modelType: "cube"
  },
  {
    id: 11,
    name: "Figura de Ação Colecionável",
    category: "Brinquedos",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2",
    modelType: "cube"
  }
];

// Categories for filtering
const categories = [
  "Todos",
  "Decoração",
  "Peças Mecânicas",
  "Itens Táticos",
  "Festas",
  "Brinquedos"
];

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const toggleProductView = (productId: number) => {
    setSelectedProduct(selectedProduct === productId ? null : productId);
  };

  // Filter products by category
  const filteredProducts = selectedCategory === "Todos" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">
        Nossos <span className="gradient-text">Modelos 3D</span>
      </h1>

      <Tabs defaultValue="Todos" className="w-full mb-8">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-background/50 border">
            {categories.map((category) => (
              <TabsTrigger 
                key={category}
                value={category}
                onClick={() => setSelectedCategory(category)}
                className="data-[state=active]:bg-cana-verde data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="card-3d group h-full flex flex-col">
                  <CardContent className="p-0 relative">
                    <AspectRatio ratio={1/1} className="relative overflow-hidden bg-secondary/40">
                      {selectedProduct === product.id ? (
                        <ProductViewer modelType={product.modelType} />
                      ) : (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      )}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <Button 
                          variant="secondary" 
                          size="icon"
                          className="rounded-full bg-background/70 backdrop-blur-sm hover:bg-cana-verde hover:text-white"
                          onClick={() => toggleProductView(product.id)}
                        >
                          {selectedProduct === product.id ? <Eye size={18} /> : <Package size={18} />}
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="icon"
                          className="rounded-full bg-background/70 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          <Heart size={18} />
                        </Button>
                      </div>
                    </AspectRatio>
                    <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-background to-transparent">
                      <span className="inline-block text-xs px-2 py-1 bg-cana-verde/20 text-cana-verde rounded-md mb-1">
                        {product.category}
                      </span>
                      <h3 className="font-medium text-lg truncate text-foreground">{product.name}</h3>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center p-4 bg-card border-t border-border mt-auto">
                    <span className="text-xl font-bold text-foreground">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye size={16} className="mr-1" /> Detalhes
                      </Button>
                      <Button className="bg-cana-verde hover:bg-cana-verde-600" size="sm">
                        <ShoppingCart size={16} className="mr-1" /> Comprar
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Products;
