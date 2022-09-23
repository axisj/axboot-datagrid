import * as React from 'react';
import { useAppStore } from '../store';
import styled from '@emotion/styled';
import TableColGroup from './TableColGroup';
import ColResizer from './ColResizer';
import TableHeadColumn from './TableHeadColumn';
import { css } from '@emotion/react';

interface Props {
  container: React.RefObject<HTMLDivElement>;
}

function TableHead({ container }: Props) {
  const sort = useAppStore(s => s.sort);
  const headerHeight = useAppStore(s => s.headerHeight);
  const columns = useAppStore(s => s.columns);
  const columnsGroup = useAppStore(s => s.columnsGroup);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const columnResizing = useAppStore(s => s.columnResizing);
  const toggleColumnSort = useAppStore(s => s.toggleColumnSort);

  return (
    <HeadTable headerHeight={headerHeight}>
      <TableColGroup />
      <tbody role={'rft-head'}>
        {columnsGroup.length > 0 && (
          <tr role={'column-group'}>
            {columnsGroup.map((cg, index) => (
              <HeadGroupTd
                key={index}
                colSpan={cg.colspan}
                style={{
                  textAlign: cg.align,
                }}
              >
                {cg.label}
              </HeadGroupTd>
            ))}
            <HeadGroupTd />
          </tr>
        )}
        <tr>
          {columns.slice(frozenColumnIndex).map((c, index) => (
            <HeadTd
              data-column-index={frozenColumnIndex + index}
              key={index}
              style={{
                textAlign: c.align,
              }}
              hasOnClick={sort && !c.sortDisable}
              columnResizing={columnResizing}
              onClick={evt => {
                evt.preventDefault();
                toggleColumnSort(frozenColumnIndex + index);
              }}
            >
              <TableHeadColumn column={c} />
              <ColResizer columnIndex={frozenColumnIndex + index} container={container} />
            </HeadTd>
          ))}
          <HeadTd />
        </tr>
      </tbody>
    </HeadTable>
  );
}

export const HeadTable = styled.table<{ headerHeight: number }>`
  table-layout: fixed;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  height: ${p => p.headerHeight}px;

  tbody {
    height: ${p => p.headerHeight}px;
    overflow: hidden;
  }
`;

export const HeadGroupTd = styled.td`
  padding: 0 7px;
  border-bottom-style: solid;
  border-bottom-color: var(--rft-border-color-base);
  border-bottom-width: 1px;
  background-color: var(--rft-header-group-bg);

  &[rowSpan='2'] {
    background-color: transparent;
    border-right-style: solid;
    border-right-color: var(--rft-border-color-base);
    border-right-width: 1px;
  }
`;

export const HeadTd = styled.td<{ hasOnClick?: boolean; columnResizing?: boolean }>`
  position: relative;
  padding: 0 7px;
  border-bottom-style: solid;
  border-bottom-color: var(--rft-border-color-base);
  border-bottom-width: 1px;

  ${({ hasOnClick, columnResizing }) => {
    if (hasOnClick && !columnResizing) {
      return css`
        cursor: pointer;

        &:hover {
          background: var(--rft-header-hover-bg);
        }
      `;
    }
  }}
`;

export default TableHead;
