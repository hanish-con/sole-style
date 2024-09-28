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
  // set user details here
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
  const token = "123456789";
  res.status(200).json({ token });
});

app.get("/products", verifyToken, async (req, res) => {
  const products = await Product.find({});
  return res.json(products);
});

app.get("/featured-products", verifyToken, async (req, res) => {
  // get featured products somehow
  const products = await Product.find({});
  return res.json(products);
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
