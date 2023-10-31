import React from 'react';
import { Card } from 'react-bootstrap';

const GeoMapCardRoadWork5Y = ({ data }) => {
  return (
    <>
      <Card.Header className="GeoMapCardDetail__header">
        <div>
          <div className="GeoMapCardDetail__title">{data?.fields?.[0]?.value?.value}</div>
        </div>
      </Card.Header>
      <Card.Body className="GeoMapCardDetail__content">
        {data.fields.map((item, index) => {
          if (index >= 1 && item?.value?.value) {
            return (
              <div className="GeoMapCardDetail__item" key={item?.title + item?.value?.value}>
                <div className="GeoMapCardDetail__item__title">{item?.title}</div>
                <div style={{ whiteSpace: 'pre-line' }} className="GeoMapCardDetail__item__text">
                  {item?.value?.value}
                </div>
              </div>
            );
          }
        })}
      </Card.Body>
    </>
  );
};

export default GeoMapCardRoadWork5Y;
