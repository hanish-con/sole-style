import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import {} from "./models/db.js";
import { User } from "./models/UserModel.js";
import { Product } from "./models/ProductModel.js";

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

  next();
}

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
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
  res.status(200).json({ token });
});

// old products route
// app.get("/products", verifyToken, async (req, res) => {
//   const products = await Product.find({});
//   return res.json(products);
// });

app.get("/featured-products", verifyToken, async (req, res) => {
  // get featured products somehow
  const products = await Product.find({});
  return res.json(products);
});


// product page
// new product route
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
// route for productdetails page
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

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
