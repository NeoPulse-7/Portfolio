'use client'
// ── CERTIFICATES ──────────────────────────────────────────────────────────────
import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import MagneticButton from './MagneticButton'
import { useScramble } from '@/hooks/useScramble'
import { useMouseParallax } from '@/hooks/useMouseParallax'

const CERTS = [
  {title:'Responsive Web Design',   issuer:'freeCodeCamp',  year:'2024'},
  {title:'JavaScript Algorithms',   issuer:'freeCodeCamp',  year:'2024'},
  {title:'React Development',       issuer:'Your Platform', year:'2024'},
  {title:'UI/UX Fundamentals',      issuer:'Google',        year:'2024'},
  {title:'Next.js Mastery',         issuer:'Vercel Academy',year:'2025'},
  {title:'[ ADD CERT ]',            issuer:'———',           year:'——',  placeholder:true},
  {title:'[ ADD CERT ]',            issuer:'———',           year:'——',  placeholder:true},
]

function CertCard({ c }: { c: typeof CERTS[0] }) {
  return (
    <motion.div whileHover={{ y:-7, borderColor:'rgba(232,255,0,0.32)', scale:1.02 }}
      transition={{ type:'spring', stiffness:330, damping:28 }}
      className="flex-shrink-0 w-60 border border-white/[0.07] rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group"
      style={{ background:'#0f0f0f', height:'152px' }}>
      <svg className="absolute top-2.5 right-2.5 text-white/[0.09] group-hover:text-acc/25 transition-colors duration-400" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 2H8V4H4V8H2V2Z" fill="currentColor"/><path d="M18 18H12V16H16V12H18V18Z" fill="currentColor"/>
      </svg>
      <motion.div className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100"
        style={{ background:'linear-gradient(135deg,transparent 35%,rgba(232,255,100,0.07) 50%,transparent 65%)', backgroundSize:'300% 300%' }}
        initial={{ backgroundPosition:'-100% -100%' }} whileHover={{ backgroundPosition:'200% 200%' }} transition={{ duration:0.65 }}/>
      {!c.placeholder && (
        <div className="w-7 h-7 flex items-center justify-center border border-white/[0.1] rounded-md">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ color:'#E8FF00' }}>
            <path d="M12 2L3 7v7c0 5.25 3.75 10.15 9 11.25C17.25 24.15 21 19.25 21 14V7L12 2z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
      )}
      <div className="mt-auto">
        {c.placeholder ? (
          <><div className="h-2.5 w-28 rounded bg-white/[0.05] animate-pulse mb-2"/><div className="h-2 w-16 rounded bg-white/[0.03] animate-pulse"/></>
        ) : (
          <><p className="font-sans font-medium text-[0.8rem] text-t1 leading-snug mb-1 line-clamp-2">{c.title}</p>
          <p className="font-mono text-[0.65rem] text-t3">{c.issuer}</p></>
        )}
      </div>
      <div className="font-mono text-[0.62rem] text-t3 mt-2">{c.year}</div>
    </motion.div>
  )
}

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const t = [...CERTS, ...CERTS, ...CERTS]
  return (
    <div className="overflow-hidden">
      <motion.div className="flex gap-4 py-2" style={{ width:'max-content' }}
        animate={{ x: reverse ? ['0%','-33.33%'] : ['-33.33%','0%'] }}
        transition={{ repeat:Infinity, duration:42, ease:'linear' }}
        whileHover={{ animationPlayState:'paused' } as any}>
        {t.map((c,i) => <CertCard key={i} c={c}/>)}
      </motion.div>
    </div>
  )
}

