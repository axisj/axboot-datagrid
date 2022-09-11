import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';

interface Props {}

function TableHead(props: Props) {
  const columns = useAppStore(s => s.columns);
  const headerHeight = useAppStore(s => s.headerHeight);

  return (
    <Container style={{ height: headerHeight }}>
      <HeaderTable>
        <tr>
          {columns.map((column, index) => (
            <td key={index}>{column.label}</td>
          ))}
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
