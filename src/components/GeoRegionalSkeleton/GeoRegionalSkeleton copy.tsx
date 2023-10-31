import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GeoRegionalSkeletonTypes } from './GeoRegionalSkeleton.types';
import { Controller, useForm } from 'react-hook-form';
import './GeoRegionalSkeleton.scss';
import GeoIcon from '../GeoIcon';
import { pgApiUrl, publicSchemaHeader } from '../../config/constants';
import GeoSingleSelect from '../GeoForms/GeoSingleSelect/GeoSingleSelect';
import { useAppDispatch, useAppSelector } from '../../config/store';
import { setEnabled, setIsRoadShaded, setSelectedRegion } from '../../reducers/mapRegionalSkeleton.reducer';

const GeoRegionalSkeleton = ({
  mapLayers,
  setMapLayers,
  isRegionalSkeletonModal,
  setIsRegionalSkeletonModal,
  map,
}: GeoRegionalSkeletonTypes) => {
  const [regions, setRegions] = useState<any>([]);
  const [isRegionsLoading, setIsRegionsLoading] = useState<boolean>(false);
  const selectedRegion = useAppSelector((state) => state.mapregskeleton.selectedRegion);
  const isRoadShaded = useAppSelector((state) => state.mapregskeleton.isRoadShaded);
  const isEnabled = useAppSelector((state) => state.mapregskeleton.isEnabled);
  const { handleSubmit, control } = useForm();
  const dispatch = useAppDispatch();

  const getRegions = () => {
    setIsRegionsLoading(true);
    // const obj = {
    //   p_params: {
    //     FILTER: {
    //       ENTITY_CODE: 123445555,
    //       TEXT_SEARCH: '',
    //     },
    //     PAGING: {
    //       START_POSITION: 0,
    //       LIMIT_ROWS: 100,
    //     },
    //   },
    // };
    const body: any = {
      p_params: {
        FILTER: {
          LEVEL: 1,
        },
        LIMIT: 400,
      },
    };
    axios
      //.post(`${pgApiUrl}/rpc/get_entity_list`, obj, publicSchemaHeader)
      .post(`${pgApiUrl}/rpc/f_get_adm_division`, body, publicSchemaHeader)
      .then((response) => {
        setRegions(response.data?.[1]);
        setIsRegionsLoading(false);
      })
      .catch((error) => {
        setIsRegionsLoading(false);
        console.error(`Ошибка при получении перечня регионов! ${error}`);
      });
  };

  useEffect(() => {
    getRegions();
  }, []);

  const disabledMode = () => {
    try {
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
            layer.setVisible(true);
          }
          if (lname === 'lyr_road_conditions_skeleton') {
            layer.setVisible(false);
          }
          if (lname === 'lyr_road_conditions_skeleton') {
            const source = layer.getSource();
            const params = source.getParams();
            delete params.CQL_FILTER;
            const layers = { ...mapLayers };
            for (let key in layers) {
              if (layers.hasOwnProperty(key)) {
                delete layers[key];
              }
            }
            layers.lyr_road_conditions_skeleton = { checked: false, name: 'lyr_road_conditions_skeleton' };
            layers.lyr_road_by_value = { checked: true, name: 'lyr_road_by_value' };
            setMapLayers(layers);
            layer.setVisible(false);
            source.updateParams(params);
          }
        });

      const wmsRegionalSkeletonGroup: any = map
        .getLayers()
        .getArray()
        .filter((item, index, array) => item.get('name') === 'regional-skeleton-wms')?.[0];
      wmsRegionalSkeletonGroup
        .getLayers()
        .getArray()
        .forEach((layer) => {
          const lname = layer.get('name');
          const source = layer.getSource();
          const params = source.getParams();
          if (lname === 'lyr_location_regions_shaded') {
            const source = layer.getSource();
            const params = source.getParams();
            delete params.CQL_FILTER;
            layer.setVisible(false);
            source.updateParams(params);
          }
          if (lname === 'lyr_location_regions_unshaded') {
            const source = layer.getSource();
            const params = source.getParams();
            delete params.CQL_FILTER;
            layer.setVisible(false);
            source.updateParams(params);
          }
          if (lname === 'lyr_road_conditions_skeleton_shaded') {
            const source = layer.getSource();
            const params = source.getParams();
            delete params.CQL_FILTER;
            layer.setVisible(false);
            source.updateParams(params);
          }
        });
      dispatch(setSelectedRegion(null));
      dispatch(setEnabled(false));
      setIsRegionalSkeletonModal(false);
    } catch (error: any) {
      console.error(`Ошибка при выходе из карты региональной опорной сети`);
    }
  };

  const onSubmit = (formData) => {
    dispatch(setSelectedRegion(formData?.region));
    dispatch(setIsRoadShaded(formData?.shadeRoad));
    dispatch(setEnabled(true));
    const wmsGroup: any = map
      .getLayers()
      .getArray()
      .filter((item, index, array) => item.get('name') === 'layers-wms')?.[0];
    wmsGroup
      .getLayers()
      .getArray()
      .forEach((layer) => {
        const lname = layer.get('name');
        let filter = '';
        layer.setVisible(false);
        // if (lname === 'lyr_road_conditions_skeleton') {
        //   layer.setVisible(true);
        // }
        if (lname === 'lyr_road_conditions_skeleton') {
          const source = layer.getSource();
          const params = source.getParams();
          if (formData?.shadeRoad) {
            filter = `(region_gid IN (${formData?.region?.value}))`;
            params.CQL_FILTER = filter;
            //layer.setVisible(true);
          } else {
            delete params.CQL_FILTER;
            //layer.setVisible(true);
          }
          layer.setVisible(true);
          const layers = { ...mapLayers };
          for (let key in layers) {
            if (layers.hasOwnProperty(key)) {
              delete layers[key];
            }
          }
          layers.lyr_road_conditions_skeleton = { checked: true, name: 'lyr_road_conditions_skeleton' };
          setMapLayers(layers);
          source.updateParams(params);
        }
      });

    const wmsRegionalSkeletonGroup: any = map
      .getLayers()
      .getArray()
      .filter((item, index, array) => item.get('name') === 'regional-skeleton-wms')?.[0];

    wmsRegionalSkeletonGroup
      .getLayers()
      .getArray()
      .forEach((layer) => {
        const lname = layer.get('name');
        //const visibilityLayer = formData?.enableMode;
        let filter = '';
        const source = layer.getSource();
        const params = source.getParams();

        if (lname === 'lyr_location_regions_shaded') {
          layer.setVisible(true);
          filter = `(region_gid NOT IN (${formData?.region?.value}))`;
        }
        if (lname === 'lyr_location_regions_unshaded') {
          layer.setVisible(true);
          filter = `(region_gid IN (${formData?.region?.value}))`;
        }
        //if (lname === 'lyr_road_by_value_shaded') filter = `(region_gid NOT IN (${formData?.region?.value}))`;
        if (lname === 'lyr_road_conditions_skeleton_shaded') {
          if (formData?.shadeRoad) {
            layer.setVisible(true);
            filter = `(region_gid NOT IN (${formData?.region?.value}))`;
          } else {
            filter = '';
            delete params.CQL_FILTER;
            layer.setVisible(false);
          }
        }
        if (filter !== '') {
          params.CQL_FILTER = filter;
          source.updateParams(params);
        }
      });
    const body = {
      dimmember_gid: formData?.region?.value,
    };

    axios
      .post(`${pgApiUrl}/rpc/f_get_adm_centroid`, body, publicSchemaHeader)
      .then((response) => {
        map.getView().setCenter([response?.data?.lon, response?.data?.lat]);
        map.getView().setZoom(response?.data?.zoom);
      })
      .catch((error) => {
        console.error(`Ошибка при центрировании карты! ${error}`);
      });

    setIsRegionalSkeletonModal(false);
  };

  return (
    <Modal
      centered
      scrollable
      show={isRegionalSkeletonModal}
      onHide={() => {
        setIsRegionalSkeletonModal(!isRegionalSkeletonModal);
      }}
      dialogClassName="mx-4 justify-content-center modal-100w"
      contentClassName="w-auto skdf-shadow-down-16dp"
    >
      <Modal.Header className="px-4 pb-3 flex-column align-items-stretch">
        <div className="d-flex justify-content-between align-items-center mt-2 gap-3">
          <h3 className="mb-0">Карта региональной опорной сети</h3>
          <div className="GeoRegionalSkeleton__header__close-btn">
            <GeoIcon
              name="close"
              iconType="close"
              onClick={() => {
                setIsRegionalSkeletonModal(!isRegionalSkeletonModal);
              }}
            />
          </div>
        </div>
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body style={{ minHeight: '340px', height: '340px' }} className="GeoRegionalSkeleton_modal px-4 py-0 pb-5">
          <div className="GeoRegionalSkeleton__item">
            <Controller
              control={control}
              name="region"
              rules={{ required: true }}
              defaultValue={selectedRegion}
              render={({ field }) => (
                <div className="mt-2 mb-4">
                  <span className="form-check-label cursorLayers mb-1">Регион</span>
                  <GeoSingleSelect
                    {...field}
                    isDisabled={isRegionsLoading}
                    isLoading={isRegionsLoading}
                    options={
                      regions &&
                      regions.length > 0 &&
                      regions.map((item) => ({
                        value: item?.id,
                        label: item?.name,
                      }))
                    }
                    placeholder="Регион"
                    //value={regionValue}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </div>
              )}
            />
          </div>
          <div className="GeoRegionalSkeleton__item">
            <Controller
              control={control}
              name="shadeRoad"
              //rules={{ required: true }}
              defaultValue={isRoadShaded}
              render={({ field }) => {
                return (
                  <div className="mt-3 mb-3">
                    <span>
                      <input
                        id="roadshaded"
                        key="roadshaded"
                        className="GeoRegionalSkeleton__input form-check-input"
                        type="checkbox"
                        checked={field?.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                        }}
                      />
                    </span>
                    <label htmlFor="roadshaded" className="form-check-label" style={{ paddingLeft: '10px' }}>
                      Затенять дороги
                    </label>
                  </div>
                );
              }}
            />
          </div>
          {/* <div className="GeoRegionalSkeleton__item">
            <Controller
              control={control}
              name="enableMode"
              rules={{ required: true }}
              defaultValue={true}
              render={({ field }) => {
                return (
                  <div className="mt-3 mb-3">
                    <span className="form-check form-switch">
                      <input
                        id="switch"
                        className="form-check-input"
                        type="checkbox"
                        checked={field?.value}
                        role="switch"
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                        }}
                      />
                      <label className="form-check-label cursorLayers mb-1">Активировать режим</label>
                    </span>
                  </div>
                );
              }}
            />
          </div> */}
          {/* <Row>
            <Col xs={6}>
              <Button variant="skdf-primary" className="mt-2 d-inline-flex justify-content-center w-100 align-items-center" type="submit">
                Применить
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                variant="skdf-stroke"
                className="d-inline-flex justify-content-center w-100 align-items-center mt-2"
                onClick={() => {
                  setIsRegionalSkeletonModal(!isRegionalSkeletonModal);
                }}
              >
                Отменить
              </Button>
            </Col>
          </Row> */}
        </Modal.Body>
        <Modal.Footer className="px-4 pb-3 flex-column align-items-stretch">
          <Row>
            <Col>
              <Button variant="skdf-primary" className="mt-2 d-inline-flex justify-content-center w-100 align-items-center" type="submit">
                Применить
              </Button>
            </Col>
            <Col>
              <Button
                variant="skdf-stroke"
                className="d-inline-flex justify-content-center w-100 align-items-center mt-2"
                onClick={() => {
                  setIsRegionalSkeletonModal(!isRegionalSkeletonModal);
                }}
              >
                Отменить
              </Button>
            </Col>
            {isEnabled && (
              <Col>
                <Button
                  style={{ color: '#ffffff' }}
                  className="btn btn-danger mt-2 d-inline-flex justify-content-center w-100 align-items-center"
                  onClick={disabledMode}
                >
                  Отключить
                </Button>
              </Col>
            )}
          </Row>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default GeoRegionalSkeleton;
