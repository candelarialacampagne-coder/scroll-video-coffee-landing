import { useEffect, useRef, useState } from 'react'
import { useScroll, useMotionValueEvent, useTransform, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const TOTAL_FRAMES = 243
const FRAMES_PATH = '/frames-iphone/frame_'

const SECTIONS = [
  {
    at: 0.0,
    title: 'iPhone 16 Pro',
    sub: 'Diseñado para brillar.',
    color: '#fff',
  },
  {
    at: 0.22,
    title: 'Titanio. El material\nde los campeones.',
    sub: 'El más liviano y resistente de todos.',
    color: '#e5e0d8',
  },
  {
    at: 0.44,
    title: 'A18 Pro.',
    sub: 'El chip más poderoso en un smartphone.',
    color: '#fff',
  },
  {
    at: 0.66,
    title: 'Cámara Pro de 48 MP.',
    sub: 'Fotos que hablan por sí solas.',
    color: '#e5e0d8',
  },
  {
    at: 0.85,
    title: 'Desde $1.299.999',
    sub: 'Disponible en cuatro colores de titanio.',
    color: '#fff',
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

export default function IphoneLanding() {
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

    // Find active section
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
    <div style={{ background: '#000', fontFamily: '-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif' }}>

      {/* ── Sticky scroll zone ── */}
      <div ref={containerRef} style={{ height: '600vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          {/* Canvas */}
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

          {/* Subtle bottom gradient */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.7) 100%)',
          }} />

          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            style={{
              position: 'absolute', top: 24, left: 24, zIndex: 50,
              background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 999, padding: '7px 16px',
              color: 'rgba(255,255,255,0.6)', fontSize: 12,
              cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          >
            ← Demo Lab
          </button>

          {/* Apple nav */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '22px 0',
            pointerEvents: 'none',
          }}>
            <AppleLogo />
          </div>

          {/* Dynamic text block */}
          <TextBlock section={section} index={activeSection} />

          {/* Progress dots */}
          <div style={{
            position: 'absolute', right: 28, top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {SECTIONS.map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: i === activeSection ? 1 : 0.5, opacity: i === activeSection ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#fff',
                }}
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

          {/* Loading */}
          {!ready && (
            <div style={{
              position: 'absolute', inset: 0, background: '#000',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 28,
              zIndex: 100,
            }}>
              <AppleLogo />
              <div style={{ width: 160, height: 1, background: 'rgba(255,255,255,0.06)', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%',
                  width: `${loadProgress}%`,
                  background: '#fff',
                  transition: 'width 0.15s linear',
                }} />
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: 0, letterSpacing: '0.1em' }}>
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

// ── Text block ────────────────────────────────────────────────────────────────
function TextBlock({ section, index }) {
  return (
    <div style={{
      position: 'absolute', bottom: '14%', left: 0, right: 0,
      textAlign: 'center', pointerEvents: 'none', padding: '0 24px',
    }}>
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 style={{
          fontSize: 'clamp(32px, 5.5vw, 72px)',
          fontWeight: 700,
          color: section.color,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          margin: '0 0 14px',
          whiteSpace: 'pre-line',
          textShadow: '0 2px 20px rgba(0,0,0,0.4)',
        }}>
          {section.title}
        </h2>
        <p style={{
          fontSize: 'clamp(15px, 2vw, 22px)',
          color: section.color,
          opacity: 0.65,
          margin: section.cta ? '0 0 28px' : 0,
          fontWeight: 300,
          letterSpacing: '-0.01em',
        }}>
          {section.sub}
        </p>

        {section.cta && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', pointerEvents: 'all' }}>
            <button style={{
              background: '#0071e3',
              color: '#fff', border: 'none',
              borderRadius: 999, padding: '13px 32px',
              fontSize: 15, fontWeight: 500,
              cursor: 'pointer', transition: 'background 0.2s, transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0077ed'; e.currentTarget.style.transform = 'scale(1.03)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0071e3'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              Comprar
            </button>
            <button style={{
              background: 'transparent',
              color: '#0071e3', border: '1px solid #0071e3',
              borderRadius: 999, padding: '13px 32px',
              fontSize: 15, fontWeight: 500,
              cursor: 'pointer', transition: 'background 0.2s, transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,113,227,0.1)'; e.currentTarget.style.transform = 'scale(1.03)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              Más información
            </button>
          </div>
        )}
      </motion.div>
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
      <span style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
        Scroll
      </span>
    </motion.div>
  )
}

// ── Apple logo SVG ────────────────────────────────────────────────────────────
function AppleLogo() {
  return (
    <svg width="18" height="22" viewBox="0 0 814 1000" fill="rgba(255,255,255,0.8)">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.8 268.5-317.8 71 0 130.1 46.4 174.1 46.4 42.1 0 108.2-49 188.5-49 30.2 0 108.2 2.6 168.6 74.8zm-186.3-86.4c3.2-17.4 11.6-38.1 30.2-57.5 23.1-24.5 57.8-42.1 93.4-42.1h6.5c-3.2 71-61.6 124.6-94.6 135.4-3.2 1.3-8.5 1.9-13 1.9-2 0-5.8-.6-22.5-4.5v-33.2z"/>
    </svg>
  )
}

// ── Final section ─────────────────────────────────────────────────────────────
function FinalSection() {
  return (
    <section style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px', textAlign: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(0,80,200,0.12) 0%, #000 55%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <AppleLogo />
        <h2 style={{
          fontSize: 'clamp(40px, 6vw, 76px)',
          fontWeight: 700, color: '#f5f5f7',
          letterSpacing: '-0.04em', lineHeight: 1.05,
          margin: '32px 0 16px', maxWidth: 640,
        }}>
          iPhone 16 Pro.
        </h2>
        <p style={{
          fontSize: 22, fontWeight: 300,
          color: 'rgba(245,245,247,0.5)',
          margin: '0 0 12px',
        }}>
          Un enorme avance. En titanio.
        </p>
        <p style={{
          fontSize: 17, color: 'rgba(245,245,247,0.35)',
          lineHeight: 1.7, maxWidth: 400, margin: '0 auto 52px',
        }}>
          Desde $1.299.999. Cuotas sin interés con tarjeta Visa.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            background: '#0071e3', color: '#fff',
            border: 'none', borderRadius: 999,
            padding: '16px 40px', fontSize: 17, fontWeight: 400,
            cursor: 'pointer', transition: 'background 0.2s, transform 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0077ed'; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0071e3'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Comprar
          </button>
          <button style={{
            background: 'transparent', color: '#0071e3',
            border: '1px solid #0071e3', borderRadius: 999,
            padding: '16px 36px', fontSize: 17, fontWeight: 400,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,113,227,0.1)'; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Más información →
          </button>
        </div>
      </motion.div>
    </section>
  )
}
