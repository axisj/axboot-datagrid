import * as React from 'react';
import styled from '@emotion/styled';

interface Props {}

function TableFooter(props: Props) {
  const statusContainerRef = React.useRef<HTMLDivElement>(null);
  const pagingContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <Container>
      <Status ref={statusContainerRef}>Status</Status>
      <Paging ref={pagingContainerRef}>Paging</Paging>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  row-gap: 5px;
  padding: 0 7px;
`;
const Status = styled.div`
  flex: 1;
`;
const Paging = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export default TableFooter;
