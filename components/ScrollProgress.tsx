'use client'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: '#E8FF00',
        transformOrigin: 'left',
        scaleX,
        zIndex: 9998,
        boxShadow: '0 0 8px rgba(232,255,0,0.6)',
      }}
    />
  )
}
