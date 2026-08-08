import { apiRequest } from './client.js'

// Public content — list takes no token, drives the Footer's tech-icon divider strip.
// Used by both the dashboard (still just a read there) and the public portfolio page,
// same shape as contactServicesApi.js.
export function listFooterTechIcons() {
  return apiRequest('/api/footer-tech-icons')
}
export function createFooterTechIcon(token, data) {
  return apiRequest('/api/footer-tech-icons', { method: 'POST', token, body: data })
}
export function updateFooterTechIcon(token, id, data) {
  return apiRequest(`/api/footer-tech-icons/${id}`, { method: 'PUT', token, body: data })
}
export function removeFooterTechIcon(token, id) {
  return apiRequest(`/api/footer-tech-icons/${id}`, { method: 'DELETE', token })
}
