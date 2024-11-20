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

export async function deleteCartItemById(id: string): Promise<boolean> {
    try {
        const response = await fetch(`http://localhost:3002/remove-cart/${id}`, {
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

export async function resetPassword(email: string, newPassword: string): Promise<{ success: boolean, message: string } | null> {
    try {
        const response = await fetch("http://localhost:3002/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email, // Use the email from the function argument
                newPassword: newPassword, // Use the new password from the function argument
            }),
        });

        const data = await response.json();

        if (data.success) {
            // Save the token (e.g., in localStorage or state)
            const token = data.token; // Use the token from the response
            console.log("Password reset successfully. Token:", token);
            // Optionally, save token to localStorage for persistent session
            localStorage.setItem('authToken', token);

            return { success: true, message: data.message };
        } else {
            console.error("Error:", data.message);
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error("Error resetting password:", error);
        return null;
    }
}



export async function forgotPassword(email: string): Promise<{ success: boolean, message: string } | null> {
    try {
        const response = await fetch("http://localhost:3002/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        // Return the response success and message
        return { success: data.success, message: data.message };
    } catch (error) {
        console.error(error);
        return null; // Return null if an error occurs
    }
}

export async function getOrders(email: string): Promise<unknown | null> {
    try {
        const response = await fetch(`http://localhost:3002/orders?email=${encodeURIComponent(email)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function getFavourites(email: string): Promise<{favorites: Product[]} | null> {
    try {
        const response = await fetch(`http://localhost:3002/favorites?email=${encodeURIComponent(email)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function addFavourite(email: string, productId: string): Promise<unknown | null> {
    try {
        const response = await fetch(`http://localhost:3002/favorites/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, productId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, message: errorData.message || "Failed to fetch orders" };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deleteFavourite(email: string, productId: string): Promise<unknown | null> {
    try {
        const response = await fetch(`http://localhost:3002/favorites/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, productId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


// export const createOrder = async (orderData: any) => {
//     try {
//       const response = await fetch(`http://localhost:3002/order`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to place order.");
//       }
  
//       return await response.json();
//     } catch (error) {
//       console.error("Error in createOrder:", error);
//       throw error;
//     }
//   };
  
//   export async function createOrder(amount: number, currency: string = 'USD'): Promise<string | null> {
//     try {
//       const response = await fetch('http://localhost:3002/order', {
//         method: 'POST', // Using POST to create an order
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount, currency }),
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         return data.orderId; // Assuming the backend returns an order ID
//       } else {
//         console.error('Error creating order:', data.message || 'Unknown error');
//         return null;
//       }
//     } catch (error) {
//       console.error('Error creating order:', error);
//       return null;
//     }
//   }
  
// Assuming you're exporting this from a file called `orderService.ts`

export async function createOrder(
    amount: number,
    currency: string = 'CAD',
    paymentToken: string,
    personalDetails: object,
    address: object,
    paymentInfo: object,
    cartItems: string[],
    email: string,
  ): Promise<string | null> {
    try {
      const response = await fetch('http://localhost:3002/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,               // Total amount
          currency,             // Currency (default to 'CAD')
          paymentToken,         // Payment token (for payment processing)
          personalDetails,      // Personal details (e.g., name, email)
          address,              // Address (e.g., shipping address)
          totalAmount: amount,   // Ensure the totalAmount is passed if required by your backend
          paymentInfo,             // Ensure paymentInfo is included in the request
          cartItems,
          email,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        return data.orderId; // Assuming the backend returns an order ID
      } else {
        console.error('Error creating order:', data.message || 'Unknown error');
        return null;
      }
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }
  