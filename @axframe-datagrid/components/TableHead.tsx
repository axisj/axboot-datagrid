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

  const columnsTable = React.useMemo(() => {
    const hasColumnsGroup = columnsGroup.length > 0;
    const rows: Record<string, any>[] = [];

    if (hasColumnsGroup) {
      const row: Record<string, any>[] = [];
      const secondRow: Record<string, any>[] = [];
      columns.slice(frozenColumnIndex).forEach((column, index) => {
        const ci = frozenColumnIndex + index;
        const findCgIndex = columnsGroup.findIndex(cg => cg.columnIndexes.includes(ci));
        if (findCgIndex > -1) {
          const prevItem = row[row.length - 1];
          if (!prevItem || prevItem.cgi !== findCgIndex) {
            const cifi = columnsGroup[findCgIndex].columnIndexes.findIndex(n => n === ci);
            row.push({
              type: 'column-group',
              cgi: findCgIndex,
              colspan: columnsGroup[findCgIndex].columnIndexes.length - cifi,
              ...columnsGroup[findCgIndex],
            });
          }

          secondRow.push({
            type: 'column',
            columnIndex: ci,
            ...column,
          });
        } else {
          row.push({
            type: 'column',
            columnIndex: ci,
            ...column,
            rowspan: 2,
          });
        }
      });

      rows.push(row, secondRow);
    } else {
      const row: Record<string, any>[] = [];
      columns.slice(frozenColumnIndex).forEach((column, index) => {
        const ci = frozenColumnIndex + index;

        row.push({
          type: 'column',
          columnIndex: ci,
          ...column,
        });
      });
      rows.push(row);
    }

    return rows;
  }, [columns, columnsGroup, frozenColumnIndex]);

  return (
    <HeadTable headerHeight={headerHeight} hasGroup={columnsTable.length > 1} rowLength={columnsTable.length}>
      <TableColGroup />
      <tbody role={'rfdg-head'}>
        {columnsTable.map((row, ri) => {
          return (
            <tr key={ri}>
              {row.map((c: any, index: any) => {
                if (c.type === 'column-group') {
                  return (
                    <HeadGroupTd
                      key={index}
                      colSpan={c.colspan}
                      className={c.headerClassName}
                      style={{
                        textAlign: c.headerAlign ?? 'center',
                      }}
                    >
                      {c.label}
                    </HeadGroupTd>
                  );
                }
                return (
                  <HeadTd
                    data-column-index={c.columnIndex}
                    key={index}
                    rowSpan={c.rowspan}
                    style={{
                      textAlign: c.headerAlign ?? 'center',
                    }}
                    className={c.headerClassName}
                    hasOnClick={sort && !c.sortDisable}
                    columnResizing={columnResizing}
                    onClick={evt => {
                      evt.preventDefault();
                      if (!c.sortDisable) toggleColumnSort(c.columnIndex);
                    }}
                  >
                    <TableHeadColumn column={c} />
                    <ColResizer columnIndex={c.columnIndex} container={container} bordered={columnsTable.length > 1} />
                  </HeadTd>
                );
              })}
              {ri === 0 && <HeadTd rowSpan={2} />}
            </tr>
          );
        })}
      </tbody>
    </HeadTable>
  );
}

export const HeadTable = styled.table<{ headerHeight: number; hasGroup: boolean; rowLength: number }>`
  table-layout: fixed;
  width: 100%;
  border-collapse: unset;
  border-spacing: 0;
  height: ${p => p.headerHeight}px;
  color: var(--axfdg-header-color);
  font-weight: var(--axfdg-header-font-weight);

  tbody {
    height: ${p => p.headerHeight}px;
    overflow: hidden;
    tr {
      height: ${p => `${100 / p.rowLength}%`};
    }
  }
`;

export const HeadGroupTd = styled.td`
  padding: 0 7px;
  border-bottom-style: solid;
  border-bottom-color: var(--axfdg-border-color-base);
  border-bottom-width: 1px;
  background-color: var(--axfdg-header-group-bg);

  border-right-style: solid;
  border-right-color: var(--axfdg-border-color-base);
  border-right-width: 1px;
`;

export const HeadTd = styled.td<{ hasOnClick?: boolean; columnResizing?: boolean }>`
  position: relative;
  padding: 0 7px;
  border-bottom-style: solid;
  border-bottom-color: var(--axfdg-border-color-base);
  border-width: 1px;

  ${({ hasOnClick, columnResizing }) => {
    if (hasOnClick && !columnResizing) {
      return css`
        cursor: pointer;

        &:hover {
          background: var(--axfdg-header-hover-bg);
        }
      `;
    }
  }}
  &.rfdg-tr-line-number {
    border-right: 1px solid var(--axfdg-border-color-base);
  }
`;

export default TableHead;
