import { apiRequest } from './client.js'

// Public — enabled-only, drives the public site's filter bar.
export function listProjectCategories() {
  return apiRequest('/api/project-categories')
}
// Protected — enabled + disabled, drives the dashboard's Categories panel and the
// Project form's group/category dropdowns.
export function listAllProjectCategories(token) {
  return apiRequest('/api/project-categories/manage', { token })
}
export function createProjectCategory(token, data) {
  return apiRequest('/api/project-categories', { method: 'POST', token, body: data })
}
export function updateProjectCategory(token, id, data) {
  return apiRequest(`/api/project-categories/${id}`, { method: 'PUT', token, body: data })
}
export function removeProjectCategory(token, id) {
  return apiRequest(`/api/project-categories/${id}`, { method: 'DELETE', token })
}
