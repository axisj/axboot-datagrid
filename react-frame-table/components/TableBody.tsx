import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import TableColGroup from './TableColGroup';
import RowSelector from './RowSelector';

function TableBody() {
  const scrollTop = useAppStore(s => s.scrollTop);
  const trHeight = useAppStore(s => s.trHeight);
  const displayItemCount = useAppStore(s => s.displayItemCount);
  const data = useAppStore(s => s.data);
  const columns = useAppStore(s => s.columns);
  const hasRowSelection = useAppStore(s => !!s.rowSelection);

  const startIdx = Math.floor(scrollTop / trHeight);
  const endNumber = startIdx + displayItemCount > data.length ? data.length : startIdx + displayItemCount;

  return (
    <BodyTable trHeight={trHeight}>
      <TableColGroup />
      <tbody>
        {Array.from({ length: endNumber - startIdx }, (_, i) => {
          const ri = startIdx + i;
          const item = data[ri];
          if (!item) {
            return null;
          }

          return (
            <TableBodyTr key={ri}>
              {hasRowSelection && (
                <td>
                  <RowSelector />
                </td>
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

const BodyTable = styled.table<{ trHeight: number }>`
  position: absolute;
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  > tbody > tr {
    height: ${p => p.trHeight}px;

    > td {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom-style: solid;
      border-bottom-width: 1px;
      border-color: var(--rft-border-color-base);
    }
  }
`;

const TableBodyTr = styled.tr``;

export default TableBody;
