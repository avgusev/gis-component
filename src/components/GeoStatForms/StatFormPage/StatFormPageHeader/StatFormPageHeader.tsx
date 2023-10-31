import React from 'react';
import { StatFormPageHeaderProps } from './StatFormPageHeader.types';
import { GeoGoBack } from '../../../GeoGoBack/GeoGoBack';
import StatFormActionsBar from '../StatFormActionsBar/StatFormActionsBar';
import StatFormNav from '../StatFormNav/StatFormNav';

const StatFormPageHeader = ({ title, status, deliveryTime, routerRest }: StatFormPageHeaderProps) => {
  return (
    <header className="mb-4">
      <div className="d-lg-flex align-items-start mb-1">
        <div className="mb-2 mb-lg-0 me-2 flex-grow-1">
          <h3>{title}</h3>
          <GeoGoBack
            href="#"
            text="К списку отчетов"
            handleClick={() => {
              routerRest.history.push({ pathname: `/statforms/${routerRest?.match?.params?.code}` });
            }}
          />
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

      <StatFormActionsBar status={status} deliveryTime={deliveryTime} />
      <StatFormNav routerRest={routerRest} />
    </header>
  );
};

export default StatFormPageHeader;
