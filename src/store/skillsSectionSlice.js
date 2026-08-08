import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as skillsSectionApi from '../api/skillsSectionApi.js'

// Singleton, not a list — same shape/rationale as heroSlice.js. Used only by the
// dashboard's SkillsSectionForm; the public Skills.jsx component self-fetches via
// skillsSectionApi.js directly instead, same precedent as Hero.jsx/Projects.jsx.
const initialState = {
  data: null,
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchSkillsSectionForEdit = createAsyncThunk(
  'skillsSection/fetchForEdit',
  async (_, { getState, rejectWithValue }) => {
    try {
      return await skillsSectionApi.getSkillsSectionForEdit(getState().auth.token)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const saveSkillsSection = createAsyncThunk(
  'skillsSection/save',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await skillsSectionApi.updateSkillsSection(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const skillsSectionSlice = createSlice({
  name: 'skillsSection',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkillsSectionForEdit.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSkillsSectionForEdit.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchSkillsSectionForEdit.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(saveSkillsSection.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(saveSkillsSection.fulfilled, (state, action) => {
        state.data = action.payload
        state.mutationStatus = 'succeeded'
      })
      .addCase(saveSkillsSection.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload
      })
  },
})

export default skillsSectionSlice.reducer
