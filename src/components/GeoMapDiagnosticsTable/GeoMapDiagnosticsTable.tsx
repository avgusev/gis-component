import React, { FC, useEffect, useMemo, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select, { components, SingleValue } from 'react-select';
import './GeoMapDiagnosticsTable.scss';
import GeoMapDiagnosticsTableTypes from './GeoMapDiagnosticsTable.types';
import { flatnessColumns } from '../../Map/flatnessColumns.mock';
import { toast } from 'react-toastify';
import axios from 'axios';
import GeoSingleSelect from '../GeoForms/GeoSingleSelect/GeoSingleSelect';
import { diagnosticsTypesMock } from '../../Map/diagnosticsTypes.mock';
import { GeoIcon } from '../GeoIcon/GeoIcon';
import GeoLoader from '../GeoLoader/GeoLoader';
import { geoserverApiUrl } from '../../config/constants';

const GeoMapDiagnosticsTable: FC<GeoMapDiagnosticsTableTypes> = ({ isDiagnosticsModal, setIsDiagnosticsModal, selectedRoadId }) => {
  const [diagnosticTypes, setDiagnosticTypes] = useState<any>([]);
  const [selectedDiagnosticType, setSelectedDiagnosticType] = useState<any>(null);
  const [flatnessData, setFlatnessData] = useState<any>([]);
  const [isLoadingFlatness, setIsLoadingFlatness] = useState<boolean>(false);
  const [columns, setColumns] = useState<any>();
  const [count, setCount] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const getFlatnessData = async (id, diag_type) => {
    try {
      setIsLoadingFlatness(true);
      if (diag_type?.value === 'flatness') {
        const flatnessJson = await axios.get(
          `${geoserverApiUrl}/skdf_open/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=skdf_open:lyr_road_flatness_backward&outputFormat=json&CQL_FILTER=road_id=${id}&count=70`
        );
        if (flatnessJson?.data?.features && flatnessJson?.data?.features.length > 0) {
          const flatnessData = flatnessJson.data.features.map((item) => {
            const object: any = {};
            Object.keys(columns).forEach((col) => {
              object[columns[col]] = item.properties[col];
            });
            return object;
          });
          setFlatnessData(flatnessData);
        }
      } else {
        setFlatnessData([]);
      }
      setIsLoadingFlatness(false);
    } catch (error: any) {
      setIsLoadingFlatness(false);
      toast.error(
        `Ошибка при получении данных о ровности выбранной дороги! ${error?.response?.data?.message ? error.response.data.message : error}`
      );
    }
  };

  // const getCount = (id) => {
  //   axios
  //     .get(
  //       `${geoserverApiUrl}/skdf_open/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=skdf_open:lyr_road_flatness_backward&outputFormat=json&CQL_FILTER=road_id=${id}&resultType=hits`
  //     )
  //     .then((response) => {
  //       setCount(response.data);
  //     })
  //     .catch((error) => {
  //       toast.error(`Ошибка при получении числа записей! ${error}`);
  //     });
  // };

  // useEffect(() => {
  //   if (selectedRoadId) {
  //     getCount(selectedRoadId);
  //   }
  // }, [selectedRoadId]);

  useEffect(() => {
    setDiagnosticTypes(diagnosticsTypesMock);
    setColumns(flatnessColumns);
  }, []);

  return (
    <Modal
      centered
      scrollable
      dialogClassName="modal-80w"
      //size={'xl'}
      show={isDiagnosticsModal}
      onHide={() => {
        setIsDiagnosticsModal(false);
      }}
      //style={{ width: '600px' }}
      contentClassName="skdf-shadow-down-16dp"
    >
      <Modal.Header className="d-flex px-4 py-3">
        <Col>
          <span className="GeoFiltersFull__header__title mb-0 mt-0">Диагностика автомобильных дорог</span>
        </Col>
      </Modal.Header>
      <Modal.Body className="px-4 py-3" style={{ minHeight: '700px' }}>
        <Row style={{ margin: '20px' }}>
          <Col xs="7">
            <div style={{ fontSize: '20px', fontWeight: 600, paddingLeft: '0px' }}>{selectedDiagnosticType?.label}</div>
          </Col>
          <Col xs="5">
            <Select
              options={
                diagnosticTypes &&
                diagnosticTypes.map((item) => ({
                  value: item.code,
                  label: item.name,
                }))
              }
              placeholder="Выберите тип диагностики"
              isClearable
              classNamePrefix="skdf-select"
              className="skdf-select-container"
              maxMenuHeight={256}
              styles={{
                menu: (provided) => ({ ...provided, paddingTop: 0, zIndex: 9999 }),
              }}
              theme={(theme) => ({
                ...theme,
                borderRadius: 8,
                spacing: { ...theme.spacing, controlHeight: 40, menuGutter: 0 },
              })}
              value={selectedDiagnosticType}
              onChange={(e) => {
                setSelectedDiagnosticType(e);
                if (selectedRoadId) {
                  getFlatnessData(selectedRoadId, e);
                }
              }}
              components={{
                IndicatorSeparator: () => null,
                ClearIndicator: () => null,
                NoOptionsMessage: (props) => <components.NoOptionsMessage {...props} children="Не найдено" />,
                DropdownIndicator: ({ cx }) => (
                  <div className={cx({ indicator: true, 'dropdown-indicator': true })}>
                    <GeoIcon name="arrow_down" iconType="arrow_down" />
                  </div>
                ),
              }}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            {isLoadingFlatness ? (
              <div style={{ color: '#0D47A1', textAlign: 'center' }}>
                <GeoLoader />
                <div>Загрузка данных</div>
              </div>
            ) : columns && Object.keys(columns).length > 0 && flatnessData && flatnessData.length > 0 ? (
              <div className="table-responsive" style={{ overflow: 'auto', height: '570px' }}>
                <table className="table table-hover table-body-divided" style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#ffffff' }}>
                    <tr>
                      {Object.keys(columns).map((item) => {
                        return (
                          <th
                            scope="col"
                            className="text-end"
                            style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#ffffff' }}
                          >
                            {columns[item]}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {flatnessData.map((item) => {
                      return (
                        <tr>
                          {Object.keys(columns).map((col) => {
                            return <td className="text-end">{item?.[columns?.[col]]}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ color: '#cecece', marginTop: '20px', textAlign: 'center' }}>Нет данных</div>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="px-4 d-flex justify-content-start flex-nowrap">
        <Col xs={11}></Col>
        <Col xs={1}>
          <Button
            variant="skdf-ghost"
            className="w-100"
            onClick={() => {
              setIsDiagnosticsModal(false);
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
              <span className="mx-3">Закрыть</span>
            </div>
          </Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(GeoMapDiagnosticsTable);
