import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as heroApi from '../api/heroApi.js'

// Singleton, not a list — `data` is the one Hero doc (or null before it's ever been
// saved), unlike projectsSlice/experienceSectionSlice's `items` arrays. Used only by
// the dashboard's HeroPanel; the public Hero.jsx component self-fetches via heroApi.js
// directly instead (same precedent as Projects.jsx/Experience.jsx not using Redux for
// their own public content).
const initialState = {
  data: null,
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchHeroForEdit = createAsyncThunk(
  'hero/fetchForEdit',
  async (_, { getState, rejectWithValue }) => {
    try {
      return await heroApi.getHeroForEdit(getState().auth.token)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const saveHero = createAsyncThunk('hero/save', async (data, { getState, rejectWithValue }) => {
  try {
    return await heroApi.updateHero(getState().auth.token, data)
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const heroSlice = createSlice({
  name: 'hero',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroForEdit.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchHeroForEdit.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchHeroForEdit.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(saveHero.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = null
      })
      .addCase(saveHero.fulfilled, (state, action) => {
        state.data = action.payload
        state.mutationStatus = 'succeeded'
      })
      .addCase(saveHero.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload
      })
  },
})

export default heroSlice.reducer
