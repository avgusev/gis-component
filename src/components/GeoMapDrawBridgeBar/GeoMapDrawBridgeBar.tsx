import React, { FC, useEffect, useRef, useState } from 'react';
import { Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './GeoMapDrawBridgeBar.scss';
import { GeoIcon } from '../GeoIcon/GeoIcon';
import GeoMapDrawBridgeBarTypes from './GeoMapDrawBridgeBar.types';
import { useAppDispatch, useAppSelector } from '../../config/store';
import axios from 'axios';
import { gisSchemaHeader, hwmSchemaHeader, pgApiUrl, publicSchemaHeader } from '../../config/constants';
import { Draw, Modify, Snap } from 'ol/interaction';
import GeoJSON, { GeoJSONGeometry } from 'ol/format/GeoJSON';
import { setDrawMode, setGeomLength, setLastFeatureId } from '../../reducers/mapDraw.reducer';
import { extend } from 'ol/extent';
import { Controller } from 'react-hook-form';
import GeoMapUploadGeom from './GeoMapUploadGeom/GeoMapUploadGeom';
import { Point } from 'ol/geom';
import { getLength } from 'ol/sphere';
import LineString from 'ol/geom/LineString';
import { Circle, Fill, Icon, RegularShape, Stroke, Text } from 'ol/style';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import { saveAs } from 'file-saver';

const style = new Style({
  fill: new Fill({
    color: 'rgba(22,198,224, 1)',
  }),
  stroke: new Stroke({
    color: '#f44336',
    // lineDash: [10, 10],
    width: 4,
  }),
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
  }),
});

//Стиль для редактиования
const modifyStyle = new Style({
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(245,186, 5, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(245,186, 5, 0.4)',
    }),
  }),
  text: new Text({
    text: 'Захватите для перемещения',
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    padding: [2, 2, 2, 2],
    textAlign: 'left',
    offsetX: 15,
  }),
});

//Стиль измерение под курсором
const labelLineStyle = new Style({
  text: new Text({
    font: '14px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    padding: [3, 3, 3, 3],
    textBaseline: 'bottom',
    offsetY: -15,
  }),
  image: new RegularShape({
    radius: 8,
    points: 3,
    angle: Math.PI,
    displacement: [0, 10],
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
  }),
});

