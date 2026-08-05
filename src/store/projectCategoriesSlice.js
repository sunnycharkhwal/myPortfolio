import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api/projectCategoriesApi.js'

// Two fetch thunks share one `items` array: fetchProjectCategories (public,
// enabled-only — used by the public Projects.jsx) and fetchAllProjectCategories (manage,
// enabled+disabled — used by the dashboard). Whichever fires last wins; the dashboard and
// the public site never both mount in the same app instance, so there's no real races.
const initialState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchProjectCategories = createAsyncThunk(
  'projectCategories/fetchPublic',
  async (_, { rejectWithValue }) => {
    try {
      return await api.listProjectCategories()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchAllProjectCategories = createAsyncThunk(
  'projectCategories/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      return await api.listAllProjectCategories(getState().auth.token)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createProjectCategory = createAsyncThunk(
  'projectCategories/create',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await api.createProjectCategory(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateProjectCategory = createAsyncThunk(
  'projectCategories/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      return await api.updateProjectCategory(getState().auth.token, id, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteProjectCategory = createAsyncThunk(
  'projectCategories/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      await api.removeProjectCategory(getState().auth.token, id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// IMPORTANT: every addCase must precede every addMatcher in this chain — RTK requires
// all addCase calls before any addMatcher/addDefaultCase across the WHOLE builder, not
// per-thunk-group. Violating this crashes the entire store at init (see projectsSlice.js
// precedent / this session's earlier experienceSectionSlice.js bug).
const projectCategoriesSlice = createSlice({
  name: 'projectCategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProjectCategories.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchProjectCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchAllProjectCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchAllProjectCategories.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchAllProjectCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addMatcher(
        (action) =>
          [createProjectCategory.pending, updateProjectCategory.pending, deleteProjectCategory.pending].some((t) =>
            t.match(action)
          ),
        (state) => {
          state.mutationStatus = 'loading'
          state.error = null
        }
      )
      .addMatcher(
        (action) =>
          [createProjectCategory.fulfilled, updateProjectCategory.fulfilled, deleteProjectCategory.fulfilled].some(
            (t) => t.match(action)
          ),
        (state) => {
          state.mutationStatus = 'succeeded'
        }
      )
      .addMatcher(
        (action) =>
          [createProjectCategory.rejected, updateProjectCategory.rejected, deleteProjectCategory.rejected].some((t) =>
            t.match(action)
          ),
        (state, action) => {
          state.mutationStatus = 'failed'
          state.error = action.payload
        }
      )
  },
})

export default projectCategoriesSlice.reducer
