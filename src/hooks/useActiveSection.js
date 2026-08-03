import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { NAV_LINKS } from '../data/index.js'
import { setActiveSection } from '../store/uiSlice.js'

export default function useActiveSection() {
  const dispatch = useDispatch()

  useEffect(() => {

    const sectionIds = ['hero', ...NAV_LINKS.map(l => l.toLowerCase())]
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
