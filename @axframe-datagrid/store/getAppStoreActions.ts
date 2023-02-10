import { CheckedAll, StoreActions } from '../types';
import { getCellValueByRowKey, getFrozenColumnsWidth } from '../utils';

export const getAppStoreActions: StoreActions = (set, get) => ({
  setInitialized: initialized => set({ initialized }),
  setScrollTop: scrollTop => set({ scrollTop }),
  setScrollLeft: scrollLeft => set({ scrollLeft }),
  setScroll: (scrollTop, scrollLeft) => set({ scrollTop, scrollLeft }),
  setColumns: columns => set({ columns }),
  setColumnsGroup: columnsGroup => set({ columnsGroup }),
  setData: data => set({ data }),
  setCheckedIndexes: keys => {
    const rowKey = get().rowKey;
    const data = get().data;
    const checkedIndexesMap = get().checkedIndexesMap;
    const checkedIndexes: number[] = [];
    const checkedRowKeys: (string | number)[] = [];

    checkedIndexesMap.clear();
    keys.forEach(key => checkedIndexesMap.set(key, true));
    keys.forEach(key => {
      checkedIndexesMap.set(key, true);
      const item = data[key];
      checkedIndexes.push(key);
      if (rowKey) {
        checkedRowKeys.push(getCellValueByRowKey(rowKey, item));
      }
    });

    const checkedAll: CheckedAll =
      checkedIndexesMap.size > 0 && checkedIndexesMap.size !== get().data.length
        ? 'indeterminate'
        : checkedIndexesMap.size !== 0;

    set({ checkedIndexesMap: new Map([...checkedIndexesMap]), checkedAll });
    get().rowChecked?.onChange(checkedIndexes, checkedRowKeys, checkedAll);
  },
  setCheckedAll: checkedAll => {
    const rowKey = get().rowKey;
    if (checkedAll === true) {
      const checkedIndexesMap: Map<number, any> = new Map();
      const checkedIndexes: number[] = [];
      const checkedRowKeys: (string | number)[] = [];
      get().data.forEach((v, i) => {
        checkedIndexesMap.set(i, true);
        checkedIndexes.push(i);
        if (rowKey) {
          checkedRowKeys.push(getCellValueByRowKey(rowKey, v));
        }
      });
      set({ checkedIndexesMap, checkedAll });
      get().rowChecked?.onChange(checkedIndexes, checkedRowKeys, checkedAll);
    } else {
      set({ checkedIndexesMap: new Map(), checkedAll });
      get().rowChecked?.onChange([], [], checkedAll);
    }
  },
  setCheckedIndexesMap: checkedIndexesMap => {
    const checkedAll: CheckedAll =
      checkedIndexesMap.size > 0 && checkedIndexesMap.size !== get().data.length
        ? 'indeterminate'
        : checkedIndexesMap.size !== 0;

    set({ checkedIndexesMap, checkedAll });
  },
  setColumnWidth: (columnIndex, width) => {
    const columns = get().columns;
    const frozenColumnIndex = get().frozenColumnIndex;
    if (width !== undefined) {
      if (columns[columnIndex]) {
        const _columnWidth = columns[columnIndex].width;
        columns[columnIndex].width = width;

        if (columnIndex < frozenColumnIndex) {
          const frozenColumnsWidth = getFrozenColumnsWidth({
            rowChecked: get().rowChecked,
            itemHeight: get().itemHeight,
            frozenColumnIndex: get().frozenColumnIndex,
            columns,
          });

          if (frozenColumnsWidth + 20 > get().width) {
            columns[columnIndex].width = _columnWidth;
          } else {
            set({ columns: [...columns], frozenColumnsWidth });
          }
        } else {
          set({ columns: [...columns] });
        }
      }
    } else {
      get().onChangeColumns?.(columnIndex, columns[columnIndex].width, columns);
    }
  },
  setColumnResizing: columnResizing => set({ columnResizing }),
  toggleColumnSort: columnIndex => {
    const columns = get().columns;
    const sortParams = get().sortParams;

    const column = columns[columnIndex];
    const columnKey = Array.isArray(column.key) ? column.key.join('.') : column.key;
    //
    if (sortParams[columnKey]) {
      if (sortParams[columnKey].orderBy === 'asc') {
        sortParams[columnKey].orderBy = 'desc';
      } else {
        // remove
        delete sortParams[columnKey];

        Object.values(sortParams)
          .sort((a, b) => {
            return (a.index ?? 0) - (b.index ?? 0);
          })
          .forEach((sortParam, index) => {
            sortParam.index = index;
          });
      }
    } else {
      sortParams[columnKey] = {
        key: columnKey,
        index: Object.keys(sortParams).length,
        orderBy: 'asc',
      };
    }

    set({ sortParams: { ...sortParams } });
    get().sort?.onChange(
      Object.values(get().sortParams).sort((a, b) => {
        return (a.index ?? 0) - (b.index ?? 0);
      }),
    );
  },
  setPage: page => {
    set({ page });
  },
  setHoverItemIndex: hoverItemIndex => set({ hoverItemIndex }),
  handleClick: (index, columnIndex) => {
    get().onClick?.({
      index,
      columnIndex,
      item: get().data[index].values,
      column: get().columns[columnIndex],
    });
  },
  setWidth: width => set({ width }),
  setHeight: height => set({ height }),
  setContentBodyHeight: contentBodyHeight => set({ contentBodyHeight }),
  setDisplayItemCount: displayItemCount => set({ displayItemCount }),
  setLoading: loading => set({ loading }),
  setSpinning: spinning => set({ spinning }),

  setHeaderHeight: headerHeight => set({ headerHeight }),
  setFooterHeight: footerHeight => set({ footerHeight }),
  setItemHeight: itemHeight => set({ itemHeight }),
  setItemPadding: itemPadding => set({ itemPadding }),
  setFrozenColumnIndex: frozenColumnIndex => set({ frozenColumnIndex }),
  setSortParams: sortParams => set({ sortParams }),
  setFrozenColumnsWidth: frozenColumnsWidth => set({ frozenColumnsWidth }),
  setRowKey: rowKey => set({ rowKey }),
  setSelectedRowKey: selectedRowKey => set({ selectedRowKey }),
  setEditable: editable => set({ editable }),
  setEditItem: (index, columnIndex) => {
    set({
      editItemIndex: index,
      editItemColIndex: columnIndex,
    });
  },
  setOnClick: onClick => set({ onClick }),
  setOnChangeColumns: onChangeColumns => set({ onChangeColumns }),
  setOnChangeData: onChangeData => set({ onChangeData }),
  setOnLoadMore: onLoadMore => set({ onLoadMore }),
});
