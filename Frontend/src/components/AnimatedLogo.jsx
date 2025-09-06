import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedM() {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <Center>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 0.2]} />
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Center>
  )
}

export default function AnimatedLogo({ size = 48 }) {
  return (
    <div className="w-12 h-12">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={1} />
        <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={0.5} />
        <AnimatedM />
      </Canvas>
    </div>
  )
}
