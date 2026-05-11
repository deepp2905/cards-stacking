import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import Card from './Card'

const DEFAULT_CARDS = [0, 1, 2, 3, 4, 5, 6]

const SPRING = {
  type: 'spring',
  stiffness: 200,
  damping: 24,
}

const SWIPE_THRESHOLD = 60

function wrapIndex(index, length) {
  return (index + length) % length
}

function getRelativeIndex(index, activeIndex, length) {
  let relative = (index - activeIndex + length) % length

  if (relative > length / 2) {
    relative -= length
  }

  return relative
}

function getCardPose(relative, pointer) {
  const distance = Math.abs(relative)
  const side = Math.sign(relative)
  const xPositions = [0, 72, 124, 160]
  const visibleDistance = Math.min(distance, xPositions.length - 1)

  return {
    x: side * xPositions[visibleDistance],
    y: distance * 5,
    z: distance === 0 ? 70 : -distance * 42,
    scale: distance === 0 ? 1 : Math.max(0.78, 0.94 - distance * 0.07),
    opacity: distance === 0 ? 1 : Math.max(0.5, 0.82 - distance * 0.12),
    rotateY: distance === 0 ? pointer.x * 7 : side * -24,
    rotateX: distance === 0 ? pointer.y * -5 : 0,
    zIndex: 30 - distance,
  }
}

const cardVariants = {
  present: ({ relative, pointer }) => getCardPose(relative, pointer),
  exit: ({ relative }) => ({
    x: Math.sign(relative || -1) * 180,
    z: -160,
    scale: 0.72,
    opacity: 0,
    rotateY: Math.sign(relative || -1) * 28,
  }),
}

function StackV4({ cards = DEFAULT_CARDS }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const safeCards = useMemo(() => cards.filter((card) => card !== null && card !== undefined), [cards])
  const totalCards = safeCards.length

  const navigateTo = useCallback(
    (nextIndex) => {
      if (!totalCards) return

      setActiveIndex(wrapIndex(nextIndex, totalCards))
    },
    [totalCards]
  )

  const navigateBy = useCallback(
    (direction) => {
      navigateTo(activeIndex + direction)
    },
    [activeIndex, navigateTo]
  )

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2

    setPointer({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    })
  }

  function handleDragEnd(_event, info) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      navigateBy(-1)
      return
    }

    if (info.offset.x < -SWIPE_THRESHOLD) {
      navigateBy(1)
    }
  }

  if (!totalCards) {
    return null
  }

  return (
    <div
      className="viewport carousel-viewport"
      onMouseMove={handlePointerMove}
      onMouseLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <button
        className="carousel-arrow carousel-arrow-left"
        type="button"
        aria-label="Previous card"
        onClick={() => navigateBy(-1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5 8 12l7 7" />
        </svg>
      </button>

      <div className="carousel-stage">
        <div className="carousel-stack">
          <AnimatePresence initial={false}>
            {safeCards.map((card, index) => {
              const relative = getRelativeIndex(index, activeIndex, totalCards)
              const distance = Math.abs(relative)

              if (distance > 3) return null

              const pose = getCardPose(relative, pointer)

              return (
                <Card
                  key={`${card}-${index}`}
                  index={pose.zIndex}
                  className="carousel-card"
                  style={{ zIndex: pose.zIndex }}
                  custom={{ relative, pointer }}
                  variants={cardVariants}
                  initial={false}
                  animate="present"
                  exit="exit"
                  transition={SPRING}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={handleDragEnd}
                  whileHover={{ y: -50, transition: { duration: 0.15 } }}
                  whileTap={{ scale: pose.scale * 0.98 }}
                />
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      <button
        className="carousel-arrow carousel-arrow-right"
        type="button"
        aria-label="Next card"
        onClick={() => navigateBy(1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9 5 7 7-7 7" />
        </svg>
      </button>

      <div className="carousel-dots" aria-label="Carousel pagination">
        {safeCards.map((card, index) => (
          <motion.button
            key={`${card}-dot-${index}`}
            className={`carousel-dot${index === activeIndex ? ' active' : ''}`}
            type="button"
            aria-label={`Show card ${index + 1}`}
            aria-current={index === activeIndex}
            onClick={() => navigateTo(index)}
            animate={{ width: index === activeIndex ? 20 : 7 }}
            transition={SPRING}
          />
        ))}
      </div>
    </div>
  )
}

export default StackV4
