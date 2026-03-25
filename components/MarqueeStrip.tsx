'use client'
import { useRef } from 'react'
import { motion, useScroll, useVelocity, useTransform, useAnimationFrame, useMotionValue, useSpring } from 'framer-motion'

const TEXT = 'WEB DEVELOPER · UI CRAFTSMAN · AVAILABLE FOR WORK · INDIA · BUILDING WITH OBSESSION · '

function VelocityMarquee({ direction = -1 }: { direction?: 1 | -1 }) {
  const { scrollY } = useScroll()
  const vel     = useVelocity(scrollY)
  const rawSkew = useTransform(vel, [-1500, 1500], [direction * -5, direction * 5])
  const skewX   = useSpring(rawSkew, { stiffness: 60, damping: 20 })
  const baseX   = useMotionValue(0)
  const velRef  = useRef(0)

  vel.onChange(v => { velRef.current = v })

  useAnimationFrame((_, delta) => {
    const speed  = 1.1 + Math.min(Math.abs(velRef.current) * 0.0008, 1.2)
    const moveBy = direction * speed * (delta / 1000) * 60
    let newX = (baseX.get() + moveBy) % 50
    if (newX > 0 && direction < 0) newX -= 50
    baseX.set(newX)
  })

  const x = useTransform(baseX, v => `${v}%`)

  return (
    <div className="overflow-hidden">
      <motion.div style={{ x, skewX }} className="flex whitespace-nowrap">
        {[TEXT, TEXT, TEXT, TEXT].map((t, i) => (
          <span key={i} className="font-sans font-bold flex-shrink-0"
            style={{ fontSize: 'clamp(22px,3vw,40px)', color: '#EFEFEF', letterSpacing:'-0.01em' }}>
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function MarqueeStrip({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="py-6 border-y border-white/[0.06] bg-[#0f0f0f] overflow-hidden select-none">
      <VelocityMarquee direction={reverse ? 1 : -1} />
    </div>
  )
}
