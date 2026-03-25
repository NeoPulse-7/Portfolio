'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── ZERO LAG DOT via direct DOM — bypasses React entirely ─── */
function ZeroDot() {
  const dotRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<string>('default')

  useEffect(() => {
    const dot = dotRef.current!
    let raf: number
    let tx = -300, ty = -300

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }

    const loop = () => {
      dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    loop()
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      id="zero-dot"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 7, height: 7,
        borderRadius: '50%',
        background: '#E8FF00',
        boxShadow: '0 0 12px #E8FF00, 0 0 28px rgba(232,255,0,0.5)',
        pointerEvents: 'none',
        zIndex: 999999,
        willChange: 'transform',
        mixBlendMode: 'exclusion',
      }}
    />
  )
}

/* ─── Canvas trail ─── */
function Trail() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    let mx = -300, my = -300, lx = -300, ly = -300
    const trail: { x: number; y: number; r: number; a: number }[] = []
    let frame: number

    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    })
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY }, { passive: true })

    const loop = () => {
      ctx.clearRect(0, 0, W, H)

      const dx = mx - lx, dy = my - ly
      const vel = Math.min(Math.sqrt(dx * dx + dy * dy), 40)

      if (vel > 1) {
        trail.push({ x: mx, y: my, r: Math.max(2, vel * 0.18), a: Math.min(vel * 0.045, 0.7) })
      }
      lx += dx * 0.35; ly += dy * 0.35

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i]
        p.a  -= 0.042
        p.r  *= 0.958
        if (p.a <= 0 || p.r < 0.3) { trail.splice(i, 1); continue }

        const rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5)
        rg.addColorStop(0, `rgba(232,255,0,${p.a})`)
        rg.addColorStop(1, `rgba(232,255,0,0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = rg
        ctx.fill()
      }

      if (trail.length > 60) trail.splice(0, trail.length - 60)
      frame = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <canvas ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99993, mixBlendMode: 'screen' }} />
  )
}

/* ─── Precision ring ─── */
function Ring({ size, color, spin, label }: { size: number; color: string; spin: number; label?: string }) {
  const r = size / 2 - 5
  const cx = size / 2, cy = size / 2
  const c = 2 * Math.PI * r
  const d = c * 0.2, g = c * 0.05

  const ticks = [0, 90, 180, 270].map(a => {
    const rad = (a + spin) * Math.PI / 180
    return {
      x1: cx + Math.cos(rad) * (r + 3),
      y1: cy + Math.sin(rad) * (r + 3),
      x2: cx + Math.cos(rad) * (r + 11),
      y2: cy + Math.sin(rad) * (r + 11),
    }
  })

  return (
    <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="1.3"
        strokeDasharray={`${d} ${g}`} strokeLinecap="round"
        style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${spin}deg)`, opacity: 0.82 }} />
      <circle cx={cx} cy={cy} r={r - 9} fill="none" stroke={color} strokeWidth="0.5"
        strokeDasharray={`${d * .36} ${g * 3}`} strokeLinecap="round"
        style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${-spin * 1.8}deg)`, opacity: 0.22 }} />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
      ))}
      {label && (
        <text x={cx} y={cy + 4} textAnchor="middle" fill={color}
          fontSize="8" letterSpacing="2" fontFamily="'Geist Mono',monospace">{label}</text>
      )}
    </svg>
  )
}

type State = 'default' | 'hover' | 'project' | 'text' | 'button'

export default function Cursor() {
  const rx = useRef(-300), ry = useRef(-300)
  const ringRef = useRef<HTMLDivElement>(null)
  const [state,   setState]   = useState<State>('default')
  const [label,   setLabel]   = useState('')
  const [visible, setVisible] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [clickPos,setClickPos]= useState({ x:0,y:0 })
  const [spin,    setSpin]    = useState(0)
  const spinVal = useRef(0)
  const frameRef = useRef(0)
  const lerpRef  = useRef(0)

  /* Ring follows with lerp — smooth but NOT zero lag (dot handles zero lag) */
  useEffect(() => {
    let mx = -300, my = -300
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; setVisible(true) }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', () => setVisible(false))

    const lerp = () => {
      spinVal.current += 0.42
      setSpin(spinVal.current)

      if (!ringRef.current) { lerpRef.current = requestAnimationFrame(lerp); return }
      rx.current += (mx - rx.current) * 0.12
      ry.current += (my - ry.current) * 0.12
      ringRef.current.style.transform = `translate(${rx.current}px,${ry.current}px) translate(-50%,-50%)`
      lerpRef.current = requestAnimationFrame(lerp)
    }
    lerpRef.current = requestAnimationFrame(lerp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(lerpRef.current)
    }
  }, [])

  const onClick = useCallback((e: MouseEvent) => {
    setClickPos({ x: e.clientX, y: e.clientY })
    setClicked(true)
    setTimeout(() => setClicked(false), 600)
  }, [])

  useEffect(() => {
    window.addEventListener('click', onClick)
    const attach = () => {
      document.querySelectorAll('a:not([data-cursor]),button:not([data-cursor])').forEach(el => {
        el.addEventListener('mouseenter', () => setState('hover'))
        el.addEventListener('mouseleave', () => setState('default'))
      })
      document.querySelectorAll('[data-cursor="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => setState('button'))
        el.addEventListener('mouseleave', () => setState('default'))
      })
      document.querySelectorAll('[data-cursor="project"]').forEach(el => {
        const lbl = (el as HTMLElement).dataset.cursorLabel ?? 'VIEW ↗'
        el.addEventListener('mouseenter', () => { setState('project'); setLabel(lbl) })
        el.addEventListener('mouseleave', () => { setState('default'); setLabel('') })
      })
      document.querySelectorAll('input,textarea').forEach(el => {
        el.addEventListener('mouseenter', () => setState('text'))
        el.addEventListener('mouseleave', () => setState('default'))
      })
    }
    const mo = new MutationObserver(attach)
    mo.observe(document.body, { childList: true, subtree: true })
    attach()
    return () => { window.removeEventListener('click', onClick); mo.disconnect() }
  }, [onClick])

  const ringSize  = state === 'project' ? 120 : state === 'hover' ? 62 : state === 'text' ? 20 : state === 'button' ? 0 : 48
  const ringColor = state === 'default' ? 'rgba(255,255,255,0.28)' : '#E8FF00'

  return (
    <>
      <ZeroDot />
      <Trail />

      {/* Ring — lerped */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: ringSize, height: ringSize,
          pointerEvents: 'none',
          zIndex: 99997,
          opacity: visible ? 1 : 0,
          transition: 'width .38s cubic-bezier(.23,1,.32,1), height .38s cubic-bezier(.23,1,.32,1), opacity .2s',
          willChange: 'transform',
        }}
      >
        {ringSize > 0 && <Ring size={ringSize} color={ringColor} spin={spin} label={state === 'project' ? label : undefined} />}

        {/* Project label */}
        {state === 'project' && label && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Geist Mono',monospace", fontSize: '8px',
            letterSpacing: '2px', color: '#E8FF00', textTransform: 'uppercase',
          }}>{label}</div>
        )}
      </div>

      {/* Click ripples */}
      <AnimatePresence>
        {clicked && (
          <>
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                style={{
                  position: 'fixed', top: clickPos.y, left: clickPos.x,
                  translateX: '-50%', translateY: '-50%',
                  border: `1px solid rgba(232,255,0,${0.7 - i * 0.2})`,
                  borderRadius: '50%', pointerEvents: 'none',
                  zIndex: 99996 - i,
                }}
                initial={{ width: 6, height: 6, opacity: 0.9 - i * 0.2 }}
                animate={{ width: 120 + i * 60, height: 120 + i * 60, opacity: 0 }}
                exit={{}}
                transition={{ duration: 0.6 + i * 0.15, ease: 'easeOut', delay: i * 0.07 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </>
  )
}
