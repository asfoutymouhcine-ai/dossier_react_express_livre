import Category from "../model/Category.js";

// ajouter category
export const createCategory = async (req, res) => {
  const category = new Category({
    name: req.body.name,
  });

  const result = await category.save();
  res.json(result);
};

// afficher les categories
export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

// supprimer category
export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
};