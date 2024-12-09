import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent} from "@/components/ui/card"
import { Heading } from "@/components/ui/heading";
import { Product } from "@/models/user";
//added line here....  // Use actual DataTable
import { DataTableSkeleton } from "@/components/layout/table/data-table-skeleton";  // For loading state
import PageContainer from "@/components/layout/page-container";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Chatbot from "./Chatbot";


// interface Product {
//   _id: number;
//   name: string;
//   description: string;
//   price: number;
//   images: string;
//   stock:number;
// }
const PAGE_SIZE = 8;

const categories = [
  { key: "men", label: "Men" },
  { key: "women", label: "Women" },
  { key: "kids", label: "Kids" }]

export default function Products() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const {toast} = useToast();

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const fetchProducts = async () => {
      setError(null);
      setLoading(true);
      try {
        console.log("Fetching products...");
        const endpoint = category ? `http://localhost:3002/categories/${category}` : "http://localhost:3002/products";
        const response = await fetch(endpoint, {
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
    setLoading(true);
    fetchProducts();
  }, [category, page]);
 // Calculate total pages
 const totalPages = Math.ceil(totalItems / PAGE_SIZE);

 const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(searchQuery.toLowerCase())
);

// Sort the filtered products
const sortedProducts = [...filteredProducts].sort((a, b) => {
  if (sortOrder === "lowToHigh") {
    return a.price - b.price;
  } else if (sortOrder === "highToLow") {
    return b.price - a.price;
  }
  return 0;
});



 const paginatedProducts = sortedProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

 const handleAddToCart = async (product:Product) => {
  try {
    const response = await fetch(`http://localhost:3002/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        productId: product._id,
        productName: product.name,       
        productImage: product.imageURL,   
        productPrice: product.price,      
        size: 8,
        quantity:1,
      }),
    });
    if (!response.ok) throw new Error("Failed to add product to cart");
    const data = await response.json();
    console.log({ data });
    const cartItems = [...new Set([
      ...(JSON.parse(localStorage.getItem('cart') || '[]')),
      data.item._id,
    ])];
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // alert("Product added to cart!");
    toast({
      title: "Success",
      description: "Product added to cart.",
      variant: "success",
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    // alert("Failed to add product to cart.");
    toast({
      title: "Failed",
      description: "Failed add to cart.",
      variant: "destructive",
    });
  }
};
 
  return (
    <PageContainer>
      <Chatbot/>
      {/* Category Navigation */}
      <Toaster />
      <nav className="w-full border-b md:border-0 rotate-0 scale-100 transition-all dark:-rotate-0 dark:scale-100 ">
        {categories.map((cat) => (
          <Button
            key={cat.key}
            variant={category === cat.key ? "default" : "outline"}
            onClick={() => {
              setPage(1); // Reset to page 1 on category change
              navigate(`/categories/${cat.key}`);
            }}
          >
            {cat.label}
          </Button>
        ))}
      </nav>
<div className="flex justify-between items-center mb-6 p-2 pl-0">
  <input
    type="text"
    placeholder="Search by product name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="p-2 border border-gray-300 rounded-md w-full max-w-md"
  />
  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    className="p-2 border border-gray-300 rounded-md ml-4"
  >
    <option value="">Sort by Price</option>
    <option value="lowToHigh">Price: Low to High</option>
    <option value="highToLow">Price: High to Low</option>
  </select>
</div>
      <div className="min-h-screen transition-colors">
        <div className="text-center mb-5 " style={{ textTransform: "capitalize" }}>
          <Heading title={`${category ? category : "Products"} collections`} description={""}></Heading>
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
                  <Link to={``}className="w-full ml-2">
                    <Button className="w-full" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
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
