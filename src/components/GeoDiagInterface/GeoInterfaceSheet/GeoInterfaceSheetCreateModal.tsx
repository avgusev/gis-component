import React, { useState } from 'react';
import { Alert, Button, Col, Modal, Row } from 'react-bootstrap';
import GeoIcon from '../../GeoIcon';
import axios from 'axios';
import { pgApiUrl } from '../../../config/constants';
import { toast } from 'react-toastify';
import { GeoInterfaceSheetCreateModalTypes } from './GeoInterfaceSheetCreateModal.types';
import { Controller, useForm } from 'react-hook-form';
import GeoInputField from '../../GeoForms/GeoInputField/GeoInputField';
import './GeoInterfaceSheetCreateModal.scss';

import { formatDateToString } from '../../../features/formatDateToString';

const GeoInterfaceSheetCreateModal = ({
  selectedPassport,
  selectedType,
  isOpenCreateModal,
  setIsOpenCreateModal,
  getSheets,
}: GeoInterfaceSheetCreateModalTypes) => {
  const { handleSubmit, control } = useForm();
  const [isCreatingSheet, setIsCreatingSheet] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>('');

  const onSubmit = (formData) => {
    let km_start: any = null;
    let km_finish: any = null;

    if (String(formData?.km_start).includes('+')) {
      km_start = Number(String(formData?.km_start.split('+')?.[0]) + '.' + String(formData?.km_start.split('+')?.[1]));
    } else {
      km_start = formData?.km_start;
    }

    if (String(formData?.km_end).includes('+')) {
      km_finish = Number(String(formData?.km_end).split('+')?.[0] + '.' + String(formData?.km_end).split('+')?.[1]);
    } else {
      km_finish = formData?.km_end;
    }

    const obj = {
      data: {
        name: formData?.name,
        km_start: km_start,
        km_finish: km_finish,
        diag_date: formData?.diag_date,
        passport_id: selectedPassport?.id,
        diag_type_id: selectedType?.id,
      },
    };
    setIsCreatingSheet(true);
    axios
      //.post(`${pgApiUrl}/diag_sheet`, obj, diagSchemaHeaders)
      .post(`${pgApiUrl}/rpc/create_diag_sheet`, obj, {
        headers: { 'Content-Profile': 'command_api', 'Accept-Profile': 'command_api' },
      })
      .then((response) => {
        setIsCreatingSheet(false);
        setIsOpenCreateModal(false);
        getSheets(selectedPassport?.id, selectedType?.id);
        toast.success(`Участок паспорта диагностики успешно сохранен`, { closeButton: true });
      })
      .catch((error: any) => {
        if (error?.response?.data?.code === 'P0004' || error?.response?.data?.code === 'P0001') {
          setWarningMessage(error?.response?.data?.message);
        }
        setIsCreatingSheet(false);
        console.error(`Ошибка при сохранении участка! ${error}`);
      });
  };

  return (
    <Modal
      centered
      scrollable
      show={isOpenCreateModal}
      onHide={() => {
        setIsOpenCreateModal(!isOpenCreateModal);
      }}
      dialogClassName="mx-4 justify-content-center modal-100w"
      contentClassName="w-auto skdf-shadow-down-16dp"
    >
      <Modal.Header className="px-4 pb-3 flex-column align-items-stretch">
        <div className="d-flex justify-content-between align-items-center mt-2 gap-3">
          <h3 className="mb-0">Создание участка паспорта диагностики</h3>
          <div className="GeoInterfaceSheetCreateModal__header__close-btn">
            <GeoIcon
              name="close"
              iconType="close"
              onClick={() => {
                setIsOpenCreateModal(!isOpenCreateModal);
              }}
            />
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="GeoInterfaceSheetCreateModal_modal px-4 py-0 pb-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="GeoInterfaceSheetCreateModal__item">
            <Controller
              control={control}
              rules={{ required: true }}
              name="name"
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <div className="mb-3">
                  <label className="form-check-label cursorLayers">Наименование</label>
                  <input
                    name="name"
                    className="form-control form-control-sm"
                    placeholder="Введите наименование"
                    autoComplete="off"
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                    }}
                  />
                </div>
              )}
            />
          </div>
          <div className="GeoInterfaceSheetCreateModal__item">
            <Controller
              control={control}
              rules={{ required: true }}
              name="km_start"
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <div className="mb-3">
                  <label className="form-check-label cursorLayers">начало участка, км+м</label>
                  <input
                    name="km_start"
                    className="form-control form-control-sm"
                    placeholder="Введите км начала участка"
                    autoComplete="off"
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                    }}
                  />
                </div>
              )}
            />
          </div>
          <div className="GeoInterfaceSheetCreateModal__item">
            <Controller
              control={control}
              rules={{ required: true }}
              name="km_end"
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <div className="mb-3">
                  <label className="form-check-label cursorLayers">конец участка, км+м</label>
                  <input
                    name="km_end"
                    className="form-control form-control-sm"
                    placeholder="Введите км конца участка"
                    autoComplete="off"
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                    }}
                  />
                </div>
              )}
            />
          </div>
          <div className="GeoInterfaceSheetCreateModal__item">
            <Controller
              name="diag_date"
              control={control}
              rules={{ required: true }}
              defaultValue={formatDateToString(new Date())}
              render={({ field }) => {
                return (
                  <div className="mb-3">
                    <label className="form-check-label cursorLayers">Дата проведения обследования</label>
                    <GeoInputField
                      name="diag_date"
                      type="date"
                      placeholder="Дата проведения обследования"
                      {...field}
                      //value={}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                  </div>
                );
              }}
            />
          </div>
          {warningMessage && (
            <div className="GeoInterfaceSheetCreateModal__item">
              <Alert key="warning" variant="warning">
                {warningMessage}
              </Alert>
            </div>
          )}
          <Row>
            <Col xs={6}>
              <Button
                disabled={isCreatingSheet}
                variant="skdf-primary"
                className="mt-2 d-inline-flex justify-content-center w-100 align-items-center"
                type="submit"
              >
                {isCreatingSheet ? 'Сохраняю...' : 'Сохранить'}
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                variant="skdf-stroke"
                className="d-inline-flex justify-content-center w-100 align-items-center mt-2"
                onClick={() => {
                  setIsOpenCreateModal(!isOpenCreateModal);
                }}
              >
                Отменить
              </Button>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default GeoInterfaceSheetCreateModal;
