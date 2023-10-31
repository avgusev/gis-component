import React, { FC, useEffect, useMemo, useState } from 'react';
import { Card, Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import GeoIconButton from '../GeoIconButton';
import './GeoMapCardDetail.scss';
import { GeoMapCardDetailTypes } from './GeoMapCardDetail.types';
import GeoCheckedFlag from '../GeoCheckedFlag/GeoCheckedFlag';
import { GeoIcon } from '../GeoIcon/GeoIcon';
import GeoLoader from '../GeoLoader/GeoLoader';
import GeoSingleSelect from '../GeoForms/GeoSingleSelect/GeoSingleSelect';
import GeoMapCardDetailNetwork from './Editing/Network/GeoMapCardDetailNetwork';
import GeoMapCardDetailBridge from './Editing/Bridge/GeoMapCardDetailBridge';
import { ISelectOption } from '../GeoForms/GeoSingleSelect/GeoSingleSelect.types';
import GeoGalleryModal from '../GeoGalleryModal/GeoGalleryModal';
import { toast } from 'react-toastify';
import {
  diagSchemaHeaders,
  hwmSchemaHeader,
  pgApiUrl,
  pgGraphApiUrl,
  publicSchemaHeader,
  querySchemaHeader,
  skdfApiUrl,
} from '../../config/constants';
import { Pair } from '../GeoInputRange/GeoInputRange.types';
import GeoPicketRoadSearch from '../GeoPicketRoadSearch/GeoPicketRoadSearch';
import { useAppDispatch, useAppSelector } from '../../config/store';
import { openPicket } from '../../reducers/picket.reducer';
import GeoMapCardRoadWork5Y from './GeoMapCardRoadWork5Y';
import GeoTextBtn from '../GeoTextBtn/GeoTextBtn';
import GeoDiagnosticControlModal from '../GeoDiagnosticControlModal/GeoDiagnosticControlModal';
import { setEditObjectMode, setMapMode } from '../../reducers/map.reducer';
import GrafCard from './GrafCard/GrafCard';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { wfsLayers } from '../../Map/layers.mock';
import { setDrawMode, setGeomLength, setSelectedRoadPart } from '../../reducers/mapDraw.reducer';

const GeoMapCardDetail: FC<GeoMapCardDetailTypes> = (props) => {
  const {
    isOpenCardDetail,
    setIsOpenCardDetail,
    id_road,
    routerRest,
    selectedRoadPartId,
    getGeoJson,
    isFlatnessLayerOn,
    getFlatnessFile,
    map,
    selectedFeature,
    isDiagnosticsModal,
    setIsDiagnosticsModal,
    mapLayers,
    backBoneId,
    selectedEdgeId,
    selectedBridgeId,
    updateMapSize,
    removePicketFeature,
    searchAndAddPicketFeature,
    roadworks5y,
    removeRoadworks5yFeature,
    getRoadName,
    setIsEditGeom,
    setSelectedBridgeId,
    selectedBridgeIdRef,
  } = props;

  const [data, setData] = useState(null);
  const [isLidarBtn, setIsLidarBtn] = useState<boolean>(false);
  const [isPanoBtn, setIsPanoBtn] = useState<boolean>(false);
  const [isGeoJsonLoading, setIsGeoJsonLoading] = useState<boolean>(false);
  const [isShowAllList, setIsShowAllList] = useState<boolean>(false);
  const [currentLists, setCurrentLists] = useState<string[]>([]);
  const [isDownloadingFlatness, setIsDownloadingFlatness] = useState<boolean>(false);
  const [isLoadingCardData, setIsLoadingCardData] = useState<boolean>(true);
  const [isDiagnosticControlModal, setIsDiagnosticControlModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isGallery, setIsGallery] = useState<boolean>(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isGalleryLoading, setGalleryLoading] = useState<boolean>(false);
  const [galleryData, setGalleryData] = useState([]);
  const [isActionOptions, setIsActionOptions] = useState<boolean>(false);
  const [editingType, setEditingType] = useState<string>('');
  const [objectType, setObjectType] = useState<'linear' | 'point'>('linear');
  const [valueRangePicket, setValueRangePicket] = useState<Pair>([undefined, undefined]);
  const dispatch = useAppDispatch();
  const isPicket = useAppSelector((state) => state.picket.isOpen);
  const mapMode = useAppSelector((state) => state.mapstate.mapMode);
  const userAuth: any = useAppSelector((state) => state.user?.userAuthData);

  const options: ISelectOption[] = [
    { value: 'Мостовые сооружения', label: 'Мостовые сооружения' },
    { value: 'Участки, входящие в опорную сеть', label: 'Участки, входящие в опорную сеть' },
  ];
  console.log('RoadId: ', id_road);
  console.log('backBoneId: ', backBoneId);
  console.log('Data: ', data);

  const dataClassification = {
    FULL_NAME: 'string',
    VALUE_OF_THE_ROAD: 'string',
    ROAD_OWNER: 'list',
    IDENTIFICATION_NUMBER_SECTION: 'number',
    UCHET_NUMBER: 'number',
    REGION: 'list',
    DISTRICT: 'list',
    CITY: 'list',
    LOCALITY: 'list',
    PLANNING_STRUCTURE: 'list',
    INTRACITY_TERRITORY: 'list',
    LENGTH_POPIKETNO: 'number',
    ROADWAY_WIDTH: 'number',
    SUBGRADE_WIDTH: 'number',
    SQUARE: 'number',
    BALANCE_STOIM: 'number',
    OSTATOK: 'number',
    CORE_NETWORK: 'boolean',
    CRITERION: 'string',
    RANKS: 'number',
    ROAD_CATEGORY: 'number',
    DATA_EXPL: 'data',
    COATING: 'list',
    CLASS_OF_ROAD: 'list',
    TOP_SPEED: 'number',
    INTERNATIONAL: 'dtring',
    THROUGHPUT: 'number',
    TRAFFIC_INTENSITY: 'number',
    LOCATION_START: 'number',
    EMERGENCY_SECTION: 'number',
    ROAD_PART_OVERLOADED: 'number',
    ROAD_PART: 'number',
    MESSAGE: 'number',
    COST: 'number',
    IS_CHECKED: 'boolean',
    CONFIRM_USER: 'string',
    NORM_PERCENTAGE: 'number',
    TIME_CONFIRMATION: 'data',
    NUMBER_EGRAD: 'number',
  };

  const checkLengthValue = (item, isShowAll) => {
    let result = item?.value?.value;

    if (item?.value?.value && (dataClassification?.[item?.code] === 'list' || selectedBridgeId !== null)) {
      let interviewer: any;
      if (typeof item?.value?.value === 'object') {
        interviewer = item?.value?.value;
      } else {
        if (typeof item.value.value === 'string') {
          interviewer = item?.value?.value.split(',');
        } else {
          interviewer = '';
        }
      }
      //const interviewer = item.value.value.split(',');
      if (interviewer.length > 1 || (interviewer.length > 0 && selectedBridgeId !== null)) {
        result =
          isShowAll && (currentLists.includes(item?.code) || selectedBridgeId! == null) ? (
            <>
              <ul className="ps-4 mb-1">
                {interviewer.map((item) => {
                  return <li className="mb-2">{item?.text ? item?.text : typeof item === 'string' ? item : null}</li>;
                })}
              </ul>
            </>
          ) : (
            <>
              <ul className="ps-4 mb-1">
                {interviewer.map((item, index) => {
                  if (index <= 3) {
                    return <li className="mb-2">{item?.text ? item?.text : typeof item === 'string' ? item : null}</li>;
                  }
                })}
              </ul>
              {interviewer.length > 4 && (
                <GeoTextBtn
                  handlerClick={() => {
                    setIsShowAllList(true);
                    setCurrentLists([...currentLists, item?.code]);
                  }}
                  label="Показать все"
                />
              )}
            </>
          );
      }
    }

    return result;
  };

  const geoGetCardDetail = () => {
    axios
      // .get(`${skdfApiUrl}/api/v1/portal/map/mini-passport/96378194`)
      .get(`${skdfApiUrl}/api/v1/portal/map/mini-passport/${id_road ? id_road : selectedRoadPartId}`)
      .then((response) => {
        setIsShowAllList(false);
        setCurrentLists([]);
        setData(response.data);
        setIsLoadingCardData(true);
        console.log(response.data);
      })
      .catch((error) => {
        toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
        setIsShowAllList(false);
        setIsLoadingCardData(true);
      });
  };

  const getMinipasportBackbone = () => {
    axios
      .post(`${pgApiUrl}/rpc/f_get_backbone_minipasport`, { backbone_id: backBoneId }, publicSchemaHeader)
      .then((response) => {
        setData(response.data);
        setIsLoadingCardData(true);
      })
      .catch((error) => {
        console.error(`Ошибка получении данных geoGetCardDetail: ${error}`);
        setIsLoadingCardData(true);
      });
  };
  const getImages = () => {
    setGalleryLoading(true);
    const body = { backbone_id: backBoneId };
    axios
      .post(`${pgApiUrl}/rpc/f_get_work_photos`, body, publicSchemaHeader)
      .then((response) => {
        const result = [];
        if (response.data) {
          response.data.map((item) => {
            const after = item?.after;
            const afterName = item?.after_filename;
            const before = item?.before;
            const beforeName = item?.before_filename;
            const workName = item?.work_name;
            const imgCount = item?.after?.length || 0;
            const customers = item?.customers;
            const contractors = item?.contractors;
            const work_length = item?.work_length;
            const work_status = item?.work_status;
            const work_start = item?.work_start;
            const work_finish = item?.work_finish;
            const deadline = item?.deadline;
            const work_id = item?.work_id;
            const obj = {
              title: workName,
              imgArr: [],
              imgCount,
              customers,
              contractors,
              work_length,
              work_status,
              work_start,
              work_finish,
              deadline,
              work_id,
            };
            obj.title = workName;
            if (after && before) {
              after.map((item, index) => {
                const afterObj = {
                  afterName: afterName[index],
                  afterCode: item,
                  beforeName: beforeName[index],
                  beforeCode: before[index],
                  workName: workName,
                  pageNum: index + 1,
                };
                obj.imgArr.push(afterObj);
              });
            }
            result.push(obj);
          });
        }
        console.log(result);
        setGalleryData(result);
        setGalleryLoading(false);
        setIsGallery(false);
        setIsGalleryOpen(true);
      })
      .catch((error) => {
        toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
        setGalleryLoading(false);
        setIsGallery(false);
      });
  };

  const getMinipasportLinks = () => {
    axios
      .post(`${pgGraphApiUrl}/rpc/f_get_link_minipasport`, { netw_id: selectedEdgeId }, publicSchemaHeader)
      .then((response) => {
        setData(response.data);
        setIsLoadingCardData(true);
      })
      .catch((error) => {
        console.error(`Ошибка получении данных geoGetCardDetail: ${error}`);
        setIsLoadingCardData(true);
      });
  };

  const checkPanoLidarExists = (url: string, setIsBtn: (value: boolean) => void) => {
    const preparedData = { p_road_id: id_road };
    axios
      //.post(`${pgApiUrl}/rpc/${url}`, preparedData, diagSchemaHeaders)
      .post(`${pgApiUrl}/rpc/${url}`, preparedData, querySchemaHeader)
      .then((response) => {
        if (response.data > 0) {
          setIsBtn(true);
        }
      })
      .catch((error) => {
        console.error(`Ошибка получении данных checkPanoLidarExists: ${error}`);
      });
  };

  useEffect(() => {
    checkPanoLidarExists('check_pano_exists', setIsPanoBtn);
    checkPanoLidarExists('check_lidar_exists', setIsLidarBtn);
  }, []);

  useEffect(() => {
    if (isGallery) {
      getImages();
    }
  }, [isGallery]);

  useEffect(() => {
    if (mapLayers?.lyr_road_conditions_skeleton?.checked && backBoneId) {
      getMinipasportBackbone();
    }
    setIsLoadingCardData(false);
  }, [backBoneId]);

  // useEffect(() => {
  //   if (
  //     (mapLayers?.lyr_graf_federal?.checked || mapLayers?.lyr_graf_regional?.checked || mapLayers?.lyr_graf_municipal?.checked) &&
  //     selectedEdgeId
  //   ) {
  //     setIsLoadingCardData(false);
  //     getMinipasportLinks();
  //   }
  // }, [selectedEdgeId]);

  useEffect(() => {
    // if (
    //   (mapLayers?.lyr_graf_federal?.checked || mapLayers?.lyr_graf_regional?.checked || mapLayers?.lyr_graf_municipal?.checked) &&
    //   selectedEdgeId &&
    //   selectedEdgeId?.fields &&
    //   selectedEdgeId?.fields.length > 0
    // ) {
    //   const arr = selectedEdgeId?.fields.map((item) => {
    //     return {
    //       ...item,
    //       value: {
    //         value: item.value,
    //       },
    //     };
    //   });
    //   const obj: any = { fields: arr };
    //   console.log(obj);
    //   setData(obj);
    //   setIsLoadingCardData(true);
    //   //getMinipasportLinks();
    // }
    if (selectedEdgeId !== null && selectedEdgeId !== '') {
      setIsLoadingCardData(true);
    }
  }, [selectedEdgeId]);

  useEffect(() => {
    if (selectedRoadPartId) geoGetCardDetail();
    setIsLoadingCardData(false);
  }, [selectedRoadPartId]);

  useEffect(() => {
    if (id_road) geoGetCardDetail();
    setIsLoadingCardData(false);
  }, [id_road]);

  const geoGetBridgeCardDetail = () => {
    setIsLoadingCardData(false);
    axios
      .get(`${skdfApiUrl}/api/v1/portal/map/mini-passport/${selectedBridgeId}`)
      .then((response) => {
        setIsShowAllList(true);
        setCurrentLists([]);
        setData(response.data);
        setIsLoadingCardData(true);
        console.log(response.data);
      })
      .catch((error) => {
        toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
        setIsShowAllList(false);
        setIsLoadingCardData(true);
      });
  };

  useEffect(() => {
    if (selectedBridgeId && selectedBridgeId !== null && (mapLayers?.lyr_bridges?.checked || mapLayers?.vec_lyr_bridges?.checked)) {
      geoGetBridgeCardDetail();
    }
  }, [selectedBridgeId]);

  useEffect(() => {
    if (roadworks5y && Object.keys(roadworks5y)?.length > 0 && roadworks5y?.fields?.length > 0 && mapLayers?.lyr_roadsworks_5y?.checked) {
      setIsLoadingCardData(true);
      setData(roadworks5y);
    }

    // setIsLoadingCardData(false);
  }, [roadworks5y]);
  const renderComponent = () => {
    if (
      roadworks5y &&
      Object.keys(roadworks5y)?.length > 0 &&
      roadworks5y?.fields?.length > 0 &&
      data &&
      data.fields &&
      data.fields?.length > 0
    ) {
      return <GeoMapCardRoadWork5Y data={data} />;
    }
    //Для графа
    else if (
      selectedEdgeId &&
      selectedEdgeId !== '' &&
      (mapLayers?.lyr_graf_federal?.checked || mapLayers?.lyr_graf_regional?.checked || mapLayers?.lyr_graf_municipal?.checked)
    ) {
      //   (selectedEdgeId &&
      //     selectedEdgeId?.fields &&
      //     selectedEdgeId?.fields.length > 0 &&
      //     data?.fields &&
      //     data.fields.length > 0 &&
      //     mapLayers?.lyr_graf_federal?.checked) ||
      //   mapLayers?.lyr_graf_regional?.checked ||
      //   mapLayers?.lyr_graf_municipal?.checked
      // )
      return (
        <></>
        // <GrafCard selectedEdgeId={selectedEdgeId} />
        // <Card.Header className="GeoMapCardDetail__header"></Card.Header>
        // <Card.Body className="GeoMapCardDetail__content_edge">
        //   {data.fields.map((item, index, array) => {
        //     if (item?.value?.value) {
        //       return (
        //         <div className="GeoMapCardDetail__item" key={item?.title + index}>
        //           <div className="GeoMapCardDetail__item__title">{item?.title}</div>
        //           <div style={{ whiteSpace: 'pre-line' }} className="GeoMapCardDetail__item__text">
        //             {item?.value?.value}
        //           </div>
        //         </div>
        //       );
        //     }
        //   })}
        // </Card.Body>
      );
    } else {
      return (
        <>
          <Card.Header className="GeoMapCardDetail__header">
            <div>
              <div className="GeoMapCardDetail__title">{data.fields?.[0]?.value?.value}</div>
              <div className="GeoMapCardDetail__subtitle mt-2 mb-4">
                {data.fields?.[1]?.value?.value && data.fields?.[1]?.value?.value?.[0]?.text
                  ? data.fields?.[1]?.value?.value?.[0]?.text
                  : data.fields?.[1]?.value?.value}
              </div>
              <div className="d-flex justify-content-between">
                {' '}
                <GeoCheckedFlag
                  //isChecked={true}
                  isChecked={selectedFeature.getProperties().is_checked}
                />
                <div className="GeoMapCardDetail__icon__bar">
                  {isPanoBtn && (
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 100, hide: 100 }}
                      overlay={(props) => (
                        <Tooltip id="panorama-tooltip" {...props}>
                          Панорама
                        </Tooltip>
                      )}
                    >
                      <div className="me-3 GeoMapCardDetail__icon__item">
                        {' '}
                        <GeoIcon
                          name="panorama"
                          iconType="panorama"
                          onClick={() => {
                            if (mapMode === 'panorama') {
                              dispatch(setMapMode('navigation'));
                            } else {
                              dispatch(setMapMode('panorama'));
                            }
                          }}
                        />
                      </div>
                    </OverlayTrigger>
                  )}

                  {isLidarBtn && (
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 100, hide: 100 }}
                      overlay={(props) => (
                        <Tooltip id="lidar-tooltip" {...props}>
                          Лидар
                        </Tooltip>
                      )}
                    >
                      <div className="me-3 GeoMapCardDetail__icon__item">
                        {' '}
                        <GeoIcon
                          name="lidar"
                          iconType="lidar"
                          onClick={() => {
                            if (mapMode === 'lidar') {
                              dispatch(setMapMode('navigation'));
                            } else {
                              dispatch(setMapMode('lidar'));
                            }
                          }}
                        />
                      </div>
                    </OverlayTrigger>
                  )}

                  {/* <div className="me-3 GeoMapCardDetail__icon__item">
                  {' '}
                  <GeoIcon name="dots-cloud" iconType="dots-cloud" />
                </div>
                <div className="me-3 GeoMapCardDetail__icon__item">
                  <GeoIcon name="lidar" iconType="lidar" />
                </div>
                  {/* <GeoIcon name="more_vertical" iconType="more_vertical" /> */}
                  <Dropdown drop="end">
                    <Dropdown.Toggle bsPrefix="p-0" className="GeoMapCardDetail__dropdown-toggle__btn" id="dropdown-menu-align-end">
                      <GeoIcon name="more_vertical" iconType="more_vertical" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="GeoMapCardDetail__dropdown-menu">
                      <Dropdown.Item
                        as="button"
                        className="GeoMapCardDetail__dropdown-menu-item"
                        onClick={() => dispatch(openPicket(true))}
                        eventKey="1"
                      >
                        <GeoIcon name="search" iconType="search" />
                        <span className="GeoMapCardDetail__dropdown-menu-item__text">Поиск пикета дороги</span>
                      </Dropdown.Item>
                      {/* <Dropdown.Item as="button" className="GeoMapCardDetail__dropdown-menu-item" eventKey="2">
                        <GeoIcon name="edit" iconType="edit" />
                        <span className="GeoMapCardDetail__dropdown-menu-item__text">Редактировать</span>
                      </Dropdown.Item> */}
                      {/* <Dropdown.Item as="button" className="GeoMapCardDetail__dropdown-menu-item" eventKey="3">
                        <a href={`roads/${id_road}/relations`} className="GeoMapCardDetail__linktexticon">
                          <GeoIcon name="network" iconType="network" />
                          <span className="GeoMapCardDetail__dropdown-menu-item__text">Связи</span>
                        </a>
                      </Dropdown.Item> */}
                      {/* <hr className="dropdown-divider mx-3" /> */}
                      {userAuth && userAuth !== 'anonymous' && Object.keys(userAuth).length > 0 && userAuth?.profile?.userId !== '' && (
                        <Dropdown.Item
                          as="button"
                          className="GeoMapCardDetail__dropdown-menu-item"
                          onClick={() => setIsEdit(true)}
                          eventKey="4"
                        >
                          <GeoIcon name="plus" iconType="plus" onClick={() => setIsEdit(true)} />
                          <span className="GeoMapCardDetail__dropdown-menu-item__text">Добавить участок</span>
                        </Dropdown.Item>
                      )}
                      {/* <Dropdown.Item as="button" className="GeoMapCardDetail__dropdown-menu-item" eventKey="5">
                        <GeoIcon name="plus" iconType="plus" />
                        <span className="GeoMapCardDetail__dropdown-menu-item__text">Добавить мероприятие</span>
                      </Dropdown.Item> */}
                      <hr className="dropdown-divider mx-3" />
                      {/* <Dropdown.Item
                      as="button"
                      className="GeoMapCardDetail__dropdown-menu-item"
                      onClick={() => setIsGallery(true)}
                      eventKey="6"
                    >
                      <GeoIcon name="gallery" iconType="gallery" />
                      <span className="GeoMapCardDetail__dropdown-menu-item__text">Фотографии работ</span>
                    </Dropdown.Item> */}
                      {/* <Dropdown.Item
                        as="button"
                        className="GeoMapCardDetail__dropdown-menu-item"
                        onClick={() => setIsDiagnosticsModal(true)}
                        eventKey="7"
                      >
                        <GeoIcon name="tool" iconType="tool" />
                        <span className="GeoMapCardDetail__dropdown-menu-item__text">Данные диагностики</span>
                      </Dropdown.Item>
                      <hr className="dropdown-divider mx-3" /> */}
                      {/* <Dropdown.Item
                        as="button"
                        className="GeoMapCardDetail__dropdown-menu-item"
                        onClick={async () => {
                          setIsDownloadingFlatness(true);
                          const response = await getFlatnessFile();
                          setIsDownloadingFlatness(false);
                        }}
                        eventKey="8"
                      >
                        <GeoIcon name="download" iconType="download" />
                        <span className="GeoMapCardDetail__dropdown-menu-item__text">Скачать данные о ровности</span>
                      </Dropdown.Item> */}

                      <Dropdown.Item
                        as="button"
                        className="GeoMapCardDetail__dropdown-menu-item"
                        onClick={async () => {
                          setIsGeoJsonLoading(true);
                          const response = await getGeoJson();
                          setIsGeoJsonLoading(false);
                        }}
                        eventKey="9"
                      >
                        <GeoIcon name="route_3" iconType="route_3" />

                        <span className="GeoMapCardDetail__dropdown-menu-item__text">Скачать геометрию дороги</span>
                      </Dropdown.Item>
                      {userAuth && userAuth !== 'anonymous' && Object.keys(userAuth).length > 0 && userAuth?.profile?.userId !== '' && (
                        <Dropdown.Item
                          as="button"
                          className="GeoMapCardDetail__dropdown-menu-item"
                          //onClick={() => setIsDiagnosticControlModal(true)}
                          onClick={() => dispatch(setMapMode('diag'))}
                          eventKey="10"
                        >
                          <GeoIcon name="cog" iconType="cog" />

                          <span className="GeoMapCardDetail__dropdown-menu-item__text">Управление диагностикой</span>
                        </Dropdown.Item>
                      )}
                      {userAuth && userAuth !== 'anonymous' && Object.keys(userAuth).length > 0 && userAuth?.profile?.userId !== '' && (
                        <Dropdown.Item
                          as="button"
                          className="GeoMapCardDetail__dropdown-menu-item"
                          onClick={() => {
                            const objType = id_road ? 'road' : selectedBridgeId ? 'bridge' : selectedRoadPartId ? 'roadpart' : null;
                            if (objType === 'road') {
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
                                .forEach((layer: any) => {
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
                                .forEach((layer: any) => {
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
                              getRoadName(id_road);
                            } else if (objType === 'bridge') {
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
                              setSelectedBridgeId(selectedBridgeId);
                              selectedBridgeIdRef.current = selectedBridgeId;
                              const view = map.getView();
                              view.setMinZoom(11);
                              view.setMaxZoom(18);
                              dispatch(setDrawMode('draw'));
                            } else if (objType === 'roadpart') {
                              axios
                                .post(`${pgApiUrl}/rpc/get_road_parts`, { p_road_id: selectedRoadPartId }, querySchemaHeader)
                                .then((response) => {
                                  if (response?.data && response?.data?.length > 0) {
                                    const roadid = response?.data?.[0]?.road_id;
                                    getRoadName(roadid);
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
                                      .forEach((layer: any) => {
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
                                      .forEach((layer: any) => {
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

                                    dispatch(setSelectedRoadPart(response?.data?.[0]));
                                    dispatch(setGeomLength(0));
                                    const view = map.getView();
                                    view.setMinZoom(11);
                                    view.setMaxZoom(18);
                                    dispatch(setDrawMode('draw'));
                                  }
                                })
                                .catch((error) => {
                                  console.error(`Ошибка при переходе в режим редактирования геометрии участка! ${error}`);
                                });
                            }
                          }}
                          eventKey="10"
                        >
                          <GeoIcon name="draw" iconType="draw" />

                          <span className="GeoMapCardDetail__dropdown-menu-item__text">Редактировать геометрию</span>
                        </Dropdown.Item>
                      )}
                      {/* <Dropdown.Item
                        as="button"
                        className="GeoMapCardDetail__dropdown-menu-item"
                        onClick={() => setIsDiagnosticControlModal(true)}
                        // onClick={() => dispatch(setMapMode('diag'))}
                        eventKey="10"
                      >
                        <GeoIcon name="tool" iconType="tool" />

                        <span className="GeoMapCardDetail__dropdown-menu-item__text">Управление диагностикой (lidar)</span>
                      </Dropdown.Item> */}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="GeoMapCardDetail__content">
            {isPicket && (
              <GeoPicketRoadSearch
                valueRange={valueRangePicket}
                setValueRange={setValueRangePicket}
                onShowPicket={searchAndAddPicketFeature}
                onRemovePicket={removePicketFeature}
              />
            )}
            <div className="GeoMapCardDetail__item">
              <div className="GeoMapCardDetail__item__title">
                {selectedBridgeId !== null ? 'Состояние' : selectedRoadPartId ? 'Протяженность, км' : 'Владелец'}
              </div>
              {/* <div> */} {/* <div className="GeoMapCardDetail__logo__img"></div> */}
              <div className="GeoMapCardDetail__logo__text">{checkLengthValue(data.fields?.[2], isShowAllList)}</div>
              {/* </div> */}
            </div>
            {data.fields.map((item, index, array) => {
              if (index > 2 && item.code !== 'CRITERION' && item?.value?.value) {
                return dataClassification[item?.code] !== 'boolean' ? (
                  <div
                    className="GeoMapCardDetail__item"
                    key={
                      item?.title + index //item?.value?.value
                    }
                  >
                    <div className="GeoMapCardDetail__item__title">{item?.title}</div>
                    <div style={{ whiteSpace: 'pre-line' }} className="GeoMapCardDetail__item__text">
                      {checkLengthValue(item, isShowAllList)}
                    </div>
                  </div>
                ) : (
                  <div
                    className="GeoMapCardDetail__item"
                    key={
                      item?.title + index //item?.value?.value
                    }
                  >
                    <div className="GeoMapCardDetail__item__title">{item?.title}</div>
                    <div style={{ whiteSpace: 'pre-line' }} className="GeoMapCardDetail__item__text">
                      {item?.value?.value == 1 || item?.value?.value === 'Y' ? 'Да' : 'Нет'}
                    </div>
                  </div>
                );
              }
            })}
          </Card.Body>
          <Card.Footer className="GeoMapCardDetail__footer">
            <Button
              onClick={() => {
                routerRest.history.push({
                  pathname: selectedBridgeId
                    ? `/bridges/${selectedBridgeId}`
                    : id_road
                    ? `/roads/${id_road}`
                    : selectedRoadPartId
                    ? `/roadOnBalance/${selectedRoadPartId}`
                    : '/map',
                  state: undefined,
                });
              }}
              variant="skdf-primary"
              className="d-inline-flex justify-content-center w-100 align-items-center mx-4"
            >
              {/* <a
                href={
                  selectedBridgeId
                    ? `/bridges/${selectedBridgeId}`
                    : id_road
                    ? `/roads/${id_road}`
                    : selectedRoadPartId
                    ? `/roadOnBalance/${selectedRoadPartId}`
                    : '/map'
                }
                className="GeoMapCardDetail__btn__link__content"
              > */}
              Подробная информация
              {/* </a> */}
              {/* <Link to={`roads/${idRoad}`}>Подробная информация</Link> */}
            </Button>
          </Card.Footer>
        </>
      );
    }
  };

  return (
    <>
      {' '}
      {isGalleryOpen ? <GeoGalleryModal open={setIsGalleryOpen} isOpen={isGalleryOpen} data={galleryData} /> : <></>}
      <GeoIconButton
        iconType="close"
        handleClick={() => {
          setIsOpenCardDetail(!isOpenCardDetail);
          updateMapSize();
          removePicketFeature();
          removeRoadworks5yFeature();
        }}
        classes="GeoMapCardDetail__close__btn"
      />
      {/* <GeoIconButton
        iconType="cog"
        handleClick={() => {
          dispatch(setMapMode('diag'));
        }}
        classes="GeoMapCardDetail__close__btn mt-5"
      /> */}
      {isDiagnosticControlModal && (
        <GeoDiagnosticControlModal
          idRoad={id_road}
          idPart={selectedFeature?.road_part_id}
          isOpen={isDiagnosticControlModal}
          setIsOpen={setIsDiagnosticControlModal}
        />
      )}
      <Card className="skdf-shadow-down-16dp GeoMapCardDetail__card">
        {data && data?.fields && data?.fields.length > 0 ? (
          <>
            {isEdit ? (
              <>
                <Card.Body className="GeoMapCardDetail__content__edit px-4 pt-2">
                  <div
                    className="ml-4 my-2"
                    onClick={() => {
                      setIsEdit(false);
                      setEditingType('');
                    }}
                  >
                    <GeoIcon name="arrow_left_full" iconType="arrow_left_full" />
                  </div>
                  <GeoSingleSelect
                    name="road_type"
                    label="Выберите тип"
                    placeholder="Выберите тип"
                    onChange={(e: any) => {
                      setEditingType(e.value);
                    }}
                    options={options}
                  />
                  {editingType === 'Участки, входящие в опорную сеть' ? (
                    <>
                      <GeoMapCardDetailNetwork
                        open={setIsEdit}
                        map={map}
                        setEditingType={setEditingType}
                        idRoad={id_road}
                        idPart={selectedFeature?.road_part_id}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  {editingType === 'Мостовые сооружения' ? (
                    <>
                      <form className="mt-3">
                        <div className="form-check">
                          <input
                            id="objecttyperadio1"
                            className="form-check-input"
                            name="objectType"
                            type="radio"
                            checked={objectType === 'linear'}
                            onChange={() => {
                              setObjectType('linear');
                            }}
                          />{' '}
                          <label htmlFor="objecttyperadio1" className="form-check-label">
                            Линейный объект
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            id="objecttyperadio2"
                            className="form-check-input"
                            name="objectType"
                            type="radio"
                            onChange={() => {
                              setObjectType('point');
                            }}
                          />{' '}
                          <label htmlFor="objecttyperadio2" className="form-check-label">
                            Точечный объект
                          </label>
                        </div>
                      </form>

                      <GeoMapCardDetailBridge
                        objectType={objectType}
                        setEditingType={setEditingType}
                        idPart={selectedFeature?.road_part_id}
                        open={setIsEdit}
                        map={map}
                        idRoad={id_road}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </Card.Body>
              </>
            ) : (
              <>
                {isLoadingCardData ? (
                  renderComponent()
                ) : (
                  <div className="GeoMapCardDetail__loader d-flex justify-content-center align-items-center">
                    <GeoLoader />
                  </div>
                )}
              </>
            )}
          </>
        ) : selectedEdgeId !== null && selectedEdgeId !== '' ? (
          <>
            <GrafCard selectedEdgeId={selectedEdgeId} />
          </>
        ) : (
          <div className="GeoMapCardDetail__loader d-flex justify-content-center align-items-center">
            {/* <GeoLoader /> */}
            Данные отсутствуют
          </div>
        )}
      </Card>
    </>
  );
};

export default GeoMapCardDetail;
