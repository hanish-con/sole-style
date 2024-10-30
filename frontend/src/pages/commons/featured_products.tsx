import React, { useEffect, useState } from "react";
import { Product } from "@/models/user"; 
import { getFeaturedProducts } from "@/utils/api"; 

const FeaturedProducts: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const products = await getFeaturedProducts();
                if (products) {
                    setFeaturedProducts(products);
                } else {
                    setError("No featured products found.");
                }
            } catch (err) {
                setError("Error fetching featured products.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="w-full border-b md:border-0 rotate-0 scale-100 transition-all dark:-rotate-0 dark:scale-100">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {featuredProducts.map((product) => (
                        <div key={product._id} className="group flex flex-col items-center">
                            <a href={`/products/${product._id}`} className="block p-4 border rounded-md shadow-md hover:shadow-lg transition-shadow w-full h-full flex flex-col">
                                <div className="overflow-hidden rounded-md mb-2 h-64 w-full">
                                    <img
                                        width={"250"}
                                        height={"250"}
                                        alt={product.name}
                                        src={product.imageURL || '/path/to/default/image.jpg'} 
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-center break-words mb-2 h-16 overflow-hidden">{product.name}</h3>
                                <p className="text-xl font-medium text-center mt-auto">
                                    <span className="text-base font-bold">$</span> {product.price.toFixed(2)}
                                </p>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;
