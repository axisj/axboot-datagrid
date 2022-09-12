import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import RowSelector from './RowSelector';

interface Props {}

function TableBodyTr(props: Props) {
  const trHeight = useAppStore(s => s.trHeight);
  const columns = useAppStore(s => s.columns);
  const hasRowSelection = useAppStore(s => !!s.rowSelection);

  return (
    <Container trHeight={trHeight}>
      {hasRowSelection && (
        <td>
          <RowSelector />
        </td>
      )}
      {columns.map((column, idx) => (
        <td key={idx}>{column.key}</td>
      ))}
      <td />
    </Container>
  );
}

const Container = styled.tr<{ trHeight: number }>`
  height: ${p => p.trHeight}px;
`;

export default TableBodyTr;
