import { createSlice } from '@reduxjs/toolkit'

/**
 * App-level UI state.
 *
 * - `activeSection`   which section is currently in view (drives nav highlight)
 * - `projectFilter`   selected category in the Projects section
 * - `selectedProjectId` id of the project shown in the modal (null = closed).
 *                     We store the id, not the object, to keep state serializable.
 */
const initialState = {
  activeSection: 'hero',
  projectFilter: 'all',
  selectedProjectId: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveSection(state, action) {
      state.activeSection = action.payload
    },
    setProjectFilter(state, action) {
      state.projectFilter = action.payload
    },
    openProject(state, action) {
      state.selectedProjectId = action.payload
    },
    closeProject(state) {
      state.selectedProjectId = null
    },
  },
})

export const { setActiveSection, setProjectFilter, openProject, closeProject } =
  uiSlice.actions

export default uiSlice.reducer
