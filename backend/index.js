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
import {Contact} from "./models/ContactModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import axios from 'axios';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { SessionsClient } from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../frontend/dist')));



const JWT_SECRET="123456";
const JWT_EXPIRES_IN="1d";

const stripe = new Stripe(process.env.API_KEY);

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//   res.json({ message: "hello from app root" });
// });

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
    const products = await Product.aggregate([
      { $match: { featuredFlag: true } },  // Filter products with featuredFlag set to true
      { $sample: { size: 4 } }             // Randomly select 4 featured products
    ]);
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
    const relatedProducts = await Product.aggregate([
      { $match: { subcategory: product.subcategory, _id: { $ne: product._id } } },
      { $sample: { size: 4 } }
    ]);
    res.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
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
  const { email, productId, productName, productImage, productPrice, size, quantity } = req.body;

  try {
    const newCartItem = new Cart({
      email,
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
    const cart = await Cart.find({ email: req.query.email,  active: true });
    // console.log(cart);
    
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
  const { email } = req.query;

  try {
      const deletedItem = await Cart.findOneAndDelete({ email, productId: new mongoose.Types.ObjectId(productId) });
      if (!deletedItem) {
          return res.status(404).json({ message: "Item not found in cart" });
      }
      res.json({ message: "Item deleted successfully", deletedItem });
  } catch (error) {
      console.error("Error deleting cart item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE API for Cart
app.delete('/remove-cart/:cartId', async (req, res) => {
  const { cartId } = req.params;
  const { email } = req.query;

  try {
      const deletedItem = await Cart.findOneAndUpdate({ email, _id: new mongoose.Types.ObjectId(cartId) }, { active: false}, { new: true});
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
    // console.log("Checkout page called.");
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

    // mark checked out cart items as inactive
    const _updatedCartItem = await Cart.findOneAndUpdate(
      { _id: { $in: cartItems.map(x => new mongoose.Types.ObjectId(x))} },
      { $set: { active: false } },
      { new: true }
    );

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


app.get('/contact', async (req, res) => {
  console.log("contact us page called.");
  
});

app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate data
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save the contact message to the database
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Respond with a success message
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error handling contact form:', error);
    res.status(500).json({ message: 'An error occurred while sending the message' });
  }
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

//old
//order table API
// app.post("/order", async (req, res) => {
//   try {
//     console.log("Received data:", req.body); // Log incoming data

//     const { personalDetails, address, paymentInfo, cartItems, totalAmount, shippingMethod, email } = req.body;

//     if (!personalDetails || !address || !paymentInfo || !cartItems || !totalAmount || !shippingMethod) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

    // const newOrder = new Order({
    //   email,
    //   personalDetails,
    //   address,
    //   paymentInfo,
    //   cartItems: cartItems.map(x => new mongoose.Types.ObjectId(x)),
    //   totalAmount,
    //   shippingMethod: "CreditCard",
    //   paymentStatus: "Pending",
    // });

//     await newOrder.save();
//     res.status(201).json({ message: "Order placed successfully.", orderId: newOrder._id });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ message: "Server error. Could not place the order." });
//   }
// });

// new order api
// app.post("/order", async (req, res) => {
//   const { 
//     personalDetails, 
//     address, 
//     paymentInfo, 
//     cartItems, 
//     totalAmount, 
//     paymentToken,
//   } = req.body;

//   try {
//     console.log("Stripe API Key:", process.env.API_KEY);
//     // Create a payment intent with Stripe
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalAmount * 100, // Convert to cents
//       currency: "usd", // or the currency you want to use
//       description: "SoleStyle Order Payment",
//       payment_method: paymentToken,
//       confirm: true, // Automatically confirm the payment
//     });

//     // After successful payment, create an order in MongoDB
//     const order = new Order({
//       personalDetails,
//       address,
//       cartItems,
//       totalAmount,
//       paymentStatus: "success",
//       paymentIntentId: paymentIntent.id,
//     });

//     // Save the order to the database
//     await order.save();

//     res.status(200).json({ message: "Order placed successfully", orderId: paymentIntent.id });

//   } catch (error) {
//     console.error("Error processing payment:", error);
//     if (error.type === "StripeCardError") {
//       // Handle card error
//       return res.status(400).json({ error: error.message });
//     }
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// working
app.post("/order", async (req, res) => {
  
  const { 
    personalDetails, 
    address, 
    paymentInfo, 
    cartItems, 
    totalAmount, 
    paymentToken,
    email, 
  } = req.body;

  try {
    // Fetch cart details from the database
    const cart = await Cart.find({ _id: { $in: cartItems } });
    if (!cart || cart.length === 0) {
      return res.status(404).json({ error: "Cart items not found" });
    }
    // Initialize variables to calculate the subtotal
    let subtotal = 0;
    let orderDetails = '';
    cart.forEach(item => {
      const itemTotal = item.quantity * item.productPrice;
      subtotal += itemTotal;

      // Add row to table (product, quantity, price, total)
      orderDetails += `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 8px; text-align: center;">${item.productName}</td>
        <td style="padding: 8px; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; text-align: center;">$${item.productPrice.toFixed(2)}</td>
        <td style="padding: 8px; text-align: center;">$${itemTotal.toFixed(2)}</td>
      </tr>`;
    });
    // Fixed shipping cost and tax calculation
    const shippingCost = 20;  // Fixed shipping cost
    const salesTax = (subtotal * 0.13).toFixed(2);  // 13% sales tax
    const totalWithTaxAndShipping = (subtotal + shippingCost + parseFloat(salesTax)).toFixed(2);  // Final total

    const customer = await stripe.customers.create({
      email: personalDetails.email,
    });
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),  // Convert to cents
      currency: "CAD",  // Use CAD as currency
      description: "SoleStyle Order Payment",
      payment_method_data: {
        type: "card",  // Specify that this is a card payment
        card: {
          token: paymentToken,  // Pass the token here
        },
      },
      customer: customer.id,
      confirm: true,  // Automatically confirm the payment
      return_url: `http://localhost:5173/`
    });
    

    // After successful payment, create an order in MongoDB
    const order = new Order({
      email,
      personalDetails,
      address,
      paymentInfo,
      cartItems,
      totalAmount,
      paymentStatus: "success",
      paymentIntentId: paymentIntent.id,
      status: "Processing",
    });

    // Save the order to the database
    // console.log("new order : ", order);

    await order.save();

    // Email sending logic with Nodemailer
    const mailOptions = {
      from: 'yashall123321@gmail.com', // Sender email
      to: email, // Customer's email
      subject: "Order Confirmation - SoleStyle",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; margin-bottom: 20px;">
          <h1 style="color: #4CAF50;">Thank You for Your Order, ${personalDetails.name}!</h1>
        </div>
        <p style="font-size: 16px;">Your order has been successfully placed. Below are the details:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #4CAF50; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #4CAF50; color: white;">
                <th style="padding: 8px; text-align: center;">Product</th>
                <th style="padding: 8px; text-align: center;">Quantity</th>
                <th style="padding: 8px; text-align: center;">Price</th>
                <th style="padding: 8px; text-align: center;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails}
            </tbody>
          </table>
          <h3 style="color: #333; margin-top: 15px;">Subtotal: <span style="color: #4CAF50;">$${subtotal.toFixed(2)}</span></h3>
          <h3 style="color: #333; margin-top: 5px;">Shipping Cost: <span style="color: #4CAF50;">$${shippingCost}</span></h3>
          <h3 style="color: #333; margin-top: 5px;">Sales Tax (13%): <span style="color: #4CAF50;">$${salesTax}</span></h3>
          <h3 style="color: #333; margin-top: 15px;">Total: <span style="color: #4CAF50;">$${totalWithTaxAndShipping}</span></h3>
        </div>
        <p style="font-size: 16px; color: #555;">We will notify you when your order is shipped. If you have any questions, please contact us at <a href="mailto:support@solestyle.com" style="color: #4CAF50; text-decoration: none;">support@solestyle.com</a>.</p>
        <p style="font-size: 16px; color: #555;">Thank you for shopping with <strong style="color: #4CAF50;">SoleStyle</strong>!</p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);  // Send email

    res.status(200).json({ message: "Order placed successfully", orderId: paymentIntent.id });

  } catch (error) {
    console.error("Error processing payment:", error);
    if (error.type === "StripeCardError") {
      // Handle card error
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/orders', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    let orders = [];
    if (email === "all") {
        // Fetch all orders for admin
        orders = await Order.find({})
        .populate({
          path: 'cartItems',
          populate: {
            path: 'productId', // Populate product details
            model: 'Product', // Assuming 'Product' is the model name
          },
        });
    } else {
      // Fetch all orders for the given email
      orders = await Order.find({ email })
        .populate({
          path: 'cartItems',
          populate: {
            path: 'productId', // Populate product details
            model: 'Product', // Assuming 'Product' is the model name
          },
        });
    }


    // if (orders.length === 0) {
    //   return res.status(200).json([]);
    // }

    // Transform data
    const ordersData = orders.map(order => ({
      orderId: order._id.toString(),
      orderDate: order.createdAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
      status: order.status,
      estimatedDelivery: order.status === "cancelled" ? "NA": calculateEstimatedDelivery(order.createdAt),
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


app.patch('/orders', async (req, res) => {
  const { id, status } = req.body;

  if (!id) {
      return res.status(400).json({ message: "id is required" });
  }

  try {
      const updatedOrderItem = await Order.findOneAndUpdate(
          { _id: id },
          { $set: { status } },
          { new: true }
      );

      if (!updatedOrderItem) {
          return res.status(404).json({ message: "Order not found" });
      }
      res.json(updatedOrderItem);
  } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/send-order-shipment-email", async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const email = order.email;  

    const mailOptions = {
      from: 'yashall123321@gmail.com', 
      to: email, 
      subject: 'Your Order Has Been Shipped!', 
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; margin-bottom: 20px;">
            <h1 style="color: #4CAF50;">Thank You for Your Order!</h1>
          </div>
          <p style="font-size: 16px;">Hello, your order with Order ID: <strong>#${orderId}</strong> has been successfully placed and is now shipped.</p>
          <p style="font-size: 16px; color: #555;">Thank you for shopping with <strong style="color: #4CAF50;">SoleStyle</strong>!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email" });
  }
});


//cmnt
// app.post("/order", async (req, res) => {
//   const { 
//     personalDetails, 
//     address, 
//     cartItems,  // Pass the cart ID or an array of cart IDs
//     totalAmount, 
//     email 
//   } = req.body;

//   try {
//     // Fetch cart details from the database
//     const cart = await Cart.find({ _id: { $in: cartItems } });
//     if (!cart || cart.length === 0) {
//       return res.status(404).json({ error: "Cart items not found" });
//     }

//     // Initialize variables to calculate the subtotal
//     let subtotal = 0;  // This will hold the sum of item prices
//     let orderDetails = '';  // This will hold the table rows for each product
//     cart.forEach(item => {
//       const itemTotal = item.quantity * item.productPrice;
//       subtotal += itemTotal;

//       // Add row to table (product, quantity, price, total)
//       orderDetails += `
//       <tr style="border-bottom: 1px solid #ddd;">
//         <td style="padding: 8px; text-align: center;">${item.productName}</td>
//         <td style="padding: 8px; text-align: center;">${item.quantity}</td>
//         <td style="padding: 8px; text-align: center;">$${item.productPrice.toFixed(2)}</td>
//         <td style="padding: 8px; text-align: center;">$${itemTotal.toFixed(2)}</td>
//       </tr>`;
//     });

//     // Fixed shipping cost and tax calculation
//     const shippingCost = 20;  // Fixed shipping cost
//     const salesTax = (subtotal * 0.13).toFixed(2);  // Calculate 13% sales tax
//     const totalWithTaxAndShipping = (subtotal + shippingCost + parseFloat(salesTax)).toFixed(2);  // Final total with tax and shipping

//     // Example Nodemailer logic to send the email
//     const mailOptions = {
//       from: 'yashall123321@gmail.com', // Sender email
//       to: email, // Customer's email
//       subject: "Order Confirmation - SoleStyle",
//       html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//         <div style="text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; margin-bottom: 20px;">
//           <h1 style="color: #4CAF50;">Thank You for Your Order, ${personalDetails.name}!</h1>
//         </div>
//         <p style="font-size: 16px;">Your order has been successfully placed. Below are the details:</p>
//         <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
//           <h2 style="color: #4CAF50; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Summary</h2>
//           <table style="width: 100%; border-collapse: collapse;">
//             <thead>
//               <tr style="background-color: #4CAF50; color: white;">
//                 <th style="padding: 8px; text-align: center;">Product</th>
//                 <th style="padding: 8px; text-align: center;">Quantity</th>
//                 <th style="padding: 8px; text-align: center;">Price</th>
//                 <th style="padding: 8px; text-align: center;">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${orderDetails}
//             </tbody>
//           </table>
//           <h3 style="color: #333; margin-top: 15px;">Subtotal: <span style="color: #4CAF50;">$${subtotal.toFixed(2)}</span></h3>
//           <h3 style="color: #333; margin-top: 5px;">Shipping Cost: <span style="color: #4CAF50;">$${shippingCost}</span></h3>
//           <h3 style="color: #333; margin-top: 5px;">Sales Tax (13%): <span style="color: #4CAF50;">$${salesTax}</span></h3>
//           <h3 style="color: #333; margin-top: 15px;">Total: <span style="color: #4CAF50;">$${totalWithTaxAndShipping}</span></h3>
//         </div>
//         <p style="font-size: 16px; color: #555;">We will notify you when your order is shipped. If you have any questions, please contact us at <a href="mailto:support@solestyle.com" style="color: #4CAF50; text-decoration: none;">support@solestyle.com</a>.</p>
//         <p style="font-size: 16px; color: #555;">Thank you for shopping with <strong style="color: #4CAF50;">SoleStyle</strong>!</p>
//       </div>
//     `,
//     };

//     await transporter.sendMail(mailOptions);

//     // Save the order in your database (optional)
//     const order = new Order({
//       email,
//       personalDetails,
//       address,
//       cartItems,
//       totalAmount,
//       paymentStatus: "pending", // Set status as pending for now
//     });

//     await order.save();

//     res.status(200).json({ message: "Order placed successfully and email sent!", orderId: order._id });
//   } catch (error) {
//     console.error("Error processing order:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


const serviceAccountPath = process.env.DIALOGFLOW_KEY_PATH;

// Route to handle chatbot queries
app.post("/chatbot", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query cannot be empty" });
  }

  try {
    // Create a session client
    const sessionClient = new SessionsClient({
      keyFilename: serviceAccountPath,
    });

    // Generate a unique session ID for the conversation
    const sessionId = uuidv4();

    // Define the session path
    const sessionPath = sessionClient.projectAgentSessionPath(
      "shoezzy-gpxb", // Replace with your Dialogflow project ID
      sessionId
    );

    // Build the request payload
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: "en", // Set the language code (e.g., "en" for English)
        },
      },
    };

    // Send the query to Dialogflow
    const responses = await sessionClient.detectIntent(request);

    // Extract the bot's response
    const botResponse = responses[0].queryResult.fulfillmentText;

    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error("Error communicating with Dialogflow:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
