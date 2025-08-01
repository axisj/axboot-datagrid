import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import TableColGroup from './TableColGroup';
import { getCellValueByRowKey, useBodyData } from '../utils';
import { css } from '@emotion/react';
import { TableBodyCell } from './TableBodyCell';
import { AXDGProps } from '../types';

interface Props {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

function TableBody({ scrollContainerRef }: Props) {
  const scrollTop = useAppStore(s => s.scrollTop);
  const width = useAppStore(s => s.width);
  const frozenColumnsWidth = useAppStore(s => s.frozenColumnsWidth);
  const itemHeight = useAppStore(s => s.itemHeight);
  const itemPadding = useAppStore(s => s.itemPadding);
  const trHeight = itemHeight + itemPadding * 2 + 1;
  const displayItemCount = useAppStore(s => s.displayItemCount);
  const data = useAppStore(s => s.data);
  const columns = useAppStore(s => s.columns);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const hoverItemIndexes = useAppStore(s => s.hoverItemIndexes);
  const setHoverItemIndexes = useAppStore(s => s.setHoverItemIndexes);
  const handleClick = useAppStore(s => s.handleClick);
  const rowKey = useAppStore(s => s.rowKey);
  const selectedRowKey = useAppStore(s => s.selectedRowKey);
  const editable = useAppStore(s => s.editable);
  const editTrigger = useAppStore(s => s.editTrigger);
  const setEditItem = useAppStore(s => s.setEditItem);
  const editItemIndex = useAppStore(s => s.editItemIndex);
  const editItemColIndex = useAppStore(s => s.editItemColIndex);
  const msg = useAppStore(s => s.msg);
  const getRowClassName = useAppStore(s => s.getRowClassName);
  const cellMergeOptions = useAppStore(s => s.cellMergeOptions);
  const variant = useAppStore(s => s.variant);
  const onClick = useAppStore(s => s.onClick);
  const reorderingInfo = useAppStore(s => s.reorderingInfo);

  const startIdx = Math.max(Math.floor(scrollTop / trHeight), 0);
  const endNumber = Math.min(startIdx + displayItemCount, data.length);
  const mergeColumns = cellMergeOptions?.columnsMap;

  const { dataSet, setItemValue, handleMoveEditFocus } = useBodyData(startIdx, endNumber, data);

  const { startCIdx, endCIdx } = React.useMemo(() => {
    if (!scrollContainerRef.current)
      return {
        startCIdx: 0,
        endCIdx: columns.length - 1,
      };
    const start = Math.max(scrollContainerRef.current.scrollLeft, 0),
      end = start + width - (frozenColumnsWidth ?? 0);

    let startCIdx, endCIdx;
    // columns.
    for (let i = frozenColumnIndex; i < columns.length; i++) {
      const { left, width = 100 } = columns[i];
      if (left + width >= start && left < end) {
        if (startCIdx === undefined) {
          startCIdx = i;
        } else {
          endCIdx = i;
        }
      }
    }

    startCIdx = startCIdx ?? frozenColumnIndex;
    endCIdx = endCIdx ?? columns.length - 1;

    if (startCIdx > frozenColumnIndex) {
      startCIdx -= 1;
    }

    if (endCIdx < columns.length - 1) {
      endCIdx += 1;
    }

    return {
      startCIdx: startCIdx ?? 0,
      endCIdx: endCIdx ?? columns.length - 1,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollContainerRef.current?.scrollLeft, width, frozenColumnsWidth, columns, frozenColumnIndex]);
  const hasOnClick = !!onClick;

  return (
    <BodyTable variant={variant}>
      <TableColGroup />
      <tbody role={'rfdg-body'}>
        {dataSet.map((item, i) => {
          const ri = startIdx + i;
          const trProps: Record<string, any> = {
            editable,
            hover: hoverItemIndexes?.includes(ri),
          };

          if (!mergeColumns) {
            trProps.odd = ri % 2 === 0;
          }

          const active = rowKey ? getCellValueByRowKey(rowKey, item.values) === selectedRowKey : false;
          const className = getRowClassName?.(ri, item) ?? '';

          return (
            <TableBodyTr
              key={ri}
              itemHeight={itemHeight}
              itemPadding={itemPadding}
              active={active}
              hasOnClick={hasOnClick}
              className={className + (active ? ' active' : '')}
              data-ri={ri}
              dragHover={reorderingInfo?.toIndex === ri}
              {...trProps}
            >
              {startCIdx > frozenColumnIndex && <td colSpan={startCIdx - frozenColumnIndex} />}
              {Array.from({ length: endCIdx - startCIdx + 1 }, (_, cidx) => {
                const columnIndex = startCIdx + cidx;
                const column = columns[columnIndex];

                const tdEditable = editable && editItemIndex === ri && editItemColIndex === columnIndex;
                const rowSpan = mergeColumns?.[columnIndex] ? item.meta?.[column.key.toString()]?.rowSpan : 1;
                if (rowSpan === 0) return null;

                const tdProps: Record<string, any> = {};
                if (editable) {
                  if (editTrigger === 'dblclick') {
                    tdProps.onDoubleClick = () => setEditItem(ri, columnIndex);
                    tdProps.onClick = () => handleClick(ri, columnIndex);
                  } else {
                    tdProps.onClick = () => {
                      setEditItem(ri, columnIndex);
                      handleClick(ri, columnIndex);
                    };
                  }
                } else {
                  tdProps.onClick = () => handleClick(ri, columnIndex);
                }

                tdProps.onMouseOver = () =>
                  setHoverItemIndexes(rowSpan > 1 ? Array.from({ length: rowSpan }, (_, i) => ri + i) : [ri]);
                tdProps.onMouseOut = () => setHoverItemIndexes(undefined);
                tdProps.className =
                  (column.getClassName ? column.getClassName(item) : column.className ?? '') +
                  (mergeColumns?.[columnIndex] ? ' merged' : '');

                return (
                  <td
                    key={columnIndex}
                    style={{
                      textAlign: column.align,
                    }}
                    rowSpan={rowSpan > 1 ? rowSpan : undefined}
                    {...tdProps}
                  >
                    <TableBodyCell
                      index={ri}
                      columnIndex={columnIndex}
                      column={column}
                      item={item}
                      valueByRowKey={getCellValueByRowKey(column.key, item.values)}
                      {...{
                        handleSave: async (newValue, columnDirection, rowDirection) => {
                          await setItemValue(ri, columnIndex, column, newValue);
                          await handleMoveEditFocus(ri, columnIndex, columnDirection, rowDirection);
                        },
                        handleCancel: async () => {
                          setEditItem(-1, -1);
                        },
                        handleMove: async (columnDirection, rowDirection) => {
                          await handleMoveEditFocus(ri, columnIndex, columnDirection, rowDirection);
                        },
                        editable: tdEditable,
                      }}
                    />
                  </td>
                );
              })}

              <td data-none onClick={() => handleClick(ri, -1)} />
            </TableBodyTr>
          );
        })}

        {endNumber - startIdx < 1 && (
          <NoDataTr>
            {msg?.emptyList && (
              <>
                <td colSpan={columns.slice(frozenColumnIndex).length}>{msg?.emptyList}</td>
                <td data-none />
              </>
            )}
          </NoDataTr>
        )}
      </tbody>
    </BodyTable>
  );
}

export const BodyTable = styled.table<{ variant: AXDGProps<any>['variant'] }>`
  position: absolute;
  table-layout: fixed;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: var(--axdg-body-bg);
  color: var(--axdg-body-color);

  > tbody > tr {
    > td {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom: 1px solid var(--axdg-border-color-base);
      ${({ variant }) => {
        if (variant === 'vertical-bordered') {
          return css`
            border-right: 1px solid var(--axdg-border-color-light, var(--axdg-border-color-base));
          `;
        }
      }}

      &:last-child {
      }
      &[data-none] {
        border-right: none;
      }
    }
  }
`;

export const TableBodyTr = styled.tr<{
  itemHeight: number;
  itemPadding: number;
  hover?: boolean;
  active?: boolean;
  editable?: boolean;
  odd?: boolean;
  hasOnClick?: boolean;
  dragHover?: boolean;
}>`
  ${({ editable, itemHeight, itemPadding, hasOnClick }) => {
    if (editable) {
      return css`
        cursor: default;

        > td {
          line-height: ${itemHeight}px;
          padding: 0 6.5px;
          height: ${itemHeight + itemPadding * 2}px;

          &.bordered {
            border-right: 1px solid var(--axdg-border-color-base);
          }
        }
      `;
    }
    return css`
      cursor: ${hasOnClick ? 'pointer' : 'default'};

      > td {
        line-height: ${itemHeight}px; // - border
        padding: 0 6.5px;
        height: ${itemHeight + itemPadding * 2}px;

        &.bordered {
          border-right: 1px solid var(--axdg-border-color-base);
        }
      }
    `;
  }}

  ${({ hover }) => {
    if (hover) {
      return css`
        background: var(--axdg-body-hover-bg);
      `;
    }
  }}

  ${({ odd, hover }) => {
    if (odd && hover) {
      return css`
        background: var(--axdg-body-hover-odd-bg);
      `;
    } else if (odd) {
      return css`
        background: var(--axdg-body-odd-bg);
      `;
    }
  }}

  ${({ active }) => {
    if (active) {
      return css`
        background-color: var(--axdg-body-active-bg) !important;
        color: var(--axdg-primary-color) !important;
      `;
    }
  }}

  ${({ dragHover }) => {
    if (dragHover) {
      return css`
        background-color: var(--axdg-body-active-bg) !important;
        td {
          //border-bottom: 1px solid var(--axdg-primary-color) !important;
        }
      `;
    }
  }}
`;

export const NoDataTr = styled.tr`
  border-color: var(--axdg-scroll-track-bg) !important;

  td {
    text-align: center;
    padding: 20px 0;
    //background: var(--axdg-scroll-track-bg);
  }
`;

export default TableBody;
