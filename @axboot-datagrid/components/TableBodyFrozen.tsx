import * as React from 'react';
import RowSelector from './RowSelector';
import { getCellValueByRowKey, useBodyData } from '../utils';
import { BodyTable, NoDataTr, TableBodyTr } from './TableBody';
import { useAppStore } from '../store';
import TableColGroupFrozen from './TableColGroupFrozen';
import styled from '@emotion/styled';
import { TableBodyCell } from './TableBodyCell';

interface Props {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
}

function TableBodyFrozen(props: Props) {
  const itemHeight = useAppStore(s => s.itemHeight);
  const scrollTop = useAppStore(s => s.scrollTop);
  const itemPadding = useAppStore(s => s.itemPadding);
  const trHeight = itemHeight + itemPadding * 2 + 1;
  const displayItemCount = useAppStore(s => s.displayItemCount);
  const data = useAppStore(s => s.data);
  const columns = useAppStore(s => s.columns);
  const selectedKeyMap = useAppStore(s => s.checkedIndexesMap);
  const selectedAll = useAppStore(s => s.checkedAll);
  const rowChecked = useAppStore(s => s.rowChecked);
  const showLineNumber = useAppStore(s => s.showLineNumber);
  const hoverItemIndexes = useAppStore(s => s.hoverItemIndexes);
  const setHoverItemIndexes = useAppStore(s => s.setHoverItemIndexes);
  const handleClick = useAppStore(s => s.handleClick);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const rowKey = useAppStore(s => s.rowKey);
  const selectedRowKey = useAppStore(s => s.selectedRowKey);
  const editable = useAppStore(s => s.editable);
  const editTrigger = useAppStore(s => s.editTrigger);
  const setEditItem = useAppStore(s => s.setEditItem);
  const editItemIndex = useAppStore(s => s.editItemIndex);
  const editItemColIndex = useAppStore(s => s.editItemColIndex);
  const getRowClassName = useAppStore(s => s.getRowClassName);
  const cellMergeOptions = useAppStore(s => s.cellMergeOptions);
  const variant = useAppStore(s => s.variant);
  const onClick = useAppStore(s => s.onClick);

  const startIdx = Math.max(Math.floor(scrollTop / trHeight), 0);
  const endNumber = Math.min(startIdx + displayItemCount, data.length);
  const mergeColumns = cellMergeOptions?.columnsMap;
  const hasRowChecked = !!rowChecked;
  const isRadio = rowChecked?.isRadio;

  const { dataSet, setItemValue, handleMoveEditFocus, handleChangeChecked, handleChangeCheckedRadio } = useBodyData(
    startIdx,
    endNumber,
  );
  const hasOnClick = !!onClick;

  return (
    <BodyTable variant={variant} style={props.style}>
      <TableColGroupFrozen />
      <tbody role={'rfdg-body-frozen'}>
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
              className={className + (active ? ' active' : '')}
              hasOnClick={hasOnClick}
              {...trProps}
            >
              {showLineNumber && <LineNumberTd>{ri + 1}</LineNumberTd>}
              {hasRowChecked && (
                <td className={frozenColumnIndex > 0 ? 'bordered' : ''}>
                  <RowSelector
                    disabled={rowChecked.disabled?.(ri, item)}
                    checked={selectedAll === true || selectedKeyMap.get(ri)}
                    handleChange={async checked => {
                      if (isRadio) {
                        await handleChangeCheckedRadio(ri);
                      } else {
                        await handleChangeChecked(ri, checked);
                      }
                    }}
                    isRadio={isRadio}
                  />
                </td>
              )}

              {columns.slice(0, frozenColumnIndex).map((column, columnIndex) => {
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
                        editable: editable && editItemIndex === ri && editItemColIndex === columnIndex,
                      }}
                    />
                  </td>
                );
              })}
            </TableBodyTr>
          );
        })}

        {endNumber - startIdx < 1 && <NoDataTr />}
      </tbody>
    </BodyTable>
  );
}

const LineNumberTd = styled.td`
  padding: 0 !important;
  text-align: center;
  &:not(:last-child) {
    border-right: 1px solid var(--axdg-border-color-base);
  }
`;

export default TableBodyFrozen;
