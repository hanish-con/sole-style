import express from "express";
import {} from "./models/db.js";
import { User } from "./models/schema.js";

const app = express();

app.get("/", (req, res) => {
    res.json({ message: "hello from app root"});
});

app.post("/register", async (req, res) => {
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ error: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        ...req.body,
        password: hashedPassword,
    });
    newUser.save();
    return res.send(201).json({ message: "User registered successfully"});
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});
