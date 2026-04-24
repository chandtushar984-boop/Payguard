import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTransaction, incrementId } from '../store/slices/transactionSlice'
import { pushAlert } from '../store/slices/alertSlice'
import { sendNotification } from '../utils/permissions'
import { scoreTransaction } from '../store/slices/transactionSlice'

export default function AddTransaction() {
  const dispatch = useDispatch()
  const nextId = useSelector(s => s.transactions.nextId)
  const [form, setForm] = useState({ fromAccount: '', toAccount: '', amount: '', type: 'UPI', location: 'India' })
  const [preview, setPreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const updated = { ...form, [e.target.name]: e.target.value }
    setForm(updated)
    if (updated.fromAccount && updated.amount) {
      const result = scoreTransaction({ ...updated, timestamp: new Date().toISOString() })
      setPreview(result)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const txn = { ...form, id: `TXN#${nextId}`, timestamp: new Date().toISOString() }
    dispatch(addTransaction(txn))
    dispatch(incrementId())
    const result = scoreTransaction(txn)
    if (result.status === 'blocked') {
      dispatch(pushAlert({ type: 'danger', message: `🚫 TXN#${nextId} BLOCKED — ${result.reasons.join(', ')}` }))
      sendNotification('Payment Blocked!', `₹${Number(form.amount).toLocaleString('en-IN')} from ${form.fromAccount} was blocked.`)
    } else if (result.status === 'flagged') {
      dispatch(pushAlert({ type: 'warning', message: `⚠️ TXN#${nextId} flagged for review — ${result.reasons.join(', ')}` }))
    } else {
      dispatch(pushAlert({ type: 'success', message: `✅ TXN#${nextId} cleared — ₹${Number(form.amount).toLocaleString('en-IN')} from ${form.fromAccount}` }))
    }
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setForm({ fromAccount: '', toAccount: '', amount: '', type: 'UPI', location: 'India' }); setPreview(null) }, 2000)
  }

  const riskColor = preview ? (preview.score >= 70 ? '#DC2626' : preview.score >= 40 ? '#D97706' : '#16A34A') : '#9CA3AF'
  const riskBg = preview ? (preview.score >= 70 ? '#FEF2F2' : preview.score >= 40 ? '#FFFBEB' : '#F0FDF4') : '#F9FAFB'

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#111827' }}>Add Transaction</h1>
        <p style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Simulate an incoming payment — fraud check runs instantly</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'From Account', name: 'fromAccount', placeholder: 'e.g. ACC-4471' },
              { label: 'To Account', name: 'toAccount', placeholder: 'e.g. ACC-2210' },
              { label: 'Amount (₹)', name: 'amount', placeholder: 'e.g. 50000', type: 'number' },
            ].map(f => (
              <div key={f.name}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>{f.label}</label>
                <input name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} type={f.type || 'text'} required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none' }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Payment Type</label>
              <select name="type" value={form.type} onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none', background: '#fff' }}>
                {['UPI','NEFT','RTGS','IMPS'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Transaction Location</label>
              <select name="location" value={form.location} onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none', background: '#fff' }}>
                {['India','USA','Germany','UAE','China','Russia','Unknown'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <button type="submit" disabled={submitted}
              style={{ padding: '11px', background: submitted ? '#16A34A' : '#2563EB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
              {submitted ? '✓ Transaction added!' : 'Submit Transaction'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: riskBg, border: `1px solid ${riskColor}30`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 12 }}>Live fraud preview</div>
            {!preview ? (
              <p style={{ fontSize: 13, color: '#9CA3AF' }}>Fill the form to see a real-time fraud risk score.</p>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 40, fontWeight: 700, color: riskColor }}>{preview.score}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: riskColor, textTransform: 'capitalize' }}>{preview.status}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>Risk score / 100</div>
                  </div>
                </div>
                <div style={{ width: '100%', height: 8, borderRadius: 4, background: '#E5E7EB', overflow: 'hidden', marginBottom: 16 }}>
                  <div style={{ width: `${preview.score}%`, height: '100%', borderRadius: 4, background: riskColor, transition: 'width 0.4s' }} />
                </div>
                {preview.reasons.length > 0 ? (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 8 }}>Triggered rules:</div>
                    {preview.reasons.map((r, i) => (
                      <div key={i} style={{ fontSize: 12, color: riskColor, padding: '4px 10px', background: '#fff', borderRadius: 6, marginBottom: 4, border: `1px solid ${riskColor}20` }}>⚡ {r}</div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: '#16A34A' }}>✅ No fraud rules triggered</div>
                )}
              </>
            )}
          </div>

          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 12 }}>How scoring works</div>
            {[
              ['Amount > ₹1,00,000', '+40 pts'],
              ['Amount > ₹50,000', '+20 pts'],
              ['Blacklisted account', '+50 pts'],
              ['Foreign location', '+25 pts'],
              ['Off-hours (11pm–6am)', '+15 pts'],
              ['New account + large amt', '+20 pts'],
              ['Suspicious round amount', '+10 pts'],
            ].map(([rule, pts]) => (
              <div key={rule} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid #F3F4F6', color: '#374151' }}>
                <span>{rule}</span><span style={{ fontWeight: 600, color: '#DC2626' }}>{pts}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, fontSize: 12, color: '#6B7280' }}>Score ≥70 → Blocked · ≥40 → Flagged · &lt;40 → Cleared</div>
          </div>
        </div>
      </div>
    </div>
  )
}
