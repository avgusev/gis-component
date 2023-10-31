import React, { useState, useEffect, useRef, FC } from 'react';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import axios from 'axios';
import GeoJSON from 'ol/format/GeoJSON';
import { Map } from 'ol';
import LayerGroup from 'ol/layer/Group';
import { MapPassportTypes } from './MapPassport.types';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { applyStyle } from 'ol-mapbox-style';
import { toast, ToastContainer } from 'react-toastify';
import { defaults as defaultInteractions } from 'ol/interaction.js';
import { Icon, Style } from 'ol/style';
import Stroke from 'ol/style/Stroke';
import GeoLoader from '../components/GeoLoader/GeoLoader';
import { GeoIcon } from '../components/GeoIcon/GeoIcon';
import './MapPassport.scss';
import { Alert } from 'react-bootstrap';
import { geoserverApiUrl, gisapiSchemaHeader, pgApiUrl } from '../config/constants';
import { StyleLike } from 'ol/style/Style';
import { extend } from 'ol/extent';

const bridgeSvg = '<svg width="24" fill="none" height="24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#4378DD"/><path d="M20.333 5.333H3.667V7h16.666V5.333ZM3.667 12V7.833h16.666V12a2.5 2.5 0 0 0-2.5 2.5v4.167H14.5V14.5a2.5 2.5 0 0 0-5 0v4.167H6.167V14.5a2.5 2.5 0 0 0-2.5-2.5Z" fill="#FBFBFB"/></svg>';

