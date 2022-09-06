import * as React from 'react';
import styled from '@emotion/styled';
import { useStore } from '../store';

interface Props {}

function TableHead(props: Props) {
  const state = useStore();
  return <Container>TableHead : {state.bears}</Container>;
}

const Container = styled.div``;

export default TableHead;
