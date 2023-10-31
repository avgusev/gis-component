import React from 'react';
import { Accordion, Button, Card } from 'react-bootstrap';
import './StatFormListFilterModal.scss';
import GeoInputField from '../../../GeoForms/GeoInputField/GeoInputField';
import StatFormListFilterRegion from './StatFormListFilterRegion';
import StatFormListFilterFKU from './StatFormListFilterFKU';
import { useAppDispatch, useAppSelector } from '../../../../config/store';
import { getRegions, setSelectedFilterYear } from '../../../../reducers/statForm.reducer';

const StatFormListModal = ({ setIsOpen }) => {
  const dispatch = useAppDispatch();
  const regionsFilterOptions = useAppSelector((state) => state.statForm.filterRegionOptions);
  const regionsFilterSelected = useAppSelector((state) => state.statForm.selectedFilterRegion);
  const yearFilterValue = useAppSelector((state) => state.statForm.selectedFilterYear);

  const handleYearChange = (event) => {
    dispatch(setSelectedFilterYear(event.currentTarget.value));
  };

  return (
    <Card className="skdf-shadow-down-16dp StatFormListModal__card">
      <Card.Body className="StatFormListModal__body">
        <Accordion
          defaultActiveKey="StatFormListFilter_year"
          alwaysOpen
          flush
          className="mt-0"
          onSelect={(e) => {
            if (e.length > 0) {
              if (e.includes('StatFormListFilter_region') && regionsFilterOptions.length === 0 && regionsFilterSelected.length === 0)
                dispatch(getRegions({ search: '', level: 1 }));
            }
          }}
        >
          <Accordion.Item eventKey="StatFormListFilter_region" className="mb-3">
            <Accordion.Header>
              <span className="h4 mb-0">Регион</span>
            </Accordion.Header>
            <Accordion.Body>
              <StatFormListFilterRegion />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="StatFormListFilter_fku" className="mb-3">
            <Accordion.Header>
              <span className="h4 mb-0">ФКУ</span>
            </Accordion.Header>
            <Accordion.Body>
              <StatFormListFilterFKU />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="StatFormListFilter_year" className="mb-3">
            <Accordion.Header>
              <span className="h4 mb-0">Год</span>
            </Accordion.Header>
            <Accordion.Body>
              <GeoInputField
                onChange={handleYearChange}
                value={yearFilterValue}
                className={`form-control`}
                name="year"
                label=""
                defaultValue={2023}
                type="number"
                min={1900}
                max={2200}
                placeholder="Год"
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>

      <Card.Footer className="StatFormListModal__footer px-4">
        <Button
          variant="skdf-stroke"
          className="d-inline-flex justify-content-center w-100 align-items-center mt-2 mb-3"
          onClick={() => {}}
        >
          Сбросить все фильтры
        </Button>
        <Button
          variant="skdf-primary"
          className="d-inline-flex justify-content-center w-100 align-items-center mx-4"
          type="submit"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          Показать
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default StatFormListModal;
