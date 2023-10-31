import React, { FC, useEffect, useState } from 'react';
import { Button, Modal, Accordion, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import './GrafCard.scss';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setRoadPartGeom } from '../../../reducers/mapDraw.reducer';
import GeoLoader from '../../GeoLoader/GeoLoader';
import { GrafCardTypes } from './GrafCard.types';
import GeoCheckedFlag from '../../GeoCheckedFlag/GeoCheckedFlag';
import GeoIcon from '../../GeoIcon';
import { baseGisSchemaHeader, pgGraphApiUrl, publicSchemaHeader } from '../../../config/constants';
import axios from 'axios';
import GeoInputField from '../../GeoForms/GeoInputField/GeoInputField';
import GeoSingleSelect from '../../GeoForms/GeoSingleSelect/GeoSingleSelect';

const GrafCard: FC<GrafCardTypes> = ({ isGrafCardOpen, setIsGrafCardOpen, selectedEdgeId }) => {
  const dispatch = useDispatch();
  const [dictionary, setDictionary] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<'create' | 'edit' | 'show'>('show');
  const [isSavingData, setIsSavingData] = useState<boolean>(false);

  const cardGroups = [
    { key: 'vehicle_type_rest', title: 'Доступность', type: 'refer' },
    { key: 'main_road_attribute', title: 'Условия движения', type: 'refer' },
    { key: 'maximum_dimension_rest', title: 'Ограничения проезда', type: 'integer' },
  ];
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

  const getDictionary = () => {
    axios
      .post(
        `${pgGraphApiUrl}/rpc/get_dictionary`,
        {
          input_key: 'ALL',
        },
        baseGisSchemaHeader
      )
      .then((response) => {
        setDictionary(response.data);
      })
      .catch((error) => {
        console.error(`Ошибка получении справочников: ${error}`);
      });
  };

  const getData = (id) => {
    setIsLoadingData(true);
    axios
      .post(`${pgGraphApiUrl}/rpc/minipassport_get`, { id_input: id }, baseGisSchemaHeader)
      .then((response) => {
        setIsLoadingData(false);
        setData(response.data);
      })
      .catch((error) => {
        setIsLoadingData(false);
        console.error(`Ошибка получении данных паспорта графа: ${error}`);
      });
  };

  useEffect(() => {
    if (selectedEdgeId && selectedEdgeId !== '') {
      getData(selectedEdgeId);
    }
  }, selectedEdgeId);

  useEffect(() => {
    getDictionary();
  }, []);

  const saveData = (data) => {
    axios
      .post(`${pgGraphApiUrl}/rpc/minipassport_update`, { ljinput: data }, baseGisSchemaHeader)
      .then((response) => {
        setData([]);
        getData(selectedEdgeId);
        setEditMode('show');
        setIsSavingData(false);
        toast.info('Данные успешно сохранены!');
      })
      .catch((error) => {
        setIsSavingData(false);
        toast.error('Ошибка при сохранении данных!', error);
        console.error(`Ошибка сохранении паспорта графа: ${error}`);
      });
  };

  const onSubmit = (formData) => {
    try {
      setIsSavingData(true);
      const formDataArr = Object.keys(formData);
      const obj = { ...formData };
      formDataArr.forEach((item) => {
        if (typeof obj?.[item] === 'string') {
          obj[item] = formData?.[item] === '' ? null : Number(formData?.[item]);
        }
      });
      const saveObj: any = { ...data };
      cardGroups.forEach((group) => {
        const dicObj = saveObj?.[group?.key];
        formDataArr.forEach((key) => {
          if (dicObj?.[key]) {
            if (typeof obj?.[key] === 'object') {
              saveObj[group.key][key] = { ...saveObj?.[group.key]?.[key], code: obj?.[key]?.value, value: obj?.[key]?.label };
            } else {
              saveObj[group.key][key] = { ...saveObj?.[group.key]?.[key], value: obj?.[key] };
            }
          }
        });
      });
      console.log(obj, saveObj);
      saveData(saveObj);
    } catch (error) {
      setIsSavingData(false);
      toast.error('Ошибка при сохранении данных!', error);
      console.error(`Ошибка сохранении паспорта графа: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <Card className="skdf-shadow-down-16dp GrafCard__card"> */}
      {isLoadingData ? (
        <div className="GrafCard__loader d-flex justify-content-center align-items-center">
          <GeoLoader />
        </div>
      ) : data && Object.keys(data).length > 0 && !isSavingData ? (
        <>
          <Card.Header className="GrafCard__header">
            <div>
              <div className="GrafCard__title">
                {data?.skdf_street?.skdf_street_name && data?.skdf_street?.skdf_street_name !== null ? (
                  data?.skdf_street?.skdf_street_name
                ) : (
                  <span style={{ color: '#828282', fontStyle: 'italic' }}>Название дороги не указано</span>
                )}
              </div>
              <div className="GrafCard__subtitle mt-2 mb-4">{data?.maneuvre?.man_type?.title}</div>
              <div className="d-flex justify-content-between">
                <GeoCheckedFlag isChecked={true} />
                <div className="GrafCard__icon__bar">
                  {/* <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 100, hide: 100 }}
                      overlay={(props) => (
                        <Tooltip id="panorama-tooltip" {...props}>
                          Добавить
                        </Tooltip>
                      )}
                    >
                      <div className="me-3 GrafCard__icon__item">
                        <GeoIcon
                          name="plus"
                          iconType="plus"
                          onClick={() => {
                            setEditMode('create');
                          }}
                        />
                      </div>
                    </OverlayTrigger> */}

                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 100, hide: 100 }}
                    overlay={(props) => (
                      <Tooltip id="grag-tooltip" {...props}>
                        Редактировать
                      </Tooltip>
                    )}
                  >
                    <div className="me-3 GrafCard__icon__item">
                      <GeoIcon
                        name="cog"
                        iconType="cog"
                        onClick={() => {
                          if (editMode === 'edit') {
                            setEditMode('show');
                          } else if (editMode === 'show') setEditMode('edit');
                        }}
                      />
                    </div>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="GrafCard__content">
            {cardGroups.map((group) => {
              const groupKeys = Object.keys(data?.[group.key]);
              const items = Object.values(data?.[group.key]);
              return (
                <div key={group.key}>
                  <div className="GrafCard__group__title">{group?.title}</div>
                  {items.length > 0 &&
                    items.map((item: any, itemIndex) => {
                      const itemkey = groupKeys?.[itemIndex];

                      if (group.type === 'refer' && editMode === 'edit') {
                        if (
                          dictionary?.[group.key]?.[itemkey]?.values //&& group.key === 'main_road_attribute'
                        ) {
                          const values = dictionary?.[group.key]?.[itemkey]?.values;
                          console.log(values);
                          //debugger;

                          return (
                            <div className="mb-3">
                              {/* <div className="GrafCard__item__title">{item?.title}</div> */}
                              <Controller
                                control={control}
                                key={itemkey}
                                name={itemkey}
                                defaultValue={editMode === 'edit' ? { label: item?.value, value: item?.code } : null}
                                render={({ field }) => (
                                  <GeoSingleSelect
                                    {...field}
                                    key={itemkey}
                                    options={
                                      dictionary &&
                                      Object.keys(dictionary).length > 0 &&
                                      dictionary?.[group.key]?.[itemkey]?.values.length > 0
                                        ? dictionary?.[group.key]?.[itemkey]?.values.map((dicitem) => ({
                                            value: dicitem?.code,
                                            label: dicitem?.name,
                                          }))
                                        : dictionary?.[group.key]?.[itemkey] && dictionary?.[group.key]?.[itemkey].length > 0
                                        ? dictionary?.[group.key]?.[itemkey].map((dicitem) => ({
                                            value: dicitem?.code,
                                            label: dicitem?.name,
                                          }))
                                        : []
                                    }
                                    placeholder={item?.title}
                                    value={field?.value}
                                    label={item?.title}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      //   setRegionValue(e);
                                      //   setFormData({ ...formData, REGION: e.value });
                                    }}
                                  />
                                )}
                              />
                            </div>
                          );
                        }
                      } else if (group.type === 'integer' && editMode === 'edit') {
                        return (
                          <div className="mb-3">
                            {/* <div className="GrafCard__item__title">{item?.title}</div> */}
                            <Controller
                              key={itemkey}
                              name={itemkey}
                              control={control}
                              defaultValue={item?.value}
                              render={({ field }) => (
                                <GeoInputField
                                  {...field}
                                  key={itemkey}
                                  name={itemkey}
                                  value={field?.value}
                                  label={item?.title}
                                  onChange={(e) => {
                                    field.onChange(e);

                                    //   setLengthValue(e.currentTarget.value);
                                    //   setFormData({ ...formData, LENGTH: e.currentTarget.value });
                                  }}
                                  type="number"
                                  placeholder={item?.title}
                                />
                              )}
                            />
                          </div>
                        );
                      }
                      return (
                        <div className="GrafCard__item" key={itemkey}>
                          <div className="GrafCard__item__title">{item?.title}</div>
                          <div style={{ whiteSpace: 'pre-line' }} className="GrafCard__item__text">
                            {item?.value}
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </Card.Body>
          <Card.Footer className="GrafCard__footer">
            {editMode === 'edit' && (
              <>
                <Button
                  disabled={isSavingData}
                  variant="skdf-primary"
                  type="submit"
                  className="d-inline-flex justify-content-center w-100 align-items-center mx-4 mb-2"
                >
                  Сохранить
                </Button>
                <Button
                  variant="skdf-stroke"
                  className="d-inline-flex justify-content-center w-100 align-items-center"
                  onClick={() => {
                    setEditMode('show');
                  }}
                >
                  Отменить
                </Button>
              </>
            )}
            {editMode === 'show' && (
              <Button variant="skdf-primary" className="d-inline-flex justify-content-center w-100 align-items-center mx-4">
                <a href={`/roads/55445`} className="GrafCard__btn__link__content">
                  Перейти к дороге
                </a>
              </Button>
            )}
          </Card.Footer>
        </>
      ) : (
        <div>Данные отсутствуют</div>
      )}
      {/* </Card> */}
    </form>
  );
};

export default GrafCard;
