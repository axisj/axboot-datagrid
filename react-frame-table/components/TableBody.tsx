import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import TableColGroup from './TableColGroup';
import { getCellValue } from '../utils';

function TableBody() {
  const scrollTop = useAppStore(s => s.scrollTop);
  const itemHeight = useAppStore(s => s.itemHeight);
  const itemPadding = useAppStore(s => s.itemPadding);
  const trHeight = itemHeight + itemPadding * 2 + 1;
  const displayItemCount = useAppStore(s => s.displayItemCount);
  const data = useAppStore(s => s.data);
  const columns = useAppStore(s => s.columns);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);

  const startIdx = Math.floor(scrollTop / trHeight);
  const endNumber = startIdx + displayItemCount > data.length ? data.length : startIdx + displayItemCount;

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
              {columns.slice(frozenColumnIndex).map((column, idx) => {
                return <td key={idx}>{getCellValue(column, item)}</td>;
              })}
              <td />
            </TableBodyTr>
          );
        })}
      </tbody>
    </BodyTable>
  );
}

export const BodyTable = styled.table`
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

export const TableBodyTr = styled.tr<{ itemHeight: number; itemPadding: number }>`
  > td {
    line-height: ${p => p.itemHeight}px; // - border
    padding: ${p => p.itemPadding}px 6.5px;
  }
`;

export default TableBody;
