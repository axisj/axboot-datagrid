import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import { css } from '@emotion/react';
import { toMoney } from '../utils/number';

interface Props {}

function Pagination(props: Props) {
  const page = useAppStore(s => s.page);
  const setPage = useAppStore(s => s.setPage);
  const displayPaginationLength = useAppStore(s => s.displayPaginationLength);

  const onClickPageNo = React.useCallback(
    (pageNo: number) => {
      if (page) {
        setPage({ ...page, currentPage: pageNo });
        page?.onChange?.(pageNo, page?.pageSize);
      }
    },
    [page, setPage],
  );

  if (page && page.totalPages !== undefined && page.currentPage !== undefined) {
    const displayLength = Math.min(displayPaginationLength ?? 0, page.totalPages ?? 5);
    const pageStartNumber = (() => {
      const pageEndNumber = Math.min(page.currentPage + Math.floor(displayLength / 2), page.totalPages);
      return Math.max(pageEndNumber - (displayLength - 1), 1);
    })();

    let pageNumber: number = 0;

    return (
      <Container>
        {pageStartNumber > 1 && (
          <>
            <No onClick={() => onClickPageNo(1)}>1</No>
            {pageStartNumber > 2 && '...'}
          </>
        )}
        {Array.from({ length: displayLength }).map((_, i) => {
          if (i <= (page.totalPages ?? 1)) {
            const num = (pageNumber = pageStartNumber + i);
            return (
              <No key={num} active={page.currentPage === num} onClick={() => onClickPageNo(num)}>
                {toMoney(num)}
              </No>
            );
          }
        })}
        {page.totalPages && pageNumber < page.totalPages && (
          <>
            {pageNumber < page.totalPages - 1 && '...'}
            <No onClick={() => onClickPageNo(page.totalPages ?? 0)}>{toMoney(page.totalPages)}</No>
          </>
        )}
      </Container>
    );
  }
  return null;
}

const Container = styled.div`
  transition: all 0.3s;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  user-select: none;
`;
const No = styled.span<{ active?: boolean }>`
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  min-width: 20px;
  height: 20px;

  &:hover {
    color: var(--axfdg-primary-color);
  }

  ${({ active }) => {
    if (active) {
      return css`
        color: var(--axfdg-primary-color);
        border: 1px solid var(--axfdg-primary-color);
        background-color: var(--axfdg-body-bg);
        border-radius: 2px;
        margin: 0 3px;
      `;
    }
  }}
`;
export default Pagination;
