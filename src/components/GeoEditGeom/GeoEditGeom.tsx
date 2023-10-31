import React, { FC, useState, useEffect, useRef, useLayoutEffect } from 'react';
import './GeoEditGeom.scss';
import { Card, Button, Container, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import GeoIconButton from '../GeoIconButton';
import { GeoEditGeomTypes } from './GeoEditGeom.types';
import { useAppDispatch, useAppSelector } from '../../config/store';
import GeoSearchEditRoads from './GeoSearchEditRoads/GeoSearchEditRoads';
import { setMapMode } from '../../reducers/map.reducer';
import axios from 'axios';
import {
  commandapiSchemaHeader,
  commandSchemaHeader,
  gisapiSchemaHeader,
  gisSchemaHeader,
  hwmSchemaHeader,
  pgApiUrl,
  publicSchemaHeader,
  querySchemaHeader,
} from '../../config/constants';
import GeoIcon from '../GeoIcon';
import GeoJSON, { GeoJSONGeometry } from 'ol/format/GeoJSON';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import {
  resetDrawState,
  setGeomLength,
  setRoadPartGeom,
  setRoadParts,
  setSelectedRoad,
  setSelectedRoadPart,
} from '../../reducers/mapDraw.reducer';
import { toast } from 'react-toastify';
import { GeometryCollection } from 'ol/geom';
import GeoLoader from '../GeoLoader/GeoLoader';
import { saveAs } from 'file-saver';
import { Stroke, Style } from 'ol/style';
import { wfsHoverLayers, wfsLayers } from '../../Map/layers.mock';
import { getObjectAccessLevel } from '../../Map/mapFunctions';
import TileLayer from 'ol/layer/Tile';
//import { wfsLayers } from './layers.mock';

const GeoEditGeom: FC<GeoEditGeomTypes> = ({
  map,
  isEditGeom,
  setIsEditGeom,
  mapLayers,
  setMapLayers,
  selectedRoadId,
  selectedRoadPartId,
  routerRest,
}) => {
  const [isSavingGeometry, setIsSavingGeometry] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userAuth: any = useAppSelector((state) => state.user.userAuthData);
  const [isLoadingRoadParts, setIsLoadingRoadParts] = useState<boolean>(false);

  const selectedRoad = useAppSelector((state) => state.mapdraw.selectedRoad);
  const roadParts = useAppSelector((state) => state.mapdraw.roadParts);
  const selectedRoadPart = useAppSelector((state) => state.mapdraw.selectedRoadPart);
  const roadPartGeom = useAppSelector((state) => state.mapdraw.roadPartGeom);
  const drawMode = useAppSelector((state) => state.mapdraw.drawMode);

  // const [selectedRoad, setSelectedRoad] = useState<any>(null);
  // const [roadParts, setRoadParts] = useState<any>([]);
  // const [selectedRoadPart, setSelectedRoadPart] = useState<any>({});
  // const [roadPartGeom, setRoadPartGeom] = useState<any>({});
  // const [drawMode, setDrawMode] = useState<any>();

  useEffect(() => {
    if ((routerRest?.match?.params?.objecttype === 'roadpart' && selectedRoadPart?.id) || selectedRoadPartId || selectedRoadPart?.id) {
      const element = document.getElementById(`${selectedRoadPart?.id}`);
      if (element) {
        element.scrollIntoView();
      }
    }
  });

  const drawRef = useRef<any>();
  const modifyRef = useRef<any>();
  const snapRef = useRef<any>();
  const sourceRef = useRef<any>();

  const getRoadParts = async (roadid) => {
    try {
      setIsLoadingRoadParts(true);
      const response = await axios.post(`${pgApiUrl}/rpc/get_road_parts`, { p_road_id: roadid?.out_entity_id }, querySchemaHeader);
      if (response?.data && response?.data?.length > 0) {
        dispatch(setRoadParts(response?.data));
        setIsLoadingRoadParts(false);
      }
    } catch (error) {
      setIsLoadingRoadParts(false);
      console.log(`Ошибка при получении перечня участков дорог! ${error}`);
    }
  };

  const getRoadPartGeom = async (roadPart) => {
    try {
      const response = await axios.get(`${pgApiUrl}/gis_road_part?road_part_id=eq.${roadPart?.id}`, gisSchemaHeader);
      if (response?.data && response?.data?.length > 0 && response?.data?.[0]?.geom && response?.data?.[0]?.geom?.coordinates?.length > 0) {
        dispatch(setRoadPartGeom(response?.data?.[0]));
      } else {
        dispatch(setRoadPartGeom({}));
        getRegionCoordinates(roadPart?.id);
        toast.warn('Отсутствует геометрия для участка!');
      }
    } catch (error) {
      console.error(`Ошибка при получении геометрии выбранного участка! ${error}`);
    }
  };

  const getRegionCoordinates = async (partid) => {
    try {
      // Так было до правки const responseRegion = await axios.get(`${pgApiUrl}/hwt_road_part_data?road_part_id=eq.${partid}`, hwmSchemaHeader);
      const obj = {
        p_road_part_id: partid,
      };
      const responseRegion = await axios.post(`${pgApiUrl}/rpc/get_road_part_data`, obj, querySchemaHeader);
      if (
        responseRegion?.data &&
        responseRegion?.data.length > 0 &&
        responseRegion?.data?.[0]?.region_gid &&
        responseRegion?.data?.[0]?.region_gid.length > 0
      ) {
        const body = {
          dimmember_gid: responseRegion?.data?.[0]?.region_gid?.[0],
        };
        const responseCoordinates = await axios.post(`${pgApiUrl}/rpc/f_get_adm_centroid`, body, publicSchemaHeader);
        if (responseCoordinates?.data && Object.keys(responseCoordinates?.data).length > 0) {
          map.getView().setCenter([responseCoordinates?.data?.lon, responseCoordinates?.data?.lat]);
        }
      }
    } catch (error) {
      console.error('Ошибка при получении координат центра региона выбранного участка', error);
    }
  };

  // const getCreateSelectedRoadObject = async (roadid) => {
  //   try {
  //     const response = await axios.get(`${pgApiUrl}/geo_road_condition?road_id=eq.${roadid}`, gisSchemaHeader);
  //     if (response?.data && response?.data.length > 0) {
  //       setSelectedRoad(response?.data?.[0]);
  //     }
  //   } catch (error) {
  //     console.error(`Ошибка при получении ! ${error}`);
  //   }
  // };

  useEffect(() => {
    if (selectedRoad && selectedRoad !== null) {
      removeNewFeature();
      removeCurrentFeature();
      removeInteraction();
      if (Object.keys(selectedRoad).length > 0) {
        getRoadParts(selectedRoad);
        if (routerRest?.match?.params?.objecttype && routerRest?.match?.params?.objecttype !== 'roadpart' && selectedRoadPartId === null) {
          fitSelectedRoad(selectedRoad);
        }
      } else {
        //getCreateSelectedRoadObject(selectedRoad);
        console.error(`Недостаточно данных для редактирования геометрии!`);
      }
    }
  }, [selectedRoad, selectedRoadPartId]);

  useEffect(() => {
    if (selectedRoadPart && selectedRoadPart !== null && Object.keys(selectedRoadPart).length > 0) {
      getRoadPartGeom(selectedRoadPart);
      removeNewFeature();
      removeCurrentFeature();
      removeInteraction();
    }
  }, [selectedRoadPart]);

  const getRoadName = async (roadid) => {
    try {
      const obj = {
        p_road_id: roadid,
      };
      const response = await axios.post(`${pgApiUrl}/rpc/get_road_name`, obj, gisapiSchemaHeader);
      if (response?.data) {
        const roadObj = {
          out_entity_id: roadid,
          out_full_name: response?.data,
        };
        dispatch(setSelectedRoad(roadObj));
      }
    } catch (error) {
      console.error('Ошибка при получении имени дороги', error);
    }
  };

  useEffect(() => {
    if (selectedRoadId && selectedRoadId !== null) {
      getRoadName(selectedRoadId);
    }
  }, [selectedRoadId]);

  // useEffect(() => {
  //   if (selectedRoadPart && selectedRoadPart !== null && roadPartGeom && roadPartGeom?.geom && roadPartGeom?.geom !== null) {
  //     addSelectedRoadPartFeatureNew(roadPartGeom?.geom);
  //     addSelectedRoadPartFeatureCurrent(roadPartGeom?.geom);
  //   }
  // }, [roadPartGeom]);

  //Удаление нарисованной геометрии
  // const removeNewFeatures = () => {
  //   try {
  //     const features = sourceRef.current.getFeatures();
  //     if (features && features.length > 0) {
  //       features.forEach((item, index) => {
  //         const featureId = item.getId();
  //         if (featureId !== 'current') sourceRef.current.removeFeature(item);
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Ошибка при удалении feature нарисованной геометрии', error);
  //   }
  // };

  const removeInteraction = () => {
    try {
      map.removeInteraction(drawRef.current);
      map.removeInteraction(snapRef.current);
      map.removeInteraction(modifyRef.current);
    } catch (error) {
      console.log(`Ошибка при удалении interaction! ${error}`);
    }
  };

  // const finishDrawing = () => {
  //   try {
  //     drawRef.current.finishDrawing();
  //   } catch (error) {
  //     console.log('Ошибка при остановке режима draw! ', error);
  //   }
  // };

  // const cancelDraw = () => {
  //   try {
  //     // const features = sourceRef.current.getFeatures();
  //     finishDrawing();
  //     // removeInteraction();
  //     // removeNewFeatures();
  //     // removeCurrentFeature();
  //     // setSelectedRoadPart({});
  //     //drawRef.current.abortDrawning();
  //   } catch (error) {
  //     console.log('Ошибка при удалении рисования');
  //   }
  // };

  // const currentInteractionArr = map.getInteractions().getArray();
  // console.log(currentInteractionArr);
  // currentInteractionArr.forEach((item) => {
  //   if (item instanceof Select) {
  //     item.setActive(false);
  //     //map.removeInteraction(item);
  //   }
  // });
  // debugger;

  // const AddDraw = () => {
  //   try {
  //     let source;
  //     let features;
  //     map
  //       .getLayers()
  //       .getArray()
  //       .forEach((layer: any) => {
  //         if (layer.get('name') === 'editgeom_new') {
  //           source = layer.getSource();
  //           sourceRef.current = layer.getSource();
  //           features = source.getFeaturesCollection();
  //         }
  //       });
  //     drawRef.current = new Draw({
  //       source: source,
  //       type: 'LineString',
  //       features: features,
  //     });
  //     console.log(drawRef);
  //     map.addInteraction(drawRef.current);
  //     snapRef.current = new Snap({ source: source });
  //     map.addInteraction(snapRef.current);
  //     modifyRef.current = new Modify({ source: source });
  //     map.addInteraction(modifyRef.current);
  //   } catch (error) {
  //     console.log('Ошибка при риосвании!', error);
  //   }
  // };

  // useEffect(() => {
  //   if (drawMode === 'draw') {
  //     AddDraw();
  //   }
  // }, [drawMode]);

  // const addSelectedRoadPartFeatureNew = (geom) => {
  //   try {
  //     if (geom && geom.coordinates && geom.coordinates.length > 0) {
  //       removeNewFeature();
  //       const currentFeatures: any = new GeoJSON().readFeatures(geom);
  //       console.log(currentFeatures);
  //       // debugger;
  //       map
  //         .getLayers()
  //         .getArray()
  //         .forEach((layer: any) => {
  //           if (layer.get('name') === 'editgeom_new') {
  //             const source = layer.getSource();
  //             const extent = currentFeatures?.[0].getGeometry().getExtent();
  //             currentFeatures?.[0]?.setId('current');
  //             source.addFeature(currentFeatures?.[0]);
  //             map.getView().fit(extent, { padding: [50, 50, 50, 50], size: map.getSize(), maxZoom: 14, duration: 500 });
  //           }
  //         });
  //     } else {
  //       console.log(`Отсутствует геометрия участка!`);
  //     }
  //   } catch (error) {
  //     console.error('Ошибка при добавлении выбранного участка: ', error);
  //   }
  // };

  // const addSelectedRoadPartFeatureCurrent = (geom) => {
  //   try {
  //     if (geom && geom.coordinates && geom.coordinates.length > 0) {
  //       removeCurrentFeature();
  //       const currentFeatures: any = new GeoJSON().readFeatures(geom);
  //       console.log(currentFeatures);
  //       // debugger;
  //       map
  //         .getLayers()
  //         .getArray()
  //         .forEach((layer: any) => {
  //           if (layer.get('name') === 'editgeom_current') {
  //             const source = layer.getSource();
  //             const extent = currentFeatures?.[0].getGeometry().getExtent();
  //             currentFeatures?.[0]?.setId('current');
  //             source.addFeature(currentFeatures?.[0]);
  //             map.getView().fit(extent, { padding: [50, 50, 50, 50], size: map.getSize(), maxZoom: 14, duration: 500 });
  //           }
  //         });
  //     } else {
  //       console.log(`Отсутствует геометрия выбранного участка!`);
  //     }
  //   } catch (error) {
  //     console.error('Ошибка при добавлении выбранного участка на слоя для отображения: ', error);
  //   }
  // };

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

  //Вписывание выбранной дороги
  const fitSelectedRoad = async (roadid) => {
    try {
      const bbox = await axios.post(`${pgApiUrl}/rpc/f_get_bbox_by_road_id`, { p_road_id: roadid?.out_entity_id }, publicSchemaHeader);
      if (bbox && bbox?.data && bbox?.data.length > 0 && !bbox?.data.includes(null)) {
        map.getView().fit(bbox?.data, {
          padding: [50, 50, 50, 50],
          size: map.getSize(),
          maxZoom: 18,
          duration: 500,
        });
      }
    } catch (error) {
      console.error(`Ошибка при вписывании выбранной дороги! ${error}`);
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

  const refreshLayers = () => {
    try {
      //Обновление векторных слоев
      const wfsGroup: any = map
        .getLayers()
        .getArray()
        .filter((item, index, array) => item.get('name') === 'layers-wfs')?.[0];
      wfsGroup
        .getLayers()
        .getArray()
        .forEach((layer) => {
          const source = layer.getSource();
          source.refresh();
        });
      //Обновление тайловых wms слоев
      const wmsGroup: any = map
        .getLayers()
        .getArray()
        .filter((item, index, array) => item.get('name') === 'layers-wms')?.[0];
      wmsGroup
        .getLayers()
        .getArray()
        .forEach((layer) => {
          const lname = layer.get('name');
          const l = layer;
          if ((lname === 'lyr_road_by_value' || lname === 'lyr_road_conditions_skeleton') && layer instanceof TileLayer) {
            // const source = layer.getSource();
            setTimeout(() => {
              l.getSource().refresh();
            }, 2000);
            //source.refresh();
          }
        });
    } catch (error) {
      console.error('Ошибка при обновлении слоев из геосервера!', error);
    }
  };

  const saveGeometrySource = async () => {
    setIsSavingGeometry(true);
    map
      .getLayers()
      .getArray()
      .forEach(async (layer: any) => {
        try {
          if (layer.get('name') === 'editgeom_new') {
            const source = layer.getSource();
            const features = source.getFeatures();
            const geometryCollection = new GeometryCollection(features);
            //const geometry = geometryCollection.getGeometries();
            // const geoJson: any = new GeoJSON().writeFeaturesObject(features);

            const geoJsonArray: any = [];
            source.forEachFeature((feature) => {
              geoJsonArray.push(new GeoJSON().writeGeometryObject(feature.getGeometry()));
            });
            // console.log(features, geometryCollection, geoJsonArray);
            // debugger;
            const obj = {
              p_params: {
                p_road_id: selectedRoad?.out_entity_id,
                p_road_part_id: selectedRoadPart?.id,
                geom: geoJsonArray,
                p_user_id: userAuth?.profile?.userId,
              },
            };
            if (
              roadPartGeom?.geom &&
              roadPartGeom?.geom?.coordinates &&
              roadPartGeom?.geom?.coordinates.length > 0 &&
              geoJsonArray.length === 0
            ) {
              toast.warning(
                `Невозможно сохранить геометрию! Вы удалили существующую геометрию у участка и не нарисовали новую! Для выбранного участка не задана геометрия!`
              );
            } else if (geoJsonArray.length === 0) {
              toast.warning(`Невозможно сохранить геометрию! Для выбранного участка не задана геометрия!`);
            } else {
              //const response = await axios.post(`${pgApiUrl}/rpc/write_geom`, obj, gisSchemaHeader);
              const response = await axios.post(`${pgApiUrl}/rpc/write_geom`, obj, commandSchemaHeader);
              if (response?.data && response?.data !== -1) {
                toast.info('Геометрия успешно сохранена');
                refreshLayers();
                closeEditMode();
                //removeAllGeomFeatures();
                //dispatch(resetDrawState());
              } else {
                toast.warning(`Возникли проблемы при сохранении геометрии`);
              }
            }
            setIsSavingGeometry(false);
          }
        } catch (error) {
          setIsSavingGeometry(false);
          toast.error(
            `Ошибка при сохранении отредактированной геометрии! ${error?.response?.data?.message ? error?.response?.data?.message : error}`
          );
          console.error(
            'Ошибка при сохранении отредактированной геометрии!',
            error?.response?.data?.message ? error?.response?.data?.message : error
          );
        }
      });
  };

  const closeEditMode = () => {
    try {
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

      removeAllGeomFeatures();
      setIsEditGeom(!isEditGeom);
      dispatch(setMapMode('navigation'));
      // Деактивация всех интерактивов draw,modify,snap
      const currentInteractionArr = map.getInteractions().getArray();
      console.log(currentInteractionArr);
      currentInteractionArr.forEach((item) => {
        if (item instanceof Draw || item instanceof Modify || item instanceof Snap) {
          item.setActive(false);
          //map.removeInteraction(item);
        }
      });

      //Включение слоя wms с дорогами
      let currentLayers = { ...mapLayers };
      const wmsGroup: any = map
        .getLayers()
        .getArray()
        .filter((item, index, array) => item.get('name') === 'layers-wms')?.[0];
      wmsGroup
        .getLayers()
        .getArray()
        .forEach((layer) => {
          const lname = layer.get('name');
          if (lname === 'lyr_road_by_value') {
            currentLayers['lyr_road_by_value'] = { checked: true, name: 'lyr_road_by_value' };
            layer.setVisible(true);
          } else {
            currentLayers[lname] = { checked: false, name: lname };
          }
        });
      setMapLayers(currentLayers);

      const view = map.getView();
      view.setMinZoom(0);
      view.setMaxZoom(18);
      dispatch(setGeomLength(0));

      dispatch(resetDrawState());
      const objType = routerRest?.match?.params?.objecttype;
      let route = '';
      if (objType === 'roadpart') {
        route = `/roadOnBalance/${selectedRoadPart?.id}`;
      } else if (objType === 'road') {
        route = `/roads/${selectedRoad?.out_entity_id}`;
      }

      if (routerRest?.match?.params?.edit === 'edit' && routerRest?.match?.params?.id && selectedRoad?.out_entity_id) {
        //routerRest.history.push({ pathname: `/roads/${selectedRoad?.out_entity_id}`, state: undefined });
        routerRest.history.push({ pathname: route, state: undefined });
      } else if (routerRest?.match?.params?.id) {
        if (routerRest?.match?.params?.edit === 'show') {
          //routerRest.history.push({ pathname: `/roads/${selectedRoad?.out_entity_id}`, state: undefined });
          routerRest.history.push({ pathname: route, state: undefined });
        } else {
          routerRest.history.push({ pathname: '/map', state: undefined });
        }
      }
    } catch (error) {
      console.error('Ошибка при выходе из режима редактирования дороги!', error);
    }
  };

  return (
    <>
      {/* <GeoIconButton
        iconType="close"
        handleClick={() => {
          setIsEditGeom(!isEditGeom);
          dispatch(setMapMode('navigation'));
        }}
        classes="GeoEditGeom__close__btn"
      /> */}
      <Card style={{ width: '25%' }} className="skdf-shadow-down-16dp GeoEditGeom__card">
        <Card.Header className="GeoEditGeom__card__header">
          <div className="GeoEditGeom__title mb-3">Редактирование геометрии дороги</div>
          <div className="mb-3">
            <GeoSearchEditRoads selectedRoad={selectedRoad} setSelectedRoad={(selroad) => dispatch(setSelectedRoad(selroad))} />
          </div>
          {selectedRoad && selectedRoad !== null && (
            <div className="mb-3">
              <div className="GeoEditGeom__group__title mb-1">Выбранная дорога</div>
              <div style={{ textAlign: 'justify', fontSize: '16px', fontWeight: 'bold' }}>{selectedRoad?.out_full_name}</div>
              <hr />
            </div>
          )}
        </Card.Header>
        <Card.Body className="GeoEditGeom__content pt-0 pb-4">
          <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {selectedRoad && selectedRoad !== null ? (
              <>
                {roadParts && roadParts.length > 0 ? (
                  <div className="mb-3" style={{ flexGrow: '2' }}>
                    <div className="GeoEditGeom__group__title mb-1">Выберите участок дороги</div>
                    <div className="GeoEditGeom__roadpart__container">
                      {roadParts.map((item) => {
                        return (
                          <div
                            id={item?.id}
                            className={
                              selectedRoadPart && Object.keys(selectedRoadPart).length > 0 && selectedRoadPart?.id === item?.id
                                ? 'GeoEditGeom__row__selected'
                                : 'GeoEditGeom__row'
                            }
                            key={item?.id}
                          >
                            <div
                              onClick={() => {
                                dispatch(setSelectedRoadPart(item));
                              }}
                              style={{}}
                            >
                              {item?.full_name}
                            </div>
                            {/* {selectedRoadPart && Object.keys(selectedRoadPart).length > 0 && selectedRoadPart?.id === item?.id && (
                              <div className="GeoEditGeom__icon">   
                                <div>
                                  <GeoIcon
                                    name="map"
                                    iconType="map"
                                    onClick={() => {
                                      setSelectedRoadPart(item);
                                    }}
                                    style={{ color: '#0D47A1' }}
                                  />
                                </div>
                                <div>
                                  {drawMode === 'draw' ? (
                                    <div className="GeoEditGeom__draw_blinking">
                                      <GeoIcon
                                        name="draw"
                                        iconType="draw"
                                        onClick={() => {
                                          setDrawMode('');
                                          map.removeInteraction(drawRef.current);
                                        }}
                                        style={{ color: 'red' }}
                                      />
                                    </div>
                                  ) : (
                                    <GeoIcon
                                      name="draw"
                                      iconType="draw"
                                      onClick={() => {
                                        setDrawMode('draw');
                                      }}
                                      style={{ color: '#0D47A1' }}
                                    />
                                  )}
                                </div>
                                <div>
                                  <GeoIcon
                                    name="cancel"
                                    iconType="cancel"
                                    onClick={() => {
                                      cancelDraw();
                                    }}
                                    style={{ color: '#0D47A1' }}
                                  />
                                </div>
                              </div>
                            )} */}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : isLoadingRoadParts ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <GeoLoader />
                  </div>
                ) : (
                  <div>Отсутствуют участки</div>
                )}
              </>
            ) : (
              <div>Не выбрана дорога</div>
            )}
          </div>
        </Card.Body>
        <Card.Footer className="GeoEditGeom__footer">
          <Button
            disabled={isSavingGeometry}
            onClick={async () => {
              if (selectedRoadPart && Object.keys(selectedRoadPart).length > 0) {
                //setIsSavingGeometry(true);
                const accessLevel = await getObjectAccessLevel(selectedRoadPart?.id, userAuth?.profile?.userId);
                console.log('Уровень доступа', accessLevel);
                if (accessLevel === 2) {
                  saveGeometrySource();
                } else {
                  toast.warn('Недостаточно прав для сохранения геометрии выбранного участка!');
                }
              }
              // setIsEditGeom(!isEditGeom);
              // removeAllGeomFeatures();
              // setIsEditGeom(!isEditGeom);
              // dispatch(setMapMode('navigation'));
              // dispatch(resetDrawState());
              // if (routerRest?.match?.params?.id) {
              //   routerRest.history.push({ pathname: '/map', state: undefined });
              // }
            }}
            variant="skdf-primary"
            className="GeoEditGeom__footer__item d-inline-flex justify-content-center w-100 align-items-center mx-4"
          >
            {isSavingGeometry ? (
              <div>
                <GeoLoader size={20} /> Сохранение...
              </div>
            ) : (
              <div>Сохранить</div>
            )}
          </Button>
          <Button
            variant="skdf-stroke"
            //disabled={isResetBtnActive}
            className="GeoEditGeom__footer__item d-inline-flex justify-content-center w-100 align-items-center mx-4"
            onClick={() => {
              closeEditMode();
            }}
          >
            Отменить и закрыть
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default GeoEditGeom;
