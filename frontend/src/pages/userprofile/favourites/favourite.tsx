import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import { HeartIcon, TrashIcon } from 'lucide-react';

// Sample data for favorite products
const favoriteProducts = [
  {
    id: 1,
    name: "Crochet Hook Set",
    image: "https://via.placeholder.com/150",
    price: "$15.00",
    description: "A premium crochet hook set for all your crafting needs.",
  },
  {
    id: 2,
    name: "Yarn Bundle",
    image: "https://via.placeholder.com/150",
    price: "$25.00",
    description: "Soft and colorful yarn bundle for your next project.",
  },
];

export default function SettingsFavoriteProductsPage() {
  const [favorites, setFavorites] = useState(favoriteProducts);

  // Remove a product from favorites
  const handleRemove = (id) => {
    setFavorites(favorites.filter((product) => product.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Favorite Products</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600">You have no favorite products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600 text-sm">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-primary font-bold">{product.price}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(product.id)}
                  className="flex items-center gap-1"
                >
                  <TrashIcon className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