export function Certificates() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })
  const heading= useScramble('CERTIFICATES', inView)

  const { scrollYProgress } = useScroll({ target:ref, offset:['start end','end start'] })
  const yChap = useTransform(scrollYProgress,[0,1],[80,-80])

  return (
    <section ref={ref} id="certificates" className="py-28 md:py-44 overflow-hidden section-border dot-grid">
      <motion.div style={{y:yChap}} className="absolute right-0 top-0 select-none pointer-events-none">
        <span style={{fontSize:'20vw',color:'rgba(255,255,255,0.016)',fontFamily:'var(--font-sans)',fontWeight:800}}>03</span>
      </motion.div>
      <div className="px-10 md:px-20 mb-14 max-w-7xl mx-auto">
        <div className="flex items-end justify-between">
          <motion.div initial={{opacity:0,y:28}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8,ease:[0.16,1,0.3,1]}}>
            <p className="font-mono text-[0.65rem] text-acc tracking-[0.24em] uppercase mb-3">CREDENTIALS</p>
            <div className="overflow-hidden">
              <motion.div initial={{y:'105%'}} animate={inView?{y:'0%'}:{}} transition={{duration:0.92,ease:[0.76,0,0.24,1]}}>
                <h2 className="font-sans font-extrabold leading-none tracking-[-0.035em] text-t1"
                  style={{fontSize:'clamp(48px,7.5vw,96px)'}}>{heading}</h2>
              </motion.div>
            </div>
          </motion.div>
          <p className="font-mono text-[0.65rem] text-t3 hidden md:block">( {CERTS.filter(c=>!c.placeholder).length} )</p>
        </div>
      </div>
      <motion.div className="flex flex-col gap-4" initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:0.3,duration:0.8}}>
        <MarqueeRow reverse={false}/>
        <MarqueeRow reverse={true}/>
      </motion.div>
    </section>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
const OUTPUT=['> Initializing connection...','> Encrypting payload...','> Routing to ayush@portfolio...','> ...............................','> [SUCCESS] ✓ Message delivered. He\'ll respond soon.']
const SOCIALS=[{cmd:'open github.com/ayush',href:'https://github.com'},{cmd:'connect linkedin.com/in/ayush',href:'https://linkedin.com'},{cmd:'sendmail hello@ayush.dev',href:'mailto:hello@ayush.dev'}]

