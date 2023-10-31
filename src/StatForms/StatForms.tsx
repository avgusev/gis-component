import React, { useState, useEffect, useRef, FC } from 'react';
import { StatFormsTypes } from './StatForms.types';
import { toast, ToastContainer } from 'react-toastify';
import './StatForms.scss';
import { statFormMeta } from './table_template';

const StatForms: FC<StatFormsTypes> = ({ userAuth }) => {
  const getHeader = () => {
    try {
      const rows = [];
      for (let i = 1; i <= statFormMeta.HEADER.HEADER_ROWS; i++) {
        const colsFilterByRow = statFormMeta.HEADER.HEADERS.filter((item) => item?.HEADER_GRID[0] === i);
        const col = colsFilterByRow.map((item) => {
          return (
            <th
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
      const headerCols = statFormMeta.COLUMNS.COLUMN_LABELS.map((col) => {
        return (
          <th key={col} colSpan={1} rowSpan={1}>
            {col}
          </th>
        );
      });
      rows.push(headerCols);
      return (
        <thead>
          {rows.map((row, index) => {
            return <tr key={`tr_${index}`}>{row.map((col) => col)}</tr>;
          })}
        </thead>
      );
    } catch (error) {
      console.log('Ошибка при построении заголовка таблицы', error);
    }
  };

  // @ts-ignore
  return (
    <div className="StatFormsContainer">
      <div className="Container">
        Статистическая отчетность
        <div style={{ padding: '20px' }}>
          <table className="table table-sticky-header table-bordered table-hover">
            {getHeader()}
            <tbody></tbody>
          </table>
        </div>
        {/* <div style={{ padding: '20px' }}>
          <table className="table table-sticky-header table-bordered table-hover">
            <thead>
              <tr>
                <th rowSpan={4}>Показатель</th>
                <th rowSpan={4}>N строки</th>
                <th colSpan={5}>Заголовок 3</th>
                <th rowSpan={4}>ОКЕИ</th>
              </tr>
              <tr>
                <th colSpan={3}>Заголовок 4</th>
                <th rowSpan={2} colSpan={2}>
                  Заголовок 9
                </th>
              </tr>
              <tr>
                <th colSpan={2}>Заголовок 5</th>
                <th rowSpan={2}>Заголовок 8</th>
              </tr>
              <tr>
                <th>Заголовок 6</th>
                <th>Заголовок 7</th>
                <th>Заголовок 10</th>
                <th>Заголовок 11</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A</td>
                <td>Б</td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>Х</td>
              </tr>
            </tbody>
          </table>
        </div> */}
        {/* <div className="grid-container">
          <div className="item1">Показатель</div>
          <div className="item2">N строки</div>
          <div className="item3">Заголовок 3</div>
          <div className="item4">Заголовок 4</div>
          <div className="item5">Заголовок 5</div>
          <div className="item6">Заголовок 6</div>
          <div className="item7">Заголовок 7</div>
          <div className="item8">Заголовок 8</div>
          <div className="item9">Заголовок 9</div>
          <div className="item10">Заголовок 10</div>
          <div className="item11">Заголовок 11</div>
          <div className="item12">Океи</div>
        </div> */}
      </div>
    </div>
  );
};

export default StatForms;
