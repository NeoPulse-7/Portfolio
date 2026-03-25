'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = ['About', 'Projects', 'Skills', 'Contact']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (id: string) => {
    const el = document.getElementById(id.toLowerCase())
    ;(window as any).__lenis?.scrollTo(el, { offset: -80, duration: 1.4 })
    setOpen(false)
  }

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[900] flex items-center justify-between px-10 md:px-20 h-16"
        animate={{
          backgroundColor: scrolled ? 'rgba(8,8,8,0.88)' : 'transparent',
          backdropFilter:   scrolled ? 'blur(20px)' : 'blur(0px)',
          borderBottomColor: scrolled ? 'rgba(255,255,255,0.06)' : 'transparent',
        }}
        style={{ borderBottom: '1px solid transparent' }}
        transition={{ duration: 0.4 }}
      >
        <motion.a href="/" data-cursor="hover"
          className="font-sans font-bold text-[1.05rem] tracking-tight text-t1"
          whileHover={{ color: '#E8FF00' }} transition={{ duration: 0.15 }}>
          AYUSH<span className="text-acc">.</span>
        </motion.a>

        <ul className="hidden md:flex gap-10 list-none">
          {LINKS.map(l => (
            <li key={l}>
              <button onClick={() => go(l)} data-cursor="hover"
                className="relative font-sans text-[0.82rem] font-medium text-t2 hover:text-t1 transition-colors duration-200 group pb-0.5">
                {l}
                <span className="absolute bottom-0 left-1/2 right-1/2 h-px bg-acc transition-all duration-300 group-hover:left-0 group-hover:right-0" />
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2 font-mono text-[0.65rem] text-t3 tracking-widest uppercase">
          <motion.span className="w-1.5 h-1.5 rounded-full bg-green-400"
            animate={{ scale: [1,1.5,1], opacity: [1,0.4,1] }}
            transition={{ repeat: Infinity, duration: 1.8 }} />
          Available for work
        </div>

        <button onClick={() => setOpen(!open)} data-cursor="button"
          className="md:hidden flex flex-col gap-1.5 w-5 z-[901]">
          <motion.span animate={{ rotate: open?45:0, y: open?7:0 }}   className="block h-px bg-t1 w-full" />
          <motion.span animate={{ opacity: open?0:1, x: open?-8:0 }}  className="block h-px bg-t1 w-full" />
          <motion.span animate={{ rotate: open?-45:0, y: open?-7:0 }} className="block h-px bg-t1 w-full" />
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[800] bg-[#080808] flex flex-col items-center justify-center gap-10">
            {LINKS.map((l, i) => (
              <motion.button key={l} initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                transition={{ delay: i*0.07 }} onClick={() => go(l)}
                className="font-sans font-bold text-5xl text-t1 hover:text-acc transition-colors">
                {l}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
