import "./App.css"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import BooksPage from "./pages/BooksPage"
import BookEditPage from "./pages/BookEditPage"
import BookDetailesPage from "./pages/BookDetailesPage"
import CategoryPage from "./pages/CategoryPage"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
         <Route path="/" element={<Home />} />
         <Route path="/Categories" element={<CategoryPage />} />
        <Route path="/Books" element={<BooksPage />} />
        <Route path="/Books/edit" element={<BookEditPage />} />
        <Route path="/Books/edit/:id" element={<BookEditPage />} />
        <Route path="/Books/detail/:id" element={<BookDetailesPage />} />
      </Route>
    </Routes>
  )
}

export default App
