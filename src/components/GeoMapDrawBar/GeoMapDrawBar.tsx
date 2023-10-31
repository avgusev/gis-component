import React, { FC, useEffect, useRef, useState } from 'react';
import { Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './GeoMapDrawBar.scss';
import { GeoIcon } from '../GeoIcon/GeoIcon';
import GeoMapDrawBarTypes from './GeoMapDrawBar.types';
import { useAppDispatch, useAppSelector } from '../../config/store';
import axios from 'axios';
import { Draw, Modify, Snap } from 'ol/interaction';
import GeoJSON, { GeoJSONGeometry } from 'ol/format/GeoJSON';
import { setDrawMode, setGeomLength, setLastFeatureId } from '../../reducers/mapDraw.reducer';
import { extend } from 'ol/extent';
import { Controller } from 'react-hook-form';
import GeoMapUploadGeom from './GeoMapUploadGeom/GeoMapUploadGeom';
import { Point } from 'ol/geom';
import { getLength } from 'ol/sphere';
import LineString from 'ol/geom/LineString';
import { Fill, Icon, RegularShape, Stroke, Text } from 'ol/style';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import { saveAs } from 'file-saver';
import { features } from 'process';

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
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
  }),
  text: new Text({
    text: 'Потяните для редактирования',
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

//Стиль сегмента
const segmentStyle = new Style({
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
    padding: [2, 2, 2, 2],
    textBaseline: 'bottom',
    offsetY: -12,
  }),
  image: new RegularShape({
    radius: 6,
    points: 3,
    angle: Math.PI,
    displacement: [0, 8],
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
  }),
});

//Стиль измерение под курсором
const labelStyle = new Style({
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

//Стиль Подсказка
const tipStyle = new Style({
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
    padding: [2, 2, 2, 2],
    textAlign: 'left',
    offsetX: 15,
  }),
});

