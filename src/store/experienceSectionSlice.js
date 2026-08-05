import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as experienceApi from '../api/experienceApi.js'

// One combined slice for all three sub-resources, deliberately deviating from the
// one-slice-per-resource pattern used by projectsSlice.js/expensesSlice.js — unlike
// Projects/Expenses (independent dashboard tabs, each with its own pagination/filter
// state), work history/achievements/education are always managed together on one
// "Experience" dashboard tab and share no independent nav state, so one slice matches
// actual usage better than three near-identical boilerplate slices would.

function makeSubState() {
  return { items: [], status: 'idle', mutationStatus: 'idle', error: null }
}

const initialState = {
  workHistory: makeSubState(),
  achievements: makeSubState(),
  education: makeSubState(),
}

// ── Work History ──────────────────────────────────────────────────────────
export const fetchWorkHistory = createAsyncThunk('experienceSection/fetchWorkHistory', async (_, { rejectWithValue }) => {
  try {
    return await experienceApi.listWorkHistory()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})
export const createWorkHistoryEntry = createAsyncThunk(
  'experienceSection/createWorkHistoryEntry',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await experienceApi.createWorkHistory(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)
export const updateWorkHistoryEntry = createAsyncThunk(
  'experienceSection/updateWorkHistoryEntry',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      return await experienceApi.updateWorkHistory(getState().auth.token, id, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)
export const deleteWorkHistoryEntry = createAsyncThunk(
  'experienceSection/deleteWorkHistoryEntry',
  async (id, { getState, rejectWithValue }) => {
    try {
      await experienceApi.removeWorkHistory(getState().auth.token, id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ── Achievements ──────────────────────────────────────────────────────────
export const fetchAchievements = createAsyncThunk('experienceSection/fetchAchievements', async (_, { rejectWithValue }) => {
  try {
    return await experienceApi.listAchievements()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})
export const createAchievementEntry = createAsyncThunk(
  'experienceSection/createAchievementEntry',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await experienceApi.createAchievement(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)
export const updateAchievementEntry = createAsyncThunk(
  'experienceSection/updateAchievementEntry',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      return await experienceApi.updateAchievement(getState().auth.token, id, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)
export const deleteAchievementEntry = createAsyncThunk(
  'experienceSection/deleteAchievementEntry',
  async (id, { getState, rejectWithValue }) => {
    try {
      await experienceApi.removeAchievement(getState().auth.token, id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ── Education ─────────────────────────────────────────────────────────────
export const fetchEducation = createAsyncThunk('experienceSection/fetchEducation', async (_, { rejectWithValue }) => {
  try {
    return await experienceApi.listEducation()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})
export const createEducationEntry = createAsyncThunk(
  'experienceSection/createEducationEntry',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await experienceApi.createEducation(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)
export const updateEducationEntry = createAsyncThunk(
  'experienceSection/updateEducationEntry',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      return await experienceApi.updateEducation(getState().auth.token, id, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)
export const deleteEducationEntry = createAsyncThunk(
  'experienceSection/deleteEducationEntry',
  async (id, { getState, rejectWithValue }) => {
    try {
      await experienceApi.removeEducation(getState().auth.token, id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const RESOURCES = {
  workHistory: {
    fetchThunk: fetchWorkHistory,
    createThunk: createWorkHistoryEntry,
    updateThunk: updateWorkHistoryEntry,
    deleteThunk: deleteWorkHistoryEntry,
  },
  achievements: {
    fetchThunk: fetchAchievements,
    createThunk: createAchievementEntry,
    updateThunk: updateAchievementEntry,
    deleteThunk: deleteAchievementEntry,
  },
  education: {
    fetchThunk: fetchEducation,
    createThunk: createEducationEntry,
    updateThunk: updateEducationEntry,
    deleteThunk: deleteEducationEntry,
  },
}

// RTK's builder requires every addCase() across the WHOLE chain to come before any
// addMatcher() — not just within one function call. Looping addCase for all three
// resources first, then addMatcher for all three, is what that constraint actually
// requires (an earlier version of this file interleaved them per-resource, which
// throws at store-creation time and crashes the entire app, not just this slice).
function addFetchCases(builder, key, { fetchThunk }) {
  builder
    .addCase(fetchThunk.pending, (state) => {
      state[key].status = 'loading'
    })
    .addCase(fetchThunk.fulfilled, (state, action) => {
      state[key].items = action.payload
      state[key].status = 'succeeded'
    })
    .addCase(fetchThunk.rejected, (state, action) => {
      state[key].status = 'failed'
      state[key].error = action.payload
    })
}

function addMutationMatchers(builder, key, { createThunk, updateThunk, deleteThunk }) {
  builder
    .addMatcher(
      (action) => [createThunk.pending, updateThunk.pending, deleteThunk.pending].some((t) => t.match(action)),
      (state) => {
        state[key].mutationStatus = 'loading'
        state[key].error = null
      }
    )
    .addMatcher(
      (action) => [createThunk.fulfilled, updateThunk.fulfilled, deleteThunk.fulfilled].some((t) => t.match(action)),
      (state) => {
        state[key].mutationStatus = 'succeeded'
      }
    )
    .addMatcher(
      (action) => [createThunk.rejected, updateThunk.rejected, deleteThunk.rejected].some((t) => t.match(action)),
      (state, action) => {
        state[key].mutationStatus = 'failed'
        state[key].error = action.payload
      }
    )
}

const experienceSectionSlice = createSlice({
  name: 'experienceSection',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    for (const [key, thunks] of Object.entries(RESOURCES)) {
      addFetchCases(builder, key, thunks)
    }
    for (const [key, thunks] of Object.entries(RESOURCES)) {
      addMutationMatchers(builder, key, thunks)
    }
  },
})

export default experienceSectionSlice.reducer
