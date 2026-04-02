import { useRef, useEffect, useState } from 'react'
import SectionHeader from './SectionHeader.jsx'
import useFadeIn from '../hooks/useFadeIn.js'
import { 
  SiTerraform, SiKubernetes, SiDocker, 
  SiJenkins, SiGrafana, SiPrometheus, SiHelm 
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'

const floatingIcons = [
  { Icon: SiTerraform, color: '#7B42BC', delay: 0 },
  { Icon: FaAws, color: '#FF9900', delay: 0.5 },
  { Icon: SiKubernetes, color: '#326CE5', delay: 1 },
  { Icon: SiDocker, color: '#2496ED', delay: 1.5 },
  { Icon: SiJenkins, color: '#D24939', delay: 2 },
  { Icon: SiGrafana, color: '#F46800', delay: 2.5 },
  { Icon: SiPrometheus, color: '#E6522C', delay: 3 },
  { Icon: SiHelm, color: '#0F1689', delay: 3.5 },
]

const services = [
  { 
    icon: '☁️', 
    title: 'Cloud Architecture', 
    desc: 'AWS, GCP, Azure infrastructure design & migration',
    gradient: 'linear-gradient(135deg, #FF9900 0%, #ff6b35 100%)'
  },
  { 
    icon: '🚀', 
    title: 'CI/CD Pipelines', 
    desc: 'Automated deployments with Jenkins, ArgoCD, GitHub Actions',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)'
  },
  { 
    icon: '📦', 
    title: 'Container Orchestration', 
    desc: 'Kubernetes clusters, Helm charts, Docker optimization',
    gradient: 'linear-gradient(135deg, #326CE5 0%, #1e4db7 100%)'
  },
  { 
    icon: '🏗️', 
    title: 'Infrastructure as Code', 
    desc: 'Terraform, Ansible automation & best practices',
    gradient: 'linear-gradient(135deg, #7B42BC 0%, #5a2d91 100%)'
  },
]

