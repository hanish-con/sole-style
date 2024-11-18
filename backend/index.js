import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import {} from "./models/db.js";
import { User } from "./models/UserModel.js";
import { Product } from "./models/ProductModel.js";
import { Category } from "./models/CategoryModel.js";
import { Cart } from "./models/CartModel.js";
import {Review} from "./models/ReviewModel.js";
import {Order} from "./models/OrderModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import axios from 'axios';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Stripe from "stripe";

const app = express();

const JWT_SECRET="123456";
const JWT_EXPIRES_IN="1d";
const stripe = process.env.API_KEY;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "hello from app root" });
});

const verifyToken = (req, res, next) => {
  console.log({ headers: req.headers });
  const token = req.headers['Authorization'];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized"});
  }
  // set user details here
  next();
}

const cart = [];

//yp
// Helper function to send the reset password email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yashall123321@gmail.com',  // Your email
    pass: 'imvlbadnvjtxxzib'               // Your app password or Gmail password
  },
  logger: true,  // Enable logging
  debug: true    // Enable detailed debug logging
});

const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yashall123321@gmail.com',  // Replace with your email
      pass: 'imvlbadnvjtxxzib'    // Replace with your email password or app password
    }
  });

//  const resetPasswordLink = `http://localhost:5173/reset-password?token=${token}`;
//  const resetPasswordLink = `http://localhost:3000/reset-password?token=${token}`;
  const resetPasswordLink = `http://localhost:5173/reset-password`;

  const mailOptions = {
    from: 'yashall123321@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    text: `To reset your password, click the following link: ${resetPasswordLink}`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

app.get('/reset-password', (req, res) => {
  const { token } = req.query;  // Get the token from the URL query parameter
  
  // Find the user by the reset token
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }, (err, user) => {
    if (err || !user) {
      return res.status(400).send('Invalid or expired token');
    }
    
    // If token is valid, show password reset form
    res.render('reset-password', { userId: user._id });
  });
});

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check for missing fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  // console.log({ data: req.body });
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ error: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    ...req.body,
    password: hashedPassword,
  });
  newUser.save();
  return res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {

  const { email, password } = req.body;

   // Check for missing fields
   if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Check if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Compare passwords
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // TODO: use jwt token or something ?
  const token = jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.status(200).json({ token, user }); 
});  




//yp
// Route to handle password reset request (send reset link to email)
app.get('/forgot-password', (req, res) => {
  console.log("forgot password called");
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Generate a reset token (using crypto for example)
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetToken = resetToken;
  await user.save();

  // Send reset email with token
  await sendResetEmail(email, resetToken);

  res.status(200).json({ success: true, message: "Password reset link has been sent to your email" });
});

  
app.get('/reset-password', (req, res) => {
console.log("reset password called");
console.log(req.body);

});

app.get('/create-payment-intent', async (req, res) => {
  console.log("called");
});

// payment gateway using stripe
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // The amount to be charged, in cents
      currency: 'cad',
    });

    res.send({
      clientSecret: paymentIntent.client_secret, // Send client secret to the frontend
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// new not working
// app.post('/create-payment-intent', async (req, res) => {
// const { amount, personalDetails, address, paymentInfo, cartItems, shippingMethod, email } = req.body;

// try {
//   // Validate required fields
//   if (!amount || !personalDetails || !address || !cartItems || !email) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   // Create a PaymentIntent with Stripe
//   const paymentIntent = await stripeClient.paymentIntents.create({
//     amount, // Amount in cents
//     currency: "cad",
//   });

//   // Insert order into the database
//   const newOrder = new Order({
//     email,
//     personalDetails,
//     address,
//     paymentInfo: {
//       ...paymentInfo, // Assuming paymentInfo contains necessary card or payment data
//       paymentIntentId: paymentIntent.id, // Add Stripe PaymentIntent ID for reference
//     },
//     cartItems,
//     totalAmount: amount / 100, // Convert cents to dollars
//     shippingMethod,
//     paymentStatus: "Pending", // Default payment status
//   });

//   await newOrder.save();
// console.log("new order", newOrder);

//   // Respond to client
//   res.status(201).send({
//     message: "Order created and PaymentIntent generated successfully.",
//     clientSecret: paymentIntent.client_secret,
//     orderId: newOrder._id,
//   });
// } catch (error) {
//   console.error("Error creating PaymentIntent or saving order:", error);
//   res.status(500).send({ error: "Server error. Could not create order." });
// }
// });


// Route to handle password reset
// app.post("/reset-password", async (req, res) => {
//   const { email, newPassword } = req.body;

//   if (!email || !newPassword) {
//     return res.status(400).json({ success: false, message: 'Email and new password are required.' });
//   }

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found.' });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;

//     // Save the updated password
//     await user.save();

//     // Generate a token after password reset (similar to login)
//     const token = "123456789";  // In a real application, generate a JWT token here
    
//     res.status(200).json({ success: true, message: 'Password reset successfully.', token, user });
//   } catch (error) {
//     console.error('Error resetting password:', error); // Log the error
//     res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
//   }
// });
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email and new password are required.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Hash the new password (you can skip this if you are not hashing passwords)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
  
    //console.log("user: ",user);

    // Save the updated password
    await user.save();

    // Generate a token (In your case, it's a static token)
    const token = "123456789"; // This should ideally be a JWT token in a real app

    // Send the token back along with the user details
    res.status(200).json({ success: true, message: 'Password reset successfully.', token, user });
  } catch (error) {
    console.error('Error resetting password:', error); // Log the error
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});



