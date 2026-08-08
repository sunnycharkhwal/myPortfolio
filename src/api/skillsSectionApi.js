import { apiRequest } from './client.js'

// Public — drives the copy around the public Skills grid, no auth needed to read it.
export function getSkillsSection() {
  return apiRequest('/api/skills-section')
}
// Protected — the dashboard's edit form; same doc as getSkillsSection(), just doesn't
// require anything to exist yet (see skillsSectionController.js's getSkillsSectionForEdit).
export function getSkillsSectionForEdit(token) {
  return apiRequest('/api/skills-section/manage', { token })
}
export function updateSkillsSection(token, data) {
  return apiRequest('/api/skills-section', { method: 'PUT', token, body: data })
}