export function Contact() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })
  const mouse  = useMouseParallax(18)
  const h1     = useScramble("LET'S BUILD", inView)
  const h2     = useScramble('something.', inView)

  const { scrollYProgress } = useScroll({ target:ref, offset:['start end','end start'] })
  const yChap = useTransform(scrollYProgress,[0,1],[60,-60])
  const yHead = useTransform(scrollYProgress,[0,1],[40,-40])

  const [form,  setForm]    = useState({name:'',email:'',message:''})
  const [phase, setPhase]   = useState<'idle'|'loading'|'done'>('idle')
  const [shown, setShown]   = useState(0)
  const [focused,setFocused]= useState<string|null>(null)

  const submit = () => {
    if (!form.name||!form.email||!form.message) return
    setPhase('loading')
    OUTPUT.forEach((_,i) => setTimeout(()=>{
      setShown(i+1)
      if (i===OUTPUT.length-1) setTimeout(()=>setPhase('done'),1000)
    }, i*400))
  }
  const reset = () => { setPhase('idle'); setForm({name:'',email:'',message:''}); setShown(0) }

  return (
    <section ref={ref} id="contact" className="relative py-36 md:py-52 px-10 md:px-20 overflow-hidden section-border">
      <motion.div style={{y:yChap}} className="absolute left-0 top-1/2 -translate-y-1/2 select-none pointer-events-none">
        <span style={{fontSize:'24vw',color:'rgba(255,255,255,0.015)',fontFamily:'var(--font-sans)',fontWeight:800}}>05</span>
      </motion.div>
      <motion.div style={{y:yChap,x:useTransform(mouse.x,v=>v*1.4),position:'absolute',top:'15%',right:'8%',width:5,height:5,borderRadius:'50%',background:'#E8FF00',boxShadow:'0 0 22px rgba(232,255,0,0.7)'}}/>

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div className="mb-16 text-center" initial={{opacity:0,y:38}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.9,ease:[0.16,1,0.3,1]}}>
          <p className="font-mono text-[0.65rem] text-acc tracking-[0.24em] uppercase mb-5">ESTABLISH_CONNECTION</p>
          <motion.div style={{y:yHead}}>
            <div className="overflow-hidden mb-1">
              <motion.div initial={{y:'105%'}} animate={inView?{y:'0%'}:{}} transition={{duration:0.92,ease:[0.76,0,0.24,1]}}>
                <h2 className="font-sans font-extrabold leading-[0.93] tracking-[-0.035em] text-t1" style={{fontSize:'clamp(48px,8.5vw,102px)'}}>{h1}</h2>
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div initial={{y:'105%'}} animate={inView?{y:'0%'}:{}} transition={{duration:0.92,ease:[0.76,0,0.24,1],delay:0.1}}>
                <h2 style={{fontSize:'clamp(48px,8.5vw,102px)',fontFamily:'var(--font-serif)',fontStyle:'italic',fontWeight:400,color:'#606060',lineHeight:0.93,letterSpacing:'-0.02em'}}>{h2}</h2>
              </motion.div>
            </div>
          </motion.div>
          <motion.p className="font-sans text-t3 text-[0.95rem] mt-5 font-light" initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:0.45}}>
            Have a project in mind? Let&apos;s make it unforgettable.
          </motion.p>
        </motion.div>

        {/* Big email link */}
        <motion.div className="mb-14 text-center" initial={{opacity:0,y:22}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:0.3,duration:0.8}}>
          <MagneticButton data-cursor="hover">
            <a href="mailto:hello@ayush.dev"
              className="group relative inline-block font-sans font-extrabold tracking-[-0.02em] text-t1 hover:text-acc transition-colors duration-300 pb-1"
              style={{fontSize:'clamp(28px,5vw,66px)'}}>
              HELLO@AYUSH.DEV
              <span className="absolute bottom-0 left-0 right-full h-px bg-acc group-hover:right-0 transition-all duration-450"/>
            </a>
          </MagneticButton>
        </motion.div>

        {/* Terminal */}
        <motion.div className="border border-white/[0.07] rounded-xl overflow-hidden" style={{background:'#0a0a0a'}}
          initial={{opacity:0,y:30,scale:0.97}} animate={inView?{opacity:1,y:0,scale:1}:{}}
          transition={{duration:0.88,delay:0.25,ease:[0.16,1,0.3,1]}}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07] bg-[#111]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]"/><span className="w-3 h-3 rounded-full bg-[#ffbd2e]"/><span className="w-3 h-3 rounded-full bg-[#27c93f]"/>
            <span className="flex-1 text-center font-mono text-[0.65rem] text-t3">ayush@portfolio:~/contact</span>
          </div>
          <div className="p-7 md:p-9">
            <AnimatePresence mode="wait">
              {phase==='idle' && (
                <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,y:-8}} className="space-y-7">
                  {[{key:'name',label:'# your name',type:'text',ph:'Ayush'},{key:'email',label:'# your signal frequency',type:'email',ph:'you@email.com'}].map(f=>(
                    <div key={f.key}>
                      <p className="font-mono text-[0.65rem] text-t3 mb-2">{f.label}</p>
                      <motion.div className="flex items-center gap-2 border-b py-2"
                        animate={{borderColor:focused===f.key?'#E8FF00':'rgba(255,255,255,0.07)'}} transition={{duration:0.2}}>
                        <span className="font-mono text-[0.72rem] text-acc flex-shrink-0">&gt;</span>
                        <input type={f.type} value={(form as any)[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                          onFocus={()=>setFocused(f.key)} onBlur={()=>setFocused(null)} placeholder={f.ph}
                          className="flex-1 bg-transparent font-mono text-[0.82rem] text-t1 outline-none placeholder-t3"/>
                      </motion.div>
                    </div>
                  ))}
                  <div>
                    <p className="font-mono text-[0.65rem] text-t3 mb-2"># your transmission</p>
                    <motion.div className="flex items-start gap-2 border-b py-2"
                      animate={{borderColor:focused==='message'?'#E8FF00':'rgba(255,255,255,0.07)'}} transition={{duration:0.2}}>
                      <span className="font-mono text-[0.72rem] text-acc flex-shrink-0 mt-0.5">&gt;</span>
                      <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                        onFocus={()=>setFocused('message')} onBlur={()=>setFocused(null)}
                        placeholder="Hey Ayush, let's build something insane..." rows={3}
                        className="flex-1 bg-transparent font-mono text-[0.82rem] text-t1 outline-none placeholder-t3 resize-none"/>
                    </motion.div>
                  </div>
                  <MagneticButton className="w-full" data-cursor="button">
                    <motion.button onClick={submit} whileHover={{borderColor:'rgba(232,255,0,0.6)'}}
                      className="w-full flex items-center justify-between px-5 py-4 border border-acc/25 font-mono text-[0.78rem] text-t2 hover:text-acc transition-colors duration-300">
                      <span>$ ./send_message.sh</span><span className="tracking-widest">[ EXECUTE ]</span>
                    </motion.button>
                  </MagneticButton>
                </motion.div>
              )}
              {phase==='loading' && (
                <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} className="min-h-[220px] space-y-2">
                  {OUTPUT.slice(0,shown).map((line,i)=>(
                    <motion.p key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                      className={`font-mono text-[0.78rem] ${i===OUTPUT.length-1?'text-green-400':'text-t3'}`}>{line}</motion.p>
                  ))}
                  {shown<OUTPUT.length&&<motion.span animate={{opacity:[1,0]}} transition={{repeat:Infinity,duration:0.8}} className="font-mono text-[0.78rem] text-t3">_</motion.span>}
                </motion.div>
              )}
              {phase==='done' && (
                <motion.div key="done" initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}}
                  className="flex flex-col items-center justify-center py-14 gap-4">
                  <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:280,damping:20,delay:0.1}}
                    className="w-12 h-12 rounded-full border border-green-400/30 flex items-center justify-center">
                    <span className="text-green-400 text-lg">✓</span>
                  </motion.div>
                  <p className="font-mono text-[0.78rem] text-green-400">[SUCCESS] Message delivered.</p>
                  <p className="font-sans text-[0.85rem] text-t3">I&apos;ll respond within 24 hours.</p>
                  <button onClick={reset} className="mt-4 font-mono text-[0.65rem] text-t3 border-b border-t3 hover:text-t1 hover:border-t1 transition-colors">$ ./new_message.sh</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div className="mt-10 space-y-3" initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:0.5,duration:0.7}}>
          {SOCIALS.map(s=>(
            <motion.a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="hover"
              className="flex items-center justify-between group py-3.5 border-b border-white/[0.05] hover:border-white/[0.1] transition-colors"
              whileHover={{x:7}} transition={{type:'spring',stiffness:330,damping:28}}>
              <span className="font-mono text-[0.78rem] text-t3 group-hover:text-t2 transition-colors">&gt; {s.cmd}</span>
              <motion.span className="text-t3 group-hover:text-acc transition-colors" whileHover={{x:4}}>→</motion.span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="px-10 md:px-20 py-7 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-mono text-[0.65rem] text-t3 tracking-widest">AYUSH © 2025</p>
        <motion.p className="font-mono text-[0.65rem] text-t3 tracking-widest"
          whileHover={{letterSpacing:'0.3em',color:'#EFEFEF'}} transition={{duration:0.38}}>
          CRAFTED WITH OBSESSION
        </motion.p>
        <p className="font-mono text-[0.65rem] text-t3 tracking-widest">v1.0.0 <span className="text-green-400">[STABLE]</span></p>
      </div>
    </footer>
  )
}
