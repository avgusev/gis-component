import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './StatFormPageTable.scss';
import { StatFormPageTableTypes } from './StatFormPageTable.types';
import { statFormMetaMock } from './table_template';

const StatFormPageTable = ({ routerRest, metaData }: StatFormPageTableTypes) => {
  const getHeader = (meta) => {
    try {
      const rows = [];
      for (let i = 1; i <= meta.HEADER.HEADER_ROWS; i++) {
        const colsFilterByRow = meta.HEADER.HEADERS.filter((item) => item?.HEADER_GRID[0] === i);
        const col = colsFilterByRow.map((item) => {
          return (
            <th
              style={{
                fontStyle: meta.HEADER.STYLE.FONT,
                fontSize: meta.HEADER.STYLE.SIZE,
                textAlign: meta.HEADER.STYLE.HOR_ALIGNMENT,
                verticalAlign: meta.HEADER.STYLE.VERT_ALINGMENT,
                fontWeight: 'bold',
              }}
              key={item.HEADER_ID.toString()}
              rowSpan={item.HEADER_GRID[2] - item.HEADER_GRID[0] + 1}
              colSpan={item.HEADER_GRID[3] - item.HEADER_GRID[1] + 1}
            >
              {item.HEADER_CAPTION}
            </th>
          );
        });
        rows.push(col);
      }
      // const headerCols = meta.COLUMNS.COLUMN_LABELS.map((col) => {
      //   return (
      //     <th key={col} colSpan={1} rowSpan={1}>
      //       {col}
      //     </th>
      //   );
      // });
      const headerCols = meta.COLUMNS.map((col) => {
        return (
          <th
            style={{
              fontStyle: meta.HEADER.STYLE.FONT,
              fontSize: meta.HEADER.STYLE.SIZE,
              textAlign: meta.HEADER.STYLE.HOR_ALIGNMENT,
              verticalAlign: meta.HEADER.STYLE.VERT_ALINGMENT,
              fontWeight: 'bold',
            }}
            key={`col_${col.COLUMN_ID}`}
            colSpan={1}
            rowSpan={1}
          >
            {col.COLUMN_NUM}
          </th>
        );
      });
      rows.push(headerCols);
      return (
        <thead className="StatFormPageTableHeader">
          {rows.map((row, index) => {
            return <tr key={`tr_${index}`}>{row.map((col) => col)}</tr>;
          })}
        </thead>
      );
    } catch (error) {
      console.log('Ошибка при построении заголовка таблицы', error);
    }
  };

  const getBody = (meta) => {
    try {
      const rows = [];

      return meta.ROWS.map((row, rowIndex, rowArray) => {
        let tr = <></>;
        // const filterRowBreaks = meta?.ROW_BREAKS.filter((item) => item?.ROW_BREAKS?.PREV_ROW === rowArray?.[rowIndex - 1]?.ROW_NUM)
        // if (filterRowBreaks && filterRowBreaks.length > 0) {
        //   tr = meta?.COLUMNS.map((col, colIndex, colArray) => {
        //     if (colIndex === meta?.COMMON?.ROW_CAPTION_COLUMN - 1) {
        //       <td>{filterRowBreaks?.[0]?.}</td>
        //     } else {
        //       <td></td>
        //     }
        //   });
        // }
        return (
          <>
            {tr}
            <tr>
              {meta?.COLUMNS.map((col, colIndex, colArray) => {
                let column = null;
                const data = meta?.DATA.filter((data) => data?.ROW_NUM === row?.ROW_NUM && data?.COLUMN_NUM === col?.COLUMN_NUM);
                if (colIndex === meta?.COMMON?.ROW_CAPTION_COLUMN - 1) {
                  column = (
                    <td
                      style={{
                        fontWeight: row.hasOwnProperty('STYLE') ? 'bold' : 'normal',
                        padding: `10px 10px 10px ${row?.INDENT * 10 + 10}px`,
                        maxWidth: col?.COLUMN_WIDTH_PX,
                        textAlign: col?.STYLE.HOR_ALIGNMENT,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {row?.ROW_CAPTION}
                    </td>
                  );
                } else if (colIndex === meta?.COMMON?.ROW_NUM_COLUMN - 1) {
                  column = <td style={{ maxWidth: col?.COLUMN_WIDTH_PX, textAlign: col?.STYLE?.HOR_ALIGNMENT }}>{row?.ROW_NUM}</td>;
                } else if (data.length > 0) {
                  column = (
                    <td style={{ maxWidth: col?.COLUMN_WIDTH_PX, textAlign: col?.STYLE?.HOR_ALIGNMENT }}>
                      {data[0].VALUE.toLocaleString().replace(',', '.')}
                    </td>
                  );
                } else {
                  column = <td></td>;
                }
                return column;
              })}
            </tr>
          </>
        );
      });
    } catch (error) {
      console.log('Ошибка при выводе значений формы!', error);
    }
  };

  return (
    <>
      <div className="StatFormPageTableContainer">
        <div className="Container">
          {metaData.CHAPTER}
          <Row>
            <Col>{metaData.EXECUTOR_ID}</Col>
            <Col>{metaData.PRE_HEADER.TEXT}</Col>
          </Row>
          <div style={{ padding: '0px' }} className="StatFormPageTable">
            <table className="table table-sticky-header table-bordered table-hover">
              {getHeader(metaData)}
              <tbody style={{ fontSize: metaData.COMMON.STYLE.FONT }}>{getBody(metaData)}</tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <div className="wrapper">
        <div className="box1 div-box">Показатель</div>
        <div className="box2 div-box">№ строки</div>
        <div className="box3 div-box">Заголовок 3</div>
        <div className="box4 div-box">Заголовок 4</div>
        <div className="box5 div-box">Заголовок 5</div>
        <div className="box6 div-box">Заголовок 6</div>
        <div className="box7 div-box">Заголовок 7</div>
        <div className="box8 div-box">Заголовок 8</div>
        <div className="box9 div-box">Заголовок 9</div>
        <div className="box10 div-box">Заголовок 10</div>
        <div className="box11 div-box">Заголовок 11</div>
        <div className="box12 div-box">Океи</div>
      </div>
      <div className="wrapper">
        <div className="row">A</div>
        <div className="row">B</div>
        <div className="row">1</div>
        <div className="row">2</div>
        <div className="row">3</div>
        <div className="row">4</div>
        <div className="row">5</div>
        <div className="row">X</div>
      </div> */}
    </>
  );
};

export default StatFormPageTable;
