import { useState } from 'react'
import './App.css'

function App() {
  const cards = [0, 1, 2, 3, 4, 5]
  const [playKey, setPlayKey] = useState(0)

  return (
    <div className="table">
      <div className="stack" key={playKey}>
        {cards.map((i) => {
          const angle = (i - 2.5) * 6
          return (
            <div
              key={i}
              className="card"
              style={{
                '--angle': `${angle}deg`,
                '--i': i,
                zIndex: i,
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
