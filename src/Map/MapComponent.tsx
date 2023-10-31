import React, { useState, useEffect, useRef, FC } from 'react';
import OSM, { ATTRIBUTION } from 'ol/source/OSM';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { get as getProjection } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import axios from 'axios';
import GeoJSON, { GeoJSONGeometry } from 'ol/format/GeoJSON';
import { Geolocation, Map } from 'ol';
import TileWMS from 'ol/source/TileWMS';
import MapLayersButton from './MapLayersButton';
import { extend, getTopLeft, getWidth } from 'ol/extent';
import LayerGroup from 'ol/layer/Group';
import { wfsHoverLayers, wfsLayers, wmsTileLayers, vectorLayers, wmsRegionalSkeletonLayers } from './layers.mock';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import GeoIconButton from '../components/GeoIconButton';
import GeoMapCardDetail from '../components/GeoMapCardDetail';
import GeoSideBar from '../components/GeoSideBar';
import { MapComponentTypes } from './MapComponent.types';
import GeoFilters from '../components/GeoFilters';
import GeoZoomButton from '../components/GeoZoomButton/GeoZoomButton';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import MVT from 'ol/format/MVT';
import { Fill, Stroke, Style, Text, Circle, Icon, RegularShape } from 'ol/style';
import Select from 'ol/interaction/Select';
import { applyStyle } from 'ol-mapbox-style';
import Overlay from 'ol/Overlay';
import { GeoIcon, GeoIconMap } from '../components/GeoIcon/GeoIcon';
import { toast } from 'react-toastify';
import saveAs from 'file-saver';
import { Feature } from 'ol';
import { flatnessColumns } from './flatnessColumns.mock';
import * as XLSX from 'xlsx';
import GeoMapSettings from '../components/GeoMapSettings/GeoMapSettings';
import { altKeyOnly, click, shiftKeyOnly, singleClick } from 'ol/events/condition';
import GeoMapDiagnosticsTable from '../components/GeoMapDiagnosticsTable/GeoMapDiagnosticsTable';
import { useAppDispatch, useAppSelector } from '../config/store';
import {
  commandSchemaHeader,
  geoserverApiUrl,
  gisapiSchemaHeader,
  gisSchemaHeader,
  hwmSchemaHeader,
  pgApiUrl,
  pgGraphApiUrl,
  publicSchemaHeader,
  querySchemaHeader,
} from '../config/constants';
import * as ReactDOMServer from 'react-dom/server';
import * as bs from 'bootstrap/dist/js/bootstrap.bundle.js';
import { defaults as defaultInteractions, Draw } from 'ol/interaction.js';
import CircleStyle from 'ol/style/Circle';
import { LineString, Point } from 'ol/geom';
import GeoSpinnerLine from '../components/GeoSpinnerLine/GeoSpinnerLine';
import { setUserAuth } from '../reducers/userAuth.reducer';
import GeoEditGeom from '../components/GeoEditGeom/GeoEditGeom';
import { setEditObjectMode, setMapMode } from '../reducers/map.reducer';
import { setDrawMode, setGeomLength, setSelectedRoad, setSelectedRoadPart } from '../reducers/mapDraw.reducer';
import { getLength } from 'ol/sphere';
import GeoEditGeomBridge from '../components/GeoEditGeomBridge/GeoEditGeomBridge';
import IconMessage from '../assets/message-icon.png';
import GeoLidarComponent from '../components/GeoLidarComponent/GeoLidarComponent';
import GeoMapCoordSet from '../components/GeoMapCoordSet/GeoMapCoordSet';
import GrafCard from '../components/GeoMapCardDetail/GrafCard/GrafCard';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import GeoDiagInterface from '../components/GeoDiagInterface/GeoDiagInterface';
import { WMTS } from 'ol/source';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {
  bridgeSources,
  bridgeVectorSourcesByZoom,
  invisibleBridgeSourcesByZoom,
  invisibleRoadSourcesByZoom,
  layerVectorSource,
  roadSources,
  roadVectorSource,
  roadVectorSourcesByZoom,
} from './MapVectorSources';
import GeoPanoramaComponent from '../components/GeoPanoramaComponent/GeoPanoramaComponent';
import GeoRegionalSkeleton from '../components/GeoRegionalSkeleton/GeoRegionalSkeleton';
// import { setMapState } from '../reducers/map.reducer';
// import * as annoLightStyle from './rosreestrStyles/vt-anno-light.json';
// import * as annoDarkStyle from './rosreestrStyles/vt-anno-dark.json';

const styleGeomDraw = new Style({
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

// Стиль сегмента
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

// Стиль измерение под курсором при редактировании линейной геометрии
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

const geoLocationlabelStyle = new Style({
  text: new Text({
    font: '14px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.5)',
    }),
    padding: [7, 7, 7, 7],
    textBaseline: 'bottom',
    offsetY: -15,
  }),
  image: new RegularShape({
    radius: 8,
    points: 3,
    angle: Math.PI,
    displacement: [0, 10],
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.5)',
    }),
  }),
});

const coordPositionStyle = [
  new Style({
    image: new Circle({
      fill: new Fill({
        color: 'rgba(67, 120, 221, 0.3)',
      }),
      radius: 38,
    }),
  }),
  new Style({
    image: new Circle({
      fill: new Fill({
        color: 'rgba(67, 120, 221, 1)',
      }),
      stroke: new Stroke({
        width: 2,
        color: 'rgba(255, 255, 255, 1)',
      }),
      radius: 12,
    }),
  }),
];

const geoLocationStyle = [
  new Style({
    image: new Circle({
      fill: new Fill({
        color: 'rgba(67, 120, 221, 0.3)',
      }),
      radius: 48,
    }),
  }),
  new Style({
    image: new Circle({
      fill: new Fill({
        color: 'rgba(67, 120, 221, 1)',
      }),
      stroke: new Stroke({
        width: 2,
        color: 'rgba(255, 255, 255, 1)',
      }),
      radius: 14,
    }),
  }),
];

const formatLength = (line) => {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' км';
  } else {
    output = Math.round(length * 100) / 100 / 1000 + ' м';
  }
  return output;
};

const rulerStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2,
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

