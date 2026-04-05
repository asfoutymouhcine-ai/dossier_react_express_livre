import { Link } from "react-router-dom";
import { useKeycloakAuth } from "../auth/KeycloakProvider";

// Ce composant affiche la liste des livres sous forme de tableau.
function BookList({ books, isLoading, error, onRefresh, onDelete }) {
  const { isAdmin } = useKeycloakAuth();

  return (
    <section className="books-card">
      {/* Section principale qui contient tout le bloc de la liste. */}
      {/* En-tete avec le titre et le bouton d'actualisation. */}
      <div className="books-section-heading books-section-heading-row">
        <div>
          {/* Titre de la section. */}
          <h2>Liste des livres</h2>
          {/* Petit texte explicatif sous le titre. */}
          <p>Chaque ligne correspond a un document present dans ta collection MongoDB.</p>
        </div>

        {/* Bouton pour recharger les livres depuis l'API. */}
        <button className="book-secondary-button" type="button" onClick={onRefresh}>
          Actualiser
        </button>
      </div>

      {/* Affiche un message si une erreur existe. */}
      {error ? <p className="form-message form-message-error">{error}</p> : null}
      {/* Affiche un message pendant le chargement. */}
      {isLoading ? <p className="form-message">Chargement des livres...</p> : null}

      {/* Affiche un message si aucun livre n'est trouve. */}
      {!isLoading && !error && books.length === 0 ? (
        <p className="form-message">Aucun livre trouve dans la base pour le moment.</p>
      ) : null}

      {/* Affiche le tableau seulement si des livres existent. */}
      {!isLoading && books.length > 0 ? (
        <div className="books-table-wrapper">
          {/* Tableau HTML qui affiche les donnees des livres. */}
          <table className="books-table">
            <colgroup>
              <col className="books-column-title" />
              <col className="books-column-author" />
              <col className="books-column-category" />
              <col className="books-column-price" />
              <col className="books-column-id" />
              <col className="books-column-actions" />
            </colgroup>
            <thead>
              <tr>
                {/* Entetes des colonnes. */}
                <th>Titre</th>
                <th>Auteur</th>
                <th>Categorie</th>
                <th>Prix</th>
                <th>ID MongoDB</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Parcourt le tableau books pour afficher une ligne par livre. */}
              {books.map((book) => (
                <tr key={book._id}>
                  {/* Affiche le titre du livre. */}
                  <td>
                    <div className="books-cell-main">{book.title}</div>
                  </td>
                  {/* Affiche l'auteur du livre. */}
                  <td>
                    <div className="books-cell-secondary">{book.auteur}</div>
                  </td>
                  <td>
                    <div className="books-cell-category">
                      {book.category?.name || "Sans categorie"}
                    </div>
                  </td>
                  {/* Affiche le prix avec deux chiffres apres la virgule. */}
                  <td>
                    <span className="books-price-badge">
                      {Number(book.price ?? 0).toFixed(2)} DH
                    </span>
                  </td>
                  {/* Affiche l'identifiant MongoDB du document. */}
                  <td className="books-table-id">{book._id}</td>
                  <td>
                    <div className="books-actions">
                      <Link className="book-link-button books-action-link" to={`/Books/detail/${book._id}`}>
                        Details
                      </Link>
                      {isAdmin ? (
                        <>
                          <Link
                            className="book-secondary-button books-action-link"
                            to={`/Books/edit/${book._id}`}
                          >
                            Modifier
                          </Link>
                          <button
                            className="book-delete-button"
                            type="button"
                            onClick={() => onDelete(book._id)}
                          >
                            Supprimer
                          </button>
                        </>
                      ) : (
                        <span className="books-role-badge">CLIENT</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

// Export du composant pour pouvoir l'utiliser dans d'autres fichiers.
export default BookList;
