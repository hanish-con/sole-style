import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import { HeartIcon, TrashIcon } from 'lucide-react';
import { getFavourites } from '@/utils/api';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

export default function SettingsFavoriteProductsPage() {

    const user = JSON.parse(localStorage.getItem('user'));
    const decoded = jwtDecode(localStorage.getItem('token'));

    const [favorites, setFavorites] = useState([]);
    useEffect(() => {
        // getFavourites(user.email).then(setFavorites);
        getFavourites(decoded.email).then(x => {
            console.log({ x });
            setFavorites(x.favorites);
        });
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Favorite Products</h1>

            {favorites.length === 0 ? (
                <p className="text-gray-600">You have no favorite products yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((product) => (
                        <div
                            key={product._id}
                            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
                        >
                            <img
                                src={product.imageURL}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h2 className="text-lg font-semibold">{product.name}</h2>
                            <p className="text-gray-600 text-sm">{product.description}</p>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-primary font-bold">$ {product.price}</span>
                            </div>
                            <Link to={`/products/${product._id}`} className="w-full">
                                <Button className="w-full">View Product</Button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
