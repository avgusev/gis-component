import React, { useState, useEffect } from 'react';
import GeoInputField from '../../GeoForms/GeoInputField/GeoInputField';
import AsyncSelect from 'react-select/async';
import { Controller, useForm } from 'react-hook-form';
import GeoSingleSelect from '../../GeoForms/GeoSingleSelect/GeoSingleSelect';
import { toast } from 'react-toastify';
import { ISelectOption } from '../../GeoForms/GeoSingleSelect/GeoSingleSelect.types';
import { GeoBridgeFormProps } from './GeoBridgeForm.types';
import axios from 'axios';
import './GeoBridgeForm.scss';
import { pgApiUrl, privateSchemaHeader, publicSchemaHeader } from '../../../config/constants';
import { useAppSelector } from '../../../config/store';
import { bridgeObjType, ISelectType } from '../../../global.types';
import GeoInputRange from '../../GeoInputRange/GeoInputRange';
import GeoIcon from '../../GeoIcon';
import GeoLoader from '../../GeoLoader/GeoLoader';

const GeoBridgeForm = (props: GeoBridgeFormProps) => {
  const { formMode, setFormData, formData, setBridgeFormMode } = props;
  const { control } = useForm();
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [regionOptions, setRegionOptions] = useState<any[]>([]);
  const [nameValue, setNameValue] = useState<string>('');
  const [lengthValue, setLengthValue] = useState<string>('');
  const [regionValue, setRegionValue] = useState<any>(null);
  const [valueRange, setValueRange] = useState<any>([]);
  const [technicalConditionOptions, setTechnicalConditionOptions] = useState<any[]>([]);
  const [technicalConditionValue, setTechnicalConditionValue] = useState<any>(null);
  const [barriersTypeOptions, setBarriersTypeOptions] = useState<any[]>([]);
  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const [bridgeTypeOptions, setBridgeTypeOptions] = useState<any[]>([]);
  const [bridgeTypeValue, setBridgeTypeValue] = useState<any>(null);
  const [barriersTypeValue, setBarriersTypeValue] = useState<any>(null);
  const [typeValue, setTypeValue] = useState<any>(null);
  const [ownerValue, setOwnerValue] = useState<any>(null);

  const selectedBridge = useAppSelector((state) => state.mapdraw.selectedBridge);

  const resetForm = () => {
    setNameValue('');
    setLengthValue('');
    setRegionValue(null);
    setValueRange([]);
    setTechnicalConditionValue(null);
    setBridgeTypeValue(null);
    setBarriersTypeValue(null);
    setTypeValue(null);
    setOwnerValue(null);
  };

  const setPparams = (dimensionId: number, textSearch: string = '', limitRows: number = 10) => {
    return {
      p_params: {
        FILTER: {
          DIMENSION_ID: dimensionId,
          TEXT_SEARCH: textSearch,
        },
        PAGING: {
          START_POSITION: 0,
          LIMIT_ROWS: limitRows,
        },
      },
    };
  };

  const getBridge = () => {
    axios
      .post(`${pgApiUrl}/rpc/get_bridge`, { p_bridge_id: selectedBridge?.out_entity_id }, privateSchemaHeader)
      .then((response) => {
        const data: bridgeObjType = response.data;
        setFormData(data);
        setValueRange([data?.START, data?.FINISH]);
        setNameValue(data?.FULL_NAME);
        setRegionValue({ label: data?.REGION_NAME, value: data?.REGION });
        setLengthValue(data?.LENGTH);
        setBridgeTypeValue({ label: data?.BRIDGE_TYPE_1_NAME, value: data?.BRIDGE_TYPE_1 });
        setTypeValue({ label: formData?.TYPE_NAME, value: formData?.TYPE });
        setBarriersTypeValue({ label: formData?.TYPE_OF_OBSTACLE_NAME, value: formData?.TYPE_OF_OBSTACLE });
        setTechnicalConditionValue({ label: formData?.TECHNICAL_CONDITION_NAME, value: formData?.TECHNICAL_CONDITION });
        setOwnerValue({ label: formData?.OWNER_NAME, value: formData?.OWNER });
        setIsLoadingData(false);
      })
      .catch((error) => {
        setIsLoadingData(false);
        console.error(`Ошибка при получении ! ${error}`);
      });
  };

  // const getOwners = (str) => {
  //   axios
  //     .post(
  //       `${pgApiUrl}/rpc/get_entity_list`,
  //       {
  //         p_params: {
  //           FILTER: {
  //             ENTITY_CODE: 201,
  //             TEXT_SEARCH: str,
  //           },
  //           PAGING: {
  //             START_POSITION: 0,
  //             LIMIT_ROWS: 30,
  //           },
  //         },
  //       },
  //       publicSchemaHeader
  //     )
  //     .then((response) => {

  //       const options = response.data.map((item) => ({ value: item.out_entity_id, label: item.out_full_name }));

  //       return options;
  //     })
  //     .catch((error) => {
  //       console.error(`Ошибка при получении ! ${error}`);
  //     });
  // };

  const getRegions = () => {
    //const pparams = setPparams(123445555, '', 100);
    const obj = {
      p_params: {
        FILTER: {
          ENTITY_CODE: 123445555,
          TEXT_SEARCH: '',
        },
        PAGING: {
          START_POSITION: 0,
          LIMIT_ROWS: 100,
        },
      },
    };

    axios
      .post(`${pgApiUrl}/rpc/get_entity_list`, obj, publicSchemaHeader)
      //.post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, pparams, publicSchemaHeader)
      .then((response) => {
        setRegionOptions(response.data);
      })
      .catch((error) => {
        console.error(`Ошибка при получении ! ${error}`);
      });
  };

  const getBridgeType = () => {
    axios
      .post(
        `${pgApiUrl}/rpc/get_dimension_value_list_v2`,
        {
          p_params: {
            FILTER: {
              DIMENSION_ID: 2148,
              TEXT_SEARCH: '',
              NAME_FIELD: 'TYPE',
            },
            PAGING: {
              START_POSITION: 0,
              LIMIT_ROWS: 100,
            },
          },
        },
        publicSchemaHeader
      )
      .then((response) => {
        setBridgeTypeOptions(response.data);
      })
      .catch((error) => {
        console.error(`Ошибка при получении ! ${error}`);
      });
  };

  const getType = () => {
    const pparams = setPparams(2124, '', 100);
    axios
      .post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, pparams, publicSchemaHeader)
      .then((response) => {
        setTypeOptions(response.data);
      })
      .catch((error) => {
        console.error(`Ошибка при получении ! ${error}`);
      });
  };

  const getTechnicalCondition = () => {
    const pparams = setPparams(2051, '', 10);
    axios
      .post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, pparams, publicSchemaHeader)
      .then((response) => {
        setTechnicalConditionOptions(response.data);
      })
      .catch((error) => {
        console.error(`Ошибка при получении ! ${error}`);
      });
  };

  const getBarriersTypes = () => {
    const pparams = setPparams(2052, '', 20);
    axios
      .post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, pparams, publicSchemaHeader)
      .then((response) => {
        setBarriersTypeOptions(response.data);
      })
      .catch((error) => {
        console.error(`Ошибка при получении ! ${error}`);
      });
  };

  useEffect(() => {
    getRegions();
    getTechnicalCondition();
    getBarriersTypes();
    getType();
    getBridgeType();
    return resetForm();
  }, []);

  useEffect(() => {
    resetForm();
    if (formMode !== 'create') {
      setIsLoadingData(true);
      getBridge();
    }
  }, [selectedBridge?.out_entity_id, formMode]);

  return (
    <>
      {isLoadingData ? (
        <div style={{ color: '#0D47A1', textAlign: 'center', marginTop: '10px' }}>
          <GeoLoader />
        </div>
      ) : (
        <form>
          <div className="GeoBridgeForm__item">
            {formMode === 'show' || formMode === 'edit' ? (
              <div className="GeoEditGeom__title__icon d-flex justify-content-between">
                <label className="form-label">Наименование</label>

                <div className="GeoEditGeom__title__icon mb-2">
                  <GeoIcon
                    name="cog"
                    iconType="cog"
                    onClick={() => {
                      if (formMode === 'show') {
                        setBridgeFormMode('edit');
                      } else {
                        setBridgeFormMode('show');
                        resetForm();
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <label className="form-label">Наименование</label>
            )}
            {formMode === 'show' && Object.keys(formData).length > 0 ? (
              <div>{formData?.FULL_NAME || 'Нет данных'}</div>
            ) : (
              <Controller
                name="name"
                control={control}
                // defaultValue={formMode === 'edit' ? formData?.FULL_NAME : ''}
                render={({ field }) => (
                  <GeoInputField
                    {...field}
                    name="name"
                    value={nameValue}
                    onChange={(e) => {
                      setNameValue(e.currentTarget.value);
                      field.onChange(e);
                      setFormData({ ...formData, FULL_NAME: e.currentTarget.value });
                    }}
                    type="text"
                    placeholder="Название"
                  />
                )}
              />
            )}
          </div>
          <div style={{ zIndex: 4 }} className="GeoBridgeForm__item">
            <label className="form-label">Владелец</label>
            {formMode === 'show' && Object.keys(formData).length > 0 ? (
              <div>{formData?.OWNER_NAME || 'Нет данных'}</div>
            ) : (
              <AsyncSelect
                cacheOptions
                defaultOptions
                isClearable={false}
                classNamePrefix="skdf-select"
                className={`skdf-select-container`}
                // maxMenuHeight={100}
                loadOptions={(str) =>
                  axios
                    .post(
                      `${pgApiUrl}/rpc/get_entity_list`,
                      {
                        p_params: {
                          FILTER: {
                            ENTITY_CODE: 201,
                            TEXT_SEARCH: str,
                            ISACTUAL: true,
                          },
                          PAGING: {
                            START_POSITION: 0,
                            LIMIT_ROWS: 30,
                          },
                        },
                      },
                      publicSchemaHeader
                    )
                    .then((response) => {
                      // let options = [];
                      // if (str.length > 2) {
                      //   options = response.data.map((item) => ({ value: item.out_entity_id, label: item.out_full_name }));
                      // }
                      return response.data.map((item) => ({ value: item.out_entity_id, label: item.out_full_name }));
                    })
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: '44px',
                  }),
                  menu: (provided) => ({ ...provided, paddingTop: 0, zIndex: 9999 }),
                }}
                value={ownerValue}
                onChange={(event: any) => {
                  if (event) {
                    setOwnerValue(event);
                    setFormData({ ...formData, OWNER: event.value });
                  }
                }}
                noOptionsMessage={() => 'Ничего не найдено'}
                loadingMessage={() => 'Загружаю...'}
                placeholder="Владелец"
                defaultInputValue=""
              />
            )}
          </div>
          <div className="GeoBridgeForm__item">
            <label className="form-label">Регион</label>
            {formMode === 'show' && Object.keys(formData).length > 0 ? (
              <div>{formData?.REGION_NAME || 'Нет данных'}</div>
            ) : (
              <Controller
                control={control}
                name="region"
                // defaultValue={formMode === 'edit' ? { label: formData?.REGION_NAME, value: formData?.REGION } : null}
                render={({ field }) => (
                  <GeoSingleSelect
                    {...field}
                    options={
                      regionOptions &&
                      regionOptions.map((item) => ({
                        // value: item.dimmember_gid,
                        // label: item.name,
                        value: item?.out_entity_id,
                        label: item?.out_full_name,
                      }))
                    }
                    placeholder="Регион"
                    value={regionValue}
                    onChange={(e) => {
                      field.onChange(e);
                      setRegionValue(e);
                      setFormData({ ...formData, REGION: e.value });
                    }}
                  />
                )}
              />
            )}
          </div>

          <div className="GeoBridgeForm__item">
            {' '}
            <label className="form-label">Начало и конец</label>
            {formMode === 'show' && Object.keys(formData).length > 0 ? (
              <>
                <div>{`Начало: ${formData?.START}`}</div>
                <div>{`Конец: ${formData?.FINISH}`}</div>
              </>
            ) : (
              <GeoInputRange
                id="panoForm-range"
                rangeType="text"
                minRequired
                maxRequired
                placeholderMin="0+000"
                placeholderMax="0+000"
                value={valueRange}
                onChange={(value) => {
                  setValueRange(value);
                  setFormData({ ...formData, START: value[0], FINISH: value[1] });
                }}
                // setIsValid={setIsValid}
                size="fullwidth"
              />
            )}
          </div>

          <div className="GeoBridgeForm__item">
            <label className="form-label">Длина</label>
            {formMode === 'show' && Object.keys(formData).length > 0 ? (
              <>
                <div>{formData?.LENGTH || 'Нет данных'}</div>
              </>
            ) : (
              <Controller
                name="length"
                control={control}
                // defaultValue={formMode === 'edit' ? formData.LENGTH : ''}
                render={({ field }) => (
                  <GeoInputField
                    {...field}
                    name="length"
                    value={lengthValue}
                    onChange={(e) => {
                      field.onChange(e);
                      setLengthValue(e.currentTarget.value);
                      setFormData({ ...formData, LENGTH: e.currentTarget.value });
                    }}
                    type="text"
                    placeholder="Длина"
                  />
                )}
              />
            )}
          </div>

          <div className="GeoBridgeForm__item">
            <label className="form-label">Тип</label>
            {formMode === 'show' && Object.keys(formData).length > 0 ? (
              <div>{formData?.BRIDGE_TYPE_1_NAME || 'Нет данных'}</div>
            ) : (
              <Controller
                control={control}
                name="BRIDGE_TYPE_1"
                // defaultValue={formMode === 'edit' ? { label: formData?.BRIDGE_TYPE_1_NAME, value: formData?.BRIDGE_TYPE_1 } : null}
                render={({ field }) => (
                  <GeoSingleSelect
                    {...field}
                    options={
                      bridgeTypeOptions &&
                      bridgeTypeOptions.map((item) => ({
                        value: item.dimmember_gid,
                        label: item.name,
                      }))
                    }
                    placeholder="Тип"
                    value={bridgeTypeValue}
                    onChange={(e) => {
                      setBridgeTypeValue(e);
                      setFormData({ ...formData, BRIDGE_TYPE_1: e.value });
                    }}
                  />
                )}
              />
            )}
          </div>

          <div className="GeoBridgeForm__item">
            <label className="form-label">Вид</label>
            {formMode === 'show' && Object.keys(formData).length > 0 ? (
              <div>{formData?.TYPE_NAME || 'Нет данных'}</div>
            ) : (
              <Controller
                control={control}
                name="TYPE"
                // defaultValue={formMode === 'edit' ? { label: formData?.TYPE_NAME, value: formData?.TYPE } : null}
                render={({ field }) => (
                  <GeoSingleSelect
                    {...field}
                    name="TYPE"
                    options={
                      typeOptions &&
                      typeOptions.map((item) => ({
                        value: item.dimmember_gid,
                        label: item.name,
                      }))
                    }
                    placeholder="Вид"
                    value={typeValue}
                    onChange={(e) => {
                      setTypeValue(e);
                      setFormData({ ...formData, TYPE: e.value });
                    }}
                  />
                )}
              />
            )}
          </div>

          <div className="GeoBridgeForm__item">
            <label className="form-label">Наименование припятствия</label>
            {formMode === 'show' && Object.keys(formData).length > 0 ? (
              <div>{formData?.TYPE_OF_OBSTACLE_NAME || 'Нет данных'}</div>
            ) : (
              <Controller
                control={control}
                name="TYPE_OF_OBSTACLE"
                // defaultValue={formMode === 'edit' ? { label: formData?.OBSTACLE_NAME, value: formData?.TYPE_OF_OBSTACLE } : null}
                render={({ field }) => (
                  <GeoSingleSelect
                    {...field}
                    options={
                      barriersTypeOptions &&
                      barriersTypeOptions.map((item) => ({
                        value: item.dimmember_gid,
                        label: item.name,
                      }))
                    }
                    placeholder="Тип препятствия"
                    value={barriersTypeValue}
                    onChange={(e) => {
                      setBarriersTypeValue(e);
                      setFormData({ ...formData, TYPE_OF_OBSTACLE: e.value });
                    }}
                  />
                )}
              />
            )}
          </div>
          <div className="GeoBridgeForm__item">
            <label className="form-label">Техническое состояние</label>
            {formMode === 'show' && Object.keys(formData).length > 0 ? (
              <div>{formData?.TECHNICAL_CONDITION_NAME || 'Нет данных'}</div>
            ) : (
              <Controller
                control={control}
                name="technical_condition"
                render={({ field }) => (
                  <GeoSingleSelect
                    {...field}
                    options={
                      technicalConditionOptions &&
                      technicalConditionOptions.map((item) => ({
                        value: item.dimmember_gid,
                        label: item.name,
                      }))
                    }
                    placeholder="Техническое состояние"
                    value={technicalConditionValue}
                    onChange={(e) => {
                      setTechnicalConditionValue(e);
                      setFormData({ ...formData, TECHNICAL_CONDITION: e.value });
                    }}
                  />
                )}
              />
            )}
          </div>
        </form>
      )}
    </>
  );
};

export default GeoBridgeForm;
