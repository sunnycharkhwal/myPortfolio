import { apiRequest } from './client.js'

// Public — drives the Nav logo and every section's heading/visibility, no auth needed
// to read it.
export function getSiteSettings() {
  return apiRequest('/api/site-settings')
}
// Protected — the dashboard's edit form; same doc as getSiteSettings(), just doesn't
// require anything to exist yet (see siteSettingsController.js's getSiteSettingsForEdit).
export function getSiteSettingsForEdit(token) {
  return apiRequest('/api/site-settings/manage', { token })
}
export function updateSiteSettings(token, data) {
  return apiRequest('/api/site-settings', { method: 'PUT', token, body: data })
}
