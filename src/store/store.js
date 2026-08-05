import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './uiSlice.js'
import authReducer from './authSlice.js'
import projectsReducer from './projectsSlice.js'
import projectCategoriesReducer from './projectCategoriesSlice.js'
import experienceSectionReducer from './experienceSectionSlice.js'
import toastReducer from './toastSlice.js'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    projects: projectsReducer,
    projectCategories: projectCategoriesReducer,
    experienceSection: experienceSectionReducer,
    toast: toastReducer,
  },
})
