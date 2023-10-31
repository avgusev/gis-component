import React, { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../config/store';
import GeoIconButton from '../GeoIconButton';
import { GeoCreateMessageProps } from './GeoCreateMessage.types';
import { setMapMode } from '../../reducers/map.reducer';
import './GeoCreateMessage.scss';
import GeoCreateMessageForm from './GeoCreateMessageForm/GeoCreateMessageForm';

const GeoCreateMessage: FC<GeoCreateMessageProps> = ({ isOpen, setIsOpen, map }) => {
  const dispatch = useAppDispatch();
  const mapMode = useAppSelector((state) => state.mapstate.mapMode);
  return (
    <div className={`GeoCreateMessage__parent`}>
      {isOpen && <GeoCreateMessageForm map={map} setIsOpen={setIsOpen} />}
      <GeoIconButton
        iconType="message"
        tooltipName="Создать сообщение"
        tooltipPlacement="bottom"
        isDisabled={mapMode !== 'sendmessage' && mapMode !== 'navigation'}
        handleClick={() => {
          if (mapMode === 'sendmessage') {
            dispatch(setMapMode('navigation'));
          } else {
            dispatch(setMapMode('sendmessage'));
          }
          setIsOpen(!isOpen);
        }}
      />
    </div>
  );
};

export default GeoCreateMessage;
