import React from 'react';
import createContext from 'zustand/context';
import { StoreApi } from 'zustand';

type Direction = 'left' | 'center' | 'right';
type Size = 'small' | 'medium' | 'large';

export interface RFTableColumn<T> {
  key: string | string[];
  label: string;
  width: number;
  align?: Direction;
  sortDisable?: boolean;
  className?: string;
  itemRender?: (item: T) => React.ReactNode;
}

export interface RFTableColumnGroup {
  label: string;
  colspan: number;
  align?: Direction;
}

export type RFTableDataItem<T> = {
  values: T;
  status?: string;
  parentItemIndex?: number;
};

export interface RFTablePage {
  currentPage: number;
  pageSize?: number;
  totalPages: number;
  totalElements?: number;
  loading?: boolean;
  onChange?: (currentPage: number, pageSize?: number) => void;
  displayPaginationLength?: number;
  statusRender?: () => void;
  paginationRender?: () => void;
}

export interface RFTableRowSelection {
  selectedIds: number[];
  onChange: (selectedKeys: number[], selectedAll?: SelectedAll) => void;
}

export interface RFTableSortParam {
  key?: string;
  index?: number;
  orderBy: 'asc' | 'desc';
}

export interface RFTableSortInfo {
  multiSort?: boolean;
  sortParams: RFTableSortParam[];
  onChange: (sortParams: RFTableSortParam[]) => void;
}

export interface RFTableClickParams<T> {
  itemIndex: number;
  columnIndex: number;
  item: T;
  column: RFTableColumn<T>;
}

export interface RFTableProps<T> {
  width: number;
  height: number;
  headerHeight?: number;
  footerHeight?: number;
  itemHeight?: number;
  itemPadding?: number;
  columns: RFTableColumn<T>[];
  columnsGroup?: RFTableColumnGroup[];
  onChangeColumns?: (columnIndex: number, width: number, columns: RFTableColumn<T>[]) => void;
  frozenColumnIndex?: number;
  data: RFTableDataItem<T>[];

  page?: RFTablePage;
  enableLoadMore?: boolean;
  onLoadMore?: (params: { scrollLeft: number; scrollTop: number }) => void;
  endLoadMoreRender?: () => React.ReactNode;

  className?: string;
  style?: React.CSSProperties;
  loading?: boolean;
  spinning?: boolean;

  scrollTop?: number;
  scrollLeft?: number;

  rowSelection?: RFTableRowSelection;
  sort?: RFTableSortInfo;
  onClick?: (params: RFTableClickParams<T>) => void;

  msg?: {
    emptyList?: string;
  };
}

export type SelectedAll = true | false | 'indeterminate';

export interface AppModel<T> extends RFTableProps<T> {
  initialized: boolean;
  headerHeight: number;
  footerHeight: number;
  itemHeight: number;
  itemPadding: number;
  frozenColumnIndex: number;
  frozenColumnsWidth: number;
  frozenColumnsGroup: RFTableColumnGroup[];
  columnsGroup: RFTableColumnGroup[];
  columnResizing: boolean;
  containerBorderWidth: number;
  contentBodyHeight: number;
  displayItemCount: number;
  scrollTop: number;
  scrollLeft: number;
  selectedIdsMap: Map<number, any>;
  selectedAll: SelectedAll;
  sortParams: Record<string, RFTableSortParam>;
  displayPaginationLength: number;
  hoverItemIndex?: number;
  loading: boolean;
}

export interface AppActions<T> {
  setInitialized: (initialized: boolean) => void;
  setScrollTop: (scrollTop: number) => void;
  setScrollLeft: (scrollLeft: number) => void;
  setScroll: (scrollTop: number, scrollLeft: number) => void;
  setData: (data: RFTableDataItem<T>[]) => void;
  setSelectedIds: (ids: number[]) => void;
  setSelectedAll: (selectedAll: SelectedAll) => void;
  setColumnWidth: (columnIndex: number, width?: number) => void;
  setColumnResizing: (columnResizing: boolean) => void;
  toggleColumnSort: (columnIndex: number) => void;
  setPage: (page: RFTablePage) => void;
  setHoverItemIndex: (hoverItemIndex?: number) => void;
  handleClick: (itemIndex: number, columnIndex: number) => void;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setContentBodyHeight: (contentBodyHeight: number) => void;
  setDisplayItemCount: (displayItemCount: number) => void;
  setLoading: (loading: boolean) => void;
  setSpinning: (spinning: boolean) => void;
  setHeaderHeight: (headerHeight: number) => void;
  setFooterHeight: (footerHeight: number) => void;
  setItemHeight: (itemHeight: number) => void;
  setItemPadding: (itemPadding: number) => void;
  setFrozenColumnIndex: (frozenColumnIndex: number) => void;
}

export interface AppStore<T = Record<string, any>> extends AppModel<T>, AppActions<T> {}

export type ZustandSetter<T> = (partial: Partial<T>, replace?: boolean | undefined) => void;
export type ZustandGetter<T> = () => T;
export type StoreActions = <T>(set: ZustandSetter<AppModel<T>>, get: ZustandGetter<AppModel<T>>) => AppActions<T>;
