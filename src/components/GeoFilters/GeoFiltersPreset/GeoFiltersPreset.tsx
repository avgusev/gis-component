import React, { FC, useEffect, useState } from 'react';
import { Button, Modal, Accordion, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import GeoSearchInput from '../GeoSearchInput/GeoSearchInput';
import './GeoFiltersPreset.scss';
import '../GeoFilters.scss';
import GeoFiltersPresetTypes from './GeoFiltersPreset.types';
import Select, { components, SingleValue } from 'react-select';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { GeoIcon } from '../../GeoIcon/GeoIcon';
import { getPresets, setPresetFilters, setSelectedPreset } from '../../../reducers/preset.reducer';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import GeoInputField from '../../GeoForms/GeoInputField/GeoInputField';
import { setPresetRegion } from '../../../reducers/region.reducer';
import { setPresetAgglomerations } from '../../../reducers/agglomeration.reducer';
import { setPresetCategories } from '../../../reducers/category.reducer';
import { setPresetCities } from '../../../reducers/city.reducer';
import { setPresetDistricts } from '../../../reducers/district.reducer';
import { setPresetPlanningStructures } from '../../../reducers/planningStructure.reducer';
import { setPresetRoutes } from '../../../reducers/route.reducer';
import { setPresetTowns } from '../../../reducers/town.reducer';
import axios from 'axios';
import { pgApiUrl, privateSchemaHeader } from '../../../config/constants';

const GeoFiltersPreset: FC<GeoFiltersPresetTypes> = ({ isPresetOpen, setIsPresetOpen, mapLayers, setMapLayers }) => {
  const { handleSubmit, control } = useForm();
  const [selectedPresetItem, setSelectedPresetItem] = useState<any>();
  const dispatch = useAppDispatch();
  const selectedPreset = useAppSelector((state) => state.preset.selectedPreset);
  const presetFilters = useAppSelector((state) => state.preset.presetFilters);
  const regionsFilter = useAppSelector((state) => state.region);
  const citiesFilter = useAppSelector((state) => state.city);
  const townsFilter = useAppSelector((state) => state.town);
  const routesFilter = useAppSelector((state) => state.route);
  const districtsFilter = useAppSelector((state) => state.district);
  const planningStructuresFilter = useAppSelector((state) => state.planingStructure);
  const agglomerationsFilter = useAppSelector((state) => state.agglomeration);
  const categoryFilter = useAppSelector((state) => state.category);
  const userAuth: any = useAppSelector((state) => state.user.userAuthData);

  useEffect(() => {
    dispatch(getPresets());
  }, []);

  // useEffect(() => {
  //   setSelectedPresetItem(selectedPreset);
  // }, [selectedPreset]);

  const createPreset = (name) => {
    try {
      const newPreset = {
        name: name,
        layers: mapLayers,
        filters: {
          region: {
            filter: '',
            loading: regionsFilter.loading,
            data: regionsFilter.data,
            selected: regionsFilter.selected,
            cql: regionsFilter.cql,
            filterField: regionsFilter.filterField,
          },
          city: {
            filter: '',
            loading: citiesFilter.loading,
            data: citiesFilter.data,
            selected: citiesFilter.selected,
            cql: citiesFilter.cql,
            filterField: citiesFilter.filterField,
          },
          town: {
            filter: '',
            loading: townsFilter.loading,
            data: townsFilter.data,
            selected: townsFilter.selected,
            cql: townsFilter.cql,
            filterField: townsFilter.filterField,
          },
          district: {
            filter: '',
            loading: districtsFilter.loading,
            data: districtsFilter.data,
            selected: districtsFilter.selected,
            cql: districtsFilter.cql,
            filterField: districtsFilter.filterField,
          },
          planingStructure: {
            filter: '',
            loading: planningStructuresFilter.loading,
            data: planningStructuresFilter.data,
            selected: planningStructuresFilter.selected,
            cql: planningStructuresFilter.cql,
            filterField: planningStructuresFilter.filterField,
          },
          route: {
            filter: '',
            loading: routesFilter.loading,
            data: routesFilter.data,
            selected: routesFilter.selected,
            cql: routesFilter.cql,
            filterField: routesFilter.filterField,
          },
          agglomeration: {
            filter: '',
            loading: agglomerationsFilter.loading,
            data: agglomerationsFilter.data,
            selected: agglomerationsFilter.selected,
            cql: agglomerationsFilter.cql,
            filterField: agglomerationsFilter.filterField,
          },
          category: {
            filter: '',
            loading: categoryFilter.loading,
            data: categoryFilter.data,
            selected: categoryFilter.selected,
            cql: categoryFilter.cql,
            filterField: categoryFilter.filterField,
          },
        },
      };

      const presets = Array.from(presetFilters);
      const index = presets.findIndex((item) => {
        return item.name === newPreset.name;
      });
      if (index === -1) {
        presets.push(newPreset);
      } else {
        presets.splice(index, 1);
        presets.push(newPreset);
      }

      setPresets(presets);
      //dispatch(setPresetFilters(newPreset));
      //dispatch(setPresets(newPreset));
    } catch (error) {
      toast.error(`Ошибка при получении выбранных фильтров! ${error}`);
    }
  };

  const deletePreset = (name) => {
    const presets = Array.from(presetFilters);

    const index = presets.findIndex((item) => {
      return item.name === name;
    });
    if (index !== -1) {
      presets.splice(index, 1);

      setPresets(presets, true);
    }
  };

  const setPresets = (presets, isDelete?) => {
    try {
      const body: any = {
        p_user_id: userAuth?.profile?.userId,
        p_json: presets,
      };
      axios
        .post(`${pgApiUrl}/rpc/set_filter_set`, body, privateSchemaHeader)
        .then((response) => {
          dispatch(getPresets());
          if (isDelete) {
            dispatch(setSelectedPreset({}));
            toast.info(`Пресет успешно удален!`);
          } else {
            toast.info('Пресет успешно сохранен!');
          }
        })
        .catch((error) => {
          console.log('Ошибка при сохранении престов в БД', error);
        });
    } catch (error) {
      console.log('Ошибка при сохранении пресетов!', error);
    }
  };

  const setPresetFilter = (e) => {
    try {
      const selectedPreset: any = presetFilters.filter((item) => item.name === e.value);
      if (selectedPreset && selectedPreset.length > 0) {
        dispatch(setPresetRegion(selectedPreset?.[0]?.filters.region));
        dispatch(setPresetAgglomerations(selectedPreset?.[0]?.filters.agglomeration));
        dispatch(setPresetCategories(selectedPreset?.[0]?.filters.category));
        dispatch(setPresetCities(selectedPreset?.[0]?.filters.city));
        dispatch(setPresetDistricts(selectedPreset?.[0]?.filters.district));
        dispatch(setPresetPlanningStructures(selectedPreset?.[0]?.filters.planingStructure));
        dispatch(setPresetRoutes(selectedPreset?.[0]?.filters.route));
        dispatch(setPresetTowns(selectedPreset?.[0]?.filters.town));
        setMapLayers(selectedPreset?.[0]?.layers);
      }
    } catch (error) {
      toast.error(`Ошибка при применении пресета фильтра! ${error}`);
    }
  };

  const onSubmit = (data) => {
    if (data?.presetname) {
      createPreset(data?.presetname);
    }
  };
  return (
    <Modal
      centered
      //size="sm"
      scrollable
      show={isPresetOpen}
      onHide={() => {
        setIsPresetOpen(false);
      }}
      //style={{ width: '600px' }}
      contentClassName="skdf-shadow-down-16dp"
    >
      <Modal.Header className="d-flex px-4 py-3">
        <Col>
          <span className="GeoFiltersFull__header__title mb-0 mt-0">Пресеты фильтров</span>
        </Col>
      </Modal.Header>
      <Modal.Body className="px-4 py-3" style={{ minHeight: '300px', height: '300px' }}>
        {' '}
        <Row>
          <Col>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <Row className="my-2 mb-3">
                <Col className="pe-0" xs={8}>
                  <Controller
                    control={control}
                    rules={{ required: true }}
                    name="presetname"
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <div className="mb-3">
                        <label className="form-check-label cursorLayers">Название пресета фильтров</label>
                        <input
                          name={name}
                          className="form-control form-control-sm"
                          placeholder="Введите название пресета"
                          autoComplete="off"
                          value={value}
                          onChange={(e) => {
                            onChange(e);
                          }}
                        />
                        <div className="invalid-feedback">Некорректные данные</div>
                      </div>
                    )}
                  />
                </Col>
                <Col xs={4}>
                  {' '}
                  <Button type="submit" variant="skdf-primary" className="w-100" style={{ marginTop: '20px' }}>
                    Создать
                  </Button>
                </Col>
              </Row>
            </form>
            <hr />
            <Row className="mb-3">
              <Col xs="10">
                <label htmlFor="hover_idetify_switcher" className="form-check-label cursorLayers">
                  Выберите пресет
                </label>
                <Select
                  options={
                    presetFilters && presetFilters.length > 0
                      ? presetFilters.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))
                      : []
                  }
                  placeholder="Выберите пресет"
                  isClearable
                  classNamePrefix="skdf-select"
                  className="skdf-select-container"
                  menuPortalTarget={document.body}
                  menuShouldScrollIntoView={true}
                  menuPosition="absolute"
                  maxMenuHeight={256}
                  styles={{
                    menuPortal: (provided) => ({ ...provided, paddingTop: 0, zIndex: 9999 }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 8,
                    spacing: { ...theme.spacing, controlHeight: 40, menuGutter: 0 },
                  })}
                  value={
                    //selectedPresetItem
                    selectedPreset
                  }
                  onChange={(e) => {
                    //setSelectedPresetItem(e);
                    dispatch(setSelectedPreset(e));
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                    ClearIndicator: () => null,
                    NoOptionsMessage: (props) => <components.NoOptionsMessage {...props} children="Не найдено" />,
                    DropdownIndicator: ({ cx }) => (
                      <div className={cx({ indicator: true, 'dropdown-indicator': true })}>
                        <GeoIcon name="arrow_down" iconType="arrow_down" />
                      </div>
                    ),
                  }}
                />
              </Col>
              <Col xs="1" className="GeoFiltersPreset__icon">
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 100, hide: 100 }}
                  overlay={(props) => (
                    <Tooltip id="map-tooltip" {...props}>
                      Сохранить
                    </Tooltip>
                  )}
                >
                  <div>
                    <GeoIcon
                      name="check"
                      iconType="check"
                      onClick={() => {
                        if (selectedPreset && selectedPreset !== null && Object.keys(selectedPreset).length > 0) {
                          createPreset(selectedPreset?.value);
                        }
                      }}
                    />
                  </div>
                </OverlayTrigger>
              </Col>
              <Col xs="1" className="GeoFiltersPreset__icon">
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 100, hide: 100 }}
                  overlay={(props) => (
                    <Tooltip id="map-tooltip" {...props}>
                      Удалить пресет
                    </Tooltip>
                  )}
                >
                  <div>
                    <GeoIcon
                      name="trash"
                      iconType="trash"
                      onClick={() => {
                        if (selectedPreset && selectedPreset !== null && Object.keys(selectedPreset).length > 0) {
                          deletePreset(selectedPreset?.value);
                        }
                      }}
                    />
                  </div>
                </OverlayTrigger>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="px-4 d-flex justify-content-start flex-nowrap">
        <Col xs={6}>
          <Button
            variant="skdf-primary"
            className="w-100"
            onClick={() => {
              if (selectedPreset?.value) {
                setPresetFilter(selectedPreset);
              }
              setIsPresetOpen(false);
            }}
          >
            Применить
          </Button>
        </Col>
        <Col xs={6}>
          <Button
            variant="skdf-stroke"
            className="w-100"
            onClick={() => {
              setIsPresetOpen(false);
            }}
          >
            {/* <div className="d-flex">
              <i>
                <svg width={24} fill="none" height={24}>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L5.29287 17.2929C4.90234 17.6834 4.90234 18.3166 5.29287 18.7071C5.68339 19.0976 6.31655 19.0976 6.70708 18.7071L18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289Z"
                    fill="currentColor"
                  />
                </svg>
              </i>
              <span className="mx-3"> */}
            Закрыть
            {/* </span>
            </div> */}
          </Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
};

export default GeoFiltersPreset;
