
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Menu,
  X,
  Search,
  ShoppingCart,
  ShoppingBag
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-secondary/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="h-10 w-10 bg-cana-verde rounded-md flex items-center justify-center">
              <div className="h-6 w-6 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <h1 className="ml-2 font-bold text-xl md:text-2xl text-foreground">Cana<span className="text-cana-verde">3D</span></h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-cana-verde transition-colors">Início</Link>
            <Link to="/produtos" className="text-foreground hover:text-cana-verde transition-colors">Produtos</Link>
            <Link to="/categorias" className="text-foreground hover:text-cana-verde transition-colors">Categorias</Link>
            <Link to="/compras" className="text-foreground hover:text-cana-verde transition-colors">Compras</Link>
            <Link to="/sobre" className="text-foreground hover:text-cana-verde transition-colors">Sobre</Link>
            <Link to="/contato" className="text-foreground hover:text-cana-verde transition-colors">Contato</Link>
          </div>
          
          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search size={20} />
            </Button>
            <Link to="/compras">
              <Button variant="ghost" size="icon">
                <ShoppingBag size={20} />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-cana-verde text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
            <Button className="bg-cana-verde hover:bg-cana-verde-600 text-white">
              Entrar
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-border mt-3">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-foreground py-2 hover:text-cana-verde">Início</Link>
              <Link to="/produtos" className="text-foreground py-2 hover:text-cana-verde">Produtos</Link>
              <Link to="/categorias" className="text-foreground py-2 hover:text-cana-verde">Categorias</Link>
              <Link to="/compras" className="text-foreground py-2 hover:text-cana-verde">Compras</Link>
              <Link to="/sobre" className="text-foreground py-2 hover:text-cana-verde">Sobre</Link>
              <Link to="/contato" className="text-foreground py-2 hover:text-cana-verde">Contato</Link>
              <div className="flex space-x-3 pt-2">
                <Button variant="ghost" size="icon">
                  <Search size={20} />
                </Button>
                <Link to="/compras">
                  <Button variant="ghost" size="icon">
                    <ShoppingBag size={20} />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart size={20} />
                  <span className="absolute -top-1 -right-1 bg-cana-verde text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </Button>
                <Button className="bg-cana-verde hover:bg-cana-verde-600 text-white">
                  Entrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
