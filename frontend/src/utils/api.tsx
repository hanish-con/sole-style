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

export async function editCart(productId: string, quantity: number): Promise<CartItem | null> {
    try {
        const response = await fetch(`http://localhost:3002/cart/${productId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
        });
        if (!response.ok) throw new Error("Failed to update cart item");
        return await response.json();
    } catch (error) {
        console.error("Error updating cart item:", error);
        return null;
    }
}

export async function deleteCartItem(productId: string): Promise<boolean> {
    try {
        const response = await fetch(`http://localhost:3002/cart/${productId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to delete cart item");
        return true;
    } catch (error) {
        console.error("Error deleting cart item:", error);
        return false;
    }
}

export async function updatePassword(data: { email: string, password: string}): Promise<UserModel | null> {
    try {
        const response = await fetch(`http://localhost:3002/update-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateUserDetails(data: { 
    firstName: string, 
    lastName: string,
    email: string,
    address: {
        street: string,
        city: string,
        state: string,
        zipCode: string,
        country: string,
    },
}): Promise<UserModel | null> {
    try {
        const response = await fetch(`http://localhost:3002/user-details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
