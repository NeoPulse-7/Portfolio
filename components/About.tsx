'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion'
import MagneticButton from './MagneticButton'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { useScramble } from '@/hooks/useScramble'

function Counter({ target, label }: { target: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let s = 0
    const step = (target / 1100) * 16
    const id = setInterval(() => { s += step; if (s >= target) { setN(target); clearInterval(id) } else setN(Math.floor(s)) }, 16)
    return () => clearInterval(id)
  }, [inView, target])
  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <span className="font-sans font-extrabold text-t1 leading-none" style={{ fontSize: 'clamp(3rem,5.5vw,5.5rem)' }}>
        {n}<span style={{ color: '#E8FF00' }}>+</span>
      </span>
      <span className="font-mono text-[0.65rem] text-t3 tracking-[0.2em] uppercase">{label}</span>
    </div>
  )
}

const NEOFETCH = [
  { key: 'Name',   val: 'Ayush' },
  { key: 'Role',   val: 'Frontend Developer' },
  { key: 'Focus',  val: 'UI/UX · Animation · Performance' },
  { key: 'Tools',  val: 'VS Code · Figma · Git' },
  { key: 'Stack',  val: 'Next.js · React · TypeScript' },
  { key: 'Status', val: '● AVAILABLE FOR WORK', green: true },
  { key: 'Mood',   val: 'Building something insane' },
]

function NeofetchCard({ inView }: { inView: boolean }) {
  const [shown, setShown] = useState(0)
  const [tilt,  setTilt]  = useState({ x: 0, y: 0 })
  useEffect(() => {
    if (!inView) return
    NEOFETCH.forEach((_, i) => setTimeout(() => setShown(i + 1), 180 + i * 125))
  }, [inView])
  return (
    <motion.div
      onMouseMove={e => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -10, y: ((e.clientX - r.left) / r.width - 0.5) * 10 })
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, boxShadow: `${tilt.y * 2}px ${-tilt.x * 2}px 40px rgba(0,0,0,0.4)` }}
      transition={{ type: 'spring', stiffness: 200, damping: 28 }}
      style={{ perspective: 900, transformStyle: 'preserve-3d' }}
      className="border border-white/[0.07] rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07] bg-[#0f0f0f]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" /><span className="w-3 h-3 rounded-full bg-[#ffbd2e]" /><span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-3 font-mono text-[0.65rem] text-t3">ayush@portfolio ~ $</span>
      </div>
      <div className="p-6 space-y-3 bg-[#0a0a0a]">
        <p className="font-mono text-[0.7rem] text-t3 mb-3">$ neofetch</p>
        <p className="font-mono text-[0.65rem] text-t3">───────────────────────</p>
        {NEOFETCH.map((row, i) => (
          <motion.div key={row.key} initial={{ opacity: 0, x: -14 }} animate={i < shown ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.32 }}
            className="flex gap-3 font-mono text-[0.7rem]">
            <span style={{ color: '#E8FF00' }} className="w-14 flex-shrink-0">{row.key}</span>
            <span className="text-t3">:</span>
            <span className={row.green ? 'text-green-400 flex items-center gap-1.5' : 'text-t2'}>
              {row.green && <motion.span className="w-1.5 h-1.5 rounded-full bg-green-400"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} />}
              {row.val}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* Scroll-driven SVG line that draws itself as section enters */
function DrawLine({ inView }: { inView: boolean }) {
  return (
    <div className="absolute top-0 right-0 w-px h-full pointer-events-none" style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ height: '0%' }}
        animate={inView ? { height: '100%' } : {}}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(232,255,0,0.25) 40%, rgba(232,255,0,0.1) 70%, transparent)', width: '1px' }}
      />
    </div>
  )
}

const BODY = [
  "I'm", "Ayush", "—", "a", "17-year-old", "web", "developer",
  "from", "India", "who", "builds", "with", "intention.",
  "I", "obsess", "over", "the", "gap", "between", "a", "good",
  "interface", "and", "an", "unforgettable", "one.",
  "Every", "pixel", "is", "a", "decision.",
]

