import { AXDGColumn, AXDGRowChecked } from '../types';
import { getLineNumberWidth } from './getLineNumber';

interface Props<T> {
  showLineNumber?: boolean;
  rowChecked?: AXDGRowChecked<T>;
  itemHeight: number;
  frozenColumnIndex: number;
  columns: AXDGColumn<T>[];
  dataLength: number;
}

export function getFrozenColumnsWidth<T>({
  showLineNumber,
  rowChecked,
  itemHeight,
  frozenColumnIndex,
  columns,
  dataLength,
}: Props<T>) {
  let frozenColumnsWidth: number = 0;
  if (showLineNumber) {
    frozenColumnsWidth += getLineNumberWidth({ dataLength });
  }
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
