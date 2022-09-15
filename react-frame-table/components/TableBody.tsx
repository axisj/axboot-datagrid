import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import TableColGroup from './TableColGroup';
import RowSelector from './RowSelector';

function TableBody() {
  const scrollTop = useAppStore(s => s.scrollTop);
  const itemHeight = useAppStore(s => s.itemHeight);
  const itemPadding = useAppStore(s => s.itemPadding);
  const trHeight = itemHeight + itemPadding * 2;
  const displayItemCount = useAppStore(s => s.displayItemCount);
  const data = useAppStore(s => s.data);
  const selectedKeyMap = useAppStore(s => s.selectedIdsMap);
  const setSelectedKeys = useAppStore(s => s.setSelectedIds);
  const selectedAll = useAppStore(s => s.selectedAll);
  const columns = useAppStore(s => s.columns);
  const hasRowSelection = useAppStore(s => !!s.rowSelection);

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
      <TableColGroup />
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
                <SelectorTd>
                  <RowSelector
                    checked={selectedAll === true || selectedKeyMap.get(ri)}
                    handleChange={checked => handleChangeChecked(ri, checked)}
                  />
                </SelectorTd>
              )}
              {columns.map((column, idx) => {
                let cellValue: any;
                if (column.itemRender) {
                  cellValue = column.itemRender(item.values);
                } else if (Array.isArray(column.key)) {
                  cellValue = column.key.reduce((acc, cur) => {
                    if (!acc) return acc;
                    if (acc[cur]) return acc[cur];
                    return acc;
                  }, item.values);
                } else {
                  cellValue = item.values[column.key];
                }
                return <td key={idx}>{cellValue}</td>;
              })}
              <td />
            </TableBodyTr>
          );
        })}
      </tbody>
    </BodyTable>
  );
}

const BodyTable = styled.table`
  position: absolute;
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  > tbody > tr {
    border-width: 1px;
    border-style: solid;
    border-color: var(--rft-border-color-base);
    border-top: 0 none;
    border-left: 0 none;
    border-right: 0 none;

    > td {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
`;

const TableBodyTr = styled.tr<{ itemHeight: number; itemPadding: number }>`
  > td {
    line-height: ${p => p.itemHeight}px;
    padding-top: ${p => p.itemPadding}px;
    padding-bottom: ${p => p.itemPadding}px;
  }
`;
const SelectorTd = styled.td``;

export default TableBody;
