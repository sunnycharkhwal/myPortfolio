import { useState, useEffect, useRef } from 'react'
import Fab from '@mui/material/Fab'
import Zoom from '@mui/material/Zoom'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export default function BackToTop() {
  const [show, setShow] = useState(false)
  const footerRef = useRef(null)
  const tickingRef = useRef(false)

  useEffect(() => {
    footerRef.current = document.querySelector('footer')

    // Hide once the footer (which has its own "Top" control) scrolls into view,
    // so the fixed FAB never sits on top of it. Reading getBoundingClientRect is a
    // layout read, so it's throttled to once per animation frame instead of running
    // on every raw scroll event.
    const update = () => {
      const footer = footerRef.current
      const nearFooter = footer && footer.getBoundingClientRect().top < window.innerHeight
      setShow(window.scrollY > 500 && !nearFooter)
      tickingRef.current = false
    }
    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <Zoom in={show}>
      <Fab
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 300,
          color: '#0a0a0f',
          background: 'var(--gradient-1)',
          backgroundSize: '200% 200%',
          boxShadow: '0 0 30px rgba(0, 212, 255, 0.3), 0 8px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'var(--gradient-1)',
            transform: 'translateY(-4px) scale(1.05)',
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.5), 0 10px 30px rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  )
}
