import { AXFDGColumn, AXFDGRowChecked } from '../types';

interface Props<T> {
  rowChecked?: AXFDGRowChecked;
  itemHeight: number;
  frozenColumnIndex: number;
  columns: AXFDGColumn<T>[];
}

export function getFrozenColumnsWidth<T>({ rowChecked, itemHeight, frozenColumnIndex, columns }: Props<T>) {
  let frozenColumnsWidth: number = 0;
  if (!!rowChecked) {
    frozenColumnsWidth += Math.min(itemHeight, 15) + 7 * 2;
  }
  if (frozenColumnIndex > 0) {
    frozenColumnsWidth += columns.slice(0, frozenColumnIndex).reduce((acc, cur) => {
      return acc + (cur.width ?? 0);
    }, 0);
  }
  return frozenColumnsWidth;
}
