import { Link } from "react-router-dom"
import { useKeycloakAuth } from "../auth/KeycloakProvider"

function Header() {
  const { isAuthenticated, login, register, logout, user } = useKeycloakAuth()

  return (
    <header style={styles.header}>
      <h2>Books App</h2>

      <div style={styles.rightSection}>
        <nav style={styles.nav}>
          <Link style={styles.link} to="/">Home</Link>
          <Link style={styles.link} to="/Books">Books</Link>
          <Link style={styles.link} to="/Books/edit">Edit Book</Link>
          <Link style={styles.link} to="/Categories">Categories</Link>
        </nav>

        <div style={styles.authSection}>
          {isAuthenticated && (
            <span style={styles.userText}>
              {user?.preferred_username || user?.name || "Utilisateur"}
            </span>
          )}

          {!isAuthenticated ? (
            <>
              <button style={styles.registerButton} onClick={register} type="button">
                S'inscrire
              </button>
              <button style={styles.loginButton} onClick={login} type="button">
                Se connecter
              </button>
            </>
          ) : (
            <button style={styles.logoutButton} onClick={logout} type="button">
              Se deconnecter
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#282c34",
    color: "white",
    gap: "16px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  nav: {
    display: "flex",
    alignItems: "center",
  },
  link: {
    marginLeft: "15px",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
  },
  authSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  userText: {
    fontSize: "14px",
    color: "#d1d5db",
  },
  loginButton: {
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    backgroundColor: "#22c55e",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  registerButton: {
    border: "1px solid #60a5fa",
    borderRadius: "6px",
    padding: "8px 14px",
    backgroundColor: "transparent",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  logoutButton: {
    border: "1px solid #ef4444",
    borderRadius: "6px",
    padding: "8px 14px",
    backgroundColor: "transparent",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
}

export default Header
