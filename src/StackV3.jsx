import { useEffect, useMemo, useState } from 'react'
import Card from './Card'

function StackV1() {
  const cards = [0, 1, 2, 3, 4, 5]
  const [entering, setEntering] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 1600)
    return () => clearTimeout(t)
  }, [])

  const delays = useMemo(
    () =>
      cards.map((i) => {
        const distNorm = Math.abs(i - 2.5) / 2.5
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
          const offset = i - 2.5
          const angle = offset * 6
          const x = offset * 20
          return (
            <Card
              key={i}
              index={i}
              angle={angle}
              x={x}
              delay={delays[i]}
              jitter={jitter[i]}
              totalDuration={totalDuration + delays[i]}
            />
          )
        })}
      </div>
    </div>
  )
}

export default StackV1
