import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './uiSlice.js'
import authReducer from './authSlice.js'
import projectsReducer from './projectsSlice.js'
import projectCategoriesReducer from './projectCategoriesSlice.js'
import experienceSectionReducer from './experienceSectionSlice.js'
import contentPresetsReducer from './contentPresetsSlice.js'
import heroReducer from './heroSlice.js'
import skillsReducer from './skillsSlice.js'
import skillsSectionReducer from './skillsSectionSlice.js'
import contactServicesReducer from './contactServicesSlice.js'
import contactSettingsReducer from './contactSettingsSlice.js'
import footerLinksReducer from './footerLinksSlice.js'
import footerTechIconsReducer from './footerTechIconsSlice.js'
import footerSettingsReducer from './footerSettingsSlice.js'
import siteSettingsReducer from './siteSettingsSlice.js'
import siteNavLinksReducer from './siteNavLinksSlice.js'
import toastReducer from './toastSlice.js'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    projects: projectsReducer,
    projectCategories: projectCategoriesReducer,
    experienceSection: experienceSectionReducer,
    contentPresets: contentPresetsReducer,
    hero: heroReducer,
    skills: skillsReducer,
    skillsSection: skillsSectionReducer,
    contactServices: contactServicesReducer,
    contactSettings: contactSettingsReducer,
    footerLinks: footerLinksReducer,
    footerTechIcons: footerTechIconsReducer,
    footerSettings: footerSettingsReducer,
    siteSettings: siteSettingsReducer,
    siteNavLinks: siteNavLinksReducer,
    toast: toastReducer,
  },
})
