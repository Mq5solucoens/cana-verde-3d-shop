
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CategoryListProps {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  onSelectCategory: (category: Category) => void;
}

const CategoryList = ({ categories, selectedCategory, loading, onSelectCategory }: CategoryListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Input
            placeholder="Buscar categorias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        
        {loading ? (
          <p>Carregando categorias...</p>
        ) : filteredCategories.length > 0 ? (
          <ul className="space-y-2">
            {filteredCategories.map((category) => (
              <li 
                key={category.id}
                className={`p-2 rounded-md cursor-pointer hover:bg-secondary ${
                  selectedCategory?.id === category.id ? "bg-secondary" : ""
                }`}
                onClick={() => onSelectCategory(category)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-2">Nenhuma categoria encontrada</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryList;
