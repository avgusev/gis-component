import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { Feature } from 'ol';
import { Card, Button } from 'react-bootstrap';
import { Point } from 'ol/geom';
import { useForm, Controller } from 'react-hook-form';
import GeoInputField from '../../GeoForms/GeoInputField/GeoInputField';
import GeoSingleSelect from '../../GeoForms/GeoSingleSelect/GeoSingleSelect';
import GeoTextareaInput from '../../GeoForms/GeoTextareaInput/GeoTextareaInput';
import { formatDateToString } from '../../../features/formatDateToString';
import { toast } from 'react-toastify';
import GeoTextBtn from '../../GeoTextBtn/GeoTextBtn';
import { pgApiUrl, publicSchemaHeader, querySchemaHeader } from '../../../config/constants';
import GeoInputFile from '../../GeoForms/GeoInputFile/GeoInputFile';
import './GeoCreateMessageForm.scss';
import axios from 'axios';
import { setMapMode } from '../../../reducers/map.reducer';
import { ISelectType } from '../../../global.types';
import { removeFeaturesVectorLayer } from '../../../features/maps/removeFeaturesVectorLayer';
import { Geolocation } from 'ol';
import './GeoCreateMessageForm.scss';

const GeoCreateMessageFormForm = ({ setIsOpen, map }) => {
  const dispatch = useAppDispatch();
  const mapMode = useAppSelector((state) => state.mapstate.mapMode);
  const userId = useAppSelector((state: any) => state.user.userAuthData.profile.userId);
  const tokenId = useAppSelector((state: any) => state.user.userAuthData.id_token);
  const { handleSubmit, control } = useForm();
  const [coordinatesValue, setCoordinatesValue] = useState('');
  const [imgIdArr, setImgIdArr] = useState([]);
  const [prewier, setPrewier] = useState([]);
  const [roadValue, setRoadValue] = useState(null);
  const [messageValue, setMessageValue] = useState('');
  const [messageTypeValue, setMessageTypeValue] = useState(null);
  const [commitDateValue, setCommitDateValue] = useState('');
  const [optionsMessageType, setOptionsMessageType] = useState<ISelectType[]>([]);
  const [optionsRoad, setOptionsRoad] = useState<ISelectType[]>([]);
  const [currentGeolocation, setCurrentGeolocation] = useState<any>([]);

  const convertStringToArr = (str: string, separator: string): string[] => {
    return str?.split(separator).map((item) => item.trim());
  };

  const messageGeolocation = new Geolocation({
    trackingOptions: {
      enableHighAccuracy: true,
    },
    projection: 'EPSG:3857',
  });

  const showMessageOnMap = (coordinates) => {
    try {
      removeFeaturesVectorLayer('message_position', map);
      map
        .getLayers()
        .getArray()
        .forEach((layer: any) => {
          if (layer.get('name') === 'message_position' && coordinates.length > 0) {
            const source = layer.getSource();
            source.addFeature(
              new Feature({
                id: 'message_position',
                geometry: new Point(coordinates),
              })
            );
            map.getView().setCenter(coordinates);
          }
        });
    } catch (error) {
      console.error('Ошибка при удалении геопозиции сообщения', error);
    }
  };

  const funcTest = () => {
    if (currentGeolocation && currentGeolocation.length > 0) {
      map.getView().setCenter(currentGeolocation);
      map
        .getLayers()
        .getArray()
        .forEach((layer: any) => {
          if (layer.get('name') === 'message_position') {
            if (layer.getVisible()) {
              layer.setVisible(false);
              setOptionsRoad([]);
              setCoordinatesValue('');
            } else {
              layer.setVisible(true);
              setCoordinatesValue(`${currentGeolocation[0]}, ${currentGeolocation[1]}`);
              const closestRoads = closestPoint(currentGeolocation);
              setOptionsRoad(closestRoads);
            }
          }
        });
    } else {
      messageGeolocation.setTracking(true);
    }
    messageGeolocation.on('change', function (evt) {
      const position = messageGeolocation.getPosition();

      if (position && map) {
        setCurrentGeolocation(position);
        setCoordinatesValue(`${position[0]}, ${position[1]}`);
        const closestRoads = closestPoint(position);
        setOptionsRoad(closestRoads);

        map
          .getLayers()
          .getArray()
          .forEach((layer: any) => {
            if (layer.get('name') === 'message_position') {
              const source = layer.getSource();
              const feature = source.getFeatures();
              feature?.[0].setGeometry(position ? new Point(position) : null);
            }
          });
        map.getView().setCenter(position);
      }
    });
  };

  const closestPoint = (coordinates) => {
    const result = [];
    try {
      map.getView().setCenter(coordinates);
      map.getView().setZoom(13);
      const wfsGroup: any = map
        .getLayers()
        .getArray()
        .filter((item, index, array) => item.get('name') === 'layers-wfs')?.[0];
      const wfsLayers = wfsGroup
        .getLayers()
        .getArray()
        .forEach((layer) => {
          const source = layer.getSource();
          const closestFeature = source.getClosestFeatureToCoordinate(coordinates);
          if (closestFeature && Object.keys(closestFeature.getProperties()).length > 0) {
            const closestPoint = closestFeature.getProperties();
            result.push({ value: closestPoint.road_id, label: closestPoint.road_name });
          }
        });
    } catch (error) {
      console.error('Ошибка при получении ближайшей дороги! ', error);
    }
    return result;
  };

  const resetFormData = () => {
    setCoordinatesValue('');
    setRoadValue(null);
    setMessageValue('');
    setMessageTypeValue(null);
    setCommitDateValue('');
    setOptionsMessageType([]);
    removeFeaturesVectorLayer('message_position', map);
    setCoordinatesValue('');
  };

  const postMessageImages = (formData) => {
    if (prewier.length > 0) {
      prewier.forEach((item, index, array) => {
        const bodyFormData = new FormData();
        const blobFile = new Blob([item.file], { type: 'image/jpeg' });
        bodyFormData.append('file', blobFile);
        axios
          .post(`https://apigateway-specialist.dev1.skdf.local/api/files/upload`, bodyFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: '*/*',
              Authorization: tokenId,
            },
          })
          .then((response) => {
            const responseData = response.data;
            setImgIdArr([...responseData]);
          })
          // .then(() => {
          //   if (index === array.length - 1) {
          //     const modifiedData = {
          //       sender_id: Number(userId),
          //       lat: coordinatesValue?.split(',')[0] || '',
          //       lon: coordinatesValue?.split(',')[1] || '',
          //       road_part_id: formData?.road?.value || null,
          //       message_type: formData?.message_type?.value || null,
          //       message_text: formData?.message || null,
          //       issue_date: formData?.commit_date || null,
          //     };

          //     const ab = imgIdArr;
          //     const rr = imgIdArr.length > 0;
          //     console.log(ab, rr);

          //     if (imgIdArr.length > 0) {
          //       modifiedData['attachments_id'] = imgIdArr;
          //     }

          //     postForm(modifiedData);
          //   }
          // })
          .catch((error) => {
            console.error(`Ошибка при отправки данных формы: ${error}`);
          });
      });
    }
  };

  const onSubmit = (formData) => {
    postMessageImages(formData);
    const modifiedData = {
      sender_id: Number(userId),
      lat: coordinatesValue?.split(',')[0] || '',
      lon: coordinatesValue?.split(',')[1] || '',
      road_part_id: formData?.road?.value || null,
      message_type: formData?.message_type?.value || null,
      message_text: formData?.message || null,
      issue_date: formData?.commit_date || null,
    };
    postForm(modifiedData);
  };

  const getMessageTypes = () => {
    axios
      .post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, { p_params: { FILTER: { DIMENSION_NAME: 'APPEALS_TYPE' } } }, publicSchemaHeader)
      .then((response) => {
        const result = [];
        response.data.map((item) => {
          result.push({ label: item.name, value: item.dimmember_gid });
        });
        setOptionsMessageType(result);
      })
      .catch((error) => {
        console.error(`Ошибка получении данных getMessageTypes: ${error}`);
      });
  };

  const postForm = (formData) => {
    axios
      .post(`${pgApiUrl}/rpc/add_user_message`, formData, querySchemaHeader)
      .then(() => {
        toast.info('Сообщение успешно отправлено');
        if (mapMode === 'sendmessage') {
          dispatch(setMapMode('navigation'));
        } else {
          dispatch(setMapMode('sendmessage'));
        }
        setIsOpen(false);
        resetFormData();
      })
      .catch((error) => {
        console.error(`Ошибка при отправки данных формы: ${error}`);
        resetFormData();
      });
  };

  useEffect(() => {
    getMessageTypes();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="skdf-shadow-down-16dp GeoCreateMessageForm__modal">
        <Card.Body className="GeoCreateMessageForm__modal__body">
          <h3 className="GeoCreateMessageForm__modal__body__title">Отправка сообщения</h3>

          <div className="GeoCreateMessageForm__form__section">
            <h5 className="GeoCreateMessageForm__form__section__title">Место на карте</h5>
            <div className="GeoCreateMessageForm__form__section__body">
              <div className="GeoCreateMessageForm__form__section__item">
                <Controller
                  name="coordinates"
                  control={control}
                  render={({ field }) => (
                    <GeoInputField
                      {...field}
                      name="coordinates"
                      value={coordinatesValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        field.onChange(e);
                        setCoordinatesValue(e.currentTarget.value);
                      }}
                      label="Координаты"
                      type="text"
                      additionIconType="find_me"
                      additionEvent={() => {
                        setCoordinatesValue('');
                        funcTest();
                      }}
                      placeholder="Координаты"
                    />
                  )}
                />
                <GeoTextBtn
                  handlerClick={() => {
                    showMessageOnMap(convertStringToArr(coordinatesValue, ','));
                    const closestRoads = closestPoint(convertStringToArr(coordinatesValue, ','));
                    setOptionsRoad(closestRoads);
                  }}
                  label="Показать на карте"
                  disabled={coordinatesValue.length <= 0}
                />
              </div>

              <Controller
                name="road"
                control={control}
                render={({ field }) => (
                  <GeoSingleSelect
                    {...field}
                    name="road"
                    options={optionsRoad}
                    value={roadValue}
                    isDisabled={!(optionsRoad.length > 0)}
                    onChange={(e) => {
                      field.onChange(e);
                      setRoadValue(e);
                    }}
                    label="Автомобильная дорога"
                    placeholder="Автомобильная дорога"
                  />
                )}
              />
            </div>
          </div>
          <div className="GeoCreateMessageForm__form__section">
            <h5 className="GeoCreateMessageForm__form__section__title">Информация</h5>
            <div className="GeoCreateMessageForm__form__section__body">
              <div className="GeoCreateMessageForm__form__section__item">
                <Controller
                  name="message_type"
                  control={control}
                  render={({ field }) => (
                    <GeoSingleSelect
                      {...field}
                      name="message_type"
                      label="Тип сообщения"
                      placeholder="Тип сообщения"
                      value={messageTypeValue}
                      onChange={(e) => {
                        field.onChange(e);
                        setMessageTypeValue(e);
                      }}
                      options={optionsMessageType}
                    />
                  )}
                />
              </div>
              <div className="GeoCreateMessageForm__form__section__item">
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <GeoTextareaInput
                      {...field}
                      name="message"
                      label="Сообщение"
                      value={messageValue}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        field.onChange(e);
                        setMessageValue(e.currentTarget.value);
                      }}
                      placeholder="Сообщение"
                    />
                  )}
                />
              </div>
              <div className="GeoCreateMessageForm__form__section__item">
                <Controller
                  name="commit_date"
                  control={control}
                  render={({ field }) => (
                    <GeoInputField
                      {...field}
                      name="commit_date"
                      label="Дата фиксации"
                      type="date"
                      placeholder="Дата фиксации"
                      value={commitDateValue.length > 0 ? commitDateValue : formatDateToString(new Date())}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        field.onChange(e);
                        setCommitDateValue(e.currentTarget.value);
                      }}
                    />
                  )}
                />
              </div>

              <Controller
                control={control}
                name="fileinput"
                render={({ field }) => (
                  <GeoInputFile
                    {...field}
                    setPrewier={setPrewier}
                    prewier={prewier}
                    onChange={field.onChange}
                    accept=".jpg, .jpeg, .png"
                    label="Фото"
                  />
                )}
              />
            </div>
          </div>
        </Card.Body>

        <Card.Footer className="GeoCreateMessageForm__modal__footer px-4">
          <Button
            variant="skdf-primary"
            className="d-inline-flex justify-content-center w-100 align-items-center mx-4"
            type="submit"
            onClick={() => {}}
          >
            Отправить
          </Button>
          <Button
            variant="skdf-ghost"
            className="d-inline-flex justify-content-center w-100 align-items-center mt-2"
            onClick={() => {
              if (mapMode === 'sendmessage') {
                dispatch(setMapMode('navigation'));
              } else {
                dispatch(setMapMode('sendmessage'));
              }
              setIsOpen(false);
              resetFormData();
            }}
          >
            Отменить
          </Button>
        </Card.Footer>
      </Card>
    </form>
  );
};

export default GeoCreateMessageFormForm;
