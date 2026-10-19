import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function LinkRing({ position, color, speed = 1 }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.x = t * 0.35;
    ref.current.rotation.y = t * 0.55;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.35} floatIntensity={0.65}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[0.52, 0.11, 20, 56]} />
        <meshStandardMaterial
          color={color}
          metalness={0.88}
          roughness={0.12}
          envMapIntensity={0.9}
        />
      </mesh>
    </Float>
  );
}

function LinkChainScene() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 6]} intensity={1.15} />
        <pointLight position={[-4, -1, 3]} color="#FF5E3A" intensity={0.65} />
        <pointLight position={[3, 2, -2]} color="#61DAFB" intensity={0.45} />
        <LinkRing position={[-1.05, 0.25, 0]} color="#1B48DA" speed={0.9} />
        <LinkRing position={[0.15, -0.05, 0.35]} color="#2E5BFF" speed={1.1} />
        <LinkRing position={[1.05, 0.2, -0.15]} color="#61DAFB" speed={0.85} />
      </Canvas>
    </div>
  );
}

export default LinkChainScene;
