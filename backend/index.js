import express from "express";
import {} from "./models/db.js";

const app = express();

app.get("/", (req, res) => {
    res.json({ message: "hello from app root"});
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});
