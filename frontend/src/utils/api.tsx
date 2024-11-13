import { Product, UserModel,CartItem } from "@/models/user";

export async function registerUser(userData: UserModel) {
    const resp = await fetch("http://localhost:3002/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    return resp;
}


export async function loginUser(userData: UserModel) {
    const resp = await fetch("http://localhost:3002/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    return resp;
}

export async function getProducts(filter): Promise<
{ totalProducts: number, products: Product[] } | null
>   {
    try {
        const response = await fetch("http://localhost:3002/products", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const products = await response.json();
        return { totalProducts: products.length, products }
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
};


export async function getProductByID(id: string): Promise<Product | null> {
    try {
        const response = await fetch(`http://localhost:3002/products/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function createOrUpdateProduct(product: Product): Promise<Product | null> {
    try {
        const response = await fetch(`http://localhost:3002/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deleteProduct(id: string): Promise<string | null> {
    try {
        const response = await fetch(`http://localhost:3002/products/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getFeaturedProducts(): Promise<Product[] | null> {
    try {
        const response = await fetch("http://localhost:3002/featured-products", {
            method: "GET",
            headers: { "Content-Type": "application/json"  }, 
        });
        const featuredProducts = await response.json();
        return featuredProducts;
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return null;
    }
}

export async function getCart(): Promise<CartItem[] | null> {
    try {
        const response = await fetch("http://localhost:3002/cart", {
            method: "GET",
            headers: { "Content-Type": "application/json" }, 
        });
        const cartItems = await response.json();
        return cartItems;
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return null;
    }
}