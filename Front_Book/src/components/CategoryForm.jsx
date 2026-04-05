import { useState } from "react";
import { createCategory } from "../api/categoryApi";
import { useKeycloakAuth } from "../auth/KeycloakProvider";

function CategoryForm({ onSuccess }) {
  const { isAuthenticated, login } = useKeycloakAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isAuthenticated) {
      setError("Connecte-toi d'abord pour ajouter une categorie.");
      return;
    }

    if (!name.trim()) {
      setError("Le nom de la categorie est obligatoire.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createCategory({ name: name.trim() });
      setName("");
      if (onSuccess) {
        onSuccess();
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Impossible d'ajouter la categorie pour le moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="books-card">
      <div className="books-section-heading">
        <h2>Ajouter une categorie</h2>
        <p>Remplis le nom de la categorie puis enregistre-la dans la base de donnees.</p>
      </div>

      {!isAuthenticated ? (
        <div className="form-message form-message-warning">
          <p>Vous devez etre connecte pour ajouter une categorie.</p>
          <button className="book-secondary-button" type="button" onClick={login}>
            Se connecter
          </button>
        </div>
      ) : null}

      <form className="category-form" onSubmit={handleSubmit}>
        <label className="book-form-field">
          <span>Nom de la categorie</span>
          <input
            type="text"
            placeholder="Ex: Roman"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={!isAuthenticated || isSubmitting}
          />
        </label>

        <button
          className="book-primary-button"
          type="submit"
          disabled={!isAuthenticated || isSubmitting}
        >
          {isSubmitting ? "Ajout en cours..." : "Ajouter la categorie"}
        </button>
      </form>

      {error ? <p className="form-message form-message-error">{error}</p> : null}
    </section>
  );
}

export default CategoryForm;
