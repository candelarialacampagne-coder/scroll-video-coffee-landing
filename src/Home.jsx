import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DEMOS } from './demos/index.js'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      fontFamily: "'DM Sans', sans-serif",
      padding: '60px 40px',
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 64 }}
      >
        <p style={{ fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#F97316', margin: '0 0 12px' }}>
          Luz Creativa
        </p>
        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700,
          color: '#fff', letterSpacing: '-0.04em', lineHeight: 1,
          margin: '0 0 16px',
        }}>
          Demo Lab
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
          Exploración de efectos y animaciones para la web.
        </p>
      </motion.div>

      {/* Demo grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 20,
        maxWidth: 1200,
      }}>
        {DEMOS.map((demo, i) => (
          <motion.div
            key={demo.id}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => navigate(demo.path)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: '28px',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
            }}
            whileHover={{ scale: 1.02 }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = `${demo.color}55`
              e.currentTarget.style.background = `${demo.color}08`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            }}
          >
            {/* Number */}
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
              color: demo.color, margin: '0 0 20px',
            }}>
              {String(i + 1).padStart(2, '0')}
            </p>

            <h2 style={{
              fontSize: 20, fontWeight: 700, color: '#fff',
              letterSpacing: '-0.02em', margin: '0 0 10px',
            }}>
              {demo.title}
            </h2>

            <p style={{
              fontSize: 13, color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.6, margin: '0 0 24px',
            }}>
              {demo.description}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {demo.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 999, padding: '3px 10px',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Arrow */}
            <div style={{
              marginTop: 28, display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 12, color: demo.color, fontWeight: 600 }}>
                Ver demo
              </span>
              <span style={{ color: demo.color, fontSize: 18 }}>→</span>
            </div>
          </motion.div>
        ))}

        {/* Placeholder — próxima demo */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: DEMOS.length * 0.1 }}
          style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px dashed rgba(255,255,255,0.07)',
            borderRadius: 20, padding: '28px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight: 200, gap: 12,
          }}
        >
          <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.1)' }}>+</span>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            Próxima demo
          </p>
        </motion.div>
      </div>
    </div>
  )
}
