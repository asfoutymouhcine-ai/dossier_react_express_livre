import { useEffect, useState } from "react";
import { createBook } from "../api/BooksApi";
import { useKeycloakAuth } from "../auth/KeycloakProvider";
import { getCategories } from "../api/categoryApi";

// Formulaire pour ajouter un livre dans la base.
function BookForm({ onBookCreated }) {
  // Recupere l'etat de connexion et la fonction login.
  const { isAuthenticated, login } = useKeycloakAuth();
  const [categories, setCategories] = useState([]);
  // Stocke les valeurs saisies dans le formulaire.
  const [formData, setFormData] = useState({
    title: "",
    auteur: "",
    price: "",
    category: "",
  });
  // Gere l'etat d'envoi du formulaire.
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Stocke les messages d'erreur.
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      if (!isAuthenticated) {
        setCategories([]);
        return;
      }

      try {
        const response = await getCategories();
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (requestError) {
        console.error("Categories error:", requestError);
      }
    };

    loadCategories();
  }, [isAuthenticated]);

  // Met a jour le champ modifie dans le state.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Verifie les donnees puis envoie le livre au backend.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isAuthenticated) {
      setError("Connecte-toi d'abord pour ajouter un livre.");
      return;
    }

    if (!formData.title.trim() || !formData.auteur.trim() || formData.price === "") {
      setError("Le titre, l'auteur et le prix sont obligatoires.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createBook({
        title: formData.title.trim(),
        auteur: formData.auteur.trim(),
        price: Number(formData.price),
        category: formData.category || null,
      });

      setFormData({
        title: "",
        auteur: "",
        price: "",
        category: "",
      });

      if (onBookCreated) {
        onBookCreated();
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Impossible d'ajouter le livre pour le moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="books-card">
      <div className="books-section-heading">
        <h2>Ajouter un livre</h2>
        <p>Remplis les champs du modele Book puis enregistre le livre dans MongoDB.</p>
      </div>

      {/* Message affiche si l'utilisateur n'est pas connecte. */}
      {!isAuthenticated ? (
        <div className="form-message form-message-warning">
          <p>Vous devez etre connecte pour ajouter un livre.</p>
          <button className="book-secondary-button" type="button" onClick={login}>
            Se connecter
          </button>
        </div>
      ) : null}

      {/* Formulaire d'ajout d'un livre. */}
      <form className="book-form" onSubmit={handleSubmit}>
        <label className="book-form-field">
          <span>Titre</span>
          <input
            name="title"
            type="text"
            placeholder="Ex: Clean Code"
            value={formData.title}
            onChange={handleChange}
            disabled={!isAuthenticated || isSubmitting}
          />
        </label>

        <label className="book-form-field">
          <span>Auteur</span>
          <input
            name="auteur"
            type="text"
            placeholder="Ex: Robert C. Martin"
            value={formData.auteur}
            onChange={handleChange}
            disabled={!isAuthenticated || isSubmitting}
          />
        </label>

        <label className="book-form-field">
          <span>Prix</span>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Ex: 120"
            value={formData.price}
            onChange={handleChange}
            disabled={!isAuthenticated || isSubmitting}
          />
        </label>

        <label className="book-form-field">
          <span>Categorie</span>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={!isAuthenticated || isSubmitting}
          >
            <option value="">Sans categorie</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {error ? <p className="form-message form-message-error">{error}</p> : null}

        <button
          className="book-primary-button"
          type="submit"
          disabled={!isAuthenticated || isSubmitting}
        >
          {isSubmitting ? "Ajout en cours..." : "Ajouter le livre"}
        </button>
      </form>
    </section>
  );
}

export default BookForm;
