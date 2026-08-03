import { useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Grow from '@mui/material/Grow'
import CloseIcon from '@mui/icons-material/Close'
import { PROJECTS, PROJECT_CATEGORIES, CATEGORY_CLASS } from '../data/index.js'
import { setProjectFilter, openProject, closeProject } from '../store/uiSlice.js'
import useFadeIn from '../hooks/useFadeIn.js'

function ProjectModal({ project, onClose }) {
  // MUI Dialog handles the backdrop, scroll-lock, focus trap, Esc-to-close and
  // aria-modal semantics for us. We keep the bespoke visual design via slotProps.
  return (
    <Dialog
      open={Boolean(project)}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="project-modal-title"
      slots={{ transition: Grow }}
      slotProps={{
        paper: {
          sx: {
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(25, 25, 35, 0.98) 0%, rgba(15, 15, 22, 0.99) 100%)',
            backgroundImage: 'none',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            maxWidth: 850,
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.05) inset,
              0 50px 100px -20px rgba(0, 0, 0, 0.8),
              0 30px 60px -30px rgba(0, 0, 0, 0.6),
              0 0 80px rgba(0, 212, 255, 0.08)
            `,
          },
        },
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px) saturate(180%)',
          },
        },
      }}
    >
      {project && (
        <>
          {/* top gradient hairline */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), rgba(168, 85, 247, 0.5), transparent)',
            borderRadius: '24px 24px 0 0',
          }} />

          <IconButton
            onClick={onClose}
            aria-label="Close"
            sx={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              zIndex: 10,
              width: 40,
              height: 40,
              color: 'var(--text-secondary)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(0, 212, 255, 0.1)',
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* header */}
          <div style={{ padding: '2.5rem 2.5rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <span style={{
                background: 'rgba(0, 212, 255, 0.1)',
                color: 'var(--accent)',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 8,
                border: '1px solid rgba(0, 212, 255, 0.2)',
              }}>
                #{String(project.id).padStart(2, '0')}
              </span>
              <span
                className={CATEGORY_CLASS[project.category]}
                style={{
                  fontSize: '0.8rem',
                  padding: '5px 12px',
                  borderRadius: 8,
                  fontWeight: 600,
                }}
              >
                {project.catLabel}
              </span>
            </div>
            <h2 id="project-modal-title" style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.6rem',
              lineHeight: 1.35,
            }}>
              {project.title}
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
            }}>
              {project.subtitle}
            </p>
          </div>

          <hr style={{
            border: 'none',
            borderTop: '1px solid var(--border)',
            margin: '0 2.5rem'
          }} />

          {/* body */}
          <div style={{ padding: '1.75rem 2.5rem 2.5rem' }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'var(--gradient-1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.75rem',
            }}>
              Objective
            </div>
            <div style={{
              background: 'rgba(0, 212, 255, 0.03)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: '0 10px 10px 0',
              padding: '1rem 1.25rem',
              fontSize: '0.98rem',
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}>
              {project.objective}
            </div>

            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'var(--gradient-1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.75rem',
            }}>
              Architecture & Steps
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '2rem' }}>
              {project.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: 32,
                    height: 32,
                    background: 'rgba(0, 212, 255, 0.1)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    lineHeight: 1.65,
                    paddingTop: 4,
                  }} dangerouslySetInnerHTML={{ __html: `<strong style="color: var(--text)">${step.title}:</strong> ${step.text}` }} />
                </div>
              ))}
            </div>

            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'linear-gradient(135deg, #FF9900 0%, #FFB84D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.75rem',
            }}>
              AWS Services Used
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '2rem' }}>
              {project.aws.map((service, i) => (
                <span key={i} style={{
                  background: 'rgba(255, 153, 0, 0.1)',
                  border: '1px solid rgba(255, 153, 0, 0.25)',
                  borderRadius: 10,
                  fontSize: '0.85rem',
                  padding: '6px 14px',
                  color: '#FF9900',
                  fontWeight: 500,
                }}>
                  {service}
                </span>
              ))}
            </div>

            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'linear-gradient(135deg, var(--accent-green) 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.75rem',
            }}>
              Key Outcomes
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 0 }}>
              {project.outcomes.map((outcome, i) => (
                <li key={i} style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  paddingLeft: '1.75rem',
                  position: 'relative',
                  lineHeight: 1.65,
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: 'var(--accent-green)',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    textShadow: '0 0 10px var(--accent-green)',
                  }}>✓</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </Dialog>
  )
}

function ProjectCard({ project, onOpenModal }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={() => onOpenModal(project)}
      style={{
        background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
        border: isHovered ? '1px solid rgba(0, 212, 255, 0.4)' : '1px solid var(--border)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'none',
        boxShadow: isHovered
          ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 212, 255, 0.15)'
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: 'var(--gradient-1)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.4s',
      }} />


      <div style={{ padding: '1.4rem 1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
          <span style={{
            background: 'rgba(0, 212, 255, 0.1)',
            color: 'var(--accent)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid rgba(0, 212, 255, 0.2)',
          }}>
            #{String(project.id).padStart(2, '0')}
          </span>
          <span
            className={CATEGORY_CLASS[project.category]}
            style={{
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: 6,
              fontWeight: 600,
            }}
          >
            {project.catLabel}
          </span>
        </div>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--text)',
          marginBottom: '0.4rem',
          lineHeight: 1.4,
        }}>
          {project.title}
        </div>
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          {project.subtitle}
        </div>
      </div>


      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.9rem 1.5rem',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
        background: isHovered ? 'rgba(0, 212, 255, 0.03)' : 'transparent',
        transition: 'background 0.4s',
      }}>
        <span style={{
          fontSize: '0.8rem',
          color: isHovered ? 'var(--accent)' : 'var(--muted)',
          transition: 'color 0.3s',
        }}>
          View details
        </span>
        <svg
          style={{
            width: 18,
            height: 18,
            color: 'var(--accent)',
            transition: 'transform 0.3s',
            transform: isHovered ? 'translateX(6px)' : 'none',
            filter: isHovered ? 'drop-shadow(0 0 8px var(--accent))' : 'none',
          }}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 4 10 8 6 12"/>
        </svg>
      </div>
    </div>
  )
}

export default function Projects() {
  const ref = useRef()
  const gridRef = useRef()
  const dispatch = useDispatch()
  const filter = useSelector(state => state.ui.projectFilter)
  const selectedProjectId = useSelector(state => state.ui.selectedProjectId)
  useFadeIn(ref)

  const selectedProject = selectedProjectId != null
    ? PROJECTS.find(p => p.id === selectedProjectId)
    : null

  const handleFilterChange = (newFilter) => {
    dispatch(setProjectFilter(newFilter))
    if (gridRef.current) {
      gridRef.current.scrollTop = 0
    }
    window.scrollTo({
      top: document.getElementById('projects').offsetTop + 150,
      behavior: 'smooth'
    })
  }

  const filteredProjects = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filter)

  return (
    <>
      <ProjectModal
        project={selectedProject}
        onClose={() => dispatch(closeProject())}
      />

      <section id="projects" ref={ref} style={{
        background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)',
        padding: '0',
        minHeight: '100vh',
        position: 'relative',
      }}>

        <div style={{
          background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg) 100%)',
          borderBottom: '1px solid var(--border)',
          padding: '3rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>

          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 300,
            background: 'radial-gradient(ellipse, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '0.75rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(168,85,247,0.15) 100%)',
              border: '2px solid rgba(0,212,255,0.4)',
              borderRadius: 12,
              fontFamily: 'var(--mono)',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--accent)',
              boxShadow: '0 0 30px rgba(0,212,255,0.2)',
              animation: 'numberPulse 3s ease-in-out infinite',
            }}>
              12
            </span>


            <span style={{
              background: 'linear-gradient(90deg, var(--text) 0%, var(--text-secondary) 50%, var(--text) 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'titleShimmer 4s ease-in-out infinite',
            }}>
              Real-World DevOps
            </span>


            <span style={{
              position: 'relative',
              color: 'var(--text)',
            }}>
              Projects
              <span style={{
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '100%',
                height: 3,
                background: 'var(--gradient-1)',
                borderRadius: 2,
                animation: 'underlineGrow 2s ease-out forwards',
              }} />
            </span>


            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'linear-gradient(135deg, #FF9900 0%, #FFB84D 100%)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.75rem',
              padding: '6px 14px',
              borderRadius: 8,
              boxShadow: '0 4px 20px rgba(255, 153, 0, 0.35)',
              animation: 'floatBadge 3s ease-in-out infinite',
              letterSpacing: '0.05em',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              AWS
            </span>
          </h1>


          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 20,
              fontSize: '0.85rem',
              color: '#10b981',
              fontFamily: 'var(--mono)',
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#10b981',
                animation: 'statusBlink 2s ease-in-out infinite',
              }} />
              Production-grade
            </span>
            <span style={{ color: 'var(--muted)' }}>•</span>
            <span>Click any card to explore architecture</span>
            <span style={{
              display: 'inline-block',
              animation: 'bounceArrow 1.5s ease-in-out infinite',
            }}>
              👇
            </span>
          </p>


          <style>{`
            @keyframes numberPulse {
              0%, 100% {
                box-shadow: 0 0 30px rgba(0,212,255,0.2);
                transform: scale(1);
              }
              50% {
                box-shadow: 0 0 40px rgba(0,212,255,0.4);
                transform: scale(1.05);
              }
            }

            @keyframes titleShimmer {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }

            @keyframes underlineGrow {
              0% { transform: scaleX(0); transform-origin: left; }
              100% { transform: scaleX(1); transform-origin: left; }
            }

            @keyframes floatBadge {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }

            @keyframes statusBlink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }

            @keyframes bounceArrow {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(4px); }
            }
          `}</style>
        </div>


        <div
          className="hide-scrollbar"
          style={{
            padding: '1rem 0',
            background: 'linear-gradient(180deg, rgba(18, 18, 26, 0.8) 0%, rgba(18, 18, 26, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 72,
            zIndex: 10,
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
          }}>

          <div style={{
            display: 'flex',
            gap: 8,
            padding: '0 1.5rem',
            minWidth: 'max-content',
          }}>
            {PROJECT_CATEGORIES.map(cat => {
              const Icon = cat.icon
              const isActive = filter === cat.id
              const count = cat.id === 'all'
                ? PROJECTS.length
                : PROJECTS.filter(p => p.category === cat.id).length

              return (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: isActive
                      ? `linear-gradient(135deg, ${cat.color}20 0%, ${cat.color}10 100%)`
                      : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isActive ? cat.color + '60' : 'rgba(255,255,255,0.06)'}`,
                    color: isActive ? cat.color : 'var(--text-secondary)',
                    padding: '8px 14px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'var(--sans)',
                    boxShadow: isActive
                      ? `0 4px 20px ${cat.color}25, inset 0 1px 0 ${cat.color}20`
                      : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = cat.color + '40'
                      e.currentTarget.style.color = cat.color
                      e.currentTarget.style.background = `${cat.color}10`
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  <Icon style={{
                    fontSize: 14,
                    opacity: isActive ? 1 : 0.7,
                  }} />
                  <span>{cat.label}</span>
                  {count > 0 && (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: 6,
                      background: isActive ? cat.color + '30' : 'rgba(255,255,255,0.08)',
                      color: isActive ? cat.color : 'var(--muted)',
                      fontFamily: 'var(--mono)',
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>


        <div ref={gridRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
          gap: 'clamp(1rem, 2vw, 1.5rem)',
          padding: 'clamp(1rem, 3vw, 2rem)',
          maxWidth: 1400,
          margin: '0 auto',
        }}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenModal={(p) => dispatch(openProject(p.id))}
            />
          ))}
        </div>

      </section>
    </>
  )
}
