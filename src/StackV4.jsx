import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Card from './Card'

const DEFAULT_CARDS = [0, 1, 2, 3, 4, 5, 6]

const SPRING = {
  type: 'spring',
  stiffness: 200,
  damping: 24,
}

const AUTO_PLAY_MS = 1400
const DRAG_ROTATE_STEP = 80
const RISE_EASE = [0.2, 0.8, 0.6, 1]
const SPREAD_EASE = [0.2, 0.8, 0.6, 1]
const SPREAD_DELAY = 0.55
const SPREAD_DURATION = 0.6
const CONTROLS_DELAY = SPREAD_DELAY + SPREAD_DURATION / 2
const WRAP_FADE_MS = 480

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

function getCardPose(relative, pointer, hidden = false) {
  const distance = Math.abs(relative)
  const side = Math.sign(relative)
  const xPositions = [0, 144, 248, 320]
  const visibleDistance = Math.min(distance, xPositions.length - 1)

  return {
    x: side * xPositions[visibleDistance],
    y: distance * 5,
    z: distance === 0 ? 70 : -distance * 42,
    scale: distance === 0 ? 1 : Math.max(0.78, 0.94 - distance * 0.07),
    opacity: hidden ? 0 : 1,
    rotateY: distance === 0 ? pointer.x * 7 : side * -24,
    rotateX: distance === 0 ? pointer.y * -5 : 0,
    zIndex: 30 - distance,
  }
}

const cardVariants = {
  enter: {
    x: 0,
    y: 380,
    z: 0,
    scale: 1,
    opacity: 1,
    rotateY: 0,
    rotateX: 0,
  },
  present: ({ relative, pointer, hidden }) => getCardPose(relative, pointer, hidden),
  exit: ({ relative }) => ({
    x: Math.sign(relative || -1) * 180,
    z: -160,
    scale: 0.72,
    opacity: 1,
    rotateY: Math.sign(relative || -1) * 28,
  }),
}

function StackV4({ cards = DEFAULT_CARDS }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(false)
  const [hiddenWrapIndex, setHiddenWrapIndex] = useState(null)
  const dragSteps = useRef(0)
  const wrapFadeTimer = useRef(null)
  const safeCards = useMemo(() => cards.filter((card) => card !== null && card !== undefined), [cards])
  const totalCards = safeCards.length

  const hideLeftWrapCard = useCallback(
    (currentIndex) => {
      setHiddenWrapIndex(wrapIndex(currentIndex - 3, totalCards))
      window.clearTimeout(wrapFadeTimer.current)
      wrapFadeTimer.current = window.setTimeout(() => {
        setHiddenWrapIndex(null)
      }, WRAP_FADE_MS)
    },
    [totalCards]
  )

  const navigateTo = useCallback(
    (nextIndex) => {
      if (!totalCards) return

      setActiveIndex(wrapIndex(nextIndex, totalCards))
    },
    [totalCards]
  )

  const navigateBy = useCallback(
    (direction) => {
      if (!totalCards) return

      setActiveIndex((currentIndex) => {
        if (direction > 0) {
          hideLeftWrapCard(currentIndex)
        }

        return wrapIndex(currentIndex + direction, totalCards)
      })
    },
    [hideLeftWrapCard, totalCards]
  )

  useEffect(() => {
    const controlsTimer = window.setTimeout(() => {
      setControlsVisible(true)
    }, (SPREAD_DELAY + SPREAD_DURATION) * 1000)

    return () => window.clearTimeout(controlsTimer)
  }, [])

  useEffect(() => {
    if (!controlsVisible || isDragging || isHovered || totalCards < 2) return undefined

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        hideLeftWrapCard(currentIndex)
        return wrapIndex(currentIndex + 1, totalCards)
      })
    }, AUTO_PLAY_MS)

    return () => window.clearInterval(interval)
  }, [controlsVisible, hideLeftWrapCard, isDragging, isHovered, totalCards])

  useEffect(
    () => () => {
      window.clearTimeout(wrapFadeTimer.current)
    },
    []
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

  function handleDrag(_event, info) {
    const nextSteps = Math.trunc(info.offset.x / DRAG_ROTATE_STEP)
    const stepDelta = nextSteps - dragSteps.current

    if (stepDelta !== 0) {
      navigateBy(-stepDelta)
      dragSteps.current = nextSteps
    }
  }

  function handleDragStart() {
    dragSteps.current = 0
    setIsDragging(true)
  }

  function handleDragEnd() {
    dragSteps.current = 0
    setIsDragging(false)
  }

  function getCardTransition() {
    return {
      y: { duration: 0.4, ease: RISE_EASE },
      x: { duration: SPREAD_DURATION, delay: SPREAD_DELAY, ease: SPREAD_EASE },
      z: { duration: SPREAD_DURATION, delay: SPREAD_DELAY, ease: SPREAD_EASE },
      scale: { duration: SPREAD_DURATION, delay: SPREAD_DELAY, ease: SPREAD_EASE },
      rotateY: { duration: SPREAD_DURATION, delay: SPREAD_DELAY, ease: SPREAD_EASE },
      rotateX: { duration: SPREAD_DURATION, delay: SPREAD_DELAY, ease: SPREAD_EASE },
      opacity: { duration: 0.4, ease: RISE_EASE },
    }
  }

  if (!totalCards) {
    return null
  }

  return (
    <div
      className="viewport carousel-viewport"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handlePointerMove}
      onMouseLeave={() => {
        setIsHovered(false)
        setPointer({ x: 0, y: 0 })
      }}
    >
      <motion.button
        className="carousel-arrow carousel-arrow-left"
        type="button"
        aria-label="Previous card"
        onClick={() => navigateBy(-1)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: SPREAD_DURATION, delay: CONTROLS_DELAY, ease: SPREAD_EASE }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5 8 12l7 7" />
        </svg>
      </motion.button>

      <div className="carousel-stage">
        <div className="carousel-stack">
          <AnimatePresence>
            {safeCards.map((card, index) => {
              const relative = getRelativeIndex(index, activeIndex, totalCards)
              const distance = Math.abs(relative)

              if (distance > 3) return null

              const hidden = hiddenWrapIndex === index
              const pose = getCardPose(relative, pointer, hidden)

              return (
                <Card
                  key={`${card}-${index}`}
                  index={pose.zIndex}
                  className="carousel-card"
                  style={{ zIndex: pose.zIndex }}
                  custom={{ relative, pointer, hidden }}
                  variants={cardVariants}
                  initial="enter"
                  animate="present"
                  exit="exit"
                  transition={controlsVisible ? SPRING : getCardTransition()}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.28}
                  onDrag={handleDrag}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  whileHover={{ y: -50, transition: { duration: 0.15 } }}
                  whileTap={{ scale: pose.scale * 0.98 }}
                />
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        className="carousel-arrow carousel-arrow-right"
        type="button"
        aria-label="Next card"
        onClick={() => navigateBy(1)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: SPREAD_DURATION, delay: CONTROLS_DELAY, ease: SPREAD_EASE }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9 5 7 7-7 7" />
        </svg>
      </motion.button>

      <motion.div
        className="carousel-dots"
        aria-label="Carousel pagination"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: SPREAD_DURATION, delay: CONTROLS_DELAY, ease: SPREAD_EASE }}
      >
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
      </motion.div>
    </div>
  )
}

export default StackV4
