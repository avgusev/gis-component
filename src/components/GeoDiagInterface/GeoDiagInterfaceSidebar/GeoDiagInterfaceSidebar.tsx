import React, { useState, useEffect } from 'react';
import './GeoDiagInterfaceSidebar.scss';
import { Button, Card } from 'react-bootstrap';
import { GeoDiagInterfaceSidebarProps } from './GeoDiagInterfaceSidebar.types';
import { setMapMode } from '../../../reducers/map.reducer';
import { useAppDispatch } from '../../../config/store';
import axios from 'axios';
import { commandSchemaHeader, pgApiUrl } from '../../../config/constants';
import GeoLoader from '../../GeoLoader/GeoLoader';

const GeoDiagInterfaceSidebar = ({ selectedType, setSelectedType, isSidebarOpen, setIsSidebarOpen }: GeoDiagInterfaceSidebarProps) => {
  const [diagTypes, setDiagTypes] = useState<any>([]);
  const [isLoadingType, setIsLoadingType] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const getDiagTypes = () => {
    setIsLoadingType(true);
    axios
      .post(`${pgApiUrl}/rpc/get_diag_type`, {}, commandSchemaHeader)
      .then((response) => {
        setIsLoadingType(false);
        setDiagTypes(response?.data);
      })
      .catch((error) => {
        setIsLoadingType(false);
        console.error('Ошибка при получении типов диагностики! ', error);
      });
  };

  useEffect(() => {
    getDiagTypes();
  }, []);

  const links = ['Общая информация', 'LIDAR', 'PANORAMA'];

  return (
    <>
      {/* <GeoIconButton
        iconType={isSidebarOpen ? 'arrow-left' : 'arrow-right'}
        handleClick={() => {
          setIsSidebarOpen(!isSidebarOpen);
        }}
        classes={`GeoDiagInterfaceSidebar__close__btn ${!isSidebarOpen && 'GeoDiagInterfaceSidebar__close__btn--close'}`}
      /> */}
      {isSidebarOpen && (
        <Card className="skdf-shadow-down-16dp GeoDiagInterfaceSidebar__card">
          <Card.Header className="GeoDiagInterfaceSidebar__title mb-4">
            {/* <div className="GeoDiagInterfaceSidebar__title">Тип диагностики</div> */}
            <ul className="nav nav-pills skdf flex-column gap-1">
              <li className="nav-item">
                <div
                  className={`nav-link ${selectedType?.code === 'roadPass' ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedType({ code: 'roadPass', id: null, name: 'Паспорт дороги', src_table: null });
                  }}
                >
                  Паспорт дороги
                </div>
              </li>
            </ul>
          </Card.Header>

          <Card.Body className="GeoDiagInterfaceSidebar__cardbody">
            {isLoadingType ? (
              <GeoLoader />
            ) : diagTypes && diagTypes.length > 0 ? (
              <>
                <h4
                  style={{
                    borderBottom: 'var(--skdf-card-border-width) solid var(--skdf-card-border-color)',
                    paddingBottom: '10px',
                    fontWeight: 'bold',
                  }}
                >
                  {' '}
                  Тип диагностики
                </h4>
                <ul className="nav nav-pills skdf flex-column gap-1">
                  {diagTypes.map((item: any, index) => (
                    <li key={item?.id} className="nav-item">
                      <div
                        className={`nav-link ${selectedType === item ? 'active' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedType(item);
                        }}
                      >
                        {item?.name}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div>Нет данных</div>
            )}
          </Card.Body>
          <Card.Footer className="GeoFilters__footer">
            {/*<GeoBadgeButton content="Показать все фильтры" handlerClick={setIsFullFilter} />*/}

            <Button
              variant="skdf-stroke"
              type="submit"
              //disabled={isResetBtnActive}
              className="GeoFilters__footer__item d-inline-flex justify-content-center w-100 align-items-center mx-4"
              onClick={() => {
                console.log('Clear all filters');
                dispatch(setMapMode('navigation'));
              }}
            >
              Вернуться назад
            </Button>
          </Card.Footer>
        </Card>
      )}
    </>
  );
};

export default GeoDiagInterfaceSidebar;
