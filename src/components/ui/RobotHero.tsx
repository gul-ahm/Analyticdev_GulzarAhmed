'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

class HeartCurve extends THREE.Curve<THREE.Vector3> {
    // Curve's own constructor is protected, so the subclass needs a public one.
    constructor() {
        super();
    }

    getPoint(t: number, target = new THREE.Vector3()) {
        t = t * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        return target.set(x * 0.002, (y + 6) * 0.002, 0);
    }
}

const heartCurve = new HeartCurve();

const SHELL = '#c4c4c4';
const SCREEN_GLOW = '#e2e8f0';
const ACCENT = '#64748b';

const earBaseMat = new THREE.MeshStandardMaterial({ color: '#f0f0f0', roughness: 0.5 });
const earRingMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 });
const earCenterMat = new THREE.MeshStandardMaterial({ color: '#cccccc', roughness: 0.8 });
const antennaBaseMat = new THREE.MeshStandardMaterial({ color: '#999999', roughness: 0.4, metalness: 0.5 });
const antennaStickMat = new THREE.MeshStandardMaterial({ color: '#d0d0d0', roughness: 0.4, metalness: 0.2 });
const antennaTipMat = new THREE.MeshStandardMaterial({ color: ACCENT, roughness: 0.2, toneMapped: false });
const headMat = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 1, metalness: 0 });
const eyeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2, 2, 2), toneMapped: false, transparent: true });
const heartMat = new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false });

function ResponsiveGroup({ children }: { children: React.ReactNode }) {
    const { viewport } = useThree();
    return <group scale={Math.min(1.1, viewport.width / 3.5)}>{children}</group>;
}

