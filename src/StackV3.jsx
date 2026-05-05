import { useEffect, useMemo, useState } from 'react'
import Card from './Card'

function StackV3() {
  const cards = [0, 1, 2, 3, 4, 5, 6]
  const center = (cards.length - 1) / 2
  const [entering, setEntering] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 1700)
    return () => clearTimeout(t)
  }, [])

  // Center-out radial stagger: center leads the bloom, edges trail.
  // Reads as something opening, not something sweeping.
  const delays = useMemo(
    () => cards.map((i) => Math.abs(i - center) * 0.01),
    []
  )

  // Imperfection on the initial state only. No x-jitter — the deck must
  // read as a stack, not a pile.
  const jitter = useMemo(
    () =>
      cards.map(() => ({
        rotate: (Math.random() - 0.5) * 1.2,
        y: (Math.random() - 0.5) * 5,
      })),
    []
  )

  return (
    <div className="viewport">
      <div
        className="stack"
        style={{ pointerEvents: entering ? 'none' : 'auto' }}
      >
        {cards.map((i) => {
          const offset = i - center
          const angle = offset * 6
          const x = offset * 20
          const zIndex = cards.length - Math.abs(offset)
          // Enter in increasing z-index order: edges first, center last.
          // Within a z-index pair, the left card precedes the right.
          const riseStagger =
            (center - Math.abs(offset)) * 2 * 0.05 + (offset > 0 ? 0.05 : 0)
          const lastRiseStagger = (cards.length - 1) * 0.05
          return (
            <Card
              key={i}
              index={i}
              angle={angle}
              x={x}
              delay={delays[i]}
              jitter={jitter[i]}
              startY={380}
              riseDuration={0.4}
              riseStagger={riseStagger}
              riseDelay={lastRiseStagger + 0.5}
              totalDuration={0.55}
              riseEase={[0.33, 1, 0.68, 1]}
              spreadEase={[0.16, 1, 0.3, 1]}
              style={{ zIndex }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default StackV3
