import React, { useState } from 'react';
import GeoIconButton from '../../GeoIconButton';
import './GeoDiagInterfaceFooter.scss';

const GeoDiagInterfaceFooter = () => {
  const [isFooterOpen, setIsFooterOpen] = useState(true);
  return (
    <>
      <GeoIconButton
        iconType={isFooterOpen ? 'arrow-down' : 'arrow-up'}
        handleClick={() => {
          setIsFooterOpen(!isFooterOpen);
        }}
        classes={`GeoDiagInterfaceFooter__close__btn ${!isFooterOpen && 'GeoDiagInterfaceFooter__close__btn--close'}`}
      />{' '}
      {isFooterOpen && (
        <div className="GeoDiagInterfaceFooter__footer">
          <div className="GeoDiagInterfaceFooter__footer__first-item">Диаграма</div>
          <div className="GeoDiagInterfaceFooter__footer__second-item">Карта</div>
        </div>
      )}
    </>
  );
};

export default GeoDiagInterfaceFooter;
