import { useState } from 'react'
import StackV1 from './StackV1'
import StackV2 from './StackV2'
import StackV3 from './StackV3'
import StackV4 from './StackV4'
import './App.css'

const VERSIONS = {
  1: StackV1,
  2: StackV2,
  3: StackV3,
  4: StackV4,
}

const DESCRIPTIONS = {
  3: 'Rightmost card sits on top, sweeps up from below.',
  1: 'Center card sits on top, stack is mirrored outward.',
  2: 'Center cards fan first, edges trail like a hand spreading a deck.',
  4: 'Same plain cards, arranged as a 3D perspective carousel.',
}

function App() {
  const [activeTab, setActiveTab] = useState(1)
  const [playKey, setPlayKey] = useState(0)

  const ActiveStack = VERSIONS[activeTab]

  return (
    <div className="table">
      <ActiveStack key={`${activeTab}-${playKey}`} />
      <div className="controls-group">
        <div className="controls">
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
          <div className="tabs" role="tablist">
            {Object.keys(VERSIONS).map((version) => {
              const versionNumber = Number(version)

              return (
                <button
                  key={version}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === versionNumber}
                  className={`tab${activeTab === versionNumber ? ' active' : ''}`}
                  onClick={() => setActiveTab(versionNumber)}
                >
                  V{version}
                </button>
              )
            })}
          </div>
        </div>
        <p className="version-description">{DESCRIPTIONS[activeTab]}</p>
      </div>
    </div>
  )
}

export default App
