'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Intro() {
  const [phase, setPhase] = useState<0|1|2|3>(0)
  const [count, setCount] = useState(0)
  const [done,  setDone]  = useState(false)

  useEffect(() => {
    let c = 0
    const id = setInterval(() => {
      c += Math.floor(Math.random() * 14) + 6
      if (c >= 100) { setCount(100); clearInterval(id) }
      else setCount(c)
    }, 35)
    const t1 = setTimeout(() => setPhase(1), 850)
    const t2 = setTimeout(() => setPhase(2), 1380)
    const t3 = setTimeout(() => setPhase(3), 2100)
    const t4 = setTimeout(() => setDone(true), 2650)
    return () => { clearInterval(id); [t1,t2,t3,t4].forEach(clearTimeout) }
  }, [])

  if (done) return null

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9998] overflow-hidden pointer-events-none"
          style={{ background: '#080808' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Count */}
          <motion.div
            className="absolute font-mono text-[0.65rem] tracking-[0.5em] text-[#333]"
            style={{ bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)' }}
            animate={{ opacity: phase >= 1 ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            LOADING {count}%
          </motion.div>

          {/* Laser line with glow tip */}
          {phase >= 1 && phase < 3 && (
            <div className="absolute inset-x-0" style={{ top: '50%' }}>
              <motion.div
                initial={{ scaleX: 0, transformOrigin: 'left center' }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.5) 30%,#E8FF00 50%,rgba(255,255,255,0.5) 70%,transparent)',
                  boxShadow: '0 0 24px rgba(232,255,0,0.6)',
                }}
              />
            </div>
          )}

          {/* Top half */}
          <motion.div className="absolute top-0 left-0 right-0 bg-[#080808]" style={{ bottom: '50%' }}
            animate={phase >= 2 ? { y: '-100%' } : { y: '0%' }}
            transition={{ duration: 0.78, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Bottom half */}
          <motion.div className="absolute left-0 right-0 bottom-0 bg-[#080808]" style={{ top: '50%' }}
            animate={phase >= 2 ? { y: '100%' } : { y: '0%' }}
            transition={{ duration: 0.78, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Name flash */}
          {phase >= 2 && phase < 3 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 10 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.55, times: [0, 0.2, 0.7, 1] }}
            >
              <span className="font-sans font-extrabold text-acc select-none"
                style={{ fontSize: 'clamp(80px,14vw,200px)', letterSpacing: '-0.04em' }}>
                AYUSH
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
