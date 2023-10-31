import React, { FC, useState, useEffect, useRef } from 'react';
import './GeoEditGeomBridge.scss';
import { Card, Button, Container, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import GeoIconButton from '../GeoIconButton';
import { GeoEditGeomBridgeTypes } from './GeoEditGeomBridge.types';
import { useAppDispatch, useAppSelector } from '../../config/store';
import GeoSearchEditRoads from './GeoSearchEditBridge/GeoSearchEditBridge';
import { setBridgeGeomType, setMapMode } from '../../reducers/map.reducer';
import axios from 'axios';
import {
  commandapiSchemaHeader,
  commandSchemaHeader,
  defaultBridgeObjWithoutName,
  gisapiSchemaHeader,
  gisSchemaHeader,
  hwmSchemaHeader,
  pgApiUrl,
  privateSchemaHeader,
  publicSchemaHeader,
  querySchemaHeader,
} from '../../config/constants';
import GeoIcon from '../GeoIcon';
import GeoJSON from 'ol/format/GeoJSON';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import {
  resetDrawState,
  setBridgeGeom,
  setDrawMode,
  setRoadParts,
  setSelectedBridge,
  setSelectedRoad,
  setSelectedRoadPart,
} from '../../reducers/mapDraw.reducer';
import { toast } from 'react-toastify';
import { GeometryCollection } from 'ol/geom';
import GeoLoader from '../GeoLoader/GeoLoader';
import { saveAs } from 'file-saver';
import { Fill, Stroke, Style } from 'ol/style';
import { wfsHoverLayers, wfsLayers } from '../../Map/layers.mock';
import GeoSearchEditBridge from './GeoSearchEditBridge/GeoSearchEditBridge';
import CircleStyle from 'ol/style/Circle';
import GeoBridgeEditForm from './BridgeEditForm/GeoBridgeForm';
import { bridgeObjType } from '../../global.types';
import { getObjectAccessLevel } from '../../Map/mapFunctions';
import TileLayer from 'ol/layer/Tile';
//import { wfsLayers } from './layers.mock';

const GeoEditGeomBridge: FC<GeoEditGeomBridgeTypes> = ({
  map,
  isEditGeom,
  setIsEditGeom,
  mapLayers,
  setMapLayers,
  selectedBridgeId,
  routerRest,
}) => {
  const [isSavingGeometry, setIsSavingGeometry] = useState<boolean>(false);
  const [isBridgeForm, setIsBridgeForm] = useState<boolean>(false);
  const [bridgeFormData, setBridgeFormData] = useState<bridgeObjType>(defaultBridgeObjWithoutName);
  const [bridgeFormMode, setBridgeFormMode] = useState<'create' | 'edit' | 'show'>('show');

  const dispatch = useAppDispatch();
  const userAuth: any = useAppSelector((state) => state.user.userAuthData);
  const selectedBridge = useAppSelector((state) => state.mapdraw.selectedBridge);
  const bridgeGeom = useAppSelector((state) => state.mapdraw.bridgeGeom);
  const drawMode = useAppSelector((state) => state.mapdraw.drawMode);
  const bridgeGeomType = useAppSelector((state) => state.mapstate.bridgeGeomType);

  const drawRef = useRef<any>();
  const modifyRef = useRef<any>();
  const snapRef = useRef<any>();
  const sourceRef = useRef<any>();

  const postForm = () => {
    const preparedData = {
      FULL_NAME: bridgeFormData.FULL_NAME,
      TYPE: bridgeFormData.TYPE,
      BRIDGE_TYPE_1: bridgeFormData.BRIDGE_TYPE_1,
      START: bridgeFormData.START,
      FINISH: bridgeFormData.FINISH,
      TYPE_OF_OBSTACLE: bridgeFormData.TYPE_OF_OBSTACLE,
      LENGTH: bridgeFormData.LENGTH,
      TECHNICAL_CONDITION: bridgeFormData.TECHNICAL_CONDITION,
      REGION: bridgeFormData.REGION,
      OWNER: bridgeFormData.OWNER,
    };
    if (bridgeFormMode === 'edit') {
      preparedData['p_bridge_id'] = selectedBridge?.out_entity_id;
    }

    map
      .getLayers()
      .getArray()
      .forEach(async (layer: any) => {
        try {
          if (layer.get('name') === 'editgeom_new') {
            const source = layer.getSource();
            const features = source.getFeatures();

            const geoJsonArray: any = [];
            let geom;
            source.forEachFeature((feature) => {
              geoJsonArray.push(new GeoJSON().writeGeometryObject(feature.getGeometry()));
              geom = new GeoJSON().writeGeometryObject(feature.getGeometry());
            });
            preparedData['geom'] = geom;
            // console.log(features, geometryCollection, geoJsonArray);
          }
        } catch (error) {
          console.error(
            'Ошибка при сохранении отредактированной геометрии!',
            error?.response?.data?.message ? error?.response?.data?.message : error
          );
        }
      });

    axios
      .post(`${pgApiUrl}/rpc/f_create_bridge_object_v2`, { data: preparedData }, privateSchemaHeader)
      .then((response) => {
        const data = response.data;
        dispatch(setSelectedBridge({ out_entity_id: response.data, out_full_name: bridgeFormData.FULL_NAME }));
        setBridgeFormMode('show');
        dispatch(setDrawMode(''));
        onChangeGeomTypeStopDrawing();
        toast.info('Форма успешно сохранена');
      })
      .catch((error) => {
        console.error(`Ошибка при отправки данных формы: ${error}`);
      });
  };

  const getRegionCoordinates = async (bridgeid) => {
    try {
      const responseRegion = await axios.post(`${pgApiUrl}/rpc/get_bridge`, { p_bridge_id: bridgeid }, privateSchemaHeader);
      if (responseRegion?.data && responseRegion?.data?.REGION) {
        console.log(responseRegion?.data);
        const body = {
          dimmember_gid: responseRegion?.data?.REGION,
        };
        const responseCoordinates = await axios.post(`${pgApiUrl}/rpc/f_get_adm_centroid`, body, publicSchemaHeader);
        if (responseCoordinates?.data && Object.keys(responseCoordinates?.data).length > 0) {
          map.getView().setCenter([responseCoordinates?.data?.lon, responseCoordinates?.data?.lat]);
          map.getView().setZoom(responseCoordinates?.data?.zoom);
        }
      }
    } catch (error) {
      console.error('Ошибка при получении координат центра региона выбранного моста', error);
    }
  };

  const getBridgeGeom = async (bridge) => {
    try {
      // const response = await axios.get(`${pgApiUrl}/v_gis_bridge_point?bridge_id=eq.${bridge?.out_entity_id}`, gisSchemaHeader);
      const response = await axios.post(`${pgApiUrl}/rpc/get_bridge_point`, { bridge_id: bridge?.out_entity_id }, querySchemaHeader);
      if (response?.data && response?.data?.length > 0 && response?.data?.[0]?.geom && response?.data?.[0]?.geom?.coordinates?.length > 0) {
        dispatch(setBridgeGeom(response?.data?.[0]));
      } else {
        dispatch(setBridgeGeom({}));
        getRegionCoordinates(bridge?.out_entity_id);
        toast.warn('Отсутствует геометрия моста!');
      }
    } catch (error) {
      console.error(`Ошибка при получении геометрии выбранного моста! ${error}`);
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
    if (selectedBridge && selectedBridge !== null && Object.keys(selectedBridge).length > 0) {
      getBridgeGeom(selectedBridge);
      removeNewFeature();
      removeCurrentFeature();
      removeInteraction();
    }
  }, [selectedBridge]);

  const getBridgeName = async (bridgeid) => {
    try {
      const obj = {
        p_id: bridgeid,
      };
      const response = await axios.post(`${pgApiUrl}/rpc/get_object_name`, obj, querySchemaHeader);
      if (response?.data) {
        const bridgeObj = {
          out_entity_id: bridgeid,
          out_full_name: response?.data,
        };
        dispatch(setSelectedBridge(bridgeObj));
      }
    } catch (error) {
      console.error('Ошибка при получении имени моста', error);
    }
  };

  useEffect(() => {
    if (selectedBridgeId && selectedBridgeId !== null) {
      getBridgeName(selectedBridgeId);
    }
  }, [selectedBridgeId]);

  const removeInteraction = () => {
    try {
      map.removeInteraction(drawRef.current);
      map.removeInteraction(snapRef.current);
      map.removeInteraction(modifyRef.current);
    } catch (error) {
      console.log(`Ошибка при удалении interaction! ${error}`);
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
  const fitSelectedBridge = async (roadid) => {
    try {
      const bbox = await axios.post(`${pgApiUrl}/rpc/f_get_bbox_by_road_id`, { p_road_id: roadid?.out_entity_id }, publicSchemaHeader);
      if (bbox && bbox?.data && bbox?.data.length > 0) {
        map.getView().fit(bbox?.data, {
          padding: [50, 50, 50, 50],
          size: map.getSize(),
          maxZoom: 16,
          duration: 500,
        });
      }
    } catch (error) {
      console.error(`Ошибка при вписывании выбранного моста! ${error}`);
    }
  };

  const onChangeGeomTypeStopDrawing = () => {
    try {
      dispatch(setDrawMode(''));
      const currentInteractionArr = map.getInteractions().getArray();
      currentInteractionArr.forEach((item) => {
        if (item instanceof Draw) {
          map.removeInteraction(item);
          item.finishDrawing();
        }
      });
    } catch (error) {
      console.log('Ошибка при остановке режима рисования', error);
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
      map
        .getLayers()
        .getArray()
        .forEach((layer: any) => {
          const lname = layer.get('name');
          if (lname === 'lyr_bridge_point_edit') {
            layer
              .getLayers()
              .getArray()
              .forEach((l) => {
                //const source = layer.getSource();
                const source = l.getSource();
                source.refresh();
              });
          }
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
          if (lname === 'lyr_bridges' && layer instanceof TileLayer) {
            setTimeout(() => {
              l.getSource().refresh();
            }, 2000);
            // const source = layer.getSource();
            // source.refresh();
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

            const geoJsonArray: any = [];
            source.forEachFeature((feature) => {
              geoJsonArray.push(new GeoJSON().writeGeometryObject(feature.getGeometry()));
            });
            // console.log(features, geometryCollection, geoJsonArray);
            const obj = {
              p_params: {
                p_bridge_id: selectedBridge?.out_entity_id,
                geom: geoJsonArray,
                p_user_id: userAuth?.profile?.userId,
              },
            };
            //const response = await axios.post(`${pgApiUrl}/rpc/write_bridge_geom`, obj, gisSchemaHeader);
            const response = await axios.post(`${pgApiUrl}/rpc/write_bridge_geom`, obj, commandSchemaHeader);
            // const obj = {
            //   data: {
            //     p_bridge_id: selectedBridge?.out_entity_id,
            //     geom: geoJsonArray,
            //   },
            // };
            // const response = await axios.post(`${pgApiUrl}/rpc/f_create_bridge_object_v2`, obj, privateSchemaHeader);
            if (response?.data && response?.data !== -1) {
              toast.info('Геометрия успешно сохранена');
              refreshLayers();
              onChangeGeomTypeStopDrawing();
              dispatch(setDrawMode(''));
              closeBridgeEditGeom();
              //removeAllGeomFeatures();
              //dispatch(resetDrawState());
            } else {
              toast.warn(`Возникли проблемы при сохранении геометрии`);
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

  const closeBridgeEditGeom = () => {
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
        }
      });

      //Включение слоя wms с мостами
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
          if (lname === 'vec_lyr_bridges') {
            currentLayers['vec_lyr_bridges'] = { checked: true, name: 'vec_lyr_bridges' };
            layer.setVisible(true);
          } else {
            currentLayers[lname] = { checked: false, name: lname };
          }
        });
      setMapLayers(currentLayers);

      map
        .getLayers()
        .getArray()
        .forEach((layer: any) => {
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
                // layer.setVisible(false);
              });
          }
        });

      const view = map.getView();
      view.setMinZoom(0);
      view.setMaxZoom(18);

      dispatch(resetDrawState());
      if (routerRest?.match?.params?.edit === 'edit' && routerRest?.match?.params?.id && selectedBridge?.out_entity_id) {
        routerRest.history.push({ pathname: `/bridges/${selectedBridge?.out_entity_id}`, state: undefined });
      } else if (routerRest?.match?.params?.id) {
        if (routerRest?.match?.params?.edit === 'show') {
          routerRest.history.push({ pathname: `/bridges/${selectedBridge?.out_entity_id}`, state: undefined });
        } else {
          routerRest.history.push({ pathname: '/map', state: undefined });
        }
      }
    } catch (error) {
      console.error('Ошибри при выходе из режима редактирования геометрии моста!', error);
    }
  };

  return (
    <>
      <Card style={{ width: '25%' }} className="skdf-shadow-down-16dp GeoEditGeomBridge__card">
        <Card.Header className="GeoEditGeomBridge__card__header">
          <div className="mb-3 d-flex align-items-center">
            <div className="GeoEditGeom__title mb-3">Редактирование геометрии моста</div>
            <div className="GeoEditGeom__title__icon ms-3">
              <GeoIcon
                name="plus"
                iconType="plus"
                onClick={() => {
                  if (bridgeFormMode === 'create') {
                    setBridgeFormMode('show');
                    setIsBridgeForm(false);
                    dispatch(setSelectedBridge(null));
                  } else {
                    setBridgeFormMode('create');
                    dispatch(setSelectedBridge({ out_entity_id: 0, out_full_name: 'Создание моста' }));
                    setIsBridgeForm(true);
                  }
                }}
              />
            </div>
          </div>
          <div className="mb-3">
            <GeoSearchEditBridge
              selectedBridge={selectedBridge}
              setSelectedBridge={(selbridge) => {
                dispatch(setSelectedBridge(selbridge));
                setIsBridgeForm(true);
                setBridgeFormMode('show');
              }}
            />
          </div>
          {selectedBridge && selectedBridge !== null && (
            <>
              <div>
                {bridgeFormMode !== 'create' && <div className="GeoEditGeomBridge__group__title mb-1">Выбранный мост</div>}
                <div style={{ textAlign: 'justify', fontSize: '16px', fontWeight: 'bold' }}>{selectedBridge?.out_full_name}</div>
                <hr />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                <div className="form-check">
                  <input
                    id="point"
                    className="form-check-input"
                    type="radio"
                    checked={bridgeGeomType === 'Point'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChangeGeomTypeStopDrawing();
                        dispatch(setBridgeGeomType('Point'));
                      }
                    }}
                  />
                  <label style={{ fontSize: '14px' }} htmlFor="point" className="form-check-label">
                    Точечный объект
                  </label>
                </div>
                <div className="form-check">
                  <input
                    id="line"
                    className="form-check-input"
                    type="radio"
                    checked={bridgeGeomType === 'LineString'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChangeGeomTypeStopDrawing();
                        dispatch(setBridgeGeomType('LineString'));
                      }
                    }}
                  />
                  <label style={{ fontSize: '14px' }} htmlFor="line" className="form-check-label">
                    Линейный объект
                  </label>
                </div>
              </div>
            </>
          )}
        </Card.Header>
        <Card.Body className="GeoEditGeomBridge__content pt-0 pb-4">
          {/* <div style={{ display: 'flex', flexDirection: 'column', height: '200px' }}>
            {selectedBridge && selectedBridge !== null ? <></> : <div>Не выбран мост</div>}
          </div> */}
          {isBridgeForm && (
            <GeoBridgeEditForm
              formMode={bridgeFormMode}
              formData={bridgeFormData}
              setFormData={setBridgeFormData}
              setBridgeFormMode={setBridgeFormMode}
            />
          )}
        </Card.Body>
        <Card.Footer className="GeoEditGeomBridge__footer">
          {bridgeFormMode === 'show' ? (
            <Button
              disabled={isSavingGeometry}
              onClick={async () => {
                if (selectedBridge && Object.keys(selectedBridge).length > 0) {
                  //setIsSavingGeometry(true);
                  const accessLevel = await getObjectAccessLevel(selectedBridge?.out_entity_id, userAuth?.profile?.userId);
                  console.log('Уровень доступа', accessLevel);
                  if (accessLevel === 2) {
                    saveGeometrySource();
                  } else {
                    toast.warn('Недостаточно прав для сохранения геометрии выбранного мостового сооружения!');
                  }
                }
                // setIsSavingGeometry(true);
                //saveGeometrySource();
              }}
              variant="skdf-primary"
              className="GeoEditGeomBridge__footer__item d-inline-flex justify-content-center w-100 align-items-center mx-4"
            >
              {isSavingGeometry ? (
                <div>
                  <GeoLoader size={20} /> Сохранение...
                </div>
              ) : (
                <div>Сохранить геометрию</div>
              )}
            </Button>
          ) : (
            <Button
              disabled={isSavingGeometry}
              onClick={() => {
                postForm();
              }}
              variant="skdf-primary"
              className="GeoEditGeomBridge__footer__item d-inline-flex justify-content-center w-100 align-items-center mx-4"
            >
              {isSavingGeometry ? (
                <div>
                  <GeoLoader size={20} /> Сохранение...
                </div>
              ) : (
                <div>Сохранить</div>
              )}
            </Button>
          )}
          <Button
            variant="skdf-stroke"
            //disabled={isResetBtnActive}
            className="GeoEditGeom__footer__item d-inline-flex justify-content-center w-100 align-items-center mx-4"
            onClick={() => {
              closeBridgeEditGeom();
            }}
          >
            Отменить и закрыть
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default GeoEditGeomBridge;
