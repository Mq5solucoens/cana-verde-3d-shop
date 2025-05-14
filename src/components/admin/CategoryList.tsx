
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types/admin";

interface CategoryListProps {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  onSelectCategory: (category: Category) => void;
}

const CategoryList = ({ categories, selectedCategory, loading, onSelectCategory }: CategoryListProps) => {
  return (
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
                onClick={() => onSelectCategory(category)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryList;
