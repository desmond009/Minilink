import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Stardust({ count = 800 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4
      arr[i * 3 + 2] = -Math.random() * 10
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = Math.sin(t * 0.1) * 0.1
  })

  return (
    <group ref={ref} position={[0, 0, 0]}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#7aa2ff"
          size={0.04}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}

function GlowPlane() {
  const ref = useRef()
  useFrame((s) => {
    if (!ref.current) return
    ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.15) * 0.05
  })
  return (
    <mesh ref={ref} position={[0, 0, -6]}>
      <planeGeometry args={[40, 6]} />
      <meshBasicMaterial
        color={new THREE.Color('#6a5acd')}
        transparent
        opacity={0.12}
      />
    </mesh>
  )
}

export default function HeaderFX() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 65 }} dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <Stardust count={900} />
        <GlowPlane />
      </Canvas>
    </div>
  )
}
