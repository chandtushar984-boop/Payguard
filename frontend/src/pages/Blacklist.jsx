import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToBlacklist, removeFromBlacklist } from '../store/slices/transactionSlice'
import { pushAlert } from '../store/slices/alertSlice'

export default function Blacklist() {
  const dispatch = useDispatch()
  const blacklist = useSelector(s => s.transactions.blacklist)
  const [input, setInput] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!input.trim()) return
    dispatch(addToBlacklist(input.trim().toUpperCase()))
    dispatch(pushAlert({ type: 'danger', message: `${input.trim().toUpperCase()} added to blacklist` }))
    setInput('')
  }

  function handleRemove(acc) {
    dispatch(removeFromBlacklist(acc))
    dispatch(pushAlert({ type: 'info', message: `${acc} removed from blacklist` }))
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#111827' }}>Blacklist</h1>
        <p style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Blocked account numbers — any transaction from these is auto-blocked</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16, color: '#111827' }}>Add account to blacklist</div>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. ACC-9900" required
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none' }} />
            <button type="submit" style={{ padding: '10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Add to Blacklist
            </button>
          </form>
          <div style={{ marginTop: 20, padding: 14, background: '#FEF2F2', borderRadius: 8, border: '1px solid #FECACA', fontSize: 12, color: '#991B1B', lineHeight: 1.6 }}>
            ⚠️ Any future transaction from a blacklisted account will be <strong>automatically blocked</strong> with a +50 risk score.
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16, color: '#111827' }}>Blacklisted accounts ({blacklist.length})</div>
          {blacklist.length === 0 && <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: 20 }}>No accounts blacklisted</p>}
          {blacklist.map(acc => (
            <div key={acc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🚫</div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 500, color: '#111827' }}>{acc}</span>
              </div>
              <button onClick={() => handleRemove(acc)}
                style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, border: '1px solid #E5E7EB', background: 'transparent', color: '#6B7280', cursor: 'pointer' }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
