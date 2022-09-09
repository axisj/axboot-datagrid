import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import { css } from '@emotion/react';

interface Props {}

function TableBodyTr(props: Props) {
  const trHeight = useAppStore(s => s.trHeight);
  return <Container trHeight={trHeight}>TableBodyTr</Container>;
}

const Container = styled.div<{ trHeight: number }>`
  height: ${p => p.trHeight}px;
`;

export default TableBodyTr;
