import * as React from 'react';
import RowSelector from './RowSelector';
import { getCellValue, getCellValueByRowKey } from '../utils';
import { BodyTable, TableBodyTr } from './TableBody';
import { useAppStore } from '../store';
import TableColGroupFrozen from './TableColGroupFrozen';

interface Props {
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
  const setSelectedKeys = useAppStore(s => s.setCheckedIndexes);
  const selectedAll = useAppStore(s => s.checkedAll);
  const hasRowChecked = useAppStore(s => !!s.rowChecked);
  const hoverItemIndex = useAppStore(s => s.hoverItemIndex);
  const setHoverItemIndex = useAppStore(s => s.setHoverItemIndex);
  const handleClick = useAppStore(s => s.handleClick);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const rowKey = useAppStore(s => s.rowKey);
  const selectedRowKey = useAppStore(s => s.selectedRowKey);
  const editable = useAppStore(s => s.editable);

  const startIdx = Math.floor(scrollTop / trHeight);
  const endNumber = Math.min(startIdx + displayItemCount, data.length);

  const handleChangeChecked = React.useCallback(
    (itemIndex: number, checked: boolean) => {
      if (checked) {
        selectedKeyMap.set(itemIndex, true);
      } else {
        selectedKeyMap.delete(itemIndex);
      }
      setSelectedKeys([...selectedKeyMap.keys()]);
    },
    [selectedKeyMap, setSelectedKeys],
  );

  return (
    <BodyTable style={props.style}>
      <TableColGroupFrozen />
      <tbody role={'rfdg-body-frozen'}>
        {Array.from({ length: endNumber - startIdx }, (_, i) => {
          const ri = startIdx + i;
          const item = data[ri];
          if (!item) {
            return null;
          }
          const trProps = editable
            ? {}
            : {
                hover: hoverItemIndex === ri,
                onMouseOver: () => setHoverItemIndex(ri),
                onMouseOut: () => setHoverItemIndex(undefined),
              };

          return (
            <TableBodyTr
              key={ri}
              itemHeight={itemHeight}
              itemPadding={itemPadding}
              active={rowKey ? getCellValueByRowKey(rowKey, item) === selectedRowKey : false}
              {...trProps}
            >
              {hasRowChecked && (
                <td>
                  <RowSelector
                    checked={selectedAll === true || selectedKeyMap.get(ri)}
                    handleChange={checked => handleChangeChecked(ri, checked)}
                  />
                </td>
              )}
              {columns.slice(0, frozenColumnIndex).map((column, idx) => {
                const tdProps: Record<string, any> = {};
                if (editable) {
                } else {
                  tdProps.onClick = () => handleClick(ri, idx);
                }

                return (
                  <td
                    key={idx}
                    style={{
                      textAlign: column.align,
                    }}
                    {...tdProps}
                  >
                    {getCellValue(ri, idx, column, item)}
                  </td>
                );
              })}
            </TableBodyTr>
          );
        })}
      </tbody>
    </BodyTable>
  );
}

export default TableBodyFrozen;
