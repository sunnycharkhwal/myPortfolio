import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const h = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  if (!show) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={e => { 
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'
        e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 212, 255, 0.5), 0 10px 30px rgba(0, 0, 0, 0.4)'
      }}
      onMouseLeave={e => { 
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.3), 0 8px 20px rgba(0, 0, 0, 0.3)'
      }}
      aria-label="Back to top"
      style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 300,
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--gradient-1)',
        backgroundSize: '200% 200%',
        color: '#0a0a0f',
        border: 'none', cursor: 'pointer', fontSize: 22, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 30px rgba(0, 212, 255, 0.3), 0 8px 20px rgba(0, 0, 0, 0.3)',
        transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'scaleIn 0.3s ease, gradientShift 4s ease infinite',
      }}
    >
      ↑
    </button>
  )
}
