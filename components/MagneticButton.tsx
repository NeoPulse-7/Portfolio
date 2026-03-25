'use client'
import { useRef, useState, ReactNode } from 'react'
import { motion } from 'framer-motion'

export default function MagneticButton({
  children,
  className = '',
  strength = 0.32,
  'data-cursor': dc,
}: {
  children: ReactNode
  className?: string
  strength?: number
  'data-cursor'?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        setPos({
          x: (e.clientX - (r.left + r.width  / 2)) * strength,
          y: (e.clientY - (r.top  + r.height / 2)) * strength,
        })
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, mass: 0.5 }}
      className={`inline-block ${className}`}
      data-cursor={dc}
    >
      {children}
    </motion.div>
  )
}
