import { apiRequest } from './client.js'

// Public content — list takes no token, drives the Footer's "Quick Links" list. Used
// by both the dashboard (still just a read there) and the public portfolio page, same
// shape as contactServicesApi.js.
export function listFooterLinks() {
  return apiRequest('/api/footer-links')
}
export function createFooterLink(token, data) {
  return apiRequest('/api/footer-links', { method: 'POST', token, body: data })
}
export function updateFooterLink(token, id, data) {
  return apiRequest(`/api/footer-links/${id}`, { method: 'PUT', token, body: data })
}
export function removeFooterLink(token, id) {
  return apiRequest(`/api/footer-links/${id}`, { method: 'DELETE', token })
}
