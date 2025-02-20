"use client";

import { ArrowLeft, Heart, Trash, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/context/favorites-context";
import { useEffect, useState } from "react";
import { use } from "react";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { toggleFavorite, isFavorite } = useFavorites();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isProductFavorite = isFavorite(Number(id));

  const colorClasses = {
    black: "bg-black",
    pink: "bg-pink-300",
    red: "bg-red-300",
    blue: "bg-blue-300",
    green: "bg-green-300",
    yellow: "bg-yellow-300",
  };

  const handleDelete = async () => {
    setIsModalOpen(false);
    try {
      const response = await fetch(`${apiUrl}/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao excluir o produto");
      }

      router.push("/");
    } catch (error) {
      setError(`Erro ao excluir o produto: ${error.message}`);
      console.log("ERRO DELETE", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${apiUrl}/products/${id}`);
        if (!response.ok) {
          throw new Error("Produto não encontrado");
        }
        const data = await response.json();
        setItem(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto relative">
        {/* Botões sobre a imagem */}
        <header className="p-4 absolute top-0 left-0 right-0 flex justify-between items-center z-10">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white shadow-sm"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white shadow-sm"
              onClick={() => item && toggleFavorite(item)}
            >
              <Heart
                className={`h-5 w-5 ${
                  isProductFavorite ? "fill-red-500 stroke-red-500" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white shadow-sm"
              onClick={() => router.push(`/edit-product/${id}`)} // Redireciona para a página de edição
            >
              <Pen className="h-5 w-5 text-blue-500" /> {/* Ícone de edição */}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white shadow-sm"
              onClick={() => setIsModalOpen(true)} // Abre o modal de exclusão
            >
              <Trash className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        </header>

        <main className="p-4 pt-20"> {/* Ajusta o padding superior para evitar que o conteúdo fique sobreposto pelos botões */}
          <div className="aspect-[3/4] relative rounded-3xl overflow-hidden bg-muted mb-6">
            <Image
              src={item?.image || "/placeholder.svg"}
              alt={item?.title || "Product Image"}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground">
                {item?.category || "Category"}
              </p>
              <h1 className="text-2xl font-semibold">
                {item?.title || "Product Title"}
              </h1>
            </div>

            <div className="flex gap-2">
              {item?.colors?.map((color, index) => (
                <button
                  key={index}
                  className={`w-6 h-6 rounded-full border-2 border-white ${
                    colorClasses[color] || "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {item?.sizes?.map((size, index) => (
                <button
                  key={index}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-200 transition"
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between py-4 border-t border-gray-200 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Quantidade:
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-900 text-lg font-semibold rounded-md">
                  {item?.quantity}
                </span>
              </div>

              <div className="text-2xl font-bold text-gray-900">
                R${item?.price || "$0"}
              </div>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800">
              Confirmar Exclusão
            </h2>
            <p className="mt-2 text-gray-600">
              Tem certeza de que deseja excluir este produto?
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)} // Fecha o modal
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete} // Deleta o produto
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
