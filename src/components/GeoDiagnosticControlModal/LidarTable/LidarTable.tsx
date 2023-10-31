import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { pgApiUrl, commandSchemaHeader } from '../../../config/constants';
import GeoTable from '../../GeoTable/GeoTable';
import { LidarTableProps } from './LidarTable.types';
import './LidarTable.scss';
import { cutString } from '../../../features/cutString';
import LidarForm from '../LidarForm/LidarForm';
import GeoIconButton from '../../GeoIconButton';
import { getCommandFile } from '../../../features/getCommandFile';
import { useAppSelector } from '../../../config/store';

const LidarTable = ({ idRoad, idPart }: LidarTableProps) => {
  const [tableRows, setTableRows] = useState([]);
  const [isUpdateRow, setIsUpdateRow] = useState(false);
  const [isUpdateTable, setIsUpdateTable] = useState(false);
  const [isCreateRow, setIsCreateRow] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [firstRange, setFirstRange] = useState('');
  const [secondRange, setSecondRange] = useState('');
  const [isCommandFileLoading, setIsCommandFileLoading] = useState<boolean>(false);
  const columnAlign = ['', '', '', '', '', '', ''];
  const columnFocus = ['table-focus', '', 'table-focus', '', 'table-focus', '', 'table-focus'];
  const columnWidth = ['', '', '', '', '', '', ''];
  const headerCells = [
    'Действия',
    'Название',
    'Начало, (км+м)',
    'Конец, (км+м)',
    'Исходный файл',
    'Целевая папка',
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
    const preparedData = { data: { passport_id: passId, diag_type_id: 2 } };
    axios
      .post(`${pgApiUrl}/rpc/get_diag_sheet`, preparedData, commandSchemaHeader)
      .then((response) => {
        const row = [];
        if (response?.data) {
          response.data.map((item: any) => {
            const rowChild = [
              <div className="LidarTable__actions">
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

                <GeoIconButton
                  iconType="upload"
                  isTransparent
                  handleClick={() => {
                    getCommandFile(item.id, (e) => {
                      setIsCommandFileLoading(e);
                    });
                  }}
                />
              </div>,
            ];
            for (let key in item) {
              if (key === 'name') rowChild[1] = item[key];
              if (key === 'km_start') rowChild[2] = item[key];
              if (key === 'km_finish') rowChild[3] = item[key];
              if (key === 'src_path') rowChild[4] = item[key]?.length ? <span>{cutString(item[key], 30)}</span> : null;
              if (key === 'dest_path') rowChild[5] = item[key]?.length ? <span>{cutString(item[key], 30)}</span> : null;

              if (key === 'trajectory_filename') rowChild[6] = item[key]?.length ? <span>{cutString(item[key], 38)}</span> : null;
            }

            row.push(rowChild);
          });
        }
        setTableRows(row);
        setIsUpdateTable(false);
      })
      .catch((error) => {
        console.error(`Ошибка получении данных getDiagPanoSheet: ${error}`);
        setIsUpdateTable(false);
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
    <LidarForm
      idRoad={idRoad}
      idPart={idPart}
      isCreateRow={isCreateRow}
      selectedRow={selectedRow}
      firstRange={firstRange}
      secondRange={secondRange}
      passId={passId}
      onClose={() => {
        setIsUpdateRow(false);
        setIsCreateRow(false);
        setIsUpdateTable(true);
      }}
    />
  ) : (
    <GeoTable
      columnAlign={columnAlign}
      columnFocus={columnFocus}
      isSingleHeader
      columnWidth={columnWidth}
      rows={tableRows}
      header={headerCells}
    />
  );
};

export default LidarTable;
