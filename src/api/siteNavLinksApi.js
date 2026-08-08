import { apiRequest } from './client.js'

// Public content — list takes no token, drives the public Nav bar's link list. Used by
// both the dashboard (still just a read there) and the public portfolio page, same
// shape as footerLinksApi.js.
export function listSiteNavLinks() {
  return apiRequest('/api/site-nav-links')
}
export function createSiteNavLink(token, data) {
  return apiRequest('/api/site-nav-links', { method: 'POST', token, body: data })
}
export function updateSiteNavLink(token, id, data) {
  return apiRequest(`/api/site-nav-links/${id}`, { method: 'PUT', token, body: data })
}
export function removeSiteNavLink(token, id) {
  return apiRequest(`/api/site-nav-links/${id}`, { method: 'DELETE', token })
}
