import { RFTableColumn, RFTableRowSelection } from '../types';

interface Props<T> {
  rowSelection?: RFTableRowSelection;
  itemHeight: number;
  itemPadding: number;
  frozenColumnIndex: number;
  columns: RFTableColumn<T>[];
}

export function getFrozenColumnsWidth<T>({
  rowSelection,
  itemHeight,
  itemPadding,
  frozenColumnIndex,
  columns,
}: Props<T>) {
  let frozenColumnsWidth: number = 0;
  if (!!rowSelection) {
    frozenColumnsWidth += itemHeight + itemPadding * 2;
  }
  if (frozenColumnIndex > 0) {
    frozenColumnsWidth += columns.slice(0, frozenColumnIndex).reduce((acc, cur) => {
      return acc + (cur.width ?? 0);
    }, 0);
  }
  return frozenColumnsWidth;
}
