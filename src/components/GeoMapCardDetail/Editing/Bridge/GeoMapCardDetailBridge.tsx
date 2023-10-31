import React, { useState, useEffect } from 'react';
import GeoInputField from '../../../GeoForms/GeoInputField/GeoInputField';
import { Button, Card } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import GeoSingleSelect from '../../../GeoForms/GeoSingleSelect/GeoSingleSelect';
import { toast } from 'react-toastify';
import { ISelectOption } from '../../../GeoForms/GeoSingleSelect/GeoSingleSelect.types';
import { GeoMapCardDetailBridgeTypes } from './GeoMapCardDetailBridge.types';
import axios from 'axios';
import '../GeoMapCardDetailEditing.scss';
import GeoLoader from '../../../GeoLoader/GeoLoader';
import { pgApiUrl, privateSchemaHeader, publicSchemaHeader } from '../../../../config/constants';
import TileLayer from 'ol/layer/Tile';
import GeoInputRangeTest from '../../../GeoInputRangeTest/GeoInputRangeTest';
import GeoSinglePicketInput from '../../../GeoForms/GeoSinglePicketInput/GeoSinglePicketInput';

const GeoMapCardDetailBridge = (props: GeoMapCardDetailBridgeTypes) => {
  const { objectType, open, map, idRoad, idPart, setEditingType } = props;
  const { handleSubmit, control } = useForm();
  const [lengthValue, setLengthValue] = useState<string>('');
  const [countedLengthValue, setCountedLengthValue] = useState<number>(0);
  const [valueRange, setValueRange] = useState<string[] | number[]>([undefined, undefined]);
  const [valueLocation, setValueLocation] = useState<string>('');
  const [isValidLocation, setIsValidLocation] = useState<boolean>(false);
  const [isValidRange, setIsValidRange] = useState<boolean>(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);
  const [regionOptions, setRegionOptions] = useState<any[]>([]);
  const [regionValue, setRegionValue] = useState<any>(null);
  const [districtOptions, setDistrictOptions] = useState<any[]>([]);
  const [districtValue, setDistrictValue] = useState<any>(null);
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [cityValue, setCityValue] = useState<any>(null);
  const [localityOptions, setLocalityOptions] = useState<any[]>([]);
  const [localityValue, setLocalityValue] = useState<any>(null);
  const [technicalConditionOptions, setTechnicalConditionOptions] = useState<any[]>([]);
  const [technicalConditionValue, setTechnicalConditionValue] = useState<any>(null);
  const [barriersTypeOptions, setBarriersTypeOptions] = useState<any[]>([]);
  const [barriersTypeValue, setBarriersTypeValue] = useState<any>(null);
  const [bridgeTypeOptions, setBridgeTypeOptions] = useState<any[]>([]);
  const [bridgeTypeValue, setBridgeTypeValue] = useState<any>(null);
  const [locationTypeOptions, setLocationTypeOptions] = useState<any[]>([]);
  const [locationTypeValue, setLocationTypeValue] = useState<any>(null);
  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const [typeValue, setTypeValue] = useState<any>(null);

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

  const refreshLayers = () => {
    try {
      const wmsGroup: any = map
        .getLayers()
        .getArray()
        .filter((item, index, array) => item.get('name') === 'layers-wms')?.[0];
      wmsGroup
        .getLayers()
        .getArray()
        .filter((layer) => {
          return layer.getVisible();
        })
        .forEach((layer) => {
          const lname = layer.get('name');
          const l = layer;
          if (layer instanceof TileLayer && lname === 'lyr_bridges') {
            setTimeout(() => {
              l.getSource().refresh();
            }, 2000);
          }
        });
      setIsLoadingBtn(false);
    } catch (error) {
      toast.error(`Ошибка при обновлении слоев! ${error?.response?.data?.message ? error.response.data.message : error}`);
    }
  };

  const onSubmit = (data) => {
    if ((+lengthValue < 0 || +lengthValue > countedLengthValue) && objectType === 'linear') {
      toast.warn('Протяженность участка должна быть больше 0 и входить в интервал начала и конца участка!');
    } else if (+lengthValue < 0 && objectType === 'point') {
      toast.warn('Протяженность участка должна быть больше 0');
    } else if (+data?.square < 0) {
      toast.warn('Площадь покрытия мост сооружения не должна быть отрицательной');
    } else if (+data?.overall_dimensions < 0) {
      toast.warn('Габарит мостового сооружения по ширине не должен быть отрицательным');
    } else if (+data?.balance < 0) {
      toast.warn('Балансовая стоимость не должна быть отрицательной');
    } else {
      setIsLoadingBtn(true);
      const start = +valueLocation.toString().split('+')[0] * 1000 + +valueLocation.toString().split('+')[1];
      const finishStr = (start + +lengthValue).toString();
      const finish = `${finishStr.substr(0, finishStr.length - 3)}+${finishStr.substr(-3, 3)}`;
      const dataObj = {
        data: {
          ROAD_ID: idRoad,
          ROAD_PART_ID: idPart,
          FULL_NAME: data?.name,
          // START: objectType === 'linear' ? data?.beg : data?.location,
          // FINISH: objectType === 'linear' ? data?.end : null,
          // LENGTH: data?.length,
          START: objectType === 'linear' ? valueRange[0] : valueLocation,
          FINISH: objectType === 'linear' ? valueRange[1] : finish,
          LENGTH: lengthValue,
          REGION: regionValue?.value,
          PARENT_LEVEL_3: districtValue?.value,
          PARENT_LEVEL_4: cityValue?.value,
          PARENT_LEVEL_6: localityValue?.value,
          // BUILDING_DATE: data?.date_build,
          TECHNICAL_CONDITION: technicalConditionValue?.value,
          TYPE_OF_OBSTACLE: barriersTypeValue?.value,
          IDENTIFICATION_NUMBER: data?.identification_code,
          SQUARE: data?.square,
          BALANCE_STOIM: data?.balance,
          OBSTACLE_NAME: data?.barriers_name,
          // BRIDGE_TYPE_1: bridgeTypeValue,
          // LOCATION_TYPE: locationTypeValue,
          TYPE: typeValue?.value,
          OVERALL_DIMENSIONS: data?.overall_dimensions,
        },
      };
      console.log(dataObj);
      axios
        .post(`${pgApiUrl}/rpc/f_create_bridge_object`, dataObj, privateSchemaHeader)
        .then(() => {
          toast.success(`Запись добавлена`);
          refreshLayers();
          open(false);
          setEditingType('');
        })
        .catch((error) => {
          toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
          setIsLoadingBtn(false);
        });
    }
    setTimeout(() => {
      map.render;
    }, 3000);
  };

  const getRegions = () => {
    const pparams = setPparams(22, '', 100);
    axios
      .post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, pparams, publicSchemaHeader)
      .then((response) => {
        setRegionOptions(response.data);
      })
      .catch((error) => {
        toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
      });
  };

  const getDistricts = () => {
    const pparams = setPparams(1766, '', 100);
    axios
      .post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, pparams, publicSchemaHeader)
      .then((response) => {
        setDistrictOptions(response.data);
      })
      .catch((error) => {
        toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
      });
  };

  const getCities = () => {
    const pparams = setPparams(1766, '', 100);
    axios
      .post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, pparams, publicSchemaHeader)
      .then((response) => {
        setCityOptions(response.data);
      })
      .catch((error) => {
        toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
      });
  };

  const getLocalities = () => {
    const pparams = setPparams(1766, '', 100);
    axios
      .post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, pparams, publicSchemaHeader)
      .then((response) => {
        setLocalityOptions(response.data);
      })
      .catch((error) => {
        toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
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
        toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
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
        toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
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
        toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
      });
  };
  // const getBridgeTypes = () => {
  //   const pparams = setPparams(2148, '', 10);
  //   axios
  //     .post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, pparams, {
  //       headers: {
  //         'Content-Profile': 'nsi',
  //       },
  //     })
  //     .then((response) => {
  //       setBridgeTypeOptions(response.data);
  //     })
  //     .catch((error) => {
  //       toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
  //     });
  // };
  // const getLocationTypes = () => {
  //   const pparams = setPparams(2149, '', 10);
  //   axios
  //     .post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, pparams, {
  //       headers: {
  //         'Content-Profile': 'nsi',
  //       },
  //     })
  //     .then((response) => {
  //       setLocationTypeOptions(response.data);
  //     })
  //     .catch((error) => {
  //       toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
  //     });
  // };

  useEffect(() => {
    getRegions();
    getDistricts();
    getCities();
    getLocalities();
    getTechnicalCondition();
    getBarriersTypes();
    // getBridgeTypes();
    // getLocationTypes();
    getType();
  }, []);

  useEffect(() => {
    if (objectType === 'linear') {
      if (isValidRange && valueRange?.length === 2 && valueRange[0] && valueRange[1]) {
        const firstEl = +valueRange[0].toString().split('+')[0] * 1000 + +valueRange[0].toString().split('+')[1];
        const secondEl = +valueRange[1].toString().split('+')[0] * 1000 + +valueRange[1].toString().split('+')[1];
        const result = secondEl - firstEl;
        setCountedLengthValue(+result.toFixed(3));
        setLengthValue(result.toFixed(3).toString());
      }
    }
  }, [valueRange, isValidRange]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-3">
          <Controller
            control={control}
            name="name"
            render={(props) => <GeoInputField placeholder="Наименование" label="Наименование" {...props.field} {...props} />}
          />
        </div>
        {objectType === 'linear' ? (
          <>
            {' '}
            {/* <Controller
              control={control}
              name="beg"
              render={(props) => (
                <GeoInputField placeholder="Начало участка" pattern="\d+\+\d{3}$" label="Начало участка" {...props.field} {...props} />
              )}
            />
            <Controller
              control={control}
              name="end"
              render={(props) => (
                <GeoInputField placeholder="Конец участка" pattern="\d+\+\d{3}$" label="Конец участка" {...props.field} {...props} />
              )}
            /> */}
            {/* <GeoInputRange
          id="lidarForm-range"
          label="Начало участка - Конец участка"
          rangeType="text"
          minRequired
          maxRequired
          placeholderMin="0+000"
          placeholderMax="0+000"
          value={valueRange}
          onChange={(value) => setValueRange(value)}
          setIsValid={setIsValid}
          size="fullwidth"
        /> */}
            <div className="mb-3">
              <GeoInputRangeTest
                id="bridgeForm-range"
                label="Начало участка - Конец участка"
                rangeType="text"
                // minRequired
                // maxRequired
                placeholderMin="0+000"
                placeholderMax="0+000"
                value={valueRange}
                onChange={(value) => setValueRange(value)}
                setIsValidRange={setIsValidRange}
                size="fullwidth"
              />
            </div>
          </>
        ) : (
          <div className="mb-3">
            <GeoSinglePicketInput
              id="bridgeForm-location"
              label="Местоположение"
              tooltipPlacement="right"
              rangeType="text"
              placeholder="0+000"
              value={valueLocation}
              onChange={(value) => setValueLocation(value)}
              setIsValid={setIsValidLocation}
              size="fullwidth"
            />
            {/* <Controller
              control={control}
              name="location"
              render={(props) => (
                <GeoSinglePicketInput             
                id="bridgeForm-location"
                label="Местоположение"
                tooltipPlacement='right-end'
                rangeType="text"
                placeholder="0+000"
                value={valueLocation}
                onChange={(value) => setValueLocation(value)}
                setIsValid={setIsValidLocation}
                size="fullwidth" />
                // <GeoInputField placeholder="0+000" pattern="\d+\+\d{3}$" label="Местоположение" {...props.field} {...props} />
              )}
            /> */}
          </div>
        )}
        <div className="mb-3">
          <Controller
            control={control}
            name="length"
            render={(props) => (
              <GeoInputField
                placeholder="Протяженность, м"
                required
                type="number"
                label="Протяженность, м"
                {...props.field}
                {...props}
                value={lengthValue}
                onChange={(e) => {
                  setLengthValue(e.currentTarget.value);
                }}
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="region"
            render={(props) => (
              <GeoSingleSelect
                options={
                  regionOptions &&
                  regionOptions.map((item) => ({
                    value: item.dimmember_gid,
                    label: item.name,
                  }))
                }
                placeholder="Регион"
                label="Регион"
                {...props.field}
                {...props}
                onChange={(e) => {
                  props.field.onChange(e);
                  setRegionValue(e);
                }}
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="district"
            render={(props) => (
              <GeoSingleSelect
                options={
                  districtOptions &&
                  districtOptions.map((item) => ({
                    value: item.dimmember_gid,
                    label: item.name,
                  }))
                }
                placeholder="Район"
                label="Район"
                {...props.field}
                {...props}
                onChange={(e) => {
                  props.field.onChange(e);
                  setDistrictValue(e);
                }}
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="city"
            render={(props) => (
              <GeoSingleSelect
                options={
                  cityOptions &&
                  cityOptions.map((item) => ({
                    value: item.dimmember_gid,
                    label: item.name,
                  }))
                }
                placeholder="Город"
                label="Город"
                {...props.field}
                {...props}
                onChange={(e) => {
                  props.field.onChange(e);
                  setCityValue(e);
                }}
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="locality"
            render={(props) => (
              <GeoSingleSelect
                options={
                  localityOptions &&
                  localityOptions.map((item) => ({
                    value: item.dimmember_gid,
                    label: item.name,
                  }))
                }
                placeholder="Населенный пункт"
                label="Населенный пункт"
                {...props.field}
                {...props}
                onChange={(e) => {
                  props.field.onChange(e);
                  setLocalityValue(e);
                }}
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="type"
            render={(props) => (
              <GeoSingleSelect
                options={
                  typeOptions &&
                  typeOptions.map((item) => ({
                    value: item.dimmember_gid,
                    label: item.name,
                  }))
                }
                placeholder="Тип"
                label="Тип"
                {...props.field}
                {...props}
                onChange={(e) => {
                  props.field.onChange(e);
                  setTypeValue(e);
                }}
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="date_build"
            defaultValue={Date.now().toString()}
            render={(props) => (
              <GeoInputField type="date" label="Дата постройки" defaultValue={new Date().toDateString()} {...props.field} {...props} />
              // Date.now().toString()
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="technical_condition"
            render={(props) => (
              <GeoSingleSelect
                options={
                  technicalConditionOptions &&
                  technicalConditionOptions.map((item) => ({
                    value: item.dimmember_gid,
                    label: item.name,
                  }))
                }
                placeholder="Техническое состояние"
                label="Техническое состояние"
                {...props.field}
                {...props}
                onChange={(e) => {
                  props.field.onChange(e);
                  setTechnicalConditionValue(e);
                }}
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="barriers_type"
            render={(props) => (
              <GeoSingleSelect
                options={
                  barriersTypeOptions &&
                  barriersTypeOptions.map((item) => ({
                    value: item.dimmember_gid,
                    label: item.name,
                  }))
                }
                placeholder="Тип препятствия"
                label="Тип препятствия"
                {...props.field}
                {...props}
                onChange={(e) => {
                  props.field.onChange(e);
                  setBarriersTypeValue(e);
                }}
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="identification_code"
            render={(props) => (
              <GeoInputField placeholder="Идентификационный код" label="Идентификационный код" {...props.field} {...props} />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="square"
            render={(props) => (
              <GeoInputField
                type="number"
                placeholder="Площадь покрытия мост сооружения, м кв."
                label="Площадь покрытия мост сооружения, м кв."
                {...props.field}
                {...props}
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="overall_dimensions"
            render={(props) => (
              <GeoInputField
                type="number"
                placeholder="Габарит мостового сооружения по ширине, м"
                label="Габарит мостового сооружения по ширине, м"
                {...props.field}
                {...props}
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            control={control}
            name="balance"
            render={(props) => (
              <GeoInputField
                type="number"
                placeholder="Балансовая стоимость, тыс. руб"
                label="Балансовая стоимость, тыс. руб"
                {...props.field}
                {...props}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="barriers_name"
          render={(props) => (
            <GeoInputField placeholder="Наименование препятствия" label="Наименование препятствия" {...props.field} {...props} />
          )}
        />
        {/* <Controller
          control={control}
          name="bridge_type"
          render={(props) => (
            <GeoSingleSelect
              options={
                bridgeTypeOptions &&
                bridgeTypeOptions.map((item) => ({
                  value: item.dimmember_gid,
                  label: item.name,
                }))
              }
              placeholder="Тип моста"
              label="Тип моста"
              handleChange={setBridgeTypeValue}
              {...props.field}
              {...props}
            />
          )}
        /> */}
        {/* <Controller
          control={control}
          name="location_type"
          render={(props) => (
            <GeoSingleSelect
              options={
                locationTypeOptions &&
                locationTypeOptions.map((item) => ({
                  value: item.dimmember_gid,
                  label: item.name,
                }))
              }
              placeholder="Тип расположения"
              label="Тип расположения"
              handleChange={setLocationTypeValue}
              {...props.field}
              {...props}
            />
          )}
        /> */}
        {/* <div className="GeoMapCardDetailEditing__footer px-4 pe-5">
          <Button
            variant="skdf-primary"
            type="submit"
            className="GeoMapCardDetail__button d-inline-flex justify-content-center align-items-center gap-2 w-50"
          >
            <div className="w-100">{isLoadingBtn ? <GeoLoader color="#fff" /> : 'Сохранить'}</div>
          </Button>
          <Button
            variant="skdf-stroke"
            onClick={() => {
              open(false);
              setEditingType('');
            }}
          >
            Отменить
          </Button>{' '}
        </div> */}
        <div className="d-flex direction-column mt-4">
          <Button
            variant="skdf-primary"
            type="submit"
            disabled={objectType === 'linear' ? !isValidRange : !isValidLocation}
            className="d-inline-flex justify-content-center w-100 align-items-center me-4"
          >
            <div className="w-100">{isLoadingBtn ? <GeoLoader color="#fff" /> : 'Сохранить'}</div>
          </Button>
          <Button
            variant="skdf-stroke"
            className="d-inline-flex justify-content-center w-100 align-items-center"
            onClick={() => {
              open(false);
              setEditingType('');
            }}
          >
            Отменить
          </Button>
        </div>
      </form>
    </>
  );
};

export default GeoMapCardDetailBridge;
