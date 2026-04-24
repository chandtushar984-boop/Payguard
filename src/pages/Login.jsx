import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, clearError } from '../store/slices/authSlice'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, error } = useSelector(s => s.auth)

  useEffect(() => { if (user) navigate('/') }, [user])
  useEffect(() => { return () => dispatch(clearError()) }, [])

  function handleSubmit(e) {
    e.preventDefault()
    dispatch(login(form))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EFF6FF 0%, #F9FAFB 60%, #FEF2F2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: '#fff', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(37,99,235,0.15)' }}>
            <svg width="28" height="28" viewBox="0 0 18 18" fill="none"><path d="M9 2L3 5v4c0 3.5 2.5 6.5 6 7.5 3.5-1 6-4 6-7.5V5L9 2z" stroke="#2563EB" strokeWidth="1.3" fill="#BFDBFE"/><path d="M6 9l2 2 4-4" stroke="#2563EB" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#111827', marginBottom: 6 }}>PayGuard</h1>
          <p style={{ fontSize: 14, color: '#6B7280' }}>Bank fraud detection system</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Username</label>
              <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="admin or viewer" required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none', color: '#111827' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••" required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none', color: '#111827' }} />
            </div>
            {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>{error}</div>}
            <button type="submit" style={{ width: '100%', padding: '11px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Sign in
            </button>
          </form>

          <div style={{ marginTop: 20, padding: 14, background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8, fontWeight: 500 }}>Demo credentials</div>
            <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.8 }}>
              <strong>Admin:</strong> admin / admin123<br />
              <strong>Viewer:</strong> viewer / view123
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