const MapPassport: FC<MapPassportTypes> = ({ objectId, isEditGeom = false }) => {
  const [map, setMap] = useState<Map | undefined>();
  const [featuresLayer, setFeaturesLayer] = useState<any>();
  const [mapCenter, setMapCenter] = useState<number[]>([4179071.0049917055, 7494122.839563135]);
  const [isSearchingFeatures, setIsSearchingFeatures] = useState<boolean>(false);
  const [features, setFeatures] = useState<any>();
  const [objectType, setObjectType] = useState<any>(null);
  const mapElement: any = useRef();
  const mapRef: any = useRef();
  mapRef.current = map;
  const objectTypes = {
    4: {
      type: "road",
      field: "road_id"
    },
    890: {
      type: "bridge",
      field: "bridge_id"
    },
    // 40031: "ДТП",
    901: {
      type:"roadpart",
      field: "road_part_id"
    }
  }

  const OSMPKK = new VectorTileLayer({
    className: 'osm',
    properties: { name: 'osm' },
    declutter: true,
    visible: true,
    source: new VectorTileSource({
      format: new MVT(),
      url: 'https://pkk.rosreestr.ru/arcgis/rest/services/Hosted/BASEMAP_OSM/VectorTileServer/tile/{z}/{y}/{x}.pbf',
    }),
  });
  applyStyle(OSMPKK, 'https://pkk.rosreestr.ru/arcgis/rest/services/Hosted/BASEMAP_OSM/VectorTileServer/resources/styles/root.json');

  const scaleControl = new ScaleLine({
    units: 'metric',
    bar: false,
    steps: 4,
    text: true,
    maxWidth: 87,
  });

  const getObjectType = async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
      const response:any = await axios.post(`${pgApiUrl}/rpc/get_object_type`, { p_id: Number(id)}, gisapiSchemaHeader);
      if (response?.data) {
        setObjectType(response?.data);
        resolve(response?.data);
      } else {
        reject();
      }
      } catch(error) {
        reject();
        console.error('Миникарта. Ошибка при получении типа объекта!', error);
      }
    })
  }

  const getFeatures = async (id) => {
    try {
      const objType:any = await getObjectType(objectId);
      console.log(objType);
      let url = ''
      if (objectTypes?.[objType]?.type === "road") {
        url =  `${geoserverApiUrl}/skdf_open/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=skdf_open:zoom_1_roads,zoom_2_roads,zoom_3_roads,zoom_4_roads&outputFormat=application/json&srsname=EPSG:3857&cql_filter=road_id=${id}`
      } else if (objectTypes?.[objType]?.type === "roadpart") {
        url = `${geoserverApiUrl}/skdf_open/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=skdf_open:zoom_1_roads,zoom_2_roads,zoom_3_roads,zoom_4_roads&outputFormat=application/json&srsname=EPSG:3857&cql_filter=road_part_id=${id}`
      } else if (objectTypes?.[objType]?.type === "bridge") {
        url = `${geoserverApiUrl}/skdf_open/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=skdf_open:lyr_bridge_point_edit&outputFormat=application/json&srsname=EPSG:3857&cql_filter=bridge_id=${id}`
      }
      setIsSearchingFeatures(true);
      const response = await axios.get(url);
      if (response?.data?.features && response?.data?.features.length > 0) {
        setFeatures(response?.data);
      } else {
        setFeatures(null);
        setIsSearchingFeatures(false);
        toast.warn(`Запрашиваемая геометрия не найдена`);
      }
    } catch (error: any) {
      setIsSearchingFeatures(false);
      console.error(`Ошибка при получении данных по объекту! ${error?.response?.data?.message ? error.response.data.message : error}`);
    }
  };

  useEffect(() => {
    try {
      if (features?.features && features?.features.length > 0 && featuresLayer) {
        const source = featuresLayer.getSource();
        source.addFeatures(new GeoJSON().readFeatures(features));
        const featuresWithGeometry = features.features.filter((item) => item?.geometry);
        if (featuresWithGeometry && featuresWithGeometry.length > 0) {
          const feature = new GeoJSON().readFeature(featuresWithGeometry?.[0]);
          const geometry = feature.getGeometry();
          const extent = geometry.getExtent();
          map.getView().fit(features?.bbox, {
            padding: [50, 50, 50, 50],
            maxZoom: 13,
            size: map.getSize(),
            // , duration: 500
          });
        } else {
          setFeatures(null);
          toast.warn(`Отсутствует геометрия у вабранного объекта`);
        }
      }
      setIsSearchingFeatures(false);
    } catch (error) {
      setIsSearchingFeatures(false);
      toast.error(`Ошибка при попытке отрисовать объект! ${error}`);
    }
  }, [featuresLayer, features, map]);

  useEffect(() => {
    if (objectId && objectId !== '' && map) {     
      getFeatures(objectId);
    }
  }, [map, objectId]);

  useEffect(() => {
    const initalFeaturesLayer: any = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
      }),
      style: (feature, layer) => {
        let style;
        const geometry = feature.getGeometry();
        const type = geometry.getType();        
        if (type === "Point") {          
          return new Style({
            image: new Icon({
              src: 'data:image/svg+xml;utf8,' + encodeURIComponent(bridgeSvg),
            }),
          });
        }
        return [
          new Style({
            stroke: new Stroke({
              color: '#4e79e0',
              width: 9,
            }),
            zIndex: 0,
          }),
          new Style({
            stroke: new Stroke({
              color: '#ffffff',
              width: 3,
            }),
            zIndex: 1,
          }),
        ];
      },
    });

    const initialMap: any = new Map({
      target: mapElement.current,
      controls: defaultControls({ zoom: false }).extend([scaleControl]),
      layers: [
        new LayerGroup({
          properties: { name: 'basemap' },
          layers: [OSMPKK],
        }),
        new LayerGroup({
          properties: { name: 'anno' },
          layers: [
            new TileLayer({
              className: 'anno',
              properties: { name: 'anno' },
              visible: true,
              source: new XYZ({
                url: 'https://pkk.rosreestr.ru/arcgis/rest/services/BaseMaps/Anno/Mapserver/tile/{z}/{y}/{x}?blankTile=false',
                crossOrigin: 'anonymous',
              }),
            }),
          ],
        }),
        initalFeaturesLayer,
      ],
      overlays: [],
      interactions: defaultInteractions({
        doubleClickZoom: false,
        dragPan: false,
        mouseWheelZoom: false,
      }),
      view: new View({
        projection: 'EPSG:3857',
        center: mapCenter,
        zoom: 7,
      }),
    });
    setFeaturesLayer(initalFeaturesLayer);
    setMap(initialMap);
    //applyStyle(OSMPKK, 'https://pkk.rosreestr.ru/arcgis/rest/services/Hosted/BASEMAP_OSM/VectorTileServer/resources/styles/root.json');
  }, [mapElement]);

  useEffect(() => {
    if (map && mapRef?.current) {
      map.on('moveend', (e: any) => {
        const contScale: any = document.getElementsByClassName('ol-scale-line-inner');
        if (contScale && contScale.length > 0) {
          if (contScale?.[0]?.innerHTML.includes('km')) {
            contScale[0].innerHTML = contScale?.[0]?.innerHTML.replace('km', 'км');
          } else if (contScale?.[0]?.innerHTML.includes('m')) {
            contScale[0].innerHTML = contScale?.[0]?.innerHTML.replace('m', 'м');
          }
        }
      });
    }
  }, [map]);

  const updateMapSize = () => {
    setTimeout(() => {
      if (map) map.updateSize();
    }, 50);
  };

  useEffect(() => {
    updateMapSize();
  }, [isEditGeom]);

  // @ts-ignore
  return (
    <div className="mapPassportContainer">
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}
      <div className="mapContainer" ref={mapElement} id="map-passport">
        {isSearchingFeatures ? (
          <div className="backDrop">
            <div className="spinnerContainer">
              <GeoLoader //color="#ffffff"
              />
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center redirectButtonContainer">
            <div className="redirectButton">
              {features ? (
                isEditGeom ? (
                  <a href={`/map/${objectTypes?.[objectType]?.type}/${objectId}/edit`} className="mb-3 btn btn-skdf-ghost btn-icon bg-white skdf-shadow-down-16dp">
                    <GeoIcon name="route_3" iconType="route_3" />
                    <span>Редактировать геометрию</span>
                  </a>
                ) : (
                  <a href={`/map/${objectTypes?.[objectType]?.type}/${objectId}/show`} className="mb-3 btn btn-skdf-ghost btn-icon bg-white skdf-shadow-down-16dp">
                    <GeoIcon name="map" iconType="map" />
                    <span>Показать на карте</span>
                  </a>
                )
              ) : isEditGeom ? (
                <a href={`/map/${objectTypes?.[objectType]?.type}/${objectId}/edit`} className="mb-3 btn btn-skdf-ghost btn-icon bg-white skdf-shadow-down-16dp">
                  <GeoIcon name="route_3" iconType="route_3" />
                  <span>Нарисовать на карте</span>
                </a>
              ) : (
                <Alert variant="warning">Не найдено</Alert>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPassport;
