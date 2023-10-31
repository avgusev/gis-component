import React, { FC, useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import '../GeoCheckboxGroup/GeoCheckboxGroup.scss';
import GeoIconButton from '../GeoIconButton';
import GeoCartographicSwitcher from '../GeoCartographicSwitcher/GeoCartographicSwitcher';
import { GeoLayersSwitcherTypes } from './GeoLayersSwitcher.types';
import { wmsTileLayers } from '../../Map/layers.mock';
import VectorSource from 'ol/source/Vector';
import './GeoLayersSwitcher.scss';
import { GeoIcon, GeoIconMap } from '../GeoIcon/GeoIcon';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Tooltip from 'react-bootstrap/esm/Tooltip';
import GeoDoubleRangeSlider from '../GeoDoubleRangeSlider/GeoDoubleRangeSlider';

const GeoLayersSwitcher: FC<GeoLayersSwitcherTypes> = ({
  isOpen,
  handleClick,
  map,
  currentBaseMap,
  setCurrentBaseMap,
  mapLayers,
  setMapLayers,
}) => {
  const [groups, setGroups] = useState<any>([]);

  const layersSwitcher = (tileLayers) => {
    try {
      const layers = map.getLayers();
      layers.forEach((item) => {
        const groupName = item.get('name');
        if (groupName === 'layers-wms') {
          const groupLayers = item.getLayers().getArray();
          groupLayers.forEach((layer, index) => {
            const layerName = layer.get('name');
            //ВРЕМЕННО закоментил
            // const source = layer.getSource();
            // if (source instanceof VectorSource) {
            //   const url = source.getUrl();
            //   console.log('url wfs:', url);
            // }
            // debugger;
            if (layerName !== 'lyr_wfs_1z_road_>40_mln') {
              layer.setVisible(tileLayers?.[layerName] && tileLayers?.[layerName]?.checked);
            }
          });
        }
      });
    } catch (error: any) {
      console.error(`Ошибка при изменении видимости слоев! ${error}`);
    }
  };

  useEffect(() => {
    setGroups([...new Set(wmsTileLayers.map((item) => item.group))]);
  }, []);

  return (
    <div className={`GeoLayersSwitcher__parent`}>
      {isOpen && (
        <Card className="skdf-shadow-down-16dp GeoLayersSwitcher__modal">
          <Card.Body className="GeoLayersSwitcher__modal__body ps-4 pe-3 py-4">
            <GeoCartographicSwitcher map={map} currentBaseMap={currentBaseMap} setCurrentBaseMap={setCurrentBaseMap} />
            {groups.map((group, gindex) => {
              return (
                <div className="GeoLayersSwitcher__modal__section" key={gindex}>
                  {group && group !== 'wfs' && (
                    <div className="GeoCheckboxGroup__title mb-3" style={{ textAlign: 'justify', cursor: 'pointer' }}>
                      {group}
                    </div>
                  )}
                  {wmsTileLayers
                    .filter((item) => item.group === group && item.type !== 'wfs')
                    .map((layer: any, lindex) => {
                      const childrenCheckboxes: any = layer?.children;
                      return (
                        <>
                          <Row className="mb-3 GeoLayersSwitcher__gutter" key={`r_${layer.name}`}>
                            <Col xs={1} className="pe-0">
                              <input
                                id={`${layer.name}_${lindex}`}
                                className="GeoCheckboxGroup__input form-check-input cursorLayers"
                                type="checkbox"
                                ref={(input) => {
                                  if (input) {
                                    if (childrenCheckboxes && childrenCheckboxes.length > 0 && mapLayers?.[layer.name]?.indeterminate) {
                                      input.indeterminate = true;
                                    } else {
                                      input.indeterminate = false;
                                    }
                                  }
                                }}
                                checked={mapLayers && Object.keys(mapLayers).length > 0 && mapLayers?.[layer.name]?.checked ? true : false}
                                onChange={(e) => {
                                  const currentLayers = { ...mapLayers };
                                  currentLayers[layer.name] = {
                                    checked: e.target.checked,
                                    name: layer.name,
                                  };

                                  if (layer.filterField) currentLayers[layer.name].filterField = layer.filterField;

                                  if (childrenCheckboxes && childrenCheckboxes.length > 0) {
                                    currentLayers[layer.name].children = {};
                                    if (e.target.checked) {
                                      childrenCheckboxes.forEach((childItem) => {
                                        currentLayers[layer.name].children[childItem?.code] = {
                                          checked: true,
                                          name: childItem?.name,
                                          parent: layer.name,
                                          filterValue: childItem?.filterValue,
                                        };
                                      });
                                    } else {
                                      childrenCheckboxes.forEach((childItem) => {
                                        currentLayers[layer.name].children[childItem?.code] = {
                                          checked: false,
                                          name: childItem?.name,
                                          parent: layer.name,
                                          filterValue: childItem?.filterValue,
                                        };
                                      });
                                    }
                                  }
                                  setMapLayers(currentLayers);
                                  layersSwitcher(currentLayers);
                                }}
                              />
                            </Col>
                            <Col xs={mapLayers?.[layer.name]?.checked ? 9 : 11}>
                              {' '}
                              <label htmlFor={`${layer.name}_${lindex}`} className="form-check-label cursorLayers">
                                {layer.title}
                              </label>
                            </Col>
                            {mapLayers?.[layer.name]?.checked && (
                              <Col xs={2} className="p-0" style={{ textAlign: 'end', height: '24px' }}>
                                <GeoIconMap iconType={layer.name} />
                              </Col>
                            )}
                          </Row>
                          {childrenCheckboxes && (mapLayers?.[layer.name]?.checked || mapLayers?.[layer.name]?.indeterminate) ? (
                            childrenCheckboxes.map((child) => (
                              <Row className="mb-3 GeoLayersSwitcher__gutter" key={`r1_${child.name}`}>
                                <Col xs={1} />
                                <Col xs={1}>
                                  <input
                                    id={`${child.name}_${lindex}`}
                                    className="GeoCheckboxGroup__input form-check-input cursorLayers"
                                    type="checkbox"
                                    // checked={mapLayers && Object.keys(mapLayers).length > 0 && mapLayers?.[layer.name]?.checked}
                                    checked={
                                      mapLayers &&
                                      Object.keys(mapLayers).length > 0 &&
                                      mapLayers?.[layer.name]?.children?.[child.code]?.checked
                                    }
                                    onChange={(e) => {
                                      const currentLayers: any = { ...mapLayers };
                                      // currentLayers[child.name] = { checked: e.target.checked, name: child.name };
                                      currentLayers[layer.name].children[child.code] = {
                                        checked: e.target.checked,
                                        name: child?.name,
                                        parent: layer.name,
                                        filterValue: child?.filterValue,
                                      };
                                      const currentChildLayers = currentLayers[layer.name].children;
                                      const childNotCheckedArray = Object.keys(currentChildLayers).filter((it) => {
                                        if (!currentChildLayers?.[it]?.checked) return true;
                                      });
                                      if (!e.target.checked) {
                                        currentLayers[layer.name].indeterminate = true;
                                        currentLayers[layer.name].checked = true;
                                      } else if (childNotCheckedArray.length === 0) {
                                        currentLayers[layer.name].indeterminate = false;
                                        currentLayers[layer.name].checked = true;
                                      }
                                      setMapLayers(currentLayers);
                                      //layersSwitcher(currentLayers);
                                    }}
                                  />
                                </Col>
                                <Col xs={8}>
                                  <label htmlFor={`${child.name}_${lindex}`} className="form-check-label cursorLayers">
                                    {child.name}
                                  </label>
                                </Col>
                                <Col xs={2} className="p-0" style={{ textAlign: 'end', height: '24px' }} key={`c4_${child.name}`}>
                                  {' '}
                                  {Object.keys(mapLayers).length > 0 && mapLayers?.[layer.name]?.children?.[child.code]?.checked && (
                                    <GeoIconMap iconType={child.code} />
                                  )}
                                </Col>
                              </Row>
                            ))
                          ) : (
                            <></>
                          )}
                          {Object.keys(layer).includes('range') && mapLayers?.[layer.name]?.checked ? (
                            <Row className="GeoLayersSwitcher__gutter GeoLayersSwitcher__item__range">
                              <Col xs={1} />
                              <Col xs={11}>
                                <GeoDoubleRangeSlider
                                  sliderName={layer.name}
                                  min={layer.range.min}
                                  max={layer.range.max}
                                  currentMin={
                                    mapLayers?.[layer.name]?.value && mapLayers?.[layer.name]?.value.length > 0
                                      ? mapLayers?.[layer.name]?.value?.[0]
                                      : null
                                  }
                                  currentMax={
                                    mapLayers?.[layer.name]?.value && mapLayers?.[layer.name]?.value.length > 0
                                      ? mapLayers?.[layer.name]?.value?.[1]
                                      : null
                                  }
                                  step={layer.range.step}
                                  stepCount={layer.range.stepCount}
                                  size={'fullwidth'}
                                  onChangeEvent={(min, max) => {
                                    const currentLayers = { ...mapLayers };
                                    currentLayers[layer.name] = {
                                      checked: true,
                                      name: layer.name,
                                      type: 'range',
                                      value: [min, max],
                                    };

                                    if (layer.filterField) currentLayers[layer.name].filterField = layer.filterField;

                                    setMapLayers(currentLayers);

                                    layersSwitcher(currentLayers);
                                  }}
                                />
                              </Col>
                            </Row>
                          ) : (
                            <></>
                          )}
                        </>
                      );
                    })}
                </div>
              );
            })}
          </Card.Body>
          {Object.values(mapLayers).findIndex((item: any) => {
            return item.checked === true && item.name !== 'lyr_road_by_value';
          }) > 0 && (
            <Card.Footer className="GeoLayersSwitcher__modal__footer px-4">
              <Button
                variant="skdf-stroke"
                className="d-inline-flex justify-content-center w-100 align-items-center mx-4"
                disabled={
                  Object.values(mapLayers).findIndex((item: any) => {
                    return item.checked === true && item.name !== 'lyr_road_by_value';
                  }) < 0
                }
                onClick={() => {
                  setMapLayers(
                    // {}
                    { lyr_road_by_value: { checked: true, name: 'lyr_road_by_value' } }
                  );
                }}
              >
                Скрыть все слои
              </Button>
            </Card.Footer>
          )}
        </Card>
      )}
      <GeoIconButton
        iconType="layers"
        content={'Слои'}
        handleClick={handleClick}
        badgeCount={
          mapLayers && Object.keys(mapLayers).length > 0 ? Object.keys(mapLayers).filter((item) => mapLayers[item]?.checked).length : 0
        }
      />{' '}
    </div>
  );
};

export default React.memo(GeoLayersSwitcher);
