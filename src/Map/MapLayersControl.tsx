import React, { useState, useEffect, useRef, FC } from 'react';
import { baseMapLayers, wmsTileLayers } from './layers.mock';
import './MapComponent.scss';
import { Col, Container, Form, Row } from 'react-bootstrap';

type MapLayersControlTypes = {
  map: any;
  currentBaseMap: any;
  setCurrentBaseMap: any;
  mapLayers: any;
  setMapLayers: any;
};

const MapLayersControl: FC<MapLayersControlTypes> = ({ map, currentBaseMap, setCurrentBaseMap, mapLayers, setMapLayers }) => {
  const basemapSwitcher = (baseMapLayer) => {
    try {
      const layers = map.getLayers();
      layers.forEach((item) => {
        const groupName = item.get('name');
        if (groupName === 'basemap') {
          //const groups = map.getLayerGroup(groupName);
          const groupLayers = item.getLayers().getArray();
          groupLayers.forEach((layer) => {
            const baseLayerName = layer.get('name');
            layer.setVisible(baseLayerName === baseMapLayer);
          });
        }
      });
    } catch (error: any) {
      console.error(`Ошибка при изменении видимости базовой карты основы! ${error}`);
    }
  };

  const layersSwitcher = (tileLayers) => {
    try {
      const layers = map.getLayers();
      layers.forEach((item) => {
        const groupName = item.get('name');
        if (groupName === 'layers-wms') {
          const groupLayers = item.getLayers().getArray();
          groupLayers.forEach((layer, index) => {
            const layerName = layer.get('name');
            layer.setVisible(tileLayers?.[layerName] && tileLayers?.[layerName]?.checked);
          });
        }
      });
    } catch (error: any) {
      console.error(`Ошибка при изменении видимости базовой карты основы! ${error}`);
    }
  };

  useEffect(() => {
    basemapSwitcher(currentBaseMap);
  }, [currentBaseMap]);

  return (
    <Container className="layersControlPanel scrollbar scrollbardiv">
      <Row style={{ margin: '0px', padding: '0px' }}>
        <Col style={{ margin: '0px', padding: '0px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px', padding: '10px' }}>Картографическая основа</div>
          {baseMapLayers &&
            baseMapLayers.map((item, index) => {
              return (
                <Form.Check
                  type="radio"
                  checked={currentBaseMap === item.name ? true : false}
                  onChange={() => {
                    setCurrentBaseMap(item.name);
                  }}
                  id={`${item.name}_${index}`}
                  label={item?.title}
                  key={`cartographic_basis_${item.name}_${index}`}
                />
              );
            })}
        </Col>
      </Row>

      <Row style={{ margin: '0px', padding: '0px' }}>
        <Col style={{ margin: '0px', padding: '0px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px', padding: '10px' }}>Автомобильные дороги</div>
          {wmsTileLayers &&
            wmsTileLayers.map((item, index) => {
              return (
                <Form.Check
                  type="checkbox"
                  checked={mapLayers && Object.keys(mapLayers).length > 0 ? mapLayers?.[item.name]?.checked : index === 0}
                  onChange={(e) => {
                    const currentLayers = { ...mapLayers };
                    currentLayers[item.name] = { checked: e.target.checked, name: item.name };
                    setMapLayers(currentLayers);
                    layersSwitcher(currentLayers);
                  }}
                  id={`${item.name}_${index}`}
                  label={<span style={{ fontSize: '14px', fontWeight: 500 }}>{item.title}</span>}
                  key={`roads_${item.name}_${index}`}
                />
              );
            })}
        </Col>
      </Row>
    </Container>
  );
};

export default MapLayersControl;
