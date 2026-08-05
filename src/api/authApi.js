import { apiRequest } from './client.js'

export function login(email, password) {
  return apiRequest('/api/auth/login', { method: 'POST', body: { email, password } })
}

export function me(token) {
  return apiRequest('/api/auth/me', { token })
}

export function forgotPassword(email) {
  return apiRequest('/api/auth/forgot-password', { method: 'POST', body: { email } })
}

// `resetToken` is the token from the emailed reset link — unrelated to the auth bearer
// token, named distinctly here to avoid confusion with the rest of this API layer.
export function resetPassword(resetToken, newPassword) {
  return apiRequest('/api/auth/reset-password', {
    method: 'POST',
    body: { token: resetToken, newPassword },
  })
}
