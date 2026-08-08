import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as footerTechIconsApi from '../api/footerTechIconsApi.js'

// Unpaginated — same precedent as projectsSlice.js/skillsSlice.js (small, bounded
// dataset). Filtering/reordering happens client-side in FooterPanel.jsx over the full
// fetched array.
const initialState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchFooterTechIcons = createAsyncThunk('footerTechIcons/fetch', async (_, { rejectWithValue }) => {
  try {
    return await footerTechIconsApi.listFooterTechIcons()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createFooterTechIcon = createAsyncThunk(
  'footerTechIcons/create',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await footerTechIconsApi.createFooterTechIcon(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateFooterTechIcon = createAsyncThunk(
  'footerTechIcons/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      return await footerTechIconsApi.updateFooterTechIcon(getState().auth.token, id, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteFooterTechIcon = createAsyncThunk(
  'footerTechIcons/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      await footerTechIconsApi.removeFooterTechIcon(getState().auth.token, id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const footerTechIconsSlice = createSlice({
  name: 'footerTechIcons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFooterTechIcons.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFooterTechIcons.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchFooterTechIcons.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addMatcher(
        (action) => [createFooterTechIcon.pending, updateFooterTechIcon.pending, deleteFooterTechIcon.pending].some((t) => t.match(action)),
        (state) => {
          state.mutationStatus = 'loading'
          state.error = null
        }
      )
      .addMatcher(
        (action) => [createFooterTechIcon.fulfilled, updateFooterTechIcon.fulfilled, deleteFooterTechIcon.fulfilled].some((t) => t.match(action)),
        (state) => {
          state.mutationStatus = 'succeeded'
        }
      )
      .addMatcher(
        (action) => [createFooterTechIcon.rejected, updateFooterTechIcon.rejected, deleteFooterTechIcon.rejected].some((t) => t.match(action)),
        (state, action) => {
          state.mutationStatus = 'failed'
          state.error = action.payload
        }
      )
  },
})

export default footerTechIconsSlice.reducer
