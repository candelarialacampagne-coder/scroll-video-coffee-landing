import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// ─── Content ──────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'intro',
    label: null,
    title: 'Un retiro perfecto\nen Mendoza.',
    sub: 'Valle de Uco · Argentina',
    body: 'A 90 minutos de Mendoza, rodeado de los Andes y los mejores viñedos del mundo. Alpasión Lodge es un refugio donde el lujo se encuentra con la naturaleza.',
    cta: null,
    bg: 'linear-gradient(135deg, #3d2b1f 0%, #6b3d2e 40%, #c4723a 100%)',
    accent: '#c4723a',
    stat: null,
  },
  {
    id: 'habitaciones',
    label: '01 — Alojamiento',
    title: 'Habitaciones\ncon alma propia.',
    sub: 'Dobles con terraza privada',
    body: 'Siete habitaciones únicas, cada una diseñada para reflejar uno de los elementos naturales. Techos de adobe, vigas de quebracho y vistas incomparables a la Cordillera de los Andes.',
    cta: 'Ver habitaciones',
    bg: 'linear-gradient(160deg, #2c1f14 0%, #5c3d28 50%, #8b6040 100%)',
    accent: '#d4845a',
    stat: { number: '7', label: 'Habitaciones únicas' },
  },
  {
    id: 'glamping',
    label: '02 — Glamping',
    title: 'Glamping bajo\nlas estrellas.',
    sub: 'Tiendas de campaña de lujo',
    body: 'Cama king size, baño privado y deck exclusivo. La emoción de acampar con las comodidades de un alojamiento de alta gama. El cielo del Valle de Uco, tu techo.',
    cta: 'Descubrir glamping',
    bg: 'linear-gradient(160deg, #0d1a2e 0%, #1a3a5c 50%, #2d5a8e 100%)',
    accent: '#6a9fcb',
    stat: { number: '∞', label: 'Estrellas visibles' },
  },
  {
    id: 'agroturismo',
    label: '03 — Agroturismo',
    title: 'Viñedos que\nse pueden tocar.',
    sub: 'Conectate con la naturaleza',
    body: 'Recorrés los 85 hectáreas de terroir único. Conocés la vendimia de cerca, participás del proceso y entendés por qué el Valle de Uco es una de las regiones vitivinícolas más importantes del mundo.',
    cta: 'Explorar el campo',
    bg: 'linear-gradient(160deg, #1a2e1a 0%, #2d5a2d 50%, #4a8a3a 100%)',
    accent: '#7ab86a',
    stat: { number: '85', label: 'Hectáreas de viñedo' },
  },
  {
    id: 'instalaciones',
    label: '04 — Experiencias',
    title: 'Todo lo que\nnecesitás.',
    sub: 'Instalaciones y actividades',
    body: 'Bodega con degustación, restaurante Iris de cocina argentina contemporánea, piscina con vistas a los Andes, biblioteca junto a la chimenea, yoga entre los olivos, trekking y ciclismo.',
    cta: 'Ver instalaciones',
    bg: 'linear-gradient(160deg, #2e1a0d 0%, #6b3d1a 50%, #c4873a 100%)',
    accent: '#e8a04a',
    stat: { number: '90', label: 'Min desde Mendoza' },
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AlpasionLanding() {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef([])

  // Observe which section is in view
  useEffect(() => {
    const observers = SECTIONS.map((_, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i) },
        { threshold: 0.5 }
      )
      if (sectionRefs.current[i]) obs.observe(sectionRefs.current[i])
      return obs
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const active = SECTIONS[activeIndex]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Georgia, "Times New Roman", serif', background: '#0d0a08' }}>

      {/* ── Left panel — sticky ── */}
      <div style={{
        width: '50%', position: 'sticky', top: 0,
        height: '100vh', overflow: 'hidden', flexShrink: 0,
      }}>
        {/* Background gradient that morphs */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              background: active.bg,
            }}
          />
        </AnimatePresence>

        {/* Grain texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          pointerEvents: 'none',
        }} />

        {/* Decorative circle */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`circle-${active.id}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              bottom: '-15%', right: '-15%',
              width: '70%', aspectRatio: '1',
              borderRadius: '50%',
              border: `1px solid ${active.accent}30`,
              background: `radial-gradient(circle, ${active.accent}15 0%, transparent 70%)`,
            }}
          />
        </AnimatePresence>

        {/* Stat */}
        <AnimatePresence mode="wait">
          {active.stat && (
            <motion.div
              key={`stat-${active.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                position: 'absolute', bottom: 48, left: 48,
              }}
            >
              <div style={{
                fontSize: 'clamp(56px, 7vw, 88px)',
                fontWeight: 700, color: active.accent,
                lineHeight: 1, letterSpacing: '-0.04em',
                fontFamily: 'Georgia, serif',
              }}>
                {active.stat.number}
              </div>
              <div style={{
                fontSize: 12, color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                marginTop: 6, fontFamily: 'sans-serif',
              }}>
                {active.stat.label}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logo / brand */}
        <div style={{
          position: 'absolute', top: 36, left: 40,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            border: `1.5px solid ${active.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={active.accent}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em', fontFamily: 'sans-serif' }}>
            ALPASIÓN
          </span>
        </div>

        {/* Progress dots */}
        <div style={{
          position: 'absolute', right: 28, top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {SECTIONS.map((s, i) => (
            <motion.div
              key={i}
              animate={{
                height: i === activeIndex ? 24 : 6,
                opacity: i === activeIndex ? 1 : 0.25,
                background: i === activeIndex ? active.accent : '#fff',
              }}
              transition={{ duration: 0.3 }}
              style={{ width: 2, borderRadius: 2 }}
            />
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute', top: 36, right: 40,
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 999, padding: '6px 14px',
            color: 'rgba(255,255,255,0.5)', fontSize: 11,
            cursor: 'pointer', fontFamily: 'sans-serif',
            letterSpacing: '0.06em',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >
          ← Demo Lab
        </button>
      </div>

      {/* ── Right panel — scrollable ── */}
      <div style={{ width: '50%', background: '#0d0a08' }}>

        {SECTIONS.map((section, i) => (
          <Section
            key={section.id}
            section={section}
            isActive={i === activeIndex}
            ref={el => sectionRefs.current[i] = el}
          />
        ))}

        {/* Final CTA */}
        <FinalCTA accent={active.accent} />
      </div>
    </div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────
import { forwardRef } from 'react'

const Section = forwardRef(({ section, isActive }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 56px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        position: 'relative',
      }}
    >
      {/* Active indicator line */}
      <motion.div
        animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        style={{
          position: 'absolute', left: 0, top: '20%', bottom: '20%',
          width: 2,
          background: `linear-gradient(to bottom, transparent, ${section.accent}, transparent)`,
          transformOrigin: 'top',
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Label */}
      {section.label && (
        <motion.p
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: section.accent, margin: '0 0 28px',
            fontFamily: 'sans-serif', fontWeight: 600,
          }}
        >
          {section.label}
        </motion.p>
      )}

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        style={{
          fontSize: 'clamp(36px, 4vw, 58px)',
          fontWeight: 700, color: '#f5f0e8',
          lineHeight: 1.05, letterSpacing: '-0.03em',
          margin: '0 0 8px', whiteSpace: 'pre-line',
        }}
      >
        {section.title}
      </motion.h2>

      {/* Sub */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        viewport={{ once: true }}
        style={{
          fontSize: 13, color: section.accent,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          fontFamily: 'sans-serif', margin: '0 0 28px',
        }}
      >
        {section.sub}
      </motion.p>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        style={{
          height: 1, marginBottom: 28,
          background: `linear-gradient(90deg, ${section.accent}40, transparent)`,
          transformOrigin: 'left',
        }}
      />

      {/* Body */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        viewport={{ once: true }}
        style={{
          fontSize: 17, color: 'rgba(245,240,232,0.55)',
          lineHeight: 1.8, margin: '0 0 40px',
          fontWeight: 400, maxWidth: 460,
        }}
      >
        {section.body}
      </motion.p>

      {/* CTA */}
      {section.cta && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          viewport={{ once: true }}
        >
          <button
            style={{
              background: 'transparent',
              color: section.accent,
              border: `1px solid ${section.accent}60`,
              borderRadius: 999, padding: '12px 28px',
              fontSize: 13, fontWeight: 400,
              fontFamily: 'sans-serif', letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${section.accent}15`
              e.currentTarget.style.borderColor = section.accent
              e.currentTarget.style.transform = 'translateX(4px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = `${section.accent}60`
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            {section.cta}
            <span style={{ fontSize: 16 }}>→</span>
          </button>
        </motion.div>
      )}
    </div>
  )
})

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA({ accent }) {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '80px 56px',
      background: 'linear-gradient(to bottom, #0d0a08, #1a0e06)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: '-80px' }}
      >
        <p style={{
          fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: accent, marginBottom: 20, fontFamily: 'sans-serif',
        }}>
          Valle de Uco · Mendoza · Argentina
        </p>
        <h2 style={{
          fontSize: 'clamp(38px, 4.5vw, 60px)',
          fontWeight: 700, color: '#f5f0e8',
          letterSpacing: '-0.03em', lineHeight: 1.05,
          margin: '0 0 20px',
        }}>
          Tu próxima escapada<br />te está esperando.
        </h2>
        <p style={{
          fontSize: 16, color: 'rgba(245,240,232,0.4)',
          lineHeight: 1.8, maxWidth: 400,
          margin: '0 0 48px', fontFamily: 'sans-serif',
        }}>
          Habitaciones, Glamping y Agroturismo en el corazón del mejor terroir de Argentina.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button style={{
            background: accent, color: '#0d0a08',
            border: 'none', borderRadius: 999,
            padding: '14px 36px', fontSize: 14,
            fontWeight: 700, fontFamily: 'sans-serif',
            letterSpacing: '0.04em', cursor: 'pointer',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = `0 0 30px ${accent}50` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            Reservar ahora
          </button>
          <button style={{
            background: 'transparent', color: 'rgba(245,240,232,0.5)',
            border: '1px solid rgba(245,240,232,0.15)',
            borderRadius: 999, padding: '14px 30px',
            fontSize: 14, fontFamily: 'sans-serif',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,240,232,0.4)'; e.currentTarget.style.color = '#f5f0e8' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,240,232,0.15)'; e.currentTarget.style.color = 'rgba(245,240,232,0.5)' }}
          >
            reservations@alpasion.com
          </button>
        </div>

        <p style={{
          marginTop: 40, fontSize: 12, color: 'rgba(245,240,232,0.2)',
          fontFamily: 'sans-serif', letterSpacing: '0.06em',
        }}>
          +54 261 320 2999 · Ruta Provincial n° 94, Los Chacayes, Tunuyán
        </p>
      </motion.div>
    </div>
  )
}
