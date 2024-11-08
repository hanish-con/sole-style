import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import {} from "./models/db.js";
import { User } from "./models/UserModel.js";
import { Product } from "./models/ProductModel.js";
import { Category } from "./models/CategoryModel.js";
import { Cart } from "./models/CartModel.js";
import {Review} from "./models/ReviewModel.js";

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

// Cart
// Get cart for a specific user
app.get('/cart/:customerId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.params.customerId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// Add item to cart
app.post('/cart/:customerId', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ customerId: req.params.customerId });

    if (!cart) {
      cart = new Cart({ customerId: req.params.customerId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * product.price;  
    }, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

// Update item quantity in cart
app.put('/cart/:customerId/:productId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ customerId: req.params.customerId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(item => item.productId.toString() === req.params.productId);

    if (item) {
      item.quantity = quantity;
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * item.productId.price;  
    }, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error updating item quantity:', error);
    return res.status(500).json({ message: 'Failed to update cart' });
  }
});
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
