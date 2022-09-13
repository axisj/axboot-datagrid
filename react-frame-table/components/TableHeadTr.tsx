import * as React from 'react';
import RowSelector from './RowSelector';
import { useAppStore } from '../store';

function TableHeadTr() {
  const hasRowSelection = useAppStore(s => !!s.rowSelection);
  const columns = useAppStore(s => s.columns);

  return (
    <tr>
      {hasRowSelection && (
        <td>
          <RowSelector />
        </td>
      )}
      {columns.map((column, index) => (
        <td key={index}>{column.label}</td>
      ))}
      <td />
    </tr>
  );
}

export default TableHeadTr;
