import * as React from 'react';
import Table from './components/Table';
import { AppModelColumn, AppStore, AXFDGProps, AXFDGSortParam } from './types';
import { getCellValueByRowKey } from './utils';
import { AppStoreProvider } from './store';

export function AXFDataGrid<T = Record<string, any>>({
  width,
  height,
  headerHeight = 30,
  footerHeight = 30,
  itemHeight = 15,
  itemPadding = 7,
  columns,
  columnsGroup = [],
  onChangeColumns,
  frozenColumnIndex = 0,
  data = [],
  page,
  scrollTop = 0,
  scrollLeft = 0,
  className,
  rowChecked,
  sort,
  onClick,
  loading = false,
  spinning,
  rowKey,
  selectedRowKey,
  editable,
  onChangeData,
  showLineNumber,
  msg,
  getRowClassName,
  editTrigger = 'click',
  cellMergeOptions,
}: AXFDGProps<T>) {
  const checkedIndexesMap: Map<number, any> = React.useMemo(() => {
    if (rowChecked?.checkedRowKeys && rowKey) {
      const checkedIndexesMap: Map<number, any> = new Map();
      rowChecked.checkedRowKeys.forEach(key => {
        const fIndex = data?.findIndex((item, index, obj) => {
          return getCellValueByRowKey(rowKey, item.values) === key;
        });
        if (fIndex > -1) {
          checkedIndexesMap.set(fIndex, true);
        }
      });
      return checkedIndexesMap;
    }
    if (rowChecked?.checkedIndexes) {
      return new Map(rowChecked?.checkedIndexes.map(id => [id, true]));
    }
    return new Map();
  }, [data, rowChecked?.checkedIndexes, rowChecked?.checkedRowKeys, rowKey]);

  const sortParams = React.useMemo(() => {
    if (sort) {
      return sort.sortParams.reduce((acc, cur, currentIndex) => {
        cur.index = currentIndex;
        if (cur.key) acc[cur.key] = cur;
        return acc;
      }, {} as Record<string, AXFDGSortParam>);
    }

    return {};
  }, [sort]);

  const computedColumns: AppModelColumn<T>[] = React.useMemo(() => {
    let left = 0;
    let prevWidth = 0;

    return [
      ...columns.slice(0, frozenColumnIndex).map(column => {
        return {
          ...column,
          left: -1,
        };
      }),
      ...columns.slice(frozenColumnIndex).map(column => {
        left += prevWidth;
        prevWidth = column.width;
        return {
          ...column,
          left,
        };
      }),
    ];
  }, [columns, frozenColumnIndex]);

  return (
    <AppStoreProvider>
      <Table
        {...{
          columns: computedColumns,
          columnsGroup,
          onChangeColumns,
          width,
          height,
          loading,
          spinning,
          scrollLeft,
          scrollTop,
          headerHeight,
          footerHeight,
          itemHeight,
          itemPadding,
          frozenColumnIndex,
          rowChecked,
          checkedIndexesMap,
          sort,
          sortParams,
          page,
          data,
          onClick,
          rowKey,
          selectedRowKey,
          editable,
          editTrigger,
          onChangeData,
          showLineNumber,
          msg,
          getRowClassName,
          cellMergeOptions,
        }}
      />
    </AppStoreProvider>
  );
}
