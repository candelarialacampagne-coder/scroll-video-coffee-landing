import { useEffect, useRef, useState } from 'react'
import { useScroll, useMotionValueEvent, useTransform, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const TOTAL_FRAMES = 259
const FRAMES_PATH = '/frames/frame_'

const COFFEES = [
  {
    id: 1,
    name: 'Espresso Oscuro',
    origin: 'Etiopía · Yirgacheffe',
    notes: 'Chocolate negro · Frutos rojos · Ahumado',
    price: '$4.200',
    tag: 'BESTSELLER',
    tagColor: '#F97316',
    appearsAt: 0.15,
    leavesAt: 0.40,
    side: 'left',
    image: '/espresso_oscuro_t.png',
  },
  {
    id: 2,
    name: 'Latte Dorado',
    origin: 'Colombia · Huila',
    notes: 'Caramelo · Nuez · Cítrico suave',
    price: '$5.100',
    tag: 'SUAVE',
    tagColor: '#0EA5E9',
    appearsAt: 0.32,
    leavesAt: 0.57,
    side: 'right',
    image: '/latte_dorado_t.png',
  },
  {
    id: 3,
    name: 'Cold Brew Reserve',
    origin: 'Guatemala · Antigua',
    notes: 'Tabaco dulce · Vainilla · Miel',
    price: '$5.800',
    tag: 'EDICIÓN LIMITADA',
    tagColor: '#A855F7',
    appearsAt: 0.50,
    leavesAt: 0.75,
    side: 'left',
    image: '/cold_brew_reserve_t.png',
  },
  {
    id: 4,
    name: 'Cappuccino Natural',
    origin: 'Brasil · Cerrado',
    notes: 'Almendra · Cacao · Cremoso',
    price: '$4.800',
    tag: 'NUEVO',
    tagColor: '#22C55E',
    appearsAt: 0.67,
    leavesAt: 0.92,
    side: 'right',
    image: '/cappuccino_natural_t.png',
  },
]

function preloadFrames(onProgress) {
  const images = []
  let loaded = 0
  return new Promise((resolve) => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `${FRAMES_PATH}${String(i).padStart(4, '0')}.jpg`
      img.onload = img.onerror = () => {
        loaded++
        onProgress(Math.round((loaded / TOTAL_FRAMES) * 100))
        if (loaded === TOTAL_FRAMES) resolve(images)
      }
      images[i - 1] = img
    }
  })
}

export default function ScrollVideoLanding() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const [loadProgress, setLoadProgress] = useState(0)
  const [ready, setReady] = useState(false)

  const { scrollYProgress } = useScroll({ target: containerRef })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!ready) return
    const canvas = canvasRef.current
    const frames = framesRef.current
    if (!canvas || !frames.length) return
    const index = Math.min(Math.floor(p * TOTAL_FRAMES), TOTAL_FRAMES - 1)
    const img = frames[index]
    if (!img?.complete) return
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  })

  useEffect(() => {
    preloadFrames(setLoadProgress).then((images) => {
      framesRef.current = images
      const canvas = canvasRef.current
      if (canvas && images[0]) {
        canvas.getContext('2d').drawImage(images[0], 0, 0, canvas.width, canvas.height)
      }
      setReady(true)
    })
  }, [])

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <div style={{ background: '#000', fontFamily: "'DM Sans', sans-serif" }}>
      <div ref={containerRef} style={{ height: '600vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          {/* Canvas — frame sequence */}
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

          {/* Gradient overlays */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)',
          }} />

          {/* Hero title */}
          <HeroTitle scrollYProgress={scrollYProgress} />

          {/* Coffee cards */}
          {COFFEES.map((c) => (
            <CoffeeCard key={c.id} coffee={c} scrollYProgress={scrollYProgress} />
          ))}

          {/* Progress bar */}
          <motion.div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 2, originX: 0,
            background: 'linear-gradient(90deg, #92400e, #F97316, #fbbf24)',
            scaleX: scrollYProgress,
          }} />

          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            style={{
              position: 'absolute', top: 28, left: 28,
              background: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 999, padding: '7px 16px',
              color: 'rgba(255,255,255,0.6)', fontSize: 12,
              cursor: 'pointer', backdropFilter: 'blur(10px)',
              transition: 'color 0.2s, border-color 0.2s',
              zIndex: 50,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
          >
            ← Demo Lab
          </button>

          {/* Scroll hint */}
          <ScrollHint scrollYProgress={scrollYProgress} />

          {/* Loading screen */}
          {!ready && (
            <div style={{
              position: 'absolute', inset: 0, background: '#000',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 24,
              zIndex: 100,
            }}>
              <p style={{ fontSize: 12, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                CARGANDO EXPERIENCIA
              </p>
              <div style={{ width: 180, height: 1, background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%',
                  width: `${loadProgress}%`,
                  background: 'linear-gradient(90deg, #92400e, #F97316)',
                  transition: 'width 0.15s linear',
                }} />
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0, letterSpacing: '0.1em' }}>
                {loadProgress}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Final section */}
      <FinalCTA />
    </div>
  )
}

// ─── Hero Title ──────────────────────────────────────────────────────────────
function HeroTitle({ scrollYProgress }) {
  const opacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.12], [0, -50])

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <motion.div style={{ textAlign: 'center', opacity, y }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase',
            color: '#F97316', margin: '0 0 20px',
          }}
        >
          Specialty Coffee
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(52px, 7.5vw, 100px)',
            fontWeight: 700, color: '#fff',
            lineHeight: 1, letterSpacing: '-0.04em',
            margin: '0 0 24px',
          }}
        >
          Cada sorbo,<br />una historia.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: 0 }}
        >
          Scrolleá para descubrir nuestra carta
        </motion.p>
      </motion.div>
    </div>
  )
}

