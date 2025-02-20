"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [product, setProduct] = useState({
    title: "",
    price: "",
    image: "",
    category: "",
    colors: [],
    quantity: 1,
    sizes: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${apiUrl}/products/${id}`);
        if (!response.ok) {
          throw new Error("Produto não encontrado");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setProduct({ ...product, image: base64Image });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorSelect = (color: string) => {
    setProduct((prev) => {
      const updatedColors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: updatedColors };
    });
  };

  const handleSizeSelect = (size: string) => {
    setProduct((prev) => {
      const updatedSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handleQuantityChange = (operation: "increment" | "decrement") => {
    setProduct((prev) => {
      const newQuantity =
        operation === "increment" ? prev.quantity + 1 : prev.quantity - 1;
      return { ...prev, quantity: Math.max(newQuantity, 0) };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        router.push(`/product/${id}`); // Redireciona para a página do produto após a edição
      } else {
        console.error("Erro ao editar produto");
      }
    } catch (error) {
      console.error("Erro ao editar produto:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen p-6">
      <header className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/product/${id}`)} // Volta para a página do produto
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Editar Produto</h1>
        <div className="w-10"></div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          placeholder="Nome do produto"
          value={product.title}
          onChange={handleChange}
          required
        />
        <Input
          name="price"
          placeholder="Preço (ex: R$100)"
          value={product.price}
          onChange={handleChange}
          required
        />

        {/* Campo de upload de imagem */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Imagem do Produto
          </label>
          <Input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
          {product.image && (
            <div className="mt-2">
              <img
                src={product.image}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Seleção de Cores */}
        <div>
          <label className="block text-sm font-medium mb-2">Cores</label>
          <div className="flex gap-4">
            {["black", "pink", "red", "blue", "green", "yellow"].map(
              (color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    product.colors.includes(color)
                      ? "border-black ring-2 ring-offset-2 ring-black"
                      : "border-white"
                  } ${`bg-${color}-300`}`}
                />
              )
            )}
          </div>
        </div>

        {/* Seleção de Tamanhos */}
        <div>
          <label className="block text-sm font-medium mb-2">Tamanhos</label>
          <div className="flex gap-2">
            {["PP", "P", "M", "G"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeSelect(size)}
                className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition ${
                  product.sizes.includes(size)
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantidade com setas */}
        <div>
          <label className="block text-sm font-medium mb-2">Quantidade</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuantityChange("decrement")}
              className="p-2 border rounded-full"
            >
              -
            </button>
            <Input
              name="quantity"
              type="number"
              value={product.quantity}
              onChange={handleChange}
              min="0"
              className="w-16 text-center"
            />
            <button
              type="button"
              onClick={() => handleQuantityChange("increment")}
              className="p-2 border rounded-full"
            >
              +
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Salvar Alterações
        </Button>
      </form>
    </div>
  );
}
