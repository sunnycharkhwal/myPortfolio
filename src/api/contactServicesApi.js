import { apiRequest } from './client.js'

// Public content — list takes no token, drives the public Contact section's "How I Can
// Help You" cards. Used by both the dashboard (still just a read there) and the public
// portfolio page, same shape as skillsApi.js.
export function listContactServices() {
  return apiRequest('/api/contact-services')
}
export function createContactService(token, data) {
  return apiRequest('/api/contact-services', { method: 'POST', token, body: data })
}
export function updateContactService(token, id, data) {
  return apiRequest(`/api/contact-services/${id}`, { method: 'PUT', token, body: data })
}
export function removeContactService(token, id) {
  return apiRequest(`/api/contact-services/${id}`, { method: 'DELETE', token })
}
