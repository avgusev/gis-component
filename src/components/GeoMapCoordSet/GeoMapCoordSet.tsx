import React, { FC, useEffect, useState } from 'react';
import { Button, Modal, Accordion, Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GeoSearchInput from '../GeoSearchInput/GeoSearchInput';
import GeoMapCoordSetTypes from './GeoMapCoordSet.types';
import './GeoMapCoordSet.scss';
import { Point } from 'ol/geom';
import { Projection } from 'ol/proj';
import { Controller, useForm } from 'react-hook-form';
import GeoInputField from '../GeoForms/GeoInputField/GeoInputField';
import { toast } from 'react-toastify';
import { Feature } from 'ol';
import { useAppDispatch } from '../../config/store';
import { pgApiUrl, publicSchemaHeader } from '../../config/constants';
import axios from 'axios';
import { setLocationCoord, setLocationDescription } from '../../reducers/map.reducer';

const GeoMapCoordSet: FC<GeoMapCoordSetTypes> = ({ isGeoMapCoordOpen, setIsGeoMapCoordOpen, map }) => {
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
  } = useForm();

  const dispatch = useAppDispatch();

  const [currentCoordinates, setCurrentCoordinates] = useState<any>(null);
  const epsg4326 = 'EPSG:4326';
  const epsg3857 = 'EPSG:3857';

  const transformto4326 = (coord) => {
    try {
      const coordinatesArr = coord.split(',');
      const point = new Point([coordinatesArr?.[0], coordinatesArr?.[1]]);
      point.transform(epsg3857, epsg4326);
      const newCoord = point.getCoordinates();

      setCurrentCoordinates(newCoord.join(','));
      //setCurrentCoordinates(coord);
    } catch (error) {
      console.error('Ошибка при изменении проекции координат', error);
    }
  };

  const transformto3857 = (coord) => {
    try {
      const coordinatesArr = coord.split(',');
      //const point = new Point([coordinatesArr?.[0], coordinatesArr?.[1]]);
      const point = new Point([coordinatesArr?.[1], coordinatesArr?.[0]]);
      point.transform(epsg4326, epsg3857);
      const newCoord = point.getCoordinates();
      //map.getView().setCenter(newCoord);
      return newCoord.join(',');
      //return coord;
    } catch (error) {
      console.error('Ошибка при изменении проекции координат', error);
      return;
    }
  };

  const readClipboardFromDevTools = () => {
    return new Promise((resolve, reject) => {
      const _asyncCopyFn = async () => {
        try {
          const value = await navigator.clipboard.readText();
          console.log(`${value} is read!`);
          resolve(value);
        } catch (e) {
          reject(e);
        }
        window.removeEventListener('focus', _asyncCopyFn);
      };

      window.addEventListener('focus', _asyncCopyFn);
      console.log('Hit <Tab> to give focus back to document (or we will face a DOMException);');
    });
  };

  // const readFromClipboard = async () => {
  //   //  const clipboard = await readClipboardFromDevTools();

  //   const inp: any = document.getElementById('coord');
  //   inp.focus();
  //   inp.select();

  //   window.navigator.clipboard.readText().then(
  //     (text) => {
  //       const coordArr = text.split(',');
  //       if (coordArr && text.split(',').length === 2) {
  //         transformto4326(text);
  //       }

  //       //setCurrentCoordinates(text);
  //     },
  //     (err) => {
  //       console.error('Ошибка при чтении координат из буфер обмена', err);
  //     }
  //   );
  // };

  const setPosition = async (coord) => {
    try {
      const transformCoord: any = transformto3857(coord);
      if (transformCoord && transformCoord.length > 0) {
        map
          .getLayers()
          .getArray()
          .forEach(async (layer: any) => {
            if (layer.get('name') === 'coordposition') {
              const coordinates = transformCoord.split(',');

              dispatch(setLocationCoord(coordinates));
              const rescrObj = {
                p_params: {
                  //srid: 3857,
                  x: Number(coordinates?.[0]),
                  y: Number(coordinates?.[1]),
                },
              };

              const describeResponse = await axios.post(`${pgApiUrl}/rpc/describe_position`, rescrObj, publicSchemaHeader);
              console.log(describeResponse.data);
              dispatch(setLocationDescription(describeResponse.data));

              layer.setVisible(true);
              const source = layer.getSource();
              //source.clear();
              const feature = source.getFeatures();

              //console.log(source, feature);
              feature?.[0].setGeometry(coordinates ? new Point(coordinates) : null);
              // source.addFeature(
              //   new Feature({
              //     id: 'coordposition',
              //     geometry: new Point(coord),
              //   })
              // );
              map.getView().setCenter(coordinates);
              setIsGeoMapCoordOpen(false);
            }
          });
      } else {
        toast.info('Заданы неверные координаты! Перемещение невозможно!');
      }
    } catch (error) {
      console.error('Ошика при перемещении по заданным координатам', error);
    }
  };

  const unVisibleLayer = () => {
    map
      .getLayers()
      .getArray()
      .forEach(async (layer: any) => {
        if (layer.get('name') === 'coordposition') {
          layer.setVisible(false);
        }
      });
  };

  useEffect(() => {
    unVisibleLayer();
    // readFromClipboard();
  }, []);

  const onSubmit = (formData) => {
    setPosition(formData?.coord);
  };

  return (
    <Modal
      centered
      size="sm"
      scrollable
      show={isGeoMapCoordOpen}
      onHide={() => {
        setIsGeoMapCoordOpen(false);
      }}
      //style={{ width: '600px' }}
      contentClassName="skdf-shadow-down-16dp"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header className="d-flex px-4 py-3">
          <Col>
            <span className="GeoMapCoordSet__header__title mb-0 mt-0">Перемещение по координатам</span>
          </Col>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <Container fluid>
            <Row>
              <Col>
                <Row className="my-0 mb-3">
                  <Col className="pe-0">
                    <div className="GeoMapCoordSet__group__title"></div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs="2" style={{ width: '100%' }}>
                    <label className="form-label">Координаты в формате (ESPG:4326)</label>
                    <Controller
                      name="coord"
                      control={control}
                      rules={{ required: true }}
                      defaultValue={currentCoordinates}
                      render={({ field, fieldState }) => {
                        if (field.value === null && currentCoordinates !== '' && currentCoordinates !== null) {
                          field.onChange(currentCoordinates);
                        }
                        // debugger;
                        return (
                          <input
                            id="coord"
                            className={`form-control form-control-sm w-100`}
                            style={{ fontSize: '14px' }}
                            name="coord"
                            onChange={(event) => {
                              field.onChange(event.currentTarget.value);
                              //setCurrentCoordinates(event.currentTarget.value);
                            }}
                            type="text"
                            value={field.value}
                            placeholder="Введите координаты"
                          />
                        );
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer className="px-4 d-flex justify-content-start flex-nowrap">
          <Col xs={6}>
            <Button
              variant="skdf-primary"
              className="w-100"
              type="submit"
              // onClick={() => {
              //   setIsGeoMapCoordOpen(false);
              // }}
            >
              Отобразить
            </Button>
          </Col>
          <Col xs={6}>
            <Button
              variant="skdf-stroke"
              className="w-100"
              onClick={() => {
                setIsGeoMapCoordOpen(false);
              }}
            >
              Отмена
            </Button>
          </Col>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default GeoMapCoordSet;
