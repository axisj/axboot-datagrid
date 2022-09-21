import * as React from 'react';
import { useAppStore } from '../store';

interface Props {}

function TableColGroupFrozen(props: Props) {
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const checkboxHeight = useAppStore(s => Math.min(15, s.itemHeight));
  const rowSelectionWidth = checkboxHeight + 7 * 2 + 1;
  const columns = useAppStore(s => s.columns);
  const hasRowSelection = useAppStore(s => !!s.rowSelection);

  return (
    <colgroup>
      {hasRowSelection && <col width={rowSelectionWidth} />}
      {columns.slice(0, frozenColumnIndex).map((column, index) => (
        <col key={index} width={column.width} />
      ))}
    </colgroup>
  );
}

export default TableColGroupFrozen;
