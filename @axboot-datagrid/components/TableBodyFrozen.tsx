import * as React from 'react';
import { useEffect, useState } from 'react';
import RowSelector from './RowSelector';
import { getCellValueByRowKey, useBodyData } from '../utils';
import { BodyTable, NoDataTr, TableBodyTr } from './TableBody';
import { useAppStore } from '../store';
import TableColGroupFrozen from './TableColGroupFrozen';
import styled from '@emotion/styled';
import { TableBodyCell } from './TableBodyCell';
import Sortable, { Swap } from 'sortablejs';
import { GripVertical } from './GripVertical';
import { css } from '@emotion/react';

Sortable.mount(new Swap());

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
  const reorder = useAppStore(s => s.reorder);
  const reorderingInfo = useAppStore(s => s.reorderingInfo);
  const setReorderingInfo = useAppStore(s => s.setReorderingInfo);

  const tbodyRef = React.useRef<HTMLTableSectionElement>(null);
  const draggingInfo = React.useRef<{ fromIndex: number; toIndex: number } | undefined>(undefined);
  const sortableRef = React.useRef<Sortable | null>(null);

  const [renderKey, setRenderKey] = useState(new Date().getTime());

  const startIdx = Math.max(Math.floor(scrollTop / trHeight), 0);
  const endNumber = Math.min(startIdx + displayItemCount, data.length);
  const mergeColumns = cellMergeOptions?.columnsMap;
  const hasRowChecked = !!rowChecked;
  const isRadio = rowChecked?.isRadio;

  const {
    dataSet,
    setItemValue,
    handleMoveEditFocus,
    handleChangeChecked,
    handleChangeCheckedRadio,
    handleReorderData,
    rollbackData,
  } = useBodyData(startIdx, endNumber, data);
  const hasOnClick = !!onClick;

  useEffect(() => {
    if (!reorder?.enabled) return;
    const tbody = tbodyRef.current;
    if (!tbody) return;

    sortableRef.current?.destroy();
    sortableRef.current = Sortable.create(tbody, {
      animation: 100,
      handle: '.drag-handle',
      swapClass: 'drag-swap-hover',
      direction: 'vertical',

      onStart: evt => {
        // console.log('드래그 시작:', evt.oldIndex);
        setReorderingInfo({
          fromIndex: evt.oldIndex,
          toIndex: evt.oldIndex,
        });
        return true;
      },

      onMove: (evt, originalEvent) => {
        const draggedEl = evt.dragged; // 현재 드래그되고 있는 요소 (TR)
        const overEl = evt.related; // 현재 hover 중인 요소 (TR)

        const dragRi = parseInt(draggedEl.getAttribute('data-ri') || '-1', 10);
        const overRi = parseInt(overEl.getAttribute('data-ri') || '-1', 10);

        // console.log(`드래그 중인 항목: ${dragRi}, hover 중인 항목: ${overRi}`);

        if (dragRi === overRi) {
          // console.log('드래그 중인 항목과 hover 중인 항목이 동일합니다.');
          return false;
        }

        setReorderingInfo({
          fromIndex: dragRi,
          toIndex: overRi,
        });
        draggingInfo.current = {
          fromIndex: dragRi,
          toIndex: overRi,
        };

        // 조건부로 드래그 허용 여부를 제어할 수도 있음
        return true; // 또는 false
      },

      onEnd: evt => {
        const fromIndex = evt.oldIndex;
        const toIndex = evt.newIndex;

        if (fromIndex === toIndex) {
          return;
        }

        setReorderingInfo(undefined);
        if (fromIndex !== undefined && toIndex !== undefined) {
          if (!draggingInfo.current) return;
          const succ = handleReorderData(draggingInfo.current.fromIndex, draggingInfo.current.toIndex);
          if (!succ) {
            // 원래 위치에 다시 삽입
            const parent = evt.from;
            const item = evt.item;
            const original = parent.children[fromIndex];
            if (original && original !== item) {
              parent.insertBefore(item, original);
            }

            rollbackData();
            return;
          }

          setRenderKey(new Date().getTime());
        }
      },
    });

    return () => {
      sortableRef.current?.destroy();
      sortableRef.current = null;
    };
  }, [handleReorderData, reorder?.enabled, rollbackData, setReorderingInfo]);

  return (
    <BodyTable variant={variant} style={props.style} key={renderKey}>
      <TableColGroupFrozen />
      <tbody role={'rfdg-body-frozen'} ref={tbodyRef}>
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
              data-ri={ri}
              dragHover={reorderingInfo?.fromIndex === ri}
              {...trProps}
            >
              {showLineNumber && reorder?.enabled ? (
                <LineNumberTd className={`drag-handle`} dragging={!!reorderingInfo}>
                  <GripVertical />
                  {ri + 1}
                </LineNumberTd>
              ) : (
                <LineNumberTd>{ri + 1}</LineNumberTd>
              )}

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

const LineNumberTd = styled.td<{ dragging?: boolean }>`
  text-align: right;
  &:not(:last-child) {
    border-right: 1px solid var(--axdg-border-color-base);
  }
  &.drag-handle {
    cursor: move;
    padding-right: 8px;
    position: relative;

    .icon-grip-vertical {
      transition: opacity 0.2s ease-in-out;
      opacity: 0;
      position: absolute;
      left: 2px;
      top: 50%;
      transform: translateY(-50%);
    }

    &:hover {
      .icon-grip-vertical {
        opacity: 1;
      }
    }

    ${({ dragging }) => {
      if (dragging) {
        return css`
          .icon-grip-vertical {
            opacity: 0 !important;
          }
        `;
      }
    }}
  }
`;

export default TableBodyFrozen;
