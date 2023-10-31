import React from 'react';
import './GeoSearchInput.scss';

const GeoSearchInput = ({ placeholder }) => {
  return (
    <form>
      <input className="GeoSearch__input form-control form-control-sm" type="search" placeholder={placeholder} />
    </form>
  );
};

export default GeoSearchInput;
