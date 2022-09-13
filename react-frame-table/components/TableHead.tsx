import * as React from 'react';
import RowSelector from './RowSelector';
import { useAppStore } from '../store';
import styled from '@emotion/styled';
import TableColGroup from './TableColGroup';

function TableHead() {
  const hasRowSelection = useAppStore(s => !!s.rowSelection);
  const headerHeight = useAppStore(s => s.headerHeight);
  const columns = useAppStore(s => s.columns);

  return (
    <Table height={headerHeight - 1}>
      <TableColGroup />
      <tbody>
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
      </tbody>
    </Table>
  );
}

const Table = styled.table<{ height: number }>`
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
    }
  }
`;

export default TableHead;
