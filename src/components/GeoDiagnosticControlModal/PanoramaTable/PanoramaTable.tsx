import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { pgApiUrl, commandSchemaHeader } from '../../../config/constants';
import { PanoramaTableProps } from './PanoramaTable.types';
import GeoTable from '../../GeoTable/GeoTable';
import './PanoramaTable.scss';
import { cutString } from '../../../features/cutString';
import GeoIconButton from '../../GeoIconButton';
import PanoramaForm from '../PanoramaForm/PanoramaForm';
import { getCommandFile } from '../../../features/getCommandFile';
import { useAppSelector } from '../../../config/store';

const PanoramaTable = ({ idRoad, idPart }: PanoramaTableProps) => {
  const [tableRows, setTableRows] = useState([]);
  const [isUpdateRow, setIsUpdateRow] = useState<boolean>(false);
  const [isUpdateTable, setIsUpdateTable] = useState(false);
  const [isCreateRow, setIsCreateRow] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [firstRange, setFirstRange] = useState('');
  const [secondRange, setSecondRange] = useState('');
  const [isCommandFileLoading, setIsCommandFileLoading] = useState<boolean>(false);
  const columnAlign = ['', '', '', '', '', ''];
  const columnFocus = ['table-focus', '', 'table-focus', '', 'table-focus', '', 'table-focus'];
  const columnWidth = ['', '', '', '', '', ''];
  const headerCells = [
    'Действия',
    'Название',
    'Начало, (км+м)',
    'Конец, (км+м)',
    'Входная директория',
    <div className="d-flex justify-content-between">
      <span>Файл траектории</span>
      <GeoIconButton
        iconType="plus"
        isTransparent
        handleClick={() => {
          setIsCreateRow(true);
          setFirstRange('');
          setSecondRange('');
        }}
      />
    </div>,
  ];
  const passId = useAppSelector((state) => state.roadPass.selected?.id);

  const getDiagPanoSheet = () => {
    const preparedData = { data: { passport_id: passId, diag_type_id: 1 } };
    axios
      .post(`${pgApiUrl}/rpc/get_diag_sheet`, preparedData, commandSchemaHeader)
      .then((response) => {
        const row = [];
        if (response?.data) {
          response.data.map((item: any) => {
            const rowChild: JSX.Element[] = [
              <div className="PanoramaTable__actions">
                <GeoIconButton
                  iconType="cog"
                  isTransparent
                  handleClick={() => {
                    setIsUpdateRow(true);
                    setSelectedRow(item);
                    setFirstRange(item.km_start);
                    setSecondRange(item.km_finish);
                  }}
                />

                <div onClick={() => getCommandFile(item.id, setIsCommandFileLoading)}>
                  <GeoIconButton
                    iconType="upload"
                    isTransparent
                    handleClick={() => {
                      getCommandFile(item.id, (e) => {
                        setIsCommandFileLoading(e);
                      });
                    }}
                  />
                </div>
              </div>,
            ];
            for (let key in item) {
              if (key === 'name') rowChild[1] = item[key];
              if (key === 'km_start') rowChild[2] = item[key];
              if (key === 'km_finish') rowChild[3] = item[key];
              if (key === 'src_path') rowChild[4] = item[key]?.length ? <span>{cutString(item[key], 38)}</span> : null;
              if (key === 'trajectory_filename') rowChild[6] = item[key]?.length ? <span>{cutString(item[key], 30)}</span> : null;
            }

            row.push(rowChild);
          });
        }

        setTableRows(row);
        setIsUpdateTable(false);
      })
      .catch((error) => {
        setIsUpdateTable(false);
        console.error(`Ошибка получении данных getDiagPanoSheet: ${error}`);
      });
  };

  useEffect(() => {
    if (passId) {
      getDiagPanoSheet();
    }
  }, [passId]);

  useEffect(() => {
    if (isUpdateTable) {
      getDiagPanoSheet();
    }
  }, [isUpdateTable]);

  return isUpdateRow || isCreateRow ? (
    <PanoramaForm
      isCreateRow={isCreateRow}
      selectedRow={selectedRow}
      firstRange={firstRange}
      secondRange={secondRange}
      idRoad={idRoad}
      idPart={idPart}
      passId={passId}
      onClose={() => {
        setIsUpdateRow(false);
        setIsCreateRow(false);
        setIsUpdateTable(true);
      }}
    />
  ) : (
    <>
      <GeoTable
        columnAlign={columnAlign}
        columnFocus={columnFocus}
        columnWidth={columnWidth}
        isSingleHeader
        rows={tableRows}
        header={headerCells}
      />
    </>
  );
};

export default PanoramaTable;
