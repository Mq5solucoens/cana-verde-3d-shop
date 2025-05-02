
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand and Description */}
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-cana-verde rounded-md flex items-center justify-center">
                <div className="h-4 w-4 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <h3 className="ml-2 font-bold text-xl text-foreground">Cana<span className="text-cana-verde">3D</span></h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Plataforma especializada na venda de modelos 3D de alta qualidade para diversos segmentos e aplicações.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 p-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 p-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 p-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Produtos</h4>
            <ul className="space-y-2">
              <li><Link to="/categorias/decoracao" className="text-muted-foreground hover:text-cana-verde">Decoração</Link></li>
              <li><Link to="/categorias/pecas-mecanicas" className="text-muted-foreground hover:text-cana-verde">Peças Mecânicas</Link></li>
              <li><Link to="/categorias/taticos" className="text-muted-foreground hover:text-cana-verde">Itens Táticos</Link></li>
              <li><Link to="/categorias/festas" className="text-muted-foreground hover:text-cana-verde">Festas</Link></li>
              <li><Link to="/categorias/brinquedos" className="text-muted-foreground hover:text-cana-verde">Brinquedos</Link></li>
              <li><Link to="/categorias/telas-app" className="text-muted-foreground hover:text-cana-verde">Telas de App</Link></li>
            </ul>
          </div>
          
          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li><Link to="/como-comprar" className="text-muted-foreground hover:text-cana-verde">Como Comprar</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-cana-verde">FAQ</Link></li>
              <li><Link to="/termos-de-uso" className="text-muted-foreground hover:text-cana-verde">Termos de Uso</Link></li>
              <li><Link to="/politica-de-privacidade" className="text-muted-foreground hover:text-cana-verde">Política de Privacidade</Link></li>
              <li><Link to="/contato" className="text-muted-foreground hover:text-cana-verde">Contato</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Newsletter</h4>
            <p className="text-muted-foreground mb-4">
              Assine nossa newsletter para receber atualizações sobre novos modelos e ofertas exclusivas.
            </p>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input 
                  placeholder="Seu e-mail" 
                  type="email"
                  className="bg-muted border-border"
                />
              </div>
              <Button className="bg-cana-verde hover:bg-cana-verde-600">
                <Mail size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Cana3D. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
