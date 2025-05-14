
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash } from "lucide-react";
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
  return (
    <div className="space-y-2 mt-8">
      <div className="flex items-center justify-between">
        <Label>Produtos</Label>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onAddProduct}
          className="flex items-center gap-1"
        >
          <Plus size={16} /> Novo Produto
        </Button>
      </div>
      
      {productLoading ? (
        <p>Carregando produtos...</p>
      ) : products.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Mercadoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.merchandise || "Não especificado"}</TableCell>
                  <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEditProduct(product)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmar exclusão</DialogTitle>
                            <DialogDescription>
                              Tem certeza que deseja excluir o produto "{product.name}"?
                              Esta ação não pode ser desfeita.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button 
                              variant="destructive" 
                              onClick={() => onDeleteProduct(product.id)}
                            >
                              Excluir
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          Nenhum produto cadastrado nesta categoria.
        </p>
      )}
    </div>
  );
};

export default ProductList;
