import { apiRequest } from './client.js'

// Public content — list takes no token, drives the public Tech Stack section. Used by
// both the dashboard (still just a read there) and the public portfolio page, same
// shape as projectsApi.js/experienceApi.js.
export function listSkillCategories() {
  return apiRequest('/api/skills')
}
export function createSkillCategory(token, data) {
  return apiRequest('/api/skills', { method: 'POST', token, body: data })
}
export function updateSkillCategory(token, id, data) {
  return apiRequest(`/api/skills/${id}`, { method: 'PUT', token, body: data })
}
export function removeSkillCategory(token, id) {
  return apiRequest(`/api/skills/${id}`, { method: 'DELETE', token })
}