export default function About() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const mouse  = useMouseParallax(22)
  const mouseR = useMouseParallax(34)
  const heading = useScramble('WHO AM I', inView)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yChap = useTransform(scrollYProgress, [0, 1], [120, -120])
  const yL    = useTransform(scrollYProgress, [0, 1], [70,  -70])
  const yR    = useTransform(scrollYProgress, [0, 1], [48,  -48])
  const yHead = useTransform(scrollYProgress, [0, 1], [55,  -55])
  const rotate = useTransform(scrollYProgress, [0, 1], [-1.5, 1.5])

  return (
    <section ref={ref} id="about" className="relative py-36 md:py-52 px-10 md:px-20 overflow-hidden dot-grid section-border">
      <DrawLine inView={inView} />

      {/* Chapter bg */}
      <motion.div style={{ y: yChap }} className="absolute left-0 top-0 select-none pointer-events-none">
        <span style={{ fontSize: '24vw', color: 'rgba(255,255,255,0.02)', fontFamily: 'var(--font-sans)', fontWeight: 800 }}>01</span>
      </motion.div>

      {/* Accent dots */}
      <motion.div style={{ y: yChap, x: useTransform(mouse.x, v => v * 1.5), position: 'absolute', top: '12%', right: '9%', width: 6, height: 6, borderRadius: '50%', background: '#E8FF00', boxShadow: '0 0 24px rgba(232,255,0,0.7)' }} />
      <motion.div style={{ y: yR, x: useTransform(mouse.x, v => v * 0.6), position: 'absolute', bottom: '16%', left: '6%', width: 1, height: 90, background: 'linear-gradient(to bottom,rgba(232,255,0,0.4),transparent)' }} />

      <div className="relative z-10 grid md:grid-cols-2 gap-16 md:gap-28 max-w-7xl mx-auto items-start">

        {/* LEFT */}
        <motion.div style={{ y: yL, x: useTransform(mouse.x, v => v * 0.45) }} className="flex flex-col gap-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="font-mono text-[0.65rem] text-acc tracking-[0.24em] uppercase flex items-center gap-2">
            ABOUT_ME.exe
            <motion.span animate={{ opacity: [1, 1, 0, 0] }} transition={{ repeat: Infinity, duration: 1 }}>|</motion.span>
          </motion.div>

          {/* Scramble heading with slot reveal */}
          <motion.div style={{ y: yHead, rotate }}>
            <div className="overflow-hidden">
              <motion.div initial={{ y: '105%' }} animate={inView ? { y: '0%' } : {}}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}>
                <h2 className="font-sans font-extrabold leading-[0.9] tracking-[-0.035em] text-t1"
                  style={{ fontSize: 'clamp(56px,8.5vw,100px)' }}>
                  {heading.slice(0, 3)}
                  <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: '#505050' }}>
                    {heading.slice(3)}
                  </span>
                </h2>
              </motion.div>
            </div>
          </motion.div>

          {/* Word by word reveal */}
          <div className="flex flex-wrap gap-x-1.5 gap-y-0.5">
            {BODY.map((word, i) => (
              <div key={i} className="overflow-hidden">
                <motion.span
                  className={`font-sans text-[1.05rem] font-light leading-relaxed inline-block ${word === 'Ayush' ? 'text-t1 font-medium' : word === 'unforgettable' ? 'font-serif italic text-t1 not-italic' : 'text-t2'}`}
                  style={word === 'unforgettable' ? { fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#EFEFEF' } : {}}
                  initial={{ y: '120%', opacity: 0 }}
                  animate={inView ? { y: '0%', opacity: 1 } : {}}
                  transition={{ delay: 0.22 + i * 0.028, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
                <span className="font-sans text-[1.05rem] text-t2 font-light"> </span>
              </div>
            ))}
          </div>

          <motion.div className="flex gap-14 pt-6 border-t border-white/[0.06]"
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.7 }}>
            <Counter target={5}  label="Projects"     />
            <Counter target={3}  label="Certificates" />
            <Counter target={1}  label="Year Exp"     />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.65 }}>
            <MagneticButton data-cursor="hover">
              <button className="relative group font-sans text-[0.8rem] font-semibold text-t2 hover:text-t1 transition-colors pb-0.5">
                DOWNLOAD CV →
                <span className="absolute bottom-0 left-0 right-full h-px bg-acc group-hover:right-0 transition-all duration-400" />
              </button>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* RIGHT */}
        <motion.div style={{ y: yR, x: useTransform(mouseR.x, v => v * 0.55) }}
          initial={{ opacity: 0, x: 55 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.05, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6">
          <NeofetchCard inView={inView} />
          <motion.blockquote
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.18rem', color: '#3a3a3a', lineHeight: 1.75 }}
            className="pl-5 border-l-2 border-acc/20"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}>
            &ldquo;Every great interface started as someone&apos;s obsession.&rdquo;
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  )
}
