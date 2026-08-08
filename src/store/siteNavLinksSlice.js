import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as siteNavLinksApi from '../api/siteNavLinksApi.js'

// Unpaginated — same precedent as projectsSlice.js/footerLinksSlice.js (small, bounded
// dataset). Filtering/reordering happens client-side in SiteNavLinksSection.jsx over
// the full fetched array.
const initialState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchSiteNavLinks = createAsyncThunk('siteNavLinks/fetch', async (_, { rejectWithValue }) => {
  try {
    return await siteNavLinksApi.listSiteNavLinks()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createSiteNavLink = createAsyncThunk(
  'siteNavLinks/create',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await siteNavLinksApi.createSiteNavLink(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateSiteNavLink = createAsyncThunk(
  'siteNavLinks/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      return await siteNavLinksApi.updateSiteNavLink(getState().auth.token, id, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteSiteNavLink = createAsyncThunk(
  'siteNavLinks/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      await siteNavLinksApi.removeSiteNavLink(getState().auth.token, id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const siteNavLinksSlice = createSlice({
  name: 'siteNavLinks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteNavLinks.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSiteNavLinks.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchSiteNavLinks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addMatcher(
        (action) => [createSiteNavLink.pending, updateSiteNavLink.pending, deleteSiteNavLink.pending].some((t) => t.match(action)),
        (state) => {
          state.mutationStatus = 'loading'
          state.error = null
        }
      )
      .addMatcher(
        (action) => [createSiteNavLink.fulfilled, updateSiteNavLink.fulfilled, deleteSiteNavLink.fulfilled].some((t) => t.match(action)),
        (state) => {
          state.mutationStatus = 'succeeded'
        }
      )
      .addMatcher(
        (action) => [createSiteNavLink.rejected, updateSiteNavLink.rejected, deleteSiteNavLink.rejected].some((t) => t.match(action)),
        (state, action) => {
          state.mutationStatus = 'failed'
          state.error = action.payload
        }
      )
  },
})

export default siteNavLinksSlice.reducer
