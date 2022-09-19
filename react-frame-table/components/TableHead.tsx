import * as React from 'react';
import { useAppStore } from '../store';
import styled from '@emotion/styled';
import TableColGroup from './TableColGroup';
import { css } from '@emotion/react';

function TableHead() {
  const headerHeight = useAppStore(s => s.headerHeight);
  const columns = useAppStore(s => s.columns);
  const columnsGroup = useAppStore(s => s.columnsGroup);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);

  return (
    <HeadTable headerHeight={headerHeight}>
      <TableColGroup />
      <tbody>
        {columnsGroup.length > 0 && (
          <tr role={'column-group'}>
            {columnsGroup.map((cg, index) => (
              <td
                key={index}
                colSpan={cg.colspan}
                style={{
                  textAlign: cg.align,
                }}
              >
                {cg.label}
              </td>
            ))}
            <td />
          </tr>
        )}
        <tr>
          {columns.slice(frozenColumnIndex).map((c, index) => (
            <td
              key={index}
              style={{
                textAlign: c.align,
              }}
            >
              {c.label}
              <ColResizer />
            </td>
          ))}
          <td />
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

  > tbody > tr {
    > td {
      position: relative;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 0 7px;
      border-bottom-style: solid;
      border-bottom-color: var(--rft-border-color-base);
      border-bottom-width: 1px;
    }
  }

  tr[role='column-group'] > td {
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
  }
`;

export const ColResizer = styled.div<{ hideHandle?: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
  width: 7px;
  height: 100%;
  cursor: col-resize;

  ${({ hideHandle = false }) => {
    if (hideHandle) {
      return css``;
    }
    return css`
      &:after {
        position: absolute;
        top: 50%;
        right: 3px;
        content: '';
        display: block;
        width: 1px;
        height: 0.8em;
        transform: translateY(-50%);
        background: var(--rft-border-color-base);
      }

      &:hover {
        &:after {
          background: var(--rft-primary-color);
        }
      }
    `;
  }}
`;

export default TableHead;
