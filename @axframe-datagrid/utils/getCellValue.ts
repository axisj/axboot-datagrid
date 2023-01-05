import { AXFDGColumn, AXFDGDataItem } from '../types';
import React from 'react';

export function getCellValue<T>(column: AXFDGColumn<T>, item: AXFDGDataItem<any>) {
  if (column.itemRender) {
    return column.itemRender(item.values as T);
  } else if (Array.isArray(column.key)) {
    return column.key.reduce((acc, cur) => {
      if (!acc) return acc;
      if (acc[cur]) return acc[cur];
      return acc;
    }, item.values);
  } else {
    return item.values[column.key];
  }
}
export function getCellValueByRowKey<T>(rowKey: React.Key | React.Key[], item: AXFDGDataItem<any>) {
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
