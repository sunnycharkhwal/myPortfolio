import { apiRequest } from './client.js'

// Public content — list takes no token, matching experienceApi.js's shape. Used by both
// the dashboard (still just a read there) and the public portfolio page.
export function listProjects() {
  return apiRequest('/api/projects')
}
export function createProject(token, data) {
  return apiRequest('/api/projects', { method: 'POST', token, body: data })
}
export function updateProject(token, id, data) {
  return apiRequest(`/api/projects/${id}`, { method: 'PUT', token, body: data })
}
export function removeProject(token, id) {
  return apiRequest(`/api/projects/${id}`, { method: 'DELETE', token })
}
