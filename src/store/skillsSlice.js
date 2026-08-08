import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as skillsApi from '../api/skillsApi.js'

// Unpaginated — same precedent as projectsSlice.js (small, bounded dataset). Filtering/
// reordering happens client-side in SkillsPanel.jsx over the full fetched array.
const initialState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchSkillCategories = createAsyncThunk('skills/fetch', async (_, { rejectWithValue }) => {
  try {
    return await skillsApi.listSkillCategories()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createSkillCategory = createAsyncThunk(
  'skills/create',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await skillsApi.createSkillCategory(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateSkillCategory = createAsyncThunk(
  'skills/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      return await skillsApi.updateSkillCategory(getState().auth.token, id, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteSkillCategory = createAsyncThunk(
  'skills/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      await skillsApi.removeSkillCategory(getState().auth.token, id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkillCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSkillCategories.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchSkillCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addMatcher(
        (action) => [createSkillCategory.pending, updateSkillCategory.pending, deleteSkillCategory.pending].some((t) => t.match(action)),
        (state) => {
          state.mutationStatus = 'loading'
          state.error = null
        }
      )
      .addMatcher(
        (action) => [createSkillCategory.fulfilled, updateSkillCategory.fulfilled, deleteSkillCategory.fulfilled].some((t) => t.match(action)),
        (state) => {
          state.mutationStatus = 'succeeded'
        }
      )
      .addMatcher(
        (action) => [createSkillCategory.rejected, updateSkillCategory.rejected, deleteSkillCategory.rejected].some((t) => t.match(action)),
        (state, action) => {
          state.mutationStatus = 'failed'
          state.error = action.payload
        }
      )
  },
})

export default skillsSlice.reducer
