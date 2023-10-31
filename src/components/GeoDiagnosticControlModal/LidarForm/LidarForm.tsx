import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import GeoInputField from '../../GeoForms/GeoInputField/GeoInputField';
import axios from 'axios';
import { pgApiUrl, commandSchemaHeader, commandSchemaHeaderOctetStream } from '../../../config/constants';
import { toast } from 'react-toastify';
import { LidarFormProps } from './LidarForm.types';
import GeoInputRange from '../../GeoInputRange/GeoInputRange';
import GeoDefaultInput from '../../GeoForms/GeoDefaultInputFile/GeoDefaultInput';
import { blobToBinaryStr } from '../../../features/blobToBinaryStr';

const LidarForm = (props: LidarFormProps) => {
  const { handleSubmit, control } = useForm();
  const { isCreateRow, passId, onClose, selectedRow, idPart, idRoad, firstRange = '0+000', secondRange = '0+000' } = props;

  const [nameValue, setNameValue] = useState<string>('');
  const [valueRange, setValueRange] = useState([firstRange, secondRange]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [srcPathValue, setSrcPathValue] = useState<string>('');
  const [destPathValue, setDestPathValue] = useState<string>('');
  const [trajectoryFilename, setTrajectoryFilename] = useState(null);
  const [trajectoryFilenameName, setTrajectoryFilenameName] = useState('');

  const postForm = (formData) => {
    const preparedData = { data: formData };
    axios
      .post(`${pgApiUrl}/rpc/create_diag_sheet`, preparedData, commandSchemaHeader)
      .then(() => {
        toast.info('Лазерная съемка успешно сохранена');
      })
      .catch((error) => {
        console.error(`Ошибка при отправки данных формы: ${error}`);
      });
  };

  const uploadFile = async (sheetId) => {
    const blobStr = await blobToBinaryStr(new Blob(trajectoryFilename, { type: 'application/octet-stream' }));
    axios
      .post(`${pgApiUrl}/rpc/upload_trajectory_file`, blobStr, commandSchemaHeaderOctetStream)
      .then((response) => {
        const fileId = response.data;
        axios
          .post(`${pgApiUrl}/rpc/parse_trajectory_file`, { sheet_id: sheetId, file_id: fileId }, commandSchemaHeader)
          .then((response) => {
            toast.info('Файл траектории успешно загружен');
          })
          .catch((error) => {
            console.error(`Ошибка при загрузки файла: ${error}`);
          });
      })
      .catch((error) => {
        console.error(`Ошибка при загрузки файла: ${error}`);
      });
  };

  const onSubmit = (formData) => {
    const modifiedData = {
      name: formData?.name,
      passport_id: passId,
      road_id: idRoad,
      road_part_id: idPart,
      diag_type_id: 2,
      km_start: isCreateRow ? valueRange[0] : valueRange[0].length > 0 ? valueRange[0] : selectedRow?.km_start,
      km_finish: isCreateRow ? valueRange[1] : valueRange[1].length > 0 ? valueRange[1] : selectedRow?.km_finish,
      src_path: formData?.src_path,
      dest_path: formData.dest_path,
    };
    if (!isCreateRow) {
      modifiedData['id'] = selectedRow?.id;
      modifiedData['trajectory_filename'] = trajectoryFilenameName.length > 0 ? trajectoryFilenameName : selectedRow?.trajectory_filename;
      uploadFile(selectedRow?.id);
    }
    postForm(modifiedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className="mb-4">{`Форма ${isCreateRow ? 'создания' : 'редактирования'}`}</h4>
      <div className="DiagDetailsForm__item">
        <Controller
          name="name"
          control={control}
          defaultValue={!isCreateRow ? selectedRow?.name : ''}
          render={({ field }) => (
            <GeoInputField
              name="name"
              value={nameValue}
              onChange={setNameValue}
              label="Название"
              type="text"
              placeholder="Название"
              {...field}
            />
          )}
        />
      </div>
      <div className="DiagDetailsForm__item">
        <GeoInputRange
          id="lidarForm-range"
          label="Начало участка - Конец участка"
          rangeType="text"
          minRequired
          maxRequired
          placeholderMin="0+000"
          placeholderMax="0+000"
          value={valueRange}
          onChange={(value) => setValueRange(value)}
          setIsValid={setIsValid}
          size="fullwidth"
        />
      </div>

      <div className="DiagDetailsForm__item">
        <Controller
          name="src_path"
          control={control}
          defaultValue={!isCreateRow ? selectedRow?.src_path : ''}
          render={({ field }) => (
            <GeoInputField
              name="src_path"
              value={srcPathValue}
              onChange={setSrcPathValue}
              label="Входной файл"
              type="text"
              placeholder="Входной файл"
              {...field}
            />
          )}
        />
      </div>

      <div className="DiagDetailsForm__item">
        <Controller
          name="dest_path"
          control={control}
          defaultValue={!isCreateRow ? selectedRow?.dest_path : ''}
          render={({ field }) => (
            <GeoInputField
              name="dest_path"
              value={destPathValue}
              onChange={setDestPathValue}
              label="Целевая папка"
              type="text"
              placeholder="Целевая папка"
              {...field}
            />
          )}
        />
      </div>
      {!isCreateRow && (
        <div className="DiagDetailsForm__item">
          <label className="form-label mb-2">{'Файл траектории'}</label>
          {!isCreateRow && <h6>{trajectoryFilenameName.length > 0 ? trajectoryFilenameName : selectedRow?.trajectory_filename}</h6>}
          <Controller
            control={control}
            name="trajectory_filename"
            render={({ field }) => (
              <GeoDefaultInput
                disabled={selectedRow?.trajectory_filename && selectedRow?.trajectory_filename.length > 0}
                onChange={(e) => {
                  setTrajectoryFilename(e.currentTarget.files);
                  setTrajectoryFilenameName(e.currentTarget.files[0].name);
                  field.onChange(e);
                }}
                accept=".csv"
              />
            )}
          />
        </div>
      )}
      <div className="d-flex mt-5">
        <Button
          variant="skdf-stroke"
          className="d-inline-flex justify-content-center w-100 align-items-center me-4"
          onClick={() => {
            onClose();
          }}
        >
          Вернуться к таблице
        </Button>
        <Button
          variant="skdf-primary"
          className="d-inline-flex justify-content-center w-100 align-items-center"
          type="submit"
          // disabled={!isValid}
        >
          Сохранить
        </Button>
      </div>
    </form>
  );
};

export default LidarForm;
