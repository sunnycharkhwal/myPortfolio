import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Grow from '@mui/material/Grow'
import CloseIcon from '@mui/icons-material/Close'
import { setProjectFilter, openProject, closeProject } from '../store/uiSlice.js'
import { listProjects } from '../api/projectsApi.js'
import { listProjectCategories } from '../api/projectCategoriesApi.js'
import { resolveIcon } from '../utils/iconRegistry.js'
import { isRichTextEmpty } from '../utils/htmlToPlainText.js'
import { sanitizeRichText } from '../utils/sanitizeRichText.js'
import useFadeIn from '../hooks/useFadeIn.js'
import useSectionHeading from '../hooks/useSectionHeading.js'
import SectionHeader from './SectionHeader.jsx'
import DownloadLinkButton from './DownloadLinkButton.jsx'

const ALL_GROUP = { slug: 'all', label: 'All Projects', iconKey: 'HiViewGrid', color: '#00d4ff' }

// Inline replacement for the old static CATEGORY_CLASS CSS-class map, now that category
// colors come from the admin-manageable taxonomy — mirrors the same
// background/color/border ratios the .cat-* classes in _components.scss used.
function categoryBadgeStyle(color) {
  const c = color || '#8a8a9a'
  return { background: `${c}26`, color: c, border: `1px solid ${c}4d` }
}

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

// Renders a dashboard-authored rich text field (already sanitized by the caller) as
// real HTML — bold/italic/underline/strike/lists/blockquote/links, whatever the admin
// used RichTextEditor.jsx's toolbar to produce. `.rich-content` (src/scss/_components.scss)
// gives the resulting <p>/<ul>/<a>/etc the same typography this spot already had.
function RichText({ html, className = '', style }) {
  return <div className={`rich-content ${className}`} style={style} dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }} />
}

function ProjectModal({ project, index, categories, onClose }) {
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
      {project && (() => {
        const categoryDoc = categories?.find((c) => c.slug === project.category)
        return (
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
                #{String(index + 1).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontSize: '0.8rem',
                  padding: '5px 12px',
                  borderRadius: 8,
                  fontWeight: 600,
                  ...categoryBadgeStyle(categoryDoc?.color),
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

          {/* body — every section below is conditional: an admin-left-empty field
              (no objective typed, no steps added, no tech/AWS entries) renders neither
              its heading nor its content, rather than showing an empty-looking section. */}
          <div style={{ padding: '1.75rem 2.5rem 2.5rem' }}>
            {!isRichTextEmpty(project.objective) && (
              <>
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
                <RichText
                  html={project.objective}
                  style={{
                    background: 'rgba(0, 212, 255, 0.03)',
                    borderLeft: '3px solid var(--accent)',
                    borderRadius: '0 10px 10px 0',
                    padding: '1rem 1.25rem',
                    fontSize: '0.98rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '2rem',
                    lineHeight: 1.6,
                  }}
                />
              </>
            )}

            {project.steps && project.steps.length > 0 && (
              <>
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
                        flex: 1,
                        minWidth: 0,
                      }}>
                        <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 2 }}>{step.title}</strong>
                        <RichText html={step.text} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(() => {
              const isFrontend = project.group === 'frontend'
              const items = isFrontend ? project.techStack : project.aws
              if (!items || items.length === 0) return null
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

            {project.outcomes && project.outcomes.length > 0 && (
              <>
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
                      <RichText html={outcome} className="outcome-rich" />
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* This row (and everything in it) only renders when the admin actually
                entered something — a link or at least one custom download. The
                auto-generated "Download Case Study" PDF used to always render here
                regardless of what was entered; that was the reported bug (a button
                appearing "on its own by default") and has been removed — see
                DownloadCaseStudyButton.jsx, still used as an explicit preview tool in
                the dashboard, just no longer auto-rendered on the public site. */}
            {((project.link && project.linkEnabled) || (project.downloads && project.downloads.length > 0)) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem' }}>
                {project.link && project.linkEnabled && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      maxWidth: '100%',
                      padding: '12px 20px',
                      background: 'rgba(52, 211, 153, 0.08)',
                      border: '1px solid rgba(52, 211, 153, 0.25)',
                      borderRadius: 12,
                      color: 'var(--accent-green)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      fontFamily: 'var(--mono)',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(52, 211, 153, 0.15)'
                      e.currentTarget.style.borderColor = 'var(--accent-green)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(52, 211, 153, 0.08)'
                      e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.25)'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                    </svg>
                    Visit Project
                  </a>
                )}
                {(project.downloads || []).map((d, i) => (
                  <DownloadLinkButton key={i} label={d.label} url={d.url} />
                ))}
              </div>
            )}
          </div>
        </>
        )
      })()}
    </Dialog>
  )
}

