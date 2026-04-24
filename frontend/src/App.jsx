import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { pushAlert } from './store/slices/alertSlice'
import { requestPermissions } from './utils/permissions'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Blacklist from './pages/Blacklist'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const user = useSelector(s => s.auth.user)
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const dispatch = useDispatch()
  const user = useSelector(s => s.auth.user)

  useEffect(() => {
    if (user) requestPermissions(dispatch, pushAlert)
  }, [user])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="add" element={<AddTransaction />} />
          <Route path="blacklist" element={<Blacklist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
