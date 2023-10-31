import React, { FC } from 'react';
import { Button } from 'react-bootstrap';
import './GeoIconButton.scss';
import { GeoIcon } from '../GeoIcon/GeoIcon';
import GeoIconButtonTypes from './GeoIconButton.types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const GeoIconButton: FC<GeoIconButtonTypes> = ({
  content,
  iconType,
  handleClick,
  badgeCount,
  isTransparent = false,
  classes,
  isActive,
  isDisabled = false,
  tooltipName = '',
  tooltipId = 'tooltip-id',
  tooltipPlacement = 'bottom',
}) => {
  const geoIconButtonClasses = `${classes} ${
    isTransparent ? 'geoIconButton--transparent' : 'geoIconButton'
  } d-inline-flex justify-content-center align-items-center`;
  return tooltipName.length > 0 ? (
    <OverlayTrigger
      placement={tooltipPlacement}
      delay={{ show: 100, hide: 100 }}
      overlay={(props) => (
        <Tooltip id={tooltipId} {...props}>
          {tooltipName}
        </Tooltip>
      )}
    >
      <Button
        variant="light"
        disabled={isDisabled}
        className={`${isDisabled ? `geoIconButton--disabled ` : ''}${
          isActive ? `${geoIconButtonClasses} geoIconButtonActive` : geoIconButtonClasses
        }`}
        onClick={handleClick}
      >
        <GeoIcon name={iconType} iconType={iconType} />
        {content ? <span className="geoIconButton__content">{content}</span> : <></>}
        {badgeCount && badgeCount !== 0 ? (
          <div className="px-2">
            <span
              className="badge badge-pill bg-danger border border-2 border-white"
              style={{
                minWidth: '1.5rem',
                padding: '0.28125rem 0.1875rem',
              }}
            >
              {badgeCount}
            </span>
          </div>
        ) : (
          ''
        )}
      </Button>
    </OverlayTrigger>
  ) : (
    <Button
      variant="light"
      disabled={isDisabled}
      className={isActive ? `${geoIconButtonClasses} geoIconButtonActive` : geoIconButtonClasses}
      onClick={handleClick}
    >
      <GeoIcon name={iconType} iconType={iconType} />
      {content ? <span className="geoIconButton__content">{content}</span> : <></>}
      {badgeCount && badgeCount !== 0 ? (
        <div className="px-2">
          <span
            className="badge badge-pill bg-danger border border-2 border-white"
            style={{
              minWidth: '1.5rem',
              padding: '0.28125rem 0.1875rem',
            }}
          >
            {badgeCount}
          </span>
        </div>
      ) : (
        ''
      )}
    </Button>
  );
};

export default GeoIconButton;
