import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Modal } from 'react-bootstrap';
import { commandSchemaHeader, pgApiUrl } from '../../config/constants';
import { GeoDiagnosticControlModalProps } from './GeoDiagnosticControlModal.types';
import GeoSingleSelect from '../GeoForms/GeoSingleSelect/GeoSingleSelect';
import { ISelectType } from '../../global.types';
import GeoTabs from '../GeoTabs/GeoTabs';
import './GeoDiagnosticControlModal.scss';
import DiagDetailsForm from './DiagDetailsForm/DiagDetailsForm';
import PanoramaTable from './PanoramaTable/PanoramaTable';
import LidarTable from './LidarTable/LidarTable';
import GeoIcon from '../GeoIcon';
import GeoLoader from '../GeoLoader/GeoLoader';

const GeoDiagnosticControlModal = ({ isOpen, setIsOpen, idRoad, idPart }: GeoDiagnosticControlModalProps) => {
  const close = () => setIsOpen(false);
  const [diagPassportsValue, setDiagPassportsValue] = useState(null);
  const [optionsDiagPassports, setOptionsDiagPassports] = useState<ISelectType[]>([]);
  const [activeTab, setActiveTab] = useState<'lidar' | 'panorama' | 'diag_details'>('diag_details');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(true);
  const [isCreateNewPas, setIsCreateNewPas] = useState<boolean>(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'lidar':
        return <LidarTable idRoad={idRoad} idPart={idPart} />;

      case 'panorama':
        return <PanoramaTable idRoad={idRoad} idPart={idPart} />;

      case 'diag_details':
        return <DiagDetailsForm createMode={isCreateMode} setIsCreateMode={setIsCreateMode} idRoad={idRoad} />;

      default:
        return <></>;
    }
  };
  const getDiagPassports = () => {
    const preparedData = { data: { road_id: idRoad, part_id: idPart } };
    axios
      .post(`${pgApiUrl}/rpc/get_diag_passport`, preparedData, commandSchemaHeader)
      .then((response) => {
        const options = [];
        response.data.map((item) => options.push({ value: item.id, label: item.doc_name, data: item }));
        setOptionsDiagPassports(options);
        setIsCreateNewPas(false);
      })
      .catch((error) => {
        console.error(`Ошибка получении данных getDiagPassports: ${error}`);
        setIsCreateNewPas(false);
      });
  };

  useEffect(() => {
    getDiagPassports();
  }, []);

  useEffect(() => {
    if (isCreateNewPas) {
      getDiagPassports();
    }
  }, [isCreateNewPas]);

  return (
    <Modal
      centered
      scrollable
      show={isOpen}
      onHide={close}
      dialogClassName="mx-4 justify-content-center modal-100w"
      contentClassName="w-auto skdf-shadow-down-16dp"
    >
      <Modal.Header className="px-4 pb-3 flex-column align-items-stretch">
        <div className="d-flex justify-content-between align-items-center mt-2 gap-3">
          <h1 className="mb-0">Управление диагностикой</h1>
          <div className="GeoDiagnosticControlModal__header__close-btn">
            <GeoIcon name="close" iconType="close" onClick={close} />
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="GeoDiagnosticControlModal_modal px-4 py-0 pb-5">
        <div className="d-flex align-items-end justify-content-between">
          <Col style={{ zIndex: 2 }} xs={activeTab === 'diag_details' ? 11 : 12}>
            {' '}
            <GeoSingleSelect
              name="diag_passport"
              label="Паспорт диагностики"
              placeholder="Паспорт диагностики"
              value={diagPassportsValue}
              onChange={(e) => {
                setIsLoading(true);
                setDiagPassportsValue(e);
                setIsCreateMode(false);
                setTimeout(() => {
                  setIsLoading(false);
                }, 300);
              }}
              options={optionsDiagPassports}
              size="full_width"
            />
          </Col>
          {activeTab === 'diag_details' && (
            <Col xs={1} className="GeoDiagnosticControlModal__createMode__btn">
              <GeoIcon
                name="plus"
                iconType="plus"
                onClick={() => {
                  setIsLoading(true);
                  setIsCreateMode(true);
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 300);
                }}
              />
            </Col>
          )}
        </div>

        <div className="GeoDiagnosticControlModal__tabs">
          <GeoTabs setActiveTab={setActiveTab} activeTab={activeTab} />
        </div>
        {isLoading ? (
          <div style={{ color: '#0D47A1', textAlign: 'center', marginTop: '10px' }}>
            <GeoLoader />
          </div>
        ) : (
          renderTab()
        )}
      </Modal.Body>
    </Modal>
  );
};

export default GeoDiagnosticControlModal;
