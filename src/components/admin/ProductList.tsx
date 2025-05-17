
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, Trash } from "lucide-react";
import { Product } from "@/types/admin";

interface ProductListProps {
  products: Product[];
  productLoading: boolean;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
}

const ProductList = ({
  products,
  productLoading,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}: ProductListProps) => {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddClick = () => {
    // Opção 1: Usar o modal/sheet existente
    onAddProduct();
    
    // Opção 2: Redirecionar para página dedicada
    // navigate("/admin/novo-produto");
  };

  const handleAddNewProductPage = () => {
    // Redirecionar para a página dedicada
    navigate("/admin/novo-produto");
  };
  
  const handleDelete = (productId: number) => {
    if (confirmDelete === productId) {
      onDeleteProduct(productId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(productId);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Produtos</CardTitle>
        <div className="space-x-2">
          <Button onClick={handleAddNewProductPage} variant="outline">
            <Plus size={16} className="mr-1" />
            Nova Página
          </Button>
          <Button onClick={handleAddClick}>
            <Plus size={16} className="mr-1" />
            Novo Produto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {productLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => onEditProduct(product)}>
                        <Edit size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash size={16} />
                        {confirmDelete === product.id && " Confirmar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum produto encontrado nesta categoria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductList;