export default function Contact() {
  const ref = useRef()
  const [isVisible, setIsVisible] = useState(false)
  useFadeIn(ref)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" ref={ref} className="sc-section" style={{ overflow: 'hidden' }}>
      <SectionHeader num="04" title="Get In Touch" />

      
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 32,
        padding: 'clamp(2rem, 5vw, 4rem)',
        marginBottom: '3rem',
        overflow: 'hidden',
        boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 212, 255, 0.05)',
      }}>
        
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `
            radial-gradient(circle at 30% 20%, rgba(123, 66, 188, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, rgba(255, 153, 0, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.08) 0%, transparent 50%)
          `,
          animation: isVisible ? 'gradientShift 15s ease infinite' : 'none',
          pointerEvents: 'none',
        }} />

        
        {floatingIcons.map(({ Icon, color, delay }, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              fontSize: 'clamp(24px, 4vw, 40px)',
              color: color,
              opacity: isVisible ? 0.2 : 0,
              filter: `drop-shadow(0 0 20px ${color}50)`,
              animation: isVisible ? `floatIcon 8s ease-in-out infinite ${delay}s` : 'none',
              top: `${10 + (i % 4) * 22}%`,
              left: i < 4 ? `${5 + i * 8}%` : 'auto',
              right: i >= 4 ? `${5 + (i - 4) * 8}%` : 'auto',
              transition: 'opacity 0.8s ease',
              transitionDelay: `${delay * 0.2}s`,
              pointerEvents: 'none',
            }}
          >
            <Icon />
          </div>
        ))}

        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: 50,
            padding: '8px 20px',
            marginBottom: '1.5rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.2s',
          }}>
            <span style={{
              width: 8, height: 8,
              background: 'var(--accent-green)',
              borderRadius: '50%',
              boxShadow: '0 0 10px var(--accent-green)',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{ 
              fontFamily: 'var(--mono)', 
              fontSize: 12, 
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
            }}>
              Available for Projects
            </span>
          </div>

          
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s ease 0.3s',
          }}>
            <span style={{ color: 'var(--text)' }}>Let's Build Your </span>
            <span style={{
              background: 'var(--gradient-1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Cloud Infrastructure
            </span>
          </h2>

          
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: '2rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s ease 0.4s',
          }}>
            Need a <span style={{ color: 'var(--accent-purple)' }}>DevOps Engineer</span> to automate your deployments, 
            scale your infrastructure, or set up monitoring? I'm here to help transform your 
            <span style={{ color: 'var(--accent)' }}> development workflow</span>.
          </p>

          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s ease 0.5s',
          }}>
            <a
              href="mailto:sunny.charkhwal@gmail.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '16px 32px',
                background: 'var(--gradient-1)',
                borderRadius: 50,
                color: '#0a0a0f',
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
                boxShadow: '0 0 40px rgba(0, 212, 255, 0.3), 0 10px 30px -10px rgba(0, 212, 255, 0.5)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 212, 255, 0.5), 0 15px 40px -10px rgba(0, 212, 255, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 212, 255, 0.3), 0 10px 30px -10px rgba(0, 212, 255, 0.5)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
              Start a Conversation
            </a>
            <a
              href="https://www.linkedin.com/in/sunnycharkhwal"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '16px 32px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 50,
                color: 'var(--text)',
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </div>

        
        <div style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: 'var(--accent)',
          opacity: 0.3,
          display: 'none',
          '@media (min-width: 768px)': { display: 'block' }
        }}>
          <span style={{ color: 'var(--accent-purple)' }}>terraform</span> apply <span style={{ color: 'var(--accent-green)' }}>--auto-approve</span>
        </div>
      </div>

      
      <h3 style={{
        fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: '2rem',
        color: 'var(--text)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease 0.6s',
      }}>
        How I Can <span style={{ 
          background: 'var(--gradient-1)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent' 
        }}>Help You</span>
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
        gap: '1.25rem',
        marginBottom: '3rem',
      }}>
        {services.map((service, i) => (
          <div
            key={service.title}
            style={{
              position: 'relative',
              background: 'rgba(18, 18, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 20,
              padding: '1.75rem',
              cursor: 'default',
              overflow: 'hidden',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: `all 0.5s ease ${0.7 + i * 0.1}s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)'
              e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
              e.currentTarget.querySelector('.service-glow').style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.querySelector('.service-glow').style.opacity = '0'
            }}
          >
            
            <div 
              className="service-glow"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: service.gradient,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }} 
            />
            <div style={{
              fontSize: 32,
              marginBottom: '1rem',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
            }}>
              {service.icon}
            </div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: 'var(--text)',
            }}>
              {service.title}
            </h4>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}>
              {service.desc}
            </p>
          </div>
        ))}
      </div>

      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '1.5rem',
      }}>
        
        <a
          href="mailto:sunny.charkhwal@gmail.com"
          style={{
            position: 'relative',
            padding: '2rem',
            background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)',
            borderRadius: 24,
            border: '1px solid rgba(234, 67, 53, 0.2)',
            textDecoration: 'none',
            color: 'inherit',
            overflow: 'hidden',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 1.1s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
            e.currentTarget.style.borderColor = 'rgba(234, 67, 53, 0.5)'
            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(234, 67, 53, 0.25), 0 0 40px rgba(234, 67, 53, 0.1)'
            e.currentTarget.querySelector('.email-icon').style.transform = 'rotateY(180deg)'
            e.currentTarget.querySelector('.email-glow').style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.borderColor = 'rgba(234, 67, 53, 0.2)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.querySelector('.email-icon').style.transform = 'rotateY(0deg)'
            e.currentTarget.querySelector('.email-glow').style.opacity = '0'
          }}
        >
          
          <div className="email-glow" style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at 30% 30%, rgba(234, 67, 53, 0.15) 0%, transparent 50%)',
            opacity: 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
          }} />
          
          
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #EA4335, #FBBC04, #34A853, #4285F4)',
            borderRadius: '24px 24px 0 0',
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="email-icon" style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(234, 67, 53, 0.15) 0%, rgba(234, 67, 53, 0.05) 100%)',
              border: '1px solid rgba(234, 67, 53, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transformStyle: 'preserve-3d',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EA4335" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
            </div>
            <div style={{ fontSize: 12, color: '#EA4335', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              Email
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
              sunny.charkhwal@gmail.com
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34A853', animation: 'pulse 2s infinite' }} />
              Usually responds within 24h
            </div>
          </div>
        </a>

        
        <a
          href="https://www.linkedin.com/in/sunnycharkhwal"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'relative',
            padding: '2rem',
            background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)',
            borderRadius: 24,
            border: '1px solid rgba(10, 102, 194, 0.2)',
            textDecoration: 'none',
            color: 'inherit',
            overflow: 'hidden',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 1.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
            e.currentTarget.style.borderColor = 'rgba(10, 102, 194, 0.5)'
            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(10, 102, 194, 0.25), 0 0 40px rgba(10, 102, 194, 0.1)'
            e.currentTarget.querySelector('.linkedin-ring').style.transform = 'scale(1.5)'
            e.currentTarget.querySelector('.linkedin-ring').style.opacity = '0'
            e.currentTarget.querySelector('.linkedin-glow').style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.borderColor = 'rgba(10, 102, 194, 0.2)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.querySelector('.linkedin-ring').style.transform = 'scale(1)'
            e.currentTarget.querySelector('.linkedin-ring').style.opacity = '1'
            e.currentTarget.querySelector('.linkedin-glow').style.opacity = '0'
          }}
        >
          
          <div className="linkedin-glow" style={{
            position: 'absolute',
            top: '-50%',
            right: '-30%',
            width: '150%',
            height: '200%',
            background: 'radial-gradient(circle at 70% 30%, rgba(10, 102, 194, 0.15) 0%, transparent 50%)',
            opacity: 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
          }} />

          
          <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 4, opacity: 0.3 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#0A66C2',
                animation: `pulse 2s infinite ${i * 0.3}s`,
              }} />
            ))}
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ position: 'relative', width: 64, height: 64, marginBottom: '1.25rem' }}>
              
              <div className="linkedin-ring" style={{
                position: 'absolute',
                inset: -4,
                borderRadius: 20,
                border: '2px solid rgba(10, 102, 194, 0.3)',
                transition: 'all 0.5s ease',
              }} />
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px -8px rgba(10, 102, 194, 0.5)',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#0A66C2', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              LinkedIn
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
              /in/sunnycharkhwal
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              500+ Connections • DevOps Network
            </div>
          </div>
        </a>

        
        <a
          href="tel:+919013030173"
          style={{
            position: 'relative',
            padding: '2rem',
            background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)',
            borderRadius: 24,
            border: '1px solid rgba(16, 185, 129, 0.2)',
            textDecoration: 'none',
            color: 'inherit',
            overflow: 'hidden',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 1.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)'
            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 40px rgba(16, 185, 129, 0.1)'
            e.currentTarget.querySelector('.phone-icon').style.animation = 'phoneRing 0.5s ease infinite'
            e.currentTarget.querySelector('.phone-glow').style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.querySelector('.phone-icon').style.animation = 'none'
            e.currentTarget.querySelector('.phone-glow').style.opacity = '0'
          }}
        >
          
          <div className="phone-glow" style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-30%',
            width: '150%',
            height: '150%',
            background: 'radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
            opacity: 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
          }} />

          
          <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', alignItems: 'flex-end', gap: 3, opacity: 0.4 }}>
            {[8, 12, 16, 20].map((h, i) => (
              <div key={i} style={{
                width: 3,
                height: h,
                borderRadius: 2,
                background: '#10b981',
                animation: `pulse 1.5s infinite ${i * 0.15}s`,
              }} />
            ))}
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="phone-icon" style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              transformOrigin: 'center',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div style={{ fontSize: 12, color: '#10b981', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              Phone
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
              +91 901 303 0173
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              Available Mon-Fri, 10AM-7PM IST
            </div>
          </div>
        </a>
      </div>

      
      <div style={{
        textAlign: 'center',
        marginTop: '3rem',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.6s ease 1.5s',
      }}>
        <p style={{
          fontFamily: 'var(--mono)',
          fontSize: 13,
          color: 'var(--muted)',
        }}>
          <span style={{ color: 'var(--accent-green)' }}>$</span> echo "Response time: typically within 24 hours" 
          <span style={{ 
            display: 'inline-block', 
            width: 8, 
            height: 16, 
            background: 'var(--accent)', 
            marginLeft: 4,
            animation: 'blink 1s step-end infinite',
          }} />
        </p>
      </div>
    </section>
  )
}
