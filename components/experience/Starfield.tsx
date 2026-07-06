"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { generateStars } from "@/lib/motion-utils";
import { COLORS } from "@/lib/tokens";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;   // 0 at top of page → 1 after one viewport of scroll
  uniform vec2 uPointer;     // normalised -1..1
  attribute float aSize;
  attribute float aViolet;
  varying float vViolet;
  varying float vTwinkle;

  void main() {
    vViolet = aViolet;
    vec3 p = position;

    // Curtain parting: push stars outward on X as progress grows
    float side = sign(p.x + 0.0001);
    p.x += side * uProgress * 2.2 * (0.4 + abs(p.z));

    // Mouse parallax by depth
    p.xy += uPointer * 0.06 * (0.5 + p.z * 0.5);

    vTwinkle = 0.55 + 0.45 * sin(uTime * 0.9 + p.x * 40.0 + p.y * 30.0);

    vec4 mv = modelViewMatrix * vec4(p * 14.0, 1.0);
    gl_PointSize = aSize * (36.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uViolet;
  varying float vViolet;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, d) * vTwinkle;
    vec3 color = mix(uInk, uViolet, vViolet * 0.9);
    gl_FragColor = vec4(color, alpha * 0.85);
  }
`;

export function Starfield({ count }: { count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const { positions, sizes, violetMask } = useMemo(
    () => generateStars(count),
    [count],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uInk: { value: new THREE.Color(COLORS.ink) },
      uViolet: { value: new THREE.Color(COLORS.violet) },
    }),
    [],
  );

  useFrame((state) => {
    const m = material.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uPointer.value.lerp(state.pointer, 0.05);
    const progress = Math.min(window.scrollY / size.height, 1);
    m.uniforms.uProgress.value +=
      (progress - m.uniforms.uProgress.value) * 0.08;
  });

  return (
    <points>
      <bufferGeometry key={count}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aViolet" args={[violetMask, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
