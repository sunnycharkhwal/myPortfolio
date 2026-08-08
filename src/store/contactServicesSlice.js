import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as contactServicesApi from '../api/contactServicesApi.js'

// Unpaginated — same precedent as projectsSlice.js/skillsSlice.js (small, bounded
// dataset). Filtering/reordering happens client-side in ContactPanel.jsx over the full
// fetched array.
const initialState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchContactServices = createAsyncThunk('contactServices/fetch', async (_, { rejectWithValue }) => {
  try {
    return await contactServicesApi.listContactServices()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createContactService = createAsyncThunk(
  'contactServices/create',
  async (data, { getState, rejectWithValue }) => {
    try {
      return await contactServicesApi.createContactService(getState().auth.token, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateContactService = createAsyncThunk(
  'contactServices/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      return await contactServicesApi.updateContactService(getState().auth.token, id, data)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteContactService = createAsyncThunk(
  'contactServices/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      await contactServicesApi.removeContactService(getState().auth.token, id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const contactServicesSlice = createSlice({
  name: 'contactServices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactServices.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchContactServices.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchContactServices.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addMatcher(
        (action) => [createContactService.pending, updateContactService.pending, deleteContactService.pending].some((t) => t.match(action)),
        (state) => {
          state.mutationStatus = 'loading'
          state.error = null
        }
      )
      .addMatcher(
        (action) => [createContactService.fulfilled, updateContactService.fulfilled, deleteContactService.fulfilled].some((t) => t.match(action)),
        (state) => {
          state.mutationStatus = 'succeeded'
        }
      )
      .addMatcher(
        (action) => [createContactService.rejected, updateContactService.rejected, deleteContactService.rejected].some((t) => t.match(action)),
        (state, action) => {
          state.mutationStatus = 'failed'
          state.error = action.payload
        }
      )
  },
})

export default contactServicesSlice.reducer
