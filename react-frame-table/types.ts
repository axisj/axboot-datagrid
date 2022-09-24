import React from 'react';

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
}

export interface AppActions<T> {
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
}
