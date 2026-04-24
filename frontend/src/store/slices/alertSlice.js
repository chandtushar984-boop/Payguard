import { createSlice } from '@reduxjs/toolkit'

const alertSlice = createSlice({
  name: 'alerts',
  initialState: { list: [] },
  reducers: {
    pushAlert: (state, action) => {
      state.list.unshift({ ...action.payload, id: Date.now(), seen: false })
      if (state.list.length > 20) state.list.pop()
    },
    markSeen: (state, action) => {
      const a = state.list.find(a => a.id === action.payload)
      if (a) a.seen = true
    },
    clearAlerts: (state) => { state.list = [] },
  },
})

export const { pushAlert, markSeen, clearAlerts } = alertSlice.actions
export default alertSlice.reducer
