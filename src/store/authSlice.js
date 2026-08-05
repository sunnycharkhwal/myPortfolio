import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authApi from '../api/authApi.js'

const TOKEN_KEY = 'authToken'

const initialState = {
  token: null,
  user: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' — covers login AND bootstrap
  bootstrapped: false, // true once the initial token-validation check has resolved either way
  error: null,
}

// Runs once on app load, regardless of which route was hit. If a token is already in
// storage, it's re-validated against GET /me before being trusted — a token surviving
// only in localStorage (expired, or invalidated server-side) must never silently grant
// access just because it's present.
export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return { token: null, user: null }

  try {
    const user = await authApi.me(token)
    return { token, user }
  } catch {
    localStorage.removeItem(TOKEN_KEY)
    return { token: null, user: null }
  }
})

// /api/auth/login only returns { token }, not the user — this thunk chains a /me call
// with that token so the slice ends up in the same fully-populated shape either way.
export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { token } = await authApi.login(email, password)
    localStorage.setItem(TOKEN_KEY, token)
    const user = await authApi.me(token)
    return { token, user }
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem(TOKEN_KEY)
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.user = action.payload.user
        state.status = 'succeeded'
        state.bootstrapped = true
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.token = null
        state.user = null
        state.status = 'failed'
        state.bootstrapped = true
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.user = action.payload.user
        state.status = 'succeeded'
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Login failed'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
