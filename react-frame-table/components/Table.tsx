import * as React from 'react';
import styled from '@emotion/styled';
import TableHead from './TableHead';
import TableBody from './TableBody';
import { useAppStore } from '../store';

interface Props {}

function Table(props: Props) {
  const [width, height, containerBorderWidth] = useAppStore(s => [s.width, s.height, s.containerBorderWidth]);

  return (
    <Container style={{ width, height, borderWidth: `${containerBorderWidth}px` }}>
      <TableHead />
      <TableBody />
    </Container>
  );
}

const Container = styled.div`
  border-color: #ccc;
  border-style: solid;
  box-sizing: border-box;
  position: relative;
`;

export default Table;
