import * as React from 'react';
import styled from '@emotion/styled';
import { RFTableColumn } from '../types';
import { useAppStore } from '../store';
import { css } from '@emotion/react';

interface Props<T> {
  column: RFTableColumn<T>;
}

interface SorterProps {
  sort?: 'asc' | 'desc';
}

function TableHeadColumn<T>({ column }: Props<T>) {
  const sort = useAppStore(s => s.sort);
  const sortParams = useAppStore(s => s.sortParams);
  const sortDisable = column.sortDisable;

  if (sort && !sortDisable) {
    const columnKey = Array.isArray(column.key) ? column.key.join('.') : column.key;
    const sortParam = sortParams[columnKey];
    return (
      <ColumnWithSorter>
        <ColumnLabel>{column.label}</ColumnLabel>
        <ColumnSorter sort={sortParam?.orderBy} />
        {sortParam && Object.keys(sortParams).length > 1 && (
          <ColumnSorterBadge>{Number(sortParam.index) + 1}</ColumnSorterBadge>
        )}
      </ColumnWithSorter>
    );
  } else {
    return (
      <ColumnWithTool>
        <ColumnLabel>{column.label}</ColumnLabel>
      </ColumnWithTool>
    );
  }
}

const ColumnWithTool = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
  row-gap: 5px;
`;
const ColumnWithSorter = styled(ColumnWithTool)``;
const ColumnLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
`;
const ColumnSorter = styled.span<SorterProps>`
  flex: none;
  position: relative;
  width: 12px;

  &:before,
  &:after {
    display: block;
    content: '';
    position: absolute;
    width: 0;
    height: 0;
  }

  &:before {
    // desc
    top: calc(50% + 1.5px);
    left: 2px;
    border-left: 3.6px solid #0000;
    border-right: 3.6px solid #0000;
    border-top: 4.5px solid var(--rft-border-color-base);

    ${({ sort }) => {
      if (sort === 'desc') {
        return css`
          border-top: 4.5px solid var(--rft-primary-color);
        `;
      }
    }}
  }

  &:after {
    // asc
    bottom: calc(50% + 1.5px);
    left: 2px;
    border-left: 3.6px solid #0000;
    border-right: 3.6px solid #0000;
    border-bottom: 4.5px solid var(--rft-border-color-base);

    ${({ sort }) => {
      if (sort === 'asc') {
        return css`
          border-bottom: 4.5px solid var(--rft-primary-color);
        `;
      }
    }}
  }
`;
const ColumnSorterBadge = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
`;

export default TableHeadColumn;
