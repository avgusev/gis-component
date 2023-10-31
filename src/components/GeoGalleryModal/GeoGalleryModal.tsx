import React, { useEffect, useState } from 'react';
import { Modal, Card, Alert } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { GeoGalleryModalType } from './GeoGalleryModal.types';
import '../GeoMapCardDetail/GeoMapCardDetail.scss';
import { imageApiUrl } from '../../config/constants';

const GeoGalleryModal = ({ open, isOpen, data }: GeoGalleryModalType) => {
  const close = () => open(false);
  const defaultTab = data?.[0]?.work_id;
  // const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [activePage, setActivePage] = useState(1);

  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const getImages = () => {
  //   // setIsLoading(true);
  //   const params = { backbone_id: backBoneId };
  //   axios
  //     .post(`${pgApiUrl}/rpc/f_get_work_photos`, params, publicSchemaHeader)
  //     .then((response) => {
  //       const result = [];
  //       if (response.data) {
  //         response.data.map((item) => {
  //           const after = item?.after;
  //           const before = item?.before;
  //           const workName = item?.work_name;
  //           const obj = { title: '', imgArr: [] };
  //           obj.title = workName;
  //           if (after) {
  //             obj.imgArr.push(...after);
  //           }
  //           if (before) {
  //             obj.imgArr.push(...before);
  //           }
  //           result.push(obj);

  //         });
  //       }
  //       console.log(result);
  //       setData(result);
  //       // setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       toast.error(`Ошибка! ${error?.response?.data?.message ? error.response.data.message : error}`);
  //     });
  // };

  // useEffect(() => {
  //   getImages();
  // }, []);

  return (
    <Modal
      centered
      scrollable
      size="lg"
      dialogClassName="modal-80w"
      aria-labelledby="contained-modal-title-vcenter"
      show={isOpen}
      onHide={close}
      contentClassName="skdf-shadow-down-16dp"
    >
      <Modal.Header className="d-flex px-4 py-3 me-3" closeButton>
        <Col xs={12}>
          <Modal.Title id="contained-modal-title-vcenter">
            <span className="GeoFiltersFull__header__title mb-0 mt-0">Фотографии работ</span>
          </Modal.Title>
        </Col>
      </Modal.Header>
      <Modal.Body className="px-4 py-3 pb-4">
        <Row>
          {data.length ? (
            <>
              <Col sm={4}>
                <ListGroup>
                  {data.map((item, index) => {
                    return (
                      <ListGroup.Item
                        key={`${item.title}-${item.work_id}`}
                        active={activeTab === item.work_id}
                        onClick={() => setActiveTab(item.work_id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {item.title}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Col>
              <Col sm={8}>
                {data.map((item) => {
                  let pag = [];
                  if (item.imgCount > 0) {
                    for (let num = 1; num <= item.imgCount; num++) {
                      pag.push(
                        <Pagination.Item key={`${num}_pag`} active={num === activePage} onClick={() => setActivePage(num)}>
                          {num}
                        </Pagination.Item>
                      );
                    }
                  }

                  return (
                    <>
                      {activeTab === item.work_id && (
                        <>
                          <div className="mb-4">
                            {' '}
                            <div className="my-2" key={`${item?.customers}customers`}>
                              <div className="GeoMapCardDetail__item__title mb-2">Заказчик</div>
                              <div className="GeoMapCardDetail__item__text">{item?.customers || 'Нет данных'}</div>
                            </div>
                            <div className="my-2" key={`${item?.contractors}contractors`}>
                              <div className="GeoMapCardDetail__item__title mb-2">Подрядчик</div>
                              <div className="GeoMapCardDetail__item__text">{item?.contractors || 'Нет данных'}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <div className="my-2" key={`${item?.work_length}work_length`}>
                                <div className="GeoMapCardDetail__item__title mb-2">Протяженность</div>
                                <div className="GeoMapCardDetail__item__text">{item?.work_length || 'Нет данных'}</div>
                              </div>

                              <div className="my-2" key={`${item?.work_status}work_status`}>
                                <div className="GeoMapCardDetail__item__title mb-2">Статус работ</div>
                                <div className="GeoMapCardDetail__item__text">{item?.work_status || 'Нет данных'}</div>
                              </div>

                              <div className="my-2" key={`${item?.deadline}`}>
                                <div className="GeoMapCardDetail__item__title mb-2">Срок проведения</div>
                                <div className="GeoMapCardDetail__item__text">{item?.deadline || 'Нет данных'}</div>
                              </div>

                              <div className="my-2" key={`${item?.work_start}work_start`}>
                                <div className="GeoMapCardDetail__item__title mb-2">Дата начала</div>
                                <div className="GeoMapCardDetail__item__text">{item?.work_start || 'Нет данных'}</div>
                              </div>

                              <div className="my-2" key={`${item?.work_finish}work_finish`}>
                                <div className="GeoMapCardDetail__item__title mb-2">Дата завершения работ</div>
                                <div className="GeoMapCardDetail__item__text">{item?.work_finish || 'Нет данных'}</div>
                              </div>
                            </div>
                          </div>

                          {item?.imgArr.length > 0 ? (
                            item?.imgArr.map((i, index) => {
                              return (
                                <>
                                  {activePage === i.pageNum && (
                                    <div className="d-flex">
                                      <div className="mb-3 me-3 w-50">
                                        <img
                                          key={`${i.beforeCode}-img`}
                                          style={{ width: '100%', height: '100%', aspectRatio: 'attr(width) / attr(height)' }}
                                          // sizes=" 456px, 304px"
                                          src={`${imageApiUrl}/files/download/${i.beforeCode}`}
                                          alt={i.beforeName}
                                        />
                                        <span className="fw-bold">До</span>
                                      </div>
                                      <div className="mb-3 w-50">
                                        <img
                                          key={`${i.afterCode}-img`}
                                          style={{ width: '100%', height: '100%', aspectRatio: 'attr(width) / attr(height)' }}
                                          // sizes=" 456px, 304px"
                                          src={`${imageApiUrl}/files/download/${i.afterCode}`}
                                          alt={i.afterName}
                                        />
                                        <span className="fw-bold">После</span>
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })
                          ) : (
                            <Alert variant="warning">Фотографии отсутсвуют</Alert>
                          )}
                          <Pagination className="dflex justify-content-center mt-4">{pag}</Pagination>
                        </>
                      )}
                    </>
                  );
                })}
              </Col>
            </>
          ) : (
            <Alert variant="warning">Нет данных</Alert>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default GeoGalleryModal;
