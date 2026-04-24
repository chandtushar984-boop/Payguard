import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setFilter, setSearch, updateStatus } from '../store/slices/transactionSlice'
import { pushAlert } from '../store/slices/alertSlice'
import { sendNotification } from '../utils/permissions'

const STATUS_COLORS = {
  blocked: { bg: '#FEF2F2', color: '#DC2626' },
  flagged: { bg: '#FFFBEB', color: '#D97706' },
  cleared: { bg: '#F0FDF4', color: '#16A34A' },
}

export default function Transactions() {
  const dispatch = useDispatch()
  const { list, filter, search } = useSelector(s => s.transactions)
  const user = useSelector(s => s.auth.user)
  const [debTimer, setDebTimer] = useState(null)

  const handleSearch = useCallback((val) => {
    clearTimeout(debTimer)
    setDebTimer(setTimeout(() => dispatch(setSearch(val)), 300))
  }, [debTimer])

  const filtered = list.filter(t => {
    const matchF = filter === 'all' || t.status === filter
    const q = search.toLowerCase()
    const matchS = !q || t.id.toLowerCase().includes(q) || t.fromAccount.toLowerCase().includes(q) || t.amount.includes(q)
    return matchF && matchS
  })

  function handleStatusChange(id, newStatus) {
    dispatch(updateStatus({ id, status: newStatus }))
    dispatch(pushAlert({ type: newStatus === 'cleared' ? 'success' : 'danger', message: `${id} manually marked as ${newStatus}` }))
    if (newStatus === 'blocked') sendNotification('Transaction Blocked', `${id} has been blocked by admin`)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#111827' }}>Transactions</h1>
        <p style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>All incoming payment records</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <input onChange={e => handleSearch(e.target.value)} placeholder="Search TXN ID, account, amount..."
            style={{ flex: 1, minWidth: 200, padding: '8px 14px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13, outline: 'none' }} />
          {['all','cleared','flagged','blocked'].map(f => (
            <button key={f} onClick={() => dispatch(setFilter(f))}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid', fontSize: 13, cursor: 'pointer', fontWeight: filter === f ? 600 : 400,
                borderColor: filter === f ? '#2563EB' : '#D1D5DB',
                background: filter === f ? '#EFF6FF' : 'transparent',
                color: filter === f ? '#2563EB' : '#6B7280' }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                {['TXN ID','From','To','Amount','Type','Risk','Reason','Status', user?.role==='admin'?'Action':''].filter(Boolean).map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px', fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#374151' }}>{t.id}</td>
                  <td style={{ padding: '12px', color: '#374151' }}>{t.fromAccount}</td>
                  <td style={{ padding: '12px', color: '#374151' }}>{t.toAccount}</td>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#111827' }}>₹{Number(t.amount).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px', color: '#6B7280' }}>{t.type}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 50, height: 5, borderRadius: 3, background: '#E5E7EB', overflow: 'hidden' }}>
                        <div style={{ width: `${t.riskScore}%`, height: '100%', borderRadius: 3, background: t.riskScore >= 70 ? '#DC2626' : t.riskScore >= 40 ? '#D97706' : '#16A34A' }} />
                      </div>
                      <span style={{ fontSize: 12, color: '#6B7280' }}>{t.riskScore}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: 12, color: '#6B7280', maxWidth: 160 }}>{t.reasons?.join(', ') || '—'}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: STATUS_COLORS[t.status]?.bg, color: STATUS_COLORS[t.status]?.color }}>
                      {t.status}
                    </span>
                  </td>
                  {user?.role === 'admin' && (
                    <td style={{ padding: '12px' }}>
                      <select value={t.status} onChange={e => handleStatusChange(t.id, e.target.value)}
                        style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, border: '1px solid #D1D5DB', background: '#fff', cursor: 'pointer' }}>
                        <option value="cleared">Clear</option>
                        <option value="flagged">Flag</option>
                        <option value="blocked">Block</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
