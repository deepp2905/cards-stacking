import { useEffect, useMemo, useState } from 'react'
import Card from './Card'

function StackV3() {
  const cards = [0, 1, 2, 3, 4, 5, 6]
  const center = (cards.length - 1) / 2
  const [entering, setEntering] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 1100)
    return () => clearTimeout(t)
  }, [])

  // Center-out stagger reads as a hand spreading the deck from the middle.
  // More natural than left-to-right or distance-from-edge ordering.
  const delays = useMemo(
    () => cards.map((i) => Math.abs(i - center) * 0.035),
    []
  )

  // Subtle organic offsets — small enough that the symmetric fan still
  // reads as the dominant gesture, large enough to feel hand-placed.
  const jitter = useMemo(
    () =>
      cards.map(() => ({
        rotate: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 8,
      })),
    []
  )

  const totalDuration = 0.55

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
          return (
            <Card
              key={i}
              index={i}
              angle={angle}
              x={x}
              delay={delays[i]}
              jitter={jitter[i]}
              totalDuration={totalDuration}
              startY={500}
              style={{ zIndex }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default StackV3