// ─── Coffee Card ─────────────────────────────────────────────────────────────
function CoffeeCard({ coffee, scrollYProgress }) {
  const { appearsAt, leavesAt, side } = coffee
  const isLeft = side === 'left'

  const opacity = useTransform(
    scrollYProgress,
    [appearsAt - 0.05, appearsAt, leavesAt - 0.05, leavesAt],
    [0, 1, 1, 0]
  )
  const y = useTransform(
    scrollYProgress,
    [appearsAt - 0.05, appearsAt, leavesAt - 0.05, leavesAt],
    [60, 0, 0, -40]
  )
  // Rotación de la taza sincronizada con el scroll dentro del rango de la card
  const rotate = useTransform(
    scrollYProgress,
    [appearsAt, leavesAt],
    [-15, 15]
  )

  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: '8%',
        left: isLeft ? '4%' : 'auto',
        right: isLeft ? 'auto' : '4%',
        width: 'clamp(270px, 26vw, 330px)',
        opacity, y,
        overflow: 'visible',
      }}
    >
      {/* Taza flotante — sobresale arriba de la card */}
      <motion.img
        src={coffee.image}
        alt={coffee.name}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: -180,
          left: '50%',
          x: '-50%',
          width: 340,
          height: 340,
          objectFit: 'contain',
          zIndex: 10,
          rotate,
          filter: 'drop-shadow(0px 24px 32px rgba(0,0,0,0.75))',
          pointerEvents: 'none',
        }}
      />

      {/* Card body */}
      <div style={{
        background: 'rgba(8, 5, 2, 0.72)',
        border: '1px solid rgba(249,115,22,0.2)',
        borderRadius: 24,
        padding: '100px 28px 26px',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
      }}>
        <span style={{
          display: 'inline-block', fontSize: 9, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: coffee.tagColor,
          border: `1px solid ${coffee.tagColor}55`,
          background: `${coffee.tagColor}15`,
          borderRadius: 999, padding: '4px 12px', marginBottom: 14,
        }}>
          {coffee.tag}
        </span>

        <h3 style={{
          fontSize: 22, fontWeight: 700, color: '#fff',
          margin: '0 0 4px', letterSpacing: '-0.03em', lineHeight: 1.1,
        }}>
          {coffee.name}
        </h3>

        <p style={{
          fontSize: 11, color: '#F97316', margin: '0 0 14px',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          {coffee.origin}
        </p>

        <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(249,115,22,0.25), transparent)', marginBottom: 14 }} />

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 20px' }}>
          {coffee.notes}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>
            {coffee.price}
          </span>
          <button
            style={{
              background: 'linear-gradient(135deg, #92400e, #F97316)',
              color: '#fff', border: 'none', borderRadius: 999,
              padding: '9px 22px', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.04em', cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.06)'
              e.currentTarget.style.boxShadow = '0 0 24px rgba(249,115,22,0.45)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Pedir
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Scroll Hint ─────────────────────────────────────────────────────────────
function ScrollHint({ scrollYProgress }) {
  const opacity = useTransform(scrollYProgress, [0, 0.07], [1, 0])
  return (
    <motion.div style={{
      position: 'absolute', bottom: 32, left: '50%', x: '-50%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      opacity, pointerEvents: 'none',
    }}>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, #F97316, transparent)' }}
      />
      <span style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
        Scroll
      </span>
    </motion.div>
  )
}

// ─── Final CTA ───────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px', textAlign: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(146,64,14,0.18) 0%, #000 55%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <p style={{ fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#F97316', marginBottom: 20 }}>
          Specialty Coffee Store
        </p>
        <h2 style={{
          fontSize: 'clamp(40px, 6vw, 76px)',
          fontWeight: 700, color: '#fff',
          lineHeight: 1.05, letterSpacing: '-0.04em',
          margin: '0 0 20px', maxWidth: 640,
        }}>
          El café de autor que buscabas.
        </h2>
        <p style={{
          fontSize: 17, color: 'rgba(255,255,255,0.38)',
          lineHeight: 1.75, maxWidth: 420, margin: '0 auto 52px',
        }}>
          Granos de origen único, tostado artesanal y recetas que cuentan historias.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #92400e, #F97316)',
              color: '#fff', border: 'none', borderRadius: 999,
              padding: '16px 42px', fontSize: 15, fontWeight: 700,
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
          <button
            style={{
              background: 'transparent', color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 999, padding: '16px 38px',
              fontSize: 15, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(249,115,22,0.45)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
            }}
          >
            Nuestra historia
          </button>
        </div>
      </motion.div>
    </section>
  )
}
