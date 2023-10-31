import React, { useState } from 'react';
import GeoIconButton from '../../../GeoIconButton';
import './StatFormListHeader.scss';
import { formsList } from '../../StatFormPage/forms.mock';
import StatFormListModal from '../StatFormListFilterModal/StatFormListFilterModal';
import { useAppSelector } from '../../../../config/store';

const StatFormListHeader = ({ deliveryTime, reportsNum }) => {
  const formCode: string = useAppSelector((state) => state.statForm.selectedFormCode);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  return (
    <header>
      <div className="d-lg-flex align-items-start mb-4">
        <h1 className="mb-2 mb-lg-0 flex-grow-1">{formsList?.[formCode]?.title}</h1>
        <div className="mb-2 mb-lg-0 me-2 flex-grow-1 d-flex justify-content-end">
          <input type="search" spellCheck="false" className="form-control w-75" placeholder="Поиск по наименованию" defaultValue="" />
        </div>
        <div className="me-2 StatFormListHeader__filter__container">
          <button
            type="button"
            className="btn-icon btn btn-skdf-primary"
            onClick={() => {
              setIsFiltersOpen((prev) => !prev);
            }}
          >
            <i className="icon _iconWrapper_uanyf_1">
              <svg width="24" height="24">
                <use xlinkHref="/src/components/SkdfIcon/skdf-icons.svg#filter"></use>
              </svg>
            </i>
            Фильтры
          </button>
          {isFiltersOpen ? <StatFormListModal setIsOpen={setIsFiltersOpen} /> : <></>}
        </div>
        <div className="d-none"></div>
        <button type="button" className="flex-shrink-0 btn-icon btn btn-skdf-stroke">
          <i className="icon _iconWrapper_uanyf_1">
            <svg width="24" height="24">
              <use xlinkHref="/src/components/SkdfIcon/skdf-icons.svg#question"></use>
            </svg>
          </i>
          Помощь
        </button>
      </div>
      <div className="StatFormListHeader-container d-sm-flex flex-wrap justify-content-between align-items-center gap-2 mt-4">
        <div className="d-sm-flex">
          <div className="d-flex align-items-center">
            <span className="StatFormListHeader--black-color">{reportsNum} отчетов</span>
          </div>
          <div className="me-4 ms-4 d-flex align-items-center">
            <GeoIconButton iconType={'clock'} isTransparent />
            <span className="StatFormListHeader--black-color">Срок сдачи: {deliveryTime}</span>
          </div>
        </div>

        <div className="d-sm-flex">
          <GeoIconButton
            classes="me-4"
            iconType={'report'}
            handleClick={() => {
              console.log('Формировать отчет');
            }}
            content="Формировать отчет"
            isTransparent
          />
          <GeoIconButton
            iconType={'history'}
            handleClick={() => {
              console.log('История формирования');
            }}
            content="История формирования"
            isTransparent
          />
        </div>
      </div>
    </header>
  );
};

export default StatFormListHeader;
