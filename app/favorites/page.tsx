"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/context/favorites-context";
import Link from "next/link";

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        <header className="p-4 flex items-center gap-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Favoritos</h1>
        </header>

        <main className="p-4">
          {favorites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Sem favoritos ainda</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {favorites.map((product) => (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="group"
                >
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
                    {product.price}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
