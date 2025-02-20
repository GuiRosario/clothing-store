"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // Importe o ícone ArrowLeft

export default function AddProductPage() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    image: "",
    category: "",
    colors: [],
    quantity: "",
    sizes: [],
  });

  const [loading, setLoading] = useState(false); // Novo estado para controle de carregamento

  const availableColors = [
    { value: "black", label: "Preto" },
    { value: "pink", label: "Rosa" },
    { value: "red", label: "Vermelho" },
    { value: "blue", label: "Azul" },
    { value: "green", label: "Verde" },
    { value: "yellow", label: "Amarelo" },
  ];

  const availableSizes = ["PP", "P", "M", "G"];
  const availableCategories = ["Vestido", "Camiseta", "Camisa", "Calça"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setNewProduct({ ...newProduct, image: base64Image });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorSelect = (color: string) => {
    setNewProduct((prev) => {
      const updatedColors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: updatedColors };
    });
  };

  const handleSizeSelect = (size: string) => {
    setNewProduct((prev) => {
      const updatedSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProduct.image) {
      alert("Por favor, adicione uma imagem para o produto");
      return;
    }

    setLoading(true); // Começa o carregamento

    try {
      // Envia a imagem para o backend
      const imageResponse = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: newProduct.image }),
      });

      const imageData = await imageResponse.json();
      const imageUrl = imageData.url;

      // Cria o produto com a URL da imagem
      const productResponse = await fetch(`${apiUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProduct,
          image: imageUrl,
          quantity: parseInt(newProduct.quantity, 10),
        }),
      });

      if (productResponse.ok) {
        router.push("/"); // Redireciona após sucesso
      } else {
        console.error("Erro ao adicionar produto");
      }
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    } finally {
      setLoading(false); // Termina o carregamento
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-6">
      {/* Botão de voltar e título */}
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")} // Navega para a página inicial
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" /> {/* Ícone de seta */}
        </Button>
        <h1 className="text-2xl font-bold flex-1 text-center">
          Adicionar Novo Produto
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          placeholder="Nome do produto"
          value={newProduct.title}
          onChange={handleChange}
          required
        />
        <Input
          name="price"
          placeholder="Preço (ex: R$100)"
          value={newProduct.price}
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
            required
          />
          {newProduct.image && (
            <div className="mt-2">
              <img
                src={newProduct.image}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Select estilizado para categoria */}
        <div>
          <label className="block text-sm font-medium mb-2">Categoria</label>
          <div className="relative">
            <select
              name="category"
              value={newProduct.category}
              onChange={handleChange}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              required
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Seleção de Cores */}
        <div>
          <label className="block text-sm font-medium mb-2">Cores</label>
          <div className="flex gap-4">
            {availableColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorSelect(color.value)}
                className={`w-8 h-8 rounded-full border-2 ${
                  newProduct.colors.includes(color.value)
                    ? "border-black ring-2 ring-offset-2 ring-black"
                    : "border-white"
                } ${`bg-${color.value}-300`}`}
              />
            ))}
          </div>
        </div>

        {/* Seleção de Tamanhos */}
        <div>
          <label className="block text-sm font-medium mb-2">Tamanhos</label>
          <div className="flex gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeSelect(size)}
                className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition ${
                  newProduct.sizes.includes(size)
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <Input
          name="quantity"
          type="number"
          placeholder="Quantidade"
          value={newProduct.quantity}
          onChange={handleChange}
          required
        />

        {/* Botão "Adicionar Produto" */}
        <Button
          type="submit"
          className="w-full"
          disabled={loading} // Desabilita o botão enquanto está carregando
        >
          {loading ? (
            <span>Carregando...</span> // Exibe "Carregando..." enquanto o estado está loading
          ) : (
            "Adicionar Produto"
          )}
        </Button>
      </form>

      {/* Animação de carregamento estilizada */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-white border-solid border-t-transparent"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                Carregando...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
