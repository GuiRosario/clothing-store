"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Home, Heart, User, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/context/favorites-context";

export default function HomePage() {
  const router = useRouter();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]); // Estado para armazenar os produtos

  // Busca os produtos do backend ao carregar a página
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Erro ao buscar produtos");
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filtra os produtos com base na categoria e no texto pesquisado
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;

    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <header className="p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Pesquise Produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="p-4 pb-20">
        <div className="rounded-2xl bg-black text-white p-6 mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold mb-1">Lucia Confecções</h2>
            <p className="text-2xl font-semibold">Taquaralto</p>
          </div>
          <div className="absolute top-4 right-4">
            <span className="text-2xl font-bold">50%</span>
            <span className="block text-sm">OFF</span>
          </div>
        </div>

        {/* Botões de filtro */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          {["Todos", "Vestido", "Camiseta", "Camisa", "Calça", "Outros"].map(
            (category) => (
              <Button
                key={category}
                variant={
                  category === selectedCategory ? "default" : "secondary"
                }
                className="rounded-full"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            )
          )}
        </div>

        {/* Lista de produtos filtrados */}
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="group relative">
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-[3/4] relative rounded-2xl overflow-hidden bg-muted mb-2">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-sm">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    R$
                    {product.price}
                  </p>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-white/80 shadow-sm"
                  onClick={() => toggleFavorite(product)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorite(product.id)
                        ? "fill-red-500 stroke-red-500"
                        : ""
                    }`}
                  />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-2 text-muted-foreground">
              Nenhum produto
            </p>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="max-w-md mx-auto flex justify-around p-3">
          <Button variant="ghost" size="icon">
            <Home className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/favorites")}
            className="relative" // Adiciona posicionamento relativo para o contador
          >
            <Heart className="h-6 w-6" />
            {/* Contador de favoritos */}
            {favorites.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      {/* Botão flutuante para adicionar nova roupa */}
      <Button
        className="fixed bottom-20 right-6 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-900"
        onClick={() => router.push("/add-product")}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
