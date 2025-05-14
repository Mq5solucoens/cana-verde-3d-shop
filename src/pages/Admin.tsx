
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminTabs from "@/components/admin/AdminTabs";
import { useCategories } from "@/hooks/useCategories";

const AdminPage = () => {
  const { selectedCategory } = useCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Administração</h1>
        <AdminTabs selectedCategory={selectedCategory} />
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
