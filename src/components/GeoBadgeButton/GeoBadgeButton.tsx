import React from 'react';
import { Button } from 'react-bootstrap';
import { GeoBadgeButtonTypes } from './GeoBadgeButton.types';

const GeoBadgeButton = ({ content, classes, handlerClick }: GeoBadgeButtonTypes) => {
  const show = () => handlerClick(true);
  return (
    <Button variant="skdf-primary" onClick={show} className={`${classes} d-inline-flex justify-content-center align-items-center gap-2`}>
      {content}
      <span className="badge badge-pill bg-danger border border-2 border-white">9</span>
    </Button>
  );
};

export default GeoBadgeButton;
