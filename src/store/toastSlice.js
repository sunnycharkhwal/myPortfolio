import { createSlice, nanoid } from '@reduxjs/toolkit'

// A stacking queue, not a single-slot Snackbar — several actions can legitimately
// happen in quick succession (e.g. editing two entries back to back), and each one
// should get its own notification rather than the newest silently replacing the last.
const toastSlice = createSlice({
  name: 'toast',
  initialState: { items: [] },
  reducers: {
    addToast: {
      reducer(state, action) {
        state.items.push(action.payload)
      },
      prepare({ message, severity = 'success' }) {
        return { payload: { id: nanoid(), message, severity } }
      },
    },
    removeToast(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload)
    },
  },
})

export const { addToast, removeToast } = toastSlice.actions
export default toastSlice.reducer
