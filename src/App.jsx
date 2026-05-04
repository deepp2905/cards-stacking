import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'

function App() {
  const cards = [0, 1, 2, 3, 4, 5]
  const [playKey, setPlayKey] = useState(0)

  const delays = useMemo(
    () => cards.map(() => 0.02 + Math.random() * 0.02),
    [playKey]
  )

  const totalDuration = 0.45

  return (
    <div className="table">
      <div className="stack" key={playKey}>
        {cards.map((i) => {
          const offset = i - 2.5
          const angle = offset * 6
          const x = offset * 10
          return (
            <motion.div
              key={i}
              className="card"
              style={{ zIndex: i }}
              initial={{ rotate: 0, x: 0 }}
              animate={{ rotate: angle, x }}
              transition={{
                duration: totalDuration - delays[i],
                delay: delays[i],
                ease: [0.2, 0.8, 0.6, 1],
              }}
            />
          )
        })}
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
