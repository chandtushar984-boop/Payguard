import { createSlice } from '@reduxjs/toolkit'

const USERS = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Arjun Sharma' },
  { id: 2, username: 'viewer', password: 'view123', role: 'viewer', name: 'Priya Mehta' },
]

const saved = JSON.parse(localStorage.getItem('pg_user') || 'null')

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: saved, error: null },
  reducers: {
    login: (state, action) => {
      const { username, password } = action.payload
      const found = USERS.find(u => u.username === username && u.password === password)
      if (found) {
        const { password: _, ...safe } = found
        state.user = safe
        state.error = null
        localStorage.setItem('pg_user', JSON.stringify(safe))
      } else {
        state.error = 'Invalid username or password'
      }
    },
    logout: (state) => {
      state.user = null
      localStorage.removeItem('pg_user')
    },
    clearError: (state) => { state.error = null },
  },
})

export const { login, logout, clearError } = authSlice.actions
export default authSlice.reducer
