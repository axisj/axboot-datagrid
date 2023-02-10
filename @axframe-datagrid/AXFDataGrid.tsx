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
}: AXFDGProps<T>) {
  const checkedIndexesMap: Map<number, any> = React.useMemo(() => {
    if (rowChecked?.checkedRowKeys && rowKey) {
      const checkedIndexesMap: Map<number, any> = new Map();
      rowChecked.checkedRowKeys.forEach(key => {
        const fIndex = data?.findIndex((value, index, obj) => {
          return getCellValueByRowKey(rowKey, value) === key;
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

  const columnGroups = React.useMemo(() => {
    const leftGroups: AXFDGColumnGroup[] = [];
    const rightGroups: AXFDGColumnGroup[] = [];
    const cgs = columnsGroup
      ?.map(({ label, align, colspan }, groupIndex) => {
        return Array.from({ length: colspan }).map((_, i) => ({
          groupIndex,
          label,
          align,
        }));
      })
      .flat();

    cgs.splice(0, frozenColumnIndex).forEach(cg => {
      if (leftGroups[cg.groupIndex]) {
        leftGroups[cg.groupIndex].colspan += 1;
      } else {
        leftGroups[cg.groupIndex] = {
          label: cg.label,
          align: cg.align,
          colspan: 1,
        };
      }
    });

    cgs.forEach(cg => {
      if (rightGroups[cg.groupIndex]) {
        rightGroups[cg.groupIndex].colspan += 1;
      } else {
        rightGroups[cg.groupIndex] = {
          label: cg.label,
          align: cg.align,
          colspan: 1,
        };
      }
    });

    return {
      leftGroups,
      rightGroups: rightGroups.filter(Boolean),
    };
  }, [columnsGroup, frozenColumnIndex]);

  const frozenColumnsWidth = React.useMemo(
    () =>
      getFrozenColumnsWidth({
        rowChecked,
        itemHeight,
        frozenColumnIndex,
        columns,
      }),
    [columns, frozenColumnIndex, itemHeight, rowChecked],
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
          frozenColumnsGroup: columnGroups.leftGroups,
          columnsGroup: columnGroups.rightGroups,
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
          ...getAppStoreActions(set, get),
        }))
      }
    >
      <Table
        {...{
          columns,
          columnsGroup,
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
          checkedIndexesMap,
          sortParams,
          page,
          data,
          onClick,
          rowKey,
          selectedRowKey,
          editable,
          onChangeData,
        }}
      />
    </AppStoreProvider>
  );
}
