import React, { Suspense, useState } from 'react';
import GeoIconButton from '../GeoIconButton';
import GeoLoader from '../GeoLoader/GeoLoader';
import GeoUpButtonsBar from '../GeoUpButtonsBar';
import { GeoPanoramaTypes } from './GeoPanorama.types';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './GeoPanorama.scss';
import CameraController from './CameraController';
import { ApplicationModes } from '../../config/constants';
import GeoSideBar from '../GeoSideBar/GeoSideBar';
import GeoZoomButton from '../GeoZoomButton';
import GeoKeyboardArrows from '../GeoKeyboardArrows';

export const GeoPanorama = ({ url, onClose, updateMapSize, onDownClick, onUpClick }: GeoPanoramaTypes) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fov, setFov] = useState(80);

  const Scene = () => {
    console.log('Грузим компоненту Scene');
    try {
      console.log(`Грузим url для панорамы ${url}`);
      const { scene } = useThree();
      const texture = useLoader(THREE.TextureLoader, url);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.encoding = THREE.sRGBEncoding;
      scene.background = texture;
      useFrame((state) => {
        // @ts-ignore
        state.camera.fov = fov;
        state.camera.updateProjectionMatrix();
      }, -1);
    } catch (e) {
      console.log('Не удалось загрузить панораму', e);
    }
    return null;
  };

  const onMouseWheel = (e: { deltaY: number }): void => {
    const val = Math.sign(e.deltaY) * 0.05 + fov + e.deltaY * 0.1;
    setFov(THREE.MathUtils.clamp(val, 10, 80));
  };

  const onZoomIn = (): void => {
    const val = Math.sign(-100) * 0.05 + fov + -100 * 0.1;
    setFov(THREE.MathUtils.clamp(val, 10, 80));
  };

  const onZoomOut = (): void => {
    const val = Math.sign(100) * 0.05 + fov + 100 * 0.1;
    setFov(THREE.MathUtils.clamp(val, 10, 80));
  };

  if (isLoading) {
    return <GeoLoader />;
  }

  return (
    <div className="GeoPanoramaPage__canvas-item-1">
      <Canvas onWheel={onMouseWheel} id="fiber-canvas">
        <CameraController />
        {/* <Suspense fallback={null}> */}
        <Scene />
        {/* </Suspense> */}
      </Canvas>
      <GeoUpButtonsBar
        buttons={[
          <GeoIconButton key={'pano-help-button'} iconType="question" content={'Помощь'} />,
          <GeoIconButton
            key={'pano-close-button'}
            iconType="close"
            handleClick={() => {
              onClose(ApplicationModes.mapMode);
              updateMapSize();
            }}
          />,
        ]}
      />
      <GeoSideBar
        buttons={[<GeoZoomButton key={'pano-zoom-buttons'} handleClickPlus={() => onZoomIn()} handleClickMinus={() => onZoomOut()} />]}
      />
      <GeoKeyboardArrows
        key={'pano-movement-buttons'}
        handleClickRightArrow={() => {
          console.log('right-arrow');
        }}
        handleClickLeftArrow={() => {
          console.log('left-arrow');
        }}
        handleClickUpArrow={() => {
          onUpClick();
        }}
        handleClickDownArrow={() => {
          onDownClick();
        }}
      />
    </div>
  );
};

export default GeoPanorama;
