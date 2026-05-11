import { useDialKit } from 'dialkit'
import { DialContext } from './DialContext'

const DIAL_PANELS = {
  1: {
    key: 'v1',
    name: 'V1 Stack',
    config: {
      layout: {
        angleStep: [6, -16, 16, 0.5],
        xStep: [20, -80, 80, 1],
        zIndexBase: [7, 1, 30, 1],
        zIndexFalloff: [1, 0, 5, 0.25],
      },
      delay: {
        base: [0.02, 0, 0.5, 0.01],
        distance: [0.03, 0, 0.5, 0.01],
        random: [0.01, 0, 0.2, 0.01],
      },
      jitter: {
        y: [10, 0, 80, 1],
      },
      motion: {
        totalDuration: [0.6, 0.1, 2, 0.05],
        riseDuration: [0.3, 0.1, 2, 0.05],
        riseDelay: [0.4, 0, 2, 0.05],
        startY: [280, -700, 700, 10],
        hoverLift: [50, 0, 160, 1],
      },
      interaction: {
        enableAfterMs: [400, 0, 3000, 50],
      },
    },
  },
  2: {
    key: 'v2',
    name: 'V2 Stack',
    config: {
      layout: {
        angleStep: [6, -16, 16, 0.5],
        xStep: [20, -80, 80, 1],
        zIndexBase: [7, 1, 30, 1],
        zIndexFalloff: [1, 0, 5, 0.25],
      },
      delay: {
        distance: [0.01, 0, 0.2, 0.01],
      },
      jitter: {
        rotate: [1.2, 0, 12, 0.1],
        y: [5, 0, 80, 1],
      },
      stagger: {
        pairStep: [0.05, 0, 0.5, 0.01],
        rightOffset: [0.05, 0, 0.5, 0.01],
        spreadDelayAfterLast: [0.5, 0, 2, 0.05],
      },
      motion: {
        totalDuration: [0.55, 0.1, 2, 0.05],
        riseDuration: [0.4, 0.1, 2, 0.05],
        startY: [380, -700, 700, 10],
        hoverLift: [50, 0, 160, 1],
      },
      interaction: {
        enableAfterMs: [1700, 0, 4000, 50],
      },
    },
  },
  3: {
    key: 'v3',
    name: 'V3 Stack',
    config: {
      layout: {
        angleStep: [6, -16, 16, 0.5],
        xStep: [20, -80, 80, 1],
      },
      delay: {
        base: [0.02, 0, 0.5, 0.01],
        distance: [0.03, 0, 0.5, 0.01],
        random: [0.01, 0, 0.2, 0.01],
      },
      jitter: {
        y: [10, 0, 80, 1],
      },
      motion: {
        totalDuration: [0.6, 0.1, 2, 0.05],
        riseDuration: [0.3, 0.1, 2, 0.05],
        riseDelay: [0.4, 0, 2, 0.05],
        startY: [280, -700, 700, 10],
        hoverLift: [50, 0, 160, 1],
        addDelayToDuration: true,
      },
      interaction: {
        enableAfterMs: [1600, 0, 4000, 50],
      },
    },
  },
  4: {
    key: 'v4',
    name: 'V4 Carousel',
    config: {
      layout: {
        cardOneX: [144, 40, 360, 1],
        cardTwoX: [248, 80, 520, 1],
        cardThreeX: [320, 120, 680, 1],
        sideY: [5, -60, 80, 1],
        activeZ: [70, -100, 260, 5],
        zStep: [42, 0, 180, 1],
        activeScale: [1, 0.6, 1.4, 0.01],
        sideScaleBase: [0.94, 0.5, 1.2, 0.01],
        minScale: [0.78, 0.4, 1, 0.01],
        scaleStep: [0.07, 0, 0.24, 0.01],
        sideRotateY: [24, -60, 60, 1],
        baseZIndex: [30, 1, 100, 1],
        perspective: [900, 300, 2000, 10],
        perspectiveY: [46, 0, 100, 1],
        arrowOffset: [480, 220, 840, 10],
        arrowTop: [75, 0, 100, 1],
        dotBottom: [8, -40, 120, 1],
      },
      entry: {
        initialY: [-380, -700, 700, 10],
        riseDuration: [0.4, 0.1, 2, 0.05],
        spreadDelay: [0.55, 0, 2, 0.05],
        spreadDuration: [0.6, 0.1, 2, 0.05],
        controlsStart: [0.5, 0, 1, 0.05],
        controlsDuration: [0.6, 0.1, 2, 0.05],
      },
      interaction: {
        autoPlayMs: [1400, 300, 5000, 50],
        dragRotateStep: [80, 20, 220, 5],
        dragElastic: [0.28, 0, 1, 0.01],
        hoverLift: [50, 0, 140, 1],
        tapScale: [0.98, 0.85, 1, 0.01],
        pointerRotateY: [7, 0, 30, 1],
        pointerRotateX: [5, 0, 30, 1],
        wrapFadeMs: [480, 100, 1500, 20],
      },
      motion: {
        spring: { type: 'spring', stiffness: 200, damping: 24, mass: 1 },
      },
    },
  },
}

function DialProvider({ activeVersion, children }) {
  const panel = DIAL_PANELS[activeVersion] ?? DIAL_PANELS[1]
  const values = useDialKit(panel.name, panel.config)

  return (
    <DialContext.Provider value={{ [panel.key]: values }}>
      {children}
    </DialContext.Provider>
  )
}

export { DialProvider }