export const GeoMapDrawBar: FC<GeoMapDrawBarTypes> = ({ map }) => {
  const [isUploadGeomOpen, setIsUploadGeomOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const selectedRoad = useAppSelector((state) => state.mapdraw.selectedRoad);
  const roadParts = useAppSelector((state) => state.mapdraw.roadParts);
  const selectedRoadPart = useAppSelector((state) => state.mapdraw.selectedRoadPart);
  const roadPartGeom = useAppSelector((state) => state.mapdraw.roadPartGeom);
  const drawMode = useAppSelector((state) => state.mapdraw.drawMode);
  const geomLength = useAppSelector((state) => state.mapdraw.geomLength);
  // const [selectedRoad, setSelectedRoad] = useState<any>(null);
  //const [roadParts, setRoadParts] = useState<any>([]);
  //const [selectedRoadPart, setSelectedRoadPart] = useState<any>({});
  //const [roadPartGeom, setRoadPartGeom] = useState<any>({});
  //const [drawMode, setDrawMode] = useState<any>();

  const drawRef = useRef<any>();
  const modifyRef = useRef<any>();
  const snapRef = useRef<any>();
  const sourceRef = useRef<any>();
  const segmentStylesRef = useRef<any>();
  const tipPointRef = useRef<any>();
  const lastFeatureId = useRef<any>();
  const fullLength = useRef<any>();
  fullLength.current = 0;

  segmentStylesRef.current = [segmentStyle];

  useEffect(() => {
    if (selectedRoadPart && selectedRoadPart !== null && roadPartGeom && roadPartGeom?.geom && roadPartGeom?.geom !== null) {
      addSelectedRoadPartFeatureNew(roadPartGeom?.geom);
      addSelectedRoadPartFeatureCurrent(roadPartGeom?.geom);
    }
  }, [roadPartGeom]);

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
      //map.removeInteraction(drawRef.current);
      addSelectedRoadPartFeatureNew(roadPartGeom?.geom);
      addSelectedRoadPartFeatureCurrent(roadPartGeom?.geom);
      // removeInteraction();
      // removeNewFeatures();
      // removeCurrentFeature();
      // setSelectedRoadPart({});
      //drawRef.current.abortDrawning();
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

  const getLenthFeature = (line) => {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100;
    } else {
      output = Math.round(length * 100) / 100 / 1000;
    }
    return output;
  };

  const getLengthLabelFeatures = () => {
    try {
      if (sourceRef.current) {
        const features = sourceRef.current.getFeatures();
        let length = 0;
        if (features && features.length > 0) {
          features.forEach((feature) => {
            const geometry = feature.getGeometry();
            const type = geometry.getType();
            length = length + getLenthFeature(geometry);
          });
        }
        console.log(length);
        fullLength.current = length;
      }
    } catch (error) {
      console.log('Ошибка при расчете длины геометрии!', error);
    }
  };

  const formatLength = (line) => {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' км';
    } else {
      output = Math.round(length * 100) / 100 / 1000 + ' м';
      // debugger;
    }
    return output;
  };

  const styleFunction = (feature, segments, tip) => {
    // debugger;
    let modify;
    const currentInteractionArr = map.getInteractions().getArray();
    //console.log(currentInteractionArr);
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
        // const segment = new LineString([a, b]);
        // const label = formatLength(segment);
        // if (segmentStylesRef.current.length - 1 < count) {
        //   segmentStylesRef.current.push(segmentStyle.clone());
        // }
        // const segmentPoint = new Point(segment.getCoordinateAt(0.5));
        // segmentStylesRef.current?.[count].setGeometry(segmentPoint);
        // segmentStylesRef.current?.[count].getText().setText(label);
        // styles.push(segmentStylesRef.current?.[count]);

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
      labelStyle.setGeometry(point);
      //const curLen = getLengthLabelFeatures(feature);
      const currentLength = parseFloat(label) + fullLength.current;

      labelStyle.getText().setText(`${currentLength.toFixed(3)} км`);
      styles.push(labelStyle);
    }
    // if (tip && type === 'Point' && !modify.getOverlay().getSource().getFeatures().length) {
    //   tipPointRef.current = geometry;
    //   tipStyle.getText().setText(tip);
    //   styles.push(tipStyle);
    // }

    return styles;
  };

  const getFullLength = () => {
    const getLengthFeature = (line) => {
      const length = getLength(line);
      let output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100;
      } else {
        output = Math.round(length * 100) / 100 / 1000;
      }
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

      drawRef.current = new Draw({
        source: source,
        type: 'LineString',
        features: features,
        style: function (feature) {
          return styleFunction(feature, true, tip);
        },
      });
      console.log(drawRef);
      map.addInteraction(drawRef.current);

      snapRef.current = new Snap({ source: source });
      map.addInteraction(snapRef.current);

      // drawRef.current.on('change:active', function (e) {
      //   drawRef.current.appendCoordinates(e.feature.getGeometry().getCoordinates());
      // });

      drawRef.current.on('drawstart', function (e) {
        modifyRef.current.setActive(false);
        tip = activeTip;
        fullLength.current = 0;
        e.feature.setId(e.feature.ol_uid);
        //getFullLength();
        dispatch(setGeomLength(0));
        getLengthLabelFeatures();
      });
      drawRef.current.on('drawend', function (e) {
        // debugger;
        dispatch(setGeomLength(0));
        fullLength.current = 0;
        dispatch(setLastFeatureId(e.feature.getId()));
        dispatch(setGeomLength(getFullLength()));
        // dispatch(setGeomLength(fullLength.current));
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

  const addSelectedRoadPartFeatureNew = (geom) => {
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
        console.log(`Отсутствует геометрия участка!`);
      }
    } catch (error) {
      console.error('Ошибка при добавлении выбранного участка: ', error);
    }
  };

  const addSelectedRoadPartFeatureCurrent = (geom) => {
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
        console.log(`Отсутствует геометрия выбранного участка!`);
      }
    } catch (error) {
      console.error('Ошибка при добавлении выбранного участка на слоя для отображения: ', error);
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
      console.error('Ошибка при удалении feature участка', error);
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
      console.error('Ошибка при очистке слоя с исходной геометрией участка', error);
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
      console.error('Ошибка при вписывании выбранного участка в окно: ', error);
    }
  };

  const downloadGeom = async (geom, roadpartid) => {
    try {
      const filename = `geom_roadpartid_${roadpartid}.json`;
      const data = new Blob([JSON.stringify(geom, undefined, 2)], { type: 'application/json' });
      saveAs(data, filename);
    } catch (error) {
      console.log(`Ошибка при скачивании геометрии! ${error}`);
    }
  };

  return (
    <div className="GeoMapDrawBar d-inline-flex justify-content-center align-items-center">
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
          <div className="GeoMapDrawBar__draw_blinking">
            <GeoIcon
              name="draw"
              iconType="draw"
              style={{ color: '#f44336' }}
              onClick={() => {
                dispatch(setGeomLength(0));
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
              name="draw"
              iconType="draw"
              onClick={() => {
                dispatch(setGeomLength(0));
                const view = map.getView();
                view.setMinZoom(11);
                view.setMaxZoom(18);
                dispatch(setDrawMode('draw'));
              }}
            />
          </div>
        </OverlayTrigger>
      )}

      {drawMode === 'draw' && (
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 100, hide: 100 }}
          overlay={(props) => (
            <Tooltip id="map-tooltip" {...props}>
              Удалить последнюю точку
            </Tooltip>
          )}
        >
          <div>
            <GeoIcon
              name="undo"
              iconType="undo"
              onClick={() => {
                dispatch(setGeomLength(0));
                removeLastPoint();
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
              dispatch(setGeomLength(0));
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
              dispatch(setGeomLength(0));
              setIsUploadGeomOpen(!isUploadGeomOpen);
            }}
          />
        </div>
      </OverlayTrigger>
      {roadPartGeom && roadPartGeom?.geom && (
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
                dispatch(setGeomLength(0));
                downloadGeom(roadPartGeom?.geom, selectedRoadPart.id);
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
              dispatch(setGeomLength(0));
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

export default GeoMapDrawBar;
