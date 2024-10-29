import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent} from "@/components/ui/card"
import { Heading } from "@/components/ui/heading";
import { Product } from "@/models/user";
//added line here....  // Use actual DataTable
import { DataTableSkeleton } from "@/components/layout/table/data-table-skeleton";  // For loading state
import PageContainer from "@/components/layout/page-container";


// interface Product {
//   _id: number;
//   name: string;
//   description: string;
//   price: number;
//   images: string;
//   stock:number;
// }
const PAGE_SIZE = 10;

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products...");
        const response = await fetch("http://localhost:3002/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch products");
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setProducts(data);
        setTotalItems(data.length)
      } catch (error: unknown) {
        console.error("Fetch error:", error);
        if(error instanceof Error){
          setError(error.message);
        }else{
          setError("An Unknown error occured");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
 // Calculate total pages
 const totalPages = Math.ceil(totalItems / PAGE_SIZE);

 // Paginate the products for display on the current page
 const paginatedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <PageContainer>
    <div className="min-h-screen transition-colors">
      <div className="text-center mb-5">
      <Heading title={"Our shoes"} description={""}></Heading>
      </div>
      

      <div className="p-6">
        {loading ? (
          <DataTableSkeleton columnCount={4} rowCount={10} /> 
          // <div className="text-center text-blue-500 dark:text-blue-300">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-300">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {paginatedProducts.map((product) => (
              <Card key={product._id} className="shadow-md hover:shadow-lg transition-transform hover:scale-105">
              
                <img
                  // src={product.images[0] || "/placeholder.jpg"}
                  src={product.imageURL || "/placeholder.jpg"}
                  alt={product.name}
                  className="h-48 w-full object-cover rounded-t-lg"
                />

               
                <CardHeader>
                  <CardTitle >
                    {product.name}
                  </CardTitle>
                  <CardDescription>
                    ${product.price.toFixed(2)}
                  </CardDescription>
                </CardHeader>

               
                <CardContent>
                  <p
                    className={`${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                </CardContent>

                <CardFooter>
                  <Link to={`/products/${product._id}`} className="w-full">
                    <Button className="w-full">View Product</Button>
                  </Link>
                  <Link to={`/cart`}className="w-full ml-2">
                    <Button className="w-full">Add to Cart</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 space-x-4">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-lg">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>

      </div>
    </div>
    </PageContainer>
  );
}
