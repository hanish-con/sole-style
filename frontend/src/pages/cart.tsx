import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, editCart, deleteCartItem } from "@/utils/api";
import { CartItem } from "@/models/user";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { Trash } from 'lucide-react';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  let shippingCost = 20;


  const calculateTotal = (price: number, quantity: number): number => {
    return price * quantity;
  };

  const calculateSubtotal = (): number => {
    return cartItems.reduce((acc, item) => acc + calculateTotal(item.productPrice, item.quantity), 0);
  };


  const calculateSalesTax = (subtotal: number): number => {
    return subtotal * 0.13; // 13% sales tax
  };

  const calculateTotalWithTax = (): number => {
    const subtotal = calculateSubtotal();
    const salesTax = calculateSalesTax(subtotal);
    return subtotal + salesTax + shippingCost;
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
  const salesTotal = calculateSalesTax(subtotal);
  const estimatedtotal = calculateTotalWithTax();

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        totalAmount: estimatedtotal, 
      },
    });
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center space-y-6">
      {/* <h1 className="text-3xl font-bold mb-6">My Shopping Cart</h1> */}
      <div className="">
        <Heading title="My Shopping Cart" description="" />
      </div>



      <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-5/4">
        {/* Product Information */}
        <Card className="w-full lg:w-1/2 p-6 ">
          <CardHeader className="text-xl font-bold">Your Items</CardHeader>
          <CardContent>
            {error && <p className="text-red-500">{error}</p>}
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => {
                  const itemTotal = calculateTotal(item.productPrice, item.quantity);
                  return (
                    <div key={item.productId} className="mb-6 border-b pb-4">
                      <div className="flex gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-32 h-32 object-cover"
                        />
                        <div className="flex-1">
                          <h2 className="text-lg font-bold">{item.productName}</h2>
                          {/* <p className="text-sm text-gray-600">{item.productDescription}</p> */}
                          <p>Price: CAD ${item.productPrice.toFixed(2)}</p>
                          <p>Size: {item.size}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <label htmlFor={`quantity-${item.productId}`}>Quantity: </label>
                            <Input
                              id={`quantity-${item.productId}`}
                              type="number"
                              value={item.quantity}
                              min="1"
                              onChange={(e) =>
                                handleQuantityChange(item.productId, parseInt(e.target.value))
                              }
                              className="p-1 border rounded-md w-16"
                            />
                          </div>
                          <p className="mt-2 font-bold">Total: CAD ${itemTotal.toFixed(2)}</p>
                        </div>
                        <Trash
                          onClick={() => handleDelete(item.productId)}
                        >
                          Delete
                        </Trash>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <p>Your cart is empty.</p>
            )}
          </CardContent>
        </Card>

        {/* Pricing Information */}
        <Card className="w-full lg:w-1/2 p-6 border border-gray-200">
          <CardHeader className="text-xl font-bold">SUMMARY</CardHeader>
          <CardContent>
            <div className="mt-6">
              <p>Subtotal: CAD ${subtotal.toFixed(2)}</p>
              <p>Shipping Costs: CAD ${shippingCost.toFixed(2)}</p>
              <p>Estimated Sales Tax: ${salesTotal.toFixed(2)}</p>
            </div>
            <div className="mt-6 text-2xl font-bold">
              Estimated Total: CAD ${estimatedtotal.toFixed(2)}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCheckout}
              className="w-full"
            >
              CHECKOUT
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
