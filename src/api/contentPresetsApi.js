import { apiRequest } from './client.js'

// Admin-only — dashboard authoring aid for the project form's "attach a pre-defined
// item" pickers. Never called from the public site (unlike projectsApi.js/experienceApi.js,
// every call here always carries a token).
export function listContentPresets(token, kind) {
  return apiRequest('/api/content-presets', { token, params: kind ? { kind } : undefined })
}
export function createContentPreset(token, data) {
  return apiRequest('/api/content-presets', { method: 'POST', token, body: data })
}
export function updateContentPreset(token, id, data) {
  return apiRequest(`/api/content-presets/${id}`, { method: 'PUT', token, body: data })
}
export function removeContentPreset(token, id) {
  return apiRequest(`/api/content-presets/${id}`, { method: 'DELETE', token })
}
