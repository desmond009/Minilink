import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import * as THREE from 'three'

function CardGeometry() {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 1.5, 0.1]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.1}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

export default function AnimatedCard({ children, className = "" }) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      whileHover={{ 
        scale: 1.02,
        rotateY: 5,
        rotateX: 5
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[2, 2, 2]} intensity={0.6} />
          <CardGeometry />
        </Canvas>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
