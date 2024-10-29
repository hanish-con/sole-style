// src/pages/product-details.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardFooter, CardDescription, CardContent } from "@/components/ui/card"

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL
  const [product, setProduct] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3002/products/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch product details");
        }

        const data = await response.json();
        setProduct(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8">
      <Card className="w-full max-w-4xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 flex justify-center items-center">
            <img

              src={product.imageURL || "/placeholder.jpg"}
              alt={product.name}
              className="max-h-96 w-auto rounded-lg object-cover"
            />
            {/* <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-md object-cover"
          /> */}
          </div>

          <div className="md:w-1/2 p-4">
            <CardHeader>
              <Heading title={product.name} description={product.category} />
            </CardHeader>

            <CardContent className="mt-4 space-y-4">
              <div>
                <Label className="font-semibold">Description:</Label>
                <CardDescription className="text-gray-700 dark:text-gray-300 mt-1">
                  {product.description}
                </CardDescription>
              </div>

              <div>
                <Label className="font-semibold">Price:</Label>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div>
                <Label className="font-semibold">Stock:</Label>
                <p className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>

              <div className="flex gap-4">
                <div>
                  <Label className="font-semibold">Created At:</Label>
                  <p>{new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="font-semibold">Updated At:</Label>
                  <p>{new Date(product.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-4 mt-6">
              <Link to={`/products`} className="w-full ml-2">
                <Button className="w-full">Back to products</Button>
              </Link>
              <Link to={`/cart`} className="w-full ml-2">
                <Button className="w-full">Add to Cart</Button>
              </Link>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
