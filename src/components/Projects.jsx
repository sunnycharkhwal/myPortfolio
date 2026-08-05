import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Grow from '@mui/material/Grow'
import CloseIcon from '@mui/icons-material/Close'
import { PROJECTS, PROJECT_CATEGORIES, PROJECT_GROUPS, CATEGORY_CLASS } from '../data/index.js'
import { setProjectFilter, openProject, closeProject } from '../store/uiSlice.js'
import useFadeIn from '../hooks/useFadeIn.js'
import SectionHeader from './SectionHeader.jsx'

function galleryArrowStyle(side) {
  return {
    position: 'absolute',
    top: '50%',
    [side]: 10,
    transform: 'translateY(-50%)',
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(0,0,0,0.45)',
    color: '#fff',
    fontSize: 20,
    lineHeight: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    zIndex: 2,
  }
}

function lightboxArrowStyle(side) {
  return {
    position: 'fixed',
    top: '50%',
    [side]: '3vw',
    transform: 'translateY(-50%)',
    width: 52,
    height: 52,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: 28,
    lineHeight: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2001,
  }
}

function ProjectGallery({ images, projectTitle }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setLightboxOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen])

  if (!images || images.length === 0) return null

  const hasMultiple = images.length > 1
  const goTo = (i, e) => {
    e?.stopPropagation()
    setActiveIndex((i + images.length) % images.length)
  }

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: '#0a0a0f',
      }}>
        <div style={{
          display: 'flex',
          width: `${images.length * 100}%`,
          transform: `translateX(-${(activeIndex * 100) / images.length}%)`,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {images.map((src, i) => (
            <div
              key={src + i}
              onClick={() => setLightboxOpen(true)}
              style={{
                width: `${100 / images.length}%`,
                aspectRatio: '16 / 9',
                flexShrink: 0,
                cursor: 'zoom-in',
              }}
            >
              <img
                src={src}
                alt={`${projectTitle} — screenshot ${i + 1}`}
                loading="lazy"
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}
        </div>

        {hasMultiple && (
          <>
            <button aria-label="Previous image" onClick={(e) => goTo(activeIndex - 1, e)} style={galleryArrowStyle('left')}>‹</button>
            <button aria-label="Next image" onClick={(e) => goTo(activeIndex + 1, e)} style={galleryArrowStyle('right')}>›</button>
            <div style={{
              position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 6,
            }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to image ${i + 1}`}
                  onClick={(e) => goTo(i, e)}
                  style={{
                    width: i === activeIndex ? 18 : 6,
                    height: 6,
                    borderRadius: 4,
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    background: i === activeIndex ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                    boxShadow: i === activeIndex ? '0 0 8px var(--accent)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {lightboxOpen && createPortal(
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(5, 5, 10, 0.92)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '4vh 4vw',
            cursor: 'zoom-out',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <button
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false) }}
            style={{
              position: 'absolute', top: 24, right: 24,
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', fontSize: 22, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>

          <img
            src={images[activeIndex]}
            alt={`${projectTitle} — screenshot ${activeIndex + 1}`}
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false) }}
            draggable={false}
            style={{
              maxWidth: '92vw',
              maxHeight: '86vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: 12,
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
              cursor: 'zoom-out',
              animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {hasMultiple && (
            <>
              <button
                aria-label="Previous image"
                onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1) }}
                style={lightboxArrowStyle('left')}
              >‹</button>
              <button
                aria-label="Next image"
                onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1) }}
                style={lightboxArrowStyle('right')}
              >›</button>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}

function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60)
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/)
  const lines = []
  let current = ''
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxChars) {
      if (current) lines.push(current)
      current = word
    } else {
      current = next
    }
  })
  if (current) lines.push(current)
  return lines
}

// Builds a small, genuinely valid single-page PDF (no external libraries) so the
// download button works end-to-end. Content is derived from the project's own
// data — placeholder in the sense that there's no real case-study asset behind it.
function buildCaseStudyPdf(project) {
  const escapePdfText = (s) => String(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

  const rows = [{ text: project.title, size: 15 }, { text: project.subtitle, size: 10 }, { text: '', size: 6 }]
  rows.push({ text: 'OBJECTIVE', size: 12 })
  wrapText(project.objective, 92).forEach((l) => rows.push({ text: l, size: 10 }))
  rows.push({ text: '', size: 6 })
  rows.push({ text: 'KEY OUTCOMES', size: 12 })
  project.outcomes.forEach((o) => {
    wrapText(`- ${o}`, 92).forEach((l) => rows.push({ text: l, size: 10 }))
  })

  let y = 760
  const streamLines = ['BT']
  rows.forEach(({ text, size }) => {
    if (y < 40) return
    streamLines.push(`/F1 ${size} Tf`)
    streamLines.push(`1 0 0 1 50 ${y} Tm`)
    if (text) streamLines.push(`(${escapePdfText(text)}) Tj`)
    y -= size + 6
  })
  streamLines.push('ET')
  const streamContent = streamLines.join('\n')

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 5 0 R >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>',
    `<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((body, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
  })
  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

  return new Blob([pdf], { type: 'application/pdf' })
}

function DownloadCaseStudy({ project }) {
  const fileName = `${slugify(project.title) || 'project'}-case-study.pdf`

  const handleDownload = () => {
    const blob = buildCaseStudyPdf(project)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      title={fileName}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: '2rem',
        maxWidth: '100%',
        padding: '12px 20px',
        background: 'rgba(0, 212, 255, 0.08)',
        border: '1px solid rgba(0, 212, 255, 0.25)',
        borderRadius: 12,
        color: 'var(--accent)',
        fontSize: '0.85rem',
        fontWeight: 600,
        fontFamily: 'var(--mono)',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(0, 212, 255, 0.15)'
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(0, 212, 255, 0.08)'
        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.25)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M4 19h16" />
      </svg>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
        {fileName}
      </span>
    </button>
  )
}

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

          <div style={{ padding: '0 2.5rem 1.75rem' }}>
            <ProjectGallery images={project.images} projectTitle={project.title} />
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

            {(() => {
              const isFrontend = project.group === 'frontend'
              const items = isFrontend ? project.techStack : project.aws
              const heading = isFrontend ? 'Tech Stack' : 'AWS Services Used'
              const accent = isFrontend ? 'var(--accent)' : '#FF9900'
              const gradient = isFrontend ? 'var(--gradient-1)' : 'linear-gradient(135deg, #FF9900 0%, #FFB84D 100%)'
              return (
                <>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    background: gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '0.75rem',
                  }}>
                    {heading}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '2rem' }}>
                    {items.map((service, i) => (
                      <span key={i} style={{
                        background: isFrontend ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 153, 0, 0.1)',
                        border: isFrontend ? '1px solid rgba(0, 212, 255, 0.25)' : '1px solid rgba(255, 153, 0, 0.25)',
                        borderRadius: 10,
                        fontSize: '0.85rem',
                        padding: '6px 14px',
                        color: accent,
                        fontWeight: 500,
                      }}>
                        {service}
                      </span>
                    ))}
                  </div>
                </>
              )
            })()}

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

            <DownloadCaseStudy project={project} />
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

  const isGroupFilter = PROJECT_GROUPS.some(g => g.id === filter && g.id !== 'all')
  const activeGroupId = filter === 'all'
    ? 'all'
    : isGroupFilter
      ? filter
      : (PROJECT_CATEGORIES.find(c => c.id === filter)?.group ?? 'all')

  const visibleCategories = activeGroupId === 'all'
    ? []
    : PROJECT_CATEGORIES.filter(c => c.group === activeGroupId)

  const filteredProjects = filter === 'all'
    ? PROJECTS
    : isGroupFilter
      ? PROJECTS.filter(p => p.group === filter)
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

        <div style={{ padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem) 0' }}>
          <SectionHeader num="02" title="Project" />
        </div>


        <div
          className="hide-scrollbar"
          style={{
            padding: '1rem 0',
            background: 'linear-gradient(180deg, rgba(18, 18, 26, 0.9) 0%, rgba(18, 18, 26, 0.8) 100%)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 72,
            zIndex: 10,
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
          }}>

          <div className="project-group-tabs" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            padding: '0 1.5rem',
            width: '100%',
            minWidth: 'max-content',
          }}>
            {PROJECT_GROUPS.map(group => {
              const Icon = group.icon
              const isActive = activeGroupId === group.id
              const count = group.id === 'all'
                ? PROJECTS.length
                : PROJECTS.filter(p => p.group === group.id).length

              return (
                <button
                  key={group.id}
                  onClick={() => handleFilterChange(group.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: isActive
                      ? `linear-gradient(135deg, ${group.color}20 0%, ${group.color}10 100%)`
                      : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isActive ? group.color + '60' : 'rgba(255,255,255,0.06)'}`,
                    color: isActive ? group.color : 'var(--text-secondary)',
                    padding: '8px 14px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'var(--sans)',
                    boxShadow: isActive
                      ? `0 4px 20px ${group.color}25, inset 0 1px 0 ${group.color}20`
                      : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = group.color + '40'
                      e.currentTarget.style.color = group.color
                      e.currentTarget.style.background = `${group.color}10`
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
                  <span>{group.label}</span>
                  {count > 0 && (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: 6,
                      background: isActive ? group.color + '30' : 'rgba(255,255,255,0.08)',
                      color: isActive ? group.color : 'var(--muted)',
                      fontFamily: 'var(--mono)',
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {visibleCategories.length > 0 && (
            <div className="project-category-chips" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              padding: '0.65rem 1.5rem 0',
              width: '100%',
              minWidth: 'max-content',
            }}>
              {visibleCategories.map(cat => {
                const Icon = cat.icon
                const isActive = filter === cat.id
                const count = PROJECTS.filter(p => p.category === cat.id).length

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
                      padding: '6px 12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 600 : 500,
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontFamily: 'var(--sans)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = cat.color + '40'
                        e.currentTarget.style.color = cat.color
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                      }
                    }}
                  >
                    <Icon style={{ fontSize: 12, opacity: isActive ? 1 : 0.7 }} />
                    <span>{cat.label}</span>
                    {count > 0 && (
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        padding: '1px 5px',
                        borderRadius: 5,
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
          )}
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
