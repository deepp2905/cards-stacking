import './App.css'

function App() {
  const cards = [0, 1, 2, 3, 4, 5]

  return (
    <div className="table">
      <div className="stack">
        {cards.map((i) => {
          const angle = (i - 2.5) * 6
          return (
            <div
              key={i}
              className="card"
              style={{ '--angle': `${angle}deg`, zIndex: i }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default App
