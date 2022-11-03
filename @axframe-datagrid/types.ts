import React from 'react';

type Direction = 'left' | 'center' | 'right';

export interface AXFDGColumn<T> {
  key: string | string[];
  label: string;
  width: number;
  align?: Direction;
  sortDisable?: boolean;
  className?: string;
  itemRender?: (item: T) => React.ReactNode;
}

export interface AXFDGColumnGroup {
  label: string;
  colspan: number;
  align?: Direction;
}

export type AXFDGDataItem<T> = {
  values: T;
  status?: string;
  parentItemIndex?: number;
};

export interface AXFDGPage {
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

export interface AXFDGRowSelection {
  selectedIds: number[];
  onChange: (selectedKeys: number[], selectedAll?: SelectedAll) => void;
}

export interface AXFDGSortParam {
  key?: string;
  index?: number;
  orderBy: 'asc' | 'desc';
}

export interface AXFDGSortInfo {
  multiSort?: boolean;
  sortParams: AXFDGSortParam[];
  onChange: (sortParams: AXFDGSortParam[]) => void;
}

export interface AXFDGClickParams<T> {
  itemIndex: number;
  columnIndex: number;
  item: T;
  column: AXFDGColumn<T>;
}

export interface AXFDGProps<T> {
  width: number;
  height: number;
  headerHeight?: number;
  footerHeight?: number;
  itemHeight?: number;
  itemPadding?: number;
  columns: AXFDGColumn<T>[];
  columnsGroup?: AXFDGColumnGroup[];
  onChangeColumns?: (columnIndex: number, width: number, columns: AXFDGColumn<T>[]) => void;
  frozenColumnIndex?: number;
  data?: AXFDGDataItem<T>[];

  page?: AXFDGPage;
  enableLoadMore?: boolean;
  onLoadMore?: (params: { scrollLeft: number; scrollTop: number }) => void;
  endLoadMoreRender?: () => React.ReactNode;

  className?: string;
  style?: React.CSSProperties;
  loading?: boolean;
  spinning?: boolean;

  scrollTop?: number;
  scrollLeft?: number;

  rowSelection?: AXFDGRowSelection;
  sort?: AXFDGSortInfo;
  onClick?: (params: AXFDGClickParams<T>) => void;

  msg?: {
    emptyList?: string;
  };
}

export type SelectedAll = true | false | 'indeterminate';

export interface AppModel<T> extends AXFDGProps<T> {
  initialized: boolean;
  headerHeight: number;
  footerHeight: number;
  itemHeight: number;
  itemPadding: number;
  frozenColumnIndex: number;
  frozenColumnsWidth: number;
  frozenColumnsGroup: AXFDGColumnGroup[];
  columnsGroup: AXFDGColumnGroup[];
  data: AXFDGDataItem<T>[];
  columnResizing: boolean;
  containerBorderWidth: number;
  contentBodyHeight: number;
  displayItemCount: number;
  scrollTop: number;
  scrollLeft: number;
  selectedIdsMap: Map<number, any>;
  selectedAll: SelectedAll;
  sortParams: Record<string, AXFDGSortParam>;
  displayPaginationLength: number;
  hoverItemIndex?: number;
  loading: boolean;
}

export interface AppActions<T> {
  setInitialized: (initialized: boolean) => void;
  setScrollTop: (scrollTop: number) => void;
  setScrollLeft: (scrollLeft: number) => void;
  setScroll: (scrollTop: number, scrollLeft: number) => void;
  setColumns: (columns: AXFDGColumn<T>[]) => void;
  setColumnsGroup: (columnsGroup: AXFDGColumnGroup[]) => void;
  setData: (data: AXFDGDataItem<T>[]) => void;
  setSelectedIds: (ids: number[]) => void;
  setSelectedAll: (selectedAll: SelectedAll) => void;
  setColumnWidth: (columnIndex: number, width?: number) => void;
  setColumnResizing: (columnResizing: boolean) => void;
  toggleColumnSort: (columnIndex: number) => void;
  setPage: (page: AXFDGPage) => void;
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
  setSelectedIdsMap: (selectedIdsMap: Map<number, any>) => void;
  setSortParams: (sortParams: Record<string, AXFDGSortParam>) => void;
  setFrozenColumnsWidth: (frozenColumnsWidth: number) => void;
}

export interface AppStore<T = Record<string, any>> extends AppModel<T>, AppActions<T> {}

export type ZustandSetter<T> = (partial: Partial<T>, replace?: boolean | undefined) => void;
export type ZustandGetter<T> = () => T;
export type StoreActions = <T>(set: ZustandSetter<AppModel<T>>, get: ZustandGetter<AppModel<T>>) => AppActions<T>;
