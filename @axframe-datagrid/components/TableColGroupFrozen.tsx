import * as React from 'react';
import { useAppStore } from '../store';

interface Props {}

function TableColGroupFrozen(props: Props) {
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const checkboxHeight = useAppStore(s => Math.min(15, s.itemHeight));

  const rowCheckboxWidth = checkboxHeight + 7 * 2;
  const columns = useAppStore(s => s.columns);
  const hasRowChecked = useAppStore(s => !!s.rowChecked);

  return (
    <colgroup>
      {hasRowChecked && <col width={rowCheckboxWidth} />}
      {columns.slice(0, frozenColumnIndex).map((column, index) => (
        <col key={index} width={column.width} />
      ))}
    </colgroup>
  );
}

export default TableColGroupFrozen;
