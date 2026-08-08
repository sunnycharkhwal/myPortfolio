import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setActiveSection } from '../store/uiSlice.js'

// Fixed, known set — every portfolio page has exactly these five sections (same set
// SiteSettings.sections uses on the backend). Not derived from the dashboard-managed
// Nav link list: `.filter(Boolean)` below already drops any id that isn't currently
// rendered (a disabled section, or before its component mounts), so a hardcoded
// superset here is safe and doesn't need its own fetch just to observe scroll position.
const SECTION_IDS = ['hero', 'skills', 'projects', 'experience', 'contact']

export default function useActiveSection() {
  const dispatch = useDispatch()

  useEffect(() => {

    const sectionIds = SECTION_IDS
    const els = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean)


    const visibilityMap = new Map()

    const obs = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {
          visibilityMap.set(entry.target.id, {
            isIntersecting: entry.isIntersecting,
            ratio: entry.intersectionRatio,
            top: entry.boundingClientRect.top
          })
        })


        let bestSection = null
        let bestScore = -1

        visibilityMap.forEach((data, id) => {
          if (data.isIntersecting) {

            const positionBonus = data.top < window.innerHeight * 0.5 ? 0.3 : 0
            const score = data.ratio + positionBonus
            
            if (score > bestScore) {
              bestScore = score
              bestSection = id
            }
          }
        })

        if (bestSection) {
          dispatch(setActiveSection(bestSection))
        }
      },
      { 
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], 
        rootMargin: '-60px 0px -20% 0px' 
      }
    )

    els.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [dispatch])
}
