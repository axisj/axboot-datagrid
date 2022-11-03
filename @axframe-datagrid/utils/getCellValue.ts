import { AXFDGColumn, AXFDGDataItem } from '../types';

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
