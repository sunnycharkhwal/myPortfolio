import { apiRequest } from './client.js'

// Public — drives the actual portfolio Hero section, no auth needed to read it.
export function getHero() {
  return apiRequest('/api/hero')
}
// Protected — the dashboard's edit form; same doc as getHero(), just doesn't require
// anything to exist yet (see heroController.js's getHeroForEdit).
export function getHeroForEdit(token) {
  return apiRequest('/api/hero/manage', { token })
}
export function updateHero(token, data) {
  return apiRequest('/api/hero', { method: 'PUT', token, body: data })
}
