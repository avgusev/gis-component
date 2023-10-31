import React, { FC, memo, useState } from 'react';
import './GeoFilters.scss';
import { Card, Accordion, Button } from 'react-bootstrap';
import GeoBadgeButton from '../GeoBadgeButton/GeoBadgeButton';
import GeoFiltersFullScreen from '../GeoFiltersFullScreen/GeoFiltersFullScreen';
import GeoIconButton from '../GeoIconButton';
import { GeoFiltersTypes } from './GeoFilters.types';
import GeoSearchRoads from './GeoSearchRoads/GeoSearchRoads';
import GeoSearchRegions from './GeoSearchRegions/GeoSearchRegions';
import GeoSearchAgglomerations from './GeoSearchAgglomeration/GeoSearchAgglomerations';
import GeoSearchPlanningStructures from './GeoSearchPlanningStructure/GeoSearchPlanningStructures';
import GeoSearchCities from './GeoSearchCities/GeoSearchCities';
import GeoSearchRoutes from './GeoSearchRoute/GeoSearchRoutes';
import GeoSearchDistricts from './GeoSearchDistricts/GeoSearchDistricts';
import GeoSearchTowns from './GeoSearchTowns/GeoSearchTowns';
import { getAgglomerations, resetAgglomerations } from '../../reducers/agglomeration.reducer';
import { getTowns, resetTowns } from '../../reducers/town.reducer';
import { getCities, resetCities } from '../../reducers/city.reducer';
import { getRoutes, resetRoutes } from '../../reducers/route.reducer';
import { getRegions, resetRegions } from '../../reducers/region.reducer';
import { getPlaningStructures, resetPlanningStructures } from '../../reducers/planningStructure.reducer';
import { getDistricts, resetDistricts } from '../../reducers/district.reducer';
import { useAppDispatch, useAppSelector } from '../../config/store';
import GeoSearchCategories from './GeoSearchCategories/GeoSearchCategories';
import { getCategories, resetCategories } from '../../reducers/category.reducer';
import GeoFiltersPreset from './GeoFiltersPreset/GeoFiltersPreset';
import { resetSelectedPreset } from '../../reducers/preset.reducer';
import GeoSearchWorksYear from './GeoSearchWorksYear/GeoSearchWorksYear';
import { getRoadworks5yYears, resetRoadworks5y } from '../../reducers/roadworks5y.reducer';
import GeoSearchRoadClass from './GeoSearchRoadClass/GeoSearchRoadClass';
import { getRoadClasses, resetRoadClasses } from '../../reducers/roadClass.reducer';
import { getRoadValues, resetRoadValues } from '../../reducers/roadValue.reducer';
import { getWorkTypes, resetWorkTypes } from '../../reducers/workType.reducer';
import GeoSearchWorkType from './GeoSearchWorkType/GeoSearchWorkType';
import GeoRoadWayWidth from './GeoRoadWayWidth/GeoRoadWayWidth';
import GeoSearchTraffic from './GeoSearchTraffic/GeoSearchTraffic';
import { resetRoadwayWidth } from '../../reducers/roadwaywidth.reducer';
import { resetTraffic } from '../../reducers/traffic.reducer';
import GeoSearchSkeleton from './GeoSearchSkeleton/GeoSearchSkeleton';
import { resetSkeleton } from '../../reducers/skeleton.reducer';
import { resetNorm } from '../../reducers/norm.reducer';
import { resetLoading } from '../../reducers/loading.reducer';
import { resetDtp } from '../../reducers/dtp.reducer';
import GeoSearchNorm from './GeoSearchNorm/GeoSearchNorm';
import GeoSearchLoading from './GeoSearchLoading/GeoSearchLoading';
import GeoSearchDtp from './GeoSearchDtp/GeoSearchDtp';
import { resetFilter } from '../../reducers/filters.reducer';
import GeoFiltersRoadValue from './GeoFiltersRoadValue/GeoFiltersRoadValue';

