'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useVelocity, useInView } from 'framer-motion'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { useScramble } from '@/hooks/useScramble'

const SKILLS = [
  {name:'HTML',serif:false},{name:'CSS',serif:true},{name:'JAVASCRIPT',serif:false},
  {name:'REACT',serif:true},{name:'NEXT.JS',serif:false},{name:'TYPESCRIPT',serif:true},
  {name:'TAILWIND',serif:false},{name:'FIGMA',serif:true},{name:'NODE.JS',serif:false},
  {name:'FRAMER MOTION',serif:true},{name:'THREE.JS',serif:false},{name:'GIT',serif:true},
  {name:'REST APIs',serif:false},{name:'GSAP',serif:true},
]

export default function Skills() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const inView  = useInView(wrapRef, { once: true, margin: '-80px' })
  const mouse   = useMouseParallax(18)
  const heading = useScramble('SKILLS', inView)

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start end', 'end start'] })
  const xTrack = useTransform(scrollYProgress, [0, 1], ['0%',  '-58%'])
  const xBg    = useTransform(scrollYProgress, [0, 1], ['0%',  '-24%'])
  const yMouse = useTransform(mouse.y, v => v * 15)
  const yChap  = useTransform(scrollYProgress, [0, 1], [65, -65])

  const { scrollY } = useScroll()
  const vel   = useVelocity(scrollY)
  const skewY = useTransform(vel, [-3000, 3000], [-3, 3])

  return (
    <div ref={wrapRef} id="skills" style={{ height: '300vh' }} className="relative section-border">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">

        {/* Drawing line decoration — animates when visible */}
        <motion.div className="absolute top-0 left-10 md:left-20 h-px"
          style={{ right: '60%', background: 'linear-gradient(to right,rgba(232,255,0,0.3),transparent)' }}
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="px-10 md:px-20 pt-16 flex items-end justify-between flex-shrink-0">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}>
            <p className="font-mono text-[0.65rem] text-acc tracking-[0.24em] uppercase mb-3">ARSENAL</p>
            <div className="overflow-hidden">
              <motion.div initial={{ y: '105%' }} animate={inView ? { y: '0%' } : {}} transition={{ duration: 0.92, ease: [0.76,0,0.24,1] }}>
                <h2 className="font-sans font-extrabold leading-none tracking-[-0.035em] text-t1" style={{ fontSize: 'clamp(44px,7vw,85px)' }}>{heading}</h2>
              </motion.div>
            </div>
          </motion.div>
          <p className="font-mono text-[0.65rem] text-t3">( {SKILLS.length} TECHNOLOGIES )</p>
        </div>

        <div className="relative flex-1 flex items-center overflow-hidden">
          <motion.div style={{ x: xBg, y: yMouse }} className="absolute inset-y-0 pointer-events-none opacity-[0.03]">
            <svg width="5000" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="hxs" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <polygon points="30,2 57,16 57,36 30,50 3,36 3,16" fill="none" stroke="white" strokeWidth="0.8"/>
              </pattern></defs>
              <rect width="5000" height="100%" fill="url(#hxs)"/>
            </svg>
          </motion.div>

          <motion.div style={{ x: xTrack, skewY, y: yMouse }} className="flex items-baseline gap-10 md:gap-14 whitespace-nowrap px-10 md:px-20 will-change-transform">
            {SKILLS.map((s, i) => (
              <div key={i} className="flex items-baseline gap-10 md:gap-14">
                <motion.span whileHover={{ color: '#E8FF00', y: -6 }} transition={{ duration: 0.18 }}
                  className="leading-none tracking-[-0.035em] select-none"
                  style={{
                    fontSize: s.serif ? 'clamp(46px,6.5vw,86px)' : 'clamp(68px,9.8vw,128px)',
                    fontFamily: s.serif ? 'var(--font-serif)' : 'var(--font-sans)',
                    fontStyle: s.serif ? 'italic' : 'normal',
                    fontWeight: s.serif ? 400 : 800,
                    color: s.serif ? '#606060' : '#EFEFEF',
                  }}>{s.name}</motion.span>
                {i < SKILLS.length - 1 && <span className="text-acc font-mono text-4xl opacity-3" style={{opacity:0.28}}>·</span>}
              </div>
            ))}
          </motion.div>
        </div>

        <div className="px-10 md:px-20 pb-10 flex-shrink-0">
          <p className="font-mono text-[0.62rem] text-t3 tracking-widest">← SCROLL TO EXPLORE →</p>
        </div>

        <motion.div style={{ y: yChap }} className="absolute right-0 bottom-0 select-none pointer-events-none">
          <span style={{ fontSize: '20vw', color: 'rgba(255,255,255,0.016)', fontFamily: 'var(--font-sans)', fontWeight: 800 }}>04</span>
        </motion.div>
      </div>
    </div>
  )
}
