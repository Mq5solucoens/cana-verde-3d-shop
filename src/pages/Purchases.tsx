
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, Eye, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample purchase data
const purchases = [
  {
    id: "PED-001",
    date: "2024-04-28",
    items: [
      { id: 1, name: "Vaso Decorativo Moderno", price: 79.90 }
    ],
    total: 79.90,
    status: "completed",
    downloadAvailable: true
  },
  {
    id: "PED-002",
    date: "2024-04-15",
    items: [
      { id: 2, name: "Engrenagem Mecânica", price: 129.90 },
      { id: 4, name: "Kit de Decoração para Festa", price: 99.90 }
    ],
    total: 229.80,
    status: "completed",
    downloadAvailable: true
  },
  {
    id: "PED-003",
    date: "2024-03-22",
    items: [
      { id: 3, name: "Colete Tático Modelado", price: 249.90 }
    ],
    total: 249.90,
    status: "processing",
    downloadAvailable: false
  }
];

const Purchases = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredPurchases = activeTab === "all" 
    ? purchases 
    : purchases.filter(purchase => purchase.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Concluído</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Processando</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Minhas Compras</h1>
            <p className="text-muted-foreground">Gerencie suas compras e downloads de modelos 3D</p>
          </div>
          <ShoppingBag size={32} className="text-cana-verde" />
        </div>
        
        <Tabs 
          defaultValue="all" 
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
            <TabsTrigger value="processing">Em Processamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredPurchases.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.id}</TableCell>
                        <TableCell>{new Date(purchase.date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          {purchase.items.map((item, index) => (
                            <div key={item.id} className="text-sm">
                              {item.name}
                              {index < purchase.items.length - 1 && <span className="text-muted-foreground">, </span>}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>R$ {purchase.total.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Eye size={16} className="mr-1" /> Detalhes
                            </Button>
                            {purchase.downloadAvailable && (
                              <Button size="sm" className="bg-cana-verde hover:bg-cana-verde-600">
                                <Download size={16} className="mr-1" /> Baixar
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-md bg-muted/20">
                <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma compra encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  Não encontramos compras com o status selecionado.
                </p>
                <Button className="bg-cana-verde hover:bg-cana-verde-600">
                  Ver produtos
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Purchases;
