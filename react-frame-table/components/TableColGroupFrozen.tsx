import * as React from 'react';
import { useAppStore } from '../store';

interface Props {}

function TableColGroupFrozen(props: Props) {
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const itemHeight = useAppStore(s => s.itemHeight);
  const itemPadding = useAppStore(s => s.itemPadding);
  const trHeight = itemHeight + itemPadding * 2;
  const columns = useAppStore(s => s.columns);
  const hasRowSelection = useAppStore(s => !!s.rowSelection);

  return (
    <colgroup>
      {hasRowSelection && <col width={trHeight} />}
      {columns.slice(0, frozenColumnIndex).map((column, index) => (
        <col key={index} width={column.width} />
      ))}
    </colgroup>
  );
}

export default TableColGroupFrozen;
