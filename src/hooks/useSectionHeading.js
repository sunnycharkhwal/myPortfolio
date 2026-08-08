import { useEffect, useState } from 'react'
import { getSiteSettings } from '../api/siteSettingsApi.js'

// Shared by every section that renders a <SectionHeader num title /> (Skills/Projects/
// Experience/Contact) — reads that section's dashboard-managed heading text/number from
// the SiteSettings singleton. Each caller still owns its own fetch (no shared cache),
// same "self-contained public section" convention every other public component follows
// — this just factors out the identical fetch-and-fail-open boilerplate that would
// otherwise be copy-pasted four times.
export default function useSectionHeading(key, defaults) {
  const [heading, setHeading] = useState(defaults)

  useEffect(() => {
    let cancelled = false
    getSiteSettings()
      .then((data) => {
        const section = data?.sections?.[key]
        if (!cancelled && section) {
          setHeading((prev) => ({
            num: section.num || prev.num,
            title: section.title || prev.title,
          }))
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [key])

  return heading
}
