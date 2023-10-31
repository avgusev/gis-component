import React, { FC, useEffect, useState } from 'react';
import { Button, Modal, Accordion, Card } from 'react-bootstrap';
import GeoMapUploadGeomTypes from './GeoMapUploadGeom.types';
import { Controller, useForm } from 'react-hook-form';
import './GeoMapUploadGeom.scss';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setRoadPartGeom } from '../../../reducers/mapDraw.reducer';
import GeoLoader from '../../GeoLoader/GeoLoader';

const GeoMapUploadGeom: FC<GeoMapUploadGeomTypes> = ({ map, isUploadGeomOpen, setIsUploadGeomOpen }) => {
  const dispatch = useDispatch();
  const [isLoadingGeom, setIsLoadingGeom] = useState<boolean>(false);
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

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const datafile = new Blob(file, { type: 'application/json' });
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataf: string = String(event?.target?.result);
          const json = JSON.parse(dataf);
          resolve(json);
        };
        reader.onerror = (e) => {
          console.error(`Ошибка при чтении файла геометрии! ${e}`);
          toast.error(`Ошибка при чтении файла геометрии! ${e}`);
          reject();
        };
        reader.readAsBinaryString(datafile);
      } catch (error) {
        console.error(`Ошибка при чтении файла геометрии! ${error}`);
        toast.error(`Ошибка при чтении файла геометрии! ${error}`);
        return null;
      }
    });
  };

  const loadGeom = async (file) => {
    try {
      setIsLoadingGeom(true);
      const geoJson: any = await readFile(file);
      if (geoJson && geoJson?.type && geoJson?.coordinates && geoJson?.coordinates?.length > 0) {
        dispatch(setRoadPartGeom({ geom: geoJson }));
        toast.info(`Геометрия успешно загружена!`);
        setIsLoadingGeom(false);
        setIsUploadGeomOpen(false);
      } else {
        setIsLoadingGeom(false);
        toast.warn(`В исходном файле отсутствует геометрия!`);
      }
    } catch (error) {
      console.error(`Ошибка при загрузке геометрии! ${error}`);
      toast.error(`Ошибка при загрузке геометрии! ${error}`);
    }
  };

  const onSubmit = (formData) => {
    if (formData?.fileinput && formData?.fileinput.length > 0) {
      loadGeom(formData?.fileinput);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="skdf-shadow-down-16dp GeoMapUploadGeom__modal">
        <Card.Body className="GeoMapUploadGeom__modal__body">
          <h3 className="GeoMapUploadGeom__modal__body__title">Загрузка геометрии</h3>

          <div className="GeoMapUploadGeom__form__section">
            <div className="GeoMapUploadGeom__form__section__body">
              <Controller
                control={control}
                name="fileinput"
                rules={{ required: true }}
                render={({ field, fieldState, formState }) => {
                  return (
                    <>
                      <label className="form-label">Формат файла JSON (GeoJSON)</label>
                      <input
                        {...register('fileinput')}
                        type="file"
                        className={`form-control form-control-sm`}
                        onChange={(e) => {
                          if (e.currentTarget.files?.[0]?.type === 'application/json') {
                            field.onChange(e.currentTarget.files);
                            clearErrors();
                          } else {
                            setError('fileinput', { message: 'Неверный формат файла' });
                          }
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
          </div>
        </Card.Body>

        <Card.Footer className="GeoMapUploadGeom__modal__footer px-4">
          <Button
            disabled={isLoadingGeom}
            variant="skdf-primary"
            className="d-inline-flex justify-content-center w-100 align-items-center mx-4"
            type="submit"
          >
            {isLoadingGeom ? (
              <div>
                <GeoLoader size={20} /> Загружаю...
              </div>
            ) : (
              'Загрузить'
            )}
          </Button>
          <Button
            variant="skdf-stroke"
            className="d-inline-flex justify-content-center w-100 align-items-center mt-2"
            onClick={() => {
              setIsUploadGeomOpen(!isUploadGeomOpen);
            }}
          >
            Отменить
          </Button>
        </Card.Footer>
      </Card>
    </form>
  );
};

export default GeoMapUploadGeom;
