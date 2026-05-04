import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'

function App() {
  const cards = [0, 1, 2, 3, 4, 5]
  const [playKey, setPlayKey] = useState(0)
  const [entering, setEntering] = useState(true)

  useEffect(() => {
    setEntering(true)
    const t = setTimeout(() => setEntering(false), 400)
    return () => clearTimeout(t)
  }, [playKey])

  const delays = useMemo(
    () =>
      cards.map((i) => {
        const distNorm = Math.abs(i - 2.5) / 2.5
        return 0.02 + distNorm * 0.03 + Math.random() * 0.01
      }),
    [playKey]
  )

  const totalDuration = 0.6

  return (
    <div className="table">
      <div className="viewport">
        <div
          className="stack"
          key={playKey}
          style={{ pointerEvents: entering ? 'none' : 'auto' }}
        >
          {cards.map((i) => {
            const offset = i - 2.5
            const angle = offset * 6
            const x = offset * 20
            return (
              <motion.div
                key={i}
                className="card"
                style={{ zIndex: i }}
                initial={{
                  rotate: 0,
                  x: 0,
                  y: 280,
                  //boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)',
                }}
                animate={{
                  rotate: angle,
                  x,
                  y: 0,
                  //boxShadow: '-2px 2px 4px rgba(0, 0, 0, 0.07)',
                }}
                whileHover={{ y: -20, transition: { duration: 0.1 } }}
                transition={{
                  y: { duration: 0.3, ease: [0.2, 0.8, 0.6, 1] },
                  rotate: {
                    duration: totalDuration + delays[i],
                    delay: 0.4 + delays[i],
                    ease: [0.2, 0.8, 0.6, 1],
                  },
                  x: {
                    duration: totalDuration + delays[i],
                    delay: 0.4 + delays[i],
                    ease: [0.2, 0.8, 0.6, 1],
                  },
                  boxShadow: {
                    duration: totalDuration + delays[i],
                    delay: 0.4 + delays[i],
                  },
                }}
              />
            )
          })}
        </div>
      </div>
      <button
        type="button"
        className="replay"
        onClick={() => setPlayKey((k) => k + 1)}
        aria-label="Replay"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <polyline points="3 3 3 9 9 9" />
        </svg>
        Replay
      </button>
    </div>
  )
}

export default App