// A thin fresnel shell over the head, so the face reads as lit glass.
function GlassVisor() {
    const uniforms = useMemo(
        () => ({
            color: { value: new THREE.Color(SCREEN_GLOW) },
            power: { value: 3.8 },
            intensity: { value: 1.2 }
        }),
        []
    );

    return (
        <mesh>
            <sphereGeometry args={[0.3, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={`
                    varying vec3 vNormal;
                    varying vec3 vViewPosition;
                    void main() {
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        vViewPosition = -mvPosition.xyz;
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `}
                fragmentShader={`
                    uniform vec3 color;
                    uniform float power;
                    uniform float intensity;
                    varying vec3 vNormal;
                    varying vec3 vViewPosition;
                    void main() {
                        float fresnel = 1.0 - max(dot(normalize(vViewPosition), normalize(vNormal)), 0.0);
                        gl_FragColor = vec4(color, pow(fresnel, power) * intensity);
                    }
                `}
                transparent
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
}

function RobotEar({ position, isLeft = false }: { position: [number, number, number]; isLeft?: boolean }) {
    const dir = isLeft ? -1 : 1;

    return (
        <group position={position} scale={1.3}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earBaseMat}>
                <cylinderGeometry args={[0.04, 0.04, 0.025, 32]} />
            </mesh>
            <mesh position={[dir * 0.012, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earRingMat}>
                <torusGeometry args={[0.032, 0.008, 16, 32]} />
            </mesh>
            <mesh position={[dir * 0.012, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earCenterMat}>
                <cylinderGeometry args={[0.03, 0.03, 0.005, 32]} />
            </mesh>

            <group position={[dir * 0.015, 0.035, 0]} rotation={[-0.4, 0, 0]}>
                <mesh position={[0, 0.01, 0]} castShadow receiveShadow material={antennaBaseMat}>
                    <cylinderGeometry args={[0.006, 0.008, 0.02, 16]} />
                </mesh>
                <mesh position={[0, 0.06, 0]} castShadow receiveShadow material={antennaStickMat}>
                    <cylinderGeometry args={[0.003, 0.003, 0.1, 8]} />
                </mesh>
                <mesh position={[0, 0.11, 0]} castShadow receiveShadow material={antennaTipMat}>
                    <sphereGeometry args={[0.006, 16, 16]} />
                </mesh>
            </group>
        </group>
    );
}

function buildEyeLid(sign: 1 | -1) {
    const w = 0.025;
    const h = 0.035 * sign;
    const r = 0.02 * sign;
    const g = 0.005 * sign;
    const path = new THREE.CurvePath<THREE.Vector3>();
    const v = (x: number, y: number) => new THREE.Vector3(x, y, 0);

    path.add(new THREE.LineCurve3(v(-w, g), v(-w, h - r)));
    path.add(new THREE.QuadraticBezierCurve3(v(-w, h - r), v(-w, h), v(-w + 0.02, h)));
    path.add(new THREE.LineCurve3(v(-w + 0.02, h), v(w - 0.02, h)));
    path.add(new THREE.QuadraticBezierCurve3(v(w - 0.02, h), v(w, h), v(w, h - r)));
    path.add(new THREE.LineCurve3(v(w, h - r), v(w, g)));
    return path;
}

function RobotEye({
    position,
    rotation,
    lovedRef
}: {
    position: [number, number, number];
    rotation: [number, number, number];
    lovedRef: React.RefObject<boolean>;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const normalRef = useRef<THREE.Group>(null);
    const heartRef = useRef<THREE.Mesh>(null);

    const BLINK_EVERY = 3;
    const BLINK_FOR = 0.45;
    const SCALE = 1.1;

    useFrame(({ clock }) => {
        if (!groupRef.current || !normalRef.current || !heartRef.current) return;

        const loved = lovedRef.current;
        normalRef.current.visible = !loved;
        heartRef.current.visible = loved;

        const cycle = clock.getElapsedTime() % BLINK_EVERY;
        let lidScale = 1;
        if (cycle < BLINK_FOR && !loved) {
            lidScale = Math.max(0.05, 1 - Math.sin((cycle / BLINK_FOR) * Math.PI));
        }
        groupRef.current.scale.set(SCALE, SCALE * lidScale, SCALE);
    });

    const lids = useMemo(() => [buildEyeLid(1), buildEyeLid(-1)], []);

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={SCALE}>
            <mesh ref={heartRef} visible={false} material={heartMat}>
                <tubeGeometry args={[heartCurve, 64, 0.0035, 8, true]} />
            </mesh>
            <group ref={normalRef}>
                {lids.map((lid, i) => (
                    <mesh key={i} material={eyeMat}>
                        <tubeGeometry args={[lid, 20, 0.0035, 8, false]} />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

// Speckled paint, drawn once into a canvas rather than loaded as an image.
function useShellTextures() {
    const [maps, setMaps] = useState<{ color: THREE.CanvasTexture; bump: THREE.CanvasTexture } | null>(null);

    useEffect(() => {
        const size = 512;
        const make = () => {
            const c = document.createElement('canvas');
            c.width = c.height = size;
            return { canvas: c, ctx: c.getContext('2d') };
        };
        const colour = make();
        const bump = make();
        if (!colour.ctx || !bump.ctx) return;

        colour.ctx.fillStyle = '#dcdcdc';
        colour.ctx.fillRect(0, 0, size, size);
        bump.ctx.fillStyle = '#808080';
        bump.ctx.fillRect(0, 0, size, size);

        for (let i = 0; i < 10000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = 0.5 + Math.random() * 1.5;
            const dark = Math.random() > 0.15;

            colour.ctx.beginPath();
            colour.ctx.arc(x, y, r, 0, Math.PI * 2);
            colour.ctx.fillStyle = dark ? '#222222' : '#dddddd';
            colour.ctx.fill();

            bump.ctx.beginPath();
            bump.ctx.arc(x, y, r, 0, Math.PI * 2);
            bump.ctx.fillStyle = dark ? '#000000' : '#ffffff';
            bump.ctx.fill();
        }

        const color = new THREE.CanvasTexture(colour.canvas);
        const bumpTex = new THREE.CanvasTexture(bump.canvas);
        for (const t of [color, bumpTex]) {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(6, 3);
            t.needsUpdate = true;
        }
        setMaps({ color, bump: bumpTex });

        return () => {
            color.dispose();
            bumpTex.dispose();
        };
    }, []);

    return maps;
}

function Robot() {
    const lovedRef = useRef(false);
    const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const bodyRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    const maps = useShellTextures();

    useEffect(() => () => {
        if (resetTimer.current) clearTimeout(resetTimer.current);
    }, []);

    useFrame((state, delta) => {
        if (!bodyRef.current || !headRef.current) return;

        const dt = Math.min(delta, 0.1);
        const { x: px, y: py } = state.pointer;

        bodyRef.current.position.x = THREE.MathUtils.lerp(
            bodyRef.current.position.x,
            px * (state.viewport.width / 3.5),
            0.35 * dt
        );

        const rel = px - bodyRef.current.position.x / 2.5;

        bodyRef.current.rotation.y = THREE.MathUtils.lerp(bodyRef.current.rotation.y, -rel * 0.95, 10 * dt);
        bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, -py * 0.25, 10 * dt);
        bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, -rel * 0.15, 10 * dt);

        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, rel * 1.8, 20 * dt);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -py * 0.3, 20 * dt);
    });

    const neckProfile = useMemo(() => {
        const p = (r: number, h: number) => new THREE.Vector2(r, h);
        return [p(0.1, -0.05), p(0.215, -0.05), p(0.28, 0.02), p(0.295, 0.045), p(0.27, 0.055), p(0.1, 0.055), p(0.1, 0.055)];
    }, []);

    const poke = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        lovedRef.current = true;
        if (resetTimer.current) clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => {
            lovedRef.current = false;
        }, 2000);
    };

    if (!maps) return null;

    const shell = (
        <meshStandardMaterial
            color={SHELL}
            map={maps.color}
            bumpMap={maps.bump}
            bumpScale={0.005}
            roughness={1}
            metalness={0}
            envMapIntensity={0}
        />
    );

    return (
        <group
            ref={bodyRef}
            position={[0, -0.3, 0]}
            onPointerDown={poke}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
            <mesh castShadow receiveShadow>
                <sphereGeometry args={[0.43, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.85]} />
                {shell}
            </mesh>

            <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <torusGeometry args={[0.235, 0.025, 32, 64]} />
                {shell}
            </mesh>

            <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
                <latheGeometry args={[neckProfile, 64]} />
                {shell}
            </mesh>

            <group ref={headRef} position={[0, 0.6, 0]}>
                <mesh material={headMat} castShadow receiveShadow>
                    <sphereGeometry args={[0.28, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
                </mesh>

                <GlassVisor />

                <group position={[0, -0.02, 0.29]}>
                    <RobotEye position={[-0.07, 0, 0]} rotation={[0, -0.2, 0]} lovedRef={lovedRef} />
                    <RobotEye position={[0.07, 0, 0]} rotation={[0, 0.2, 0]} lovedRef={lovedRef} />
                </group>

                <RobotEar position={[-0.29, 0, 0]} isLeft />
                <RobotEar position={[0.29, 0, 0]} />
            </group>
        </group>
    );
}

interface RobotHeroProps {
    backgroundText?: string;
    children?: React.ReactNode;
}

export default function RobotHero({ backgroundText = 'ANALYTICSDEV', children }: RobotHeroProps) {
    return (
        <section
            className="relative md:sticky md:top-0 z-0 h-[100dvh] w-full overflow-hidden"
            style={{ background: 'linear-gradient(to bottom, #e9e9e9 0%, #e9e9e9 55%, #bdbdbd 65%, #d6d6d6 100%)' }}
        >
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                <span
                    className="select-none whitespace-nowrap font-black text-black/[0.11]"
                    style={{ letterSpacing: '-0.05em', fontSize: 'clamp(4rem, 13vw, 12rem)', lineHeight: 1, transform: 'translateY(12vh)' }}
                >
                    {backgroundText}
                </span>
            </div>

            <div className="absolute inset-0 z-10">
                <Canvas shadows camera={{ position: [0, 0.2, 6], fov: 40 }}>
                    <ambientLight intensity={0.75} color="#ffffff" />
                    <directionalLight
                        position={[0, 6, 3]}
                        intensity={0.5}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                        shadow-bias={-0.0005}
                    >
                        <orthographicCamera attach="shadow-camera" args={[-1.5, 1.5, 1.5, -1.5, 0.1, 20]} />
                    </directionalLight>
                    <directionalLight position={[-5, 2, -5]} intensity={0.25} />

                    <ResponsiveGroup>
                        {/* Dropped below centre so the robot sits under the copy, not behind it */}
                        <group position={[0, -0.55, 0]}>
                            <ContactShadows position={[0, -0.79, 0]} opacity={0.85} scale={15} resolution={1024} blur={1.7} far={2.5} color="#000000" />
                            <Robot />
                        </group>
                    </ResponsiveGroup>
                </Canvas>
            </div>

            {/* Full height, so the page can push part of its copy to the bottom */}
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col pt-36 pb-14">
                <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-6 lg:px-8 [&_a]:pointer-events-auto">
                    {children}
                </div>
            </div>
        </section>
    );
}
