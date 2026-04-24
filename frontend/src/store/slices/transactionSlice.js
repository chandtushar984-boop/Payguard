import { createSlice } from '@reduxjs/toolkit'

// Free fraud detection — pure rule engine, no paid API needed
export function scoreTransaction(txn) {
  let score = 0
  const reasons = []

  // Rule 1: High amount
  const amt = parseFloat(txn.amount)
  if (amt > 100000) { score += 40; reasons.push('Amount exceeds ₹1,00,000') }
  else if (amt > 50000) { score += 20; reasons.push('Amount exceeds ₹50,000') }

  // Rule 2: Blacklisted account
  const blacklist = ['ACC-7741', 'ACC-9900', 'ACC-3301']
  if (blacklist.includes(txn.fromAccount)) { score += 50; reasons.push('Blacklisted account') }

  // Rule 3: Foreign location (user-provided)
  if (txn.location && txn.location !== 'India') { score += 25; reasons.push('Foreign location detected') }

  // Rule 4: Off-hours (before 6am or after 11pm IST)
  const hour = new Date(txn.timestamp).getHours()
  if (hour < 6 || hour >= 23) { score += 15; reasons.push('Off-hours transaction') }

  // Rule 5: New account pattern (acc number starts with 9)
  if (txn.fromAccount.startsWith('ACC-9') && amt > 20000) { score += 20; reasons.push('New account + large amount') }

  // Rule 6: Round number (fraudsters often use round amounts)
  if (amt % 10000 === 0 && amt >= 50000) { score += 10; reasons.push('Suspicious round amount') }

  const clampedScore = Math.min(score, 100)
  let status = 'cleared'
  if (clampedScore >= 70) status = 'blocked'
  else if (clampedScore >= 40) status = 'flagged'

  return { score: clampedScore, reasons, status }
}

const seed = [
  { id: 'TXN#1001', fromAccount: 'ACC-4471', toAccount: 'ACC-2210', amount: '85000', location: 'India', timestamp: new Date(Date.now() - 300000).toISOString(), type: 'NEFT' },
  { id: 'TXN#1002', fromAccount: 'ACC-3310', toAccount: 'ACC-5521', amount: '1200', location: 'India', timestamp: new Date(Date.now() - 600000).toISOString(), type: 'UPI' },
  { id: 'TXN#1003', fromAccount: 'ACC-7741', toAccount: 'ACC-8810', amount: '200000', location: 'India', timestamp: new Date(Date.now() - 900000).toISOString(), type: 'RTGS' },
  { id: 'TXN#1004', fromAccount: 'ACC-5590', toAccount: 'ACC-1102', amount: '42000', location: 'Germany', timestamp: new Date(Date.now() - 1200000).toISOString(), type: 'IMPS' },
  { id: 'TXN#1005', fromAccount: 'ACC-2290', toAccount: 'ACC-6612', amount: '500', location: 'India', timestamp: new Date(Date.now() - 1500000).toISOString(), type: 'UPI' },
  { id: 'TXN#1006', fromAccount: 'ACC-9120', toAccount: 'ACC-3340', amount: '75000', location: 'India', timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'NEFT' },
].map(t => { const r = scoreTransaction(t); return { ...t, riskScore: r.score, reasons: r.reasons, status: r.status } })

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: seed,
    filter: 'all',
    search: '',
    blacklist: ['ACC-7741', 'ACC-9900', 'ACC-3301'],
    nextId: 1007,
  },
  reducers: {
    addTransaction: (state, action) => {
      const txn = action.payload
      const result = scoreTransaction(txn)
      state.list.unshift({ ...txn, riskScore: result.score, reasons: result.reasons, status: result.status })
    },
    setFilter: (state, action) => { state.filter = action.payload },
    setSearch: (state, action) => { state.search = action.payload },
    updateStatus: (state, action) => {
      const { id, status } = action.payload
      const t = state.list.find(t => t.id === id)
      if (t) t.status = status
    },
    addToBlacklist: (state, action) => {
      if (!state.blacklist.includes(action.payload)) state.blacklist.push(action.payload)
    },
    removeFromBlacklist: (state, action) => {
      state.blacklist = state.blacklist.filter(a => a !== action.payload)
    },
    incrementId: (state) => { state.nextId += 1 },
  },
})

export const { addTransaction, setFilter, setSearch, updateStatus, addToBlacklist, removeFromBlacklist, incrementId } = transactionSlice.actions
export default transactionSlice.reducer
