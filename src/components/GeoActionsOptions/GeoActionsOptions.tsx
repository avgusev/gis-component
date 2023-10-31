import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { GeoIcon } from '../GeoIcon/GeoIcon';
import './GeoActionsOptions.scss';

const GeoActionsOptions = () => {
  return (
    // <div className="GeoActionsOptions__card">
    //   <div className="GeoActionsOptions__card__item">
    //     <GeoIcon name="search" iconType="search" onClick={() => console.log('Поиск участка дороги')} />
    //     <span className="GeoActionsOptions__card__item__title">Поиск участка дороги</span>
    //   </div>
    //   <div className="GeoActionsOptions__card__item">
    //     <GeoIcon name="edit" iconType="edit" onClick={() => console.log('Редактировать')} />
    //     <span className="GeoActionsOptions__card__item__title">Редактировать</span>
    //   </div>
    //   <div className="GeoActionsOptions__card__item">
    //     {/* <a href={`roads/${id_road}/relations`}> */}
    //     <GeoIcon name="network" iconType="network" />
    //     {/* </a> */}
    //     <span className="GeoActionsOptions__card__item__title">Связи</span>
    //   </div>
    //   <hr />
    //   <div className="GeoActionsOptions__card__item">
    //     <GeoIcon name="plus" iconType="plus" onClick={() => console.log('Галерея')} />
    //     <span className="GeoActionsOptions__card__item__title">Добавить участок</span>
    //   </div>
    //   <div className="GeoActionsOptions__card__item">
    //     <GeoIcon name="plus" iconType="plus" onClick={() => console.log('Галерея')} />
    //     <span className="GeoActionsOptions__card__item__title">Добавить мероприятие</span>
    //   </div>
    //   <hr />
    //   <div className="GeoActionsOptions__card__item">
    //     <GeoIcon name="gallery" iconType="gallery" onClick={() => console.log('Галерея')} />
    //     <span className="GeoActionsOptions__card__item__title">Фотографии работ</span>
    //   </div>
    //   <div className="GeoActionsOptions__card__item">
    //     <GeoIcon name="tool" iconType="tool" onClick={() => console.log('Галерея')} />
    //     <span className="GeoActionsOptions__card__item__title">Данные диагностики</span>
    //   </div>
    //   <hr />
    //   <div className="GeoActionsOptions__card__item">
    //     <GeoIcon name="download" iconType="download" onClick={() => console.log('Галерея')} />
    //     <span className="GeoActionsOptions__card__item__title"> Скачать данные о ровности</span>
    //   </div>
    //   <div className="GeoActionsOptions__card__item">
    //     <GeoIcon name="route_3" iconType="route_3" onClick={() => console.log('Галерея')} />
    //     <span className="GeoActionsOptions__card__item__title"> Скачать геометрию дороги</span>
    //   </div>
    // </div>
    <Dropdown.Menu>
      <Dropdown.Item as="button">
        <GeoIcon name="search" iconType="search" onClick={() => console.log('Поиск участка дороги')} />
        Поиск участка дороги
      </Dropdown.Item>
      <Dropdown.Item as="button">
        <GeoIcon name="edit" iconType="edit" onClick={() => console.log('Редактировать')} />
        Редактировать
      </Dropdown.Item>
      <Dropdown.Item as="button">
        <GeoIcon name="network" iconType="network" />
        Связи
      </Dropdown.Item>
      <hr className="dropdown-divider mx-3" />
      <Dropdown.Item as="button">
        <GeoIcon name="plus" iconType="plus" onClick={() => console.log('Добавить участок')} />
        Добавить участок
      </Dropdown.Item>
      <Dropdown.Item as="button">
        <GeoIcon name="plus" iconType="plus" onClick={() => console.log('Добавить мероприятие')} />
        Добавить мероприятие
      </Dropdown.Item>
      <hr className="dropdown-divider mx-3" />
      <Dropdown.Item as="button">
        <GeoIcon name="gallery" iconType="gallery" onClick={() => console.log('Галерея')} />
        Фотографии работ
      </Dropdown.Item>
      <Dropdown.Item as="button">
        <GeoIcon name="tool" iconType="tool" onClick={() => console.log('Данные диагностики')} />
        Данные диагностики
      </Dropdown.Item>
      <hr className="dropdown-divider mx-3" />
      <Dropdown.Item as="button">
        <GeoIcon name="download" iconType="download" onClick={() => console.log('Скачать данные о ровности')} />
        Скачать данные о ровности
      </Dropdown.Item>
      <Dropdown.Item as="button">
        <GeoIcon name="route_3" iconType="route_3" onClick={() => console.log('Скачать геометрию дороги<')} />
        Скачать геометрию дороги
      </Dropdown.Item>
    </Dropdown.Menu>
  );
};

export default GeoActionsOptions;
