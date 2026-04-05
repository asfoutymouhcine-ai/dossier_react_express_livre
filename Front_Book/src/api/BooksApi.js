import http from "./axiosClient";

export const fetchBooks = async (categoryId = "") => {
  const response = await http.get("/api/books", {
    params: categoryId ? { category: categoryId } : {},
  });
  return response.data;
};

// Recupere un livre par son identifiant.
export const fetchBookById = async (id) => {
  const response = await http.get(`/api/books/${id}`);
  return response.data;
};

export const createBook = async (book) => {
  const response = await http.post("/api/books", book);
  return response.data;
};

// Met a jour un livre existant.
export const updateBook = async (id, book) => {
  const response = await http.put(`/api/books/${id}`, book);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await http.delete(`/api/books/${id}`);
  return response.data;
};
