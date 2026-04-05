function CategoryList({ categories, selectedCategoryId, onSelect, onDelete }) {
  return (
    <section className="books-card">
      <div className="books-section-heading">
        <h2>Liste des categories</h2>
        <p>Clique sur une categorie pour afficher les livres de cette categorie.</p>
      </div>

      {categories.length === 0 ? (
        <p className="form-message">Aucune categorie disponible pour le moment.</p>
      ) : (
        <div className="category-grid">
          {categories.map((category) => (
            <article
              key={category._id}
              className={`category-card${
                selectedCategoryId === category._id ? " category-card-active" : ""
              }`}
            >
              <button
                className="category-card-button"
                type="button"
                onClick={() => onSelect(category)}
              >
                <span className="category-card-label">Categorie</span>
                <strong className="category-card-name">{category.name}</strong>
              </button>

              <button
                className="category-delete-button"
                type="button"
                onClick={() => onDelete(category._id)}
              >
                Supprimer
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoryList;
