import React, { useState, useEffect, useContext } from 'react';
import { diagSchemaHeaders, pgApiUrl } from '../../../config/constants';
import axios from 'axios';
import GeoIconButton from '../../GeoIconButton';
import './GeoDiagInterfaceHeader.scss';
import Select, { components } from 'react-select';
import { Col, Container, Row } from 'react-bootstrap';
import GeoIcon from '../../GeoIcon';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { getPassOptions, selectPass } from '../../../reducers/roadPass.reducer';
import { UserAccessLevelContext } from '../userAccessLevelContext';

const GeoDiagInterfaceHeader = ({
  roadId,
  selectedType,
  isCreateMode,
  roadName,
  isHeaderOpen,
  setIsHeaderOpen,
  addClass,
  setIsCreateMode,
}) => {
  const dispatch = useAppDispatch();
  const options = useAppSelector((state) => state.roadPass.options);
  const loading: boolean = useAppSelector((state) => state.roadPass.loading);
  const selected = useAppSelector((state) => state.roadPass.selected);
  const userAccessLevel = useContext(UserAccessLevelContext);

  useEffect(() => {
    if (isCreateMode) {
      dispatch(selectPass(null));
    }
  }, [isCreateMode]);

  useEffect(() => {
    if (roadId) {
      dispatch(getPassOptions({ road_id: roadId }));
    }
  }, [roadId]);

  return (
    <>
      {' '}
      <GeoIconButton
        iconType={isHeaderOpen ? 'arrow-up' : 'arrow-down'}
        handleClick={() => {
          setIsHeaderOpen(!isHeaderOpen);
        }}
        classes={`GeoDiagInterfaceHeader__close__btn ${!isHeaderOpen && 'GeoDiagInterfaceHeader__close__btn--close'}`}
      />
      {isHeaderOpen && (
        <div className={`GeoDiagInterface__header ${addClass}`}>
          <Container fluid className="GeoDiagInterface__header__pass-selector">
            <Row>
              <div className="GeoDiagInterface__header__item GeoDiagInterface__header__title">{`Дорога: ${roadName}`}</div>
            </Row>
            <Row className="mt-2 mb-3">
              {selectedType?.code === 'roadPass' && userAccessLevel && userAccessLevel === 2 && (
                <Col xs="1" className="py-2 GeoDiagInterfaceHeader__plus__btn">
                  <GeoIconButton
                    iconType="plus"
                    tooltipName={'Создать паспорт'}
                    tooltipPlacement={'bottom'}
                    tooltipId={'new_pass_id'}
                    isTransparent
                    handleClick={() => {
                      setIsCreateMode(true);
                    }}
                    classes=""
                  />
                </Col>
              )}
              <Col xs="1" className="py-2">
                <div className="GeoDiagInterface__header__item">Паспорт</div>
              </Col>
              <Col xs={selectedType?.code === 'roadPass' ? 8 : 9}>
                {/* <label htmlFor="hover_idetify_switcher" className="form-check-label cursorLayers">
                 Выбор паспорта
                </label> */}
                <Select
                  options={
                    options && options.length > 0
                      ? options.map((item) => ({
                          ...item,
                          value: item.id,
                          label: item.doc_name,
                        }))
                      : []
                  }
                  isLoading={loading}
                  placeholder="Выберите паспорт"
                  isClearable
                  classNamePrefix="skdf-select"
                  className="skdf-select-container"
                  menuPortalTarget={document.body}
                  menuShouldScrollIntoView={true}
                  menuPosition="absolute"
                  isDisabled={selectedType?.code !== 'roadPass'}
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
                    selected
                      ? {
                          ...selected,
                          value: selected.id,
                          label: selected.doc_name,
                        }
                      : null
                  }
                  onChange={(e) => {
                    dispatch(selectPass(e));
                    setIsCreateMode(false);
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
              <Col xs="2" className="py-2">
                Год: {selected?.doc_year}
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default GeoDiagInterfaceHeader;
