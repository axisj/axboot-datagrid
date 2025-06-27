import { useAppStore } from '../store';
import * as React from 'react';
import { AXDGColumn, AXDGDataItem, AXDGDataItemStatus, DIRC_MAP, MoveDirection } from '../types';
import { getCellValueByRowKey } from './getCellValue';

interface CellMergeColumn<T> {
  mergeBy: string | string[];
  column: AXDGColumn<T>;
}

export function useBodyData(startIdx: number, endNumber: number, data: AXDGDataItem<any>[]) {
  const columns = useAppStore(s => s.columns);
  const cellMergeOptions = useAppStore(s => s.cellMergeOptions);
  const setData = useAppStore(s => s.setData);
  const setEditItem = useAppStore(s => s.setEditItem);
  const selectedKeyMap = useAppStore(s => s.checkedIndexesMap);
  const setSelectedKeys = useAppStore(s => s.setCheckedIndexes);
  const onChangeData = useAppStore(s => s.onChangeData);
  const reorder = useAppStore(s => s.reorder);

  const dataSet = React.useMemo(() => {
    const items = data.slice(startIdx, endNumber);

    if (cellMergeOptions?.columnsMap) {
      const { columnsMap } = cellMergeOptions;
      const tColumns = Object.keys(columnsMap)
        .map(k => {
          return {
            mergeBy: columnsMap[Number(k)].mergeBy,
            column: columns[Number(k)],
          };
        })
        .reduce((acc, cur) => {
          const key = cur.column.key.toString();
          if (acc[key] === undefined) acc[key] = cur;
          return acc;
        }, {} as Record<string, CellMergeColumn<any>>);

      const processMap: Record<string, number> = {};

      for (let i = 0; i < items.length; i++) {
        const prevItem = items[i - 1];
        const item = items[i];
        item.meta = {};

        for (const cKey of Object.keys(tColumns)) {
          const cellMergeRule = tColumns[cKey];
          const keyString = cellMergeRule.column.key.toString();
          const mergeByKey = cellMergeRule.mergeBy;
          const prevValue = prevItem ? getCellValueByRowKey(mergeByKey, prevItem.values) : undefined;
          const value = getCellValueByRowKey(mergeByKey, item.values);

          if (prevValue !== value) {
            processMap[keyString] = i;

            if (!item.meta[cKey]) {
              item.meta[cKey] = {
                rowSpan: 1,
              };
            }
          } else {
            item.meta[cKey] = {
              rowSpan: 0,
            };
            const ii = processMap[keyString];
            const pMeta = items[ii].meta?.[cKey];
            if (pMeta && pMeta.rowSpan !== undefined) {
              pMeta.rowSpan += 1;
            }
          }
        }
      }
    }

    return items;
  }, [cellMergeOptions, columns, data, endNumber, startIdx]);

  const setItemValue = React.useCallback(
    async (ri: number, ci: number, column: AXDGColumn<any>, newValue: any) => {
      if (data[ri].status !== AXDGDataItemStatus.new) {
        data[ri].status = AXDGDataItemStatus.edit;
      }
      let _values = data[ri].values;
      const columnKey = column.key;
      if (Array.isArray(columnKey)) {
        columnKey.forEach((k, i) => {
          if (columnKey.length - 1 === i) {
            _values[k] = newValue;
          } else {
            if (_values[k] === undefined) _values[k] = {};
            _values = _values[k];
          }
        });
      } else {
        _values[columnKey] = newValue;
      }

      setData([...data]);
      onChangeData?.(ri, ci, _values, column);
    },
    [data, onChangeData, setData],
  );

  const handleMoveEditFocus = React.useCallback(
    async (rowIndex: number, columnIndex: number, columnDirection?: MoveDirection, rowDirection?: MoveDirection) => {
      if (columnDirection && rowDirection) {
        let _ci = columnIndex + DIRC_MAP[columnDirection];
        let _ri = rowIndex + DIRC_MAP[rowDirection];

        if (_ci > columns.length - 1) _ci = 0;
        if (_ri > data.length - 1) _ri = 0;

        setEditItem(_ri, _ci);
      } else {
        setEditItem(-1, -1);
      }
    },
    [columns.length, data.length, setEditItem],
  );

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
      setData([...data]);
    },
    [data, selectedKeyMap, setData, setSelectedKeys],
  );

  const handleChangeCheckedRadio = React.useCallback(
    async (index: number) => {
      selectedKeyMap.clear();
      selectedKeyMap.set(index, true);
      setSelectedKeys([index]);
      data.forEach((n, idx) => {
        n.checked = idx === index;
      });
      setData([...data]);
    },
    [data, selectedKeyMap, setData, setSelectedKeys],
  );

  const handleReorderData = React.useCallback(
    (fromIndex: number, toIndex: number) => {
      // fromIndex에 있는 datad의 item을 toIndex로 이동
      const item = data[fromIndex];

      data[fromIndex].status = AXDGDataItemStatus.edit;
      // data[fromIndex].meta = {
      //   ...data[fromIndex].meta,
      //
      //   reorder: {
      //     originalIndex: data[fromIndex].meta?.reorder ? data[fromIndex].meta?.reorder.originalIndex : fromIndex,
      //     fromIndex,
      //     toIndex,
      //   },
      // };

      const newData = [...data];
      newData.splice(fromIndex, 1); // Remove item from original position
      newData.splice(toIndex, 0, item); // Insert item at new position
      setData(newData);

      return reorder?.onReorder?.(newData);
    },
    [data, reorder, setData],
  );

  const rollbackData = React.useCallback(() => {
    setData([...data]);
  }, [data, setData]);

  return {
    dataSet,
    setItemValue,
    handleMoveEditFocus,
    handleChangeChecked,
    handleChangeCheckedRadio,
    handleReorderData,
    rollbackData,
  };
}
