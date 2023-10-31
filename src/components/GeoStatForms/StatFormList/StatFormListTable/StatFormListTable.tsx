import React, { useEffect, useState } from 'react';
import GeoTable from '../../../GeoTable/GeoTable';
import GeoStatus from '../../../GeoStatus/GeoStatus';
import { setReportCode } from '../../../../reducers/statForm.reducer';
import { useAppDispatch, useAppSelector } from '../../../../config/store';
import { reportsList, formsList } from '../../StatFormPage/forms.mock';

// const tableData = [
//   [
//     'Мониторинг Республики Мордовия 1 квартал 2019 г.',
//     'Республики Мордовия',
//     '2019',
//     '1 квартал',
//     'Агапов Виктор Михайлович',
//     <GeoStatus text="Отклонен" color="red" />,
//     '03.11.2020 в 15:50',
//   ],
//   [
//     'Мониторинг Краснодарский край 2007 год',
//     'Краснодарский край',
//     '2007',
//     '2 квартал',
//     'Антонов Марк Иванович',
//     <GeoStatus text="На проверке" color="yellow" />,
//     '03.11.2020 в 15:50',
//   ],
//   [
//     'Мониторинг Республики Мордовия 1 квартал 2019 г.',
//     'Республики Мордовия',
//     '2019',
//     '1 квартал',
//     'Агапов Виктор Михайлович',
//     <GeoStatus text="Проверен" color="green" />,
//     '03.11.2020 в 15:50',
//   ],
//   [
//     'Мониторинг Краснодарский край 2007 год',
//     'Краснодарский край',
//     '2007',
//     '2 квартал',
//     'Антонов Марк Иванович',
//     <GeoStatus text="На проверке" color="yellow" />,
//     '03.11.2020 в 15:50',
//   ],
//   [
//     'Мониторинг Краснодарский край 2007 год',
//     'Краснодарский край',
//     '2007',
//     '2 квартал',
//     'Антонов Марк Иванович',
//     <GeoStatus text="Проект" color="grey" />,
//     '03.11.2020 в 15:50',
//   ],
// ];

const tableHeaders = ['Наименование', 'Субъект', 'Год', 'Период', 'Ответственный', 'Статус', 'Дата изменения статуса'];
// const tableRowsIds = [1, 2, 3, 4, 5];

const StatFormListTable = ({ routerRest }) => {
  const dispatch = useAppDispatch();
  const formCode: any = useAppSelector((state) => state.statForm.selectedFormCode);
  const [tableRowsIds, setTableRowsIds] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (formCode) {
      const data = reportsList.filter((report) => {
        return report.CODE.toLowerCase() === formsList[formCode].code.toLowerCase();
      });
      const ids = [];
      const preparedData = [];
      data.forEach((item) => ids.push(item.ID));
      setTableRowsIds(ids);
      data.forEach((item) =>
        preparedData.push([
          item.CAPTION,
          item.REGION,
          String(item.YEAR),
          item.QUARTER,
          item.RESPONDER,
          <GeoStatus text={item.STATUS} color="red" />,
          item.STATUS_CHANGED,
        ])
      );

      setTableData(preparedData);
    }
  }, [formCode]);

  return (
    <GeoTable
      ids={tableRowsIds}
      columnAlign={[]}
      isSingleHeader
      columnFocus={[]}
      columnWidth={['w200', 'w200', 'w200', 'w200', 'w200', 'w200', 'w200', 'w200']}
      rows={tableData}
      header={tableHeaders}
      trHandleClick={(event) => {
        const currentRowData = reportsList.find((item) => item.ID === +event.currentTarget.id);
        routerRest.history.push({
          pathname: `${routerRest.location.pathname}/${event.currentTarget.id}/${currentRowData.CHAPTERS[0].ID}`,
          state: undefined,
        });
        dispatch(setReportCode(event.currentTarget.id));
      }}
    />
  );
};

export default StatFormListTable;
