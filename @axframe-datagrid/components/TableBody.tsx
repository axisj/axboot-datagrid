import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import TableColGroup from './TableColGroup';
import { getCellValueByRowKey, useBodyData } from '../utils';
import { css } from '@emotion/react';
import { TableBodyCell } from './TableBodyCell';

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
  const hoverItemIndex = useAppStore(s => s.hoverItemIndex);
  const handleClick = useAppStore(s => s.handleClick);
  const setHoverItemIndex = useAppStore(s => s.setHoverItemIndex);
  const rowKey = useAppStore(s => s.rowKey);
  const selectedRowKey = useAppStore(s => s.selectedRowKey);
  const editable = useAppStore(s => s.editable);
  const editTrigger = useAppStore(s => s.editTrigger);
  const setEditItem = useAppStore(s => s.setEditItem);
  const editItemIndex = useAppStore(s => s.editItemIndex);
  const editItemColIndex = useAppStore(s => s.editItemColIndex);
  const msg = useAppStore(s => s.msg);
  const getRowClassName = useAppStore(s => s.getRowClassName);

  const startIdx = Math.floor(scrollTop / trHeight);
  const endNumber = Math.min(startIdx + displayItemCount, data.length);

  const { startCIdx, endCIdx } = React.useMemo(() => {
    if (!scrollContainerRef.current)
      return {
        startCIdx: 0,
        endCIdx: columns.length - 1,
      };
    const start = scrollContainerRef.current.scrollLeft,
      end = scrollContainerRef.current.scrollLeft + width - (frozenColumnsWidth ?? 0);

    let startCIdx, endCIdx;
    // columns.
    for (let i = frozenColumnIndex; i < columns.length; i++) {
      const { left, width } = columns[i];
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

  const { dataSet, setItemValue, handleMoveEditFocus } = useBodyData(startIdx, endNumber);

  return (
    <BodyTable>
      <TableColGroup />
      <tbody role={'rfdg-body'}>
        {dataSet.map((item, ri) => {
          const trProps = editable
            ? {
                editable: true,
                hover: hoverItemIndex === ri,
                onMouseOver: () => setHoverItemIndex(ri),
                onMouseOut: () => setHoverItemIndex(undefined),
              }
            : {
                hover: hoverItemIndex === ri,
                onMouseOver: () => setHoverItemIndex(ri),
                onMouseOut: () => setHoverItemIndex(undefined),
              };

          const active = rowKey ? getCellValueByRowKey(rowKey, item.values) === selectedRowKey : false;
          const className = getRowClassName?.(ri, item) ?? '';

          return (
            <TableBodyTr
              key={ri}
              itemHeight={itemHeight}
              itemPadding={itemPadding}
              active={active}
              odd={ri % 2 === 0}
              className={className + (active ? ' active' : '')}
              {...trProps}
            >
              {startCIdx > frozenColumnIndex && <td colSpan={startCIdx - frozenColumnIndex} />}
              {Array.from({ length: endCIdx - startCIdx + 1 }, (_, cidx) => {
                const columnIndex = startCIdx + cidx;
                const column = columns[columnIndex];
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
                tdProps.className = column.getClassName ? column.getClassName(item) : column.className;

                const tdEditable = editable && editItemIndex === ri && editItemColIndex === columnIndex;

                return (
                  <td
                    key={columnIndex}
                    style={{
                      textAlign: column.align,
                    }}
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

              <td onClick={() => handleClick(ri, -1)} />
            </TableBodyTr>
          );
        })}

        {endNumber - startIdx < 1 && (
          <NoDataTr>
            {msg?.emptyList && (
              <>
                <td colSpan={columns.slice(frozenColumnIndex).length}>{msg?.emptyList}</td>
                <td />
              </>
            )}
          </NoDataTr>
        )}
      </tbody>
    </BodyTable>
  );
}

export const BodyTable = styled.table`
  position: absolute;
  table-layout: fixed;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: var(--axfdg-body-bg);
  color: var(--axfdg-body-color);

  > tbody > tr {
    > td {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom: 1px solid var(--axfdg-border-color-base);
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
}>`
  ${({ editable, itemHeight, itemPadding }) => {
    if (editable) {
      return css`
        cursor: default;

        > td {
          line-height: ${itemHeight}px;
          padding: 0 6.5px;
          height: ${itemHeight + itemPadding * 2}px;
        }
      `;
    }
    return css`
      cursor: pointer;

      > td {
        line-height: ${itemHeight}px; // - border
        padding: 0 6.5px;
        height: ${itemHeight + itemPadding * 2}px;
      }
    `;
  }}

  ${({ hover }) => {
    if (hover) {
      return css`
        background: var(--axfdg-body-hover-bg);
      `;
    }
  }}

  ${({ odd, hover }) => {
    if (odd && hover) {
      return css`
        background: var(--axfdg-body-hover-odd-bg);
      `;
    } else if (odd) {
      return css`
        background: var(--axfdg-body-odd-bg);
      `;
    }
  }}

  ${({ active }) => {
    if (active) {
      return css`
        background-color: var(--axfdg-body-active-bg) !important;
        color: var(--axfdg-primary-color) !important;
      `;
    }
  }}
`;

export const NoDataTr = styled.tr`
  border-color: var(--axfdg-scroll-track-bg) !important;

  td {
    text-align: center;
    padding: 20px 0;
    //background: var(--axfdg-scroll-track-bg);
  }
`;

export default TableBody;