// old static route
// app.get("/featured-products", verifyToken, async (req, res) => {
//   const products = await Product.find({});
//   return res.json(products);
// });

app.get("/featured-products", async (req, res) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 4 } }]);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// product page
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// productdetails page
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});


app.post('/products', async (req, res) => {
  const data = req.body;
  let product = null;
  try {
    // if _id is not null, then that means this is an update request
    if (data._id) {
      product = await Product.findByIdAndUpdate(data._id, data, { new: true})
    } else {
      // remove the _id from the data, because we are creating a new
      delete data._id;
      product = new Product(data);
      product = product.save();
    }
    return res.json(product);
  } catch (error) {
    console.error('Error saving product:', error);
    return res.status(500).json({ message: 'Failed to save product' });
  }
});


app.delete('/products/:id', async (req, res) => {
  const id = req.params.id;
  try {
      await Product.findByIdAndDelete(id);
      return res.json(id);
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Failed to delete product' });
  }
});


// API for Category Data
app.get('/category', async (req, res) => {
  try {
    const categories = await Category.find();
    console.log("Categories:", categories);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});


// Products by category
app.get('/categories/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this category' });
    }
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return res.status(500).json({ message: 'Failed to fetch products by category' });
  }
});



app.get('/reviews/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    return res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

app.post('/reviews', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    return res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error adding review:', error);
    return res.status(500).json({ message: 'Failed to add review' });
  }
});

// Cart API
// Add a product to cart
app.post('/cart', async (req, res) => {
  const { productId, productName, productImage, productPrice, size, quantity } = req.body;

  try {
    const newCartItem = new Cart({
      productId,
      productName,
      productImage,
      productPrice,
      size,
      quantity
    });

    await newCartItem.save();
    res.status(201).json({ message: 'Product added to cart successfully', item: newCartItem });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(400).json({ error: 'Failed to add product to cart', details: error.message });
  }
});

// CART GET API
app.get('/cart', async (req, res) => {
  try {
    const cart = await Cart.find();
    console.log(cart);
    
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Failed to fetch cart items' });
  }
});

