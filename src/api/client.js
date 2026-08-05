import { store } from '../store/store.js'
import { logout } from '../store/authSlice.js'

// The one place import.meta.env.VITE_API_URL is read — every other file goes through
// this module, so the API base URL is never hardcoded anywhere else.
//
// Unset/empty is a deliberate, valid state, not a missing-config bug: it means "same
// origin, relative paths" — which is what local dev wants, since vite.config.js's dev
// proxy forwards /api/* to the backend server-side (no CORS, no port to match). Only
// set VITE_API_URL to an absolute URL when the frontend and backend are genuinely on
// different origins, e.g. Vercel calling a separate Render URL in production.
const API_URL = import.meta.env.VITE_API_URL || ''

function buildQueryString(params) {
  if (!params) return ''
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  )
  if (entries.length === 0) return ''
  return `?${new URLSearchParams(entries).toString()}`
}

export async function apiRequest(path, { method = 'GET', body, params, token } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}${buildQueryString(params)}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  // A response that isn't valid JSON (e.g. the SPA's index.html coming back because
  // VITE_API_URL is unset and the request fell through vercel.json's catch-all rewrite)
  // must not be masked into `{}` — that silently hands callers an object where they
  // expect an array/shape and blows up far from here (e.g. `{}.filter is not a
  // function`). Distinguish "parsed but empty" from "didn't parse" and throw on the
  // latter so the failure is visible at the fetch call site instead.
  let data
  let parseFailed = false
  try {
    data = await res.json()
  } catch {
    parseFailed = true
  }

  if (parseFailed) {
    throw new Error(
      res.ok
        ? `Expected JSON from ${path} but got a non-JSON response (status ${res.status}) — check VITE_API_URL is set correctly`
        : `Request failed with status ${res.status}`
    )
  }

  if (!res.ok) {
    // Only an authenticated request (one that actually attached a token) going stale
    // mid-session should force a global logout+redirect — a 401 from e.g. a wrong
    // password on /login is a normal, expected response the login form handles itself,
    // and must NOT bounce the user away from the page they're trying to log in on.
    if (res.status === 401 && token) {
      store.dispatch(logout())
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    throw new Error(data.message || `Request failed with status ${res.status}`)
  }

  return data
}
