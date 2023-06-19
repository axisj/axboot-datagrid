import * as React from "react";
import RowSelector from "./RowSelector";
import { getCellValueByRowKey } from "../utils";
import { BodyTable, NoDataTr, TableBodyTr } from "./TableBody";
import { useAppStore } from "../store";
import TableColGroupFrozen from "./TableColGroupFrozen";
import { AXFDGColumn, AXFDGDataItemStatus } from "../types";
import styled from "@emotion/styled";
import { TableBodyCell } from "./TableBodyCell";

interface Props {
  style?: React.CSSProperties;
}

const DIRC_MAP = {
  next: 1,
  prev: -1,
  current: 0
};

function TableBodyFrozen(props: Props) {
  const itemHeight = useAppStore(s => s.itemHeight);
  const scrollTop = useAppStore(s => s.scrollTop);
  const itemPadding = useAppStore(s => s.itemPadding);
  const trHeight = itemHeight + itemPadding * 2 + 1;
  const displayItemCount = useAppStore(s => s.displayItemCount);
  const data = useAppStore(s => s.data);
  const columns = useAppStore(s => s.columns);
  const selectedKeyMap = useAppStore(s => s.checkedIndexesMap);
  const setSelectedKeys = useAppStore(s => s.setCheckedIndexes);
  const selectedAll = useAppStore(s => s.checkedAll);
  const hasRowChecked = useAppStore(s => !!s.rowChecked);
  const showLineNumber = useAppStore(s => s.showLineNumber);
  const hoverItemIndex = useAppStore(s => s.hoverItemIndex);
  const setHoverItemIndex = useAppStore(s => s.setHoverItemIndex);
  const handleClick = useAppStore(s => s.handleClick);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
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

  const handleChangeChecked = React.useCallback(
    async (index: number, checked: boolean) => {
      if (checked) {
        data[index].checked = true;
        selectedKeyMap.set(index, true);
      } else {
        data[index].checked = false;
        selectedKeyMap.delete(index);
      }
      setSelectedKeys([...selectedKeyMap.keys()]);
      await setData([...data]);
    },
    [data, selectedKeyMap, setData, setSelectedKeys]
  );

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
    [data, onChangeData, setData]
  );

  return (
    <BodyTable style={props.style}>
      <TableColGroupFrozen />
      <tbody role={"rfdg-body-frozen"}>
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
            onMouseOut: () => setHoverItemIndex(undefined)
          }
          : {
            hover: hoverItemIndex === ri,
            onMouseOver: () => setHoverItemIndex(ri),
            onMouseOut: () => setHoverItemIndex(undefined)
          };
        const active = rowKey ? getCellValueByRowKey(rowKey, item.values) === selectedRowKey : false;

        return (
          <TableBodyTr
            key={ri}
            itemHeight={itemHeight}
            itemPadding={itemPadding}
            active={active}
            odd={ri % 2 === 0}
            className={active ? "active" : ""}
            {...trProps}
          >
            {showLineNumber && <LineNumberTd>{ri + 1}</LineNumberTd>}
            {hasRowChecked && (
              <td>
                <RowSelector
                  checked={selectedAll === true || selectedKeyMap.get(ri)}
                  handleChange={checked => handleChangeChecked(ri, checked)}
                />
              </td>
            )}

            {columns.slice(0, frozenColumnIndex).map((column, columnIndex) => {
              const tdProps: Record<string, any> = {};
              if (editable) {
                tdProps.onDoubleClick = () => setEditItem(ri, columnIndex);
              }
              tdProps.onClick = () => handleClick(ri, columnIndex);
              tdProps.className = column.getClassName ? column.getClassName(item) : column.className;

              return (
                <td
                  key={columnIndex}
                  style={{
                    textAlign: column.align
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

                        if (columnDirection && rowDirection) {
                          let _ci = columnIndex + DIRC_MAP[columnDirection];
                          let _ri = ri + DIRC_MAP[rowDirection];
                          if (_ci > columns.length - 1) _ci = 0;
                          if (_ri > data.length - 1) _ri = 0;

                          await setEditItem(_ri, _ci);
                        } else {
                          await setEditItem(-1, -1);
                        }
                      },
                      handleCancel: async () => {
                        await setEditItem(-1, -1);
                      },
                      handleMove: async (columnDirection, rowDirection) => {
                        let _ci = columnIndex + DIRC_MAP[columnDirection];
                        let _ri = ri + DIRC_MAP[rowDirection];
                        if (_ci > columns.length - 1) _ci = 0;
                        if (_ri > data.length - 1) _ri = 0;

                        await setEditItem(_ri, _ci);
                      },
                      editable: editable && editItemIndex === ri && editItemColIndex === columnIndex
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
    border-right: 1px solid var(--axfdg-border-color-base);
  }
`;

export default TableBodyFrozen;
