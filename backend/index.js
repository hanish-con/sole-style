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

const app = express();

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
  const token = "123456789";  
  res.status(200).json({ token, user }); 
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

//order table API
app.post("/order", async (req, res) => {
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

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
