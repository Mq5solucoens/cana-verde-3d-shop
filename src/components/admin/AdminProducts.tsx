
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product, Category, ProductStatus } from "@/types/admin";
import ProductForm from "./ProductForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit2, Trash2, Package, Eye, EyeOff, Check, X } from "lucide-react";

const STATUS_CONFIG: Record<ProductStatus, { label: string; className: string }> = {
  ativo: { label: "Ativo", className: "bg-green-500/15 text-green-700 border-green-300" },
  inativo: { label: "Inativo", className: "bg-red-500/15 text-red-700 border-red-300" },
  rascunho: { label: "Rascunho", className: "bg-yellow-500/15 text-yellow-700 border-yellow-300" },
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editingPrice, setEditingPrice] = useState<{ id: number; value: string } | null>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("name");
      if (error) throw error;
      const mapped: Product[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image_url: p.image_url,
        stock: p.stock,
        category_id: p.category_id,
        merchandise: p.merchandise,
        status: (p.status as ProductStatus) || "ativo",
        category_name: p.categories?.name ?? "",
      }));
      setProducts(mapped);
    } catch {
      toast({ title: "Erro", description: "Não foi possível carregar os produtos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data as Category[]);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q);
    const matchCat = categoryFilter === "all" || String(p.category_id) === categoryFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const openAdd = () => {
    setEditingProduct(null);
    setNewProduct({ name: "", description: "", price: 0, stock: 0, status: "ativo" });
    setIsFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setNewProduct({});
    setIsFormOpen(true);
  };

  const handleFieldChange = (field: keyof Product, value: any) => {
    if (editingProduct) {
      setEditingProduct(prev => ({ ...prev!, [field]: value }));
    } else {
      setNewProduct(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update({
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price,
            stock: editingProduct.stock,
            merchandise: editingProduct.merchandise,
            image_url: editingProduct.image_url,
            category_id: editingProduct.category_id,
            status: editingProduct.status,
          })
          .eq("id", editingProduct.id);
        if (error) throw error;
        toast({ title: "Sucesso", description: "Produto atualizado!" });
      } else {
        if (!newProduct.name || newProduct.price === undefined || !newProduct.category_id) {
          toast({
            title: "Campos obrigatórios",
            description: "Nome, preço e categoria são obrigatórios.",
            variant: "destructive",
          });
          return;
        }
        const { error } = await supabase.from("products").insert({
          name: newProduct.name,
          description: newProduct.description || null,
          price: newProduct.price,
          stock: newProduct.stock || 0,
          merchandise: newProduct.merchandise || null,
          image_url: newProduct.image_url || null,
          category_id: newProduct.category_id,
          status: newProduct.status || "ativo",
        });
        if (error) throw error;
        toast({ title: "Sucesso", description: "Produto adicionado!" });
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Não foi possível salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Produto removido!" });
      setConfirmDelete(null);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      toast({ title: "Erro ao remover produto", variant: "destructive" });
    }
  };

  const toggleStatus = async (product: Product) => {
    const newStatus: ProductStatus = product.status === "ativo" ? "inativo" : "ativo";
    const { error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", product.id);
    if (!error) {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
    }
  };

  const saveInlinePrice = async (id: number) => {
    if (!editingPrice) return;
    const price = parseFloat(editingPrice.value);
    if (isNaN(price) || price < 0) {
      toast({ title: "Preço inválido", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("products").update({ price }).eq("id", id);
    if (error) {
      toast({ title: "Erro ao atualizar preço", variant: "destructive" });
      return;
    }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price } : p));
    setEditingPrice(null);
    toast({ title: "Preço atualizado!" });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const stats = {
    total: products.length,
    ativo: products.filter(p => p.status === "ativo").length,
    inativo: products.filter(p => p.status === "inativo").length,
    rascunho: products.filter(p => p.status === "rascunho").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Produtos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.total} produtos · {stats.ativo} ativos · {stats.inativo} inativos · {stats.rascunho} rascunhos
          </p>
        </div>
        <Button onClick={openAdd} className="bg-cana-verde hover:bg-cana-verde-600 shrink-0">
          <Plus size={16} className="mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Ativos", value: stats.ativo, color: "text-green-600" },
          { label: "Inativos", value: stats.inativo, color: "text-red-600" },
          { label: "Rascunhos", value: stats.rascunho, color: "text-yellow-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="rascunho">Rascunho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Nenhum produto encontrado</p>
          <p className="text-sm mt-1">
            {search || categoryFilter !== "all" || statusFilter !== "all"
              ? "Tente ajustar os filtros"
              : "Clique em \"Novo Produto\" para começar"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => {
            const statusCfg = STATUS_CONFIG[product.status] ?? STATUS_CONFIG.ativo;
            const isPriceEditing = editingPrice?.id === product.id;
            const isConfirmingDelete = confirmDelete === product.id;

            return (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-44 bg-muted">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={40} className="text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={`text-xs font-medium border ${statusCfg.className}`}>
                      {statusCfg.label}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Name + category */}
                  <div>
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">{product.name}</h3>
                    {product.category_name && (
                      <span className="text-xs text-muted-foreground">{product.category_name}</span>
                    )}
                  </div>

                  {/* Price — click to edit inline */}
                  <div className="flex items-center gap-1">
                    {isPriceEditing ? (
                      <>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editingPrice.value}
                          onChange={e => setEditingPrice({ id: product.id, value: e.target.value })}
                          className="h-7 text-sm"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === "Enter") saveInlinePrice(product.id);
                            if (e.key === "Escape") setEditingPrice(null);
                          }}
                        />
                        <Button
                          size="icon"
                          className="h-7 w-7 shrink-0 bg-cana-verde hover:bg-cana-verde-600"
                          onClick={() => saveInlinePrice(product.id)}
                        >
                          <Check size={12} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0"
                          onClick={() => setEditingPrice(null)}
                        >
                          <X size={12} />
                        </Button>
                      </>
                    ) : (
                      <button
                        className="text-cana-verde font-bold text-base hover:opacity-70 transition-opacity"
                        title="Clique para editar o preço"
                        onClick={() => setEditingPrice({ id: product.id, value: String(product.price) })}
                      >
                        {formatPrice(product.price)}
                      </button>
                    )}
                  </div>

                  {/* Stock */}
                  <p className="text-xs text-muted-foreground">
                    Estoque: <span className="font-medium text-foreground">{product.stock}</span> un.
                  </p>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs"
                      onClick={() => openEdit(product)}
                    >
                      <Edit2 size={12} className="mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      title={product.status === "ativo" ? "Desativar produto" : "Ativar produto"}
                      onClick={() => toggleStatus(product)}
                    >
                      {product.status === "ativo" ? (
                        <EyeOff size={14} className="text-muted-foreground" />
                      ) : (
                        <Eye size={14} className="text-green-600" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant={isConfirmingDelete ? "destructive" : "ghost"}
                      className="h-8 w-8"
                      title="Excluir produto"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  {/* Delete confirmation */}
                  {isConfirmingDelete && (
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 h-7 text-xs"
                        onClick={() => handleDelete(product.id)}
                      >
                        Confirmar exclusão
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => setConfirmDelete(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingProduct={editingProduct}
        newProduct={newProduct}
        onFieldChange={handleFieldChange}
        onImageUpload={url => handleFieldChange("image_url", url)}
        onSave={handleSave}
        categories={categories}
      />
    </div>
  );
};

export default AdminProducts;
