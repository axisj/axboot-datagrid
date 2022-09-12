import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import TableColGroup from './TableColGroup';
import RowSelector from './RowSelector';

function TableHead() {
  const columns = useAppStore(s => s.columns);
  const headerHeight = useAppStore(s => s.headerHeight);
  const hasRowSelection = useAppStore(s => !!s.rowSelection);

  return (
    <Container style={{ height: headerHeight }}>
      <HeaderTable style={{ height: headerHeight - 1 }}>
        <TableColGroup />
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
      </HeaderTable>
    </Container>
  );
}

const Container = styled.div`
  background: var(--rft-header-bg);
  position: relative;
  min-width: 100%;
  left: 0;
  border-bottom: 1px solid var(--rft-border-color-base);
`;
const HeaderTable = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

export default TableHead;
