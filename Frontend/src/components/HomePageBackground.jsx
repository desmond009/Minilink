import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function FloatingParticles({ count = 3000 }) {
  const mesh = useRef()
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    
    return positions
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.02
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <group ref={mesh}>
      <Points positions={particlesPosition} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#667eea"
          size={0.03}
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
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
      groupRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 2
        child.position.x = Math.cos(state.clock.elapsedTime * 0.3 + index) * 1
      })
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[
          Math.cos(i * Math.PI / 4) * 15,
          Math.sin(i * Math.PI / 4) * 3,
          Math.sin(i * Math.PI / 4) * 15
        ]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#667eea" : i % 3 === 1 ? "#764ba2" : "#f093fb"}
            transparent
            opacity={0.4}
            emissive={i % 3 === 0 ? "#667eea" : i % 3 === 1 ? "#764ba2" : "#f093fb"}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

function GradientPlanes() {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, -10]} rotation={[0, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial
          color="#667eea"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, -15]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial
          color="#764ba2"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default function HomePageBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <FloatingParticles count={2000} />
        <FloatingOrbs />
        <GradientPlanes />
      </Canvas>
    </div>
  )
}