const GeoFilters: FC<GeoFiltersTypes> = ({
  isFiltersOpen,
  setIsFiltersOpen,
  routerRest,
  isSearchingFeature,
  setIsSearchingFeature,
  mapLayers,
  setMapLayers,
  isResetBtnActive,
  updateMapSize,
}) => {
  const [isFullFilter, setIsFullFilter] = useState(false);
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const [searchStr, setSearchStr] = useState('');

  const selectedFilters: number[] = useAppSelector((state) => state.filters.selectedFilters);

  const regionsFilterData = useAppSelector((state) => state.region.data);
  const citiesFilterData = useAppSelector((state) => state.city.data);
  const townsFilterData = useAppSelector((state) => state.town.data);
  const routesFilterData = useAppSelector((state) => state.route.data);
  const districtsFilterData = useAppSelector((state) => state.district.data);
  const planningStructuresFilterData = useAppSelector((state) => state.planingStructure.data);
  const agglomerationsFilterData = useAppSelector((state) => state.agglomeration.data);
  const categoriesFilterData = useAppSelector((state) => state.category.data);
  const roadClassFilterData = useAppSelector((state) => state.roadclass.data);
  const workTypeFilterData = useAppSelector((state) => state.worktype.data);
  const roadworks5yFilterData = useAppSelector((state) => state.roadworks5y.data);
  const roadValuesFilterData = useAppSelector((state) => state.roadvalues.data);

  const regionsFilterSelected = useAppSelector((state) => state.region.selected);
  const citiesFilterSelected = useAppSelector((state) => state.city.selected);
  const townsFilterSelected = useAppSelector((state) => state.town.selected);
  const routesFilterSelected = useAppSelector((state) => state.route.selected);
  const districtsFilterSelected = useAppSelector((state) => state.district.selected);
  const planningStructuresFilterSelected = useAppSelector((state) => state.planingStructure.selected);
  const agglomerationsFilterSelected = useAppSelector((state) => state.agglomeration.selected);
  const categoriesFilterSelected = useAppSelector((state) => state.category.selected);
  const roadClassFilterSelected = useAppSelector((state) => state.roadclass.selected);
  const workTypeFilterSelected = useAppSelector((state) => state.worktype.selected);
  const roadworks5yFilterSelected = useAppSelector((state) => state.roadworks5y.selected);
  const roadValuesFilterSelected = useAppSelector((state) => state.roadvalues.selected);

  const userAuth: any = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  return (
    <>
      {/* <GeoIconButton
        iconType="arrow-left"
        handleClick={() => {
          setIsFiltersOpen(!isFiltersOpen);
          updateMapSize();
        }}
        classes="GeoFilters__close__btn"
      /> */}
      {isPresetOpen && (
        <GeoFiltersPreset isPresetOpen={isPresetOpen} setIsPresetOpen={setIsPresetOpen} mapLayers={mapLayers} setMapLayers={setMapLayers} />
      )}
      <Card style={{ width: '25%' }} className="skdf-shadow-down-16dp GeoFilters__card">
        <Card.Header className="GeoFilters__card__header">
          <div>
            <GeoSearchRoads
              routerRest={routerRest}
              isSearchingFeature={isSearchingFeature}
              setSearchStr={setSearchStr}
              searchStr={searchStr}
              setIsSearchingFeature={setIsSearchingFeature}
            />
          </div>
        </Card.Header>
        <Card.Body className="GeoFilters__content pt-0 pb-4">
          <GeoFiltersFullScreen isOpen={isFullFilter} setIsOpen={setIsFullFilter} />

          <div>
            <div className="GeoFilters__group__title mb-4">Местоположение</div>
            <Accordion
              //defaultActiveKey={['0']}
              alwaysOpen
              flush
              onSelect={(e) => {
                if (e.length > 0) {
                  if (e.includes('regionsFilter') && regionsFilterData.length === 0 && regionsFilterSelected.length === 0)
                    // dispatch(getRegions({ search: '', size: 0, sort: 'asc' }));
                    dispatch(getRegions({ search: '', level: 1, selected: selectedFilters }));
                  if (e.includes('citiesFilter') && citiesFilterData.length === 0 && citiesFilterSelected.length === 0)
                    dispatch(getCities({ search: '', level: 4, selected: selectedFilters }));
                  if (e.includes('townsFilter') && townsFilterData.length === 0 && townsFilterSelected.length === 0)
                    dispatch(getTowns({ search: '', level: 5, selected: selectedFilters }));
                  if (
                    e.includes('agglomerationsFilter') &&
                    agglomerationsFilterData.length === 0 &&
                    agglomerationsFilterSelected.length === 0
                  )
                    dispatch(getAgglomerations({ search: '', level: 2, selected: selectedFilters }));
                  if (
                    e.includes('planningStructuresFilter') &&
                    planningStructuresFilterData.length === 0 &&
                    planningStructuresFilterSelected.length === 0
                  )
                    dispatch(getPlaningStructures({ search: '', level: 6, selected: selectedFilters }));
                  if (e.includes('districtsFilter') && districtsFilterData.length === 0 && districtsFilterSelected.length === 0)
                    dispatch(getDistricts({ search: '', level: 3, selected: selectedFilters }));
                  if (e.includes('routesFilter') && routesFilterData.length === 0 && routesFilterSelected.length === 0)
                    dispatch(getRoutes({ search: '', size: 0, sort: 'asc' }));
                  if (e.includes('roadworks5yFilter') && roadworks5yFilterData.length === 0 && roadworks5yFilterSelected.length === 0)
                    dispatch(getRoadworks5yYears({ search: '' }));
    
                }
              }}
            >
              <Accordion.Item eventKey="regionsFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Регион</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchRegions />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="agglomerationsFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Агломерация</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchAgglomerations />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="districtsFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Район</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchDistricts />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="citiesFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Город</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchCities />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="townsFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Населенный пункт</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchTowns />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="planningStructuresFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Планировочная структура</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchPlanningStructures />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <div className="mt-5">
            <div className="GeoFilters__group__title mb-4">Технические характеристики</div>
            <Accordion
              alwaysOpen
              flush
              className="mt-0"
              onSelect={(e) => {
                if (e.length > 0) {
                  if (e.includes('categoriesFilter') && categoriesFilterData.length === 0 && categoriesFilterSelected.length === 0)
                    dispatch(getCategories({ search: '', size: 0, sort: 'asc' }));
                  if (e.includes('roadClassFilter') && roadClassFilterData.length === 0 && roadClassFilterSelected.length === 0)
                    dispatch(getRoadClasses({ search: '', size: 0, sort: 'asc' }));
                }
              }}
            >
              <Accordion.Item eventKey="roadClassFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Класс</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchRoadClass />
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="categoriesFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Категория</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchCategories />
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="roadWayWidthFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Ширина проезжей части, м</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoRoadWayWidth />
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="trafficFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Интенсивность движения, тс/ч</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchTraffic />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* <div className="mt-5">
            <div className="GeoFilters__group__title mb-4">Дорожные работы</div>
            <Accordion
              alwaysOpen
              flush
              className="mt-0"
              onSelect={(e) => {
                if (e.length > 0) {
                  if (e.includes('roadworks5yFilter') && roadworks5yFilterData.length === 0 && roadworks5yFilterSelected.length === 0)
                    dispatch(getRoadworks5yYears({ search: '' }));
                }
              }}
            >
              <Accordion.Item eventKey="roadworks5yFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Год работ</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchWorksYear />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div> */}

          <div className="mt-5">
            <div className="GeoFilters__group__title mb-4">Проектная деятельность</div>
            <Accordion
              alwaysOpen
              flush
              className="mt-0"
              onSelect={(e) => {
                if (e.length > 0) {
                  if (e.includes('workTypeFilter') && workTypeFilterData.length === 0 && workTypeFilterSelected.length === 0)
                    dispatch(getWorkTypes({ search: '', size: 0, sort: 'asc' }));
                }
              }}
            >
              <Accordion.Item eventKey="workTypeFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Вид работ</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchWorkType />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          <div className="mt-5">
            <div className="GeoFilters__group__title mb-4">Состояние</div>
            <Accordion alwaysOpen flush className="mt-0" onSelect={(e) => {}}>
              <Accordion.Item eventKey="normFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Соответствует нормативному состоянию</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchNorm />
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="loadingFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Участки перегрузки</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchLoading />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          <div className="mt-5">
            <div className="GeoFilters__group__title mb-4">Безопасность</div>
            <Accordion alwaysOpen flush className="mt-0" onSelect={(e) => {}}>
              <Accordion.Item eventKey="emergencyAreasFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Аварийно-опасные участки</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchDtp />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          <div className="mt-5">
            <div className="GeoFilters__group__title mb-4">Дополнительно</div>
            <Accordion
              alwaysOpen
              flush
              className="mt-0"
              onSelect={(e) => {
                if (e.length > 0) {
                  if (e.includes('routesFilter') && routesFilterData.length === 0 && routesFilterSelected.length === 0)
                    dispatch(getRoutes({ search: '', size: 0, sort: 'asc' }));
                  if (e.includes('roadValueFilter') && roadValuesFilterData.length === 0 && roadValuesFilterSelected.length === 0)
                    dispatch(getRoadValues({ search: '', size: 0, sort: 'asc' }));
                }

              }}
            >
              <Accordion.Item eventKey="routesFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Международный маршрут</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchRoutes />
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="skeletonFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Входит в опорную сеть</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoSearchSkeleton />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="roadValueFilter" className="my-3">
                <Accordion.Header>
                  <span className="h4 mb-0">Значение дороги</span>
                </Accordion.Header>
                <Accordion.Body>
                  <GeoFiltersRoadValue />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Card.Body>

        <Card.Footer className="GeoFilters__footer">
          {/*<GeoBadgeButton content="Показать все фильтры" handlerClick={setIsFullFilter} />*/}
          {!isResetBtnActive && (
            <Button
              variant="skdf-stroke"
              type="submit"
              //disabled={isResetBtnActive}
              className="GeoFilters__footer__item d-inline-flex justify-content-center w-100 align-items-center mx-4"
              onClick={() => {
                console.log('Clear all filters');
                setSearchStr('');
                dispatch(resetAgglomerations());
                dispatch(resetTowns());
                dispatch(resetCities());
                dispatch(resetRoutes());
                dispatch(resetRegions());
                dispatch(resetPlanningStructures());
                dispatch(resetDistricts());
                dispatch(resetCategories());
                dispatch(resetSelectedPreset());
                dispatch(resetRoadworks5y());
                dispatch(resetRoadClasses());
                dispatch(resetWorkTypes());
                dispatch(resetRoadwayWidth());
                dispatch(resetTraffic());
                dispatch(resetSkeleton());
                dispatch(resetNorm());
                dispatch(resetLoading());
                dispatch(resetDtp());
                dispatch(resetFilter());
                dispatch(resetRoadValues());

                // dispatch(getRegions({ search: '', size: 0, sort: 'asc' }));
                dispatch(getRegions({ search: '', level: 1 }));
                dispatch(getCities({ search: '', level: 4 }));
                dispatch(getTowns({ search: '', level: 5 }));
                dispatch(getAgglomerations({ search: '', level: 2 }));
                dispatch(getPlaningStructures({ search: '', level: 6 }));
                dispatch(getDistricts({ search: '', level: 3 }));
                dispatch(getRoutes({ search: '', size: 0, sort: 'asc' }));
                dispatch(getCategories({ search: '' }));
                dispatch(getRoadworks5yYears({ search: '' }));
                dispatch(getRoadClasses({ search: '', size: 0, sort: 'asc' }));
                dispatch(getWorkTypes({ search: '', size: 0, sort: 'asc' }));
                dispatch(getRoadValues({ search: '', size: 0, sort: 'asc' }));
              }}
            >
              Сбросить все фильтры
            </Button>
          )}
          {userAuth &&
            userAuth !== null &&
            userAuth?.userAuthData &&
            userAuth?.userAuthData?.profile &&
            userAuth?.userAuthData?.profile?.userId &&
            userAuth?.userAuthData?.profile?.userId !== '' && (
              <Button
                onClick={() => {
                  setIsPresetOpen(true);
                }}
                variant="skdf-primary"
                type="submit"
                className="GeoFilters__footer__item d-inline-flex justify-content-center w-100 align-items-center mx-4"
              >
                Пресеты
              </Button>
            )}
        </Card.Footer>
      </Card>
    </>
  );
};

export default GeoFilters;
