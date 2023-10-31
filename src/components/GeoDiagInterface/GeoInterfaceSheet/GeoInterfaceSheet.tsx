import React, { useEffect, useState, useContext } from 'react';
import { GeoInterfaceSheetTypes } from './GeoInterfaceSheet.types';
import './GeoInterfaceSheet.scss';
import { Button, Col, Container, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import GeoIcon from '../../GeoIcon';
import axios from 'axios';
import { commandSchemaHeader, pgApiUrl } from '../../../config/constants';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import GeoInterfaceSheetCreateModal from './GeoInterfaceSheetCreateModal';
import GeoLoader from '../../GeoLoader/GeoLoader';
import GeoDiagSheetUpload from '../GeoDiagSheetUpload/GeoDiagSheetUpload';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import { setTableRowsPass } from '../../../reducers/roadPass.reducer';
import GeoIconButton from '../../GeoIconButton';
import { UserAccessLevelContext } from '../userAccessLevelContext';

const GeoInterfaceSheet = ({ selectedType, selectedSheet, setSelectedSheet, isRefresh, setIsRefresh }: GeoInterfaceSheetTypes) => {
  const [sheets, setSheets] = useState<any>([]);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
  const [isLoadingSheets, setIsLoadingSheets] = useState<boolean>(false);
  const [isOpenSheetUpload, setIsOpenSheetUpload] = useState<boolean>(false);
  const [isConfirmDeleteModal, setIsConfirmDeleteModal] = useState<boolean>(false);
  const [selectedDeleteSheet, setSelectedDeleteSheet] = useState<any>(null);
  const [isExportingDiag, setIsExportingDiag] = useState<boolean>(null);
  const [sheetNodes, setSheetNodes] = useState<React.ReactNode[]>(null);
  const userAccessLevel = useContext(UserAccessLevelContext);
  const userId = useAppSelector((state: any) => state.user.userAuthData.profile.userId);

  const selectedPassport = useAppSelector((state) => state.roadPass.selected);
  const dispatch = useAppDispatch();

  const checkDiagData = async (sheetId) => {
    const data = {
      data: {
        diag_sheet: sheetId,
        page_size: 10,
        page_num: 1,
        lanes_enum: 0,
      },
    };
    const response = await axios.post(`${pgApiUrl}/rpc/get_diag_sheet_data`, data, commandSchemaHeader);
    if (response?.data?.data) {
      dispatch(setTableRowsPass(10000));
      exportDiag();
    } else {
      toast.warning(`Отсутствуют данные для выгрузки!`);
    }
  };

  const cols = [
    { name: 'km_start', title: 'Начало участка, км' },
    { name: 'km_finish', title: 'Конец участка, км' },
    { name: 'name', title: 'Наименование участка' },
    { name: 'diag_date', title: 'Дата проведения обследования' },
  ];

  const getSheets = (pass_id, type_id) => {
    setIsLoadingSheets(true);
    axios
      .post(`${pgApiUrl}/rpc/get_diag_sheet`, { data: { passport_id: pass_id, diag_type_id: type_id } }, commandSchemaHeader)
      .then((response) => {
        setIsLoadingSheets(false);
        setSheets(response?.data);
      })
      .catch((error) => {
        setIsLoadingSheets(false);
        console.error('Ошибка при получении участков паспорта диагностики! ', error);
      });
  };

  const exportDiag = () => {
    try {
      setIsExportingDiag(true);
      setTimeout(() => {
        const tableExp = document.getElementById('diag_export');
        const sheet = XLSX?.utils?.json_to_sheet([{}], {
          header: [`${selectedType?.name} (наименование участка: ${selectedSheet?.name})`],
        });
        //const wb = XLSX.utils.table_to_book(tableExp);
        const wb = { Sheets: { [selectedType?.name?.substring(0, 30)]: sheet }, SheetNames: [selectedType?.name?.substring(0, 30)] };
        XLSX.utils.sheet_add_dom(sheet, tableExp, { origin: 'A2' });
        XLSX?.writeFile(wb, `${selectedType?.name}.xlsx`);
        dispatch(setTableRowsPass(10));
        setIsExportingDiag(false);
        // console.log(tableExp, wb);
        // debugger;
      }, 3000);
    } catch (error) {
      setIsExportingDiag(false);
      console.error(`Ошибка при выгрузку таблицы диагностики! ${error}`);
    }
  };

  useEffect(() => {
    if (selectedPassport && selectedType && Object.keys(selectedType).length > 0 && Object.keys(selectedPassport).length > 0) {
      getSheets(selectedPassport?.id, selectedType?.id);
    } else {
      setSheets([]);
    }
  }, [selectedPassport, selectedType]);

  return (
    <div className="GeoInterfaceSheetBody">
      {isConfirmDeleteModal && selectedDeleteSheet && selectedDeleteSheet !== null && (
        <Modal
          centered
          scrollable
          show={isConfirmDeleteModal}
          onHide={() => {
            setIsConfirmDeleteModal(!isConfirmDeleteModal);
          }}
          dialogClassName="mx-4 justify-content-center modal-100w"
          contentClassName="w-auto skdf-shadow-down-16dp"
        >
          <Modal.Header className="px-4 pb-3 flex-column align-items-stretch">
            <div className="d-flex justify-content-between align-items-center mt-2 gap-3">
              <h3 className="mb-0">Подтверждение удаления участка</h3>
            </div>
          </Modal.Header>
          <Modal.Body className="GeoInterfaceSheetCreateModal_modal px-4 py-0 pb-5">
            <div>Вы действительно хотите удалить участок?</div>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col xs={6}>
                <Button
                  variant="skdf-primary"
                  className="mt-2 d-inline-flex justify-content-center w-100 align-items-center"
                  type="submit"
                  onClick={() => {
                    axios
                      .post(
                        `${pgApiUrl}/rpc/delete_diag_sheet`,
                        { data: { id: selectedDeleteSheet, user_id: userId } },
                        commandSchemaHeader
                      )
                      .then(() => {
                        setSelectedSheet(null);
                        getSheets(selectedPassport?.id, selectedType?.id);
                        setIsConfirmDeleteModal(!isConfirmDeleteModal);
                        toast.success(`Участок успешно удален!`);
                      })
                      .catch((error) => {
                        console.error(`Ошибка при удалении участка! ${error}`);
                      });
                  }}
                >
                  Подтвердить
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  variant="skdf-stroke"
                  className="d-inline-flex justify-content-center w-100 align-items-center mt-2"
                  onClick={() => {
                    setIsConfirmDeleteModal(!isConfirmDeleteModal);
                  }}
                >
                  Отменить
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      )}
      {isOpenCreateModal && (
        <GeoInterfaceSheetCreateModal
          selectedPassport={selectedPassport}
          selectedType={selectedType}
          isOpenCreateModal={isOpenCreateModal}
          setIsOpenCreateModal={setIsOpenCreateModal}
          getSheets={getSheets}
        />
      )}
      {isOpenSheetUpload && (
        <GeoDiagSheetUpload
          selectedSheet={selectedSheet}
          setSelectedSheet={setSelectedSheet}
          selectedType={selectedType}
          isOpenSheetUpload={isOpenSheetUpload}
          setIsOpenSheetUpload={setIsOpenSheetUpload}
          isRefresh={isRefresh}
          setIsRefresh={setIsRefresh}
        />
      )}
      <div className="table-responsive">
        <Container fluid>
          <Row>
            <Col xs="10">
              <div className="GeoInterfaceSheetBody__title">Участки паспорта диагностики</div>
            </Col>
            <Col xs="2">
              {' '}
              {selectedPassport && userAccessLevel && userAccessLevel === 2 && (
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 100, hide: 100 }}
                  overlay={(props) => (
                    <Tooltip id="map-tooltip" {...props}>
                      Добавить участок
                    </Tooltip>
                  )}
                >
                  <div>
                    <GeoIcon
                      name="plus"
                      iconType="plus"
                      onClick={() => {
                        setIsOpenCreateModal(true);
                      }}
                    />
                  </div>
                </OverlayTrigger>
              )}
            </Col>
          </Row>
        </Container>

        <table className="table skdf table-sticky-header table-hover text-nowrap">
          <thead>
            <tr>
              {cols.map((col, index) => (
                <th key={index} scope="col">
                  {col.title}
                </th>
              ))}
              <th key={'action'} scope="col">
                <div className="GeoInterfaceSheet d-inline-flex justify-content-center align-items-center">
                  Действия
                  {/* <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 100, hide: 100 }}
                    overlay={(props) => (
                      <Tooltip id="map-tooltip" {...props}>
                        Добавить участок
                      </Tooltip>
                    )}
                  >
                    <div>
                      <GeoIcon
                        name="plus"
                        iconType="plus"
                        onClick={() => {
                          setIsOpenCreateModal(true);
                        }}
                      />
                    </div>
                  </OverlayTrigger> */}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoadingSheets ? (
              <tr>
                <td colSpan={4}>
                  <div className="GeoInterfaceSheetNoData">
                    {' '}
                    <GeoLoader />
                  </div>
                </td>
              </tr>
            ) : sheets && sheets.length > 0 ? (
              sheets.map((row, index) => {
                const id = row?.id;
                return (
                  <tr
                    // onClick={() => {
                    //   setSelectedSheet(row);
                    // }}
                    key={index}
                    style={{ backgroundColor: selectedSheet?.id === row?.id ? '#e6f1f4' : '#ffffff', cursor: 'pointer' }}
                  >
                    {cols.map((col, index) => {
                      let val: any = isNaN(row?.[col.name]) && col.name !== 'name' && col.name !== 'diag_date' ? '' : row?.[col.name];
                      if (row?.[col.name] !== null && !isNaN(row?.[col.name]) && (col?.name === 'km_start' || col?.name === 'km_finish')) {
                        const valfixed = String(Number(row?.[col?.name]).toFixed(3));
                        val = valfixed.split('.')?.[0] + '+' + valfixed.split('.')?.[1];
                        // val = Number.isInteger(Number(row?.[col.name])) ? String(Math.trunc(Number(row?.[col.name]))) + "+000" :
                        // String(Math.trunc(Number(row?.[col.name]))) + "+" + String(Number(row?.[col.name] % 1).toFixed(3));
                      }
                      if (col.name === 'diag_date' && row?.[col.name]) {
                        val = format(new Date(val), 'dd.MM.yyyy');
                      }
                      return (
                        <td
                          onClick={() => {
                            setSelectedSheet(row);
                          }}
                          key={index}
                        >
                          {val}
                        </td>
                      );
                    })}
                    <td>
                      <div className="GeoInterfaceSheet d-inline-flex justify-content-center align-items-center">
                        {/* временно скрыл <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 100, hide: 100 }}
                          overlay={(props) => (
                            <Tooltip id="map-tooltip" {...props}>
                              Выбрать участок
                            </Tooltip>
                          )}
                        >
                          <div>
                            <GeoIcon
                              name="check"
                              iconType="check"
                              onClick={() => {
                                setSelectedSheet(row);
                              }}
                            />
                          </div>
                        </OverlayTrigger> */}
                        {/* <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 100, hide: 100 }}
                          overlay={(props) => (
                            <Tooltip id="map-tooltip" {...props}>
                              Добавить участок
                            </Tooltip>
                          )}
                        >
                          <div>
                            <GeoIcon
                              name="plus"
                              iconType="plus"
                              onClick={() => {
                                setIsOpenCreateModal(true);
                              }}
                            />
                          </div>
                        </OverlayTrigger> */}

                        {selectedType?.code !== 'DIAG_PIVOT' && userAccessLevel && userAccessLevel === 2 && (
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 100, hide: 100 }}
                            overlay={(props) => (
                              <Tooltip id="map-tooltip" {...props}>
                                Загрузить
                              </Tooltip>
                            )}
                          >
                            <div>
                              <GeoIcon
                                name="upload"
                                iconType="upload"
                                onClick={() => {
                                  setSelectedSheet(row);
                                  setIsOpenSheetUpload(true);
                                }}
                              />
                            </div>
                          </OverlayTrigger>
                        )}
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 100, hide: 100 }}
                          overlay={(props) => (
                            <Tooltip id="map-tooltip" {...props}>
                              Экспорт
                            </Tooltip>
                          )}
                        >
                          <div>
                            {isExportingDiag && selectedSheet?.id === row?.id ? (
                              <GeoLoader />
                            ) : (
                              <GeoIconButton
                                iconType="download_2"
                                isTransparent={true}
                                handleClick={() => {
                                  setSelectedSheet(row);
                                  checkDiagData(row?.id);
                                  // dispatch(setTableRowsPass(10000));
                                  // exportDiag();
                                }}
                              />
                              // <GeoIcon
                              //   name="download"
                              //   iconType="download_2"
                              //   width={22}
                              //   onClick={async () => {
                              //     const
                              //     setSelectedSheet(row);
                              //     dispatch(setTableRowsPass(10000));
                              //     exportDiag();
                              //   }}
                              // />
                            )}
                          </div>
                        </OverlayTrigger>

                        {userAccessLevel && userAccessLevel === 2 && (
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 100, hide: 100 }}
                            overlay={(props) => {
                              // console.log(props);
                              // debugger;
                              return (
                                <Tooltip
                                  id="map-tooltip"
                                  {...props}
                                  // style={{ position: 'fixed', zIndex: 99999, bottom: 'auto', left: 'auto', right: 'auto', top: 'auto' }}
                                >
                                  Удалить участок
                                </Tooltip>
                              );
                            }}
                          >
                            <div>
                              <GeoIcon
                                name="trash"
                                iconType="trash"
                                onClick={() => {
                                  setIsConfirmDeleteModal(true);
                                  setSelectedDeleteSheet(id);
                                  // axios
                                  //   .delete(`${pgApiUrl}/diag_sheet?id=eq.${id}`, diagSchemaHeaders)
                                  //   .then(() => {
                                  //     getSheets(selectedPassport?.id, selectedType?.id);
                                  //     toast.success(`Участок успешно удален!`);
                                  //   })
                                  //   .catch((error) => {
                                  //     console.error(`Ошибка при удалении участка! ${error}`);
                                  //   });
                                }}
                              />
                            </div>
                          </OverlayTrigger>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4}>
                  <div className="GeoInterfaceSheetNoData">Данные не найдены</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeoInterfaceSheet;
