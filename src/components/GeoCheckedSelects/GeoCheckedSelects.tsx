import React from 'react';
import { Form } from 'react-bootstrap';
import { GeoIcon } from '../GeoIcon/GeoIcon';
import { IFilterSelectType } from '../../global.types';
import { GeoCheckedSelectsTypes } from './GeoCheckedSelects.types';
import './GeoCheckedSelects.scss';
import GeoIconButton from '../GeoIconButton';

const GeoCheckSelect = (props: GeoCheckedSelectsTypes) => {
  const {
    options,
    value = [],
    filterValue,
    search,
    placeholder,
    maxHeight = '16.75rem',
    disabled,
    inputWrapperClassName = 'mb-3',
    optionsWrapperClassName = 'mb-3 border-bottom',
    getCoordinates,
    onChangeCheck,
    onChangeInput,
    getOptionValue,
    getOptionLabel,
    optionIsDisabled,
  } = props;

  return (
    <Form>
      {search && (
        <div className={inputWrapperClassName}>
          <Form.Control
            type="search"
            size="sm"
            value={filterValue}
            placeholder={placeholder}
            onChange={(e) => onChangeInput(e.target.value)}
            disabled={disabled}
          />
        </div>
      )}
      <div className={optionsWrapperClassName}>
        {options && options.length > 0 ? (
          <div className="overflow-auto pb-2.5" style={{ maxHeight: maxHeight }}>
            {options.map((item: IFilterSelectType, index) => {
              return (
                // <div className="geo-form-checked my-3 d-flex justify-content-between pl-0">
                <div key={`${item.id}`} className="geo-form-checked d-flex justify-content-between">
                  <Form.Check
                    id={'checkSelect-' + getOptionValue(item)}
                    label={getOptionLabel(item)}
                    className="mb-2.5 ps-2r"
                    checked={value && value.length > 0 && value.map((el: any) => el.id).includes(item.id)}
                    disabled={disabled || (optionIsDisabled && optionIsDisabled(item))}
                    onChange={(e) => onChangeCheck(item, e)}
                  />
                  {getCoordinates ? (
                    <div className="checked-select-search">
                      <GeoIconButton
                        iconType="map"
                        isTransparent
                        tooltipName={'Найти на карте'}
                        tooltipId={`tooltip__${item.id}`}
                        tooltipPlacement={'bottom'}
                        handleClick={() => {
                          getCoordinates(item.id);
                        }}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <span className="d-block pb-4 text-muted">Не найдено</span>
        )}
      </div>
    </Form>
  );
};

export default GeoCheckSelect;