// Update API for Cart
app.patch('/cart/:productId', async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  try {
      const updatedCartItem = await Cart.findOneAndUpdate(
          { productId: productId },
          { $set: { quantity: quantity } },
          { new: true }
      );

      if (!updatedCartItem) {
          return res.status(404).json({ message: "Item not found in cart" });
      }

      res.json(updatedCartItem);
  } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE API for Cart
app.delete('/cart/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
      const deletedItem = await Cart.findOneAndDelete({ productId: productId });
      if (!deletedItem) {
          return res.status(404).json({ message: "Item not found in cart" });
      }
      res.json({ message: "Item deleted successfully", deletedItem });
  } catch (error) {
      console.error("Error deleting cart item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


// GET API for Checkout
app.get('/checkout', async (req, res) => {
  try {
    console.log("Checkout page called.");
        res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching checkout:', error);
    res.status(500).json({ message: 'Failed to fetch checkout' });
  }
});

app.post("/checkout", async (req, res) => {
  try {
    console.log("Received data:", req.body); // Log incoming data

    const { personalDetails, address, paymentInfo, cartItems, totalAmount, shippingMethod } = req.body;

    if (!personalDetails || !address || !paymentInfo || !cartItems || !totalAmount || !shippingMethod) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newOrder = new Order({
      personalDetails,
      address,
      paymentInfo,
      cartItems,
      totalAmount,
      shippingMethod: "CreditCard",
      paymentStatus: "Pending",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully.", orderId: newOrder._id });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error. Could not place the order." });
  }
});

app.post('/update-password', async (req, res) => {
  const data = req.body;
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.findOneAndUpdate({ email: data.email }, { password: hashedPassword }, { new: true})
  return res.json(user);
});

app.post('/user-details', async (req, res) => {
  const data = req.body;
  const user = await User.findOneAndUpdate({ email: data.email }, { ...data }, { new: true})
  return res.json(user);
});

// //order table API
// app.post("/order", async (req, res) => {
//   try {
//     console.log("Received data:", req.body); // Log incoming data

//     const { personalDetails, address, paymentInfo, cartItems, totalAmount, shippingMethod } = req.body;

//     if (!personalDetails || !address || !paymentInfo || !cartItems || !totalAmount || !shippingMethod) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     const newOrder = new Order({
//       personalDetails,
//       address,
//       paymentInfo,
//       cartItems,
//       totalAmount,
//       shippingMethod: "CreditCard",
//       paymentStatus: "Pending",
//     });

//     await newOrder.save();
//     res.status(201).json({ message: "Order placed successfully.", orderId: newOrder._id });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ message: "Server error. Could not place the order." });
//   }
// });


//order table API
app.post("/order", async (req, res) => {
  try {
    console.log("Received data:", req.body); // Log incoming data

    const { personalDetails, address, paymentInfo, cartItems, totalAmount, shippingMethod, email } = req.body;

    if (!personalDetails || !address || !paymentInfo || !cartItems || !totalAmount || !shippingMethod) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newOrder = new Order({
      email,
      personalDetails,
      address,
      paymentInfo,
      cartItems: cartItems.map(x => new mongoose.Types.ObjectId(x)),
      totalAmount,
      shippingMethod: "CreditCard",
      paymentStatus: "Pending",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully.", orderId: newOrder._id });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error. Could not place the order." });
  }
});



app.get('/orders', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Fetch all orders for the given email
    const orders = await Order.find({ email })
      .populate({
        path: 'cartItems',
        populate: {
          path: 'productId', // Populate product details
          model: 'Product', // Assuming 'Product' is the model name
        },
      });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this email' });
    }

    // Transform data
    const ordersData = orders.map(order => ({
      orderId: order._id.toString(),
      orderDate: order.createdAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
      status: order.paymentStatus || 'Pending',
      estimatedDelivery: calculateEstimatedDelivery(order.createdAt),
      items: order.cartItems.map(cartItem => ({
        id: cartItem.productId._id, // Product ID
        name: cartItem.productId.name, // Product name
        quantity: cartItem.quantity, // Quantity of the product
        price: `$${cartItem.productId.price.toFixed(2)}`, // Product price
      })),
      totalAmount: `$${order.totalAmount.toFixed(2)}`,
    }));

    res.status(200).json(ordersData);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


function calculateEstimatedDelivery(orderDate) {
  const estimatedDate = new Date(orderDate);
  estimatedDate.setDate(estimatedDate.getDate() + 7);
  return estimatedDate.toISOString().split('T')[0];
}


app.get('/favorites', async (req, res) => {
  try {
    const email = req.query.email;
    const userWithFavorites = await User.findOne({ email })
      .populate('favorites');

    if (!userWithFavorites || userWithFavorites.favorites.length === 0) {
      return res.status(404).json({ message: 'No favorites found' });
    }

    res.status(200).json({ favorites: userWithFavorites.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.post('/favorites/add', async (req, res) => {
  try {
    const { productId, email } = req.body;
    const user = await User.findOne({ email }).populate('favorites');
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }
    res.status(200).json({ message: 'Product added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/favorites/remove', async (req, res) => {
  try {
    const { productId, email } = req.body;
    const user = await User.findOne({ email });
    user.favorites = user.favorites.filter((id) => id.toString() !== productId.toString());
    await user.save();
    res.status(200).json({ message: 'Product removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
