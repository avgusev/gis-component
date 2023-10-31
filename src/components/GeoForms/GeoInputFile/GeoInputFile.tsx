import React, { useState } from 'react';
import GeoFilePrewier from '../../GeoFilePrewier/GeoFilePrewier';
import { GeoInputFileProps } from './GeoInputFile.types';
import GeoTextBtn from '../../GeoTextBtn/GeoTextBtn';
import './GeoInputFile.scss';

const GeoInputFile = (props: GeoInputFileProps) => {
  const { onChange, size = 'full_width', label, btnText = 'Добавить фото', setPrewier, prewier, ...otherProps } = props;
  return (
    <>
      {' '}
      {label?.length > 0 && <label className="form-label GeoInputFile__label">{label}</label>}
      {prewier?.length > 0 && (
        <div className="GeoCreateMessage__form__section__body__images-prewier">
          {prewier.map((item) => (
            <GeoFilePrewier
              key={item.url}
              filename={item.filename}
              url={item.url}
              onClose={(url) => {
                setPrewier(prewier.filter((i) => i.url !== url));
              }}
            />
          ))}
        </div>
      )}
      <label className="GeoInputFile">
        <input
          type="file"
          className={`form-control form-control-sm GeoInputFile--${size}`}
          onChange={(e) => {
            const newImgObj = {
              url: URL.createObjectURL(new Blob([e.currentTarget.files[0]], { type: 'application/png' })),
              filename: e.currentTarget.files[0].name,
            };
            setPrewier([...prewier, newImgObj]);
            onChange(e);
          }}
          {...otherProps}
          autoComplete="off"
        />
        <GeoTextBtn label={btnText} iconType="plus" />
      </label>
    </>
  );
};

export default GeoInputFile;
