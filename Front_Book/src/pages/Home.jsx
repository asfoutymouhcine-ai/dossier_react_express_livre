import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import { fetchBooks } from "../api/BooksApi";
import { useKeycloakAuth } from "../auth/KeycloakProvider";

// Page d'accueil avec presentation des livres sous forme de cartes.
function Home() {
  // Etat de connexion Keycloak.
  const { isAuthenticated, login } = useKeycloakAuth();
  // Liste des livres a afficher.
  const [books, setBooks] = useState([]);
  // Etat de chargement.
  const [isLoading, setIsLoading] = useState(true);
  // Message d'erreur.
  const [error, setError] = useState("");

  // Charge les livres depuis l'API.
  useEffect(() => {
    const loadBooks = async () => {
      if (!isAuthenticated) {
        setBooks([]);
        setError("Connecte-toi pour voir les livres sur la page d'accueil.");
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
            "Impossible de recuperer les livres pour la page d'accueil."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [isAuthenticated]);

  return (
    <main className="books-page">
      <section className="books-hero">
        <p className="books-eyebrow">Accueil</p>
        <h1>Bienvenue sur l'application de gestion de livres</h1>
        <p className="books-hero-text">
          Consulte rapidement les livres disponibles dans la base et accede aux pages
          d'ajout, de modification et de details depuis l'application.
        </p>
      </section>

      <section className="books-card">
        <div className="books-section-heading">
          <h2>Livres disponibles</h2>
          <p>Les livres sont affiches ici sous forme de cartes, avec un style proche des autres pages.</p>
        </div>

        {!isAuthenticated ? (
          <div className="form-message form-message-warning">
            <p>Vous devez etre connecte pour consulter les livres.</p>
            <button className="book-secondary-button" type="button" onClick={login}>
              Se connecter
            </button>
          </div>
        ) : null}

        {error ? <p className="form-message form-message-error">{error}</p> : null}
        {isLoading ? <p className="form-message">Chargement des livres...</p> : null}

        {!isLoading && !error && books.length === 0 ? (
          <p className="form-message">Aucun livre disponible pour le moment.</p>
        ) : null}

        {!isLoading && books.length > 0 ? (
          <div className="home-books-grid">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default Home;
