import http from "./axiosClient"; 


export const getCategories = () => {
  return http.get("/api/categories");
};


export const createCategory = (data) => {
  return http.post("/api/categories", data);
};

export const deleteCategory = (id) => {
  return http.delete(`/api/categories/${id}`);
};