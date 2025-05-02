
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import CategoryIcons from "@/components/CategoryIcons";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <CategoryIcons />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
