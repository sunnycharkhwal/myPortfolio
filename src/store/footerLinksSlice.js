import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as footerLinksApi from '../api/footerLinksApi.js'

// Unpaginated — same precedent as projectsSlice.js/skillsSlice.js (small, bounded
// dataset). Filtering/reordering happens client-side in FooterPanel.jsx over the full
// fetched array.
const initialState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchFooterLinks = createAsyncThunk('footerLinks/fetch', async (_, { rejectWithValue }) => {
  try {
    return await footerLinksApi.listFooterLinks()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createFooterLink = createAsyncThunk(
  'footerLinks/create',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await footerLinksApi.createFooterLink(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateFooterLink = createAsyncThunk(
  'footerLinks/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      return await footerLinksApi.updateFooterLink(getState().auth.token, id, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteFooterLink = createAsyncThunk(
  'footerLinks/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      await footerLinksApi.removeFooterLink(getState().auth.token, id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const footerLinksSlice = createSlice({
  name: 'footerLinks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFooterLinks.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFooterLinks.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchFooterLinks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addMatcher(
        (action) => [createFooterLink.pending, updateFooterLink.pending, deleteFooterLink.pending].some((t) => t.match(action)),
        (state) => {
          state.mutationStatus = 'loading'
          state.error = null
        }
      )
      .addMatcher(
        (action) => [createFooterLink.fulfilled, updateFooterLink.fulfilled, deleteFooterLink.fulfilled].some((t) => t.match(action)),
        (state) => {
          state.mutationStatus = 'succeeded'
        }
      )
      .addMatcher(
        (action) => [createFooterLink.rejected, updateFooterLink.rejected, deleteFooterLink.rejected].some((t) => t.match(action)),
        (state, action) => {
          state.mutationStatus = 'failed'
          state.error = action.payload
        }
      )
  },
})

export default footerLinksSlice.reducer
