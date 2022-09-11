import * as React from 'react';
import styled from '@emotion/styled';
import TableHead from './TableHead';
import TableBody from './TableBody';
import { useAppStore } from '../store';

function Table() {
  const [width, height, containerBorderWidth, className] = useAppStore(s => [
    s.width,
    s.height,
    s.containerBorderWidth,
    s.className,
  ]);

  return (
    <Container
      role={'react-frame-table'}
      style={{ width, height, borderWidth: `${containerBorderWidth}px` }}
      className={className}
    >
      <TableHead />
      <TableBody />
    </Container>
  );
}

const Container = styled.div`
  border-color: var(--rft-border-color-base);
  border-style: solid;
  box-sizing: border-box;
  position: relative;
`;

export default Table;
