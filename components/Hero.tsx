'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useVelocity, useSpring, useMotionValue } from 'framer-motion'
import MagneticButton from './MagneticButton'
import { useMouseParallax } from '@/hooks/useMouseParallax'

const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false })

const LINES = [
  '> crafting interfaces that breathe_',
  '> turning designs into reality_',
  '> building the web, one pixel at a time_',
]

/* ── Subtle distortion grid near cursor ── */
function DistortionGrid() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let t = 0, mx = W / 2, my = H / 2, frame: number
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight })
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY }, { passive: true })
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.006
      ctx.strokeStyle = 'rgba(255,255,255,0.022)'
      ctx.lineWidth = 0.5
      const cols = 20, rows = 13
      for (let i = 0; i <= cols; i++) {
        const x0 = (i / cols) * W
        ctx.beginPath()
        for (let j = 0; j <= rows * 5; j++) {
          const y = (j / (rows * 5)) * H
          const dx = x0 - mx, dy = y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const force = Math.max(0, 1 - dist / 280)
          const wx = x0 + (dx / (dist + 1)) * force * -22 * Math.sin(t * 2)
          j === 0 ? ctx.moveTo(wx, y) : ctx.lineTo(wx, y)
        }
        ctx.stroke()
      }
      for (let j = 0; j <= rows; j++) {
        const y0 = (j / rows) * H
        ctx.beginPath()
        for (let i = 0; i <= cols * 5; i++) {
          const x = (i / (cols * 5)) * W
          const dx = x - mx, dy = y0 - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const force = Math.max(0, 1 - dist / 280)
          const wy = y0 + (dy / (dist + 1)) * force * -22 * Math.sin(t * 2)
          i === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy)
        }
        ctx.stroke()
      }
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} />
}

/* ── Typewriter ── */
function Typewriter() {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [del, setDel] = useState(false)
  useEffect(() => {
    const full = LINES[idx]
    let t: NodeJS.Timeout
    if (!del && text.length < full.length) t = setTimeout(() => setText(full.slice(0, text.length + 1)), 46)
    else if (!del && text.length === full.length) t = setTimeout(() => setDel(true), 2000)
    else if (del && text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), 22)
    else { setDel(false); setIdx((idx + 1) % LINES.length) }
    return () => clearTimeout(t)
  }, [text, del, idx])
  return (
    <p className="font-mono text-[0.78rem] text-t3 h-5 tracking-wide">
      {text}<motion.span animate={{ opacity: [1, 1, 0, 0] }} transition={{ repeat: Infinity, duration: 1 }}>|</motion.span>
    </p>
  )
}

/* ── Magnetic individual letter ── */
function MagLetter({ char, delay, ready }: { char: string; delay: number; ready: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 150, damping: 18, mass: 0.4 })

  useEffect(() => {
    if (!ready) return
    const onMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = 160
      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * 0.42
        x.set(dx * force)
        y.set(dy * force)
      } else {
        x.set(0)
        y.set(0)
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [ready, x, y])

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      initial={{ y: 160, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : {}}
      transition={{ delay, type: 'spring', stiffness: 220, damping: 20 }}
    >
      {char}
    </motion.span>
  )
}

/* ── Floating geometric shapes — subtle, NOT rectangles ── */
const RINGS = [
  { x: '8%',  y: '22%', size: 120, sp: 0.11, mx: -22, my: -14, rs: 0.04,  op: 0.055 },
  { x: '88%', y: '18%', size: 85,  sp: 0.22, mx:  18, my:  12, rs: -0.032,op: 0.065 },
  { x: '80%', y: '68%', size: 60,  sp: 0.17, mx: -14, my:  18, rs: 0.05,  op: 0.05  },
  { x: '12%', y: '75%', size: 50,  sp: 0.13, mx:  12, my: -16, rs: 0.038, op: 0.045 },
]

