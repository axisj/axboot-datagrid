import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import TableColGroup from './TableColGroup';
import { getCellValue } from '../utils';
import { css } from '@emotion/react';

function TableBody() {
  const scrollTop = useAppStore(s => s.scrollTop);
  const itemHeight = useAppStore(s => s.itemHeight);
  const itemPadding = useAppStore(s => s.itemPadding);
  const trHeight = itemHeight + itemPadding * 2 + 1;
  const displayItemCount = useAppStore(s => s.displayItemCount);
  const data = useAppStore(s => s.data);
  const columns = useAppStore(s => s.columns);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const hoverItemIndex = useAppStore(s => s.hoverItemIndex);
  const setHoverItemIndex = useAppStore(s => s.setHoverItemIndex);
  const handleClick = useAppStore(s => s.handleClick);

  const startIdx = Math.floor(scrollTop / trHeight);
  const endNumber = Math.min(startIdx + displayItemCount, data.length);

  return (
    <BodyTable>
      <TableColGroup />
      <tbody role={'rfdg-body'}>
        {Array.from({ length: endNumber - startIdx }, (_, i) => {
          const ri = startIdx + i;
          const item = data[ri];
          if (!item) {
            return null;
          }

          return (
            <TableBodyTr
              key={ri}
              itemHeight={itemHeight}
              itemPadding={itemPadding}
              hover={hoverItemIndex === ri}
              onMouseOver={() => setHoverItemIndex(ri)}
              onMouseOut={() => setHoverItemIndex(undefined)}
            >
              {columns.slice(frozenColumnIndex).map((column, idx) => {
                return (
                  <td key={idx} onClick={() => handleClick(ri, frozenColumnIndex + idx)}>
                    {getCellValue(column, item)}
                  </td>
                );
              })}
              <td />
            </TableBodyTr>
          );
        })}
      </tbody>
    </BodyTable>
  );
}

export const BodyTable = styled.table`
  position: absolute;
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  background-color: var(--rfdg-body-bg);

  > tbody > tr {
    border-width: 1px;
    border-style: solid;
    border-color: var(--rfdg-border-color-base);
    border-top: 0 none;
    border-left: 0 none;
    border-right: 0 none;

    > td {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
`;

export const TableBodyTr = styled.tr<{ itemHeight: number; itemPadding: number; hover?: boolean }>`
  cursor: pointer;

  ${({ hover }) => {
    if (hover) {
      return css`
        background-color: var(--rfdg-body-hover-bg);
      `;
    }
  }}
  > td {
    line-height: ${p => p.itemHeight}px; // - border
    padding: ${p => p.itemPadding}px 6.5px;
  }
`;

export default TableBody;
