import { useEffect, useState } from 'react'
import Card from './Card'
import { useStackDial } from './DialContext'

const CARDS = [0, 1, 2, 3, 4, 5, 6]
const CENTER = (CARDS.length - 1) / 2
const RISE_EASE = [0.33, 1, 0.68, 1]
const SPREAD_EASE = [0.16, 1, 0.3, 1]

function seededNoise(index, salt) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function StackV2() {
  const p = useStackDial('v2')

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
          const delay = Math.abs(offset) * p.delay.distance
          const zIndex = p.layout.zIndexBase - Math.abs(offset) * p.layout.zIndexFalloff
          const riseStagger =
            (CENTER - Math.abs(offset)) * 2 * p.stagger.pairStep +
            (offset > 0 ? p.stagger.rightOffset : 0)
          const lastRiseStagger = (CARDS.length - 1) * p.stagger.pairStep
          const jitter = {
            rotate: (seededNoise(i, 3) - 0.5) * p.jitter.rotate,
            y: (seededNoise(i, 4) - 0.5) * p.jitter.y,
          }

          return (
            <Card
              key={i}
              index={i}
              angle={offset * p.layout.angleStep}
              x={offset * p.layout.xStep}
              delay={delay}
              jitter={jitter}
              startY={p.motion.startY}
              riseDuration={p.motion.riseDuration}
              riseStagger={riseStagger}
              riseDelay={lastRiseStagger + p.stagger.spreadDelayAfterLast}
              totalDuration={p.motion.totalDuration}
              riseEase={RISE_EASE}
              spreadEase={SPREAD_EASE}
              hoverLift={-p.motion.hoverLift}
              style={{ zIndex }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default StackV2
