import * as React from 'react';
import RowSelector from './RowSelector';
import { getCellValue } from '../utils';
import { BodyTable, TableBodyTr } from './TableBody';
import { useAppStore } from '../store';
import TableColGroupFrozen from './TableColGroupFrozen';
import styled from '@emotion/styled';

interface Props {}

function TableBodyFrozen(props: Props) {
  const scrollTop = useAppStore(s => s.scrollTop);
  const itemHeight = useAppStore(s => s.itemHeight);
  const itemPadding = useAppStore(s => s.itemPadding);
  const trHeight = itemHeight + itemPadding * 2 + 1;
  const displayItemCount = useAppStore(s => s.displayItemCount);
  const data = useAppStore(s => s.data);
  const selectedKeyMap = useAppStore(s => s.selectedIdsMap);
  const setSelectedKeys = useAppStore(s => s.setSelectedIds);
  const selectedAll = useAppStore(s => s.selectedAll);
  const hasRowSelection = useAppStore(s => !!s.rowSelection);
  const columns = useAppStore(s => s.columns);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);

  const startIdx = Math.floor(scrollTop / trHeight);
  const endNumber = startIdx + displayItemCount > data.length ? data.length : startIdx + displayItemCount;

  const handleChangeChecked = React.useCallback(
    (itemIndex: number, checked: boolean) => {
      if (checked) {
        selectedKeyMap.set(itemIndex, true);
      } else {
        selectedKeyMap.delete(itemIndex);
      }
      setSelectedKeys([...selectedKeyMap.keys()]);
    },
    [selectedKeyMap, setSelectedKeys],
  );

  return (
    <BodyTable>
      <TableColGroupFrozen />
      <tbody>
        {Array.from({ length: endNumber - startIdx }, (_, i) => {
          const ri = startIdx + i;
          const item = data[ri];
          if (!item) {
            return null;
          }

          return (
            <TableBodyTr key={ri} itemHeight={itemHeight} itemPadding={itemPadding}>
              {hasRowSelection && (
                <td>
                  <RowSelector
                    checked={selectedAll === true || selectedKeyMap.get(ri)}
                    handleChange={checked => handleChangeChecked(ri, checked)}
                  />
                </td>
              )}
              {columns.slice(0, frozenColumnIndex).map((column, idx) => {
                return <td key={idx}>{getCellValue(column, item)}</td>;
              })}
            </TableBodyTr>
          );
        })}
      </tbody>
    </BodyTable>
  );
}

export default TableBodyFrozen;
