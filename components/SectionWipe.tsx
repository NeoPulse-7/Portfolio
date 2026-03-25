'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function SectionWipe() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.4'] })
  const clip = useTransform(scrollYProgress, [0, 1], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'])

  return (
    <div ref={ref} className="relative h-px overflow-hidden" style={{ background: 'transparent' }}>
      <motion.div
        style={{
          clipPath: clip,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 20%, rgba(232,255,0,0.4) 50%, rgba(255,255,255,0.12) 80%, transparent)',
        }}
      />
    </div>
  )
}
