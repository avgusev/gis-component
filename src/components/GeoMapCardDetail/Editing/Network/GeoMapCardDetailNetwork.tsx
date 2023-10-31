import React, { useState, useEffect } from 'react';
import GeoInputField from '../../../GeoForms/GeoInputField/GeoInputField';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import GeoSingleSelect from '../../../GeoForms/GeoSingleSelect/GeoSingleSelect';
import { ISelectOption } from '../../../GeoForms/GeoSingleSelect/GeoSingleSelect.types';
import { GeoMapCardDetailNetworkTypes } from './GeoMapCardDetailNetwork.types';
import axios from 'axios';
import '../GeoMapCardDetailEditing.scss';
import GeoLoader from '../../../GeoLoader/GeoLoader';
import { pgApiUrl, privateSchemaHeader, publicSchemaHeader } from '../../../../config/constants';
import TileLayer from 'ol/layer/Tile';
import GeoInputRangeTest from '../../../GeoInputRangeTest/GeoInputRangeTest';

const GeoMapCardDetailNetwork = (props: GeoMapCardDetailNetworkTypes) => {
  const { open, map, idRoad, idPart, setEditingType } = props;
  const { handleSubmit, control } = useForm();
  const [lengthValue, setLengthValue] = useState<string>('');
  const [countedLengthValue, setCountedLengthValue] = useState<number>(0);
  const [valueRange, setValueRange] = useState<string[] | number[]>([undefined, undefined]);
  const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);
  const [isValidRange, setIsValidRange] = useState<boolean>(false);
  const [networkStandartsValue, setNetworkStandartsValue] = useState<string>('');
  const [mmtOptions, setMmtOptions] = useState<any[]>([]);
  const [mmtValue, setMmtValue] = useState<any>(null);
  const [criterionOptions, setCriterionOptions] = useState<any[]>([]);
  const [criterionValue, setCriterionValue] = useState<any>(null);

  const onSubmit = () => {
    if (+lengthValue > 0 && +lengthValue <= countedLengthValue) {
      setIsLoadingBtn(true);
      const dataObj = {
        data: {
          part_id: idPart !== 0 ? idPart : null,
          road_id: idRoad,
          START: valueRange[0],
          FINISH: valueRange[1],
          LENGTH: lengthValue,
          // START: data?.beg,
          // FINISH: data?.end,
          // LENGTH: data?.length,
          // date: data?.date,
          ITR: mmtValue?.value,
          CRITERION: criterionValue?.value,
        },
      };
      console.log(dataObj);
      axios
        .post(`${pgApiUrl}/rpc/f_create_road_object`, dataObj, privateSchemaHeader)
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
    } else {
      toast.warn('Протяженность участка должна быть больше 0 и входить в интервал начала и конца участка!');
    }
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
          if (layer instanceof TileLayer && lname === 'lyr_road_conditions_skeleton') {
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

  const getMmt = () => {
    const pparams = {
      p_params: {
        FILTER: {
          DIMENSION_ID: 1802,
          NAME_FIELD: 'CODE',
          SHOW_ALL: 1,
        },
        PAGING: {
          START_POSITION: 0,
          LIMIT_ROWS: 100,
        },
      },
    };
    axios
      .post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, pparams, publicSchemaHeader)
      .then((response) => {
        setMmtOptions(response.data);
      })
      .catch((error) => {
        toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
      });
  };

  const getCriterion = () => {
    const pparams = {
      p_params: {
        FILTER: {
          DIMENSION_ID: 5015,
          NAME_FIELD: 'CRITERION',
          SHOW_ALL: 1,
        },
        PAGING: {
          START_POSITION: 0,
          LIMIT_ROWS: 100,
        },
      },
    };
    axios
      .post(`${pgApiUrl}/rpc/get_dimension_value_list_v2`, pparams, publicSchemaHeader)
      .then((response) => {
        setCriterionOptions(response.data);
      })
      .catch((error) => {
        toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
      });
  };

  useEffect(() => {
    getMmt();
    getCriterion();
  }, []);

  useEffect(() => {
    if (isValidRange && valueRange?.length === 2 && valueRange[0] && valueRange[1]) {
      const firstEl = +valueRange[0].toString().split('+')[0] + +valueRange[0].toString().split('+')[1] / 1000;
      const secondEl = +valueRange[1].toString().split('+')[0] + +valueRange[1].toString().split('+')[1] / 1000;
      const result = secondEl - firstEl;
      setCountedLengthValue(+result.toFixed(3));
      setLengthValue(result.toFixed(3).toString());
    }
  }, [valueRange, isValidRange]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        {' '}
        <div className="mb-3">
          <GeoInputRangeTest
            id="networkForm-range"
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
        {/* <Controller
          control={control}
          name="beg"
          render={(props) => (
            <GeoInputField
              placeholder="Начало участка"
              pattern="\d+\+\d{3}$"
              name="beg"
              label="Начало участка"
              {...props.field}
              {...props}
            />
          )}
        />
        <Controller
          control={control}
          name="end"
          render={(props) => (
            <GeoInputField placeholder="Конец участка" pattern="\d+\+\d{3}$" label="Конец участка" {...props.field} {...props} />
          )}
        /> */}
        <div className="mb-3">
          {' '}
          <Controller
            control={control}
            name="length"
            render={(props) => (
              <GeoInputField
                placeholder="Протяженность, км"
                required
                type={'number'}
                label="Протяженность, км"
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
        {/* <Controller
          control={control}
          name="date"
          defaultValue={Date.now().toString()}
          render={(props) => (
            <GeoInputField type="date" label="Дата начала" defaultValue={new Date().toDateString()} {...props.field} {...props} />
            // Date.now().toString()
          )}
        /> */}
        <Controller
          control={control}
          name="criterion"
          rules={{ required: true }}
          render={(props) => (
            <GeoSingleSelect
              options={
                criterionOptions &&
                criterionOptions.map((item) => ({
                  value: item.dimmember_gid,
                  label: item.name,
                }))
              }
              placeholder="Критерии опорной сети"
              label="Критерии опорной сети"
              {...props.field}
              {...props}
              onChange={(e) => {
                props.field.onChange(e);
                setCriterionValue(e);
              }}
            />
          )}
        />
        {!criterionValue && <div style={{ color: 'red', marginBottom: '20px' }}>{'*Критерии опорной сети - обязательное поле'}</div>}
        <Controller
          control={control}
          name="mmt"
          render={(props) => (
            <GeoSingleSelect
              options={
                mmtOptions &&
                mmtOptions.map((item) => ({
                  value: item.dimmember_gid,
                  label: item.name,
                }))
              }
              placeholder="МТМ"
              label="МТМ"
              {...props.field}
              {...props}
              onChange={(e) => {
                props.field.onChange(e);
                setMmtValue(e);
              }}
            />
          )}
        />
        <div className="GeoMapCardDetailEditing__footer px-4 pe-5">
          <Button
            variant="skdf-primary"
            type="submit"
            disabled={!isValidRange}
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
        </div>
      </form>
    </>
  );
};

export default GeoMapCardDetailNetwork;
