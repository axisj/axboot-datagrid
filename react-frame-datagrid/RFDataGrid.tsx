import * as React from 'react';
import { AppStoreProvider, getAppStoreActions } from './store';
import Table from './components/Table';
import { AppStore, RFDGColumnGroup, RFDGProps, RFDGSortParam } from './types';
import create from 'zustand';
import { getFrozenColumnsWidth } from './utils';

export function RFDataGrid<T = Record<string, any>>({
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
  rowSelection,
  sort,
  onClick,
  loading = false,
  spinning,
}: RFDGProps<T>) {
  const selectedIdsMap: Map<number, any> = React.useMemo(
    () => new Map(rowSelection?.selectedIds.map(id => [id, true])),
    [rowSelection?.selectedIds],
  );

  const columnGroups = React.useMemo(() => {
    const leftGroups: RFDGColumnGroup[] = [];
    const rightGroups: RFDGColumnGroup[] = [];
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
        rowSelection,
        itemHeight,
        frozenColumnIndex,
        columns,
      }),
    [columns, frozenColumnIndex, itemHeight, rowSelection],
  );

  const sortParams = React.useMemo(() => {
    if (sort) {
      return sort.sortParams.reduce((acc, cur, currentIndex) => {
        cur.index = currentIndex;
        if (cur.key) acc[cur.key] = cur;
        return acc;
      }, {} as Record<string, RFDGSortParam>);
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
          rowSelection,
          selectedIdsMap,
          selectedAll: false,
          frozenColumnsWidth,
          sort,
          sortParams,
          onClick,
          loading,
          spinning,
          ...getAppStoreActions(set, get),
        }))
      }
    >
      <Table
        {...{
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
          selectedIdsMap,
          sortParams,
          page,
          data,
        }}
      />
    </AppStoreProvider>
  );
}