export default function Hero() {
  const [ready, setReady] = useState(false)
  const [scrollYVal, setScrollYVal] = useState(0)
  const { scrollY: sm } = useScroll()
  const vel = useVelocity(sm)

  const mouse1 = useMouseParallax(20)
  const mouse2 = useMouseParallax(32)
  const mouse4 = useMouseParallax(15)
  const mouse5 = useMouseParallax(26)

  const yTitle = useTransform(sm, [0, 900], [0, -500])
  const ySub   = useTransform(sm, [0, 900], [0, -340])
  const yCTA   = useTransform(sm, [0, 900], [0, -190])
  const yBg    = useTransform(sm, [0, 900], [0,  -65])
  const opHero = useTransform(sm, [0, 440], [1,    0])

  // 3D scene tilt on mouse
  const tiltX  = useTransform(mouse1.y, v => v * 0.15)
  const tiltY  = useTransform(mouse1.x, v => v * -0.15)
  const tiltXS = useSpring(tiltX, { stiffness: 50, damping: 18 })
  const tiltYS = useSpring(tiltY, { stiffness: 50, damping: 18 })

  // velocity skew on AYUSH
  const titleSkew  = useTransform(vel, [-3000, 3000], [3, -3])
  const titleSkewS = useSpring(titleSkew, { stiffness: 75, damping: 22 })

  useEffect(() => { const u = sm.onChange(v => setScrollYVal(v)); return u }, [sm])
  useEffect(() => { const t = setTimeout(() => setReady(true), 1900); return () => clearTimeout(t) }, [])

  // Starfield — 70 dots, each unique speed
  const stars = useRef(Array.from({ length: 70 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2.2 + 0.4, op: Math.random() * 0.25 + 0.04,
    speed: Math.random() * 0.42 + 0.06,
    mx: (Math.random() - 0.5) * 28,
  })))

  // Ring rotations
  const ringRots = useRef(RINGS.map(() => 0))
  const [rots, setRots] = useState<number[]>(RINGS.map(() => 0))
  useEffect(() => {
    let id: number
    const loop = () => {
      RINGS.forEach((r, i) => { ringRots.current[i] += r.rs })
      setRots([...ringRots.current])
      id = requestAnimationFrame(loop)
    }
    loop(); return () => cancelAnimationFrame(id)
  }, [])

  const LETTERS = 'AYUSH'.split('')

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden flex items-center px-10 md:px-20"
      style={{ perspective: '1100px' }}>

      {/* Layer 0 — particles + grid */}
      <motion.div style={{ y: yBg, zIndex: 1 }} className="absolute inset-0 pointer-events-none">
        <ParticleField scrollY={scrollYVal} />
        <DistortionGrid />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_88%_88%_at_50%_50%,transparent_10%,#080808_74%)]" />
      </motion.div>

      {/* SVG decorative lines — draw on load */}
      <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" style={{ zIndex: 3 }}>
        <motion.line x1="0" y1="1" x2="28%" y2="1" stroke="rgba(232,255,0,0.14)" strokeWidth="0.6"
          initial={{ pathLength: 0 }} animate={ready ? { pathLength: 1 } : {}} transition={{ delay: 1.6, duration: 1.2, ease: 'easeOut' }} />
        <motion.line x1="100%" y1="99%" x2="72%" y2="99%" stroke="rgba(232,255,0,0.14)" strokeWidth="0.6"
          initial={{ pathLength: 0 }} animate={ready ? { pathLength: 1 } : {}} transition={{ delay: 1.8, duration: 1.2, ease: 'easeOut' }} />
        <motion.line x1="99%" y1="0" x2="99%" y2="28%" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6"
          initial={{ pathLength: 0 }} animate={ready ? { pathLength: 1 } : {}} transition={{ delay: 2, duration: 1, ease: 'easeOut' }} />
      </svg>

      {/* Layer 1 — RINGS only (no rectangles!) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
        {RINGS.map((r, i) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const yS = useTransform(sm, [0, 900], [0, -900 * r.sp])
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const xM = useTransform(mouse2.x, v => v * (r.mx / 32))
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const yM = useTransform(mouse2.y, v => v * (r.my / 32))
          return (
            <motion.div key={i} style={{ position: 'absolute', left: r.x, top: r.y, x: xM, y: yS }}>
              <motion.div style={{ y: yM }}>
                <svg width={r.size} height={r.size} viewBox="0 0 100 100" opacity={r.op}
                  style={{ transform: `rotate(${rots[i]}deg)`, display: 'block' }}>
                  <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="12 6" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.4" />
                </svg>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Layer 2 — 70 stars, each unique scroll speed */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
        {stars.current.map((s, i) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const yS = useTransform(sm, [0, 900], [0, -900 * s.speed])
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const xM = useTransform(mouse1.x, v => v * (s.mx / 20))
          return (
            <motion.div key={i} style={{
              position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
              width: s.size, height: s.size, borderRadius: '50%',
              background: '#fff', opacity: s.op, y: yS, x: xM,
            }} />
          )
        })}
      </div>

      {/* TL meta */}
      <motion.div
        className="absolute top-24 left-10 md:left-20 font-mono text-[0.65rem] text-t3 tracking-[0.24em] uppercase pointer-events-none"
        style={{ zIndex: 6, opacity: opHero as any }}
        initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.3, duration: 0.8 }}
      >
        Web Developer · 2025
      </motion.div>

      {/* TR meta — 3 separate depths */}
      <div className="absolute right-10 md:right-20 top-1/2 -translate-y-1/2 flex flex-col gap-8 items-end pointer-events-none" style={{ zIndex: 6 }}>
        {[
          { label: 'CLASS 12', sp: 0.14, mm: 0.8 },
          { label: 'INDIA',    sp: 0.26, mm: 1.5 },
          { label: '17 YRS',   sp: 0.40, mm: 2.1 },
        ].map(({ label, sp, mm }, i) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const yS = useTransform(sm, [0, 900], [0, -900 * sp])
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const xM = useTransform(mouse5.x, v => v * mm)
          return (
            <motion.span key={label} style={{ y: yS, x: xM, opacity: opHero }}
              className="font-mono text-[0.65rem] text-t3 tracking-[0.18em] uppercase"
              initial={{ opacity: 0, x: 22 }} animate={ready ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >{label}</motion.span>
          )
        })}
      </div>

      {/* ── MAIN CONTENT — 3D tilt ── */}
      <motion.div className="relative w-full" style={{ zIndex: 6, rotateX: tiltXS, rotateY: tiltYS, transformStyle: 'preserve-3d' }}>

        {/* AYUSH — magnetic letters + velocity skew */}
        <motion.div style={{ y: yTitle }}>
          <motion.div style={{ skewX: titleSkewS, marginLeft: '-0.04em' }} className="flex overflow-visible">
            {LETTERS.map((l, i) => (
              <span key={i} style={{
                fontSize: 'clamp(100px,17vw,250px)',
                letterSpacing: '-0.04em',
                background: `linear-gradient(178deg, #EFEFEF ${10 + i * 14}%, #1e1e1e 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
              }}>
                <MagLetter char={l} delay={0.06 + i * 0.065} ready={ready} />
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        <motion.div style={{ y: ySub, x: useTransform(mouse4.x, v => v * 0.7) }} className="mt-5">
          <motion.p className="font-sans font-light text-t2 leading-relaxed"
            style={{ fontSize: 'clamp(1rem,1.75vw,1.3rem)' }}
            initial={{ opacity: 0, y: 30 }} animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            Crafting digital{' '}
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#EFEFEF' }}>experiences</em>
            {' '}that matter.
          </motion.p>
          <motion.div className="mt-3" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.75 }}>
            <Typewriter />
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div style={{ y: yCTA }} className="mt-9"
          initial={{ opacity: 0, y: 24 }} animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <MagneticButton data-cursor="hover" strength={0.48}>
            <button
              onClick={() => { const el = document.getElementById('projects'); (window as any).__lenis?.scrollTo(el, { duration: 1.5 }) }}
              className="relative group font-sans font-semibold text-[0.8rem] tracking-[0.16em] uppercase text-t2 hover:text-t1 transition-colors duration-300 pb-1">
              VIEW MY WORK
              <motion.span className="inline-block ml-2" animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
              <span className="absolute bottom-0 left-0 right-full h-px bg-acc group-hover:right-0 transition-all duration-500" />
            </button>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <motion.div style={{ opacity: opHero, zIndex: 6 }}
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-10 md:px-20 py-5 border-t border-white/[0.06]"
        initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.1 }}>
        <div className="flex items-center gap-2 font-mono text-[0.65rem] text-t3 tracking-[0.2em]">
          <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.3 }}>↓</motion.span> SCROLL
        </div>
        <p className="font-mono text-[0.65rem] text-t3 tracking-[0.14em]">OPEN TO WORK</p>
      </motion.div>
    </section>
  )
}
