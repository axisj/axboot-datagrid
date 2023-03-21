import * as React from 'react';
import { AppStoreProvider, getAppStoreActions } from './store';
import Table from './components/Table';
import { AppStore, AXFDGColumnGroup, AXFDGProps, AXFDGSortParam } from './types';
import create from 'zustand';
import { getCellValueByRowKey, getFrozenColumnsWidth } from './utils';

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

  const frozenColumnsWidth = React.useMemo(
    () =>
      getFrozenColumnsWidth({
        showLineNumber,
        rowChecked,
        itemHeight,
        frozenColumnIndex,
        columns,
        dataLength: data.length,
      }),
    [columns, frozenColumnIndex, itemHeight, showLineNumber, rowChecked, data.length],
  );

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

  const displayPaginationLength = React.useMemo(() => {
    return page?.displayPaginationLength ?? 5;
  }, [page?.displayPaginationLength]);

  return (
    <AppStoreProvider
      createStore={() =>
        create<AppStore<T>>((set, get) => ({
          initialized: false,
          containerBorderWidth: 1,
          displayPaginationLength,
          width,
          height,
          headerHeight,
          footerHeight,
          itemHeight,
          itemPadding,
          data,
          page,
          columns,
          onChangeColumns,
          columnsGroup,
          columnResizing: false,
          frozenColumnIndex,
          scrollTop,
          scrollLeft,
          contentBodyHeight: 0,
          displayItemCount: 0,
          className,
          rowChecked,
          checkedIndexesMap,
          checkedAll: false,
          frozenColumnsWidth,
          sort,
          sortParams,
          onClick,
          loading,
          spinning,
          rowKey,
          selectedRowKey,
          editable,
          onChangeData,
          showLineNumber,
          ...getAppStoreActions(set, get),
        }))
      }
    >
      <Table
        {...{
          columns,
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
          sortParams,
          page,
          data,
          onClick,
          rowKey,
          selectedRowKey,
          editable,
          onChangeData,
          showLineNumber,
        }}
      />
    </AppStoreProvider>
  );
}
