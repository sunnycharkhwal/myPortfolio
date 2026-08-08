import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api/contentPresetsApi.js'

// Unpaginated, single flat `items` array split client-side by `kind` — same "load
// everything once, derive views locally" approach as projectCategoriesSlice.js. The
// dashboard's ContentPresetsPanel needs all four kinds at once (one CRUD screen, four
// sections); ProjectFormModal's per-field pickers just filter this same array by kind
// rather than each firing their own kind-scoped fetch.
const initialState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchContentPresets = createAsyncThunk(
  'contentPresets/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      return await api.listContentPresets(getState().auth.token)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createContentPreset = createAsyncThunk(
  'contentPresets/create',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await api.createContentPreset(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateContentPreset = createAsyncThunk(
  'contentPresets/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      return await api.updateContentPreset(getState().auth.token, id, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteContentPreset = createAsyncThunk(
  'contentPresets/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      await api.removeContentPreset(getState().auth.token, id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// IMPORTANT: every addCase must precede every addMatcher in this chain — see
// projectCategoriesSlice.js's precedent for why (RTK builder ordering requirement).
const contentPresetsSlice = createSlice({
  name: 'contentPresets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentPresets.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchContentPresets.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchContentPresets.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addMatcher(
        (action) =>
          [createContentPreset.pending, updateContentPreset.pending, deleteContentPreset.pending].some((t) =>
            t.match(action)
          ),
        (state) => {
          state.mutationStatus = 'loading'
          state.error = null
        }
      )
      .addMatcher(
        (action) =>
          [createContentPreset.fulfilled, updateContentPreset.fulfilled, deleteContentPreset.fulfilled].some((t) =>
            t.match(action)
          ),
        (state) => {
          state.mutationStatus = 'succeeded'
        }
      )
      .addMatcher(
        (action) =>
          [createContentPreset.rejected, updateContentPreset.rejected, deleteContentPreset.rejected].some((t) =>
            t.match(action)
          ),
        (state, action) => {
          state.mutationStatus = 'failed'
          state.error = action.payload
        }
      )
  },
})

export default contentPresetsSlice.reducer
