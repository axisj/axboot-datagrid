import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import TableColGroup from './TableColGroup';
import { getCellValue, getCellValueByRowKey } from '../utils';
import { css } from '@emotion/react';
import { AXFDGColumn, AXFDGDataItemStatus } from '../types';

const DIRC_MAP = {
  next: 1,
  prev: -1,
  current: 0,
};

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
  const handleClick = useAppStore(s => s.handleClick);
  const setHoverItemIndex = useAppStore(s => s.setHoverItemIndex);
  const rowKey = useAppStore(s => s.rowKey);
  const selectedRowKey = useAppStore(s => s.selectedRowKey);
  const editable = useAppStore(s => s.editable);
  const setEditItem = useAppStore(s => s.setEditItem);
  const editItemIndex = useAppStore(s => s.editItemIndex);
  const editItemColIndex = useAppStore(s => s.editItemColIndex);
  const setData = useAppStore(s => s.setData);
  const onChangeData = useAppStore(s => s.onChangeData);
  const msg = useAppStore(s => s.msg);

  const startIdx = Math.floor(scrollTop / trHeight);
  const endNumber = Math.min(startIdx + displayItemCount, data.length);

  const setItemValue = React.useCallback(
    async (ri: number, ci: number, column: AXFDGColumn<any>, newValue: any) => {
      if (data[ri].status !== AXFDGDataItemStatus.new) {
        data[ri].status = AXFDGDataItemStatus.edit;
      }
      let _values = data[ri].values;

      if (Array.isArray(column.key)) {
        column.key.forEach((k, i) => {
          if (column.key.length - 1 === i) {
            _values[k] = newValue;
          }
        });
      } else {
        _values[column.key] = newValue;
      }

      await setData([...data]);
      await onChangeData?.(ri, ci, _values, column);
    },
    [data, onChangeData, setData],
  );

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

          return (
            <TableBodyTr
              key={ri}
              itemHeight={itemHeight}
              itemPadding={itemPadding}
              active={active}
              odd={ri % 2 === 0}
              className={active ? 'active' : ''}
              {...trProps}
            >
              {columns.slice(frozenColumnIndex).map((column, columnIndex) => {
                const tdProps: Record<string, any> = {};
                if (editable) {
                  tdProps.onDoubleClick = () => setEditItem(ri, columnIndex);
                }
                tdProps.onClick = () => handleClick(ri, columnIndex);
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
                    {getCellValue(
                      ri,
                      frozenColumnIndex + columnIndex,
                      column,
                      item,
                      getCellValueByRowKey(column.key, item.values),
                      async (newValue, columnDirection, rowDirection) => {
                        await setItemValue(ri, frozenColumnIndex + columnIndex, column, newValue);

                        if (columnDirection && rowDirection) {
                          let _ci = frozenColumnIndex + columnIndex + DIRC_MAP[columnDirection];
                          let _ri = ri + DIRC_MAP[rowDirection];
                          if (_ci > columns.length - 1) _ci = 0;
                          if (_ri > data.length - 1) _ri = 0;

                          await setEditItem(_ri, _ci);
                        } else {
                          await setEditItem(-1, -1);
                        }
                      },
                      async () => {
                        await setEditItem(-1, -1);
                      },
                      async (columnDirection, rowDirection) => {
                        let _ci = frozenColumnIndex + columnIndex + DIRC_MAP[columnDirection];
                        let _ri = ri + DIRC_MAP[rowDirection];
                        if (_ci > columns.length - 1) _ci = 0;
                        if (_ri > data.length - 1) _ri = 0;

                        await setEditItem(_ri, _ci);
                      },
                      tdEditable,
                    )}
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
  border-collapse: collapse;
  border-spacing: 0;
  background-color: var(--axfdg-body-bg);
  color: var(--axfdg-body-color);

  > tbody > tr {
    border-width: 1px;
    border-style: solid;
    border-color: var(--axfdg-border-color-base);
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
