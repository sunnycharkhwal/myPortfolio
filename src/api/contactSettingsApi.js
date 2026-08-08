import { apiRequest } from './client.js'

// Public — drives the actual email/phone/LinkedIn/GitHub/location used by both
// Contact.jsx and Footer.jsx, no auth needed to read it.
export function getContactSettings() {
  return apiRequest('/api/contact-settings')
}
// Protected — the dashboard's edit form; same doc as getContactSettings(), just
// doesn't require anything to exist yet (see contactSettingsController.js's
// getContactSettingsForEdit).
export function getContactSettingsForEdit(token) {
  return apiRequest('/api/contact-settings/manage', { token })
}
export function updateContactSettings(token, data) {
  return apiRequest('/api/contact-settings', { method: 'PUT', token, body: data })
}
