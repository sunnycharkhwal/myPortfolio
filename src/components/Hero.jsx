import Terminal from './Terminal.jsx'
import scrollTo from '../utils/scrollTo.js'

export default function Hero() {
  return (
    <div id="hero" className="sc-hero">
      {/* Left — text content */}
      <div style={{ maxWidth: 580, flex: '1 1 300px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)',
          letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1.5rem',
          animation: 'fadeUp .6s ease both',
        }}>
          <span style={{ width: 28, height: 1, background: 'var(--accent)', display: 'inline-block' }} />
          DevOps Engineer · New Delhi, India
        </div>

        <h1 style={{
          fontFamily: 'var(--mono)', fontWeight: 700, lineHeight: 1.08,
          letterSpacing: '-.02em', marginBottom: '1.5rem',
          fontSize: 'clamp(2.4rem, 6vw, 5rem)',
          animation: 'fadeUp .65s .1s ease both',
        }}>
          <span style={{ color: 'var(--text)', display: 'block' }}>Sunny</span>
          <span style={{ color: 'var(--text)', display: 'block' }}>Charkhwal</span>
          <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '1.5px var(--accent)' }}>
            DevOps.
          </span>
        </h1>

        <p style={{
          fontSize: '1.05rem', color: 'var(--muted)', maxWidth: 500,
          marginBottom: '2.5rem', lineHeight: 1.85,
          animation: 'fadeUp .65s .2s ease both',
        }}>
          Building production-grade DevSecOps pipelines on AWS. Specialising in
          Kubernetes, Terraform, CI/CD automation, and cloud-native infrastructure
          that ships reliably at scale.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', animation: 'fadeUp .65s .3s ease both' }}>
          <button className="sc-btn-p" onClick={() => scrollTo('projects')}>View Projects →</button>
          <button className="sc-btn-o" onClick={() => scrollTo('contact')}>Get In Touch</button>
        </div>

        {/* Quick stats */}
        <div style={{
          display: 'flex', gap: '2.5rem', marginTop: '2.5rem', flexWrap: 'wrap',
          animation: 'fadeUp .65s .45s ease both',
        }}>
          {[['2.5+', 'Years Experience'], ['8+', 'DevOps Tools'], ['30+', 'Projects Delivered']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)' }}>{v}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — terminal */}
      <div style={{ flex: '0 0 auto', animation: 'fadeUp .65s .5s ease both' }}>
        <Terminal />
      </div>
    </div>
  )
}
