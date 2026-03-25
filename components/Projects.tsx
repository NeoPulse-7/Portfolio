'use client'
import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { useScramble } from '@/hooks/useScramble'

const PROJECTS = [
  { id:'01', title:'PROJECT ONE',    sub:'Your first web project',         desc:'A beautifully crafted web experience. Modern tools, obsessive detail.',    tags:['React','Next.js','TypeScript','Tailwind'],   year:'2024', status:'LIVE', classified:false },
  { id:'02', title:'PROJECT TWO',    sub:'Full-stack application',         desc:'Full-stack app with seamless UX. Performance and polish every step.',       tags:['Next.js','Prisma','PostgreSQL','Framer'],    year:'2024', status:'LIVE', classified:false },
  { id:'03', title:'THIS PORTFOLIO', sub:'Because meta is still building', desc:'You\'re looking at it. Particles, smooth scroll, magnetic buttons.',        tags:['Next.js','Three.js','Framer Motion','Lenis'], year:'2025', status:'LIVE', classified:false },
  { id:'04', title:'[CLASSIFIED]',   sub:'— REDACTED —',                  desc:'████████████████ ██████████ ████████.',                                     tags:['???','???','???'],                           year:'????', status:'WIP',  classified:true  },
]

function ProjectRow({ p, idx }: { p: typeof PROJECTS[0]; idx: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const [hov,  setHov]   = useState(false)
  const [mouse,setMouse] = useState({ x: 0, y: 0 })
  const title  = useScramble(p.title, hov)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0, 1])
  const rotateX = useTransform(scrollYProgress, [0, 1],    [14, 0])
  const tz      = useTransform(scrollYProgress, [0, 1],    [-95, 0])
  const x       = useTransform(scrollYProgress, [0, 1],    [idx % 2 === 0 ? 65 : -65, 0])
  const yRow    = useTransform(scrollYProgress, [0, 1],    [idx * 10, 0])

  return (
    <motion.div ref={ref} style={{ opacity, x, rotateX, translateZ: tz, y: yRow, perspective: 1500 }} className="transform-gpu">
      <motion.div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onMouseMove={e => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setMouse({ x: e.clientX - r.left, y: e.clientY - r.top }) }}
        data-cursor="project" data-cursor-label="VIEW ↗"
        animate={{ backgroundColor: hov ? '#0d0d0d' : 'transparent' }}
        transition={{ duration: 0.28 }}
        className="relative w-full border-t border-white/[0.06]"
      >
        <a href="#" className="flex items-center justify-between py-9 md:py-11">
          <div className="flex items-center gap-6 md:gap-10 flex-1 min-w-0">
            <span className="font-mono text-[0.65rem] text-t3 flex-shrink-0 w-8">[{p.id}]</span>
            <div className="min-w-0">
              <motion.h3 animate={{ color: hov ? '#E8FF00' : '#EFEFEF' }} transition={{ duration: 0.2 }}
                className={`font-sans font-extrabold leading-tight tracking-[-0.025em] truncate ${p.classified ? 'blur-sm' : ''}`}
                style={{ fontSize: 'clamp(24px,4.2vw,62px)' }}>{title}</motion.h3>
              <p className="font-sans text-[0.8rem] text-t3 mt-1 hidden md:block">{p.sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 md:gap-8 flex-shrink-0">
            <div className="hidden lg:flex gap-2">
              {p.tags.slice(0, 3).map(t => (
                <motion.span key={t}
                  animate={{ borderColor: hov ? 'rgba(232,255,0,0.3)' : 'rgba(255,255,255,0.07)' }}
                  className="font-mono text-[0.63rem] text-t3 border px-2.5 py-1 rounded-sm">{t}</motion.span>
              ))}
            </div>
            <span className={`font-mono text-[0.65rem] tracking-widest hidden md:block ${p.status === 'LIVE' ? 'text-green-400' : 'text-acc'}`}>{p.status}</span>
            <span className="font-mono text-[0.7rem] text-t3">{p.year}</span>
            <motion.span animate={{ x: hov ? 9 : 0, color: hov ? '#E8FF00' : '#333', rotate: hov ? -45 : 0 }} transition={{ duration: 0.22 }} className="text-xl">→</motion.span>
          </div>
        </a>

        {/* Image reveal */}
        <motion.div className="absolute right-28 top-1/2 -translate-y-1/2 w-48 rounded-xl overflow-hidden pointer-events-none border border-white/[0.08]"
          style={{ height: '7rem' }}
          initial={{ opacity: 0, x: 90, scale: 0.88, rotateY: -18 }}
          animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : 90, scale: hov ? 1 : 0.88, rotateY: hov ? 0 : -18 }}
          transition={{ type: 'spring', stiffness: 310, damping: 32, delay: 0.02 }}>
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#080808] flex items-center justify-center">
            {p.classified
              ? <span className="font-mono text-[0.63rem] text-red-500 tracking-widest animate-pulse">CLASSIFIED</span>
              : <span className="font-sans font-extrabold text-5xl text-white/[0.04]">{p.id}</span>}
          </div>
        </motion.div>

        {/* Specular */}
        {hov && (
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at ${mouse.x}px ${mouse.y}px,rgba(255,255,255,0.022) 0%,transparent 55%)` }} />
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const mouse  = useMouseParallax(20)
  const heading= useScramble('PROJECTS', inView)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yChap = useTransform(scrollYProgress, [0, 1], [115, -115])
  const yHead = useTransform(scrollYProgress, [0, 1], [58,  -58])

  return (
    <section ref={ref} id="projects" className="relative py-28 md:py-44 px-10 md:px-20 section-border">
      <motion.div style={{ y: yChap }} className="absolute right-0 top-0 select-none pointer-events-none">
        <span style={{ fontSize: '22vw', color: 'rgba(255,255,255,0.018)', fontFamily: 'var(--font-sans)', fontWeight: 800 }}>02</span>
      </motion.div>
      <motion.div style={{ y: yChap, x: useTransform(mouse.x, v => v * 1.6), position: 'absolute', left: '5%', top: '28%', width: 1, height: 130, background: 'linear-gradient(to bottom,transparent,rgba(232,255,0,0.3),transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}>
            <p className="font-mono text-[0.65rem] text-acc tracking-[0.24em] uppercase mb-3">SELECTED_WORK</p>
            <motion.div style={{ y: yHead }}>
              <div className="overflow-hidden">
                <motion.div initial={{ y: '105%' }} animate={inView ? { y: '0%' } : {}} transition={{ duration: 0.92, ease: [0.76,0,0.24,1] }}>
                  <h2 className="font-sans font-extrabold leading-none tracking-[-0.035em] text-t1"
                    style={{ fontSize: 'clamp(52px,9vw,114px)' }}>{heading}</h2>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
          <p className="font-mono text-[0.65rem] text-t3 hidden md:block">( {PROJECTS.length} WORKS )</p>
        </div>
        <div>
          {PROJECTS.map((p, i) => <ProjectRow key={p.id} p={p} idx={i} />)}
          <div className="border-t border-white/[0.06]" />
        </div>
      </div>
    </section>
  )
}
