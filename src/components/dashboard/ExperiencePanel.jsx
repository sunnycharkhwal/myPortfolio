import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchWorkHistory, fetchAchievements, fetchEducation } from '../../store/experienceSectionSlice.js'
import WorkHistorySection from './WorkHistorySection.jsx'
import AchievementsSection from './AchievementsSection.jsx'
import EducationSection from './EducationSection.jsx'

// Pure layout composer — no business logic of its own. All data/mutation logic lives
// in the three section components, each backed by its own slice of experienceSection.
export default function ExperiencePanel() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchWorkHistory())
    dispatch(fetchAchievements())
    dispatch(fetchEducation())
  }, [dispatch])

  return (
    <div className="dash-panel">
      <WorkHistorySection />
      <AchievementsSection />
      <EducationSection />
    </div>
  )
}
