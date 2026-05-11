import { useEffect, useState } from 'react'
import Card from './Card'
import { useStackDial } from './DialContext'

const CARDS = [0, 1, 2, 3, 4, 5, 6]
const CENTER = (CARDS.length - 1) / 2

function seededNoise(index, salt) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function StackV1() {
  const p = useStackDial('v1')

  const [entering, setEntering] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), p.interaction.enableAfterMs)
    return () => clearTimeout(t)
  }, [p.interaction.enableAfterMs])

  return (
    <div className="viewport">
      <div className="stack" style={{ pointerEvents: entering ? 'none' : 'auto' }}>
        {CARDS.map((i) => {
          const offset = i - CENTER
          const distNorm = Math.abs(offset) / CENTER
          const delay =
            p.delay.base + distNorm * p.delay.distance + seededNoise(i, 1) * p.delay.random
          const jitter = {
            y: (seededNoise(i, 2) - 0.5) * p.jitter.y,
          }
          const zIndex = p.layout.zIndexBase - Math.abs(offset) * p.layout.zIndexFalloff

          return (
            <Card
              key={i}
              index={i}
              angle={offset * p.layout.angleStep}
              x={offset * p.layout.xStep}
              delay={delay}
              jitter={jitter}
              totalDuration={p.motion.totalDuration}
              riseDuration={p.motion.riseDuration}
              riseDelay={p.motion.riseDelay}
              startY={p.motion.startY}
              hoverLift={-p.motion.hoverLift}
              style={{ zIndex }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default StackV1