const rulerLabelStyle = new Style({
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

const scaleControl = new ScaleLine({
  units: 'metric',
  bar: false,
  steps: 4,
  text: true,
  // minWidth: 100,
  maxWidth: 87,
});

// ---------Map iteraction

let select = null;

const selected = new Style({
  fill: new Fill({
    color: 'rgba(22,198,224, 1)',
  }),
  stroke: new Stroke({
    color: 'rgba(0,255,246, 1)',
    width: 27,
  }),
});

const selectedItems = new Select({
  style: new Style({
    fill: new Fill({
      color: '#16c6e0',
    }),
    stroke: new Stroke({
      color: '#16c6e0',
      width: 30,
    }),
  }),
  layers: (layer) => {
    const lname = layer.get('name');
    // return wfsLayers.map((item) => item.name).includes(lname);
    return true;
  },
  multi: true,
});

type MapModes = 'navigation' | 'editgeom' | 'sendmessage';
type BaseMap = 'osm' | 'satellite' | 'hybrid' | 'rosreestr';

const MapComponent: FC<MapComponentTypes> = ({ features, routerRest, userAuth, panoramaUrl, lidarUrl }) => {
  const [map, setMap] = useState<Map | undefined>();
  // const [mapMode, setMapMode] = useState<string>('navigation');
  const [featuresLayer, setFeaturesLayer]: any = useState();
  const [currentBaseMap, setCurrentBaseMap] = useState<BaseMap>('osm'); //('osm');
  const [mapLayers, setMapLayers] = useState<any>({ lyr_road_by_value: { checked: true, name: 'lyr_road_by_value' } });
  const [isOpenCardDetail, setIsOpenCardDetail] = useState<boolean>(false);
  const [collapseLayersControl, setCollapseLayerControl] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(true);
  const [selectedRoadId, setSelectedRoadId] = useState<number>(null);
  const selectedRoadIdRef: any = useRef();
  selectedRoadIdRef.current = selectedRoadId;

  const [selectedBridgeId, setSelectedBridgeId] = useState<number>(null);
  const selectedBridgeIdRef: any = useRef();
  selectedBridgeIdRef.current = selectedBridgeId;

  const [selectedRoadPartId, setSelectedRoadPartId] = useState<number>(null);
  const selectedRoadPartIdRef: any = useRef();
  selectedRoadPartIdRef.current = selectedRoadPartId;

  const [hoverContent, setHoverContent] = useState<any>();
  const [hoverIdentify, setHoverIdentify] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<number[]>([4179071.0049917055, 7494122.839563135]);
  const [selectedFeature, setSelectedFeature] = useState<Feature>();
  const [isSearchingFeature, setIsSearchingFeature] = useState<boolean>(false);
  const [isMapSettingsOpen, setIsMapSettingsOpen] = useState<boolean>(false);
  const [selectedMapSettings, setSelectedMapSettings] = useState<any>({
    isHoverControl: { checked: true, name: 'isHoverControl' },
    isWFSLayers: { checked: true, name: 'isWFSLayers' },
    isWFSBridgeLayer: { checked: true, name: 'isWFSBridgeLayer' },
    isAnnoLayers: { checked: true, name: 'isAnnoLayers' },
  });
  const [isResetBtnActive, setIsResetBtnActive] = useState<boolean>(true);
  const [isDiagnosticsModal, setIsDiagnosticsModal] = useState<boolean>(false);
  const [selectedBackBoneId, setSelectedBackBoneId] = useState<any>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<any>(null);
  const [isLoadingAdditionalMapData, setIsLoadingAdditionalMapData] = useState<boolean>(false);

  const isLoadingAdditionalMapDataRef = useRef<any>();
  isLoadingAdditionalMapDataRef.current = isLoadingAdditionalMapData;

  const [isFetchingDetailData, setIsFetchingDetailData] = useState<boolean>(false);
  const [currentGeolocation, setCurrentGeolocation] = useState<any>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const picket = useAppSelector((state) => state.picket.picket);
  const [roadworks5y, setRoadworks5y] = useState<any>(null);

  const roadworks5yRef: any = useRef();
  roadworks5yRef.current = roadworks5y;

  const [isCreateMessage, setIsCreateMessage] = useState<boolean>(false);
  const [isEditGeom, setIsEditGeom] = useState<boolean>(false);
  const [isGeoMapCoordOpen, setIsGeoMapCoordOpen] = useState<boolean>(false);
  // const [isMapOpen, setIsMapOpen] = useState<boolean>(true);
  const mapElement: any = useRef();
  const mapRef: any = useRef();
  mapRef.current = map;
  // const popupRef: any = useRef();

  const dispatch = useAppDispatch();
  const roadValuesFilter = useAppSelector((state) => state.roadvalues.cql);
  const regionsFilter = useAppSelector((state) => state.region.cql);
  const citiesFilter = useAppSelector((state) => state.city.cql);
  const townsFilter = useAppSelector((state) => state.town.cql);
  const routesFilter = useAppSelector((state) => state.route.cql);
  const districtsFilter = useAppSelector((state) => state.district.cql);
  const planningStructuresFilter = useAppSelector((state) => state.planingStructure.cql);
  const agglomerationsFilter = useAppSelector((state) => state.agglomeration.cql);
  const categoriesFilter = useAppSelector((state) => state.category.cql);
  const roadworks5yFilter = useAppSelector((state) => state.roadworks5y.cql);
  const roadClassFilter = useAppSelector((state) => state.roadclass.cql);
  const workTypeFilter = useAppSelector((state) => state.worktype.cql);
  const roadwayWidthFilter = useAppSelector((state) => state.roadwaywidth.cql);
  const trafficFilter = useAppSelector((state) => state.traffic.cql);
  const skeletonFilter = useAppSelector((state) => state.skeleton.cql);
  const normFilter = useAppSelector((state) => state.norm.cql);
  const dtpFilter = useAppSelector((state) => state.dtp.cql);
  const loadingFilter = useAppSelector((state) => state.loading.cql);
  const coordinates = useAppSelector((state) => state.coordinate.coordinates);
  const presetFilters = useAppSelector((state) => state.preset.presetFilters);
  const selectedPreset = useAppSelector((state) => state.preset.selectedPreset);

  const mapModeRef = useRef<any>();
  const mapMode = useAppSelector((state) => state.mapstate.mapMode);
  mapModeRef.current = mapMode;
  const editObjectModeRef = useRef<any>();
  const editObjectMode = useAppSelector((state) => state.mapstate.editObjectMode);
  editObjectModeRef.current = editObjectMode;
  const rulerDrawRef = useRef<any>();
  const rulerSourceRef = useRef<any>();
  const geomLength = useAppSelector((state) => state.mapdraw.geomLength);
  const bridgeGeomType = useAppSelector((state) => state.mapstate.bridgeGeomType);
  const lastFeatureId = useAppSelector((state) => state.mapdraw.lastFeatureId);
  const bridgeGeomTypeRef = useRef<any>();
  bridgeGeomTypeRef.current = bridgeGeomType;

  const lastFeatureIdRef = useRef<any>();
  lastFeatureIdRef.current = lastFeatureId;
  const geomLengthRef = useRef<any>();
  geomLengthRef.current = geomLength;
  const geolocationLabelRegionRef = useRef<any>();

  const coordLocation = useAppSelector((state) => state.mapstate.locationCoord);
  const coordLocationDescr = useAppSelector((state) => state.mapstate.locationDescription);
  const coordLocationRef = useRef<any>();
  const coordLocationDescrRef = useRef<any>();
  coordLocationRef.current = coordLocation;
  coordLocationDescrRef.current = coordLocationDescr;

  const curLayersRef = useRef<any>();
  curLayersRef.current = mapLayers;

  const segmentStyleRef = useRef<any>();
  segmentStyleRef.current = [segmentStyle];

  const [isRegionalSkeletonModal, setIsRegionalSkeletonModal] = useState<boolean>(false);

  console.info('Selected road: ', selectedRoadId);

  // useEffect(() => {
  //   document.addEventListener('keydown', (e) => {
  //     debugger;
  //     e.preventDefault();
  //     if (e.shiftKey && e.code === 'KeyS') {
  //       setIsMapSettingsOpen(true);
  //     }
  //   });
  // });

  useEffect(() => {
    if (userAuth && userAuth !== null) dispatch(setUserAuth(userAuth));
  }, [userAuth]);

  const geolocation = new Geolocation({
    trackingOptions: {
      enableHighAccuracy: true,
    },
    projection: 'EPSG:3857',
  });

  // Включение/выключение слоев wfs дорог и подписей через настройки
  useEffect(() => {
    if (map) {
      const wfsLayerGroupSwitcher = (groupname, type) => {
        try {
          const layerGroup: any = map
            .getLayers()
            .getArray()
            .filter((item, index, array) => item.get('name') === groupname)?.[0];
          const currentVisibleStatus = layerGroup.getVisible();
          if (currentVisibleStatus !== selectedMapSettings?.[type]?.checked) {
            layerGroup.setVisible(selectedMapSettings?.[type]?.checked);
          }
        } catch (error) {
          console.error(`Ошибка переключения видимости wfs слоя группы слоев ${groupname}:`, error);
        }
      };
      if (selectedMapSettings?.isWFSLayers) wfsLayerGroupSwitcher('layers-wfs', 'isWFSLayers');
      if (selectedMapSettings?.isWFSBridgeLayer) wfsLayerGroupSwitcher('lyr_bridge_point_edit', 'isWFSBridgeLayer');
      if (selectedMapSettings?.isAnnoLayers) wfsLayerGroupSwitcher('labels', 'isAnnoLayers');
    }
  }, [selectedMapSettings]);

  useEffect(() => {
    if (coordinates && map?.isRendered()) {
      console.log(`Coordinates has changed`);
      map.getView().setCenter([coordinates?.lon, coordinates?.lat]);
      map.getView().setZoom(coordinates?.zoom);
    }
  }, [coordinates]);

  useEffect(() => {
    const layersKeysArr = Object.keys(mapLayers);
    if (map) {
      // Сброс слоев
      if (mapLayers && layersKeysArr.length === 1 && mapLayers?.lyr_road_by_value?.checked) {
        const wmsGroup: any = map
          .getLayers()
          .getArray()
          .filter((item, index, array) => item.get('name') === 'layers-wms')?.[0];
        const wmsLayers = wmsGroup
          .getLayers()
          .getArray()
          .forEach((layer) => {
            const lname = layer.get('name');
            if (lname !== 'lyr_road_by_value') {
              layer.setVisible(false);
            }
          });
      } else {
        // Фильтрация групповых слоев
        layersKeysArr.forEach((item) => {
          if (mapLayers?.[item]?.checked && mapLayers?.[item]?.children) {
            const childrenArr = Object.values(mapLayers?.[item]?.children);
            let cqlFilterStr = '';
            if (mapLayers?.[item]?.indeterminate) {
              childrenArr.forEach((child: any) => {
                if (child.checked) {
                  cqlFilterStr += `${child.filterValue},`;
                }
              });
            }
            let cqlParamStr = '';
            if (mapLayers?.[item]?.name === 'lyr_road_conditions_road_normative_condition') {
              cqlParamStr = mapLayers?.[item]?.filterField + ` ${cqlFilterStr !== '' ? cqlFilterStr.slice(0, -1) : cqlFilterStr}`;
            } else {
              cqlParamStr = mapLayers?.[item]?.filterField + ` in (${cqlFilterStr !== '' ? cqlFilterStr.slice(0, -1) : cqlFilterStr})`;
            }
            console.log('Filter str group layer: ', cqlParamStr);
            const wmsGroup: any = map
              .getLayers()
              .getArray()
              .filter((item, index, array) => item.get('name') === 'layers-wms')?.[0];

            const wmsLayers = wmsGroup
              .getLayers()
              .getArray()
              .forEach((layer) => {
                if (
                  layer.get('name') &&
                  layer.getVisible() &&
                  mapLayers?.[item]?.name === layer.get('name') &&
                  layer instanceof TileLayer
                ) {
                  const source = layer.getSource();
                  const params = source.getParams();

                  if (cqlFilterStr !== '') {
                    params.CQL_FILTER = cqlParamStr;
                  } else {
                    delete params.CQL_FILTER;
                  }
                  source.updateParams(params);
                }
              });
          } else if (
            mapLayers?.[item]?.checked &&
            mapLayers?.[item]?.type === 'range' &&
            mapLayers?.[item]?.value &&
            mapLayers?.[item]?.value.length > 0
          ) {
            let cqlParamStr = '';
            if (mapLayers?.[item]?.name === 'lyr_roadworks_works') {
              cqlParamStr = `(NOT (max_deadline < ${mapLayers?.[item]?.value?.[0]} OR min_deadline > ${mapLayers?.[item]?.value?.[1]}))`;
            } else {
              cqlParamStr =
                mapLayers?.[item]?.filterField +
                ` >= ${mapLayers?.[item]?.value?.[0]} AND ${mapLayers?.[item]?.filterField} <= ${mapLayers?.[item]?.value?.[1]}`;
            }

            console.log('Filter str range layer: ', cqlParamStr);
            const wmsGroup: any = map
              .getLayers()
              .getArray()
              .filter((item, index, array) => item.get('name') === 'layers-wms')?.[0];

            const wmsLayers = wmsGroup
              .getLayers()
              .getArray()
              .forEach((layer) => {
                if (
                  layer.get('name') &&
                  layer.getVisible() &&
                  mapLayers?.[item]?.name === layer.get('name') &&
                  layer instanceof TileLayer
                ) {
                  const source = layer.getSource();
                  const params = source.getParams();

                  if (cqlParamStr !== '') {
                    params.CQL_FILTER = cqlParamStr;
                  } else {
                    delete params.CQL_FILTER;
                  }
                  source.updateParams(params);
                }
              });
          }
        });
      }
    }
  }, [mapLayers]);

  useEffect(() => {
    if (mapLayers && Object.keys(mapLayers).length > 0 && presetFilters && presetFilters.length > 0) {
      const wmsGroup: any = map
        .getLayers()
        .getArray()
        .filter((item, index, array) => item.get('name') === 'layers-wms')?.[0];
      const wmsLayers = wmsGroup
        .getLayers()
        .getArray()
        .forEach((layer) => {
          const layerName = layer.get('name');
          if (mapLayers?.[layerName]) {
            layer.setVisible(mapLayers?.[layerName]?.checked);
          } else {
            layer.setVisible(false);
          }
        });
    }
  }, [mapLayers, presetFilters]);

  useEffect(() => {
    if (map?.isRendered()) {
      console.log(`Filters has changed`);
      const wmsGroup: any = map
        .getLayers()
        .getArray()
        .filter((item, index, array) => item.get('name') === 'layers-wms')?.[0];
      // let filterByRoad = '';
      // let filterByRoadWorks = '';
      const wmsLayers = wmsGroup
        .getLayers()
        .getArray()
        .forEach((layer) => {
          if (
            layer.get('name').includes('lyr_road') &&
            layer instanceof TileLayer // && layer.getVisible()
          ) {
            const source = layer.getSource();
            const params = source.getParams();
            let filter = '';
            if (
              layer.get('name') === 'lyr_roadsworks_5y' ||
              layer.get('name') === 'lyr_roadworks_works' // && layer.getVisible()
            ) {
              if (workTypeFilter !== '(1=1)') filter += workTypeFilter + 'AND';
            }

            if (routesFilter !== '(1=1)') filter += routesFilter + 'AND';
            if (roadValuesFilter !== '(1=1)') filter += roadValuesFilter + 'AND';
            if (regionsFilter !== '(1=1)') filter += regionsFilter + 'AND';
            if (citiesFilter !== '(1=1)') filter += citiesFilter + 'AND';
            if (districtsFilter !== '(1=1)') filter += districtsFilter + 'AND';
            if (townsFilter !== '(1=1)') filter += townsFilter + 'AND';
            if (planningStructuresFilter !== '(1=1)') filter += planningStructuresFilter + 'AND';
            if (agglomerationsFilter !== '(1=1)') filter += agglomerationsFilter + 'AND';
            if (categoriesFilter !== '(1=1)') filter += categoriesFilter + 'AND';
            if (roadClassFilter !== '(1=1)') filter += roadClassFilter + 'AND';
            if (roadwayWidthFilter !== '(1=1)') filter += roadwayWidthFilter + 'AND';
            if (trafficFilter !== '(1=1)') filter += trafficFilter + 'AND';
            if (skeletonFilter !== '(1=1)') filter += skeletonFilter + 'AND';
            if (normFilter !== '(1=1)') filter += normFilter + 'AND';
            if (loadingFilter !== '(1=1)') filter += loadingFilter + 'AND';
            if (dtpFilter !== '(1=1)') filter += dtpFilter + 'AND';

            if (filter !== '') {
              filter = filter.slice(0, -3);
              console.log(`Filtering layer.name = ${layer.get('name')} with cql = ${filter}`);
              params.CQL_FILTER = filter;
              setIsResetBtnActive(false);
            } else {
              setIsResetBtnActive(true);
              delete params.CQL_FILTER;
            }

            source.updateParams(params);
          }

          // if (
          //   layer.get('name') === 'lyr_roadsworks_5y' ||
          //   layer.get('name') === 'lyr_roadworks_works' //&& layer.getVisible()
          // ) {
          //   debugger;
          //   const source = layer.getSource();
          //   const params = source.getParams();

          //   //let filter = '';
          //   if (workTypeFilter !== '(1=1)') filterByRoadWorks += workTypeFilter + 'AND';
          //   if (filterByRoadWorks !== '') {
          //     filterByRoadWorks = filterByRoadWorks.slice(0, -3);
          //     console.log(`Filtering layer.name = ${layer.get('name')} with cql = ${filterByRoadWorks}`);
          //     params.CQL_FILTER = filterByRoadWorks;
          //     // setIsResetBtnActive(false);
          //   } else {
          //     // setIsResetBtnActive(true);
          //     delete params.CQL_FILTER;
          //   }

          //   source.updateParams(params);
          // }

          // if (
          //   layer.get('name').includes('lyr_roadsworks') //&& layer.getVisible()
          // ) {
          //   const source = layer.getSource();
          //   const params = source.getParams();
          //   let filter = '';
          //   if (roadworks5yFilter !== '(1=1)') filter += roadworks5yFilter + 'AND';
          //   filt += filter;
          //   if (filter !== '') {
          //     filter = filter.slice(0, -3);
          //     debugger;
          //     console.log(`Filtering layer.name = ${layer.get('name')} with cql = ${filter}`);
          //     params.CQL_FILTER = filter;
          //     // setIsResetBtnActive(false);
          //   } else {
          //     // setIsResetBtnActive(true);
          //     delete params.CQL_FILTER;
          //   }

          //   source.updateParams(params);
          //   map.updateSize();
          // }
        });

      // if (filterByRoad !== '' || filterByRoadWorks !== '') {
      //   debugger;
      //   setIsResetBtnActive(false);
      // } else {
      //   setIsResetBtnActive(true);
      // }
    }
  }, [
    townsFilter,
    roadValuesFilter,
    regionsFilter,
    citiesFilter,
    routesFilter,
    districtsFilter,
    planningStructuresFilter,
    agglomerationsFilter,
    categoriesFilter,
    roadworks5yFilter,
    roadClassFilter,
    workTypeFilter,
    roadwayWidthFilter,
    trafficFilter,
    skeletonFilter,
    normFilter,
    dtpFilter,
    loadingFilter,
  ]);

  const getFlatnessFeatureFile = async (roadid = null): Promise<boolean | any> => {
    return new Promise<boolean>(async (resolve, reject) => {
      const filename = `flatness_road_id_${roadid}.xlsx`;
      let title = '';
      const flatnessJson = await axios.get(
        `${geoserverApiUrl}/skdf_open/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=skdf_open:lyr_road_flatness_backward&outputFormat=json&CQL_FILTER=road_id=${roadid}`
      );
      if (flatnessJson?.data?.features && flatnessJson?.data?.features.length > 0) {
        const flatnessData = flatnessJson.data.features.map((item) => {
          const object: any = {};
          Object.keys(flatnessColumns).forEach((col) => {
            object[flatnessColumns[col]] = item.properties[col];
            title = item.properties.road_name;
          });
          return object;
        });
        const sheet = XLSX?.utils?.json_to_sheet([{}], {
          header: [`Ровность дороги ${title}`],
        });
        const wb = { Sheets: { ['Ровность']: sheet }, SheetNames: ['Ровность'] };
        XLSX?.utils?.sheet_add_json(sheet, flatnessData, { origin: 'A4' });
        XLSX?.writeFile(wb, filename);
        toast.success(`Данные о ровности для выбранной дороги успешно выгружены!`);
      } else {
        toast.warn(`Отсутствуют данные о ровности для выбранной дороги!`);
      }
      resolve(true);
    }).catch((error: any) => {
      toast.error(
        `Ошибка при попытке выгрузить данных ровности дороги!${error?.response?.data?.message ? error.response.data.message : error}`
      );
    });
  };

  const saveGeoJSON = async (objectid = null): Promise<boolean | any> => {
    return new Promise<boolean>((resolve, reject) => {
      if (selectedFeature) {
        const filename = `geom_id_${objectid}.json`;
        const selectedGeometry = selectedFeature?.getGeometry();
        const geoJson: GeoJSONGeometry = new GeoJSON().writeGeometryObject(selectedGeometry, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        });
        const data: any = new Blob([JSON.stringify(geoJson, undefined, 2)], { type: 'text' });
        saveAs(data, filename);
        resolve(true);
        toast.success(`Геометрия успешно выгружена!`);
      }
    }).catch((error: any) => {
      toast.error(`Ошибка при попытке выгрузить геометрию в файл!${error?.response?.data?.message ? error.response.data.message : error}`);
    });
  };

  useEffect(() => {
    // -----Если закрыли карточку, удалили interaction
    if (!isOpenCardDetail && map) {
      onFeatureClick();
      setSelectedFeature(null);
      setSelectedRoadId(null);
      selectedRoadIdRef.current = null;
      setSelectedRoadPartId(null);
      selectedRoadPartIdRef.current = null;
      setSelectedBackBoneId(null);
      setSelectedBridgeId(null);
      selectedBridgeIdRef.current = null;
      setSelectedEdgeId(null);
      const wfsGroup: any = map
        .getLayers()
        .getArray()
        .filter((item, index, array) => item.get('name') === 'layers-wfs')?.[0];
      wfsGroup
        .getLayers()
        .getArray()
        .forEach((layer) => {
          layer.changed();
        });
      if (routerRest?.match?.params?.id) {
        routerRest.history.push({ pathname: '/map', state: undefined });
      }
    }
  }, [isOpenCardDetail]);

  // -----Функция поиска дороги и extent по road_id
  const getFeatures = async (id, object_type = 'road') => {
    try {
      setIsSearchingFeature(true);
      let url = '';
      if (object_type === 'road') {
        url = `${geoserverApiUrl}/skdf_open/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=skdf_open:zoom_1_roads,zoom_2_roads,zoom_3_roads,zoom_4_roads&outputFormat=application/json&srsname=EPSG:3857&cql_filter=road_id=${id}`;
      } else if (object_type === 'roadpart') {
        url = `${geoserverApiUrl}/skdf_open/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=skdf_open:zoom_1_roads,zoom_2_roads,zoom_3_roads,zoom_4_roads&outputFormat=application/json&srsname=EPSG:3857&cql_filter=road_part_id=${id}`;
      } else if (object_type === 'bridge') {
        const currentLayers: any = { ...mapLayers };
        currentLayers.lyr_bridges = { checked: true, name: 'lyr_bridges' };
        setMapLayers(currentLayers);
        //Включаем слой с мостами
        const wmsGroup: any = map
          .getLayers()
          .getArray()
          .filter((item, index, array) => item.get('name') === 'layers-wms')?.[0];
        wmsGroup
          .getLayers()
          .getArray()
          .forEach((layer) => {
            const lname = layer.get('name');
            if (lname === 'lyr_bridges') {
              layer.setVisible(true);
            }
          });
        url = `${geoserverApiUrl}/skdf_open/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=skdf_open:lyr_bridge_point_edit&outputFormat=application/json&srsname=EPSG:3857&cql_filter=bridge_id=${id}`;
      }
      const response = await axios.get(
        url
        //`${geoserverApiUrl}/skdf_open/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=skdf_open:zoom_1_roads,zoom_2_roads,zoom_3_roads,zoom_4_roads&outputFormat=application/json&srsname=EPSG:3857&cql_filter=road_id=${id}`
      );
      // map.addInteraction(selectedItems);
      if (response?.data?.features && response?.data?.features.length > 0) {
        const featuresWithGeometry = response?.data?.features.filter((item) => item?.geometry);
        if (featuresWithGeometry && featuresWithGeometry.length > 0) {
          const feature = new GeoJSON().readFeature(
            featuresWithGeometry?.[0]
            // response?.data?.features?.[0]
          );
          // const features: any = new GeoJSON().readFeature(response?.data?.features);
          // const extents = features?.[0].getGeometry().getExtent().slice(0);
          // features.forEach((feat) => {
          //   olExtent.extend(extents, feat.getGeometry().getExtent());
          // });
          setSelectedFeature(feature);
          if (object_type === 'road') {
            setSelectedRoadId(id);
            selectedRoadIdRef.current = id;
          } else if (object_type === 'roadpart') {
            setSelectedRoadPartId(id);
            selectedRoadPartIdRef.current = id;
          } else if (object_type === 'bridge') {
            setSelectedBridgeId(id);
            selectedBridgeIdRef.current = id;
          }
          setIsOpenCardDetail(true);
          // map.updateSize();
          const extent = feature.getGeometry().getExtent();
          map.getView().fit(
            response?.data?.bbox, // extent
            { padding: [50, 50, 50, 50], size: map.getSize(), maxZoom: 14, duration: 500 }
          );
        } else {
          toast.warn(`Отсутствует геометрия у запрашиваемой дороги`);
        }
      } else {
        toast.warn(`Дорога не найдена`);
      }
      setIsSearchingFeature(false);
    } catch (error: any) {
      setIsSearchingFeature(false);
      toast.error(
        `Ошибка при получении данных по выбранной дороге! ${error?.response?.data?.message ? error.response.data.message : error}`
      );
    }
  };

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
    if (routerRest?.match?.params?.edit === 'edit' && map && routerRest?.match?.params?.objecttype) {
      // console.log(routerRest);
      // debugger;
      const objType = routerRest?.match?.params?.objecttype;
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
        getRoadName(routerRest?.match?.params?.id);
        //getFeatures(routerRest?.match?.params?.id);
        //dispatch(setSelectedRoad(routerRest?.match?.params?.id));
        // setIsEditGeom(true);
        // onFeatureClick();
        //setSelectedFeature(null);
        setSelectedBackBoneId(null);
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
        setSelectedBridgeId(routerRest?.match?.params?.id);
        selectedBridgeIdRef.current = routerRest?.match?.params?.id;
        const view = map.getView();
        view.setMinZoom(11);
        view.setMaxZoom(18);
        dispatch(setDrawMode('draw'));
      } else if (objType === 'roadpart') {
        axios
          .post(`${pgApiUrl}/rpc/get_road_parts`, { p_road_id: routerRest?.match?.params?.id }, querySchemaHeader)
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
              setSelectedBackBoneId(null);

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
    } else if (routerRest?.match?.params?.id && map && mapModeRef?.current === 'navigation' && routerRest?.match?.params?.objecttype) {
      getFeatures(routerRest?.match?.params?.id, routerRest?.match?.params?.objecttype);
    }
  }, [
    map,
    routerRest?.match?.params,
    // routerRest?.match?.params?.id
  ]);

  useEffect(() => {
    if (mapMode === 'editgeom') {
      setIsEditGeom(true);
      onFeatureClick();
      //setSelectedFeature(null);

      //setSelectedRoadId(null);
      setSelectedBackBoneId(null);
      //setSelectedBridgeId(null);
      setSelectedEdgeId(null);
    }
    if (mapMode === 'navigation') {
      if (mapElement.current && map) {
        map.setTarget(mapElement.current);
      }
    }
  }, [mapMode]);

  const selectStyle = (feature, resolution) => {
    try {
      if (mapModeRef?.current === 'navigation') {
        const zoom = Math.ceil(Math.log2(156543.03390625) - Math.log2(resolution));
        // let roadworks = null;
        // setRoadworks5y((val) => {
        //   roadworks = val;
        //   return val;
        // });
        const roadworks = roadworks5yRef.current;
        // let bridgeid = null;
        // setSelectedBridgeId((val) => {
        //   bridgeid = val;
        //   return val;
        // });
        let bridgeid = selectedBridgeIdRef.current;

        const geometry = feature.getGeometry();
        const type = geometry.getType();
        // console.log(feature, type);
        if (bridgeid && (feature.getId().split('.')?.[0] === 'lyr_bridge_point_edit' || type === 'Point')) {
          return new Style({
            image: new CircleStyle({
              radius: 17,
              stroke: new Stroke({
                color: 'rgba(0,255,246, 1)',
              }),
              fill: new Fill({
                color: 'rgba(0,255,246, 1)',
              }),
            }),
          });
        }
        if (roadworks && Object.keys(roadworks).length > 0) {
          const lname = feature.getId().split('.')?.[0];
          const lSelectedWidth = wfsLayers.filter((item) => item.name === lname)?.[0]?.style?.width;
          const lcolor = wfsLayers.filter((item) => item.name === lname)?.[0]?.style?.color;

          return new Style({
            stroke: new Stroke({
              color: lcolor,
              width: lSelectedWidth,
            }),
          });
        }
        const color = 'rgba(6,175,200, 1)';
        const lname = feature.getId().split('.')?.[0];
        //const lSelectedWidth = wfsLayers.filter((item) => item.name === lname)?.[0]?.selectedWidth;
        const lSelectedWidth = wfsLayers.filter((item) => zoom <= item.maxZoom && zoom > item.minZoom)?.[0]?.selectedWidth;
        console.log(`featureid: `, lname);
        selected.getStroke().setWidth(lSelectedWidth);
        selected.getFill().setColor(color);
        return selected;
      } else {
        // selected.getStroke().setWidth(14);
        // selected.getFill().setColor("rgba(184,184,184, 0.01)");
        // return selected;
        return;
      }
    } catch (error: any) {
      toast.error(`Ошибка при изменении стиля выбранного объекта! ${error?.response?.data?.message ? error.response.data.message : error}`);
      return;
    }
  };

  const selectSingleClick = new Select({
    style: selectStyle,
    condition: (mapBrowserEvent) => {
      return (
        (shiftKeyOnly(mapBrowserEvent) && click(mapBrowserEvent)) ||
        (singleClick(mapBrowserEvent) && mapModeRef.current === 'navigation' && !altKeyOnly(mapBrowserEvent))
      );
    },
    hitTolerance: 30,
    layers: (layer) => {
      const lname = layer.get('name');
      //return wfsLayers.map((item) => item.name).includes(lname) || lname === 'lyr_bridge_point_edit';
      return (
        wfsLayers
          //.filter((item) => item?.selected)
          .map((item) => item.name)
          .includes(lname) || lname === 'lyr_bridge_point_edit'
      );
    },
    filter: (feature, layer) => {
      return true;
    },
  });

  const getAndSetBboxSelectedRoad = async (map, roadid) => {
    try {
      if (roadid) {
        const bbox = await axios.post(`${pgApiUrl}/rpc/f_get_bbox_by_road_id`, { p_road_id: roadid }, publicSchemaHeader);
        if (bbox && bbox?.data && bbox?.data.length > 0 && !bbox?.data.includes(null)) {
          map.getView().fit(bbox?.data, {
            padding: [50, 50, 50, 50],
            size: map.getSize(),
            maxZoom: 16,
            duration: 500,
          });
        }
      }
    } catch (error: any) {
      console.error('Ошибка при получении и задании extent выбранной дороги: ', error);
    }
  };

  const onFeatureClick = async () => {
    try {
      if (map) {
        if (select !== null) {
          map.removeInteraction(select);
        }
        select = selectSingleClick;
        if (select !== null) {
          map.addInteraction(select);
          // select.getFeatures().on('add', (feature) => {
          // });
          select.on('select', async (e) => {
            if (e.selected && e.selected.length > 0 && mapModeRef.current === 'navigation') {
              const coord = e.mapBrowserEvent.coordinate;
              console.log('Координаты клика', coord, e);

              // let roadWorkData = null;
              // setRoadworks5y((val) => {
              //   roadWorkData = val;
              //   return val;
              // });
              const roadWorkData = roadworks5yRef.current;
              if (roadWorkData && Object.keys(roadWorkData)?.length > 0 && roadWorkData?.fields?.length > 0) {
                setRoadworks5y(null);
              }
              removePicketFeature();
              removeRoadworks5yFeature();
              const selectedFeatureObject = e.selected?.[0].getProperties();
              const selectedFeatureGeometry = e.selected?.[0]?.getGeometry();
              console.log(selectedFeatureGeometry);
              const extentSelectedFeature = e.selected?.[0]?.getGeometry().getExtent();

              // //Вычисление extent выбранной дороги
              // const layer = select.getLayer(e.selected?.[0]);
              // const features = layer.getSource().getFeatures();
              // const filterFeatures = features.filter((item) => {
              //   return item.getProperties().road_id === selectedFeatureObject?.road_id;
              // });
              // if (filterFeatures && filterFeatures.length > 0) {
              //   const featExtent = filterFeatures?.[0].getGeometry().getExtent();
              //   let ext;
              //   filterFeatures.forEach((item) => {
              //     ext = extend(featExtent, item.getGeometry().getExtent());
              //   });
              //   map.getView().fit(
              //     ext, //extent
              //     {
              //       padding: [50, 50, 50, 50],
              //       size: map.getSize(),
              //       maxZoom: 16,
              //       duration: 500,
              //     }
              //   );
              // }
              // //Конец вычисления extent выбранной дороги
              setSelectedFeature(e.selected?.[0]);
              console.log('Selected feature: ', e.selected?.[0]);
              //if (e?.mapBrowserEvent?.type === 'click') {
              // if (selectedFeatureObject?.road_part_id) setSelectedRoadId(selectedFeatureObject.road_part_id);
              //} else
              if (e?.mapBrowserEvent?.type === 'singleclick' || e?.mapBrowserEvent?.type === 'click') {
                let currentLayer = curLayersRef.current;

                if (
                  e?.mapBrowserEvent?.originalEvent?.shiftKey &&
                  selectedFeatureObject.road_part_id !== null &&
                  selectedFeatureObject.road_part_id !== 0
                ) {
                  setSelectedRoadPartId(selectedFeatureObject.road_part_id);
                  setSelectedRoadId(null);
                  selectedRoadIdRef.current = null;
                  getAndSetBboxSelectedRoad(map, selectedFeatureObject?.road_part_id);
                  console.log('Selected roadPart', selectedFeatureObject.road_part_id);
                }
                // setMapLayers((val) => {
                //   currentLayer = val;
                //   return val;
                // });
                //Если включен слой с мостами
                //if (currentLayer?.lyr_bridges?.checked && selectedFeatureObject?.bridge_id) {
                //setSelectedBridgeId(selectedFeatureObject?.bridge_id);
                else if (
                  (currentLayer?.lyr_bridges?.checked || currentLayer?.vec_lyr_bridges?.checked) &&
                  selectedFeatureObject?.gid &&
                  selectedFeatureObject?.object_count
                ) {
                  if (selectedFeatureObject?.is_cluster) {
                    const zoom = map.getView().getZoom();
                    const extent = e.selected?.[0].getGeometry().getExtent();
                    map
                      .getView()
                      .fit(extent, { padding: [50, 50, 50, 50], size: map.getSize(), maxZoom: zoom < 9 ? 9 : 11, duration: 300 });
                  } else {
                    setSelectedBridgeId(selectedFeatureObject?.gid);
                    selectedBridgeIdRef.current = selectedFeatureObject?.gid;
                    console.log('Selected Bridge: ', selectedFeatureObject?.gid);
                  }
                }
                // Если включен слой участки опорной сети
                else if (currentLayer?.lyr_road_conditions_skeleton?.checked || currentLayer?.vec_lyr_road_conditions_skeleton?.checked) {
                  setIsFetchingDetailData(true);
                  const geometry: any = e.selected?.[0].getGeometry();
                  const coordinate = e.mapBrowserEvent.coordinate;
                  const closestPoint = geometry.getClosestPoint(coordinate);
                  const obj = {
                    p_params: {
                      QUERY: {
                        ROAD_ID: selectedFeatureObject?.road_id,
                        ROAD_PART_ID: selectedFeatureObject?.road_part_id,
                        M: Math.round(closestPoint?.[2]),
                      },
                    },
                  };
                  const skeleton = await axios.post(`${pgApiUrl}/rpc/f_get_skeleton`, obj, publicSchemaHeader);
                  if (skeleton?.data === -1) {
                    setSelectedRoadId(selectedFeatureObject.road_id);
                  } else {
                    setSelectedBackBoneId(skeleton?.data);
                  }
                  getAndSetBboxSelectedRoad(map, selectedFeatureObject?.road_id);
                  // setIsFetchingDetailData(false);
                } // Если включен один из слоев группы граф
                else if (
                  currentLayer?.lyr_graf_federal?.checked ||
                  currentLayer?.lyr_graf_regional?.checked ||
                  currentLayer?.lyr_graf_municipal?.checked
                ) {
                  setIsFetchingDetailData(true);
                  const coordinate = e.mapBrowserEvent.coordinate;
                  // const obj = { x: coordinate?.[0], y: coordinate?.[1], radius_m: 100 };
                  // const links = await axios.post(`${pgGraphApiUrl}/rpc/f_get_nearest_links`, obj, publicSchemaHeader);
                  const obj = { x: coordinate?.[0], y: coordinate?.[1], radius_m: 50 };

                  //const links: any = await axios.post(`${pgGraphApiUrl}/rpc/f_get_minipassport_road_line`, obj, publicSchemaHeader);
                  const links: any = await axios.post(`${pgGraphApiUrl}/rpc/get_road_link`, obj, publicSchemaHeader);
                  if (links?.data !== null && links?.data !== '') {
                    setSelectedEdgeId(links?.data);
                  } else {
                    //if (links?.data && links?.data.length > 0) {
                    // if (links?.data?.fields && links?.data?.fields.length > 0) {
                    //   debugger;
                    //   // const geometry = await axios.post(
                    //   //   `${pgGraphApiUrl}/rpc/f_get_link_geometry`,
                    //   //   { netw_id: links.data?.[0] },
                    //   //   publicSchemaHeader
                    //   // );
                    //   //debugger;
                    //   //setSelectedEdgeId(links?.data?.[0]);
                    //   setSelectedEdgeId(links?.data);
                    // } else {
                    //   setSelectedRoadId(selectedFeatureObject.road_id);
                    // }

                    setSelectedRoadId(selectedFeatureObject.road_id);
                    getAndSetBboxSelectedRoad(map, selectedFeatureObject?.road_id);
                  }
                  // setIsFetchingDetailData(false);
                } // Если включен слой пятилетки
                else if (currentLayer?.lyr_roadsworks_5y?.checked) {
                  setIsFetchingDetailData(true);
                  const coordinate = e.mapBrowserEvent.coordinate;

                  const obj = {
                    x: coordinate?.[0],
                    y: coordinate?.[1],
                    radius_m: 200,
                  };
                  const roadwork5yResponse = await axios.post(
                    `${pgApiUrl}/rpc/f_get_geo_road_work_5y_plan_minipassport`,
                    obj,
                    publicSchemaHeader
                  );
                  console.log(roadwork5yResponse);
                  if (roadwork5yResponse?.data === null) {
                    setSelectedRoadId(selectedFeatureObject.road_id);
                    // setRoadworks5y(null);
                  } else {
                    setSelectedRoadId(null);
                    setRoadworks5y(roadwork5yResponse?.data);
                    addRoadWorks5yFeature(roadwork5yResponse?.data?.geom);
                  }
                  // setIsFetchingDetailData(false);
                } else {
                  if (selectedFeatureObject?.road_id) {
                    setSelectedRoadId(selectedFeatureObject.road_id);
                    getAndSetBboxSelectedRoad(map, selectedFeatureObject?.road_id);
                  }
                }
              }

              //console.log(`Selected feature:`, selectedFeature);
              // map.getView().fit(
              //   extentSelectedFeature, //extent
              //   {
              //     padding: [50, 50, 50, 50],
              //     size: map.getSize(),
              //     //maxZoom: 12, duration: 500
              //   }
              // );
              // if (selectedFeatureObject?.road_id) setSelectedRoadId(selectedFeatureObject.road_id);
              setIsFetchingDetailData(false);
              setIsOpenCardDetail(!isOpenCardDetail);
            }
          });
        }
      }
    } catch (error: any) {
      setIsFetchingDetailData(false);
      toast.error(`Ошибка при получении объекта по клику! ${error?.response?.data?.message ? error.response.data.message : error}`);
    }
  };

  //Удаление рулетки
  const rulerRemoveInteraction = () => {
    const layer: any = map
      .getLayers()
      .getArray()
      .filter((item, index, array) => item.get('name') === 'ruler')?.[0];
    layer.setVisible(false);
    map.removeInteraction(rulerDrawRef.current);
    rulerSourceRef.current.clear();
  };
  //Добавление рулетки
  const rulerAddInteraction = () => {
    const activeTip = 'Кликните для продолжения измерения расстояния';
    const idleTip = 'Кликните для начала измерения расстояния';
    let tip = idleTip;
    const layer: any = map
      .getLayers()
      .getArray()
      .filter((item, index, array) => item.get('name') === 'ruler')?.[0];
    layer.setVisible(true);
    rulerSourceRef.current = layer.getSource();
    rulerDrawRef.current = new Draw({
      source: rulerSourceRef.current,
      type: 'LineString',
      style: function (feature) {
        return rulerStyleFunction(feature);
      },
    });
    rulerDrawRef.current.on('drawstart', function () {
      rulerSourceRef.current.clear();
      tip = activeTip;
    });
    rulerDrawRef.current.on('drawend', function () {
      tip = idleTip;
    });
    map.addInteraction(rulerDrawRef.current);
  };

  const rulerStyleFunction = (feature) => {
    const styles = [rulerStyle];
    const geometry = feature.getGeometry();
    const type = geometry.getType();
    let point;
    let label;
    let line;
    if (type === 'LineString') {
      point = new Point(geometry.getLastCoordinate());
      label = formatLength(geometry);
      line = geometry;
    }
    if (label) {
      rulerLabelStyle.setGeometry(point);
      rulerLabelStyle.getText().setText(label);
      styles.push(rulerLabelStyle);
    }
    return styles;
  };

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

  const getLengthLabelFeatures = (feature) => {
    try {
      const geometry = feature.getGeometry();
      const type = geometry.getType();
      const length = getLenthFeature(geometry);

      console.log(length);

      //fullLength.current = length;
      return length;
    } catch (error) {
      console.log('Ошибка при расчете длины геометрии!', error);
    }
  };

  const drawStyleFunction = (feature) => {
    const styles = [styleGeomDraw];
    const geometry = feature.getGeometry();
    const type = geometry.getType();
    let point;
    let label;
    let line;
    if (type === 'MultiLineString') {
      point = new Point(geometry.getLastCoordinate());
      label = formatLength(geometry);
      line = geometry;
    }
    if (line && type === 'MultiLineString') {
      const linestrings = geometry.getLineStrings();
      console.log(linestrings);
      if (linestrings && linestrings.length > 0) {
        linestrings.forEach((l) => {
          point = new Point(l.getLastCoordinate());
          label = formatLength(l);
          line = l;
          if (line) {
            let count = 0;
            line.forEachSegment(function (a, b) {
              // const segment = new LineString([a, b]);
              // const label = formatLength(segment);
              // if (segmentStyleRef.current.length - 1 < count) {
              //   segmentStyleRef.current.push(segmentStyle.clone());
              // }
              // const segmentPoint = new Point(segment.getCoordinateAt(0.5));
              // segmentStyleRef.current?.[count].setGeometry(segmentPoint);
              // segmentStyleRef.current?.[count].getText().setText(label);
              // styles.push(segmentStyleRef.current?.[count]);

              // Добавление точек
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
        });
      }

      // line.forEachSegment(function (a, b) {
      //   const segment = new LineString([a, b]);
      //   const label = formatLength(segment);
      //   if (segmentStyleRef.current.length - 1 < count) {
      //     segmentStyleRef.current.push(segmentStyle.clone());
      //   }
      //   const segmentPoint = new Point(segment.getCoordinateAt(0.5));
      //   segmentStyleRef.current?.[count].setGeometry(segmentPoint);
      //   segmentStyleRef.current?.[count].getText().setText(label);
      //   styles.push(segmentStyleRef.current?.[count]);
      //   count++;
      // });
    }
    if (type === 'LineString') {
      point = new Point(geometry.getLastCoordinate());
      label = formatLength(geometry);

      line = geometry;
    }
    if (line && type === 'LineString') {
      let count = 0;
      line.forEachSegment(function (a, b) {
        // const segment = new LineString([a, b]);
        // const label = formatLength(segment);
        // if (segmentStyleRef.current.length - 1 < count) {
        //   segmentStyleRef.current.push(segmentStyle.clone());
        // }
        // const segmentPoint = new Point(segment.getCoordinateAt(0.5));
        // segmentStyleRef.current?.[count].setGeometry(segmentPoint);
        // segmentStyleRef.current?.[count].getText().setText(label);
        // styles.push(segmentStyleRef.current?.[count]);
        // Добавление точек
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
      let currentLen = getLengthLabelFeatures(feature);

      labelStyle.setGeometry(point);
      //const currentLength = parseFloat(label) + currentLen;
      const feaatureid = feature.getId();
      let currentLength = 0;
      if (lastFeatureIdRef.current === feaatureid) {
        currentLength = geomLengthRef.current + parseFloat(label);
      } else {
        currentLength = parseFloat(label);
      }
      //currentLength = parseFloat(fullLength.current) + currentLen;
      //fullLength.current = currentLength;
      labelStyle.getText().setText(`${currentLength.toFixed(3)} км`);
      styles.push(labelStyle);
    }

    return styles;
  };

  useEffect(() => {
    const projection: any = getProjection('EPSG:3857');
    const projectionExtent = projection.getExtent();
    const size = getWidth(projectionExtent) / 256;
    const resolutions = new Array(19);
    const matrixIds = new Array(19);
    for (let z = 0; z < 19; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }
    // const initalFeaturesLayer: any = new VectorLayer({
    //   source: new VectorSource(),
    // });

    // Векторная подложка Росреестра
    const OSMPKK = new VectorTileLayer({
      className: 'base',
      properties: { name: 'osm' },
      // extent: [-2.0037508342787e7, -2.0037508342787e7, 2.0037508342787e7, 2.0037508342787e7],
      // renderMode: 'vector',
      renderMode: 'hybrid',
      renderBuffer: 400,
      declutter: false,
      useInterimTilesOnError: false,
      visible: true,
      source: new VectorTileSource({
        // attributions: 'ПКК © Росреестр 2010-2022 | © Участники OpenStreetMap',
        format: new MVT(),
        //url: '/arcgis/rest/services/Hosted/BASEMAP_OSM/VectorTileServer/tile/{z}/{y}/{x}.pbf',
        url: 'https://pkk.rosreestr.ru/arcgis/rest/services/Hosted/BASEMAP_OSM/VectorTileServer/tile/{z}/{y}/{x}.pbf',
      }),
    });

    //applyStyle(OSMPKK, '/arcgis/rest/services/Hosted/BASEMAP_OSM/VectorTileServer/resources/styles/root.json');
    applyStyle(OSMPKK, 'https://pkk.rosreestr.ru/arcgis/rest/services/Hosted/BASEMAP_OSM/VectorTileServer/resources/styles/root.json');
    // applyStyle(OSMPKK, basemapStyle);

    // Векторная подложка с надписями Росреестра черные надписи
    const lightAnno = new VectorTileLayer({
      className: 'labels',
      properties: { name: 'lightAnno' },
      //declutter: true,
      renderMode: 'hybrid',
      declutter: true,
      visible: true,
      useInterimTilesOnError: true,
      source: new VectorTileSource({
        minZoom: 0,
        maxZoom: 13,
        format: new MVT(),
        url: 'https://pkk.rosreestr.ru/arcgis/rest/services/Hosted/vt_anno_light/VectorTileServer/tile/{z}/{y}/{x}.pbf',
      }),
    });

    applyStyle(lightAnno, 'https://pkk.rosreestr.ru/arcgis/rest/services/Hosted/vt_anno_light/VectorTileServer/resources/styles/root.json');

    // Векторная подложка с надписями Росреестра для спутника (белые надписи)
    const darkAnno = new VectorTileLayer({
      className: 'labels',
      properties: { name: 'darkAnno' },
      //declutter: true,
      renderMode: 'hybrid',
      declutter: true,
      visible: false,
      useInterimTilesOnError: true,
      source: new VectorTileSource({
        minZoom: 0,
        maxZoom: 13,
        format: new MVT(),
        url: 'https://pkk.rosreestr.ru/arcgis/rest/services/Hosted/vt_anno_dark/VectorTileServer/tile/{z}/{y}/{x}.pbf',
      }),
    });

    applyStyle(darkAnno, 'https://pkk.rosreestr.ru/arcgis/rest/services/Hosted/vt_anno_dark/VectorTileServer/resources/styles/root.json');

    // Подписи Росреестра тайловые
    const lightAnnoTile = new TileLayer({
      className: 'anno',
      properties: { name: 'anno' },
      source: new XYZ({
        url: 'https://pkk.rosreestr.ru/arcgis/rest/services/BaseMaps/Anno/Mapserver/tile/{z}/{y}/{x}?blankTile=false',
        // crossOrigin: null,
        crossOrigin: 'anonymous',
      }),
    });

    const initialMap: any = new Map({
      target: mapElement.current,
      controls: defaultControls({ zoom: false, rotate: false }).extend([
        scaleControl,
        // new ZoomToExtent({
        //   extent: [813079.7791264898, 5929220.284081122, 848966.9639063801, 5936863.986909639],
        // }),
        // new Zoom({
        //   target: '<GeoIconButton iconType="round_plus" />',
        // }),
      ]),
      layers: [
        new LayerGroup({
          properties: { name: 'basemap' },
          layers: [
            // Векторная подложка
            // OSMPKK,
            new LayerGroup({
              properties: { name: 'osm' },
              visible: true,
              layers: [
                new TileLayer({
                  // className: 'base',
                  properties: { name: 'osm2' },
                  useInterimTilesOnError: true,
                  source: new XYZ({
                    minZoom: 0,
                    maxZoom: 14,
                    url: 'https://pkk.rosreestr.ru/arcgis/rest/services/BaseMaps/BaseMap/MapServer/tile/{z}/{y}/{x}?blankTile=true',
                    //crossOrigin: null,
                    crossOrigin: 'anonymous',
                  }),
                }),
              ],
            }),
            // new LayerGroup({
            //   properties: { name: 'osm' },
            //   visible: false,
            //   layers: [OSMPKK],
            // }),

            new TileLayer({
              //className: 'base',
              properties: { name: 'satellite' },
              visible: false,
              source: new XYZ({
                url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                // crossOrigin: null,
                crossOrigin: 'anonymous',
              }),
            }),
            // new TileLayer({
            //   className: 'osm',
            //   properties: { name: 'satellite' },
            //   visible: false,
            //   source: new OSM({
            //     url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            //     crossOrigin: 'anonymous',
            //   }),
            // }),

            // new TileLayer({
            //   className: 'satellite',
            //   properties: { name: 'satellite' },
            //   visible: false,
            //   source: new XYZ({
            //     url: 'https://core-sat.maps.yandex.net/tiles?l=sat&v=3.1026.0&z={z}&x={x}&y={y}',
            //     //crossOrigin: null,
            //     crossOrigin: 'anonymous',
            //   }),
            // }),

            new LayerGroup({
              properties: { name: 'hybrid' },
              visible: false,
              layers: [
                new TileLayer({
                  // className: 'base',
                  properties: { name: 'hybrid_layers' },
                  source: new XYZ({
                    url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    // crossOrigin: null,
                    crossOrigin: 'anonymous',
                  }),
                }),

                // new VectorTileLayer({
                //   className: 'hybrid_scheme',
                //   properties: { name: 'hybrid_scheme' },
                //   declutter: true,
                //   source: new VectorTileSource({
                //     attributions: 'ПКК © Росреестр 2010-2022 | © Участники OpenStreetMap',
                //     format: new MVT(),
                //     url: 'https://pkk.rosreestr.ru/arcgis/rest/services/Hosted/BASEMAP_OSM/VectorTileServer/tile/{z}/{y}/{x}.pbf',
                //   }),
                // }),
              ],
            }),

            // Подложка росреестра с тайлами
            // new TileLayer({
            //   className: 'rosreestr',
            //   properties: { name: 'rosreestr' },
            //   visible: false,
            //   source: new XYZ({
            //     url: 'https://pkk.rosreestr.ru/arcgis/rest/services/BaseMaps/BaseMap/MapServer/tile/{z}/{y}/{x}?blankTile=true',
            //     //crossOrigin: null,
            //     crossOrigin: 'anonymous',
            //   }),
            // }),

            // new LayerGroup({
            //   properties: { name: 'rosreestr' },
            //   visible: false,
            //   layers: [
            //     new TileLayer({
            //       className: 'base',
            //       properties: { name: 'rosreestr' },
            //       source: new XYZ({
            //         url: 'https://pkk.rosreestr.ru/arcgis/rest/services/BaseMaps/BaseMap/MapServer/tile/{z}/{y}/{x}?blankTile=true',
            //         // crossOrigin: null,
            //         crossOrigin: 'anonymous',
            //       }),
            //     }),
            //   ],
            // }),
            new LayerGroup({
              properties: { name: 'rosreestr' },
              visible: false,
              layers: [
                new TileLayer({
                  className: 'base',
                  properties: { name: 'rosreestr1' },
                  source: new OSM({
                    maxZoom: 14,
                    url: 'https://ngw.fppd.cgkipd.ru/tile/56/{z}/{x}/{y}.png',
                    crossOrigin: 'anonymous',
                  }),
                }),
                // new TileLayer({
                //   className: 'base',
                //   properties: { name: 'rosreestr' },
                //   visible: true,
                //   source: new WMTS({
                //     // url: 'https://pkk.rosreestr.ru/GISWebServiceSE/service.php?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=PKKm&STYLE=default&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng',
                //     url: 'https://pkk.rosreestr.ru/GISWebServiceSE/service.php?SERVICE=WMTS',
                //     layer: 'PKKm',
                //     matrixSet: 'GoogleMapsCompatible',
                //     format: 'image/png',
                //     projection: projection,
                //     tileGrid: new WMTSTileGrid({
                //       origin: getTopLeft(projectionExtent),
                //       resolutions: resolutions,
                //       matrixIds: matrixIds,
                //     }),
                //     style: 'default',
                //     wrapX: true,
                //     crossOrigin: 'anonymous',
                //   }),
                // }),
              ],
            }),
          ],
        }),

        // -------------WFS interaction (on click) получение вектора от геосервера-----------
        // new LayerGroup({
        //   properties: { name: 'layers-wfs' },
        //   layers: wfsLayers.map((item) => {
        //     return new VectorLayer({
        //       properties: { name: item?.name },
        //       maxZoom: item?.maxZoom,
        //       minZoom: item?.minZoom,
        //       source: new VectorSource({
        //         format: new GeoJSON(),
        //         url: (extent) => {
        //           return (
        //             `${geoserverApiUrl}/skdf_open/wfs?service=WFS&` +
        //             'version=1.0.0&request=GetFeature&typeName=skdf_open:' +
        //             item?.name +
        //             '&' +
        //             'outputFormat=application/json&srsname=EPSG:3857&&bbox=' +
        //             extent.join(',') +
        //             ',EPSG:3857'
        //           );
        //         },
        //         strategy: bboxStrategy,
        //       }),
        //       style: (feature, layer) => {
        //         const color = 'rgba(6,175,200, 1)';
        //         const lname = String(feature.getId()).split('.')?.[0];
        //         const lSelectedWidth = wfsLayers.filter((item) => item.name === lname)?.[0]?.selectedWidth;
        //         // console.log(`featureid: `, lname);
        //         let roadworks = null;
        //         setRoadworks5y((val) => {
        //           roadworks = val;
        //           return val;
        //         });
        //         let selRoadId = null;
        //         setSelectedRoadId((val) => {
        //           selRoadId = val;
        //           return val;
        //         });
        //         if (selRoadId && !roadworks && mapModeRef?.current === 'navigation') {
        //           const featureId = feature.get('road_id');
        //           if (featureId == selRoadId) {
        //             console.log(selRoadId);
        //             selected.getStroke().setWidth(lSelectedWidth);
        //             selected.getFill().setColor(color);
        //             return selected;
        //           }
        //         }
        //         return new Style({
        //           stroke: new Stroke({
        //             color: item?.style?.color,
        //             width: item?.style?.width,
        //           }),
        //         });
        //       },
        //       // style: new Style({
        //       //   stroke: new Stroke({
        //       //     color: item?.style?.color,
        //       //     width: item?.style?.width,
        //       //   }),
        //       // }),
        //     });
        //   }),
        // }),

        //---------------НЕВИДИМЫЙ ИСТОЧНИК ДЛЯ Interaction Ol-------
        new LayerGroup({
          properties: { name: 'layers-wfs' },
          visible: true,
          layers: wfsLayers
            .filter((item) => item.layersType !== 'bridge' && item.visible)
            .map((item, index) => {
              return new VectorLayer({
                properties: { id: `${index}.${item?.name}`, name: item?.name },
                maxZoom: item?.maxZoom,
                minZoom: item?.minZoom,
                source: invisibleRoadSourcesByZoom.filter((source) => source?.[item.zoomSource])?.[0]?.[item?.zoomSource],
                //roadSources.filter((source) => source?.[item?.zoomSource])?.[0]?.[item?.zoomSource],
                style: (feature, resolution) => {
                  const color = 'rgba(6,175,200, 1)';
                  const zoom = Math.ceil(Math.log2(156543.03390625) - Math.log2(resolution));

                  const lname = String(feature.getId()).split('.')?.[0];
                  //const lSelectedWidth = wfsLayers.filter((item) => item.name === lname)?.[0]?.selectedWidth || 12;
                  const lSelectedWidth = wfsLayers.filter((wfsLayer) => zoom <= wfsLayer.maxZoom && zoom > wfsLayer.minZoom)?.[0]
                    ?.selectedWidth;
                  //console.log('Selected object width: ', lSelectedWidth);
                  const properties = feature.getProperties();
                  // let roadworks = null;
                  // setRoadworks5y((val) => {
                  //   roadworks = val;
                  //   return val;
                  // });
                  const roadworks = roadworks5yRef.current;
                  // let selRoadId = null;
                  // setSelectedRoadId((val) => {
                  //   selRoadId = val;
                  //   return val;
                  // });
                  const selRoadId = selectedRoadIdRef.current;
                  const selRoadPartId = selectedRoadPartIdRef.current;
                  if ((selRoadId || selRoadPartId) && !roadworks && mapModeRef?.current === 'navigation') {
                    const featureRoadId = feature.get('road_id');
                    const featureRoadPartId = feature.get('road_part_id');
                    if (selRoadId) {
                      if (featureRoadId === Number(selRoadId)) {
                        console.log(selRoadId);
                        selected.getStroke().setWidth(lSelectedWidth);
                        selected.getFill().setColor(color);
                        return selected;
                      }
                    } else if (featureRoadPartId) {
                      if (featureRoadPartId === Number(selRoadPartId)) {
                        console.log(selRoadPartId);
                        selected.getStroke().setWidth(lSelectedWidth);
                        selected.getFill().setColor(color);
                        return selected;
                      }
                    }
                  }
                  let featureColor = null;
                  let featureWidth = null;
                  const index = item?.style.id.indexOf(properties?.value_of_the_road_gid);
                  featureColor = item?.style.colors?.[index];
                  featureWidth = item?.style.widths?.[index];
                  // console.log(featureColor, featureWidth);
                  return new Style({
                    stroke: new Stroke({
                      color: featureColor,
                      width: featureWidth,
                    }),
                  });
                },
              });
            }),
        }),

        // -------------WFS interaction (on click) получение вектора в 4 слоя через функцию postgres РАБОЧИЙ ВАРИАНТ С ДОРОГАМИ, ОРОРКОЙ И МОСТАМИ-----------
        // new LayerGroup({
        //   properties: { name: 'layers-wfs' },
        //   visible: true,
        //   layers: wfsLayers.filter((item) => item.layersType !== "bridge").map((item) => {
        //     return new VectorLayer({
        //       properties: { name: item?.name },
        //       maxZoom: item?.maxZoom,
        //       minZoom: item?.minZoom,
        //       source:
        //         roadVectorSourcesByZoom.filter((source) => source?.[item.zoomSource])?.[0]?.[item?.zoomSource],
        //         //roadVectorSource,
        //       style: (feature, layer) => {
        //         const color = 'rgba(6,175,200, 1)';
        //         const lname = String(feature.getId()).split('.')?.[0];
        //         const lSelectedWidth = wfsLayers.filter((item) => item.name === lname)?.[0]?.selectedWidth || 12;
        //         const properties = feature.getProperties();
        //         let roadworks = null;
        //         setRoadworks5y((val) => {
        //           roadworks = val;
        //           return val;
        //         });
        //         let selRoadId = null;
        //         setSelectedRoadId((val) => {
        //           selRoadId = val;
        //           return val;
        //         });
        //         if (selRoadId && !roadworks && mapModeRef?.current === 'navigation') {
        //           const featureId = feature.get('road_id');
        //           if (featureId == selRoadId) {
        //             console.log(selRoadId);
        //             selected.getStroke().setWidth(lSelectedWidth);
        //             selected.getFill().setColor(color);
        //             return selected;
        //           }
        //         }
        //         let featureColor = null;
        //         let featureWidth = null;
        //         const index = item?.style.id.indexOf(properties?.value_of_the_road_gid);
        //         featureColor = item?.style.colors?.[index];
        //         featureWidth = item?.style.widths?.[index];
        //         // console.log(featureColor, featureWidth);
        //         if (item?.layersType === 'skeleton') {
        //           if (properties?.skeleton) {
        //             return new Style({
        //               stroke: new Stroke({
        //                 color: featureColor,
        //                 width: featureWidth,
        //               }),
        //             });
        //           } else {
        //             return new Style({
        //               stroke: new Stroke({
        //                 color: 'rgba(6,175,200, 0)',
        //                 width: 1,
        //               }),
        //             });
        //           }
        //         }
        //         return new Style({
        //           stroke: new Stroke({
        //             color: featureColor,
        //             width: featureWidth,
        //           }),
        //         });

        //         // return new Style({
        //         //   stroke: new Stroke({
        //         //     color: item?.style?.color,
        //         //     width: item?.style?.width,
        //         //   }),
        //         // });
        //       },
        //     });
        //   }),
        // }),

        // -------------WFS interaction (on click) получение вектора Моста в 4 слоя через функцию postgres-----------
        // new LayerGroup({
        //   properties: { name: 'layers-wfs-bridge' },
        //   visible: true,
        //   layers: wfsLayers.filter((item) => item.layersType === "bridge").map((item) => {
        //     return new VectorLayer({
        //       properties: { name: item?.name },
        //       maxZoom: item?.maxZoom,
        //       minZoom: item?.minZoom,
        //       source:
        //          //bridgeVectorSourcesByZoom.filter((source) => source?.[item.zoomSource])?.[0]?.[item?.zoomSource],
        //          invisibleBridgeSourcesByZoom.filter((source) => source?.[item.zoomSource])?.[0]?.[item?.zoomSource],
        //         //bridgeSources.filter((source) => source?.[item.zoomSource])?.[0]?.[item?.zoomSource],
        //       style: (feature, layer) => {
        //         const color = 'rgba(6,175,200, 1)';
        //         const lname = String(feature.getId()).split('.')?.[0];
        //         const lSelectedWidth = wfsLayers.filter((item) => item.name === lname)?.[0]?.selectedWidth || 12;
        //         const properties = feature.getProperties();
        //         let roadworks = null;
        //         setRoadworks5y((val) => {
        //           roadworks = val;
        //           return val;
        //         });
        //         let selRoadId = null;
        //         setSelectedRoadId((val) => {
        //           selRoadId = val;
        //           return val;
        //         });
        //         if (selRoadId && !roadworks && mapModeRef?.current === 'navigation') {
        //           const featureId = feature.get('road_id');
        //           if (featureId == selRoadId) {
        //             console.log(selRoadId);
        //             selected.getStroke().setWidth(lSelectedWidth);
        //             selected.getFill().setColor(color);
        //             return selected;
        //           }
        //         }
        //         let featureColor = null;
        //         let featureWidth = null;
        //         const index = item?.style.id.indexOf(properties?.value_of_the_road_gid);
        //         featureColor = item?.style.color;
        //         featureWidth = item?.style.width;
        //         const svg = '<svg width="24" fill="none" height="24" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
        //         '<path d="M4 7.5V11.6667C5.38071 11.6667 6.5 12.786 6.5 14.1667V18.3333H9.83333V14.1667C9.83333 12.786 10.9526 11.6667 12.3333 11.6667C13.714 11.6667 14.8333 12.786 14.8333 14.1667V18.3333H18.1667V14.1667C18.1667 12.786 19.286 11.6667 20.6667 11.6667V7.5H4Z" fill="currentColor" />' +
        //         '<rect x="4" y="5" width="16.6667" height="1.66667" fill="currentColor" />' +
        //       '</svg>';

        //       const svg2 = '<svg width="24" fill="none" height="24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#4378DD"/><path d="M20.333 5.333H3.667V7h16.666V5.333ZM3.667 12V7.833h16.666V12a2.5 2.5 0 0 0-2.5 2.5v4.167H14.5V14.5a2.5 2.5 0 0 0-5 0v4.167H6.167V14.5a2.5 2.5 0 0 0-2.5-2.5Z" fill="#FBFBFB"/></svg>';

        //         // return new Style({
        //         //   image: new Icon({
        //         //     src: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg2),
        //         //   }),
        //         // });
        //         return new Style({
        //           image: new CircleStyle({
        //             radius: item?.style.width,
        //             stroke: new Stroke({
        //               color: item?.style.color,
        //             }),
        //             fill: new Fill({
        //               color: item?.style.color,
        //             }),
        //           }),
        //         });
        //       },
        //     });
        //   }),
        // }),

        //-------------WFS interaction (on click) получение вектора через функцию на один слой-----------
        // new LayerGroup({
        //   properties: { name: 'layers-wfs' },
        //   layers: [
        //     new VectorLayer({
        //       properties: { name: 'zoom' },
        //       maxZoom: 18,
        //       minZoom: 2,
        //       source: roadVectorSource,
        //       style: (feature, layer) => {
        //         const color = 'rgba(6,175,200, 1)';
        //         const lname = String(feature.getId()).split('.')?.[0];
        //         const lSelectedWidth = 15;
        //         let roadworks = null;
        //         setRoadworks5y((val) => {
        //           roadworks = val;
        //           return val;
        //         });
        //         let selRoadId = null;
        //         setSelectedRoadId((val) => {
        //           selRoadId = val;
        //           return val;
        //         });
        //         if (selRoadId && !roadworks && mapModeRef?.current === 'navigation') {
        //           const featureId = feature.get('road_id');
        //           if (featureId == selRoadId) {
        //             console.log(selRoadId);
        //             selected.getStroke().setWidth(lSelectedWidth);
        //             selected.getFill().setColor(color);
        //             return selected;
        //           }
        //         }
        //         return new Style({
        //           stroke: new Stroke({
        //             color: '#000000',
        //             width: 8,
        //           }),
        //         });
        //       },
        //     }),
        //   ],
        // }),

        // -------------Новое получение вектора в функцию postgres get_road_segment_geobox, на примере Технической категории-----------
        new LayerGroup({
          properties: { name: 'layers-vector' },
          visible: false,
          layers: vectorLayers.map((item) => {
            return new VectorLayer({
              properties: { name: item?.name },
              maxZoom: item?.maxZoom,
              minZoom: item?.minZoom,
              source:
                layerVectorSource &&
                layerVectorSource.length > 0 &&
                layerVectorSource.filter((source, index, array) => {
                  return source?.[item?.source];
                })?.[0]?.[item?.source],
              style: (feature, layer) => {
                const properties = feature.getProperties();
                let featureColor = null;
                let featureWidth = null;
                const colorIndex = item?.style.colorId.indexOf(properties?.[item?.style?.colorColumn]);
                const widthIndex = item?.style.widthId.indexOf(properties?.[item?.style?.widthColumn]);
                featureColor = colorIndex === -1 ? '#cecece' : item?.style.colors?.[colorIndex];
                featureWidth = item?.style.widths?.[widthIndex];
                // console.log(featureColor, featureWidth);
                // if (item?.layersType === 'skeleton') {
                //   if (properties?.skeleton) {
                //     return new Style({
                //       stroke: new Stroke({
                //         color: featureColor,
                //         width: featureWidth,
                //       }),
                //     });
                //   } else {
                //     return new Style({
                //       stroke: new Stroke({
                //         color: 'rgba(6,175,200, 0)',
                //         width: 1,
                //       }),
                //     });
                //   }
                // }
                return new Style({
                  stroke: new Stroke({
                    color: featureColor,
                    width: featureWidth,
                  }),
                });
              },
            });
          }),
        }),

        //----------Полупрозрачный слой для моста-------
        new LayerGroup({
          properties: { name: 'lyr_bridge_point_edit' },
          visible: true,
          layers: wfsLayers
            .filter((item) => item.layersType === 'bridge')
            .map((item) => {
              return new VectorLayer({
                properties: { id: `lyr_bridge_point_edit.1234`, name: item?.name },
                maxZoom: item?.maxZoom,
                minZoom: item?.minZoom,
                source: invisibleBridgeSourcesByZoom.filter((source) => source?.[item.zoomSource])?.[0]?.[item?.zoomSource],
                style: (feature, layer) => {
                  const featureBridgeId = feature.get('gid');
                  if (featureBridgeId === Number(selectedBridgeIdRef.current)) {
                    return new Style({
                      image: new CircleStyle({
                        radius: 17,
                        stroke: new Stroke({
                          color: 'rgba(0,255,246, 1)',
                        }),
                        fill: new Fill({
                          color: 'rgba(0,255,246, 1)',
                        }),
                      }),
                    });
                  }
                  return new Style({
                    image: new CircleStyle({
                      radius: 15,
                      stroke: new Stroke({
                        //color: 'rgba(114,114,114, 1)',
                        color: 'rgba(184,184,184, 0.01)',
                      }),
                      fill: new Fill({
                        //color: 'rgba(114,114,114, 1)',
                        color: 'rgba(184,184,184, 0.01)',
                      }),
                    }),
                  });
                },
              });
            }),
        }),

        //Старый рабочий слой для полупрозрачного вектора по мостам, Слой для отображения в режиме редактирования геометрии моста
        // new VectorLayer({
        //   visible: true, //mapModeRef.current === 'editgeom' && editObjectModeRef.current === 'bridge',
        //   properties: { name: 'lyr_bridge_point_edit' },
        //   maxZoom: 18,
        //   minZoom: 0,
        //   source: new VectorSource({
        //     format: new GeoJSON(),
        //     url: (extent) => {
        //       return (
        //         `${geoserverApiUrl}/skdf_open/wfs?service=WFS&` +
        //         'version=1.0.0&request=GetFeature&typeName=skdf_open:lyr_bridge_point_edit&outputFormat=application/json&srsname=EPSG:3857&&bbox=' +
        //         extent.join(',') +
        //         ',EPSG:3857'
        //       );
        //     },
        //     strategy: bboxStrategy,
        //   }),
        //   style: (feature, layer) => {
        //     return new Style({
        //       image: new CircleStyle({
        //         radius: 5,
        //         stroke: new Stroke({
        //           //color: 'rgba(114,114,114, 1)',
        //           color: 'rgba(184,184,184, 0.01)',
        //         }),
        //         fill: new Fill({
        //           //color: 'rgba(114,114,114, 1)',
        //           color: 'rgba(184,184,184, 0.01)',
        //         }),
        //       }),
        //     });
        //   },
        // }),

        //Слой для отображения найденного участка дороги по пикетажу
        new VectorLayer({
          properties: { name: 'picket' },
          source: new VectorSource({
            format: new GeoJSON(),
            features: [],
          }),
          style: (feature) => {
            return new Style({
              stroke: new Stroke({
                color: '#ff0000',
                width: 14,
              }),
            });
          },
        }),
        // Слой для отображения найденного участка c работами пятилетнего плана
        new VectorLayer({
          properties: { name: 'roadworks5y' },
          source: new VectorSource({
            format: new GeoJSON(),
            features: [],
          }),
          style: (feature) => {
            return new Style({
              fill: new Fill({
                color: 'rgba(22,198,224, 1)',
              }),
              stroke: new Stroke({
                color: 'rgba(0,255,246, 1)',
                width: 16,
              }),
              // stroke: new Stroke({
              //   color: 'rgba(22,198,224, 1)',
              //   width: 16,
              // }),
            });
          },
        }),

        // ----------WMS для карты региональной опорной сети------
        new LayerGroup({
          properties: { name: 'regional-skeleton-wms' },
          layers: wmsRegionalSkeletonLayers
            // .filter((item) => item.name !== 'lyr_location_regions_shaded')
            .map((item: any, index) => {
              return new TileLayer({
                properties: { name: item?.name },
                visible: false,
                source: new TileWMS({
                  url: item.url,
                  params: item.params,
                  crossOrigin: 'anonymous',
                  serverType: 'geoserver',
                }),
              });
            }),
        }),

        // ----------WMS и теперь vectorSource------
        new LayerGroup({
          properties: { name: 'layers-wms' },
          layers: wmsTileLayers.map((item: any, index) => {
            // if (item.type === 'wfs') {
            //   // if (mapRef?.current) {
            //   //   const extentmap = mapRef?.current.getView().calculateExtent(mapRef?.current.getSize());
            //   //   console.log(`Получить extent:`, extentmap);
            //   // }
            //   return new VectorLayer({
            //     properties: { name: item?.name },
            //     maxZoom: 4,
            //     minZoom: undefined,
            //     visible: true,
            //     source: new VectorSource({
            //       format: new GeoJSON(),
            //       url: (extent) => {
            //         return (
            //           'api-geoserver/skdf_open/wfs?service=WFS&' +
            //           'version=1.1.0&request=GetFeature&typeName=skdf_open:lyr_wfs_1z_road_>40_mln&' +
            //           'outputFormat=application/json&srsname=EPSG:3857&&bbox=' +
            //           extent.join(',') +
            //           ',EPSG:3857'
            //         );
            //       },
            //       strategy: bboxStrategy,
            //     }),
            //     // style: (feature) => {
            //     //   debugger;
            //     //   const color = feature.get('COLOR') || '#0d69e1';
            //     //   style.getFill().setColor(color);
            //     //   return style;
            //     // },
            //     style: new Style({
            //       stroke: new Stroke({
            //         color: '#0d69e1',
            //         //color: 'transparent',
            //         width: 5,
            //       }),
            //       // fill: new Fill({
            //       //   color: 'transparent',
            //       // }),
            //     }),
            //   });
            // }
            if (mapLayers && Object.keys(mapLayers).length === 0 && item?.name === 'lyr_road_by_value') {
              const currentLayers = { ...mapLayers };
              currentLayers[item?.name] = { checked: true, name: item?.name };
              setMapLayers(currentLayers);
            }
            if (item.type === 'vector') {
              return new LayerGroup({
                properties: { name: item?.name },
                visible: false,
                layers: item.zoomLevels.map((zoomLevel, zoomIndex) => {
                  return new LayerGroup({
                    properties: { name: zoomLevel?.zoomLayerGroup },
                    minZoom: zoomLevel.minZoom,
                    maxZoom: zoomLevel.maxZoom,
                    layers: [
                      new LayerGroup({
                        properties: { name: `${zoomLevel?.zoomLayerGroup}_layers` },
                        layers: zoomLevel.styleLayers.map((styleLayer) => {
                          // const bridgeSrc = bridgeSources;
                          // const brsrc = bridgeSources.filter((source) => source?.[`${item?.source}_${zoomIndex}`])?.[0]?.[`${item?.source}_${zoomIndex}`];
                          // console.log(bridgeSrc,brsrc);
                          // debugger;
                          return new VectorLayer({
                            properties: { name: styleLayer?.styleLayerName },
                            source:
                              item?.source === 'road'
                                ? roadSources.filter((source) => source?.[`${item?.source}_${zoomIndex}`])?.[0]?.[
                                    `${item?.source}_${zoomIndex}`
                                  ]
                                : item?.source === 'bridge'
                                ? bridgeSources.filter((source) => source?.[`${item?.source}_${zoomIndex}`])?.[0]?.[
                                    `${item?.source}_${zoomIndex}`
                                  ]
                                : null,
                            style: (feature, layer) => {
                              const properties = feature.getProperties();
                              let featureColor = null;
                              let featureWidth = null;
                              const indexWidth = styleLayer?.style?.width_style?.width_column_values.indexOf(
                                properties?.[styleLayer?.style?.width_style?.width_column]
                              );
                              const indexColor = styleLayer?.style?.color_style?.color_column_values.indexOf(
                                properties?.[styleLayer?.style?.color_style?.color_column]
                              );
                              featureColor = styleLayer?.style.color_style?.colors?.[indexColor];
                              featureWidth = styleLayer?.style.width_style?.widths?.[indexWidth];
                              //Если линейные объекты
                              if (item?.geomType === 'line') {
                                if (item?.layerType === 'skeleton') {
                                  if (properties?.skeleton) {
                                    return new Style({
                                      stroke: new Stroke({
                                        color: featureColor,
                                        width: featureWidth,
                                      }),
                                    });
                                  } else {
                                    return new Style({
                                      stroke: new Stroke({
                                        color: 'rgba(6,175,200, 0)',
                                        width: 1,
                                      }),
                                    });
                                  }
                                }

                                return new Style({
                                  stroke: new Stroke({
                                    color: featureColor,
                                    width: featureWidth,
                                  }),
                                });
                                //Если точечные объекты
                              } else if (item?.geomType === 'point') {
                                const pointStyles = [];
                                const svgStyle = new Style({
                                  image: new Icon({
                                    src: 'data:image/svg+xml;utf8,' + encodeURIComponent(styleLayer?.style?.svg),
                                  }),
                                });
                                if (properties?.is_cluster) {
                                  const circleStyle = new Style({
                                    image: new CircleStyle({
                                      radius: styleLayer?.style.width,
                                      stroke: new Stroke({
                                        color: styleLayer?.style.color,
                                      }),
                                      fill: new Fill({
                                        color: styleLayer?.style.color,
                                      }),
                                    }),
                                  });
                                  const pointClusterLabelStyle = new Style({
                                    image: new CircleStyle({
                                      radius: 7,
                                      displacement: [10, 10],
                                      stroke: new Stroke({
                                        color: 'red',
                                      }),
                                      fill: new Fill({
                                        color: 'red',
                                      }),
                                    }),
                                    text: new Text({
                                      font: '12px Calibri,sans-serif',
                                      fill: new Fill({
                                        color: 'rgba(255, 255, 255, 1)',
                                      }),
                                      backgroundFill: new Fill({
                                        color: 'rgba(0, 0, 0, 0)',
                                      }),
                                      padding: [3, 3, 3, 3],
                                      textBaseline: 'bottom',
                                      offsetX: 10,
                                      offsetY: -2,
                                      text: String(properties?.object_count),
                                    }),
                                  });
                                  pointStyles.push(svgStyle);
                                  pointStyles.push(pointClusterLabelStyle);
                                } else {
                                  pointStyles.push(svgStyle);
                                }

                                return pointStyles;
                                // return new Style({
                                //   image: new CircleStyle({
                                //     radius: styleLayer?.style.width,
                                //     stroke: new Stroke({
                                //       color: styleLayer?.style.color,
                                //     }),
                                //     fill: new Fill({
                                //       color: styleLayer?.style.color,
                                //     }),
                                //   }),
                                // });
                                // return new Style({
                                //   image: new Icon({
                                //     src: 'data:image/svg+xml;utf8,' + encodeURIComponent(styleLayer?.svg),
                                //   }),
                                // });
                              }
                              //console.log(indexWidth, indexColor, featureColor, featureWidth);
                              // debugger;
                              if (item?.layerType === 'skeleton') {
                                if (properties?.skeleton) {
                                  return new Style({
                                    stroke: new Stroke({
                                      color: featureColor,
                                      width: featureWidth,
                                    }),
                                  });
                                } else {
                                  return new Style({
                                    stroke: new Stroke({
                                      color: 'rgba(6,175,200, 0)',
                                      width: 1,
                                    }),
                                  });
                                }
                              }
                              // return new Style({
                              //   stroke: new Stroke({
                              //     color: featureColor,
                              //     width: featureWidth,
                              //   }),
                              // });
                            },
                          });
                        }),
                      }),
                    ],
                  });
                }),
              });
            }

            if (item.type === 'pbf') {
              const pbfLayer = new VectorTileLayer({
                properties: { name: item?.name },
                visible: false,
                declutter: true,
                source: new VectorTileSource({
                  format: new MVT(),
                  maxZoom: 12,
                  url: item?.url,
                }),
              });
              applyStyle(pbfLayer, item?.params?.style);
              return pbfLayer;
            }
            if (item.type === 'mapservice') {
              return new TileLayer({
                properties: { name: item?.name },
                visible: false,
                source: new TileArcGISRest({
                  url: 'https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/ZONES/MapServer', // item.url,
                  params: item?.params,
                }),
              });
            }
            return new TileLayer({
              properties: { name: item?.name },
              visible: item?.name === 'lyr_road_by_value', // index === 0,
              source: new TileWMS({
                url: item.url,
                params: item.params,
                crossOrigin: 'anonymous',
                serverType: 'geoserver',
              }),
            });
          }),
        }),

        new LayerGroup({
          properties: { name: 'regional-skeleton-wms-regin_shaded' },
          layers: wmsRegionalSkeletonLayers
            .filter((item) => item.name === 'lyr_location_regions_shaded')
            .map((item: any, index) => {
              return new TileLayer({
                properties: { name: item?.name },
                visible: false,
                source: new TileWMS({
                  url: item.url,
                  params: item.params,
                  crossOrigin: 'anonymous',
                  serverType: 'geoserver',
                }),
              });
            }),
        }),

        // Подписи городов
        new LayerGroup({
          properties: { name: 'labels' },
          minZoom: 0,
          maxZoom: 18,
          layers: [lightAnno, darkAnno],
        }),
        // new LayerGroup({
        //   properties: { name: 'anno' },
        //   layers: [
        //     new TileLayer({
        //       className: 'anno',
        //       properties: { name: 'anno' },
        //       visible: true,
        //       source: new XYZ({
        //         url: 'https://pkk.rosreestr.ru/arcgis/rest/services/BaseMaps/Anno/Mapserver/tile/{z}/{y}/{x}?blankTile=false',
        //         //crossOrigin: null,
        //         crossOrigin: 'anonymous',
        //       }),
        //     }),
        //   ],
        // }),
        // initalFeaturesLayer,

        // Слой для отображения текущей геометрии в режиме исправления геометрии
        new VectorLayer({
          properties: { name: 'editgeom_current' },
          source: new VectorSource({
            format: new GeoJSON(),
            features: [],
          }),
          style: (feature: any) => {
            if (editObjectModeRef.current === 'bridge' && bridgeGeomTypeRef.current === 'Point') {
              return new Style({
                image: new Circle({
                  fill: new Fill({
                    color: 'rgba(0, 0, 0, 1)',
                  }),
                  radius: 8,
                }),
              });
            }
            return new Style({
              fill: new Fill({
                color: 'rgba(22,198,224, 1)',
              }),
              stroke: new Stroke({
                color: 'black',
                width: 11,
              }),
            });
            // const featureId = feature.getId();
            // if (featureId === 'current') {
            //   return new Style({
            //     fill: new Fill({
            //       color: 'rgba(22,198,224, 1)',
            //     }),
            //     stroke: new Stroke({
            //       color: 'black',
            //       width: 8,
            //     }),
            //   });
            // }
            // return new Style({
            //   fill: new Fill({
            //     color: 'rgba(22,198,224, 1)',
            //   }),
            //   stroke: new Stroke({
            //     color: 'rgba(0,255,246, 1)',
            //     width: 8,
            //   }),
            // });
          },
        }),

        // Слой для отображения новой (измененной) геометрии в режиме исправления
        new VectorLayer({
          properties: { name: 'editgeom_new' },
          source: new VectorSource({
            format: new GeoJSON(),
            features: [],
          }),
          style: (feature) => {
            if (editObjectModeRef.current === 'bridge' && bridgeGeomTypeRef.current === 'Point') {
              return new Style({
                image: new Circle({
                  fill: new Fill({
                    color: 'rgba(245,186, 5, 1)',
                  }),
                  radius: 8,
                }),
              });
            }
            return drawStyleFunction(feature);
            // Исходный стиль
            // return new Style({
            //   fill: new Fill({
            //     color: 'rgba(22,198,224, 1)',
            //   }),
            //   stroke: new Stroke({
            //     color: '#f44336',
            //     width: 4,
            //   }),
            // });
          },
        }),

        // Слой для отображения линейки
        new VectorLayer({
          properties: { name: 'ruler' },
          source: new VectorSource({
            format: new GeoJSON(),
            features: [],
          }),
          style: (feature) => {
            return rulerStyleFunction(feature);
          },
        }),

        // Слой для отображения местоположения
        new VectorLayer({
          properties: { name: 'position' },
          source: new VectorSource({
            format: new GeoJSON(),
            features: [
              new Feature({
                id: 'position',
              }),
            ],
          }),
          style: (feature) => {
            if (geolocationLabelRegionRef.current !== '') {
              let styles = geoLocationStyle;
              let coord;
              setCurrentGeolocation((val) => {
                coord = val;
                return val;
              });
              const point = new Point(coord);
              const currentPointGeom = geoLocationlabelStyle.getGeometry();
              if (currentPointGeom === null) {
                geoLocationlabelStyle.setGeometry(point);
                geoLocationlabelStyle.getText().setText(geolocationLabelRegionRef.current);
                styles.push(geoLocationlabelStyle);
              }
              return styles;
            }
            return geoLocationStyle;
          },
        }),

        // Слой для отображения точки по координатам
        new VectorLayer({
          visible: false,
          properties: { name: 'coordposition' },
          source: new VectorSource({
            format: new GeoJSON(),
            features: [
              new Feature({
                id: 'coordposition',
              }),
            ],
          }),
          style: (feature) => {
            if (coordLocationRef.current && coordLocationRef.current.length > 0 && coordLocationDescrRef.current !== '') {
              let styles = coordPositionStyle;
              const coord = coordLocationRef.current;
              const point = new Point(coord);
              const currentPointGeom = geoLocationlabelStyle.getGeometry();
              geoLocationlabelStyle.setGeometry(point);
              geoLocationlabelStyle.getText().setText(coordLocationDescrRef.current);
              styles.push(geoLocationlabelStyle);

              return styles;
            }
            //geoLocationlabelStyle
            return coordPositionStyle;
          },
        }),
        // Слой для отображения местоположения сообщения
        new VectorLayer({
          properties: { name: 'message_position' },
          source: new VectorSource({
            format: new GeoJSON(),
            features: [
              new Feature({
                id: 'message_position',
              }),
            ],
          }),
          style: (feature) => {
            return [
              new Style({
                image: new Icon({
                  anchorXUnits: 'fraction',
                  anchorYUnits: 'pixels',
                  src: IconMessage,
                }),
              }),
            ];
          },
        }),
      ],
      overlays: [
        new Overlay({
          id: 'hoverCard',
          element: document.getElementById('popup'), // popupRef.current, //document.getElementById('popup'),
          autoPan: {
            animation: {
              duration: 250,
            },
          },
        }),
      ],
      interactions: defaultInteractions({
        altShiftDragRotate: false,
        pinchRotate: false,
        // mouseWheelZoom: false,
      }),
      view: new View({
        maxZoom: 18,
        // smoothResolutionConstraint: false,
        constrainResolution: true,
        projection: 'EPSG:3857',
        // projection: 'EPSG:900913',
        // projection: 'EPSG:4326',
        center: [4179071.0049917055, 7494122.839563135],
        zoom: 9,
      }),
    });

    // initialMap.on('click', handleMapClick);

    setMap(initialMap);
    return () => initialMap.setTarget(null);
    // dispatch(setMapState(initialMap));
    // setFeaturesLayer(initalFeaturesLayer);
  }, [mapElement]);

  const onFeatureHover = function (coordinate, pixel, layer, clickedCoord) {
    try {
      // const features = map.getFeaturesAtPixel(pixel)?.[0];
      const ovl = map.getOverlayById('hoverCard');
      const container = document.getElementById('popup');
      const content = document.getElementById('popup-content');
      const element = ovl.getElement();
      if (layer) {
        const source = layer?.getSource();
        const closestFeature = source.getClosestFeatureToCoordinate(coordinate);
        // console.log(`features: `, closestFeature);
        if (closestFeature) {
          const geometry: any = closestFeature.getGeometry();
          if (geometry) {
            const selectedFeatureProperties = closestFeature.getProperties();
            const closestPoint = geometry.getClosestPoint(coordinate);
            const hovercont = (
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', textAlign: 'justify', padding: '5px' }}>
                  {selectedFeatureProperties?.road_name}
                </div>
                <div style={{ color: '#939393', fontSize: '12px', textAlign: 'justify', padding: '5px' }}>
                  {selectedFeatureProperties?.value_of_the_road}
                </div>
                <div style={{ fontSize: '14px', padding: '5px' }}>
                  <GeoIcon
                    style={{ fontSize: '16px' }}
                    name={selectedFeatureProperties?.is_checked ? 'checked' : 'unchecked'}
                    iconType={selectedFeatureProperties?.is_checked ? 'checked' : 'unchecked'}
                  />
                  <span className="ms-2">{selectedFeatureProperties?.is_checked ? 'Проверено' : 'Непроверено'}</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, padding: '5px' }}>
                  {closestPoint?.[2] ? (
                    <div>
                      {Math.trunc(closestPoint?.[2] / 1000)} + {((closestPoint?.[2] / 1000)?.toFixed(3) + '')?.split('.')?.[1]}
                    </div>
                  ) : null}
                </div>
              </div>
            );
            let popover = bs.Popover.getInstance(element);
            if (popover) {
              popover.dispose();
            }

            popover = new bs.Popover(element, {
              animation: false,
              container: element,
              content: ReactDOMServer.renderToString(hovercont),
              html: true,
              sanitize: false,
              placement: 'top',
              title: '',
            });
            popover.show();
            // setPopoverIsOpen(true);
            // setHoverContent(hovercont);
            ovl.setPosition(closestPoint.slice(0, 2));
            // container.style.display = 'block';
          }
        }
      }
    } catch (error: any) {
      toast.error(
        `Ошибка при получении объекта при наведении курсора мыши! ${error?.response?.data?.message ? error.response.data.message : error}`
      );
    }
  };

  useEffect(() => {
    if (
      map
      //&& mapRef?.current
    ) {
      updateMapSize();
      map.on('singleclick', (e) => {
        const coord = e.coordinate;
        const view = map.getView();
        const transCoord = transform(coord, 'EPSG:3857', 'EPSG:4326');
        // const ls = mapRef?.current.getAllLayers();
        const layers = map.getAllLayers();
        let mLayers: any = {};
        setMapLayers((currentState) => {
          mLayers = { ...currentState };
          return currentState;
        });
        if (e?.originalEvent?.altKey) {
          console.log(coord, transCoord);
          //Копирование координат в буфер обмена

          //const coordStr = transCoord.join(',');
          const coordStr = [transCoord?.[1], transCoord?.[0]].join(',');
          const copyToClipboard = (coord) => {
            if (navigator.clipboard && window.isSecureContext) {
              var dummy = document.createElement('input');
              document.body.appendChild(dummy);
              dummy.value = coord;
              dummy.select();
              window.navigator.clipboard.writeText(coord).then(
                () => {
                  document.body.removeChild(dummy);
                  toast.info('Координаты скопированы в буфер обмена!');
                },
                (err) => {
                  document.body.removeChild(dummy);
                  console.error('Ошибка при сохранении координат в буфер обмена', err);
                }
              );
            } else {
              let textArea = document.createElement('textarea');
              textArea.value = coord;
              textArea.style.position = 'fixed';
              textArea.style.left = '-999999px';
              textArea.style.top = '-999999px';
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();
              if (document.execCommand('copy')) {
                toast.info('Координаты скопированы в буфер обмена!');
                textArea.remove();
              } else {
                textArea.remove();
                console.error('Ошибка при сохранении координат в буфер обмена');
              }
            }
          };
          copyToClipboard(coordStr);
        }
        // console.log('слои', mLayers);
        // view.animate({
        //   center: coord,
        //   zoom: view.getZoom(),
        //   duration: 200,
        // });
        // setIsOpenCardDetail(!isOpenCardDetail);
        // map.getView().setCenter(coord);
        // map.getView().setZoom(9);
      });

      map.on('pointermove', function (evt) {
        if (evt.dragging) {
          return;
        }
        const pixel = map.getEventPixel(evt.originalEvent);
        // const hit = map.hasFeatureAtPixel(pixel);
        const hit = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
          if (layer) {
            const layerName = layer.get('name');
            if (
              layerName === 'zoom_1_roads' ||
              layerName === 'zoom_2_roads' ||
              layerName === 'zoom_3_roads' ||
              layerName === 'zoom_4_roads' ||
              layerName === 'zoom' ||
              layerName.includes('bridge')
            ) {
              return true;
            }
          }
          return;
        });

        map.getViewport().style.cursor = hit ? 'pointer' : '';
        const coordinate = map.getEventCoordinate(evt.originalEvent);
        let settings = null;
        setSelectedMapSettings((val) => {
          settings = val;
          return val;
        });
        if (settings?.isHoverControl?.checked) {
          const ovlHover = map.getOverlayById('hoverCard');
          ovlHover.setElement(document.getElementById('popup'));
          ovlHover.setPosition(undefined);
          map.forEachFeatureAtPixel(
            pixel,
            (feature, layer) => {
              onFeatureHover(coordinate, pixel, layer, evt.coordinate);
            },
            {
              layerFilter: (layer) => {
                const lname = layer.get('name');
                //return wfsLayers.map((item) => item.name).includes(lname) || lname === 'zoom'; // wfsHoverLayers.map((item) => item.name).includes(lname);
                return (
                  wfsLayers
                    .filter((item) => item?.selected)
                    .map((item) => item.name)
                    .includes(lname) || lname === 'zoom'
                );
              },
            }
          );
        }
      });

      const currZoom = map.getView().getZoom();
      map.on('moveend', (e: any) => {
        setIsLoadingAdditionalMapData(true);
        const contScale: any = document.getElementsByClassName('ol-scale-line-inner');
        if (contScale && contScale.length > 0) {
          if (contScale?.[0]?.innerHTML.includes('km')) {
            contScale[0].innerHTML = contScale?.[0]?.innerHTML.replace('km', 'км');
          } else if (contScale?.[0]?.innerHTML.includes('m')) {
            contScale[0].innerHTML = contScale?.[0]?.innerHTML.replace('m', 'м');
          }
        }
        const newZoom = e.map.getView().getZoom();
        console.log('Current zoom level: ' + newZoom);
        if (currZoom != newZoom) {
          const scaleRatio = 591657550.5 / Math.pow(2, newZoom);
          // const metersPerPx = 156543.03392 * Math.cos(latLng.lat() * Math.PI / 180) / Math.pow(2, newZoom)
          const resolution = e.map.getView().getResolution();
          // const units = e.map.getView().getUnits();
          // const scale = resolution * INCHES_PER_UNIT[units] * DOTS_PER_INCH
          // console.log('Current zoom level: ' + newZoom);
          // console.log('ScaleRatio: ' + scaleRatio);
          // console.log('Resolution:', resolution);
        }
      });
      map.on('loadstart', (e: any) => {
        // console.warn('Начало загрузки', e);
        setIsLoadingAdditionalMapData(true);
      });
      map.on('loadend', (e: any) => {
        // console.warn('Конец загрузки', e);
        setIsLoadingAdditionalMapData(false);
      });
      map.on('error', (e: any) => {
        // console.error('Ошибка загрузки карты', e);
        setIsLoadingAdditionalMapData(false);
      });
      map.on('rendercomplete', (e) => {
        // console.warn('Супер сила остановила его: ', e);
        setIsLoadingAdditionalMapData(false);
      });
      onFeatureClick();

      // map.on('rendercomplete', (e: any) => {
      //   debugger;
      // });
      map.once('postrender', async (e) => {
        // setSelectedRoadId(routerRest?.match?.params?.id);
        // if (routerRest?.match?.params?.id) {
        //   // getFeatureByRoadId(routerRest?.match?.params?.id);
        //   const id = routerRest?.match?.params?.id;
        //   const response = await axios.get(
        //     `${geoserverApiUrl}/skdf_open/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=skdf_open:lyr_wfs_1z_road_%3E40_mln,lyr_wfs_2z_road_40_2_mln,lyr_wfs_2z_road_100_min,lyr_wfs_2z_road_2000_min&outputFormat=application/json&srsname=EPSG:3857&cql_filter=road_id=${id}`
        //   );
        //   debugger;
        //   //const select = selectSingleClick;
        //   const select = e.map.getInteractions()?.[0];
        //   e.map.addInteraction(select);
        //   const feature = new GeoJSON().readFeatures(response?.data?.features?.[0]);
        //   select.getFeatures().clear();
        //   select.getFeatures().push(feature?.[0]);
        //   //console.log(response, feature);
        // }
        // const wfsgroup: any = e.map
        //   .getLayers()
        //   .getArray()
        //   .filter((item, index, array) => item.get('name') === 'layers-wfs')?.[0];
        // const wfsLayers = wfsgroup
        //   .getLayers()
        //   .getArray()
        //   .filter((layer) => {
        //     const features = layer.getSource().getFeaturesCollection();
        //     debugger;
        //     if (features && features.length > 0) {
        //       const properties = features?.[0].getProperties();
        //       console.log(features, properties);
        //       debugger;
        //     }
        //     return true;
        //   });
        // onFeatureClick();
        // debugger;
        // const as = routerRest?.match?.params?.id;
        // if (as) {
        //   debugger;
        // }
        // console.log(wfsLayers);
        // debugger;
      });
    }
  }, [map]);

  if (map) {
    map.on('loadstart', (e: any) => {
      // console.warn('Начало загрузки', e);
      setIsLoadingAdditionalMapData(true);
    });
    map.on('loadend', (e: any) => {
      // console.warn('Конец загрузки', e);
      setIsLoadingAdditionalMapData(false);
    });
  }

  // useEffect(() => {
  //   if (features?.length > 0 && featuresLayer) {
  //     featuresLayer?.setSource(
  //       new VectorSource({
  //         features: features,
  //       })
  //     );
  //     map.getView().fit(featuresLayer.getSource().getExtent(), {
  //       padding: [100, 100, 100, 100],
  //     });
  //   }
  // }, [features, featuresLayer]);

  const handleMapClick = (event: any) => {
    if (event.target.nodeName !== 'BUTTON') {
    }
    console.log(mapLayers);
    console.log(map);
    // const clickedCoord_ = map.getCoordinateFromPixel(event.pixel);
    const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);
    const transformedCoord = transform(clickedCoord, 'EPSG:3857', 'EPSG:4326');
    const coord = event.coordinate;
    const transCoord = transform(clickedCoord, 'EPSG:3857', 'EPSG:4326');
    // setSelectedCoord(transormedCoord);
    console.log('Координаты клика: ', clickedCoord);
    mapRef.current.getView().setCenter(clickedCoord);
    mapRef.current.getView().setZoom(9);
  };

  // const getFeaturesData = async () => {
  //   try {
  //     const response = await axios.get(
  //       // 'api-geoserver/flatness_test/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=flatness_test:v_hwm_iri&outputFormat=json&CQL_FILTER=fwd_lane_01=1.48'
  //       'api-geoserver/flatness_test/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=flatness_test:v_hwm_iri&outputFormat=json&CQL_FILTER=fwd_lane_01=1.48'
  //     );
  //     //const arr = response?.data?.features.map((item) => item.properties);
  //     //debugger;
  //   } catch (error: any) {
  //     //toast.error(`Ошибка получении данных feature! ${error}`);
  //   }
  // };

  // const getFeatureInfo = async (latlng, identifyLayer = '') => {
  //   try {
  //     const response = await axios.get(
  //       'api-geoserver/flatness_test/wms?service=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&BBOX=53.543459328141445,%2038.116876457501576,%2053.543683906960716,%2038.11725440187344&CRS=EPSG:4326&WIDTH=2&HEIGHT=2&LAYERS=v_hwm_iri&STYLES=&FORMAT=image/png&QUERY_LAYERS=v_hwm_iri&INFO_FORMAT=application/json&I=0&J=1&buffer=30&feature_count=20'
  //     );
  //   } catch (error: any) {
  //     debugger;
  //   }
  // };

  // useEffect(() => {
  //   // getFeaturesData();
  // }, []);

  useEffect(() => {
    if (isLoadingAdditionalMapData) {
      setTimeout(() => {
        let loadingStatus;
        setIsLoadingAdditionalMapData((val) => {
          loadingStatus = val;
          return val;
        });
        if (loadingStatus || isLoadingAdditionalMapDataRef.current) {
          setIsLoadingAdditionalMapData(false);
          setIsFetchingDetailData(false);
        }
      }, 10000);
    }
  }, [isLoadingAdditionalMapData]);

  const updateMapSize = () => {
    setTimeout(() => {
      map.updateSize();
    }, 50);
  };

  // Добавление выбранного по клику участку проведения работ по пятилетнему плану
  const addRoadWorks5yFeature = (geom) => {
    try {
      if (geom && geom.coordinates && geom.coordinates.length > 0) {
        removeRoadworks5yFeature();
        const roadworks5yFeatures: any = new GeoJSON().readFeatures(geom);
        map
          .getLayers()
          .getArray()
          .forEach((layer: any) => {
            if (layer.get('name') === 'roadworks5y') {
              const source = layer.getSource();
              const extent = roadworks5yFeatures?.[0].getGeometry().getExtent();
              source.addFeature(roadworks5yFeatures?.[0]);
              map.getView().fit(extent, { padding: [50, 50, 50, 50], size: map.getSize(), maxZoom: 14, duration: 500 });
            }
          });
      } else {
        console.log(`Отсутствует геометрия участка!`);
      }
    } catch (error) {
      console.error('Ошибка при добавлении выбранного участка проведения работ по пятилетнему плану: ', error);
    }
  };

  // Удаление feature участка из слоя picket
  const removeRoadworks5yFeature = () => {
    try {
      map
        .getLayers()
        .getArray()
        .forEach((layer: any) => {
          if (layer.get('name') === 'roadworks5y') {
            const source = layer.getSource();
            const picketFeatures = source.getFeatures();
            if (picketFeatures && picketFeatures.length > 0) {
              source.removeFeature(picketFeatures?.[0]);
            }
          }
        });
    } catch (error) {
      console.error('Ошибка при удалении feature участка проведения работ по пятилетнему плану', error);
    }
  };

  // Поиск участка по заданным параметрам и добавление объекта на слой picket
  const searchAndAddPicketFeature = async () => {
    try {
      if (picket && picket.length === 2 && selectedRoadId && isOpenCardDetail) {
        const start = Number(picket?.[0].replace('+', ''));
        const end = Number(picket?.[1].replace('+', ''));
        const road_id = selectedFeature.getProperties().road_id;
        const road_part_id = selectedFeature.getProperties().road_part_id;
        const obj = {
          p_road_id: road_id,
          p_road_part_id: road_part_id,
          p_m_start: start,
          p_m_finish: end,
        };
        const picketGeoJson = await axios.post(`${pgApiUrl}/rpc/f_get_road_part_by_m`, obj, publicSchemaHeader);
        console.log(picketGeoJson);
        // debugger;
        if (picketGeoJson?.data?.type && picketGeoJson?.data?.coordinates && picketGeoJson?.data?.coordinates.length > 0) {
          removePicketFeature();
          const picketFeatures: any = new GeoJSON().readFeatures(picketGeoJson?.data);
          console.log(picketFeatures);
          map
            .getLayers()
            .getArray()
            .forEach((layer: any) => {
              if (layer.get('name') === 'picket') {
                const source = layer.getSource();
                const extent = picketFeatures?.[0].getGeometry().getExtent();
                source.addFeature(picketFeatures?.[0]);
                map.getView().fit(extent, { padding: [50, 50, 50, 50], size: map.getSize(), maxZoom: 16, duration: 500 });
              }
            });
        } else {
          console.log(
            `Отсутствует геометрия по дороге (road_id: ${road_id}, road_part_id: ${road_part_id}, start: ${start}, finish: ${end})`
          );
        }
      }
    } catch (error) {
      console.error('Ошибка при поиске и отображении найденного участка дороги: ', error);
    }
  };

  // Удаление feature участка из слоя picket
  const removePicketFeature = () => {
    try {
      map
        .getLayers()
        .getArray()
        .forEach((layer: any) => {
          if (layer.get('name') === 'picket') {
            const source = layer.getSource();
            const picketFeatures = source.getFeatures();
            if (picketFeatures && picketFeatures.length > 0) {
              source.removeFeature(picketFeatures?.[0]);
            }
          }
        });
    } catch (error) {
      console.error('Ошибка при удалении feature найденного участка', error);
    }
  };

  const exportMap = (winEvent: any) => {
    try {
      //map.once('rendercomplete', () => {
      setIsExporting(true);
      const mapCanvas = document.createElement('canvas');
      const size = map.getSize();
      const resolution = 300;
      const viewResolution = map.getView().getResolution();
      // const width = Math.round((1920 * resolution) / 25.4);
      // const height = Math.round((1080 * resolution) / 25.4);
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      // mapCanvas.width = width;
      // mapCanvas.height = height;
      const mapContext = mapCanvas.getContext('2d');
      mapContext.fillStyle = 'white';
      mapContext.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
      Array.prototype.forEach.call(
        map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer, .base canvas, canvas.base, .labels canvas, canvas.labels'),
        function (canvas) {
          if (canvas.width > 0) {
            const opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            let matrix;
            const transform = canvas.style.transform;
            if (transform) {
              // Get the transform parameters from the style's transform matrix
              matrix = transform
                .match(/^matrix\(([^\(]*)\)$/)[1]
                .split(',')
                .map(Number);
            } else {
              matrix = [parseFloat(canvas.style.width) / canvas.width, 0, 0, parseFloat(canvas.style.height) / canvas.height, 0, 0];
            }
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
            const backgroundColor = canvas.parentNode.style.backgroundColor;
            if (backgroundColor) {
              mapContext.fillStyle = backgroundColor;
              mapContext.fillRect(0, 0, canvas.width, canvas.height);
            }
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );
      mapContext.globalAlpha = 1;
      mapContext.setTransform(1, 0, 0, 1, 0, 0);
      const link = document.createElement('a');
      link.href = mapCanvas.toDataURL();

      if (winEvent?.altKey) {
        link.setAttribute('download', `map.png`);
        document.body.appendChild(link);
        link.click();
      } else {
        // document.getElementById('printmap').style.display = 'block';
        window.frames['printmap'].document.write('<img src="' + link.href + '" />');
        window.frames['printmap'].document.close();
        window.frames['printmap'].focus();
        setTimeout(() => {
          window.frames['printmap'].print();
        }, 500);
      }
      setIsExporting(false);
      // map.setSize(size);
      // map.getView().setResolution(viewResolution);
      // });
      // map.renderSync();
    } catch (error: any) {
      console.error('Ошибка при экспорте карты:', error);
    }
  };

  // useEffect(() => {
  //   if (isMapOpen && mapElement.current && map) {
  //     map.setTarget(mapElement.current);
  //   }
  // }, [isMapOpen]);

  const mapUI = (
    <div
      style={{ minWidth: '500px', minHeight: '500px', width: '100%', height: '100%' }}
      // ref={(node) => {
      //   mapElement.current = node;
      //   debugger;
      //   // if (map && node) {
      //   //   map.setTarget(node);
      //   // }
      // }}
      ref={mapElement}
      id="map"
      key={'mapkey'}
    >
      {isDiagnosticsModal && selectedRoadId && (
        <GeoMapDiagnosticsTable
          isDiagnosticsModal={isDiagnosticsModal}
          setIsDiagnosticsModal={setIsDiagnosticsModal}
          selectedRoadId={selectedRoadId}
        />
      )}
      {isMapSettingsOpen && (
        <GeoMapSettings
          isMapSettingsOpen={isMapSettingsOpen}
          setIsMapSettingsOpen={setIsMapSettingsOpen}
          selectedMapSettings={selectedMapSettings}
          setSelectedMapSettings={setSelectedMapSettings}
        />
      )}
      {isGeoMapCoordOpen && <GeoMapCoordSet isGeoMapCoordOpen={isGeoMapCoordOpen} setIsGeoMapCoordOpen={setIsGeoMapCoordOpen} map={map} />}

      {isRegionalSkeletonModal && (
        <GeoRegionalSkeleton
          mapLayers={mapLayers}
          setMapLayers={setMapLayers}
          isRegionalSkeletonModal={isRegionalSkeletonModal}
          setIsRegionalSkeletonModal={setIsRegionalSkeletonModal}
          map={map}
        />
      )}

      <GeoSideBar
        buttons={[
          // isLoadingAdditionalMapData || isFetchingDetailData ? <GeoIconButton iconType={'load_spinner'} /> : null,

          // <GeoIconButton
          //   iconType="settings"
          //   handleClick={() => {
          //     setIsMapSettingsOpen(true);
          //     //routerRest.history.push({ pathname: '/map/89771', state: undefined });
          //     //if (routerRest?.match?.params?.id) {
          //     // getFeatureByRoadId(routerRest?.match?.params?.id);
          //     // const id = routerRest?.match?.params?.id;
          //     // const response = await axios.get(
          //     //   `${geoserverApiUrl}/skdf_open/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=skdf_open:zoom_1_roads,zoom_2_roads,zoom_3_roads,zoom_4_roads&outputFormat=application/json&srsname=EPSG:3857&cql_filter=road_id=${id}`
          //     // );
          //     // debugger;
          //     // const wktOptions = {
          //     //   dataProjection: 'EPSG:3857',
          //     //   featureProjection: 'EPSG:3857',
          //     // };
          //     // //map.addInteraction(selectedItems);
          //     // const feature = new GeoJSON().readFeature(response?.data?.features?.[1]);
          //     // const extent = feature.getGeometry().getExtent();
          //     // //map.getView().fit(extent);
          //     // selected.getStroke().setWidth(26);
          //     // selected.getFill().setColor('#16c6e0');
          //     // feature.setStyle(selected);
          //     // select.getFeatures().clear();
          //     // console.log(feature, extent);
          //     // debugger;
          //     // //you can fill the selection interaction programmatically
          //     // select.getFeatures().push(feature);
          //     // select.setActive(true);
          //     // // select.dispatchEvent({
          //     // //   type: 'select',
          //     // //   selected: [feature],
          //     // //   deselected: [],
          //     // // });
          //     // //console.log(response, feature);
          //     // }
          //   }}
          // />,
          <GeoIconButton
            iconType={'list_on_map'}
            handleClick={() => {
              setIsRegionalSkeletonModal(true);
            }}
            tooltipName="Карта региональной опорной сети"
            tooltipPlacement="left"
            tooltipId="tooltip-print-btn"
          />,
          <GeoIconButton
            iconType={isExporting ? 'load_spinner' : 'printer'}
            handleClick={() => {
              const winEvent: any = window.event;
              exportMap(winEvent);
            }}
            tooltipName="Печать"
            tooltipPlacement="left"
            tooltipId="tooltip-print-btn"
          />,
          // <GeoIconButton
          //   iconType={isExporting ? 'load_spinner' : 'printer'}
          //   handleClick={() => {
          //     const winEvent: any = window.event;
          //     exportMap(winEvent);
          //   }}
          // />,
          <GeoIconButton
            iconType="map"
            handleClick={() => {
              setIsGeoMapCoordOpen(!isGeoMapCoordOpen);
            }}
            tooltipName="Координаты"
            tooltipPlacement="left"
            tooltipId="tooltip-map-btn"
          />,

          //Линейка
          <GeoIconButton
            iconType="ruler"
            isActive={mapMode === 'ruler'}
            handleClick={() => {
              if (mapMode === 'ruler') {
                dispatch(setMapMode('navigation'));
                rulerRemoveInteraction();
              } else {
                dispatch(setMapMode('ruler'));
                rulerAddInteraction();
              }
            }}
            tooltipName="Линейка"
            tooltipPlacement="left"
            tooltipId="tooltip-ruler-btn"
          />,
          <GeoIconButton
            iconType="find_me"
            tooltipName="Текущее местоположение"
            tooltipPlacement="left"
            handleClick={async () => {
              if (currentGeolocation && currentGeolocation.length > 0) {
                map.getView().setCenter(currentGeolocation);
                map
                  .getLayers()
                  .getArray()
                  .forEach((layer: any) => {
                    if (layer.get('name') === 'position') {
                      layer.setVisible(!layer.getVisible());
                    }
                  });
              } else {
                geolocation.setTracking(true);
              }

              geolocation.on('change', async (evt) => {
                const position = geolocation.getPosition();
                const rescrObj = {
                  p_params: {
                    x: position?.[0],
                    y: position?.[1],
                  },
                };

                const describeResponse = await axios.post(`${pgApiUrl}/rpc/describe_position`, rescrObj, publicSchemaHeader);
                console.log(describeResponse);
                geolocationLabelRegionRef.current = describeResponse?.data;
                if (position && map) {
                  setCurrentGeolocation(position);
                  map
                    .getLayers()
                    .getArray()
                    .forEach((layer: any) => {
                      if (layer.get('name') === 'position') {
                        const source = layer.getSource();
                        const feature = source.getFeatures();
                        console.log(source, feature);
                        feature?.[0].setGeometry(position ? new Point(position) : null);
                      }
                    });
                  map.getView().setCenter(position);
                }
              });
            }}
            tooltipId="tooltip-find-btn"
          />,
          // <GeoIconButton
          //   iconType="list"
          //   handleClick={() => {
          //     removePicketFeature();
          //   }}
          // />,
          // <GeoIconButton iconType="list" handleClick={() => setIsFiltersOpen(!isFiltersOpen)} />,

          // <GeoIconButton
          //   iconType="find_me"
          //   handleClick={() => {
          //     if (currentGeolocation && currentGeolocation.length > 0) {
          //       map.getView().setCenter(currentGeolocation);
          //       map
          //         .getLayers()
          //         .getArray()
          //         .forEach((layer: any) => {
          //           if (layer.get('name') === 'position') {
          //             layer.setVisible(!layer.getVisible());
          //           }
          //         });
          //     } else {
          //       geolocation.setTracking(true);
          //     }
          //     geolocation.on('change', function (evt) {
          //       const position = geolocation.getPosition();
          //       if (position && map) {
          //         setCurrentGeolocation(position);
          //         map
          //           .getLayers()
          //           .getArray()
          //           .forEach((layer: any) => {
          //             if (layer.get('name') === 'position') {
          //               const source = layer.getSource();
          //               const feature = source.getFeatures();
          //               console.log(source, feature);
          //               feature?.[0].setGeometry(position ? new Point(position) : null);
          //             }
          //           });
          //         map.getView().setCenter(position);
          //       }
          //     });
          //   }}
          // />,
          // <GeoIconButton iconType="internet_search" />,
          <GeoZoomButton
            handleClickPlus={() => {
              const currentZoom = map.getView().getZoom();
              const view = map.getView();
              view.animate({
                zoom: Number(currentZoom) + 1,
                duration: 200,
              });
            }}
            handleClickMinus={() => {
              const currentZoom = map.getView().getZoom();
              const view = map.getView();
              view.animate({
                zoom: Number(currentZoom) - 1,
                duration: 200,
              });
            }}
          />,
        ]}
      />

      <MapLayersButton
        map={map}
        currentBaseMap={currentBaseMap}
        setCurrentBaseMap={setCurrentBaseMap}
        mapLayers={mapLayers}
        setMapLayers={setMapLayers}
        collapseLayersControl={collapseLayersControl}
        setCollapseLayerControl={setCollapseLayerControl}
        setIsCreateMessage={setIsCreateMessage}
        isCreateMessage={isCreateMessage}
        isEditGeom={isEditGeom}
        setIsEditGeom={setIsEditGeom}
        // funcTest={funcTest}
        // messageGeolocation={messageGeolocation}
        // showMessageOnMap={showMessageOnMap}
        // removeFeatures={removeFeatures}
        // closestPoint={closestPoint}
      />
    </div>
  );

  const lidarUI = (
    <div style={{ minWidth: '500px', minHeight: '500px', width: '100vw', height: '100vh' }}>
      {selectedRoadId && <GeoLidarComponent url={lidarUrl} roadId={selectedRoadId.toString()} />}
    </div>
  );

  const diagUI = (
    <div style={{ minWidth: '500px', minHeight: '500px', width: '100vw', height: '100vh' }}>
      {selectedRoadId && <GeoDiagInterface roadId={selectedRoadId} selectedFeature={selectedFeature.getProperties()} />}
    </div>
  );

  const panoramaUI = (
    <div style={{ minWidth: '500px', minHeight: '500px', width: '100vw', height: '100vh' }}>
      {selectedRoadId && <GeoPanoramaComponent url={panoramaUrl} roadId={selectedRoadId.toString()} />}
    </div>
  );

  // @ts-ignore
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        // xJustifyContent: 'space-around',
        // xAlignItems: 'stretch'
      }}
    >
      {/* {isLoadingAdditionalMapData && (
        <div style={{ position: 'absolute', zIndex: 99999, bottom: '20px', left: '20px' }}>
          <GeoLoader />
        </div>
      )} */}
      <iframe
        id="printmap"
        name="printmap"
        style={{ display: 'none', position: 'absolute', top: '0px', left: '0px', zIndex: '9999' }}
      ></iframe>
      <div
        style={{
          position: 'absolute',
          zIndex: 99999,
          bottom: '0px',
          left: '0px',
          width: '30px',
          height: '30px',
        }}
        onClick={(e) => {
          const winEvent: any = window.event;
          const shift = winEvent.shiftKey;
          if (winEvent?.shiftKey && winEvent?.altKey) {
            setIsMapSettingsOpen(true);
          }
        }}
      ></div>
      {isLoadingAdditionalMapData && (
        // || isFetchingDetailData
        <GeoSpinnerLine />
      )}
      {mapMode !== 'diag' && (
        <div style={{ width: '400px', flex: isFiltersOpen || isOpenCardDetail ? '0 0 400px' : '0 0 0px' }}>
          {isFiltersOpen && (mapMode === 'navigation' || mapMode === 'sendmessage' || mapMode === 'ruler') ? (
            <>
              {/* <GeoIconButton
            iconType="arrow-left"
            handleClick={() => {
              setIsFiltersOpen(!isFiltersOpen);
              setTimeout(() => {
                map.updateSize();
              }, 200);
            }}
            classes="GeoFilters__close__btn"
          /> */}

              <GeoFilters
                isResetBtnActive={isResetBtnActive}
                isFiltersOpen={isFiltersOpen}
                setIsFiltersOpen={setIsFiltersOpen}
                routerRest={routerRest}
                isSearchingFeature={isSearchingFeature}
                setIsSearchingFeature={setIsSearchingFeature}
                mapLayers={mapLayers}
                setMapLayers={setMapLayers}
                updateMapSize={updateMapSize}
              />
            </>
          ) : (
            <GeoIconButton
              iconType="arrow-right"
              handleClick={() => {
                setIsFiltersOpen(!isFiltersOpen);
                updateMapSize();
              }}
              classes="geoIconButton__noleft-radius geoIconButton__leftside"
            />
          )}
          {isEditGeom && mapMode === 'editgeom' && editObjectModeRef.current === 'road' && (
            <GeoEditGeom
              map={map}
              routerRest={routerRest}
              isEditGeom={isEditGeom}
              setIsEditGeom={setIsEditGeom}
              mapLayers={mapLayers}
              setMapLayers={setMapLayers}
              selectedRoadId={selectedRoadId}
              selectedRoadPartId={selectedRoadPartId}
            />
          )}
          {isEditGeom && mapMode === 'editgeom' && editObjectModeRef.current === 'bridge' && (
            <GeoEditGeomBridge
              map={map}
              routerRest={routerRest}
              isEditGeom={isEditGeom}
              setIsEditGeom={setIsEditGeom}
              mapLayers={mapLayers}
              setMapLayers={setMapLayers}
              selectedBridgeId={selectedBridgeId}
            />
          )}
          {/* <GrafCard isGrafCardOpen={true} setIsGrafCardOpen={true} selectedEdgeId="53a5e741-1ac2-4bed-b6b7-ba3a8b56c117" /> */}
          {isOpenCardDetail &&
            (mapMode === 'navigation' || mapMode === 'ruler' || mapMode === 'lidar' || mapMode === 'panorama') &&
            ((roadworks5y && Object.keys(roadworks5y).length > 0) ||
              selectedRoadId ||
              selectedRoadPartId ||
              selectedBackBoneId ||
              selectedEdgeId ||
              selectedBridgeId) && (
              <GeoMapCardDetail
                id_road={selectedRoadId}
                routerRest={routerRest}
                selectedRoadPartId={selectedRoadPartId}
                selectedFeature={selectedFeature}
                isOpenCardDetail={isOpenCardDetail}
                setIsOpenCardDetail={setIsOpenCardDetail}
                getGeoJson={() => saveGeoJSON(selectedRoadId)}
                getFlatnessFile={() => getFlatnessFeatureFile(selectedRoadId)}
                map={map}
                // @ts-ignore
                isDiagnosticsModal={isDiagnosticsModal}
                setIsDiagnosticsModal={setIsDiagnosticsModal}
                mapLayers={mapLayers}
                backBoneId={selectedBackBoneId}
                selectedEdgeId={selectedEdgeId}
                selectedBridgeId={selectedBridgeId}
                updateMapSize={updateMapSize}
                removePicketFeature={() => {
                  removePicketFeature();
                }}
                searchAndAddPicketFeature={() => {
                  searchAndAddPicketFeature();
                }}
                roadworks5y={roadworks5y}
                removeRoadworks5yFeature={() => {
                  removeRoadworks5yFeature();
                }}
                getRoadName={getRoadName}
                setIsEditGeom={setIsEditGeom}
                setSelectedBridgeId={setSelectedBridgeId}
                selectedBridgeIdRef={selectedBridgeIdRef}
              />
            )}
        </div>
      )}

      {/* <div
        style={{
          width: '200px',
          height: '100px',
          backgroundColor: '#cecece',
          position: 'absolute',
          top: '300px',
          right: '50px',
          zIndex: 99999,
        }}
        onClick={() => {
          console.log(mapElement, mapRef, map);
          setIsMapOpen(!isMapOpen);
        }}
      >
        Скрыть
      </div> */}
      {/* {isMapOpen && ( */}
      {/** Сюда вставлять UI */}
      {mapMode === 'navigation' && mapUI}
      {mapMode === 'ruler' && mapUI}
      {mapMode === 'editgeom' && mapUI}
      {mapMode === 'sendmessage' && mapUI}
      {mapMode === 'lidar' && lidarUI}
      {mapMode === 'diag' && diagUI}
      {mapMode === 'panorama' && panoramaUI}

      <div style={{ display: 'none' }}>
        <div id="popup"></div>
        {/* <div key="popupHover" id="popup" className="ol-popup">
          <div id="popup-content">{hoverContent}</div>
        </div> */}
      </div>
    </div>
  );
};

export default MapComponent;
