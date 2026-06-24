import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const AUTH_URL = 'http://localhost:3001/auth'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [erroLogin, setErroLogin] = useState(null)
  const [loadingLogin, setLoadingLogin] = useState(false)

  const estaLogado = !!token

  async function login(usuario, senha) {
    setLoadingLogin(true)
    setErroLogin(null)

    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, password: senha }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login')
      }

      setToken(data.token)
      setUsername(data.username)
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)

      return true
    } catch (err) {
      setErroLogin(err.message)
      return false
    } finally {
      setLoadingLogin(false)
    }
  }

  async function logout() {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      setToken(null)
      setUsername(null)
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    }
  }

  return (
    <AuthContext.Provider
      value={{ token, username, estaLogado, login, logout, erroLogin, loadingLogin }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}