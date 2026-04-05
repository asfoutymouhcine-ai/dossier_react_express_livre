import { Link } from "react-router-dom";
import { useKeycloakAuth } from "../auth/KeycloakProvider";

// Carte simple pour afficher un livre sur la page d'accueil.
function BookCard({ book }) {
  const { isAdmin } = useKeycloakAuth();

  return (
    <article className="home-book-card">
      <div className="home-book-card-top">
        <p className="home-book-card-label">Livre</p>
        <span className="books-price-badge">{Number(book.price ?? 0).toFixed(2)} DH</span>
      </div>

      <h3 className="home-book-card-title">{book.title}</h3>
      <p className="home-book-card-author">Auteur: {book.auteur}</p>
      <p className="home-book-card-category">Categorie: {book.category?.name || "Sans categorie"}</p>
      <p className="home-book-card-id">ID: {book._id}</p>

      <div className="home-book-card-actions">
        <Link className="book-link-button" to={`/Books/detail/${book._id}`}>
          Voir details
        </Link>
        {isAdmin ? (
          <Link className="book-secondary-button home-book-card-edit" to={`/Books/edit/${book._id}`}>
            Modifier
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export default BookCard;
