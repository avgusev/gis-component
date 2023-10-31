import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { commandSchemaHeader, pgApiUrl } from '../../../config/constants';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import GeoIconButton from '../../GeoIconButton';
import GeoTable from '../../GeoTable/GeoTable';
import './GeoDiagInterfaceTable.scss';

const GeoDiagInterfaceTable = ({
  selectedType,
  isRefresh,
  setIsRefresh,
  // tableDescription,
  sheetId,
}) => {
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(3);
  const tableRowsPerPage: number = useAppSelector((state) => state.roadPass.defaultTableRows);

  // const getDiagTableData = async (src, page) => {
  //   setTableData([]);
  //   const offset = page === 1 ? 0 : (page - 1) * 10;
  //   const header = diagSchemaHeaders;
  //   header.headers['Prefer'] = 'count=exact';
  //   try {
  //     const response = await axios.get(`${pgApiUrl}/${src}?limit=10&offset=${offset}&diag_sheet_id=eq.${sheetId}`, header);
  //     if (response?.data) {
  //       // const row = [];
  //       // if (response?.data?.length > 0) {
  //       //   response?.data.map((item: any) => {
  //       //     const rowChild = [
  //       //     ];
  //       //     Object.keys(tableDescription.keys).forEach((key, index) => {
  //       //       rowChild[index] = item[key];
  //       //     });

  //       //     row.push(rowChild);
  //       //   });
  //       // }
  //       setTableData(response?.data?.data || []);
  //       setTableHeaders(response?.data?.header || []);
  //       setTotalPagesCount(Math.ceil(Number(response.headers['content-range'].split('/')?.[1]) / 10));
  //     }
  //   } catch (error) {
  //     console.error('Ошибка при получении данных таблицы', error);
  //   }
  // };

  const getDiagTableData = async (sheetId, page, rowsPerPage) => {
    setTableData([]);
    const offset = page === 1 ? 0 : (page - 1) * 10;
    const header = commandSchemaHeader;
    // header.headers['Prefer'] = 'count=exact';
    const data = {
      data: {
        diag_sheet: sheetId,
        page_size: rowsPerPage,
        page_num: currentPage,
        lanes_enum: 0,
      },
    };
    try {
      const response = await axios.post(`${pgApiUrl}/rpc/get_diag_sheet_data`, data, header);
      if (response?.data) {
        // const row = [];
        // if (response?.data?.length > 0) {
        //   response?.data.map((item: any) => {
        //     const rowChild = [
        //     ];
        //     Object.keys(tableDescription.keys).forEach((key, index) => {
        //       rowChild[index] = item[key];
        //     });

        //     row.push(rowChild);
        //   });
        // }
        setTableData(response?.data?.data || []);
        setTableHeaders(response?.data?.header || []);
        setTotalPagesCount(response?.data?.pages_count);
        // setTotalPagesCount(Math.ceil(Number(response.headers['content-range'].split('/')?.[1]) / 10));
      }
    } catch (error) {
      console.error('Ошибка при получении данных таблицы', error);
    }
  };

  useEffect(() => {
    if (selectedType?.src_table && sheetId) {
      getDiagTableData(sheetId, currentPage, tableRowsPerPage);
      console.log('SheetId: ', sheetId);
    }
  }, [selectedType, sheetId, currentPage, tableRowsPerPage]);

  useEffect(() => {
    if (isRefresh && selectedType?.src_table && sheetId) {
      getDiagTableData(sheetId, currentPage, tableRowsPerPage);
      setIsRefresh(false);
    }
  }, [isRefresh, selectedType, sheetId, currentPage, tableRowsPerPage]);

  return (
    <div style={{ paddingLeft: '20px' }}>
      {sheetId && (
        <>
          <div className="GeoDiagInterfaceTable__title">{selectedType?.name || 'Нет названия'}</div>
          <GeoTable
            columnAlign={[]}
            columnFocus={[]}
            columnWidth={['w200', 'w200', 'w200', 'w200', 'w200', 'w200', 'w200', 'w200']}
            rows={tableData}
            header={tableHeaders}
          />
          <hr />
          <div className="GeoPagination__container">
            <GeoIconButton
              iconType="arrow-left"
              isTransparent
              isDisabled={currentPage === 1}
              handleClick={() => {
                setCurrentPage((prevValue) => {
                  if (prevValue === 1) return 1;
                  return prevValue - 1;
                });
              }}
            />

            <span className="GeoPagination__info">{`${currentPage} - ${totalPagesCount}`}</span>

            <GeoIconButton
              iconType="arrow-right"
              isDisabled={currentPage >= totalPagesCount}
              isTransparent
              handleClick={() => {
                setCurrentPage((prevValue) => prevValue + 1);
              }}
            />
          </div>
          <hr />
        </>
      )}
    </div>
  );
};

export default GeoDiagInterfaceTable;
