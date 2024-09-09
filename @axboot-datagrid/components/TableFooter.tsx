import * as React from 'react';
import styled from '@emotion/styled';
import Pagination from './Pagination';
import { useAppStore } from '../store';
import { toMoney } from '../utils/number';

interface Props {}

function TableFooter(props: Props) {
  const page = useAppStore(s => s.page);
  const statusContainerRef = React.useRef<HTMLDivElement>(null);
  const pagingContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <Container>
      <StatusContainer ref={statusContainerRef} role={'status'}>
        {page && `${toMoney(page?.totalElements ?? 0)} Items`}
      </StatusContainer>
      <PagingContainer ref={pagingContainerRef} role={'paging'}>
        <Pagination />
      </PagingContainer>
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
const StatusContainer = styled.div`
  flex: 1;
`;
const PagingContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export default TableFooter;
