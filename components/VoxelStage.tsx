
import React, { Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { VoxelData, SimulationState } from '../types';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      instancedMesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      color: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      group: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      instancedMesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      color: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      group: any;
    }
  }
}

interface VoxelStageProps {
  voxels: VoxelData[];
  state: SimulationState;
}

interface InstancedVoxelsProps {
  voxels: VoxelData[];
  state: SimulationState;
}

const InstancedVoxels: React.FC<InstancedVoxelsProps> = ({ voxels, state }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const buildStartTime = useRef(0);
  const count = voxels.length;

  const physics = useMemo(() => ({
    positions: new Float32Array(count * 3),
    velocities: new Float32Array(count * 3),
    rotations: new Float32Array(count * 3),
    rotVelocities: new Float32Array(count * 3),
    colors: new Float32Array(count * 3),
    targetPositions: new Float32Array(count * 3),
  }), [count]);

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    if (!meshRef.current || voxels.length === 0) return;

    // Critical: Reset build timer whenever voxels change to ensure fresh animation
    buildStartTime.current = 0;

    voxels.forEach((v, i) => {
      physics.targetPositions[i * 3] = v.x;
      physics.targetPositions[i * 3 + 1] = v.y;
      physics.targetPositions[i * 3 + 2] = v.z;

      tempColor.set(v.color);
      meshRef.current!.setColorAt(i, tempColor);

      // Breaking physics parameters
      physics.velocities[i * 3] = (Math.random() - 0.5) * 1.5;
      physics.velocities[i * 3 + 1] = Math.random() * 2.0;
      physics.velocities[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      physics.rotVelocities[i * 3] = (Math.random() - 0.5) * 0.5;
      physics.rotVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      physics.rotVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      physics.positions[i * 3] = v.x;
      physics.positions[i * 3 + 1] = v.y;
      physics.positions[i * 3 + 2] = v.z;
      
      physics.rotations[i * 3] = 0;
      physics.rotations[i * 3 + 1] = 0;
      physics.rotations[i * 3 + 2] = 0;
    });
    
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [voxels, physics, tempColor]);

  useFrame((stateContext) => {
    if (!meshRef.current) return;

    const time = stateContext.clock.elapsedTime;
    
    if (state === SimulationState.BUILDING) {
      if (buildStartTime.current === 0) buildStartTime.current = time;
      const elapsed = (time - buildStartTime.current) * 1500;

      for (let i = 0; i < count; i++) {
        const isVisible = i < elapsed;
        tempObject.position.set(
          physics.targetPositions[i * 3],
          physics.targetPositions[i * 3 + 1],
          physics.targetPositions[i * 3 + 2]
        );
        tempObject.scale.setScalar(isVisible ? 1 : 0);
        tempObject.rotation.set(0, 0, 0);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
    } else if (state === SimulationState.BREAKING) {
      buildStartTime.current = 0;
      const gravity = -0.025;

      for (let i = 0; i < count; i++) {
        physics.positions[i * 3] += physics.velocities[i * 3];
        physics.positions[i * 3 + 1] += physics.velocities[i * 3 + 1];
        physics.positions[i * 3 + 2] += physics.velocities[i * 3 + 2];
        
        physics.velocities[i * 3 + 1] += gravity;

        physics.rotations[i * 3] += physics.rotVelocities[i * 3];
        physics.rotations[i * 3 + 1] += physics.rotVelocities[i * 3 + 1];
        physics.rotations[i * 3 + 2] += physics.rotVelocities[i * 3 + 2];

        if (physics.positions[i * 3 + 1] < -5) {
          physics.positions[i * 3 + 1] = -5;
          physics.velocities[i * 3] *= 0.8;
          physics.velocities[i * 3 + 1] = 0;
          physics.velocities[i * 3 + 2] *= 0.8;
          physics.rotVelocities[i * 3] *= 0.8;
          physics.rotVelocities[i * 3 + 1] *= 0.8;
          physics.rotVelocities[i * 3 + 2] *= 0.8;
        }

        tempObject.position.set(
          physics.positions[i * 3],
          physics.positions[i * 3 + 1],
          physics.positions[i * 3 + 2]
        );
        tempObject.rotation.set(
          physics.rotations[i * 3],
          physics.rotations[i * 3 + 1],
          physics.rotations[i * 3 + 2]
        );
        tempObject.scale.setScalar(1);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
    } else if (state === SimulationState.READY) {
       buildStartTime.current = 0;
       for (let i = 0; i < count; i++) {
        tempObject.position.set(
          physics.targetPositions[i * 3],
          physics.targetPositions[i * 3 + 1],
          physics.targetPositions[i * 3 + 2]
        );
        tempObject.scale.setScalar(1);
        tempObject.rotation.set(0, 0, 0);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
    } else {
      buildStartTime.current = 0;
      for (let i = 0; i < count; i++) {
        tempObject.scale.setScalar(0);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
};

const VoxelStage: React.FC<VoxelStageProps> = ({ voxels, state }) => {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [45, 45, 45], fov: 45 }}>
        <color attach="background" args={['#f1f5f9']} />
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[50, 70, 30]} 
          castShadow 
          intensity={1.5} 
          shadow-mapSize={[2048, 2048]} 
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />
        <pointLight position={[-30, 40, -30]} intensity={0.5} color="#indigo" />
        
        <Suspense fallback={null}>
          <group position={[0, -5, 0]}>
            <InstancedVoxels voxels={voxels} state={state} />
          </group>
          
          <ContactShadows 
            position={[0, -5.05, 0]} 
            opacity={0.4} 
            scale={120} 
            blur={2.5} 
            far={20} 
            resolution={1024} 
            color="#000000" 
          />
          
          <Environment preset="apartment" />
        </Suspense>

        <OrbitControls 
          makeDefault 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 1.7} 
          enableDamping 
          dampingFactor={0.07}
        />
      </Canvas>
    </div>
  );
};

export default VoxelStage;
