export default function SectionHeader({ num, title, subtitle }) {
  return (
    <div style={{ 
      textAlign: 'center', 
      marginBottom: '4rem',
      position: 'relative',
    }}>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{
          width: 60,
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--border))',
        }} />
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: 12,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          background: 'rgba(0, 212, 255, 0.08)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          padding: '6px 16px',
          borderRadius: 50,
          fontWeight: 600,
        }}>
          {`0${num}`}
        </span>
        <div style={{
          width: 60,
          height: 1,
          background: 'linear-gradient(90deg, var(--border), transparent)',
        }} />
      </div>

      
      <h2 style={{
        fontFamily: 'var(--sans)',
        fontWeight: 800,
        fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
        marginBottom: subtitle ? '1rem' : 0,
        position: 'relative',
        display: 'inline-block',
      }}>
        <span style={{
          background: 'linear-gradient(135deg, var(--text) 0%, var(--text) 50%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {title}
        </span>
        
        <span style={{
          position: 'absolute',
          top: '15%',
          right: -20,
          width: 10,
          height: 10,
          background: 'var(--accent)',
          borderRadius: '50%',
          boxShadow: '0 0 20px var(--accent), 0 0 40px var(--accent)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      </h2>

      
      {subtitle && (
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          maxWidth: 500,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          {subtitle}
        </p>
      )}

      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 6,
        marginTop: '1.5rem',
      }}>
        <div style={{
          width: 30,
          height: 3,
          background: 'var(--accent)',
          borderRadius: 10,
        }} />
        <div style={{
          width: 8,
          height: 3,
          background: 'var(--accent-purple)',
          borderRadius: 10,
        }} />
        <div style={{
          width: 4,
          height: 3,
          background: 'var(--accent-green)',
          borderRadius: 10,
        }} />
      </div>
    </div>
  )
}
