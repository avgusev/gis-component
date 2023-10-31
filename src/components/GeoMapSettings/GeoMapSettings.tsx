import React, { FC, useEffect, useState } from 'react';
import { Button, Modal, Accordion } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GeoSearchInput from '../GeoSearchInput/GeoSearchInput';
import GeoMapSettingsTypes from './GeoMapSettings.types';
import './GeoMapSettings.scss';
import '../GeoFilters/GeoFilters.scss';

const GeoMapSettings: FC<GeoMapSettingsTypes> = ({
  isMapSettingsOpen,
  setIsMapSettingsOpen,
  selectedMapSettings,
  setSelectedMapSettings,
}) => {
  const [currentSettings, setCurrentSettings] = useState<any>(null);

  useEffect(() => {
    setCurrentSettings(selectedMapSettings);
  }, []);

  return (
    <Modal
      centered
      size="sm"
      scrollable
      show={isMapSettingsOpen}
      onHide={() => {
        setIsMapSettingsOpen(false);
      }}
      //style={{ width: '600px' }}
      contentClassName="skdf-shadow-down-16dp"
    >
      <Modal.Header className="d-flex px-4 py-3">
        <Col>
          <span className="GeoFiltersFull__header__title mb-0 mt-0">Настройки карты</span>
        </Col>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        {' '}
        <Row>
          <Col>
            <Row className="my-0 mb-3">
              <Col className="pe-0">
                <div className="GeoFilters__group__title">Идентификация</div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs="2">
                <input
                  //id={randomId}
                  id="hover_idetify_switcher"
                  key="hover_idetify_switcher"
                  className="GeoCheckboxGroup__input form-check-input cursorLayers"
                  type="checkbox"
                  checked={
                    selectedMapSettings && Object.keys(selectedMapSettings).length > 0
                      ? selectedMapSettings?.isHoverControl?.checked
                      : false
                  }
                  onChange={(e) => {
                    const settings = { ...selectedMapSettings };
                    settings.isHoverControl = { checked: e.target.checked, name: 'isHoverControl' };
                    setSelectedMapSettings(settings);
                  }}
                />
              </Col>
              <Col xs="10">
                <label htmlFor="hover_idetify_switcher" className="form-check-label cursorLayers">
                  Предпросмотр информации по дороге при наведении курсора мыши
                </label>
              </Col>
            </Row>
            <Row className="my-0 mb-3">
              <Col className="pe-0">
                <div className="GeoFilters__group__title">Настройки отображения системных слоев</div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs="2">
                <input
                  //id={randomId}
                  id="wfs_switcher"
                  key="wfs_switcher"
                  className="GeoCheckboxGroup__input form-check-input cursorLayers"
                  type="checkbox"
                  checked={
                    selectedMapSettings && Object.keys(selectedMapSettings).length > 0 ? selectedMapSettings?.isWFSLayers?.checked : false
                  }
                  onChange={(e) => {
                    const settings = { ...selectedMapSettings };
                    settings.isWFSLayers = { checked: e.target.checked, name: 'isWFSLayers' };
                    setSelectedMapSettings(settings);
                  }}
                />
              </Col>
              <Col xs="10">
                <label htmlFor="wfs_switcher" className="form-check-label cursorLayers">
                  Слои с вектором дорог WFS
                </label>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs="2">
                <input
                  //id={randomId}
                  id="wfs_bridge_switcher"
                  key="wfs_bridge_switcher"
                  className="GeoCheckboxGroup__input form-check-input cursorLayers"
                  type="checkbox"
                  checked={
                    selectedMapSettings && Object.keys(selectedMapSettings).length > 0
                      ? selectedMapSettings?.isWFSBridgeLayer?.checked
                      : false
                  }
                  onChange={(e) => {
                    const settings = { ...selectedMapSettings };
                    settings.isWFSBridgeLayer = { checked: e.target.checked, name: 'isWFSBridgeLayer' };
                    setSelectedMapSettings(settings);
                  }}
                />
              </Col>
              <Col xs="10">
                <label htmlFor="wfs_bridge_switcher" className="form-check-label cursorLayers">
                  Слои с вектором мостовых сооружений WFS
                </label>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs="2">
                <input
                  //id={randomId}
                  id="anno_switcher"
                  key="anno_switcher"
                  className="GeoCheckboxGroup__input form-check-input cursorLayers"
                  type="checkbox"
                  checked={
                    selectedMapSettings && Object.keys(selectedMapSettings).length > 0 ? selectedMapSettings?.isAnnoLayers?.checked : false
                  }
                  onChange={(e) => {
                    const settings = { ...selectedMapSettings };
                    settings.isAnnoLayers = { checked: e.target.checked, name: 'isAnnoLayers' };
                    setSelectedMapSettings(settings);
                  }}
                />
              </Col>
              <Col xs="10">
                <label htmlFor="anno_switcher" className="form-check-label cursorLayers">
                  Слои с векторными подписями WFS
                </label>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="px-4 d-flex justify-content-start flex-nowrap">
        <Col xs={6}>
          <Button
            variant="skdf-primary"
            className="w-100"
            onClick={() => {
              setIsMapSettingsOpen(false);
            }}
          >
            Применить
          </Button>
        </Col>
        <Col xs={6}>
          <Button
            variant="skdf-ghost"
            className="w-100"
            onClick={() => {
              setIsMapSettingsOpen(false);
              setSelectedMapSettings(currentSettings);
            }}
          >
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
              <span className="mx-3">Отмена</span>
            </div>
          </Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
};

export default GeoMapSettings;
