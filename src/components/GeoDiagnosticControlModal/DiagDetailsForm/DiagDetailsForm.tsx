import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from 'react-hook-form';
import GeoInputField from '../../GeoForms/GeoInputField/GeoInputField';
import GeoSingleSelect from '../../GeoForms/GeoSingleSelect/GeoSingleSelect';
import { DiagDetailsFormProps } from './DiagDetailsForm.types';
import './DiagDetailsForm.scss';
import axios from 'axios';
import { commandSchemaHeader, pgApiUrl, publicSchemaHeader, querySchemaHeader } from '../../../config/constants';
import { ISelectType } from '../../../global.types';
import { toast } from 'react-toastify';
import GeoLoader from '../../GeoLoader/GeoLoader';
import { useAppSelector, useAppDispatch } from '../../../config/store';
import { getPass, getPassOptions } from '../../../reducers/roadPass.reducer';
import { getObjectAccessLevel } from '../../../Map/mapFunctions';

const DiagDetailsForm = (props: DiagDetailsFormProps) => {
  const { createMode, idRoad, roadName, setIsCreateMode, setIsEditMode } = props;
  const dispatch = useAppDispatch();
  const { handleSubmit, control } = useForm();
  const [isSavingPass, setIsSavingPass] = useState(false);
  const [isBegValid, setIsBegValid] = useState(true);
  const [isEndValid, setIsEndValid] = useState(true);
  const [directionValue, setDirectionValue] = useState(null);
  const [customerValue, setCustomerValue] = useState(null);
  const [providerValue, setProviderValue] = useState(null);
  const [begDateValue, setBegDateValue] = useState('');
  const [endDateValue, setEndDateValue] = useState('');
  const [optionsCustomers, setOptionsCustomers] = useState<ISelectType[]>([]);
  const [optionsDirections, setOptionsDirections] = useState<ISelectType[]>([]);

  const selected = useAppSelector((state) => state.roadPass.selected);

  const postForm = (formData) => {
    const preparedData = { data: formData };
    setIsSavingPass(true);
    axios
      .post(`${pgApiUrl}/rpc/create_diag_passport`, preparedData, commandSchemaHeader)
      .then((response) => {
        toast.info('Диагностика успешно сохранена');
        dispatch(getPassOptions({ road_id: idRoad }));

        if (createMode) {
          dispatch(getPass({ road_id: idRoad, pass_id: response.data }));
        }
        setIsCreateMode(false);
        setIsEditMode(false);
        setIsSavingPass(false);
      })
      .catch((error) => {
        toast.warn('Ошибка при отправке данных формы');
        setIsSavingPass(false);
      });
  };

  const handleStartDateChange = (event) => {
    const value = event.target.value;
    if (new Date(value) > new Date()) {
      setIsBegValid(false);
    } else {
      setIsBegValid(true);
    }

    if (new Date(endDateValue) < new Date(value)) {
      setIsEndValid(false);
    } else {
      setIsEndValid(true);
    }

    setBegDateValue(value);
  };

  const handleEndDateChange = (event) => {
    const value = event.target.value;
    if (new Date(value) < new Date(begDateValue)) {
      setIsEndValid(false);
    } else {
      setIsEndValid(true);
    }
    setEndDateValue(value);
  };

  const onSubmit = () => {
    const modifiedData = {
      road_id: idRoad,
      part_id: directionValue?.value,
      diag_beg_date: begDateValue || '',
      diag_end_date: endDateValue || '',
      diag_customer: customerValue?.value || null,
      diag_provider: providerValue?.value || null,
    };
    if (!createMode) {
      modifiedData['id'] = selected?.id;
    }
    postForm(modifiedData);
  };

  const getAsyncOptions = (inputValue: string) => {
    try {
      if (inputValue) {
        const preparedData = {
          p_params: {
            FILTER: {
              ENTITY_CODE: 201,
              TEXT_SEARCH: inputValue,
            },
            PAGING: {
              LIMIT_ROWS: 1000,
            },
          },
        };
        return axios
          .post(`${pgApiUrl}/rpc/get_entity_list`, preparedData, publicSchemaHeader)
          .then(
            (result) => result.data.length > 0 && result.data.map((item) => ({ value: item.out_entity_id, label: item.out_full_name }))
          );
      }
      return false;
    } catch (error) {
      toast.error(`Ошибка при получении данных справочника!${error}`);
    }
  };

  const getDirections = () => {
    try {
      axios
        .post(`${pgApiUrl}/rpc/get_road_parts`, { p_road_id: idRoad }, querySchemaHeader)
        .then((response) => {
          const options = [];
          if (response?.data && response?.data?.length > 0) {
            response.data.map((item) => options.push({ value: item.id, label: item.full_name }));
          }
          setOptionsDirections(options);
        })
        .catch((error) => {
          console.error(`Ошибка получении данных getDirections: ${error}`);
        });
    } catch (error) {
      toast.error(`Ошибка при получении данных!${error}`);
    }
  };

  const getCustomers = () => {
    try {
      const preparedData = {
        p_params: {
          FILTER: {
            ENTITY_CODE: 201,
          },
          PAGING: {
            LIMIT_ROWS: 1000,
          },
        },
      };
      axios
        .post(`${pgApiUrl}/rpc/get_entity_list`, preparedData, publicSchemaHeader)
        .then((response) => {
          const options = [];
          response.data.map((item) => options.push({ value: item.out_entity_id, label: item.out_full_name }));
          setOptionsCustomers(options);
        })
        .catch((error) => {
          console.error(`Ошибка получении данных getCustomers: ${error}`);
        });
    } catch (error) {
      toast.error(`Ошибка при получении данных!${error}`);
    }
  };

  useEffect(() => {
    getCustomers();
    getDirections();
  }, []);

  useEffect(() => {
    if (selected) {
      setDirectionValue({ label: selected?.part_id ? selected?.part_name : 'Направление не выбрано', value: selected?.part_id });
      setCustomerValue({ value: selected?.diag_customer, label: selected?.diag_customer_name });
      setProviderValue({ value: selected?.diag_provider, label: selected?.diag_provider_name });
      setBegDateValue(selected?.diag_beg_date);
      setEndDateValue(selected?.diag_end_date);
    }
  }, [selected]);

  useEffect(() => {
    if (createMode) {
      setDirectionValue(null);
      setCustomerValue(null);
      setProviderValue(null);
      setBegDateValue('');
      setEndDateValue('');
    }
  }, [createMode]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className="mb-4 mt-3">{createMode ? 'Создание паспорта диагностики' : `Редактирование паспорта «${selected?.doc_name}»`}</h4>

      <div className="DiagDetailsForm__item">
        <Controller
          name="road"
          control={control}
          defaultValue={createMode ? '' : selected?.road_name}
          render={({ field }) => <GeoInputField name="road" disabled value={roadName} label="Дорога" type="text" placeholder="Дорога" />}
        />
      </div>
      <div className="DiagDetailsForm__item">
        <Controller
          name="direction"
          control={control}
          render={({ field }) => (
            <GeoSingleSelect
              name="direction"
              label="Направление"
              placeholder="Направление"
              options={optionsDirections}
              size="full_width"
              {...field}
              value={directionValue}
              onChange={(e) => {
                setDirectionValue(e);
              }}
            />
          )}
        />
        {!directionValue?.value && <span className="geo-form-invalid-feedback">Обязательное поле для заполнения</span>}
      </div>
      <div className="DiagDetailsForm__item">
        <div className="form-label">Заказчик</div>
        <Controller
          name="customer"
          control={control}
          // defaultValue={createMode ? null : { value: selected?.diag_customer, label: selected?.diag_customer_name }}
          render={({ field }) => {
            return (
              <AsyncSelect
                cacheOptions
                defaultOptions={optionsCustomers}
                isClearable={false}
                classNamePrefix="skdf-select"
                className={`skdf-select-container`}
                // maxMenuHeight={100}
                loadOptions={(str): any => getAsyncOptions(str)}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: '44px',
                  }),
                  menu: (provided) => ({ ...provided, paddingTop: 0, zIndex: 9999 }),
                }}
                // value={customerValue}
                noOptionsMessage={() => 'Ничего не найдено'}
                loadingMessage={() => 'Загружаю...'}
                placeholder="Заказчик"
                {...field}
                value={customerValue}
                onChange={(event: any) => {
                  if (event) {
                    setCustomerValue(event);
                  }
                }}
              />
            );
          }}
        />
      </div>
      <div className="DiagDetailsForm__item">
        <div className="form-label">Подрядчик</div>
        <Controller
          name="provider"
          control={control}
          // defaultValue={createMode ? null : { value: selected?.diag_provider, label: selected?.diag_provider_name }}
          render={({ field }) => (
            <AsyncSelect
              cacheOptions
              defaultOptions={optionsCustomers}
              isClearable={false}
              classNamePrefix="skdf-select"
              className={`skdf-select-container`}
              // maxMenuHeight={100}
              loadOptions={(str): any => getAsyncOptions(str)}
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: '44px',
                }),
                menu: (provided) => ({ ...provided, paddingTop: 0, zIndex: 9999 }),
              }}
              noOptionsMessage={() => 'Ничего не найдено'}
              loadingMessage={() => 'Загружаю...'}
              placeholder="Подрядчик"
              {...field}
              value={providerValue}
              onChange={(event: any) => {
                if (event) {
                  setProviderValue(event);
                }
              }}
            />
          )}
        />
      </div>
      <div className="DiagDetailsForm__item">
        <Controller
          name="beg_date"
          control={control}
          // defaultValue={createMode ? '' : selected?.diag_beg_date}
          render={({ field }) => (
            <>
              <GeoInputField
                className={`form-control ${!isBegValid && 'is-invalid'}`}
                name="beg_date"
                label="Дата начала"
                type="date"
                placeholder="Дата начала"
                {...field}
                value={begDateValue}
                onChange={handleStartDateChange}
              />
              {!isBegValid && <span className="geo-form-invalid-feedback">Дата начала не может быть позже текущей</span>}
            </>
          )}
        />
      </div>
      <div className="DiagDetailsForm__item">
        <Controller
          name="end_date"
          control={control}
          render={({ field }) => (
            <GeoInputField
              className={`form-control ${!isEndValid && 'is-invalid'}`}
              name="end_date"
              label="Дата окончания"
              type="date"
              placeholder="Дата окончания"
              {...field}
              value={endDateValue}
              onChange={handleEndDateChange}
            />
          )}
        />
        {!isEndValid && <span className="geo-form-invalid-feedback">Дата окончания не может быть раньше, чем дата начала</span>}
      </div>
      <div className="d-flex justify-content-end">
        {' '}
        <Button
          variant="skdf-primary"
          className="DiagDetailsForm__save-btn d-inline-flex justify-content-center w-25 align-items-center"
          type="submit"
          disabled={!directionValue?.value || isSavingPass || !isEndValid || !isBegValid}
        >
          {isSavingPass ? (
            <div className="d-flex">
              <div className="mt-1 me-2">
                <GeoLoader size={20} />
              </div>
              Сохранение...
            </div>
          ) : (
            <div>Сохранить</div>
          )}
        </Button>
        <Button
          variant="skdf-stroke"
          className="DiagDetailsForm__save-btn d-inline-flex justify-content-center w-25 align-items-center"
          onClick={() => {
            props.setIsEditMode(false);
          }}
        >
          Отменить
        </Button>
      </div>
    </form>
  );
};

export default DiagDetailsForm;
