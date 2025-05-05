
import { ArrowDown } from "lucide-react";
import Cube3D from "./Cube3D";

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-cana-verde/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-cana-verde/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="lg:w-1/2 mb-10 lg:mb-0 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">Modelos 3D</span> para todos os seus projetos
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Encontre objetos 3D de alta qualidade para decoração, peças mecânicas, festas, brindes, brinquedos e muito mais.
            </p>
          </div>
          
          {/* 3D Cube Showcase */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 relative animate-float">
              <Cube3D />
            </div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-sm text-muted-foreground mb-2">Explore mais</span>
          <ArrowDown className="text-cana-verde" size={24} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