function ProjectCard({ project, index, categories, onOpenModal }) {
  const [isHovered, setIsHovered] = useState(false)
  const categoryDoc = categories?.find((c) => c.slug === project.category)

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
            #{String(index + 1).padStart(2, '0')}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: 6,
              fontWeight: 600,
              ...categoryBadgeStyle(categoryDoc?.color),
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

  // Public content fetched live from the database — no Redux for the data itself
  // (only the filter/selection UI state stays in uiSlice, unchanged), matching
  // Experience.jsx's precedent: a single self-contained public section, fails open to
  // an empty array on error rather than crashing the page. Categories are fetched
  // enabled-only (the public endpoint never returns disabled ones), and any project
  // whose group or category isn't currently enabled is filtered out entirely below —
  // this is the whole enforcement of "disabling hides it everywhere".
  const [rawProjects, setRawProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [loaded, setLoaded] = useState(false)
  const heading = useSectionHeading('projects', { num: '02', title: 'Project' })

  useEffect(() => {
    let cancelled = false
    Promise.all([listProjects(), listProjectCategories()])
      .then(([projectsData, categoriesData]) => {
        if (!cancelled) {
          setRawProjects(projectsData)
          setCategories(categoriesData)
          setLoaded(true)
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const groups = [ALL_GROUP, ...categories.filter((c) => !c.parent).sort((a, b) => a.order - b.order)]
  const subcategories = categories.filter((c) => c.parent)

  const enabledGroupSlugs = new Set(groups.map((g) => g.slug))
  const enabledCategorySlugs = new Set(subcategories.map((c) => c.slug))
  // `enabled !== false` hides a disabled project entirely, same as a disabled taxonomy
  // category — separate from `linkEnabled` below, which only ever controls whether the
  // "Visit Project" button renders inside a project that's still fully visible.
  const projects = rawProjects.filter(
    (p) => enabledGroupSlugs.has(p.group) && enabledCategorySlugs.has(p.category) && p.enabled !== false
  )

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

  const isGroupFilter = groups.some(g => g.slug === filter && g.slug !== 'all')
  const activeGroupId = filter === 'all'
    ? 'all'
    : isGroupFilter
      ? filter
      : (() => {
          const cat = subcategories.find(c => c.slug === filter)
          const parentGroup = cat ? groups.find(g => g._id === cat.parent) : null
          return parentGroup ? parentGroup.slug : 'all'
        })()

  const visibleCategories = activeGroupId === 'all'
    ? []
    : subcategories.filter(c => {
        const parentGroup = groups.find(g => g._id === c.parent)
        return parentGroup && parentGroup.slug === activeGroupId
      })

  const filteredProjects = filter === 'all'
    ? projects
    : isGroupFilter
      ? projects.filter(p => p.group === filter)
      : projects.filter(p => p.category === filter)

  // Index within the currently-filtered/visible list, not a stored id — Mongo _ids
  // aren't small sequential numbers, so the #01/#02… badge is rebased on display
  // position, kept consistent between the grid and the modal by both reading from
  // the same filteredProjects array.
  const selectedIndex = selectedProjectId != null
    ? filteredProjects.findIndex(p => p._id === selectedProjectId)
    : -1
  const selectedProject = selectedIndex !== -1 ? filteredProjects[selectedIndex] : null

  return (
    <>
      <ProjectModal
        project={selectedProject}
        index={selectedIndex}
        categories={subcategories}
        onClose={() => dispatch(closeProject())}
      />

      <section id="projects" ref={ref} style={{
        background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)',
        padding: '0',
        minHeight: '100vh',
        position: 'relative',
      }}>

        <div style={{ padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem) 0' }}>
          <SectionHeader num={heading.num} title={heading.title} />
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
            {groups.map(group => {
              const Icon = resolveIcon(group.iconKey)
              const isActive = activeGroupId === group.slug
              const count = group.slug === 'all'
                ? projects.length
                : projects.filter(p => p.group === group.slug).length

              return (
                <button
                  key={group.slug}
                  onClick={() => handleFilterChange(group.slug)}
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
                const Icon = resolveIcon(cat.iconKey)
                const isActive = filter === cat.slug
                const count = projects.filter(p => p.category === cat.slug).length

                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleFilterChange(cat.slug)}
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
          {!loaded ? (
            <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center' }}>Loading projects…</p>
          ) : (
            filteredProjects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
                categories={subcategories}
                onOpenModal={(p) => dispatch(openProject(p._id))}
              />
            ))
          )}
        </div>

      </section>
    </>
  )
}
