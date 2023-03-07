import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import TableColGroup from './TableColGroup';
import { getCellValueByRowKey } from '../utils';
import { css } from '@emotion/react';
import { AXFDGColumn, AXFDGDataItemStatus, MoveDirection, DIRC_MAP, TableBodyRowTd, TableBodyRow } from '../types';
import RowSelector from './RowSelector';

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

  const handleMoveEdit = React.useCallback(async () => {}, []);

  const dataRow = React.useMemo(() => {
    return Array.from({ length: endNumber - startIdx }, (_, i) => {
      const ri = startIdx + i;
      const item = data[ri];
      if (!item) {
        return null;
      }

      return {
        ri,
        itemHeight,
        itemPadding,
        active: rowKey ? getCellValueByRowKey(rowKey, item) === selectedRowKey : false,
        item,
        children: columns.slice(frozenColumnIndex).map((column, columnIndex) => {
          const _columnIndex = frozenColumnIndex + columnIndex;
          return {
            column,
            columnIndex: _columnIndex,
            style: {
              textAlign: column.align,
            },
            tdEditable: editable && editItemIndex === ri && editItemColIndex === _columnIndex,
            Render: column.itemRender,
            tdValue: getCellValueByRowKey(column.key, item),
          } as TableBodyRowTd;
        }),
      } as TableBodyRow;
    }).filter(Boolean) as TableBodyRow[];
  }, [
    columns,
    data,
    editItemColIndex,
    editItemIndex,
    editable,
    endNumber,
    frozenColumnIndex,
    itemHeight,
    itemPadding,
    rowKey,
    selectedRowKey,
    startIdx,
  ]);

  return (
    <BodyTable>
      <TableColGroup />
      <tbody role={'rfdg-body'}>
        {dataRow.map(({ ri, itemHeight, itemPadding, active, item, children }) => {
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
          return (
            <TableBodyTr key={ri} itemHeight={itemHeight} itemPadding={itemPadding} active={active} {...trProps}>
              {children.map(({ column, columnIndex, style, Render, renderedValue, tdValue, tdEditable }, index) => {
                const tdProps: Record<string, any> = {};
                if (editable) {
                  tdProps.onDoubleClick = () => setEditItem(ri, columnIndex);
                }
                tdProps.onClick = () => handleClick(ri, columnIndex);

                return (
                  <td key={columnIndex} style={style} {...tdProps}>
                    {Render ? (
                      <Render
                        item={item}
                        values={item.values}
                        column={column}
                        index={ri}
                        columnIndex={columnIndex}
                        handleSave={async (
                          newValue: any,
                          columnDirection?: MoveDirection,
                          rowDirection?: MoveDirection,
                        ) => {
                          await setItemValue(ri, columnIndex, column, newValue);

                          if (columnDirection && rowDirection) {
                            let _ci = columnIndex + DIRC_MAP[columnDirection];
                            let _ri = ri + DIRC_MAP[rowDirection];
                            if (_ci > columns.length - 1) _ci = 0;
                            if (_ri > data.length - 1) _ri = 0;

                            await setEditItem(_ri, _ci);
                          } else {
                            await setEditItem(-1, -1);
                          }
                        }}
                        handleCancel={async () => {
                          await setEditItem(-1, -1);
                        }}
                        handleMove={async (columnDirection: MoveDirection, rowDirection: MoveDirection) => {
                          let _ci = columnIndex + DIRC_MAP[columnDirection];
                          let _ri = ri + DIRC_MAP[rowDirection];
                          if (_ci > columns.length - 1) _ci = 0;
                          if (_ri > data.length - 1) _ri = 0;

                          await setEditItem(_ri, _ci);
                        }}
                        editable={tdEditable}
                      />
                    ) : (
                      tdValue
                    )}
                  </td>
                );
              })}
              <td onClick={() => handleClick(ri, -1)} />
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
        background-color: var(--axfdg-body-hover-bg);
      `;
    }
  }}
  
  ${({ active }) => {
    if (active) {
      return css`
        background-color: var(--axfdg-body-active-bg);
        color: var(--axfdg-primary-color);
      `;
    }
  }}
`;

export default TableBody;
