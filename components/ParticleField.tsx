'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ scrollY }: { scrollY: number }) {
  const ref   = useRef<THREE.Points>(null)
  const count = 2000

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r     = 3 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame(({ clock, camera }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.038
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.018) * 0.12
    }
    // camera moves back as user scrolls
    camera.position.z = 9 + scrollY * 0.003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#ffffff" transparent opacity={0.28} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function Icosahedron() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.055
      ref.current.rotation.z = clock.getElapsedTime() * 0.022
    }
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2.3, 1]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.042} />
    </mesh>
  )
}

export default function ParticleField({ scrollY = 0 }: { scrollY?: number }) {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 9], fov: 55 }}
      gl={{ antialias: false, alpha: true }}
      dpr={[1, 1.5]}
    >
      <Icosahedron />
      <Particles scrollY={scrollY} />
    </Canvas>
  )
}
