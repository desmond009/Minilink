import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function FloatingParticles({ count = 2000 }) {
  const mesh = useRef()
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    
    return positions
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.05
      mesh.current.rotation.y = state.clock.elapsedTime * 0.075
    }
  })

  return (
    <group ref={mesh}>
      <Points positions={particlesPosition} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#667eea"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}

function FloatingOrbs() {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      groupRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 0.5
      })
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[
          Math.cos(i * Math.PI / 3) * 8,
          Math.sin(i * Math.PI / 3) * 2,
          Math.sin(i * Math.PI / 3) * 8
        ]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#667eea" : "#764ba2"}
            transparent
            opacity={0.6}
            emissive={i % 2 === 0 ? "#667eea" : "#764ba2"}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

function GradientPlane() {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} rotation={[0, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial
        color="#667eea"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <FloatingParticles count={1500} />
        <FloatingOrbs />
        <GradientPlane />
      </Canvas>
    </div>
  )
}
