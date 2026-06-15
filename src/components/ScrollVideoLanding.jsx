import { useEffect, useRef, useState } from 'react'
import { useScroll, useMotionValueEvent, useTransform, motion, useSpring } from 'framer-motion'

const VIDEO_SRC = '/Coffee_background.mp4'

// Each card appears at a specific scroll progress range
const COFFEES = [
  {
    id: 1,
    name: 'Espresso Oscuro',
    origin: 'Etiopía · Yirgacheffe',
    notes: 'Chocolate negro · Frutos rojos · Ahumado',
    price: '$4.200',
    appearsAt: 0.12,   // scroll progress when card enters
    leavesAt: 0.42,
    side: 'left',
    tag: 'BESTSELLER',
    tagColor: '#F97316',
  },
  {
    id: 2,
    name: 'Latte Dorado',
    origin: 'Colombia · Huila',
    notes: 'Caramelo · Nuez · Cítrico suave',
    price: '$5.100',
    appearsAt: 0.28,
    leavesAt: 0.58,
    side: 'right',
    tag: 'SUAVE',
    tagColor: '#0EA5E9',
  },
  {
    id: 3,
    name: 'Cold Brew Reserve',
    origin: 'Guatemala · Antigua',
    notes: 'Tabaco dulce · Vainilla · Miel',
    price: '$5.800',
    appearsAt: 0.44,
    leavesAt: 0.74,
    side: 'left',
    tag: 'EDICIÓN LIMITADA',
    tagColor: '#A855F7',
  },
  {
    id: 4,
    name: 'Cappuccino Natural',
    origin: 'Brasil · Cerrado',
    notes: 'Almendra · Cacao · Cremoso',
    price: '$4.800',
    appearsAt: 0.60,
    leavesAt: 0.90,
    side: 'right',
    tag: 'NUEVO',
    tagColor: '#22C55E',
  },
]

export default function ScrollVideoLanding() {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const scrollTimerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const { scrollYProgress } = useScroll({ target: containerRef })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 })

  // Scroll → video scrub (pure currentTime, no play/pause conflict)
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const video = videoRef.current
    if (!video || !video.duration) return

    video.currentTime = progress * video.duration
    setIsPlaying(true)

    clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = setTimeout(() => {
      setIsPlaying(false)
    }, 150)
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Ensure video is loaded but never auto-plays
    video.load()
    video.pause()

    return () => clearTimeout(scrollTimerRef.current)
  }, [])

  return (
    <div style={{ background: '#080808', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Sticky scroll section ── */}
      <div ref={containerRef} style={{ height: '600vh', position: 'relative' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>

          {/* Video background */}
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted playsInline preload="auto"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Overlays */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.65) 100%)',
            pointerEvents: 'none',
          }} />

          {/* Hero title — fades out as scroll starts */}
          <HeroTitle scrollYProgress={smoothProgress} />

          {/* Coffee cards */}
          {COFFEES.map((coffee) => (
            <CoffeeCard
              key={coffee.id}
              coffee={coffee}
              scrollYProgress={smoothProgress}
            />
          ))}

          {/* Progress bar */}
          <motion.div style={{
            position: 'absolute', bottom: 0, left: 0,
            height: 2, width: '100%',
            background: 'linear-gradient(90deg, #92400e, #F97316, #fbbf24)',
            scaleX: scrollYProgress,
            transformOrigin: 'left',
          }} />

          {/* Status badge */}
          <div style={{
            position: 'absolute', top: 28, right: 28,
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 999, padding: '6px 14px',
            backdropFilter: 'blur(10px)',
          }}>
            <motion.div
              animate={{ opacity: isPlaying ? [1, 0.3, 1] : 0.3 }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316' }}
            />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
              {isPlaying ? 'REPRODUCIENDO' : 'PAUSADO'}
            </span>
          </div>

          {/* Scroll hint */}
          <ScrollHint scrollYProgress={smoothProgress} />
        </div>
      </div>

      {/* ── Final CTA ── */}
      <FinalCTA />
    </div>
  )
}

// ── Hero title ────────────────────────────────────────────────────────────────
function HeroTitle({ scrollYProgress }) {
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.1], [0, -40])

  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%', pointerEvents: 'none',
    }}>
    <motion.div style={{
      textAlign: 'center', opacity, y,
    }}>
      <p style={{
        fontSize: 12, letterSpacing: '0.35em', textTransform: 'uppercase',
        color: '#F97316', margin: '0 0 16px',
      }}>
        Specialty Coffee
      </p>
      <h1 style={{
        fontSize: 'clamp(48px, 7vw, 96px)',
        fontWeight: 700, color: '#fff',
        lineHeight: 1, letterSpacing: '-0.04em',
        margin: '0 0 20px',
      }}>
        Cada sorbo,<br />una historia.
      </h1>
      <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
        Scrolleá para descubrir nuestra carta
      </p>
    </motion.div>
    </div>
  )
}

