import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 600, color: color || '#111827' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const txns = useSelector(s => s.transactions.list)
  const pieRef = useRef(); const barRef = useRef()
  const pieChart = useRef(null); const barChart = useRef(null)

  const blocked = txns.filter(t => t.status === 'blocked')
  const flagged = txns.filter(t => t.status === 'flagged')
  const cleared = txns.filter(t => t.status === 'cleared')
  const totalAmt = txns.reduce((s, t) => s + parseFloat(t.amount), 0)
  const blockedAmt = blocked.reduce((s, t) => s + parseFloat(t.amount), 0)

  function fmt(n) { return n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(0)}K` : `₹${n}` }

  useEffect(() => {
    if (pieChart.current) pieChart.current.destroy()
    if (barChart.current) barChart.current.destroy()

    const pieCtx = pieRef.current?.getContext('2d')
    if (pieCtx) {
      pieChart.current = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['Cleared', 'Flagged', 'Blocked'],
          datasets: [{ data: [cleared.length, flagged.length, blocked.length], backgroundColor: ['#16A34A', '#D97706', '#DC2626'], borderWidth: 0, hoverOffset: 4 }],
        },
        options: { cutout: '70%', plugins: { legend: { position: 'bottom', labels: { font: { size: 12, family: 'DM Sans' }, padding: 12 } } } },
      })
    }

    const barCtx = barRef.current?.getContext('2d')
    if (barCtx) {
      const reasons = {}
      txns.forEach(t => t.reasons?.forEach(r => { reasons[r] = (reasons[r] || 0) + 1 }))
      const sorted = Object.entries(reasons).sort((a,b) => b[1]-a[1]).slice(0,5)
      barChart.current = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: sorted.map(([k]) => k.length > 22 ? k.slice(0,22)+'…' : k),
          datasets: [{ label: 'Triggered', data: sorted.map(([,v]) => v), backgroundColor: '#BFDBFE', borderColor: '#2563EB', borderWidth: 1, borderRadius: 4 }],
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } },
      })
    }
    return () => { pieChart.current?.destroy(); barChart.current?.destroy() }
  }, [txns])

  const recent = txns.filter(t => t.status !== 'cleared').slice(0, 4)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#111827' }}>Overview</h1>
        <p style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Real-time fraud detection summary</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total transactions" value={txns.length} sub="All time" />
        <StatCard label="Blocked" value={blocked.length} sub={`${fmt(blockedAmt)} prevented`} color="#DC2626" />
        <StatCard label="Flagged for review" value={flagged.length} sub="Needs attention" color="#D97706" />
        <StatCard label="Cleared" value={cleared.length} sub={fmt(totalAmt - blockedAmt) + ' processed'} color="#16A34A" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16, color: '#111827' }}>Transaction breakdown</div>
          <canvas ref={pieRef} />
        </div>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16, color: '#111827' }}>Top fraud triggers</div>
          <canvas ref={barRef} />
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 500, fontSize: 14, color: '#111827' }}>Recent alerts</div>
          <Link to="/transactions" style={{ fontSize: 13, color: '#2563EB' }}>View all →</Link>
        </div>
        {recent.length === 0 && <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: 20 }}>No flagged or blocked transactions</p>}
        {recent.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: t.status === 'blocked' ? '#FEF2F2' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
              {t.status === 'blocked' ? '🚫' : '⚠️'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{t.id} · {t.fromAccount}</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>{t.reasons?.join(', ')}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>₹{Number(t.amount).toLocaleString('en-IN')}</div>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: t.status === 'blocked' ? '#FEF2F2' : '#FFFBEB', color: t.status === 'blocked' ? '#DC2626' : '#D97706', fontWeight: 500 }}>{t.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
