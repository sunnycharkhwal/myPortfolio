import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as contactSettingsApi from '../api/contactSettingsApi.js'

// Singleton, not a list — same shape/rationale as heroSlice.js/skillsSectionSlice.js.
// Used only by the dashboard's ContactSettingsForm; the public Contact.jsx/Footer.jsx
// components self-fetch via contactSettingsApi.js directly instead, same precedent as
// Hero.jsx.
const initialState = {
  data: null,
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchContactSettingsForEdit = createAsyncThunk(
  'contactSettings/fetchForEdit',
  async (_, { getState, rejectWithValue }) => {
    try {
      return await contactSettingsApi.getContactSettingsForEdit(getState().auth.token)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const saveContactSettings = createAsyncThunk(
  'contactSettings/save',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await contactSettingsApi.updateContactSettings(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const contactSettingsSlice = createSlice({
  name: 'contactSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactSettingsForEdit.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchContactSettingsForEdit.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchContactSettingsForEdit.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(saveContactSettings.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(saveContactSettings.fulfilled, (state, action) => {
        state.data = action.payload
        state.mutationStatus = 'succeeded'
      })
      .addCase(saveContactSettings.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload
      })
  },
})

export default contactSettingsSlice.reducer
