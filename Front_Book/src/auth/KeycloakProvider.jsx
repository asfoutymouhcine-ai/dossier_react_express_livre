import { createContext, useContext, useEffect, useState } from 'react'
import keycloak from './keycloak'

// Had context kaykhellina نوصلو l malomat dyal auth mn ay component.
const KeycloakContext = createContext(null)

let initPromise

function extractRoles(tokenParsed) {
  return Array.isArray(tokenParsed?.realm_access?.roles)
    ? tokenParsed.realm_access.roles
    : []
}

function initKeycloak() {
  // Kan7afdo b nafs init promise bach ma y3awdch init aktar mn marra.
  if (!initPromise) {
    initPromise = keycloak.init({
      pkceMethod: 'S256',
      checkLoginIframe: false,
    })
  }

  return initPromise
}

export function KeycloakProvider({ children }) {
  const [isReady, setIsReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState([])

  useEffect(() => {
    let cancelled = false

    initKeycloak()
      .then((authenticated) => {
        if (cancelled) {
          return
        }

        // Mlli ykmmel init, kan7adtho state b 7alat auth الحالية.
        setIsAuthenticated(authenticated)
        setUser(keycloak.tokenParsed || null)
        setRoles(extractRoles(keycloak.tokenParsed))
        setIsReady(true)
      })
      .catch((error) => {
        console.error('Keycloak initialization error:', error)
        if (!cancelled) {
          setIsReady(true)
        }
      })

    // Mlli login yنجح, kanjadddo state.
    keycloak.onAuthSuccess = () => {
      setIsAuthenticated(true)
      setUser(keycloak.tokenParsed || null)
      setRoles(extractRoles(keycloak.tokenParsed))
    }

    // Mlli logout, kanms7o malomat l user mn state.
    keycloak.onAuthLogout = () => {
      setIsAuthenticated(false)
      setUser(null)
      setRoles([])
    }

    // Ila token salat, kan7awlo njadddoha 9bel ma n3ayto login.
    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(30)
        .then(() => {
          setUser(keycloak.tokenParsed || null)
          setRoles(extractRoles(keycloak.tokenParsed))
        })
        .catch(() => {
          keycloak.login()
        })
    }

    return () => {
      // Hadi kat7mi mn update dyal state ila component t7yed.
      cancelled = true
    }
  }, [])

  // Had value hiya li ghadi twssel l components lli dakhl provider.
  const value = {
    keycloak,
    isReady,
    isAuthenticated,
    token: keycloak.token || null,
    user,
    roles,
    hasRole: (role) => roles.includes(role),
    isAdmin: roles.includes("admin"),
    isClient: roles.includes("client"),
    login: () => keycloak.login(),
    register: () =>
      keycloak.register({
        redirectUri: window.location.origin,
      }),
    logout: () =>
      keycloak.logout({
        redirectUri: window.location.origin,
      }),
  }

  if (!isReady) {
    // Loading sghir 7tta ykmmel Keycloak initialization.
    return <div>Loading authentication...</div>
  }

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  )
}

export function useKeycloakAuth() {
  const context = useContext(KeycloakContext)

  if (!context) {
    // Hook khaso ytkhdem ghir dakhl KeycloakProvider.
    throw new Error('useKeycloakAuth must be used inside KeycloakProvider')
  }

  return context
}
