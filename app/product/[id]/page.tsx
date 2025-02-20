"use client";

import { ArrowLeft, Heart, Trash, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/context/favorites-context";
import { useEffect, useState } from "react";

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
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
      {/* Container da imagem com os botões sobrepostos */}
      <div className="relative w-full h-[60vh]">
        <Image
          src={item?.image || "/placeholder.svg"}
          alt={item?.title || "Product Image"}
          layout="fill"
          objectFit="cover"
          className="rounded-b-3xl"
        />

        {/* Botões sobre a imagem */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white shadow-sm"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
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
            onClick={() => router.push(`/edit-product/${id}`)}
          >
            <Pen className="h-5 w-5 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <Trash className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Conteúdo abaixo da imagem */}
      <main className="p-4 max-w-md mx-auto">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {item?.category || "Category"}
          </p>
          <h1 className="text-2xl font-semibold">
            {item?.title || "Product Title"}
          </h1>

          {/* Botões de cores */}
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

          {/* Preço e quantidade */}
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
  );
}
