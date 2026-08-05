import { apiRequest } from './client.js'

// Work history — list calls take no token: these are public reads, used by both the
// dashboard (still just a read there, no auth needed even for the admin) and the
// public portfolio page.
export function listWorkHistory() {
  return apiRequest('/api/experience')
}
export function createWorkHistory(token, data) {
  return apiRequest('/api/experience', { method: 'POST', token, body: data })
}
export function updateWorkHistory(token, id, data) {
  return apiRequest(`/api/experience/${id}`, { method: 'PUT', token, body: data })
}
export function removeWorkHistory(token, id) {
  return apiRequest(`/api/experience/${id}`, { method: 'DELETE', token })
}

// Achievements
export function listAchievements() {
  return apiRequest('/api/achievements')
}
export function createAchievement(token, data) {
  return apiRequest('/api/achievements', { method: 'POST', token, body: data })
}
export function updateAchievement(token, id, data) {
  return apiRequest(`/api/achievements/${id}`, { method: 'PUT', token, body: data })
}
export function removeAchievement(token, id) {
  return apiRequest(`/api/achievements/${id}`, { method: 'DELETE', token })
}

// Education
export function listEducation() {
  return apiRequest('/api/education')
}
export function createEducation(token, data) {
  return apiRequest('/api/education', { method: 'POST', token, body: data })
}
export function updateEducation(token, id, data) {
  return apiRequest(`/api/education/${id}`, { method: 'PUT', token, body: data })
}
export function removeEducation(token, id) {
  return apiRequest(`/api/education/${id}`, { method: 'DELETE', token })
}
