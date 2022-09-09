import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';

interface Props {}

function TableHead(props: Props) {
  const columns = useAppStore(s => s.columns);
  const headerHeight = useAppStore(s => s.headerHeight);

  return (
    <Container style={{ height: headerHeight }}>
      {columns.map((column, index) => (
        <span key={index}>{column.label}</span>
      ))}
    </Container>
  );
}

const Container = styled.div`
  background: #eee;
`;

export default TableHead;
