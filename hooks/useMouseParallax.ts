'use client'
import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

export function useMouseParallax(strength = 1) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const x = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.8 })
  const y = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.8 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2 // -1 to 1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      rawX.set(nx * strength)
      rawY.set(ny * strength)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY, strength])

  return { x, y }
}
