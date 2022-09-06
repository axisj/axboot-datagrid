import * as React from 'react';
import styled from '@emotion/styled';
import {useStore} from '../store';
import TableHead from "./TableHead";

interface Props {
}

function Table(props: Props) {
  const state = useStore();
  return (
    <Container>
      {state.bears}
      <button
        onClick={() => {
          state.increasePopulation();
        }}
      >
        +
      </button>

      <TableHead/>
    </Container>
  );
}

const Container = styled.div``;

export default Table;