const GeoMapDrawBridgeBar: FC<GeoMapDrawBridgeBarTypes> = ({ map }) => {
  const [isUploadGeomOpen, setIsUploadGeomOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const selectedBridge = useAppSelector((state) => state.mapdraw.selectedBridge);
  const bridgeGeom = useAppSelector((state) => state.mapdraw.bridgeGeom);
  const drawMode = useAppSelector((state) => state.mapdraw.drawMode);
  const bridgeGeomType = useAppSelector((state) => state.mapstate.bridgeGeomType);

  const drawRef = useRef<any>();
  const modifyRef = useRef<any>();
  const snapRef = useRef<any>();
  const sourceRef = useRef<any>();
  const tipPointRef = useRef<any>();
  const bridgeGeomTypeRef = useRef<any>();
  bridgeGeomTypeRef.current = bridgeGeomType;

  useEffect(() => {
    if (selectedBridge && selectedBridge !== null && bridgeGeom && bridgeGeom?.geom && bridgeGeom?.geom !== null) {
      addselectedBridgeFeatureNew(bridgeGeom?.geom);
      addselectedBridgeFeatureCurrent(bridgeGeom?.geom);
    }
  }, [bridgeGeom]);

  //Удаление нарисованной геометрии
  const removeNewFeatures = () => {
    try {
      const features = sourceRef.current.getFeatures();
      if (features && features.length > 0) {
        features.forEach((item, index) => {
          const featureId = item.getId();
          if (featureId !== 'current') sourceRef.current.removeFeature(item);
        });
      }
    } catch (error) {
      console.error('Ошибка при удалении feature нарисованной геометрии', error);
    }
  };

  const removeInteraction = () => {
    try {
      map.removeInteraction(drawRef.current);
      map.removeInteraction(snapRef.current);
      map.removeInteraction(modifyRef.current);
    } catch (error) {
      console.error(`Ошибка при удалении interaction! ${error}`);
    }
  };

  const removeLastPoint = () => {
    try {
      drawRef.current.removeLastPoint();
    } catch (error) {
      console.error(`Ошибка при удалении последней точки! ${error}`);
    }
  };

  const finishDrawing = () => {
    try {
      drawRef.current.finishDrawing();
    } catch (error) {
      console.error('Ошибка при остановке режима draw! ', error);
    }
  };

  //Функция отмены всех изменений геометрии
  const cancelDraw = () => {
    try {
      const features = sourceRef.current.getFeatures();
      const geom = features?.[0].getGeometry();
      console.log(features, geom);
      finishDrawing();
      removeCurrentFeature();
      removeNewFeature();
      dispatch(setDrawMode(''));
      removeInteraction();
      addselectedBridgeFeatureNew(bridgeGeom?.geom);
      addselectedBridgeFeatureCurrent(bridgeGeom?.geom);
    } catch (error) {
      console.log('Ошибка при удалении рисования');
    }
  };

  // const currentInteractionArr = map.getInteractions().getArray();
  // console.log(currentInteractionArr);
  // currentInteractionArr.forEach((item) => {
  //   if (item instanceof Select) {
  //     item.setActive(false);
  //     //map.removeInteraction(item);
  //   }
  // });
  // debugger;

  const formatLength = (line) => {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = (Math.round((length / 1000) * 100) / 100).toFixed(3) + ' км';
    } else {
      output = (Math.round(length * 100) / 100 / 1000).toFixed(3) + ' м';
    }
    return output;
  };

  const styleFunction = (feature, segments, tip) => {
    const style = new Style({
      image: new Circle({
        fill: new Fill({
          color: 'rgba(245,186, 5, 1)',
        }),
        radius: 8,
      }),
    });

    return style;
  };

  const getFullLength = () => {
    const getLengthFeature = (line) => {
      const length = getLength(line);
      let output;
      output = (Math.round((length / 1000) * 100) / 100).toFixed(3);
      return output;
    };
    const features = sourceRef.current.getFeatures();
    let len = 0;
    features.forEach((feature) => {
      const geometry = feature.getGeometry();
      len = len + getLengthFeature(geometry);
    });
    console.log(len);
    return len;
  };

  const styleLineFunction = (feature, segments, tip) => {
    let modify;
    const currentInteractionArr = map.getInteractions().getArray();
    console.log(currentInteractionArr);
    currentInteractionArr.forEach((item) => {
      if (item instanceof Modify) {
        modify = item;
      }
    });

    const styles = [style];
    const geometry = feature.getGeometry();
    const type = geometry.getType();
    let point, label, line;
    if (type === 'LineString') {
      point = new Point(geometry.getLastCoordinate());
      label = formatLength(geometry);
      line = geometry;
    }
    if (segments && line) {
      let count = 0;
      line.forEachSegment(function (a, b) {
        //Добавление точек
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const rotation = Math.atan2(dy, dx);
        styles.push(
          new Style({
            geometry: new Point(b),
            image: new CircleStyle({
              radius: 3,
              stroke: new Stroke({
                color: 'rgba(245,186, 5, 1)',
              }),
              fill: new Fill({
                color: 'rgba(245,186, 5, 1)',
              }),
              rotateWithView: true,
              rotation: -rotation,
            }),
          })
        );

        count++;
      });
    }
    if (label) {
      labelLineStyle.setGeometry(point);
      labelLineStyle.getText().setText(`${label}`);
      styles.push(labelLineStyle);
    }
    return styles;
  };

  const AddDraw = () => {
    try {
      let source;
      let features;
      map
        .getLayers()
        .getArray()
        .forEach((layer: any) => {
          if (layer.get('name') === 'editgeom_new') {
            source = layer.getSource();
            sourceRef.current = layer.getSource();
            features = source.getFeaturesCollection();
            //features = source.getFeatures();
          }
        });

      const activeTip = 'Кликните для продолжения рисования линии';
      const idleTip = 'Клик для начала рисования';
      let tip = idleTip;
      modifyRef.current = new Modify({ source: source, style: modifyStyle });
      map.addInteraction(modifyRef.current);

      const drawConfig: any = {
        source: source,
        //type: 'Point',
        type: bridgeGeomType,
        features: features,
        // style: function (feature) {
        //   return styleFunction(feature, true, tip);
        // },
      };
      if (bridgeGeomType === 'LineString') {
        drawConfig.maxPoints = 2;
        drawConfig.style = function (feature) {
          return styleLineFunction(feature, true, tip);
        };
      } else {
        drawConfig.style = function (feature) {
          return styleFunction(feature, true, tip);
        };
      }

      drawRef.current = new Draw(drawConfig);

      // drawRef.current = new Draw({
      //   source: source,
      //   type: 'Point',
      //   features: features,
      //   style: function (feature) {
      //     return styleFunction(feature, true, tip);
      //   },
      // });
      console.log(drawRef);
      map.addInteraction(drawRef.current);

      snapRef.current = new Snap({ source: source });
      map.addInteraction(snapRef.current);

      // drawRef.current.on('change:active', function (e) {
      //   drawRef.current.appendCoordinates(e.feature.getGeometry().getCoordinates());
      // });

      drawRef.current.on('drawstart', function (e) {
        sourceRef.current.clear();
        modifyRef.current.setActive(false);
        tip = activeTip;
        if (bridgeGeomTypeRef.current === 'LineString') {
          e.feature.setId(e.feature.ol_uid);
          //getFullLength();
          dispatch(setGeomLength(0));
        }
      });
      drawRef.current.on('drawend', function (e) {
        // debugger;
        if (bridgeGeomTypeRef.current === 'LineString') {
          dispatch(setGeomLength(0));
          dispatch(setLastFeatureId(e.feature.getId()));
          dispatch(setGeomLength(getFullLength()));
        }
        // drawRef.current.appendCoordinates(e.feature.getGeometry().getCoordinates());
        modifyStyle.setGeometry(tipPointRef.current);
        modifyRef.current.setActive(true);
        // map.once("pointermove", function () {
        //   modifyStyle.setGeometry();
        // });
        tip = idleTip;
      });
      modifyRef.current.setActive(true);
    } catch (error) {
      console.log('Ошибка при рисовании!', error);
    }
  };

  useEffect(() => {
    if (drawMode === 'draw') {
      AddDraw();
    }
  }, [drawMode]);

  const addselectedBridgeFeatureNew = (geom) => {
    try {
      if (geom && geom.coordinates && geom.coordinates.length > 0) {
        removeNewFeature();
        const currentFeatures: any = new GeoJSON().readFeatures(geom);
        console.log(currentFeatures);
        map
          .getLayers()
          .getArray()
          .forEach((layer: any) => {
            if (layer.get('name') === 'editgeom_new') {
              const source = layer.getSource();
              const extent = currentFeatures?.[0].getGeometry().getExtent();
              currentFeatures?.[0]?.setId('current');
              source.addFeature(currentFeatures?.[0]);
              map.getView().fit(extent, { padding: [50, 50, 50, 50], size: map.getSize(), maxZoom: 14, duration: 500 });
            }
          });
      } else {
        console.log(`Отсутствует геометрия моста!`);
      }
    } catch (error) {
      console.error('Ошибка при добавлении выбранного моста: ', error);
    }
  };

  const addselectedBridgeFeatureCurrent = (geom) => {
    try {
      if (geom && geom.coordinates && geom.coordinates.length > 0) {
        removeCurrentFeature();
        const currentFeatures: any = new GeoJSON().readFeatures(geom);
        console.log(currentFeatures);
        //debugger;
        map
          .getLayers()
          .getArray()
          .forEach((layer: any) => {
            if (layer.get('name') === 'editgeom_current') {
              const source = layer.getSource();
              const extent = currentFeatures?.[0].getGeometry().getExtent();
              currentFeatures?.[0]?.setId('current');
              source.addFeature(currentFeatures?.[0]);
              map.getView().fit(extent, { padding: [50, 50, 50, 50], size: map.getSize(), maxZoom: 14, duration: 500 });
            }
          });
      } else {
        console.log(`Отсутствует геометрия выбранного моста!`);
      }
    } catch (error) {
      console.error('Ошибка при добавлении выбранного моста на слое для отображения: ', error);
    }
  };

  //Удаление всех features на слое для добавления/исправления геометрии (красный цвет)
  const removeNewFeature = () => {
    try {
      map
        .getLayers()
        .getArray()
        .forEach((layer: any) => {
          if (layer.get('name') === 'editgeom_new') {
            const source = layer.getSource();
            const features = source.getFeatures();
            if (features && features.length > 0) {
              features.forEach((item) => {
                source.removeFeature(item);
              });
            }
          }
        });
    } catch (error) {
      console.error('Ошибка при удалении feature моста', error);
    }
  };

  //Удаление всех features на вспомогательном слое для отображения текущей геометрии (черным цветом)
  const removeCurrentFeature = () => {
    try {
      map
        .getLayers()
        .getArray()
        .forEach((layer: any) => {
          if (layer.get('name') === 'editgeom_current') {
            const source = layer.getSource();
            const features = source.getFeatures();
            if (features && features.length > 0) {
              features.forEach((item) => {
                source.removeFeature(item);
              });
            }
          }
        });
    } catch (error) {
      console.error('Ошибка при очистке слоя с исходной геометрией моста', error);
    }
  };

  const removeAllGeomFeatures = () => {
    try {
      removeCurrentFeature();
      removeNewFeature();
      removeInteraction();
    } catch (error) {
      console.error(`Ошибка при очистке временных системных слоев для редактирования геометрии! ${error}`);
    }
  };

  const fitRoadPartFeatureNew = () => {
    try {
      map
        .getLayers()
        .getArray()
        .forEach((layer: any) => {
          if (layer.get('name') === 'editgeom_new') {
            const source = layer.getSource();
            const features = source.getFeatures();
            if (features && features.length > 0) {
              let ext;
              const featExtent = features?.[0].getGeometry().getExtent();
              features.forEach((item) => {
                ext = extend(featExtent, item.getGeometry().getExtent());
              });
              map.getView().fit(
                ext, //extent
                {
                  padding: [50, 50, 50, 50],
                  size: map.getSize(),
                  maxZoom: 14,
                  duration: 500,
                }
              );
            }
          }
        });
    } catch (error) {
      console.error('Ошибка при вписывании выбранного моста в окно: ', error);
    }
  };

  const downloadGeom = async (geom, bridgeid) => {
    try {
      const filename = `geom_bridgeid_${bridgeid}.json`;
      const data = new Blob([JSON.stringify(geom, undefined, 2)], { type: 'application/json' });
      saveAs(data, filename);
    } catch (error) {
      console.log(`Ошибка при скачивании геометрии! ${error}`);
    }
  };

  return (
    <div className="GeoMapDrawBridgeBar d-inline-flex justify-content-center align-items-center">
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 100, hide: 100 }}
        overlay={(props) => (
          <Tooltip id="map-tooltip" {...props}>
            Показать участок
          </Tooltip>
        )}
      >
        <div>
          <GeoIcon
            name="map"
            iconType="map"
            onClick={() => {
              fitRoadPartFeatureNew();
            }}
          />
        </div>
      </OverlayTrigger>

      {drawMode === 'draw' ? (
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 100, hide: 100 }}
          overlay={(props) => (
            <Tooltip id="map-tooltip" {...props}>
              Завершить редактирование геометрии
            </Tooltip>
          )}
        >
          <div className="GeoMapDrawBridgeBar__draw_blinking">
            <GeoIcon
              name="add_place"
              iconType={bridgeGeomType === 'Point' ? 'add_place' : 'draw'}
              style={{ color: '#f44336' }}
              onClick={() => {
                const view = map.getView();
                view.setMinZoom(0);
                view.setMaxZoom(18);
                dispatch(setDrawMode(''));
                map.removeInteraction(drawRef.current);
                finishDrawing();
              }}
            />
          </div>
        </OverlayTrigger>
      ) : (
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 100, hide: 100 }}
          overlay={(props) => (
            <Tooltip id="map-tooltip" {...props}>
              Начать редактирование геометрии
            </Tooltip>
          )}
        >
          <div>
            <GeoIcon
              name="add_place"
              iconType={bridgeGeomType === 'Point' ? 'add_place' : 'draw'}
              onClick={() => {
                const view = map.getView();
                view.setMinZoom(11);
                view.setMaxZoom(18);
                dispatch(setDrawMode('draw'));
              }}
            />
          </div>
        </OverlayTrigger>
      )}

      <OverlayTrigger
        placement="bottom"
        delay={{ show: 100, hide: 100 }}
        overlay={(props) => (
          <Tooltip id="map-tooltip" {...props}>
            Отменить все изменения
          </Tooltip>
        )}
      >
        <div>
          <GeoIcon
            name="cancel"
            iconType="cancel"
            onClick={() => {
              cancelDraw();
              const view = map.getView();
              view.setMinZoom(0);
              view.setMaxZoom(18);
            }}
          />
        </div>
      </OverlayTrigger>

      <OverlayTrigger
        placement="bottom"
        delay={{ show: 100, hide: 100 }}
        overlay={(props) => (
          <Tooltip id="map-tooltip" {...props}>
            Загрузить геометрию
          </Tooltip>
        )}
      >
        <div>
          <GeoIcon
            name="upload"
            iconType="upload"
            onClick={() => {
              setIsUploadGeomOpen(!isUploadGeomOpen);
            }}
          />
        </div>
      </OverlayTrigger>
      {bridgeGeom && bridgeGeom?.geom && (
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 100, hide: 100 }}
          overlay={(props) => (
            <Tooltip id="map-tooltip" {...props}>
              Выгрузить геометрию
            </Tooltip>
          )}
        >
          <div>
            <GeoIcon
              name="download"
              iconType="download_2"
              width={22}
              onClick={() => {
                downloadGeom(bridgeGeom?.geom, selectedBridge.id);
              }}
            />
          </div>
        </OverlayTrigger>
      )}
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 100, hide: 100 }}
        overlay={(props) => (
          <Tooltip id="map-tooltip" {...props}>
            Удалить всю геометрию
          </Tooltip>
        )}
      >
        <div>
          <GeoIcon
            name="trash"
            iconType="trash"
            onClick={() => {
              removeCurrentFeature();
              removeNewFeature();
            }}
          />
        </div>
      </OverlayTrigger>
      {isUploadGeomOpen && <GeoMapUploadGeom map={map} isUploadGeomOpen={isUploadGeomOpen} setIsUploadGeomOpen={setIsUploadGeomOpen} />}
    </div>
  );
};

export default GeoMapDrawBridgeBar;
