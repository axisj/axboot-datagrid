import * as React from 'react';
import { createContext, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { AppStore, CheckedAll } from '../types';
import { getCellValueByRowKey, getFrozenColumnsWidth } from '../utils';

const StoreContext = createContext(null);

// @ts-ignore
export function AppStoreProvider({ children }) {
  const storeRef = useRef<any>();
  if (!storeRef.current) {
    storeRef.current = createStore<AppStore>((set, get) => ({
      initialized: false,
      width: 0,
      height: 0,
      headerHeight: 30,
      footerHeight: 30,
      itemHeight: 15,
      itemPadding: 7,
      frozenColumnIndex: 0,
      columns: [],
      columnsGroup: [],
      data: [],
      columnResizing: false,
      containerBorderWidth: 1,
      contentBodyHeight: 0,
      displayItemCount: 0,
      scrollTop: 0,
      scrollLeft: 0,
      checkedIndexesMap: new Map(),
      checkedAll: false,
      displayPaginationLength: 0,
      loading: false,
      editTrigger: 'dblclick',
      cellMergeOptions: undefined,
      variant: 'default',
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
            checkedRowKeys.push(getCellValueByRowKey(rowKey, item.values));
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
            v.checked = true;
            checkedIndexesMap.set(i, true);
            checkedIndexes.push(i);
            if (rowKey) {
              checkedRowKeys.push(getCellValueByRowKey(rowKey, v.values));
            }
          });
          set({ checkedIndexesMap, checkedAll, data: [...get().data] });
          get().rowChecked?.onChange(checkedIndexes, checkedRowKeys, checkedAll);
        } else {
          get().data.forEach((v, i) => {
            v.checked = false;
          });
          set({ checkedIndexesMap: new Map(), checkedAll, data: [...get().data] });
          get().rowChecked?.onChange([], [], checkedAll);
        }
      },
      setRowChecked: rowChecked => {
        set({ rowChecked });
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

            let left = columns[columnIndex].left;

            for (let i = columnIndex + 1; i < columns.length; i++) {
              left += columns[i - 1].width;
              if (i > frozenColumnIndex) {
                columns[i].left = left;
              }
            }

            if (columnIndex < frozenColumnIndex) {
              const frozenColumnsWidth = getFrozenColumnsWidth({
                showLineNumber: get().showLineNumber,
                rowChecked: get().rowChecked,
                itemHeight: get().itemHeight,
                frozenColumnIndex: get().frozenColumnIndex,
                columns,
                dataLength: get().data.length,
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
        const sortParams = get().sortParams ?? {};

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
          Object.values(sortParams).sort((a, b) => {
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
      setSort: sort => set({ sort }),
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
      setShowLineNumber: showLineNumber => set({ showLineNumber }),
      setMsg: msg => set({ msg }),
      setDisplayPaginationLength: length => set({ displayPaginationLength: length }),
      setRowClassName: getRowClassName => set({ getRowClassName }),
      setEditTrigger: editTrigger => set({ editTrigger }),
      setCellMergeOptions: cellMergeOptions => set({ cellMergeOptions }),
      setVariant: variant => set({ variant }),
    }));
  }
  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
}

// @ts-ignore
export function useAppStore<T>(selector: (state: AppStore) => T) {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('Missing StoreProvider');
  }
  return useStore(store, selector);
}
