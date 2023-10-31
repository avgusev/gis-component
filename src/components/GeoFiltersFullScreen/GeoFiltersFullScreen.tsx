import React from 'react';
import { nanoid } from 'nanoid';
import { Button, Modal, Accordion } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GeoSearchInput from '../GeoSearchInput/GeoSearchInput';
import './GeoFiltersFullScreen.scss';
import '../GeoFilters/GeoFilters.scss';

const GeoFiltersFullScreen = ({ setIsOpen, isOpen }) => {
  const close = () => setIsOpen(false);
  return (
    <Modal centered scrollable show={isOpen} onHide={close} dialogClassName="modal-80w" contentClassName="skdf-shadow-down-16dp">
      <Modal.Header className="d-flex px-4 py-3">
        <Col xs={4}>
          <span className="GeoFiltersFull__header__title mb-0 mt-0">Все фильтры</span>
        </Col>
        <Col xs={8}>
          {' '}
          <GeoSearchInput placeholder="Поиск по характеристикам, параметрам или выборке" />
        </Col>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        {' '}
        <Row>
          <Col xs={4}>
            <Row className="my-0">
              <div className="GeoFilters__group__title">Субъекты</div>
            </Row>
            <Row className="my-0">
              <Accordion defaultActiveKey="0" alwaysOpen={false} flush>
                <Accordion.Item eventKey="0" className="my-3">
                  <Accordion.Header>
                    <div className="d-flex justify-content-between w-100">
                      <span className="GeoFilters__group__accordion__header mb-0">Регион</span>
                      <span className="badge badge-pill bg-danger border border-2 border-white">1</span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <GeoSearchInput placeholder="Поиск по регионам" />{' '}
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Алтайский край
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Амурская область
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Архангельская область
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        г. Санкт-Петербург
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Липецкая область
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Пензенская область
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Пермский край
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="1" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Агломерация</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Район</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Город</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Населённый пункт</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0 mt-2">
              <div className="GeoFilters__group__title">Правовая информация</div>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="my-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Владелец</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Эксплуатирующая организация</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Документ-основание</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Значение</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Статус проверки</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0 mt-2">
              <div className="GeoFilters__group__title">Дополнителельно</div>
              <div className=" mx-3 form-check my-3">
                <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                  Доступно на карте
                </label>
              </div>
              <div className=" mx-3 form-check ">
                <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                  Входит в опорную сеть
                </label>
              </div>
            </Row>
          </Col>
          <Col xs={4}>
            <Row className="my-0">
              <div className="GeoFilters__group__title">Технические характеристики</div>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush>
                <Accordion.Item eventKey="0" className="my-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Класс</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Выбрать все
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Автомагистраль
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Обычная (нескоростная) автомобильная дорога
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Скоростная автомобильная дорога
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Категория</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <div className="d-flex justify-content-between w-100">
                      <span className="GeoFilters__group__accordion__header mb-0">Вид покрытия</span>
                      <span className="badge badge-pill bg-danger border border-2 border-white">3</span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Число полос движения</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Максимальная скорость движения</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Дорожно-климатическая зона</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Нагрузка на ось</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Пропускная способность</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Ширина проезжей части</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Ширина земельного полотна</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <div className="GeoFilters__group__title">Безопасность</div>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="my-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Статус аварийно-опасного участка</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion defaultActiveKey="2" alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Вид ДТП</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        ДТП с погибшими
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        ДТП с пострадавшими
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
          </Col>
          <Col xs={4}>
            <Row className="my-0">
              <div className="GeoFilters__group__title GeoFiltersFull__body__title__white">123</div>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="my-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Проект</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Заказчик</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Подрядчик</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Источник финансирования</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Вид работ</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion defaultActiveKey="2" alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <div className="d-flex justify-content-between w-100">
                      <span className="GeoFilters__group__accordion__header mb-0">Статус</span>
                      <span className="badge badge-pill bg-danger border border-2 border-white">1</span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        КЖЦ
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        С применением новых технологий и материалов
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <div className="GeoFilters__group__title">Нормативное состояние</div>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="my-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Вид проведения диагностики</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Статус проведения диагностики</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Соответствие нормативному состоянию</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <div className="GeoFilters__group__title">Состояния граждан</div>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="my-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Тип</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="my-0">
              <Accordion alwaysOpen={false} flush className="mt-0">
                <Accordion.Item eventKey="2" className="mb-3">
                  <Accordion.Header>
                    <span className="GeoFilters__group__accordion__header mb-0">Статус</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-check mb-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                    <div className="form-check my-3">
                      <input id={nanoid()} className="GeoFilters__group__accordion__body__checkbox form-check-input" type="checkbox" />{' '}
                      <label htmlFor={nanoid()} className="GeoFilters__group__accordion__body__label">
                        Label
                      </label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="px-4 d-flex justify-content-start flex-nowrap">
        <Col xs={4}>
          <Button variant="skdf-primary" className="w-100" onClick={close}>
            Показать 723 545 дорог
          </Button>
        </Col>
        <Col xs={4}>
          <Button variant="skdf-stroke" className="w-100">
            Сохранить фильтрацию
          </Button>{' '}
        </Col>
        <Col xs={4}>
          <Button variant="skdf-ghost" className="w-100">
            <div className="d-flex">
              <i>
                <svg width={24} fill="none" height={24}>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L5.29287 17.2929C4.90234 17.6834 4.90234 18.3166 5.29287 18.7071C5.68339 19.0976 6.31655 19.0976 6.70708 18.7071L18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289Z"
                    fill="currentColor"
                  />
                </svg>
              </i>
              <span className="mx-3">Сбросить все фильтры</span>
            </div>
          </Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
};

export default GeoFiltersFullScreen;