// ── Coffee Card ───────────────────────────────────────────────────────────────
function CoffeeCard({ coffee, scrollYProgress }) {
  const { appearsAt, leavesAt, side } = coffee

  const midpoint = (appearsAt + leavesAt) / 2
  const isLeft = side === 'left'

  // Enter from bottom, stay visible in the middle, exit upward
  const y = useTransform(
    scrollYProgress,
    [appearsAt - 0.04, appearsAt, midpoint, leavesAt - 0.04, leavesAt],
    [80, 0, 0, 0, -60]
  )
  const opacity = useTransform(
    scrollYProgress,
    [appearsAt - 0.04, appearsAt, leavesAt - 0.04, leavesAt],
    [0, 1, 1, 0]
  )
  const scale = useTransform(
    scrollYProgress,
    [appearsAt - 0.04, appearsAt, leavesAt - 0.04, leavesAt],
    [0.92, 1, 1, 0.95]
  )

  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: '12%',
        left: isLeft ? '5%' : 'auto',
        right: isLeft ? 'auto' : '5%',
        width: 'clamp(260px, 28vw, 340px)',
        y, opacity, scale,
        background: 'rgba(10, 6, 4, 0.72)',
        border: '1px solid rgba(249,115,22,0.25)',
        borderRadius: 20,
        padding: '24px 28px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        cursor: 'default',
      }}
    >
      {/* Tag */}
      <span style={{
        display: 'inline-block',
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: coffee.tagColor,
        border: `1px solid ${coffee.tagColor}44`,
        borderRadius: 999,
        padding: '3px 10px',
        marginBottom: 16,
        background: `${coffee.tagColor}18`,
      }}>
        {coffee.tag}
      </span>

      {/* Name */}
      <h3 style={{
        fontSize: 22, fontWeight: 700, color: '#fff',
        margin: '0 0 4px', letterSpacing: '-0.02em',
        lineHeight: 1.2,
      }}>
        {coffee.name}
      </h3>

      {/* Origin */}
      <p style={{
        fontSize: 12, color: '#F97316', margin: '0 0 14px',
        letterSpacing: '0.05em', textTransform: 'uppercase',
      }}>
        {coffee.origin}
      </p>

      {/* Divider */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, rgba(249,115,22,0.3), transparent)',
        marginBottom: 14,
      }} />

      {/* Tasting notes */}
      <p style={{
        fontSize: 13, color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.6, margin: '0 0 20px',
      }}>
        {coffee.notes}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 22, fontWeight: 700, color: '#fff',
          letterSpacing: '-0.02em',
        }}>
          {coffee.price}
        </span>
        <button style={{
          background: 'linear-gradient(135deg, #92400e, #F97316)',
          color: '#fff', border: 'none',
          borderRadius: 999, padding: '8px 20px',
          fontSize: 12, fontWeight: 700,
          letterSpacing: '0.05em', cursor: 'pointer',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.06)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(249,115,22,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Pedir
        </button>
      </div>
    </motion.div>
  )
}

// ── Scroll hint ───────────────────────────────────────────────────────────────
function ScrollHint({ scrollYProgress }) {
  const opacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])
  return (
    <motion.div style={{
      position: 'absolute', bottom: 36,
      left: '50%', transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 8, opacity,
      pointerEvents: 'none',
    }}>
      <span style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, #F97316, transparent)' }}
      />
    </motion.div>
  )
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px', textAlign: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(146,64,14,0.2) 0%, #080808 60%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: '-80px' }}
      >
        <p style={{
          fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase',
          color: '#F97316', marginBottom: 20,
        }}>
          Specialty Coffee Store
        </p>
        <h2 style={{
          fontSize: 'clamp(38px, 5.5vw, 72px)',
          fontWeight: 700, color: '#fff',
          lineHeight: 1.05, letterSpacing: '-0.04em',
          margin: '0 0 20px', maxWidth: 620,
        }}>
          El café de autor que buscabas.
        </h2>
        <p style={{
          fontSize: 17, color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.7, maxWidth: 420,
          margin: '0 auto 48px',
        }}>
          Granos de origen único, tostado artesanal y recetas que cuentan historias.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            background: 'linear-gradient(135deg, #92400e, #F97316)',
            color: '#fff', border: 'none',
            borderRadius: 999, padding: '16px 40px',
            fontSize: 15, fontWeight: 700,
            cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.04)'
              e.currentTarget.style.boxShadow = '0 0 40px rgba(249,115,22,0.35)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Ver la carta completa
          </button>
          <button style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 999, padding: '16px 36px',
            fontSize: 15, fontWeight: 500,
            cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(249,115,22,0.5)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
            }}
          >
            Nuestra historia
          </button>
        </div>
      </motion.div>
    </section>
  )
}
