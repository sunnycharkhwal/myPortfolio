import { useState, useEffect, useRef } from 'react'
import { TERMINAL_LINES } from '../data/index.js'

export default function Terminal() {
  const [lines, setLines] = useState([])
  const [tick, setTick] = useState(true)
  const idx = useRef(0)

  useEffect(() => {
    const next = () => {
      if (idx.current >= TERMINAL_LINES.length) return
      const l = TERMINAL_LINES[idx.current++]
      setLines(prev => [...prev, l])
      const delay = l.type === 'blank' ? 80 : l.type === 'prompt' ? 280 : 140
      setTimeout(next, delay)
    }

    const t = setTimeout(next, 500)
    const b = setInterval(() => setTick(v => !v), 530)
    return () => { clearTimeout(t); clearInterval(b) }
  }, [])

  return (
    <div className="sc-terminal">
      
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: 8, 
        padding: '14px 18px', 
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { bg: '#ff5f56', shadow: '0 0 8px #ff5f56' },
            { bg: '#ffbd2e', shadow: '0 0 8px #ffbd2e' },
            { bg: '#27c93f', shadow: '0 0 8px #27c93f' }
          ].map((c, i) => (
            <span key={i} style={{ 
              width: 12, height: 12, borderRadius: '50%', 
              background: c.bg, 
              boxShadow: c.shadow,
              display: 'inline-block',
              transition: 'transform 0.2s',
              cursor: 'pointer',
            }} />
          ))}
        </div>
        <span style={{ 
          flex: 1, textAlign: 'center', 
          fontFamily: 'var(--mono)', fontSize: 12, 
          color: 'var(--muted)',
          letterSpacing: '0.02em',
        }}>
          sunny@devops ~ zsh
        </span>
        <div style={{ width: 52 }} /> 
      </div>

      
      <div style={{ 
        padding: '1.5rem 1.5rem', 
        minHeight: 280, 
        fontFamily: 'var(--mono)', 
        fontSize: 13, 
        lineHeight: 2,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.02) 100%)',
      }}>
        {lines.map((l, i) => {
          if (l.type === 'blank') return <div key={i} style={{ height: 10 }} />

          if (l.type === 'cursor') return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ 
                color: 'var(--accent-green)', 
                textShadow: '0 0 10px var(--accent-green)',
                fontWeight: 500,
              }}>sunny@aws</span>
              <span style={{ color: 'var(--muted)' }}>:~$</span>
              <span style={{
                display: 'inline-block', width: 10, height: 18,
                background: tick ? 'var(--accent)' : 'transparent',
                boxShadow: tick ? '0 0 10px var(--accent)' : 'none',
                marginLeft: 8, verticalAlign: 'middle', 
                borderRadius: 2,
                transition: 'all .15s ease',
              }} />
            </div>
          )

          if (l.type === 'prompt') return (
            <div key={i} style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ 
                color: 'var(--accent-green)', 
                textShadow: '0 0 10px var(--accent-green)',
                fontWeight: 500,
              }}>sunny@aws</span>
              <span style={{ color: 'var(--muted)' }}>:~$</span>
              <span style={{ 
                color: 'var(--text)', 
                marginLeft: 8,
                textShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              }}>{l.cmd}</span>
            </div>
          )

          return (
            <div key={i} style={{ color: 'var(--text-secondary)' }}>
              {l.text}
              {l.hi && <span style={{ 
                color: 'var(--accent)', 
                textShadow: '0 0 10px var(--accent)',
              }}>{l.hi}</span>}
              {l.rest && <span>{l.rest}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
