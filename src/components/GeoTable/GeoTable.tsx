import React from 'react';
import { GeoTableProps } from './GeoTable.types';
import './GeoTable.scss';

const headerRow = (arr: any, rowSpan, level, columnFocus) => {
  const result: any = [];
  const tr: any = [];
  let childrenArr = [];

  if (arr?.length > 0) {
    arr.forEach((node, index) => {
      tr.push(
        <th
          key={index}
          scope="col"
          colSpan={node?.colspan || 1}
          rowSpan={node?.children ? 1 : rowSpan}
          style={{ borderRight: '1px solid #E5E7E8', borderTop: '1px solid #E5E7E8', whiteSpace: 'normal' }}
          className={`${columnFocus[index] ? columnFocus[index] : ''} table-w100`}
          children={node.title}
        />
      );
      if (node?.children) {
        node?.children.forEach((node) => {
          childrenArr.push(node);
        });
      }
    });

    result.push(<tr>{...tr}</tr>);
    result.push(...headerRow(childrenArr, rowSpan, level + 1, columnFocus));
  }

  return result;
};

const GeoTable = ({
  header,
  ids = [],
  columnAlign = [],
  columnFocus = [],
  rows,
  columnWidth = [],
  isSingleHeader = false,
  trHandleClick = () => {},
}: GeoTableProps) => {
  return (
    <div className="table-responsive mt-4">
      <table id="diag_export" className="table skdf table-sticky-header table-hover text-nowrap">
        <thead>
          {isSingleHeader ? (
            <tr>
              {header.map((cell, index) => (
                <th key={`${index}_s`} scope="col" className={`p-2 ${columnAlign[index]} ${columnFocus[index]} ${columnWidth[index]}`}>
                  <div className={`p-0  ${header.length - 1 === index ? 'GeoTable-th' : 'GeoTable-th GeoTable-th-border'}`}>{cell}</div>
                </th>
              ))}
            </tr>
          ) : (
            headerRow(header?.columns, header?.rowspan, 1, columnFocus)
          )}
        </thead>
        <tbody>
          {rows.length === 0 && (
            <div
              style={{ position: 'absolute', top: '0', bottom: '0', left: '0', right: ' 0', margin: '0' }}
              className="GeoTable__noData d-flex justify-content-center align-items-center"
            >
              Нет данных
            </div>
          )}
          {rows.map((row, index) => (
            <tr key={`${index}_r`} id={String(ids[index])} onClick={trHandleClick} className="GeoTable-tr">
              {row.map((cell, index) => (
                <td key={`${index}_c`} className={`${typeof cell === 'number' ? 'text-end' : ''} ${columnFocus[index]}`}>
                  {typeof cell === 'boolean' ? (cell === true ? 'да' : 'нет') : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GeoTable;
