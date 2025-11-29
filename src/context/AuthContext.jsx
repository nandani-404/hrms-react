import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (email, password_hash) => {
    try {
      const response = await api.post('/login', { email, password_hash })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      
      // Fetch full profile data
      try {
        const profileResponse = await api.get('/my-profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const fullUserData = { ...user, ...profileResponse.data.employee }
        localStorage.setItem('user', JSON.stringify(fullUserData))
        setUser(fullUserData)
      } catch (profileError) {
        // If profile fetch fails, use basic user data
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
      }
      
      toast.success('Login successful')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
