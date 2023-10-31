import React from "react";
import './GeoSearchAreas.scss';
import { useAppDispatch, useAppSelector } from "../../../config/store";
import { Button, Form, InputGroup } from "react-bootstrap";
import { addOrRemoveCity, getAries, resetAries } from "../../../reducers/subject.reducer";

const GeoSearchAreas = () => {

  const dispatch = useAppDispatch();
  const areas = useAppSelector((state) => state.subject.aries);

  return (
    <div>
      <InputGroup>
        <Form.Control
          className="GeoSearch__input form-control form-control-sm"
          onChange={(e) => {
            if (e.target.value.length >= 3) {
              dispatch(getAries({search: e.target.value}));
            }
          }}
        />
        <Button id="button-subject-reset" onClick={() =>
        {dispatch(resetAries());}}>X</Button>
      </InputGroup>
      {areas.map((item) => {
        return (
          <div className="form-check my-3">
            <input id={item.dimmember_gid} onClick={() => dispatch(addOrRemoveCity(item))} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
            <label htmlFor={item.dimmember_gid} className="GeoFilters__group__accordion__body__label">
              {item.name}
            </label>
          </div>)
      })}
    </div>
  );
};

export default GeoSearchAreas;
