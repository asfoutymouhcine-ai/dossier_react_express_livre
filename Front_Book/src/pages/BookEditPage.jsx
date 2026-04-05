import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchBookById, fetchBooks, updateBook } from "../api/BooksApi";
import { useKeycloakAuth } from "../auth/KeycloakProvider";
import { getCategories } from "../api/categoryApi";

// Page pour modifier un livre deja enregistre.
function BookEditPage() {
  // Recupere l'id du livre depuis l'URL.
  const { id } = useParams();
  // Permet de rediriger l'utilisateur apres la modification.
  const navigate = useNavigate();
  // Verifie si l'utilisateur est connecte.
  const { isAuthenticated, isAdmin, login } = useKeycloakAuth();
  const [selectedBookId, setSelectedBookId] = useState(id || "");
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  // Stocke les valeurs du formulaire.
  const [formData, setFormData] = useState({
    title: "",
    auteur: "",
    price: "",
    category: "",
  });
  // Gere le chargement du livre.
  const [isLoading, setIsLoading] = useState(true);
  // Gere l'envoi du formulaire.
  const [isSaving, setIsSaving] = useState(false);
  // Stocke les messages d'erreur.
  const [error, setError] = useState("");
  // Stocke le message de succes.
  const [success, setSuccess] = useState("");

  // Met a jour le state quand l'utilisateur modifie un champ.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Change le livre selectionne depuis la liste deroulante.
  const handleBookSelection = (event) => {
    const nextBookId = event.target.value;
    setSelectedBookId(nextBookId);
    setSuccess("");
    setError("");

    if (nextBookId) {
      navigate(`/Books/edit/${nextBookId}`);
    } else {
      navigate("/Books/edit");
    }
  };

  // Charge la liste des livres pour le select.
  useEffect(() => {
    const loadBooksOptions = async () => {
      if (!isAuthenticated) {
        setBooks([]);
        return;
      }

      try {
        const booksFromApi = await fetchBooks();
        setBooks(Array.isArray(booksFromApi) ? booksFromApi : []);
      } catch (requestError) {
        console.error("Books options error:", requestError);
      }
    };

    loadBooksOptions();
  }, [isAuthenticated]);

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
        console.error("Categories load error:", requestError);
      }
    };

    loadCategories();
  }, [isAuthenticated]);

  // Charge les informations du livre a modifier.
  useEffect(() => {
    setSelectedBookId(id || "");

    const loadBook = async () => {
      if (!id) {
        setFormData({
          title: "",
          auteur: "",
          price: "",
          category: "",
        });
        setError("Choisis un livre dans la liste pour afficher ses informations.");
        setIsLoading(false);
        return;
      }

      if (!isAuthenticated) {
        setError("Connecte-toi pour modifier un livre.");
        setIsLoading(false);
        return;
      }

      if (!isAdmin) {
        setError("Seul un administrateur peut modifier un livre.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const book = await fetchBookById(id);

        setFormData({
          title: book.title || "",
          auteur: book.auteur || "",
          price: book.price ?? "",
          category: book.category?._id || "",
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Impossible de charger les informations du livre."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadBook();
  }, [id, isAuthenticated, isAdmin]);

  // Envoie les nouvelles valeurs au backend.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isAuthenticated) {
      setError("Connecte-toi pour modifier un livre.");
      return;
    }

    if (!isAdmin) {
      setError("Seul un administrateur peut modifier un livre.");
      return;
    }

    if (!formData.title.trim() || !formData.auteur.trim() || formData.price === "") {
      setError("Le titre, l'auteur et le prix sont obligatoires.");
      return;
    }

    try {
      setIsSaving(true);

      await updateBook(id, {
        title: formData.title.trim(),
        auteur: formData.auteur.trim(),
        price: Number(formData.price),
        category: formData.category || null,
      });

      setSuccess("Le livre a ete modifie avec succes.");

      setTimeout(() => {
        navigate("/Books");
      }, 900);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Impossible de modifier le livre pour le moment."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="books-page">
      <section className="books-hero">
        <p className="books-eyebrow">Modification</p>
        <h1>Modifier les informations d'un livre</h1>
        <p className="books-hero-text">
          Cette page permet de mettre a jour le titre, l'auteur et le prix du livre
          selectionne, avec le meme style que la page des livres.
        </p>
      </section>

      <section className="books-card">
        <div className="books-section-heading books-section-heading-row">
          <div>
            <h2>Edition du livre</h2>
            <p>Choisis un livre, modifie ses champs puis enregistre les changements.</p>
          </div>

          <Link className="book-link-button" to="/Books">
            Retour a la liste
          </Link>
        </div>

        {!isAuthenticated ? (
          <div className="form-message form-message-warning">
            <p>Vous devez etre connecte pour modifier un livre.</p>
            <button className="book-secondary-button" type="button" onClick={login}>
              Se connecter
            </button>
          </div>
        ) : null}

        {isAuthenticated && !isAdmin ? (
          <p className="form-message form-message-error">
            Votre role CLIENT ne permet pas de modifier les livres.
          </p>
        ) : null}

        {error ? <p className="form-message form-message-error">{error}</p> : null}
        {success ? <p className="form-message form-message-success">{success}</p> : null}
        {isLoading ? <p className="form-message">Chargement du livre...</p> : null}

        <div className="book-picker">
          <label className="book-form-field">
            <span>Choisir un livre</span>
            <select
              className="book-form-select"
              value={selectedBookId}
              onChange={handleBookSelection}
              disabled={!isAuthenticated || !isAdmin || books.length === 0}
            >
              <option value="">Selectionner un livre</option>
              {books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} - {book.auteur}
                </option>
              ))}
            </select>
          </label>

          {!isAuthenticated ? (
            <p className="form-message">Connecte-toi pour charger la liste des livres.</p>
          ) : null}

          {isAuthenticated && books.length === 0 ? (
            <p className="form-message">Aucun livre disponible pour la modification.</p>
          ) : null}
        </div>

        {!isLoading && !error && id && isAdmin ? (
          <form className="book-form" onSubmit={handleSubmit}>
            <label className="book-form-field">
              <span>Titre</span>
              <input
                name="title"
                type="text"
                placeholder="Ex: Clean Code"
                value={formData.title}
                onChange={handleChange}
                disabled={!isAuthenticated || isSaving}
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
                disabled={!isAuthenticated || isSaving}
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
                disabled={!isAuthenticated || isSaving}
              />
            </label>

            <label className="book-form-field">
              <span>Categorie</span>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={!isAuthenticated || isSaving}
              >
                <option value="">Sans categorie</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="book-form-actions">
              <Link className="book-link-button" to="/Books">
                Annuler
              </Link>

              <button
                className="book-primary-button"
                type="submit"
                disabled={!isAuthenticated || isSaving}
              >
                {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        ) : null}
      </section>
    </main>
  );
}

export default BookEditPage;
