import { AXFDGColumn, AXFDGDataItem, MoveDirection } from '../types';
import React from 'react';
import memoizee from 'memoizee';

function _getCellValue<T>(
  index: number,
  columnIndex: number,
  column: AXFDGColumn<T>,
  item: AXFDGDataItem<any>,
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
    return getCellValueByRowKey(column.key, item);
  }
}

function _getCellValueByRowKey<T>(rowKey: React.Key | React.Key[], item: AXFDGDataItem<any>) {
  if (Array.isArray(rowKey)) {
    return rowKey.reduce((acc, cur) => {
      if (!acc) return acc;
      if (acc[cur]) return acc[cur];
      return acc;
    }, item.values);
  } else {
    return item.values[rowKey];
  }
}

export const getCellValue = memoizee(_getCellValue, { length: 8 });
export const getCellValueByRowKey = memoizee(_getCellValueByRowKey, { length: 2 });
