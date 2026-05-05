import { useEffect, useMemo, useState } from 'react'
import Card from './Card'

function StackV2() {
  const cards = [0, 1, 2, 3, 4, 5, 6]
  const center = (cards.length - 1) / 2
  const [entering, setEntering] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 400)
    return () => clearTimeout(t)
  }, [])

  const delays = useMemo(
    () =>
      cards.map((i) => {
        const distNorm = Math.abs(i - center) / center
        return 0.02 + distNorm * 0.03 + Math.random() * 0.01
      }),
    []
  )

  const jitter = useMemo(
    () =>
      cards.map(() => ({
        y: (Math.random() - 0.5) * 10,
      })),
    []
  )

  const totalDuration = 0.6

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
              style={{ zIndex }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default StackV2
