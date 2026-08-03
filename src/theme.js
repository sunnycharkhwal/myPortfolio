import { createTheme } from '@mui/material/styles'

/**
 * MUI dark theme aligned with the site's SCSS design tokens (src/scss/_variables.scss → :root in _base.scss).
 * No CssBaseline is used — the app already ships its own global reset — so this
 * theme only styles MUI components (Dialog, Button, Fab, IconButton, …).
 */
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00d4ff' },       // --accent
    secondary: { main: '#a855f7' },     // --accent-purple
    success: { main: '#10b981' },       // --accent-green
    error: { main: '#ff6b6b' },         // --accent-pink
    background: { default: '#0a0a0f', paper: '#16161e' },
    text: { primary: '#ffffff', secondary: '#a1a1aa' },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  shape: { borderRadius: 12 },
})
