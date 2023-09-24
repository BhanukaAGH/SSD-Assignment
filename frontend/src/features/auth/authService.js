import api from '../../utils/api'

const API_URL = '/auth'

// Register user
const register = async (userData) => {
  const response = await api.post(API_URL + '/register', userData)
  return response.data
}

// Login user
const login = async (userData) => {
  const response = await api.post(API_URL + '/login', userData)
  return response.data
}

// Logout user
const logout = async () => {
  await api.post(API_URL + '/logout', null)
}

const authService = {
  register,
  logout,
  login,
}

export default authService
