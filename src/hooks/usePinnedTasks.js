import { useMemo, useState } from 'react'

export function usePinnedTasks() {
  const [pinnedIds, setPinnedIds] = useState([])
  const [pinClicks, setPinClicks] = useState(0)

  const togglePinned = (id) => {
    setPinnedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id)
      }
      return [...current, id]
    })
    setPinClicks((count) => count + 1)
  }

  const pinnedCount = useMemo(() => pinnedIds.length, [pinnedIds])

  const isPinned = (id) => pinnedIds.includes(id)

  return {
    pinnedIds,
    pinClicks,
    pinnedCount,
    isPinned,
    togglePinned,
  }
}
