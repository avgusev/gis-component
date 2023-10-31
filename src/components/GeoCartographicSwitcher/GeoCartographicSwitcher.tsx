import React, { useEffect, useState } from 'react';
import './GeoCartographicSwitcher.scss';
import { baseMapLayers } from '../../Map/layers.mock';
import { GeoCartographicSwitcherTypes } from './GeoCartographicSwitcher.types';
import { toast } from 'react-toastify';
import Rosreestr from '../../assets/images/rosreestr.jpg';
import OSM from '../../assets/images/schema.jpg';
import Hybrid from '../../assets/images/hybrid.jpg';
import Satellite from '../../assets/images/satellite.jpg';

const GeoCartographicSwitcher: React.FC<GeoCartographicSwitcherTypes> = ({ map, currentBaseMap, setCurrentBaseMap }) => {
  //const [currentLabelsLayer, setCurrentLabelsLayer] = useState<any>('lightAnno');
  const [currentLabelsLayer, setCurrentLabelsLayer] = useState<any>(null);
  const basemapSwitcher = (baseMapLayer, currentLabels) => {
    try {
      const layers = map.getLayers();
      layers.forEach((item) => {
        const groupName = item.get('name');
        if (groupName === 'basemap') {
          const groupLayers = item.getLayers().getArray();
          groupLayers.forEach((layer) => {
            const baseLayerName = layer.get('name');
            if (baseLayerName !== 'anno') {
              layer.setVisible(baseLayerName === baseMapLayer);
            }
          });
        } else if (groupName === 'labels') {
          const groupLayers = item.getLayers().getArray();
          groupLayers.forEach((layer) => {
            const annoName = layer.get('name');
            layer.setVisible(annoName === currentLabels);
          });
        }
      });
    } catch (error: any) {
      toast.error(`Ошибка при изменении видимости базовой карты основы! ${error}`);
    }
  };

  const changeOSMPKKRenderMode = (name) => {
    try {
      const baseLayerGroup: any = map
        .getLayers()
        .getArray()
        .filter((item, index, array) => item.get('name') === 'basemap')?.[0];
      baseLayerGroup
        .getLayers()
        .getArray()
        .forEach((layer) => {
          const lname = layer.get('name');
          if (lname === name) {
            const l = layer.getLayers().getArray()?.[0];
            const renderMode = l.get('renderMode');
            const renderBuffer = l.get('renderBuffer');
            if (renderMode === 'hybrid') {
              l.set('renderMode', 'vector');
              l.set('renderBuffer', '200');
              l.renderMode_ = 'vector';
              l.renderBuffer_ = '200';
            } else {
              l.set('renderMode', 'hybrid');
              l.set('renderBuffer', '100');
              l.renderMode_ = 'hybrid';
              l.renderBuffer_ = '100';
            }
            // l.changed();
            // l.getSource().clear();
            // l.getSource().changed();
            l.getSource().refresh();
          }
        });
    } catch (error: any) {
      console.error('Ошибка при изменении режима рендера подложки Росреестра:', error);
    }
  };

  // useEffect(() => {
  //   if (currentLabelsLayer === null) {

  //   }
  // }, [currentLabelsLayer]);

  useEffect(() => {
    if (currentLabelsLayer !== null) {
      basemapSwitcher(currentBaseMap, currentLabelsLayer);
    } else {
      baseMapLayers.forEach((item) => {
        if (item.name === currentBaseMap) {
          setCurrentLabelsLayer(item.labelsLayer);
        }
      });
    }
  }, [currentBaseMap, currentLabelsLayer]);

  return (
    <>
      <div className="mb-3">
        <div className="GeoCartographicSwitcher__title mb-3">Картографическая основа</div>
        <div className="GeoCartographicSwitcher__body">
          {baseMapLayers &&
            baseMapLayers.map((item, index) => {
              let typeSrc = null;
              switch (item.name) {
                case 'osm':
                  typeSrc = OSM;
                  break;
                case 'satellite':
                  typeSrc = Satellite;
                  break;
                case 'hybrid':
                  typeSrc = Hybrid;
                  break;
                case 'rosreestr':
                  typeSrc = Rosreestr;
                  break;
                default:
                  break;
              }
              return (
                <div
                  key={item.name}
                  onClick={(event) => {
                    const winEvent: any = window.event;
                    const shift = winEvent.shiftKey;
                    if (winEvent?.shiftKey) {
                      if (item.name === currentBaseMap) {
                        setCurrentBaseMap('');
                      } else {
                        setCurrentBaseMap(item.name);
                        setCurrentLabelsLayer(item.labelsLayer);
                      }
                    } else if (winEvent?.altKey && item.name === 'osm') {
                      if (item.name === currentBaseMap) {
                        changeOSMPKKRenderMode(item.name);
                      }
                    } else {
                      // Скрытие основы при повторном выборе текущей
                      // if (item.name === currentBaseMap) {
                      //   setCurrentBaseMap('');
                      // } else {
                      //   setCurrentBaseMap(item.name);
                      // }
                      setCurrentBaseMap(item.name);
                      setCurrentLabelsLayer(item.labelsLayer);
                    }
                  }}
                  className="GeoCartographicSwitcher__body__item"
                >
                  <img
                    src={typeSrc}
                    className={`GeoCartographicSwitcher__item__img ${
                      currentBaseMap === item.name ? 'GeoCartographicSwitcher__item__checked' : ''
                    }`}
                  />

                  <div className="GeoCartographicSwitcher__item__name">{item.title}</div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default GeoCartographicSwitcher;
