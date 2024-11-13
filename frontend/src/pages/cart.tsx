import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, editCart, deleteCartItem } from "@/utils/api"; // Import deleteCartItem function
import { CartItem } from "@/models/user";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const calculateTotal = (price: number, quantity: number): number => {
    return price * quantity;
  };

  const calculateSubtotal = (): number => {
    return cartItems.reduce((acc, item) => acc + calculateTotal(item.productPrice, item.quantity), 0);
  };

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const items = await getCart();
        if (items) {
          setCartItems(items);
        } else {
          setError("Your cart is empty.");
        }
      } catch (error) {
        setError("Error fetching cart items.");
        console.error("Error fetching cart items:", error);
      }
    };

    loadCartItems();
  }, []);

  const handleDelete = async (productId: string) => {
    const success = await deleteCartItem(productId);
    if (success) {
      setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    } else {
      alert("Failed to delete item");
    }
  };

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    const updatedItem = await editCart(productId, quantity);
    if (updatedItem) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: updatedItem.quantity } : item
        )
      );
    } else {
      alert("Failed to update item quantity");
    }
  };

  const subtotal = calculateSubtotal();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {cartItems.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const itemTotal = calculateTotal(item.productPrice, item.quantity);
                return (
                  <tr key={item.productId}>
                    <td>
                      <img src={item.productImage} alt={item.productName} style={{ width: "50px", height: "50px" }} />
                    </td>
                    <td>{item.productName}</td>
                    <td>${item.productPrice.toFixed(2)}</td>
                    <td>{item.size}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                      />
                    </td>
                    <td>${itemTotal.toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleDelete(item.productId)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginTop: "20px", fontWeight: "bold" }}>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
          </div>

          <button onClick={handleCheckout} style={{ marginTop: "20px" }}>
            Proceed to Checkout
          </button>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
