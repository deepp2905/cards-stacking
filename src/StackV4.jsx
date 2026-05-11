import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Card from './Card'
import { useStackDial } from './DialContext'

const DEFAULT_CARDS = [0, 1, 2, 3, 4, 5, 6]
const RISE_EASE = [0.2, 0.8, 0.6, 1]
const SPREAD_EASE = [0.2, 0.8, 0.6, 1]

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

function getCardPose(relative, pointer, p, hidden = false) {
  const distance = Math.abs(relative)
  const side = Math.sign(relative)
  const xPositions = [0, p.layout.cardOneX, p.layout.cardTwoX, p.layout.cardThreeX]
  const visibleDistance = Math.min(distance, xPositions.length - 1)

  return {
    x: side * xPositions[visibleDistance],
    y: distance * p.layout.sideY,
    z: distance === 0 ? p.layout.activeZ : -distance * p.layout.zStep,
    scale:
      distance === 0
        ? p.layout.activeScale
        : Math.max(p.layout.minScale, p.layout.sideScaleBase - distance * p.layout.scaleStep),
    opacity: hidden ? 0 : 1,
    rotateY:
      distance === 0 ? pointer.x * p.interaction.pointerRotateY : side * -p.layout.sideRotateY,
    rotateX: distance === 0 ? pointer.y * -p.interaction.pointerRotateX : 0,
    zIndex: p.layout.baseZIndex - distance,
  }
}

const cardVariants = {
  enter: ({ p }) => ({
    x: 0,
    y: p.entry.initialY,
    z: 0,
    scale: 1,
    opacity: 1,
    rotateY: 0,
    rotateX: 0,
  }),
  present: ({ relative, pointer, hidden, p }) => getCardPose(relative, pointer, p, hidden),
  exit: ({ relative, p }) => ({
    x: Math.sign(relative || -1) * p.layout.cardThreeX,
    z: -p.layout.zStep * 3,
    scale: p.layout.minScale,
    opacity: 1,
    rotateY: Math.sign(relative || -1) * p.layout.sideRotateY,
  }),
}

function StackV4({ cards = DEFAULT_CARDS }) {
  const p = useStackDial('v4')

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
  const entryCompleteMs = (p.entry.spreadDelay + p.entry.spreadDuration) * 1000
  const controlsDelay = p.entry.spreadDelay + p.entry.spreadDuration * p.entry.controlsStart

  const hideLeftWrapCard = useCallback(
    (currentIndex) => {
      setHiddenWrapIndex(wrapIndex(currentIndex - 3, totalCards))
      window.clearTimeout(wrapFadeTimer.current)
      wrapFadeTimer.current = window.setTimeout(() => {
        setHiddenWrapIndex(null)
      }, p.interaction.wrapFadeMs)
    },
    [p.interaction.wrapFadeMs, totalCards]
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
    }, entryCompleteMs)

    return () => window.clearTimeout(controlsTimer)
  }, [entryCompleteMs])

  useEffect(() => {
    if (!controlsVisible || isDragging || isHovered || totalCards < 2) return undefined

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        hideLeftWrapCard(currentIndex)
        return wrapIndex(currentIndex + 1, totalCards)
      })
    }, p.interaction.autoPlayMs)

    return () => window.clearInterval(interval)
  }, [
    controlsVisible,
    hideLeftWrapCard,
    isDragging,
    isHovered,
    p.interaction.autoPlayMs,
    totalCards,
  ])

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
    const nextSteps = Math.trunc(info.offset.x / p.interaction.dragRotateStep)
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
      y: { duration: p.entry.riseDuration, ease: RISE_EASE },
      x: { duration: p.entry.spreadDuration, delay: p.entry.spreadDelay, ease: SPREAD_EASE },
      z: { duration: p.entry.spreadDuration, delay: p.entry.spreadDelay, ease: SPREAD_EASE },
      scale: { duration: p.entry.spreadDuration, delay: p.entry.spreadDelay, ease: SPREAD_EASE },
      rotateY: { duration: p.entry.spreadDuration, delay: p.entry.spreadDelay, ease: SPREAD_EASE },
      rotateX: { duration: p.entry.spreadDuration, delay: p.entry.spreadDelay, ease: SPREAD_EASE },
      opacity: { duration: p.entry.riseDuration, ease: RISE_EASE },
    }
  }

  if (!totalCards) {
    return null
  }

  return (
    <div
      className="viewport carousel-viewport"
      style={{
        '--carousel-perspective': `${p.layout.perspective}px`,
        '--carousel-perspective-y': `${p.layout.perspectiveY}%`,
        '--carousel-arrow-offset': `${p.layout.arrowOffset}px`,
        '--carousel-arrow-top': `${p.layout.arrowTop}%`,
        '--carousel-dot-bottom': `${p.layout.dotBottom}px`,
      }}
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
        transition={{
          duration: p.entry.controlsDuration,
          delay: controlsDelay,
          ease: SPREAD_EASE,
        }}
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
              const pose = getCardPose(relative, pointer, p, hidden)

              return (
                <Card
                  key={`${card}-${index}`}
                  index={pose.zIndex}
                  className="carousel-card"
                  style={{ zIndex: pose.zIndex }}
                  custom={{ relative, pointer, hidden, p }}
                  variants={cardVariants}
                  initial="enter"
                  animate="present"
                  exit="exit"
                  transition={controlsVisible ? p.motion.spring : getCardTransition()}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={p.interaction.dragElastic}
                  onDrag={handleDrag}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  whileHover={{
                    y: -p.interaction.hoverLift,
                    transition: { duration: 0.15 },
                  }}
                  whileTap={{ scale: pose.scale * p.interaction.tapScale }}
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
        transition={{
          duration: p.entry.controlsDuration,
          delay: controlsDelay,
          ease: SPREAD_EASE,
        }}
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
        transition={{
          duration: p.entry.controlsDuration,
          delay: controlsDelay,
          ease: SPREAD_EASE,
        }}
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
            transition={p.motion.spring}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default StackV4
