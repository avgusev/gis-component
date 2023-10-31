import React from 'react';
import GeoIconButton from '../../../GeoIconButton';
import { StatFormActionsBarProps } from './StatFormActionsBar.types';
import GeoStatus from '../../../GeoStatus/GeoStatus';
import './StatFormActionsBar.scss';

const StatFormActionsBar = ({ status, deliveryTime }: StatFormActionsBarProps) => {
  return (
    <div className="StatFormActionsBar-container d-sm-flex flex-wrap align-items-center gap-2 mt-4">
      <div className="d-sm-flex me-auto">
        <GeoStatus text="Проект" />
        <div className="me-4 ms-4 d-flex align-items-center">
          <GeoIconButton iconType={'clock'} isTransparent />
          <span className="StatFormActionsBar--black-color">Срок сдачи: {deliveryTime}</span>
        </div>

        <GeoIconButton
          classes="me-4"
          iconType={'edit'}
          handleClick={() => {
            console.log('Редактировать');
          }}
          content="Редактировать"
          isTransparent
        />
        <GeoIconButton
          classes="me-4"
          iconType={'pending_document'}
          handleClick={() => {
            console.log('Отправить на проверку');
          }}
          content="Отправить на проверку"
          isTransparent
        />
        <GeoIconButton
          iconType={'flash'}
          handleClick={() => {
            console.log('Подписать ЭЦП');
          }}
          content="Подписать ЭЦП"
          isTransparent
        />
      </div>
      <div className="d-sm-flex">
        <GeoIconButton
          classes="me-4"
          iconType={'upload'}
          handleClick={() => {
            console.log('Импорт');
          }}
          content="Импорт"
          isTransparent
        />
        <GeoIconButton
          iconType={'download_2'}
          handleClick={() => {
            console.log('Экспорт');
          }}
          content="Экспорт"
          isTransparent
        />
      </div>
    </div>
  );
};

export default StatFormActionsBar;
