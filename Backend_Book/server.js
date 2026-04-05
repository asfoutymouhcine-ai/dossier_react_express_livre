import express from "express";
import mongoose from "mongoose";
import bookRoutes from "./routes/bookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

import cors from 'cors';

const app = express();


app.use(express.json());


app.use(cors());

mongoose.connect("mongodb://localhost:27017/bookstore")
.then(() => console.log(" MongoDB connecté"))
.catch((err) => {
    console.error(" Connexion MongoDB échouée :", err.message);
});


app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});