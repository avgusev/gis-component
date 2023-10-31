import React from 'react';
import GeoIcon from '../GeoIcon';
import { GeoFilePrewierProps } from './GeoFilePrewier.types';
import './GeoFilePrewier.scss';

const GeoFilePrewier = (props: GeoFilePrewierProps) => {
  const { filename, url, onClose } = props;
  return (
    <div className="GeoFilePrewier__container">
      <img className="GeoFilePrewier__img" src={url} />
      <span className="GeoFilePrewier__text">{filename}</span>
      <GeoIcon iconType="close" name="close" onClick={() => onClose(url)} />
    </div>
  );
};

export default GeoFilePrewier;
