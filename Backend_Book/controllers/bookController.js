import Book from "../model/Book.js";
import Category from "../model/Category.js";
import mongoose from "mongoose";


export const getBooks = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      if (!mongoose.Types.ObjectId.isValid(req.query.category)) {
        return res.status(400).json({ message: "Categorie invalide" });
      }

      filter.category = req.query.category;
    }

    const books = await Book.find(filter).populate("category", "name");
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const book = await Book.findById(id).populate("category", "name");
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const addBook = async (req, res) => {
  try {
    const { title, auteur, price, category } = req.body;

    
    if (!title || !auteur) {
      return res.status(400).json({ message: "Title et auteur sont requis" });
    }

    let categoryId = null;

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Categorie invalide" });
      }

      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Categorie introuvable" });
      }

      categoryId = category;
    }

    const newBook = new Book({
      title,
      auteur,
      price: price || 0,
      category: categoryId,
    });

    const savedBook = await (await newBook.save()).populate("category", "name");
    res.status(201).json(savedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    if (Object.prototype.hasOwnProperty.call(updateData, "category")) {
      if (updateData.category) {
        if (!mongoose.Types.ObjectId.isValid(updateData.category)) {
          return res.status(400).json({ message: "Categorie invalide" });
        }

        const categoryExists = await Category.findById(updateData.category);
        if (!categoryExists) {
          return res.status(404).json({ message: "Categorie introuvable" });
        }
      } else {
        updateData.category = null;
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("category", "name");

    if (!updatedBook) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.json({ message: `Livre '${deletedBook.title}' supprimé avec succès` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

