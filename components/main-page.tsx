'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useSpring, animated, SpringValue } from '@react-spring/three'

function Globe() {
  const pointsRef = useRef<THREE.Points>(null!)
  const sphereRef = useRef<THREE.Mesh>(null!)

  // Animation for position
  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0] as [number, number, number],
    config: { mass: 1, tension: 280, friction: 60 }
  }))

  // Update position randomly
  useEffect(() => {
    const updatePosition = () => {
      api.start({
        position: [
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          0
        ]
      })
    }
    const interval = setInterval(updatePosition, 3000)
    return () => clearInterval(interval)
  }, [api])

  const count = 4000
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const color = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const x = Math.sin(phi) * Math.cos(theta)
      const y = Math.sin(phi) * Math.sin(theta)
      const z = Math.cos(phi)
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      color.setHSL(Math.random(), 0.7, 0.5)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    return { positions, colors }
  }, [])

  useFrame((state, delta) => {
    if (pointsRef.current && sphereRef.current) {
      pointsRef.current.rotation.y += delta * 0.1
      sphereRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <animated.group position={spring.position as unknown as SpringValue<[number, number, number]>}>
      <Sphere ref={sphereRef} args={[10, 65, 72]} >
        <meshBasicMaterial color="#675275" wireframe />
      </Sphere>
      <Points ref={pointsRef}>
        <PointMaterial
          vertexColors
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
        />
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.positions.length / 3}
            array={positions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={positions.colors.length / 3}
            array={positions.colors}
            itemSize={3}
          />
        </bufferGeometry>
      </Points>
    </animated.group>
  )
}

export function MainPage() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-violet-950">
      <nav className="absolute top-0 left-0 w-full z-10 bg-black bg-opacity-30 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">Web3Events.xyz</div>
          <div className="space-x-4">
            <Link href="https://app.web3events.xyz/singapore" className="inline-block transition-transform hover:scale-120 hover:font-bold">
              <span>Singapore</span>
            </Link>
            <Link href="https://app.web3events.xyz/thailand" className="inline-block transition-transform hover:scale-120 hover:font-bold">
              <span>Thailand</span>
            </Link>
          </div>
        </div>
      </nav>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <Globe />
      </Canvas>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white">
        <h1 className="text-xl md:text-6xl font-bold mb-8">Discover Web3 Events</h1>
        <p className="text-sm md:text-lg mb-8 opacity-70">Built for the degens, by the degens</p>
        <div className="flex space-x-4">
          <Button variant="default" onClick={() => window.open('https://app.web3events.xyz', '_blank')}>Launch App</Button>
          <Button variant="ghost" onClick={() => window.open('https://mint.web3events.xyz', '_blank')}>All Access NFT 🔥🔥</Button>
        </div>
      </div>
      <footer className="absolute bottom-0 left-0 w-full bg-black bg-opacity-30 text-white p-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div>2024 © All rights reserved</div>
          <div className="flex space-x-4">
            <a href="https://basescan.org/address/0xc1F7D779c5EbE4715409D6158Af7f59B3F3ba991" className="hover:underline" target="_blank" rel="noopener noreferrer">Donate</a>
            <a href="#" className="hover:underline">Promote event</a>
          </div>
        </div>
      </footer>
    </div>
  )
}