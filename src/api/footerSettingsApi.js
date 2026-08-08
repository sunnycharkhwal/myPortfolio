import { apiRequest } from './client.js'

// Public — drives the Footer's own brand name/role/bio/terminal line, no auth needed
// to read it.
export function getFooterSettings() {
  return apiRequest('/api/footer-settings')
}
// Protected — the dashboard's edit form; same doc as getFooterSettings(), just
// doesn't require anything to exist yet (see footerSettingsController.js's
// getFooterSettingsForEdit).
export function getFooterSettingsForEdit(token) {
  return apiRequest('/api/footer-settings/manage', { token })
}
export function updateFooterSettings(token, data) {
  return apiRequest('/api/footer-settings', { method: 'PUT', token, body: data })
}
