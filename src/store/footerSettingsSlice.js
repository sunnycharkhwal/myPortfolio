import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as footerSettingsApi from '../api/footerSettingsApi.js'

// Singleton, not a list — same shape/rationale as heroSlice.js/contactSettingsSlice.js.
// Used only by the dashboard's FooterSettingsForm; the public Footer.jsx component
// self-fetches via footerSettingsApi.js directly instead, same precedent as Hero.jsx.
const initialState = {
  data: null,
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchFooterSettingsForEdit = createAsyncThunk(
  'footerSettings/fetchForEdit',
  async (_, { getState, rejectWithValue }) => {
    try {
      return await footerSettingsApi.getFooterSettingsForEdit(getState().auth.token)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const saveFooterSettings = createAsyncThunk(
  'footerSettings/save',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await footerSettingsApi.updateFooterSettings(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const footerSettingsSlice = createSlice({
  name: 'footerSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFooterSettingsForEdit.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFooterSettingsForEdit.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchFooterSettingsForEdit.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(saveFooterSettings.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(saveFooterSettings.fulfilled, (state, action) => {
        state.data = action.payload
        state.mutationStatus = 'succeeded'
      })
      .addCase(saveFooterSettings.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload
      })
  },
})

export default footerSettingsSlice.reducer
