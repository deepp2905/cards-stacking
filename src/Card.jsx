import { motion } from 'framer-motion'

function Card({
  index,
  angle,
  x,
  delay = 0,
  jitter = {},
  totalDuration = 0.6,
  riseDuration = 0.3,
  riseDelay = 0.4,
  riseEase = [0.2, 0.8, 0.6, 1],
  spreadEase = [0.2, 0.8, 0.6, 1],
  hoverLift = -20,
  startY = 280,
  className = '',
  style,
  children,
}) {
  return (
    <motion.div
      className={`card ${className}`.trim()}
      style={{ zIndex: index, ...style }}
      initial={{
        rotate: jitter.rotate ?? 0,
        x: jitter.x ?? 0,
        y: startY + (jitter.y ?? 0),
      }}
      animate={{
        rotate: angle,
        x,
        y: 0,
      }}
      whileHover={{ y: hoverLift, transition: { duration: 0.1 } }}
      transition={{
        y: { duration: riseDuration, ease: riseEase },
        rotate: {
          duration: totalDuration + delay,
          delay: riseDelay + delay,
          ease: spreadEase,
        },
        x: {
          duration: totalDuration + delay,
          delay: riseDelay + delay,
          ease: spreadEase,
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export default Card
