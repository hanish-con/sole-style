// src/pages/product-details.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardFooter, CardDescription, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>(); 
  const [product, setProduct] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [reviews, setReviews] = useState<any[]>([]);

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
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3002/reviews/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
    fetchProductDetails();
  }, [id]);

  const handleAddReview = async () => {
    if (!rating || !comment) return;

    try {
      const response = await fetch(`http://localhost:3002/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          customerId: `66f9ae7d3f7dc0d8d1dd1e02`,  //need attention here. change to customerID
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 space-y-8">
      <Card className="w-full shadow-lg">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2  p-6 flex justify-center items-center">
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

          <div className="lg:w-1/2 p-6">
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

              <div>
                <Label className="font-semibold">Available Sizes:</Label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="p-2 border rounded-md w-full"
                >
                  <option value="">Select Size</option>
                  {product.sizes?.map((size: string) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div className="flex gap-4">
                <div>
                  <Label className="font-semibold">Created At:</Label>
                  <p>{new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="font-semibold">Updated At:</Label>
                  <p>{new Date(product.updatedAt).toLocaleDateString()}</p>
                </div>
              </div> */}
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
      {/* Review Diplaying  */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <Heading title="Reviews" description="" />
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-600">No reviews yet. Be the first to review this product.</p>
        ) : (
          <ul className="space-y-4 mt-4">
            {reviews.map((review) => (
              <li key={review._id} className="p-4 border rounded-lg shadow-sm">
                <p className="text-sm font-bold">
                  Rating:
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={faStar}
                      className={index < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                    />
                  ))}
                </p>
                <p className="text-lg">{review.comment}</p>
                <p className="text-xs text-gray-500">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Review Adding.. */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <Heading title="Add a Review" description="" />
        <div className="flex items-center mb-4 mt-4">
          <label htmlFor="rating" className="font-bold mr-2">Rating:</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="p-2 border rounded-md"
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
        <textarea
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
          rows={4}
        />
        <Button onClick={handleAddReview}>Submit Review</Button>
      </div>
    </div>
  );
}
