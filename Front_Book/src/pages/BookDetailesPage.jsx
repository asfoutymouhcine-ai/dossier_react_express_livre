import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBookById } from "../api/BooksApi";
import { useKeycloakAuth } from "../auth/KeycloakProvider";

// Page qui affiche les details d'un seul livre.
function BookDetailesPage() {
  // Recupere l'id du livre depuis l'URL.
  const { id } = useParams();
  // Verifie si l'utilisateur est connecte.
  const { isAuthenticated, isAdmin, login } = useKeycloakAuth();

  // Stocke les informations du livre.
  const [book, setBook] = useState(null);
  // Gere l'etat de chargement.
  const [isLoading, setIsLoading] = useState(true);
  // Stocke les erreurs.
  const [error, setError] = useState("");

  // Charge les details du livre.
  useEffect(() => {
    const loadBook = async () => {
      if (!isAuthenticated) {
        setBook(null);
        setError("Connecte-toi pour consulter les details d'un livre.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const bookFromApi = await fetchBookById(id);
        setBook(bookFromApi);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Impossible de charger les details du livre."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadBook();
  }, [id, isAuthenticated]);

  return (
    <main className="books-page">
      <section className="books-hero">
        <p className="books-eyebrow">Details</p>
        <h1>Details du livre</h1>
        <p className="books-hero-text">
          Cette page affiche les informations completes d'un livre avec le meme style
          commun que les autres pages de l'application.
        </p>
      </section>

      <section className="books-card">
        <div className="books-section-heading books-section-heading-row">
          <div>
            <h2>Informations du livre</h2>
            <p>Consulte le titre, l'auteur, le prix et l'identifiant du document.</p>
          </div>

          <div className="book-details-nav">
            <Link className="book-link-button" to="/Books">
              Retour aux livres
            </Link>
            {id && isAdmin ? (
              <Link className="book-secondary-button book-details-link" to={`/Books/edit/${id}`}>
                Modifier
              </Link>
            ) : null}
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="form-message form-message-warning">
            <p>Vous devez etre connecte pour consulter cette page.</p>
            <button className="book-secondary-button" type="button" onClick={login}>
              Se connecter
            </button>
          </div>
        ) : null}

        {error ? <p className="form-message form-message-error">{error}</p> : null}
        {isLoading ? <p className="form-message">Chargement des details...</p> : null}

        {!isLoading && !error && book ? (
          <div className="book-details-grid">
            <article className="book-details-main">
              <div className="home-book-card-top">
                <p className="home-book-card-label">Livre selectionne</p>
                <span className="books-price-badge">{Number(book.price ?? 0).toFixed(2)} DH</span>
              </div>

              <h2 className="book-details-title">{book.title}</h2>
              <p className="book-details-text">
                Ce livre est actuellement enregistre dans la base de donnees et peut etre
                consulte, modifie ou utilise dans les autres pages de l'application.
              </p>
            </article>

            <aside className="book-details-side">
              <div className="book-details-item">
                <span className="book-details-label">Titre</span>
                <strong>{book.title}</strong>
              </div>

              <div className="book-details-item">
                <span className="book-details-label">Auteur</span>
                <strong>{book.auteur}</strong>
              </div>

              <div className="book-details-item">
                <span className="book-details-label">Prix</span>
                <strong>{Number(book.price ?? 0).toFixed(2)} DH</strong>
              </div>

              <div className="book-details-item">
                <span className="book-details-label">Categorie</span>
                <strong>{book.category?.name || "Sans categorie"}</strong>
              </div>

              <div className="book-details-item">
                <span className="book-details-label">ID MongoDB</span>
                <strong className="books-table-id">{book._id}</strong>
              </div>
            </aside>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default BookDetailesPage;
