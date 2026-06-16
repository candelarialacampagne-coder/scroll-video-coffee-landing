import { useEffect, useRef, useState } from 'react'
import { useScroll, useMotionValueEvent, useTransform, motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const TOTAL_FRAMES = 121
const FRAMES_PATH = '/frames-metcon/frame_'

const SECTIONS = [
  {
    at: 0.0,
    title: 'Metcon 10',
    sub: 'Entrenás sin límites.',
    color: '#fff',
    stats: null,
  },
  {
    at: 0.2,
    title: 'Estabilidad\nen cada rep.',
    sub: 'Suela plana diseñada para levantamiento.',
    color: '#fff',
    stats: [
      { label: 'Drop', value: '4mm' },
      { label: 'Suela', value: '6mm' },
      { label: 'Horma', value: 'Wide' },
    ],
  },
  {
    at: 0.45,
    title: 'Agarre total.',
    sub: 'Tracción multidireccional para cualquier superficie.',
    color: '#fff',
    stats: [
      { label: 'Grip', value: '360°' },
      { label: 'Superficie', value: 'Multi' },
      { label: 'Flex', value: 'Alta' },
    ],
  },
  {
    at: 0.7,
    title: 'Hecho para durar.',
    sub: 'Materiales de alta resistencia. Sin excusas.',
    color: '#fff',
    stats: [
      { label: 'Peso', value: '280g' },
      { label: 'Upper', value: 'Mesh' },
      { label: 'Refuerzo', value: 'TPU' },
    ],
  },
  {
    at: 0.88,
    title: 'Tu mejor marca\nempieza acá.',
    sub: 'Disponible en múltiples colores.',
    color: '#fff',
    stats: null,
    cta: true,
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

export default function MetconLanding() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const [loadProgress, setLoadProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [activeSection, setActiveSection] = useState(0)

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

    const reversed = [...SECTIONS].reverse()
    const found = reversed.findIndex(s => p >= s.at)
    if (found !== -1) setActiveSection(SECTIONS.length - 1 - found)
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

  const section = SECTIONS[activeSection]

  return (
    <div style={{ background: '#0a0a0a', fontFamily: '"Nike TG", "Helvetica Neue", Arial, sans-serif' }}>

      {/* ── Sticky scroll zone ── */}
      <div ref={containerRef} style={{ height: '600vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 45%, rgba(0,0,0,0.85) 100%)',
          }} />

          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            style={{
              position: 'absolute', top: 24, left: 24, zIndex: 50,
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 999, padding: '7px 16px',
              color: 'rgba(255,255,255,0.6)', fontSize: 12,
              cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
          >
            ← Demo Lab
          </button>

          {/* Nike logo */}
          <div style={{
            position: 'absolute', top: 20, left: 0, right: 0,
            display: 'flex', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <NikeSwoosh />
          </div>

          {/* Dynamic text */}
          <TextBlock section={section} index={activeSection} />

          {/* Progress dots */}
          <div style={{
            position: 'absolute', right: 24, top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {SECTIONS.map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: i === activeSection ? 1 : 0.5, opacity: i === activeSection ? 1 : 0.3 }}
                transition={{ duration: 0.25 }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }}
              />
            ))}
          </div>

          {/* Scroll progress bar */}
          <motion.div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 2, originX: 0,
            background: 'rgba(255,255,255,0.5)',
            scaleX: scrollYProgress,
          }} />

          {/* Scroll hint */}
          <ScrollHint scrollYProgress={scrollYProgress} />

          {/* Loading screen */}
          {!ready && (
            <div style={{
              position: 'absolute', inset: 0, background: '#000',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 32,
              zIndex: 100,
            }}>
              <NikeSwoosh size={48} />
              <div style={{ width: 160, height: 1, background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%',
                  width: `${loadProgress}%`,
                  background: '#fff',
                  transition: 'width 0.15s linear',
                }} />
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: 0, letterSpacing: '0.15em' }}>
                {loadProgress}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Final CTA section ── */}
      <FinalSection />
    </div>
  )
}

// ── Text block con split lines + stats chips ──────────────────────────────────
function TextBlock({ section, index }) {
  const lines = section.title.split('\n')
  // Tiempo en que termina la última línea del título
  const titleDone = lines.length * 0.1 + 0.15

  return (
    <div style={{
      position: 'absolute', bottom: '10%', left: 0, right: 0,
      textAlign: 'center', pointerEvents: 'none', padding: '0 24px',
    }}>

      {/* Título: cada línea entra por separado desde abajo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`title-${index}`}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }}
          style={{ marginBottom: 14 }}
        >
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.55,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontSize: 'clamp(36px, 6vw, 80px)',
                fontWeight: 900,
                color: section.color,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                textTransform: 'uppercase',
                textShadow: '0 2px 24px rgba(0,0,0,0.5)',
                display: 'block',
              }}
            >
              {line}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Subtítulo */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`sub-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
          transition={{ duration: 0.45, delay: titleDone, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(14px, 1.8vw, 20px)',
            color: section.color,
            margin: '0 0 20px',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}
        >
          {section.sub}
        </motion.p>
      </AnimatePresence>

      {/* Stats chips — entran justo después del subtítulo */}
      <AnimatePresence mode="wait">
        {section.stats && (
          <motion.div
            key={`stats-${index}`}
            style={{
              display: 'flex', gap: 10, justifyContent: 'center',
              flexWrap: 'wrap', marginBottom: 0,
            }}
          >
            {section.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.92, transition: { duration: 0.15 } }}
                transition={{
                  duration: 0.4,
                  delay: titleDone + 0.1 + i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 12,
                  padding: '10px 20px',
                  minWidth: 72,
                }}
              >
                <span style={{
                  fontSize: 20, fontWeight: 900, color: '#fff',
                  letterSpacing: '-0.02em', lineHeight: 1,
                }}>
                  {stat.value}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4,
                }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA buttons */}
      {section.cta && (
        <motion.div
          key={`cta-${index}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: titleDone + 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', pointerEvents: 'all' }}
        >
          <button style={{
            background: '#fff', color: '#111',
            border: 'none', borderRadius: 999,
            padding: '14px 36px', fontSize: 14,
            fontWeight: 700, letterSpacing: '0.05em',
            textTransform: 'uppercase', cursor: 'pointer',
            transition: 'background 0.2s, transform 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e5e5e5'; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Comprar
          </button>
          <button style={{
            background: 'transparent', color: '#fff',
            border: '1px solid rgba(255,255,255,0.5)',
            borderRadius: 999, padding: '14px 36px',
            fontSize: 14, fontWeight: 700,
            letterSpacing: '0.05em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Ver más
          </button>
        </motion.div>
      )}
    </div>
  )
}

// ── Scroll hint ───────────────────────────────────────────────────────────────
function ScrollHint({ scrollYProgress }) {
  const opacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])
  return (
    <motion.div style={{
      position: 'absolute', bottom: 32, left: '50%', x: '-50%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      opacity, pointerEvents: 'none',
    }}>
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)' }}
      />
      <span style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
        Scroll
      </span>
    </motion.div>
  )
}

// ── Nike Swoosh ───────────────────────────────────────────────────────────────
function NikeSwoosh({ size = 28 }) {
  return (
    <>
      <style>{`
        @keyframes swoosh3d {
          0%   { transform: perspective(300px) rotateY(0deg); }
          100% { transform: perspective(300px) rotateY(360deg); }
        }
        @keyframes shimmer {
          0%   { stop-color: #aaa; }
          25%  { stop-color: #fff; }
          50%  { stop-color: #ccc; }
          75%  { stop-color: #fff; }
          100% { stop-color: #aaa; }
        }
        .nike-swoosh-wrap {
          animation: swoosh3d 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          display: inline-block;
        }
        .shimmer-mid { animation: shimmer 3s ease-in-out infinite; }
      `}</style>
      <div className="nike-swoosh-wrap">
        <svg height={size} viewBox="0 0 400 155" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#888" />
              <stop offset="35%"  stopColor="#ddd" />
              <stop offset="50%"  stopColor="#fff" className="shimmer-mid" />
              <stop offset="65%"  stopColor="#ccc" />
              <stop offset="100%" stopColor="#777" />
            </linearGradient>
          </defs>
          <path
            d="M399.5 7.5c0 0-241.6 85-303.4 113.2c-17.9 8.2-34.4 11.1-47.8 9.2C28.3 126 10.7 106.7 16 84.3c3.9-16.7 19.1-29.6 39.8-31.7L0 147.5c0 0 17.5 7.1 47.3 5.5c32.7-1.7 65.5-13.9 96.9-28.7L399.5 7.5z"
            fill="url(#metalGrad)"
          />
        </svg>
      </div>
    </>
  )
}

// ── Final section ─────────────────────────────────────────────────────────────
function FinalSection() {
  return (
    <section style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.05) 0%, #0a0a0a 60%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px', textAlign: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <NikeSwoosh size={40} />
        <h2 style={{
          fontSize: 'clamp(44px, 7vw, 88px)',
          fontWeight: 900, color: '#fff',
          letterSpacing: '-0.03em', lineHeight: 1.0,
          textTransform: 'uppercase',
          margin: '36px 0 16px',
        }}>
          Metcon 10
        </h2>
        <p style={{
          fontSize: 20, fontWeight: 400,
          color: 'rgba(255,255,255,0.45)',
          margin: '0 0 12px',
          letterSpacing: '0.02em',
        }}>
          Just Do It.
        </p>
        <p style={{
          fontSize: 16, color: 'rgba(255,255,255,0.3)',
          lineHeight: 1.7, maxWidth: 380, margin: '0 auto 56px',
        }}>
          El calzado definitivo para crosstraining.<br />
          Disponible en Nike.com y tiendas seleccionadas.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            background: '#fff', color: '#111',
            border: 'none', borderRadius: 999,
            padding: '18px 48px', fontSize: 16,
            fontWeight: 700, letterSpacing: '0.05em',
            textTransform: 'uppercase', cursor: 'pointer',
            transition: 'background 0.2s, transform 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e5e5e5'; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Comprar ahora
          </button>
          <button style={{
            background: 'transparent', color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 999, padding: '18px 44px',
            fontSize: 16, fontWeight: 700,
            letterSpacing: '0.05em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Ver colección →
          </button>
        </div>
      </motion.div>
    </section>
  )
}
