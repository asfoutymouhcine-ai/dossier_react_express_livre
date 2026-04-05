import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../api/categoryApi";
import { fetchBooks } from "../api/BooksApi";
import { useKeycloakAuth } from "../auth/KeycloakProvider";
import BookCard from "../components/BookCard";
import CategoryForm from "../components/CategoryForm";
import CategoryList from "../components/CategoryList";

function CategoryPage() {
  const { isAuthenticated } = useKeycloakAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    if (!isAuthenticated) {
      setCategories([]);
      setSelectedCategory(null);
      setCategoryBooks([]);
      return;
    }

    try {
      setError("");
      const res = await getCategories();
      const nextCategories = Array.isArray(res.data) ? res.data : [];
      setCategories(nextCategories);

      if (
        selectedCategory &&
        !nextCategories.some((category) => category._id === selectedCategory._id)
      ) {
        setSelectedCategory(null);
        setCategoryBooks([]);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Impossible de recuperer les categories."
      );
    }
  };

  const loadCategoryBooks = async (category) => {
    try {
      setBooksLoading(true);
      setError("");
      setSelectedCategory(category);
      const books = await fetchBooks(category._id);
      setCategoryBooks(Array.isArray(books) ? books : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Impossible de recuperer les livres de cette categorie."
      );
    } finally {
      setBooksLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    await deleteCategory(id);
    if (selectedCategory?._id === id) {
      setSelectedCategory(null);
      setCategoryBooks([]);
    }
    fetchCategories();
  };

  return (
    <main className="books-page">
      <section className="books-hero">
        <p className="books-eyebrow">Categories</p>
        <h1>Ajouter une categorie et consulter ses livres</h1>
        <p className="books-hero-text">
          La page categories permet d'ajouter une categorie basee sur le modele
          Category.js, d'afficher les categories de la base et de voir les livres
          appartenant a une categorie selectionnee.
        </p>
      </section>

      <CategoryForm onSuccess={fetchCategories} />

      {error ? <p className="form-message form-message-error">{error}</p> : null}

      <CategoryList
        categories={categories}
        selectedCategoryId={selectedCategory?._id || ""}
        onSelect={loadCategoryBooks}
        onDelete={handleDelete}
      />

      <section className="books-card">
        <div className="books-section-heading">
          <h2>
            {selectedCategory
              ? `Livres de la categorie: ${selectedCategory.name}`
              : "Livres par categorie"}
          </h2>
          <p>
            {selectedCategory
              ? "Les livres associes a cette categorie s'affichent ci-dessous."
              : "Clique sur une categorie dans la liste pour afficher ses livres."}
          </p>
        </div>

        {booksLoading ? <p className="form-message">Chargement des livres...</p> : null}

        {!booksLoading && selectedCategory && categoryBooks.length === 0 ? (
          <p className="form-message">Aucun livre n'est associe a cette categorie.</p>
        ) : null}

        {!booksLoading && categoryBooks.length > 0 ? (
          <div className="home-books-grid">
            {categoryBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default CategoryPage;
