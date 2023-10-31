import React, { useState, useEffect, useRef, FC } from 'react';
import MapLayersControl from './MapLayersControl';
import './MapComponent.scss';
import GeoIconButton from '../components/GeoIconButton';
import GeoUpButtonsBar from '../components/GeoUpButtonsBar';
import GeoLayersSwitcher from '../components/GeoLayersSwitcher';
import { MapLayersButtonTypes } from './MapLayersButton.types';
import '../components/GeoUpButtonsBar/GeoUpButtonsBar.scss';
import GeoCreateMessage from '../components/GeoCreateMessage/GeoCreateMessage';
import { useAppDispatch, useAppSelector } from '../config/store';
import { setEditObjectMode, setMapMode } from '../reducers/map.reducer';
import { Select } from 'ol/interaction';
import GeoMapDrawBar from '../components/GeoMapDrawBar';
import { Fill, Stroke, Style } from 'ol/style';
import GeoMapDrawBridgeBar from '../components/GeoMapDrawBridgeBar';
import { wfsLayers } from './layers.mock';
import CircleStyle from 'ol/style/Circle';

const MapLayersButton: FC<MapLayersButtonTypes> = ({
  features,
  map,
  currentBaseMap,
  setCurrentBaseMap,
  mapLayers,
  setMapLayers,
  collapseLayersControl,
  setCollapseLayerControl,
  setIsCreateMessage,
  isCreateMessage,
  isEditGeom,
  setIsEditGeom,
}) => {
  const userAuth: any = useAppSelector((state) => state.user.userAuthData);
  const mapMode = useAppSelector((state) => state.mapstate.mapMode);
  //const [objAccessLevel, setObjAccessLevel] = useState<Number>(null);

  const selectedRoad = useAppSelector((state) => state.mapdraw.selectedRoad);
  const selectedBridge = useAppSelector((state) => state.mapdraw.selectedBridge);
  const selectedRoadPart = useAppSelector((state) => state.mapdraw.selectedRoadPart);
  const roadPartGeom = useAppSelector((state) => state.mapdraw.roadPartGeom);
  const drawMode = useAppSelector((state) => state.mapdraw.drawMode);
  const editObjectMode = useAppSelector((state) => state.mapstate.editObjectMode);
  const dispatch = useAppDispatch();

  return (
    <div>
      {collapseLayersControl && (
        <div className="backDropLayersControl" onClick={() => setCollapseLayerControl(!collapseLayersControl)}>
          &nbsp;
        </div>
      )}
      <GeoUpButtonsBar
        buttons={[
          //roadPartGeom && roadPartGeom?.geom && roadPartGeom?.geom !== null
          selectedRoad &&
          Object.keys(selectedRoad).length > 0 &&
          selectedRoadPart &&
          Object.keys(selectedRoadPart).length > 0 &&
          mapMode === 'editgeom' &&
          editObjectMode === 'road' ? (
            <GeoMapDrawBar map={map} />
          ) : null,
          selectedBridge && Object.keys(selectedBridge).length > 0 && mapMode === 'editgeom' && editObjectMode === 'bridge' ? (
            <GeoMapDrawBridgeBar map={map} />
          ) : null,
          // <GeoIconButton iconType="list" content={'Показать списком'} />,
          userAuth &&
          userAuth !== 'anonymous' &&
          Object.keys(userAuth).length > 0 &&
          userAuth?.profile?.userId !== '' &&
          mapMode !== 'editgeom' ? (
            <GeoIconButton
              iconType="route_3"
              tooltipName="Ред. геометрии дороги"
              tooltipPlacement="bottom"
              //isDisabled={editObjectMode !== 'road' && mapMode !== 'navigation'}
              handleClick={() => {
                // if (isEditGeom) {
                //   dispatch(setMapMode('navigation'));
                // } else {
                //   // const currentInteractionArr = map.getInteractions().getArray();
                //   // console.log(currentInteractionArr);
                //   // currentInteractionArr.forEach((item) => {
                //   //   if (item instanceof Select) {
                //   //     item.setActive(false);
                //   //     //map.removeInteraction(item);
                //   //   }
                //   // });
                //   // debugger;
                //   //map.removeInteraction(select);

                //   dispatch(setMapMode('editgeom'));
                // }
                //setIsEditGeom(!isEditGeom);
                map
                  .getLayers()
                  .getArray()
                  .forEach((layer) => {
                    const lname = layer.get('name');
                    if (lname === 'lyr_bridge_point_edit') {
                      layer
                        .getLayers()
                        .getArray()
                        .forEach((l) => {
                          const style = new Style({
                            image: new CircleStyle({
                              radius: 5,
                              stroke: new Stroke({
                                color: 'rgba(184,184,184, 0.01)',
                              }),
                              fill: new Fill({
                                color: 'rgba(184,184,184, 0.01)',
                              }),
                            }),
                          });
                          //layer.setStyle(style);
                          l.setStyle(style);
                        });
                    }
                  });
                const wmsGroup: any = map
                  .getLayers()
                  .getArray()
                  .filter((item, index, array) => item.get('name') === 'layers-wms')?.[0];
                wmsGroup
                  .getLayers()
                  .getArray()
                  .forEach((layer) => {
                    const lname = layer.get('name');
                    layer.setVisible(false);
                  });

                const wfsGroup: any = map
                  .getLayers()
                  .getArray()
                  .filter((item, index, array) => item.get('name') === 'layers-wfs')?.[0];
                wfsGroup
                  .getLayers()
                  .getArray()
                  .forEach((layer) => {
                    const style = new Style({
                      stroke: new Stroke({
                        color: 'rgba(114,114,114, 1)',
                        width: 3,
                      }),
                    });
                    layer.setStyle(style);
                  });

                dispatch(setMapMode('editgeom'));
                dispatch(setEditObjectMode('road'));
                setIsEditGeom(true);
              }}
            />
          ) : null,
          userAuth &&
          userAuth !== 'anonymous' &&
          Object.keys(userAuth).length > 0 &&
          userAuth?.profile?.userId !== '' &&
          mapMode !== 'editgeom' ? (
            <GeoIconButton
              iconType="bridge"
              tooltipName="Ред. геометрии моста"
              tooltipPlacement="bottom"
              //isDisabled={editObjectMode !== 'bridge' && mapMode !== 'navigation'}
              handleClick={() => {
                //Изменение стиля слоев wfs
                const wfsGroup: any = map
                  .getLayers()
                  .getArray()
                  .filter((item, index, array) => item.get('name') === 'layers-wfs')?.[0];
                wfsGroup
                  .getLayers()
                  .getArray()
                  .forEach((layer) => {
                    wfsLayers.forEach((item) => {
                      if (layer.get('name') === item.name) {
                        const style = new Style({
                          stroke: new Stroke({
                            color: item?.style?.color,
                            width: item?.style?.width,
                          }),
                        });
                        layer.setStyle(style);
                      }
                    });
                  });

                map
                  .getLayers()
                  .getArray()
                  .forEach((layer) => {
                    const lname = layer.get('name');
                    if (lname === 'lyr_bridge_point_edit') {
                      layer
                        .getLayers()
                        .getArray()
                        .forEach((l) => {
                          const style = new Style({
                            image: new CircleStyle({
                              radius: 5,
                              stroke: new Stroke({
                                color: 'rgba(114,114,114, 1)',
                              }),
                              fill: new Fill({
                                color: 'rgba(114,114,114, 1)',
                              }),
                            }),
                          });
                          //layer.setStyle(style);
                          l.setStyle(style);
                        });
                    }
                  });

                const wmsGroup: any = map
                  .getLayers()
                  .getArray()
                  .filter((item, index, array) => item.get('name') === 'layers-wms')?.[0];
                wmsGroup
                  .getLayers()
                  .getArray()
                  .forEach((layer) => {
                    const lname = layer.get('name');
                    layer.setVisible(false);
                  });
                dispatch(setMapMode('editgeom'));
                dispatch(setEditObjectMode('bridge'));
                setIsEditGeom(true);
              }}
            />
          ) : null,
          userAuth &&
          userAuth !== 'anonymous' &&
          Object.keys(userAuth).length > 0 &&
          userAuth?.profile?.userId !== '' &&
          mapMode !== 'editgeom' ? (
            <GeoCreateMessage isOpen={isCreateMessage} setIsOpen={setIsCreateMessage} map={map} />
          ) : null,
          // <GeoCreateMessage isOpen={isCreateMessage} setIsOpen={setIsCreateMessage} />,
          <GeoLayersSwitcher
            isOpen={collapseLayersControl}
            handleClick={() => setCollapseLayerControl(!collapseLayersControl)}
            map={map}
            currentBaseMap={currentBaseMap}
            setCurrentBaseMap={setCurrentBaseMap}
            mapLayers={mapLayers}
            setMapLayers={setMapLayers}
          />,
          // <GeoIconButton iconType="question" content={'Помощь'} />,
        ]}
      />
    </div>
  );
};

export default MapLayersButton;
