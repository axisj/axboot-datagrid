import { useAppStore } from '../store';
import * as React from 'react';
import { AXFDGColumn, AXFDGDataItemStatus, DIRC_MAP, MoveDirection } from '../types';

export function useBodyData(startIdx: number, endNumber: number) {
  const columns = useAppStore(s => s.columns);
  const data = useAppStore(s => s.data);
  const dataSet = React.useMemo(() => data.slice(startIdx, endNumber), [data, startIdx, endNumber]);
  const setData = useAppStore(s => s.setData);
  const setEditItem = useAppStore(s => s.setEditItem);
  const selectedKeyMap = useAppStore(s => s.checkedIndexesMap);
  const setSelectedKeys = useAppStore(s => s.setCheckedIndexes);
  const onChangeData = useAppStore(s => s.onChangeData);

  const setItemValue = React.useCallback(
    async (ri: number, ci: number, column: AXFDGColumn<any>, newValue: any) => {
      if (data[ri].status !== AXFDGDataItemStatus.new) {
        data[ri].status = AXFDGDataItemStatus.edit;
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

  return {
    dataSet,
    setItemValue,
    handleMoveEditFocus,
    handleChangeChecked,
  };
}
