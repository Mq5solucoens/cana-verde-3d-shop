
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Menu,
  X,
  Search,
  ShoppingCart,
  ShoppingBag,
  LogOut,
  User
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated");
      const email = localStorage.getItem("userEmail");
      
      setIsLoggedIn(auth === "true");
      setUserEmail(email || "");
    };
    
    checkAuth();
    // Check auth status when component mounts and when localStorage changes
    window.addEventListener("storage", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    toast({
      title: "Sessão encerrada",
      description: "Você saiu da sua conta com sucesso."
    });
    navigate("/");
  };

  // Extract username/email for display
  const displayName = () => {
    const name = localStorage.getItem("userName");
    if (name) return name;
    if (userEmail) {
      const parts = userEmail.split('@');
      return parts[0];
    }
    return "Usuário";
  };

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
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <User size={16} />
                  <span className="max-w-[100px] truncate">{displayName()}</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-cana-verde hover:bg-cana-verde-600 text-white">
                  Entrar
                </Button>
              </Link>
            )}
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
                
                {isLoggedIn ? (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <User size={16} />
                      <span className="max-w-[80px] truncate">{displayName()}</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                      <LogOut size={18} />
                    </Button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button className="bg-cana-verde hover:bg-cana-verde-600 text-white">
                      Entrar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
