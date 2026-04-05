import { useEffect, useState } from "react";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";
import { deleteBook, fetchBooks } from "../api/BooksApi";
import { useKeycloakAuth } from "../auth/KeycloakProvider";

// Page principale des livres.
function BooksPage() {
  // Verifie si l'utilisateur est connecte.
  const { isAuthenticated } = useKeycloakAuth();
  // Stocke la liste des livres.
  const [books, setBooks] = useState([]);
  // Indique si la liste est en cours de chargement.
  const [isLoading, setIsLoading] = useState(true);
  // Stocke les erreurs de chargement.
  const [error, setError] = useState("");

  // Charge les livres depuis le backend.
  const loadBooks = async () => {
    if (!isAuthenticated) {
      setBooks([]);
      setError("Connecte-toi pour consulter la liste des livres.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const booksFromApi = await fetchBooks();
      setBooks(Array.isArray(booksFromApi) ? booksFromApi : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Impossible de recuperer les livres depuis la base de donnees."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Recharge la liste quand l'etat de connexion change.
  useEffect(() => {
    loadBooks();
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteBook(id);
      await loadBooks();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Impossible de supprimer le livre pour le moment."
      );
    }
  };

  return (
    <main className="books-page">
      <section className="books-hero">
        <p className="books-eyebrow">Gestion des livres</p>
        <h1>Ajouter et afficher les livres de la base MongoDB</h1>
        <p className="books-hero-text">
          Le formulaire enregistre un document dans la collection <strong>books</strong> et
          le tableau affiche ensuite les livres presents dans la base.
        </p>
      </section>

      <BookForm onBookCreated={loadBooks} />
      <BookList
        books={books}
        isLoading={isLoading}
        error={error}
        onRefresh={loadBooks}
        onDelete={handleDelete}
      />
    </main>
  );
}

export default BooksPage;
