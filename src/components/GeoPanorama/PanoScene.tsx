/* eslint-disable react/no-unknown-property */
import React from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

interface IPanoScene {
  url: string;
}

const PanoScene = (props: IPanoScene) => {
  const { url } = props;
  const texture = useLoader(THREE.TextureLoader, url);
  return (
    <mesh>
      <sphereBufferGeometry attach="geometry" args={[600, 60, 40]} />
      <meshBasicMaterial attach="material" map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

export default PanoScene;
