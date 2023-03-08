import { AXFDGColumn, AXFDGDataItem, MoveDirection } from '../types';
import React from 'react';
import memoizee from 'memoizee';

function _getCellValue<T>(
  index: number,
  columnIndex: number,
  column: AXFDGColumn<T>,
  item: AXFDGDataItem<any>,
  valueByRowKey: any,
  handleSave?: (value: any, columnDirection?: MoveDirection, rowDirection?: MoveDirection) => void,
  handleCancel?: () => void,
  handleMove?: (columnDirection: MoveDirection, rowDirection: MoveDirection) => void,
  editable?: boolean,
) {
  if (column.itemRender) {
    const Render = column.itemRender;
    return (
      <Render
        item={item}
        values={item.values}
        value={valueByRowKey}
        column={column}
        index={index}
        columnIndex={columnIndex}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleMove={handleMove}
        editable={editable}
      />
    );
  } else {
    return valueByRowKey;
  }
}

export function getCellValueByRowKey<T>(rowKey: React.Key | React.Key[], values: T) {
  if (Array.isArray(rowKey)) {
    return rowKey.reduce((acc, cur) => {
      if (!acc) return acc;
      if (acc[cur]) return acc[cur];
      return acc;
    }, values as Record<string, any>);
  } else {
    return (values as Record<string, any>)[rowKey];
  }
}
//
export const getCellValue = memoizee(_getCellValue, { length: 9 });
