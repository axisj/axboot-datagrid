import React from 'react';

type Direction = 'left' | 'center' | 'right';
type Size = 'small' | 'medium' | 'large';

export interface RFTableColumn<T> {
  key: string | string[];
  label: string;
  width?: number;
  align?: Direction;
  itemRender?: (item: T) => React.ReactNode;
}

export interface RFTableColumnGroup {
  label: string;
  colspan: number;
  align?: Direction;
}

export type RFTableDataItem = {
  values: Record<string, any>;
  status?: string;
  parentItemIndex?: number;
};

export interface RFTablePage {
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  totalElements?: number;
  loading?: boolean;
  onChange?: (currentPage: number, pageSize?: number) => void;
}

export interface RFTableRowSelection {
  selectedIds: number[];
  onChange: (selectedKeys: number[], selectedAll?: SelectedAll) => void;
}

export interface RFTableProps<T> {
  width: number;
  height: number;
  headerHeight?: number;
  data: RFTableDataItem[];
  columns: RFTableColumn<T>[];
  columnsGroup?: RFTableColumnGroup[];
  frozenColumnIndex?: number;
  itemHeight?: number;
  itemPadding?: number;

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
  msg?: {
    emptyList?: string;
  };
}

export type SelectedAll = true | false | 'indeterminate';

export interface AppModel<T = Record<string, any>> extends RFTableProps<T> {
  headerHeight: number;
  frozenColumnIndex: number;
  frozenColumnsWidth: number;
  frozenColumnsGroup: RFTableColumnGroup[];
  columnsGroup: RFTableColumnGroup[];
  containerBorderWidth: number;
  contentBodyHeight: number;
  displayItemCount: number;
  itemHeight: number;
  itemPadding: number;
  scrollTop: number;
  scrollLeft: number;
  selectedIdsMap: Map<number, any>;
  selectedAll: SelectedAll;
  columnWidths?: number[];
}

export interface AppActions {
  setScrollTop: (scrollTop: number) => void;
  setScrollLeft: (scrollLeft: number) => void;
  setScroll: (scrollTop: number, scrollLeft: number) => void;
  setData: (data: RFTableDataItem[]) => void;
  setSelectedIds: (ids: number[]) => void;
  setSelectedAll: (selectedAll: SelectedAll) => void;
  setFrozenColumnsWidth: (frozenColumnsWidth: number) => void;
  setColumnWidths: (widths: number[]) => void;
}
