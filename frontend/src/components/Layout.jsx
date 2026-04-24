import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { markSeen } from '../store/slices/alertSlice'

const alertColor = { success: '#16A34A', warning: '#D97706', danger: '#DC2626', info: '#2563EB' }
const alertBg = { success: '#F0FDF4', warning: '#FFFBEB', danger: '#FEF2F2', info: '#EFF6FF' }

export default function Layout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(s => s.auth.user)
  const alerts = useSelector(s => s.alerts.list)
  const unseen = alerts.filter(a => !a.seen).length
  const [showAlerts, setShowAlerts] = useState(false)

  function handleLogout() { dispatch(logout()); navigate('/login') }
  function toggleAlerts() {
    setShowAlerts(v => !v)
    alerts.forEach(a => dispatch(markSeen(a.id)))
  }

  const navStyle = ({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
    borderRadius: 8, fontWeight: 500, fontSize: 14, transition: 'all 0.15s',
    color: isActive ? '#2563EB' : '#6B7280',
    background: isActive ? '#EFF6FF' : 'transparent',
    textDecoration: 'none',
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB' }}>
      {/* Sidebar */}
      <aside style={{ width: 230, background: '#fff', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', padding: '20px 12px', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 24px' }}>
          <div style={{ width: 36, height: 36, background: '#EFF6FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L3 5v4c0 3.5 2.5 6.5 6 7.5 3.5-1 6-4 6-7.5V5L9 2z" stroke="#2563EB" strokeWidth="1.3" fill="#BFDBFE"/><path d="M6 9l2 2 4-4" stroke="#2563EB" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#111827' }}>PayGuard</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>Fraud Detection</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <NavLink to="/" end style={navStyle}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </NavLink>
          <NavLink to="/transactions" style={navStyle}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            Transactions
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/add" style={navStyle}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Add Transaction
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/blacklist" style={navStyle}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              Blacklist
            </NavLink>
          )}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #E5E7EB', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#2563EB' }}>
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', marginTop: 8, padding: '8px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'transparent', fontSize: 13, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ marginLeft: 230, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, position: 'sticky', top: 0, zIndex: 9 }}>
          <div style={{ position: 'relative' }}>
            <button onClick={toggleAlerts} style={{ position: 'relative', background: 'transparent', border: '1px solid #E5E7EB', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
              {unseen > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#DC2626', color: '#fff', fontSize: 10, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{unseen}</span>}
            </button>
            {showAlerts && (
              <div style={{ position: 'absolute', right: 0, top: 44, width: 340, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, maxHeight: 320, overflowY: 'auto' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', fontWeight: 500, fontSize: 13, color: '#111827' }}>System alerts</div>
                {alerts.length === 0 && <div style={{ padding: 16, fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>No alerts yet</div>}
                {alerts.map(a => (
                  <div key={a.id} style={{ padding: '10px 16px', borderBottom: '1px solid #F3F4F6', background: alertBg[a.type] || '#fff' }}>
                    <div style={{ fontSize: 12, color: alertColor[a.type] || '#111827', lineHeight: 1.5 }}>{a.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>Live · Refreshes every 30s</div>
        </header>

        <main style={{ padding: 28, flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
