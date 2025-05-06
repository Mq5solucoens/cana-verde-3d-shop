
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Purchases from "./pages/Purchases";
import NotFound from "./pages/NotFound";
import Categories from "./pages/Categories";
import CategoriesIndex from "./pages/CategoriesIndex";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthGuard from "./components/AuthGuard";
import BrindesPage from "./pages/categories/Brindes";
import KitsPage from "./pages/categories/Kits";
import Admin from "./pages/Admin";
import { useState } from "react";

function App() {
  // Use useState to create the QueryClient
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/compras" element={<AuthGuard><Purchases /></AuthGuard>} />
            <Route path="/categorias" element={<CategoriesIndex />} />
            <Route path="/categorias/:slug" element={<Categories />} />
            <Route path="/categorias/brindes" element={<BrindesPage />} />
            <Route path="/categorias/kits" element={<KitsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Register />} />
            <Route path="/admin" element={<AuthGuard><Admin /></AuthGuard>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
