import * as React from 'react';
import { useAppStore } from '../store';
import styled from '@emotion/styled';
import TableColGroup from './TableColGroup';

function TableHead() {
  const headerHeight = useAppStore(s => s.headerHeight);
  const columns = useAppStore(s => s.columns);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);

  return (
    <HeadTable height={headerHeight - 1}>
      <TableColGroup />
      <tbody>
        <tr>
          {columns.slice(frozenColumnIndex).map((column, index) => (
            <td key={index}>{column.label}</td>
          ))}
          <td />
        </tr>
      </tbody>
    </HeadTable>
  );
}

export const HeadTable = styled.table<{ height: number }>`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  > tbody > tr {
    height: ${p => p.height}px;

    > td {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 0 7px;
    }
  }
`;

export default TableHead;
