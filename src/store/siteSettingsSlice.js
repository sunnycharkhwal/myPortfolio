import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as siteSettingsApi from '../api/siteSettingsApi.js'

// Singleton, not a list — same shape/rationale as heroSlice.js/footerSettingsSlice.js.
// Used only by the dashboard's SiteSettingsForm; the public Nav.jsx/HomePage.jsx/
// section components self-fetch via siteSettingsApi.js directly instead, same
// precedent as Hero.jsx.
const initialState = {
  data: null,
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchSiteSettingsForEdit = createAsyncThunk(
  'siteSettings/fetchForEdit',
  async (_, { getState, rejectWithValue }) => {
    try {
      return await siteSettingsApi.getSiteSettingsForEdit(getState().auth.token)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const saveSiteSettings = createAsyncThunk(
  'siteSettings/save',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await siteSettingsApi.updateSiteSettings(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const siteSettingsSlice = createSlice({
  name: 'siteSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteSettingsForEdit.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSiteSettingsForEdit.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchSiteSettingsForEdit.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(saveSiteSettings.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(saveSiteSettings.fulfilled, (state, action) => {
        state.data = action.payload
        state.mutationStatus = 'succeeded'
      })
      .addCase(saveSiteSettings.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload
      })
  },
})

export default siteSettingsSlice.reducer
