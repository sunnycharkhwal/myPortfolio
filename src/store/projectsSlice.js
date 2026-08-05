import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as projectsApi from '../api/projectsApi.js'

// Unpaginated — matches the Experience slices' precedent (small, bounded dataset,
// ~16-30 items) rather than the old paginated shape. Filtering happens client-side in
// ProjectsPanel.jsx over the full fetched array, same as the public Projects.jsx already
// does — no server round-trip needed since everything is loaded at once.
const initialState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchProjects = createAsyncThunk('projects/fetch', async (_, { rejectWithValue }) => {
  try {
    return await projectsApi.listProjects()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createProject = createAsyncThunk(
  'projects/create',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await projectsApi.createProject(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      return await projectsApi.updateProject(getState().auth.token, id, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      await projectsApi.removeProject(getState().auth.token, id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addMatcher(
        (action) => [createProject.pending, updateProject.pending, deleteProject.pending].some((t) => t.match(action)),
        (state) => {
          state.mutationStatus = 'loading'
          state.error = null
        }
      )
      .addMatcher(
        (action) => [createProject.fulfilled, updateProject.fulfilled, deleteProject.fulfilled].some((t) => t.match(action)),
        (state) => {
          state.mutationStatus = 'succeeded'
        }
      )
      .addMatcher(
        (action) => [createProject.rejected, updateProject.rejected, deleteProject.rejected].some((t) => t.match(action)),
        (state, action) => {
          state.mutationStatus = 'failed'
          state.error = action.payload
        }
      )
  },
})

export default projectsSlice.reducer
