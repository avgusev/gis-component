import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import GeoIcon from '../../GeoIcon';
import axios from 'axios';
import { commandSchemaHeader, diagSchemaHeaders, pgApiUrl } from '../../../config/constants';
import { toast } from 'react-toastify';
import { GeoDiagSheetUploadTypes } from './GeoDiagSheetUpload.types';
import { Controller, useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import './GeoDiagSheetUpload.scss';
import GeoLoader from '../../GeoLoader/GeoLoader';
import filess from '../../../assets/diag_templates/eveness.xlsx';

const GeoDiagSheetUpload = ({
  selectedType,
  selectedSheet,
  setSelectedSheet,
  isOpenSheetUpload,
  setIsOpenSheetUpload,
  isRefresh,
  setIsRefresh,
}: GeoDiagSheetUploadTypes) => {
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
  } = useForm();
  const [isUploadingSheet, setIsUploadingSheet] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<any>({});
  const [isDiagData, setIsDiagData] = useState<boolean>(false);

  const checkDiagData = async (sheetId) => {
    try {
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
        setIsDiagData(true);
      }
    } catch (error) {
      console.error(`Ошибка при проверка наличия данных диагностики на заданном участке`);
    }
  };

  useEffect(() => {
    if (selectedSheet && Object.keys(selectedSheet).length > 0) {
      checkDiagData(selectedSheet?.id);
    }
  }, [selectedSheet]);

  const sheetTemplates = {
    PANO: {
      name: 'Панорамная съемка',
      filename: '',
      func: '',
      rowPosData: null,
    },
    LIDAR: {
      name: 'Лазерная съемка',
      filename: '',
      func: '',
      rowPosData: null,
    },
    DEFECT_GOST: {
      name: 'Наличие дефектов по ГОСТ Р 50597',
      filename: 'defect_gost.xlsx',
      func: 'parse_diag_hwd_defect_gost',
      rowPosData: 5,
    },
    DIAG_PIVOT: {
      name: 'Инструментальная диагностика (сводные данные)',
      filename: 'diag_pivot.xlsx',
      func: '',
      rowPosData: 5,
    },
    EVENESS: {
      name: 'Продольная ровность покрытия',
      filename: 'eveness.xlsx',
      func: 'parse_diag_hwd_eveness',
      rowPosData: 5,
    },
    PAVEMENT_STRENGTH: {
      name: 'Прочность дорожной одежды',
      filename: 'pavement_strength.xlsx',
      func: 'parse_diag_hwd_pavement_strength',
      rowPosData: 4,
    },
    CLUTCH: {
      name: 'Коэффициент сцепления',
      filename: 'clutch.xlsx',
      func: 'parse_diag_hwd_clutch',
      rowPosData: 5,
    },
    RUT: {
      name: 'Поперечная ровность (колейность)',
      filename: 'rut.xlsx',
      func: 'parse_diag_hwd_rut',
      rowPosData: 5,
    },
    DEFECT_ODM: {
      name: 'Наличие дефектов по ОДМ 218.4.039',
      filename: 'defect_odm.xlsx',
      func: 'parse_diag_hwd_defect_odm',
      rowPosData: 4,
    },
    CROSSSLOPE: {
      name: 'Поперечные уклоны проезжей части',
      filename: 'crossslope.xlsx',
      func: 'parse_diag_hwd_crossslope',
      rowPosData: 5,
    },
    LONG_SLOPE: {
      name: 'Продольные уклоны',
      filename: 'long_slope.xlsx',
      func: 'parse_diag_hwd_long_slope',
      rowPosData: 4,
    },
    PLAN_CURVE: {
      name: 'Радиусы кривых в плане',
      filename: 'plan_curve.xlsx',
      func: 'parse_diag_hwd_plan_curve',
      rowPosData: 3,
    },
  };

  //Загрузка
  const blobToBinaryStr = (blob) =>
    new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsBinaryString(blob);
    });

  const uploadFile = async (file) => {
    try {
      const fileStr = await blobToBinaryStr(new Blob(file, { type: 'application/octet-stream' }));
      console.log('BinaryString: ', fileStr);
      // const obj = {
      //   p_bytea: fileStr,
      //   p_code: selectedType?.code,
      // };
      const responseUploadFunc = await axios.post(`${pgApiUrl}/rpc/upload_diag_binary`, fileStr, {
        headers: { 'Content-Profile': 'diag', 'Content-Type': 'application/octet-stream' },
      });
      console.log(responseUploadFunc);
    } catch (error) {
      toast.error(`Ошибка загрузке файла! ${error}`);
    }
  };

  const downloadTemplate = async () => {
    try {
      setIsDownloading(true);
      // const response = await axios.get(`${pgApiUrl}/diag_type?select=template_file&code=eq.${selectedType?.code}`, {
      //   headers: { 'Content-Profile': 'diag', 'Accept-Profile': 'diag', Accept: 'application/octet-stream' },
      // });
      const obj = {
        diag_type_code: selectedType?.code,
      };
      const response = await axios.post(`${pgApiUrl}/rpc/get_diag_file_template`, obj, {
        headers: { 'Content-Profile': 'command_api', 'Accept-Profile': 'command_api', Accept: 'application/octet-stream' },
      });
      const d: any = response?.data;
      const l: any = d.length;
      const array = new Uint8Array(l);
      for (let i = 0; i < l; i += 1) {
        array[i] = d.charCodeAt(i);
      }
      const blob = new Blob([array], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedType?.name}.xlsx`);
      document.body.appendChild(link);
      link.click();
      setIsDownloading(false);
    } catch (e) {
      setIsDownloading(false);
      setWarningMessage({
        type: 'system',
        text: 'Ошибка при скачивании шаблона',
      });
      console.error(`Ошибка при скачивании шаблона! ${e}`);
    }
  };

  const readAndTransformFile = (file) => {
    try {
      return new Promise((resolve, reject) => {
        const datafile = new Blob(file, { type: 'application/json' });
        const reader = new FileReader();
        let fileCSV: any;

        reader.onload = (event) => {
          const dataf = event?.target?.result;
          const workbook = XLSX.read(dataf, {
            type: 'binary',
            //cellNF: true,
            cellDates: true,
            cellText: false,
            //raw: false,
          });
          workbook.SheetNames.forEach((sheetName, i) => {
            if (i === 0) {
              const ws = workbook.Sheets[sheetName];
              fileCSV = XLSX.utils.sheet_to_csv(ws, { FS: '#', dateNF: 'dd"."mm"."yyyy', blankrows: false, strip: false });
              const bufferString = fileCSV.toString();
              const arr = bufferString.split('\n').filter((val) => {
                if (val == null || val == '') {
                  return false;
                }
                return true;
              });
              // console.log(arr);
              // debugger;
              if (arr.length > 0) {
                arr.splice(0, sheetTemplates?.[selectedType?.code]?.rowPosData - 1);
                const sourceDataArr: Array<string | number> = arr.map((item) => item.split('#'));
                resolve(sourceDataArr);
              } else {
                resolve([]);
              }
            }
          });
        };
        reader.onerror = reject;
        reader.readAsBinaryString(datafile);
      });
    } catch (error) {
      setWarningMessage({
        type: 'system',
        text: 'Ошибка при чтении исходных данных',
      });
      console.error(`Ошибка при чтении исходных данных! ${error}`);
      return [];
    }
  };

  const loadData = async (file, sheetId) => {
    try {
      setIsDiagData(false);
      const sourceFileArr: any = await readAndTransformFile(file);
      if (sourceFileArr && sourceFileArr.length > 0) {
        console.log(sourceFileArr);
        const obj = {
          diag_sheet: selectedSheet?.id,
          data: sourceFileArr,
          lanes_enum: 0,
        };
        console.log(obj);

        axios
          .post(`${pgApiUrl}/rpc/${sheetTemplates?.[selectedType?.code]?.func}`, obj, commandSchemaHeader)
          .then((response) => {
            const sheet = selectedSheet;
            setSelectedSheet(null);
            toast.success(`Данные успешно загружены`);
            setIsUploadingSheet(false);
            setSelectedSheet(sheet);
            setIsOpenSheetUpload(false);
            setIsRefresh(true);
          })
          .catch((error) => {
            if (error?.response?.data?.code === 'P0004' || error?.response?.data?.code === 'P0001') {
              setWarningMessage({
                type: 'func',
                text: error?.response?.data?.message,
              });
            }
            setIsUploadingSheet(false);
            console.error(`Ошибка при загрузке данных в БД! ${error}`);
          });
      } else {
        setWarningMessage({
          type: 'func',
          text: 'Файл не содержит данных',
        });
        console.warn('Файл не содержит данных');
        setIsUploadingSheet(false);
      }
    } catch (error) {
      setIsUploadingSheet(false);
      setWarningMessage({
        type: 'system',
        text: 'Ошибка  при загрузке данных',
      });
      console.log(`Ошибка при загрузке данных! ${error}`);
    }
  };

  const onSubmit = (formData) => {
    if (formData && formData.fileinput && formData.fileinput.length > 0 && selectedSheet?.id) {
      setIsUploadingSheet(true);
      loadData(formData?.fileinput, selectedSheet?.id);
    }
  };

  return (
    <Modal
      centered
      scrollable
      show={isOpenSheetUpload}
      onHide={() => {
        setIsOpenSheetUpload(!isOpenSheetUpload);
      }}
      dialogClassName="mx-4 justify-content-center modal-100w"
      contentClassName="w-auto skdf-shadow-down-16dp"
    >
      <Modal.Header className="px-4 pb-3 flex-column align-items-stretch">
        <div className="d-flex justify-content-between align-items-center mt-2 gap-3">
          <h3 className="mb-0">Загрузка данных</h3>
          <div className="GeoDiagSheetUpload__header__close-btn">
            <GeoIcon
              name="close"
              iconType="close"
              onClick={() => {
                setIsOpenSheetUpload(!isOpenSheetUpload);
              }}
            />
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="GeoDiagSheetUpload_modal px-4 py-0 pb-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="GeoDiagSheetUpload__item">
            <Controller
              control={control}
              name="fileinput"
              rules={{ required: true }}
              render={({ field, fieldState, formState }) => {
                return (
                  <>
                    <label className="form-label">Файл формата Excel</label>
                    <input
                      {...register('fileinput')}
                      type="file"
                      className={`form-control form-control-sm`}
                      onChange={(e) => {
                        // if (e.currentTarget.files?.[0]?.type === 'application/json') {
                        field.onChange(e.currentTarget.files);
                        //   clearErrors();
                        // } else {
                        //   setError('fileinput', { message: 'Неверный формат файла' });
                        // }
                      }}
                      autoComplete="off"
                    />
                  </>
                );
              }}
            />
            {errors && errors?.fileinput && errors?.fileinput?.message ? (
              <div style={{ paddingTop: '5px', color: 'red' }}>{String(errors?.fileinput?.message)}</div>
            ) : (
              ''
            )}
          </div>
          <div
            className="GeoDiagSheetUpload__item"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              downloadTemplate();
            }}
          >
            {isDownloading ? (
              <GeoLoader />
            ) : (
              <span style={{ color: '#0d47a1' }}>
                <GeoIcon name="download_template" iconType="file-text" />
                <span style={{ paddingLeft: '10px' }}>Скачать шаблон для загрузки данных</span>
              </span>
            )}
          </div>
          {(warningMessage && Object.keys(warningMessage).length > 0) || isDiagData ? (
            warningMessage?.type === 'func' || isDiagData ? (
              <div className="GeoDiagSheetUpload__item">
                <Alert key="warning" variant="warning">
                  {warningMessage?.text ||
                    'Внимание! Для выбранного участка уже загружены данные. При импорте текущие данные будут утеряны!'}
                </Alert>
              </div>
            ) : warningMessage?.type === 'system' ? (
              <div className="GeoDiagSheetUpload__item">
                <Alert key="danger" variant="danger">
                  {warningMessage?.text}
                </Alert>
              </div>
            ) : null
          ) : null}

          {/* <div className="GeoDiagSheetUpload__item" style={{ cursor: 'pointer' }}>
            <input
              type="file"
              className={`form-control form-control-sm`}
              onChange={(e) => {
                uploadFile(e.currentTarget?.files);
                debugger;
              }}
              autoComplete="off"
            />
          </div> */}

          <Row>
            <Col xs={6}>
              <Button
                disabled={isUploadingSheet}
                variant="skdf-primary"
                className="mt-2 d-inline-flex justify-content-center w-100 align-items-center"
                type="submit"
              >
                {isUploadingSheet ? (
                  <div>
                    <GeoLoader size={20} /> Загружаю...
                  </div>
                ) : (
                  'Загрузить'
                )}
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                variant="skdf-stroke"
                className="d-inline-flex justify-content-center w-100 align-items-center mt-2"
                onClick={() => {
                  setIsOpenSheetUpload(!isOpenSheetUpload);
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

export default GeoDiagSheetUpload;
