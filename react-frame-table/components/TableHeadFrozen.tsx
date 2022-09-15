import * as React from 'react';
import { useAppStore } from '../store';
import RowSelector from './RowSelector';
import TableColGroupFrozen from './TableColGroupFrozen';
import { HeadTable } from './TableHead';

interface Props {}

function TableHeadFrozen(props: Props) {
  const hasRowSelection = useAppStore(s => !!s.rowSelection);
  const headerHeight = useAppStore(s => s.headerHeight);
  const columns = useAppStore(s => s.columns);
  const selectedAll = useAppStore(s => s.selectedAll);
  const setSelectedAll = useAppStore(s => s.setSelectedAll);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);

  return (
    <HeadTable height={headerHeight - 1}>
      <TableColGroupFrozen />
      <tbody>
        <tr>
          {hasRowSelection && (
            <td>
              <RowSelector
                checked={selectedAll === true}
                indeterminate={selectedAll === 'indeterminate'}
                handleChange={checked => {
                  setSelectedAll(checked);
                }}
              />
            </td>
          )}
          {columns.slice(0, frozenColumnIndex).map((column, index) => (
            <td key={index}>{column.label}</td>
          ))}
        </tr>
      </tbody>
    </HeadTable>
  );
}

export default TableHeadFrozen;
