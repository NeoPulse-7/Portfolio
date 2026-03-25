'use client'
import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'

export function useScramble(target: string, trigger: boolean, speed = 40) {
  const [text, setText] = useState(target)
  const frame  = useRef(0)
  const iter   = useRef(0)
  const animId = useRef<number>(0)

  useEffect(() => {
    if (!trigger) return
    iter.current = 0
    cancelAnimationFrame(animId.current)
    const animate = () => {
      setText(
        target.split('').map((char, i) => {
          if (char === ' ') return ' '
          if (i < iter.current) return char
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      if (iter.current < target.length + 1) {
        if (frame.current % 2 === 0) iter.current += 0.5
        frame.current++
        animId.current = requestAnimationFrame(animate)
      } else { setText(target) }
    }
    animId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId.current)
  }, [trigger, target])

  return text
}
